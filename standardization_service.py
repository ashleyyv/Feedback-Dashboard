import json
import sqlite3
import datetime
import re
import os

def load_raw_data(filename: str) -> list[dict]:
    """
    Load raw data from a JSON file.
    
    Args:
        filename: Name of the file to load data from
        
    Returns:
        List of dictionaries containing raw financial records
    """
    file_path = os.path.join("raw_data", filename)
    
    with open(file_path, 'r') as f:
        data = json.load(f)
    
    print(f"Loaded {len(data)} records from {file_path}")
    return data

def apply_standardization_rules(raw_records: list[dict], data_type: str = "Historical Prices") -> list[dict]:
    """
    Apply standardization rules to raw financial records.
    
    Args:
        raw_records: List of dictionaries containing raw financial records
        data_type: Type of financial data ("Historical Prices" or "Income Statement")
        
    Returns:
        List of dictionaries containing standardized financial records
    """
    standardized_records = []
    
    # Handle different data types differently
    if data_type == "Income Statement":
        return standardize_income_statement(raw_records, data_type)
    else:
        # Default handling for Historical Prices and other types
        for record in raw_records:
            standardized_record = record.copy()
            
            # Standardize date to YYYY-MM-DD format
            try:
                # Try different date formats
                date_formats = [
                    "%m/%d/%Y",    # MM/DD/YYYY
                    "%Y-%m-%d",    # YYYY-MM-DD
                    "%d-%b-%Y",    # DD-Mon-YYYY
                    "%b %d, %Y"    # Mon DD, YYYY
                ]
                
                parsed_date = None
                for fmt in date_formats:
                    try:
                        parsed_date = datetime.datetime.strptime(record["date"], fmt)
                        break
                    except ValueError:
                        continue
                
                if parsed_date:
                    standardized_record["date"] = parsed_date.strftime("%Y-%m-%d")
                else:
                    print(f"Warning: Could not parse date '{record['date']}' for record {record['id']}")
                    standardized_record["date"] = "1900-01-01"  # Default date for unparseable dates
            except Exception as e:
                print(f"Error standardizing date: {e}")
                standardized_record["date"] = "1900-01-01"
            
            # Standardize value to float
            try:
                value_str = record["value"]
                # Remove currency symbols, commas, etc.
                cleaned_value = re.sub(r'[^\d.]', '', value_str.replace(',', ''))
                standardized_record["value"] = float(cleaned_value)
            except Exception as e:
                print(f"Error standardizing value: {e}")
                standardized_record["value"] = 0.0
            
            # Add data_type to the record
            standardized_record["data_type"] = data_type
            
            standardized_records.append(standardized_record)
    
    print(f"Standardized {len(standardized_records)} records")
    return standardized_records

def standardize_income_statement(raw_records: list[dict], data_type: str) -> list[dict]:
    """
    Apply standardization rules specifically for income statement data.
    
    Args:
        raw_records: List of dictionaries containing raw income statement records
        data_type: Type of financial data (should be "Income Statement")
        
    Returns:
        List of dictionaries containing standardized income statement records
    """
    standardized_records = []
    
    # Income statement data from Financial Modeling Prep has a different structure
    # We need to extract key metrics and create individual records for each
    
    # Define the metrics we want to extract from income statements
    income_metrics = [
        {"key": "revenue", "description": "Revenue"},
        {"key": "operatingExpenses", "description": "Expenses"},
        {"key": "grossProfit", "description": "Profit"},
        {"key": "netIncome", "description": "Net Income"}
    ]
    
    # Process each income statement record
    for statement in raw_records:
        # Extract date (usually in format YYYY-MM-DD)
        try:
            date_str = statement.get("date", statement.get("fillingDate", statement.get("calendarYear", "1900-01-01")))
            # Try to parse the date
            try:
                parsed_date = datetime.datetime.strptime(date_str, "%Y-%m-%d")
            except ValueError:
                # If it's just a year, convert to YYYY-01-01 format
                if re.match(r'^\d{4}$', date_str):
                    parsed_date = datetime.datetime.strptime(f"{date_str}-01-01", "%Y-%m-%d")
                else:
                    print(f"Warning: Could not parse date '{date_str}' for income statement")
                    parsed_date = datetime.datetime.strptime("1900-01-01", "%Y-%m-%d")
                    
            date = parsed_date.strftime("%Y-%m-%d")
        except Exception as e:
            print(f"Error standardizing income statement date: {e}")
            date = "1900-01-01"
        
        # Extract each metric and create a standardized record
        for metric in income_metrics:
            key = metric["key"]
            description = metric["description"]
            
            # Skip if the metric doesn't exist in this statement
            if key not in statement:
                continue
                
            try:
                # Get the value and convert to float
                value = float(statement[key])
                
                # Create a unique ID for this record
                record_id = f"income_{key}_{date}_{hash(str(statement.get('symbol', '')))}"
                
                # Create standardized record
                standardized_record = {
                    "id": record_id,
                    "date": date,
                    "value": value,
                    "description": description,
                    "data_type": data_type
                }
                
                standardized_records.append(standardized_record)
                
            except Exception as e:
                print(f"Error standardizing income statement value for {key}: {e}")
    
    print(f"Standardized {len(standardized_records)} income statement records")
    return standardized_records

def load_standardized_data_to_db(standardized_records: list[dict], db_path: str = 'data.db'):
    """
    Load standardized data into a SQLite database.
    
    Args:
        standardized_records: List of dictionaries containing standardized financial records
        db_path: Path to the SQLite database file
    """
    # Connect to SQLite database (creates it if it doesn't exist)
    conn = sqlite3.connect(db_path)
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
    for record in standardized_records:
        cursor.execute('''
        INSERT OR REPLACE INTO standardized_financial_data (id, date, value, description, data_type)
        VALUES (?, ?, ?, ?, ?)
        ''', (
            record["id"],
            record["date"],
            record["value"],
            record["description"],
            record.get("data_type", "Historical Prices")  # Default to Historical Prices if not specified
        ))
    
    # Commit changes and close connection
    conn.commit()
    print(f"Loaded {len(standardized_records)} records into database {db_path}")
    
    # Verify data was inserted
    cursor.execute("SELECT COUNT(*) FROM standardized_financial_data")
    count = cursor.fetchone()[0]
    print(f"Database now contains {count} records")
    
    conn.close()

if __name__ == "__main__":
    # Test the functions
    raw_data = load_raw_data("test_data.json")
    standardized_data = apply_standardization_rules(raw_data)
    load_standardized_data_to_db(standardized_data)