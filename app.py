from flask import Flask, render_template, redirect, url_for, jsonify, request, flash
import os
import json
import sqlite3
import subprocess
import glob
import csv
import io
import uuid
import datetime
from werkzeug.utils import secure_filename
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

app = Flask(__name__, static_url_path='')
app.secret_key = os.getenv("SECRET_KEY", "financial_data_pipeline_secret_key")

# Configure upload folder
UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'csv', 'json', 'xlsx', 'xls'}
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

@app.route('/favicon.ico')
def favicon():
    return app.send_static_file('favicon.ico')

@app.route('/')
def index():
    """
    Render the welcome page.
    """
    return render_template('welcome.html')

@app.route('/welcome')
def welcome():
    """
    Alternative route to the welcome page.
    """
    return render_template('welcome.html')

@app.route('/about')
def about():
    """
    Render the about page.
    """
    return render_template('about.html')

@app.route('/upload')
def upload():
    """
    Render the upload page for user data.
    """
    return render_template('upload.html')

@app.route('/dashboard')
def dashboard():
    """
    Render the dashboard page with the current pipeline status, data samples, and run history.
    Also includes links to welcome and about pages for easy navigation.
    """
    # Read status from status.txt
    status_message = "No pipeline runs recorded yet"
    
    if os.path.exists("status.txt"):
        try:
            with open("status.txt", "r") as f:
                content = f.read().strip()
                if content:
                    status_message = content
        except Exception as e:
            status_message = f"Error reading status: {str(e)}"
    
    # Get raw data sample
    raw_data_sample = get_raw_data_sample()
    
    # Get standardized data sample
    standardized_data_sample = get_standardized_data_sample()
    
    # Get pipeline run history
    pipeline_history = get_pipeline_run_history()
    
    return render_template('dashboard.html',
                          status_message=status_message,
                          raw_data_sample=raw_data_sample,
                          standardized_data_sample=standardized_data_sample,
                          pipeline_history=pipeline_history)

def get_raw_data_sample(num_records=3):
    """
    Get a sample of raw data from the most recent file in raw_data directory.
    
    Args:
        num_records: Number of records to retrieve
        
    Returns:
        JSON string of raw data sample
    """
    try:
        # Find the most recent raw data file
        raw_data_files = glob.glob("raw_data/*.json")
        
        if not raw_data_files:
            return json.dumps([{"error": "No raw data files found"}], indent=2)
        
        # Sort by modification time (newest first)
        latest_file = max(raw_data_files, key=os.path.getmtime)
        
        # Read the file
        with open(latest_file, 'r') as f:
            data = json.load(f)
        
        # Get a sample (first few records)
        sample = data[:min(num_records, len(data))]
        
        return json.dumps(sample, indent=2)
    except Exception as e:
        return json.dumps([{"error": f"Error loading raw data: {str(e)}"}], indent=2)

def get_standardized_data_sample(num_records=3):
    """
    Get a sample of standardized data from the database.
    
    Args:
        num_records: Number of records to retrieve
        
    Returns:
        JSON string of standardized data sample
    """
    try:
        # Connect to the database
        conn = sqlite3.connect('data.db')
        conn.row_factory = sqlite3.Row  # This enables column access by name
        cursor = conn.cursor()
        
        # Check if table exists
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='standardized_financial_data'")
        table_exists = cursor.fetchone()
        
        if not table_exists:
            return json.dumps([{"error": "Database table 'standardized_financial_data' does not exist"}], indent=2)
        
        # Get the most recent records
        cursor.execute("""
            SELECT id, date, value, description, data_type
            FROM standardized_financial_data
            ORDER BY date DESC
            LIMIT ?
        """, (num_records,))
        
        # Convert to list of dictionaries
        rows = cursor.fetchall()
        result = [dict(row) for row in rows]
        conn.close()
        
        return json.dumps(result, indent=2)
    except Exception as e:
        return json.dumps([{"error": f"Error loading standardized data: {str(e)}"}], indent=2)

def get_pipeline_run_history(limit=10):
    """
    Get the history of pipeline runs from the database.
    
    Args:
        limit: Maximum number of records to retrieve
        
    Returns:
        List of dictionaries containing pipeline run history
    """
    try:
        # Connect to the database
        conn = sqlite3.connect('data.db')
        conn.row_factory = sqlite3.Row  # This enables column access by name
        cursor = conn.cursor()
        
        # Check if table exists
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='pipeline_runs_history'")
        table_exists = cursor.fetchone()
        
        if not table_exists:
            return []
        
        # Get the most recent pipeline runs
        cursor.execute("""
            SELECT run_id, timestamp, status, records_processed
            FROM pipeline_runs_history
            ORDER BY timestamp DESC
            LIMIT ?
        """, (limit,))
        
        # Convert to list of dictionaries
        rows = cursor.fetchall()
        result = [dict(row) for row in rows]
        conn.close()
        
        return result
    except Exception as e:
        print(f"Error fetching pipeline run history: {str(e)}")
        return []

@app.route('/run_pipeline', methods=['POST'])
def run_pipeline():
    """
    Run the data pipeline as a separate process.
    
    Receives:
        data_type: Type of financial data to fetch (e.g., "Historical Prices", "Income Statement")
        symbol: Company symbol to fetch data for (e.g., "AAPL", "MSFT")
    """
    try:
        # Get data type and symbol from request
        data = request.get_json()
        data_type = data.get('data_type', 'Historical Prices')  # Default to Historical Prices
        symbol = data.get('symbol', 'AAPL')  # Default to AAPL
        
        # Ensure API key is available
        api_key = os.getenv("FMP_API_KEY")
        if not api_key:
            return jsonify({
                "status": "error",
                "message": "Missing API key. Please check your .env file."
            })
        
        # Start the pipeline as a non-blocking subprocess, passing data_type and symbol as arguments
        process = subprocess.Popen(['python', 'main_pipeline.py', '--data_type', data_type, '--symbol', symbol])
        return jsonify({
            "status": "success",
            "message": f"Pipeline started successfully for {symbol} with data type: {data_type}",
            "pid": process.pid
        })
    except Exception as e:
        return jsonify({"status": "error", "message": f"Failed to start pipeline: {str(e)}"})

@app.route('/api/chart_data')
def get_chart_data():
    """
    Get financial data for charts, aggregated by date.
    
    Query Parameters:
        data_type: Type of financial data to retrieve (e.g., "Historical Prices", "Income Statement")
    
    Returns:
        JSON response with dates and values for charting
    """
    try:
        # Get data type from query parameter, default to Historical Prices
        data_type = request.args.get('data_type', 'Historical Prices')
        
        # Connect to the database
        conn = sqlite3.connect('data.db')
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()
        
        # Check if table exists
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='standardized_financial_data'")
        table_exists = cursor.fetchone()
        
        if not table_exists:
            return jsonify({"error": "No data available"})
        
        # Get data aggregated by date for the specified data type
        cursor.execute("""
            SELECT date,
                   SUM(value) as total_value,
                   COUNT(*) as transaction_count,
                   AVG(value) as average_value
            FROM standardized_financial_data
            WHERE data_type = ?
            GROUP BY date
            ORDER BY date ASC
        """, (data_type,))
        
        rows = cursor.fetchall()
        
        # Get data by description type for pie chart, filtered by data_type
        cursor.execute("""
            SELECT description,
                   SUM(value) as total_value,
                   COUNT(*) as count
            FROM standardized_financial_data
            WHERE data_type = ?
            GROUP BY description
            ORDER BY total_value DESC
        """, (data_type,))
        
        description_data = cursor.fetchall()
        
        # Format the data for charts
        dates = []
        values = []
        counts = []
        averages = []
        
        for row in rows:
            dates.append(row['date'])
            values.append(float(row['total_value']))
            counts.append(int(row['transaction_count']))
            averages.append(float(row['average_value']))
        
        # Format description data for pie chart
        description_labels = []
        description_values = []
        
        for row in description_data:
            description_labels.append(row['description'])
            description_values.append(float(row['total_value']))
        
        conn.close()
        
        return jsonify({
            "dates": dates,
            "values": values,
            "counts": counts,
            "averages": averages,
            "description_labels": description_labels,
            "description_values": description_values
        })
    except Exception as e:
        return jsonify({"error": str(e)})

@app.route('/api/historical_chart_data/<symbol>')
def get_historical_chart_data(symbol):
    """
    Get financial data for a specific symbol.
    
    Args:
        symbol: Stock symbol (e.g., 'AAPL')
        
    Query Parameters:
        data_type: Type of financial data to retrieve (e.g., "Historical Prices", "Income Statement")
        start_date: Optional start date filter (YYYY-MM-DD)
        end_date: Optional end date filter (YYYY-MM-DD)
        limit: Maximum number of data points to return (default: 500)
        
    Returns:
        JSON response with dates and values for charting
    """
    try:
        # Get query parameters
        data_type = request.args.get('data_type', 'Historical Prices')
        start_date = request.args.get('start_date')
        end_date = request.args.get('end_date')
        limit = request.args.get('limit', 500, type=int)
        
        # Connect to the database
        conn = sqlite3.connect('data.db')
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()
        
        # Check if table exists
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='standardized_financial_data'")
        table_exists = cursor.fetchone()
        
        if not table_exists:
            return jsonify({
                "error": "No data available",
                "symbol": symbol,
                "data_type": data_type,
                "dates": [],
                "values": []
            })
        
        # Build the query based on filters
        query = """
            SELECT date, value, data_type
            FROM standardized_financial_data
            WHERE description = ? AND data_type = ?
        """
        params = [symbol, data_type]
        
        # Add date filters if provided
        if start_date:
            query += " AND date >= ?"
            params.append(start_date)
        
        if end_date:
            query += " AND date <= ?"
            params.append(end_date)
        
        # Add ordering and limit
        query += " ORDER BY date ASC"
        
        if limit:
            query += " LIMIT ?"
            params.append(limit)
        
        # Execute the query
        cursor.execute(query, params)
        rows = cursor.fetchall()
        
        # If no exact match, try with just the symbol
        if not rows:
            fallback_query = """
                SELECT date, value, data_type
                FROM standardized_financial_data
                WHERE description = ?
            """
            fallback_params = [symbol]
            
            if start_date:
                fallback_query += " AND date >= ?"
                fallback_params.append(start_date)
            
            if end_date:
                fallback_query += " AND date <= ?"
                fallback_params.append(end_date)
            
            fallback_query += " ORDER BY date ASC"
            
            if limit:
                fallback_query += " LIMIT ?"
                fallback_params.append(limit)
            
            cursor.execute(fallback_query, fallback_params)
            rows = cursor.fetchall()
        
        # If still no match, try a partial match
        if not rows:
            partial_query = """
                SELECT date, value, data_type
                FROM standardized_financial_data
                WHERE description LIKE ?
            """
            partial_params = [f"%{symbol}%"]
            
            if start_date:
                partial_query += " AND date >= ?"
                partial_params.append(start_date)
            
            if end_date:
                partial_query += " AND date <= ?"
                partial_params.append(end_date)
            
            partial_query += " ORDER BY date ASC"
            
            if limit:
                partial_query += " LIMIT ?"
                partial_params.append(limit)
            
            cursor.execute(partial_query, partial_params)
            rows = cursor.fetchall()
        
        # Format the data for the chart
        dates = []
        values = []
        chart_data_type = data_type  # Store the actual data type of the returned data
        
        for row in rows:
            dates.append(row['date'])
            values.append(float(row['value']))
            if 'data_type' in row.keys():
                chart_data_type = row['data_type']
        
        # Get data statistics for insights
        stats = {}
        if values:
            stats = {
                "count": len(values),
                "min": min(values),
                "max": max(values),
                "avg": sum(values) / len(values),
                "first_date": dates[0] if dates else None,
                "last_date": dates[-1] if dates else None
            }
        
        conn.close()
        
        return jsonify({
            "symbol": symbol,
            "dates": dates,
            "values": values,
            "data_type": chart_data_type,
            "stats": stats,
            "data_points": len(dates)
        })
    except Exception as e:
        return jsonify({
            "error": str(e),
            "symbol": symbol,
            "data_type": data_type,
            "dates": [],
            "values": []
        })

@app.route('/process_uploaded_data', methods=['POST'])
def process_uploaded_data():
    """
    Process uploaded data from the user.
    
    Receives:
        data: JSON string of processed data
        symbol: Company symbol
        category: Data category
    
    Returns:
        JSON response with processing results
    """
    try:
        # Get data from form
        data_json = request.form.get('data')
        symbol = request.form.get('symbol', '').upper()
        category = request.form.get('category', 'Custom Data')
        
        if not data_json or not symbol:
            return jsonify({
                "status": "error",
                "message": "Missing required data"
            }), 400
        
        # Parse JSON data
        data = json.loads(data_json)
        
        if not data:
            return jsonify({
                "status": "error",
                "message": "No data to process"
            }), 400
        
        # Save raw data to file
        timestamp = datetime.datetime.now().strftime('%Y%m%d_%H%M%S')
        filename = f"{symbol}_{category.lower().replace(' ', '_')}_{timestamp}.json"
        
        # Ensure raw_data directory exists
        os.makedirs("raw_data", exist_ok=True)
        
        # Save to file
        with open(os.path.join("raw_data", filename), 'w') as f:
            json.dump(data, f, indent=2)
        
        # Standardize data
        standardized_data = []
        
        for item in data:
            # Generate a unique ID
            record_id = str(uuid.uuid4())
            
            # Parse date
            try:
                date_str = item.get('date', '')
                # Try different date formats
                date_formats = [
                    "%Y-%m-%d",    # YYYY-MM-DD
                    "%m/%d/%Y",    # MM/DD/YYYY
                    "%d-%b-%Y",    # DD-Mon-YYYY
                    "%b %d, %Y"    # Mon DD, YYYY
                ]
                
                parsed_date = None
                for fmt in date_formats:
                    try:
                        parsed_date = datetime.datetime.strptime(date_str, fmt)
                        break
                    except ValueError:
                        continue
                
                if parsed_date:
                    standardized_date = parsed_date.strftime("%Y-%m-%d")
                else:
                    standardized_date = "1900-01-01"  # Default date
            except Exception:
                standardized_date = "1900-01-01"
            
            # Parse value
            try:
                value_str = item.get('value', '0')
                # Remove currency symbols, commas, etc.
                if isinstance(value_str, str):
                    cleaned_value = ''.join(c for c in value_str if c.isdigit() or c == '.' or c == '-')
                    standardized_value = float(cleaned_value)
                else:
                    standardized_value = float(value_str)
            except Exception:
                standardized_value = 0.0
            
            # Get description
            description = item.get('description', symbol)
            
            # Create standardized record
            standardized_record = {
                "id": record_id,
                "date": standardized_date,
                "value": standardized_value,
                "description": description,
                "data_type": category
            }
            
            standardized_data.append(standardized_record)
        
        # Save to database
        conn = sqlite3.connect('data.db')
        cursor = conn.cursor()
        
        # Create table if it doesn't exist
        cursor.execute('''
        CREATE TABLE IF NOT EXISTS standardized_financial_data (
            id TEXT PRIMARY KEY,
            date TEXT,
            value REAL,
            description TEXT,
            data_type TEXT
        )
        ''')
        
        # Insert records
        for record in standardized_data:
            cursor.execute('''
            INSERT OR REPLACE INTO standardized_financial_data (id, date, value, description, data_type)
            VALUES (?, ?, ?, ?, ?)
            ''', (
                record["id"],
                record["date"],
                record["value"],
                record["description"],
                record["data_type"]
            ))
        
        # Commit changes and close connection
        conn.commit()
        
        # Get record count
        cursor.execute("SELECT COUNT(*) FROM standardized_financial_data")
        total_records = cursor.fetchone()[0]
        
        conn.close()
        
        # Update status
        status_message = f"SUCCESS: {len(standardized_data)} user records processed"
        with open("status.txt", "w") as f:
            timestamp = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            f.write(f"{status_message} at {timestamp}")
        
        # Log pipeline run
        conn = sqlite3.connect('data.db')
        cursor = conn.cursor()
        
        # Create table if it doesn't exist
        cursor.execute('''
        CREATE TABLE IF NOT EXISTS pipeline_runs_history (
            run_id INTEGER PRIMARY KEY AUTOINCREMENT,
            timestamp TEXT,
            status TEXT,
            records_processed INTEGER
        )
        ''')
        
        # Insert record
        timestamp = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        cursor.execute('''
        INSERT INTO pipeline_runs_history (timestamp, status, records_processed)
        VALUES (?, ?, ?)
        ''', (timestamp, "SUCCESS", len(standardized_data)))
        
        conn.commit()
        conn.close()
        
        return jsonify({
            "status": "success",
            "message": f"Successfully processed {len(standardized_data)} records",
            "records_processed": len(standardized_data),
            "total_records": total_records,
            "symbol": symbol,
            "category": category
        })
    except Exception as e:
        return jsonify({
            "status": "error",
            "message": f"Error processing data: {str(e)}"
        }), 500

@app.route('/api/data_types')
def get_data_types():
    """
    Get all available data types from the database.
    
    Returns:
        JSON response with list of available data types
    """
    try:
        # Connect to the database
        conn = sqlite3.connect('data.db')
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()
        
        # Check if table exists
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='standardized_financial_data'")
        table_exists = cursor.fetchone()
        
        if not table_exists:
            return jsonify({"data_types": ["Historical Prices", "Income Statement"]})
        
        # Get distinct data types
        cursor.execute("""
            SELECT DISTINCT data_type
            FROM standardized_financial_data
            ORDER BY data_type
        """)
        
        rows = cursor.fetchall()
        data_types = [row['data_type'] for row in rows]
        
        # If no data types found, return default ones
        if not data_types:
            data_types = ["Historical Prices", "Income Statement"]
            
        conn.close()
        
        return jsonify({
            "data_types": data_types
        })
    except Exception as e:
        return jsonify({"error": str(e), "data_types": ["Historical Prices", "Income Statement"]})

def allowed_file(filename):
    """
    Check if a file has an allowed extension.
    
    Args:
        filename: Name of the file to check
        
    Returns:
        Boolean indicating if the file is allowed
    """
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

if __name__ == '__main__':
    app.run(debug=True)