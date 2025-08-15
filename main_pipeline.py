import datetime
import os
import traceback
import sqlite3
import argparse
from dotenv import load_dotenv
from ingestion_service import generate_mock_financial_data, save_raw_data, fetch_income_statement_from_fmp
from standardization_service import load_raw_data, apply_standardization_rules, load_standardized_data_to_db

# Load environment variables from .env file
load_dotenv()

def update_status(message: str):
    """
    Update the status.txt file with a message.
    
    Args:
        message: Status message to write
    """
    with open("status.txt", "w") as f:
        timestamp = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        f.write(f"{message} at {timestamp}")
    print(message)
    
def log_pipeline_run(status: str, records_processed: int, db_path: str = 'data.db'):
    """
    Log pipeline run details to the database.
    
    Args:
        status: Status of the pipeline run (SUCCESS or FAILURE)
        records_processed: Number of records processed
        db_path: Path to the SQLite database file
    """
    try:
        # Connect to SQLite database
        conn = sqlite3.connect(db_path)
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
        ''', (timestamp, status, records_processed))
        
        # Commit changes and close connection
        conn.commit()
        conn.close()
        
        print(f"Pipeline run logged: {status}, {records_processed} records at {timestamp}")
    except Exception as e:
        print(f"Error logging pipeline run: {str(e)}")

def run_pipeline(data_type: str = "Historical Prices", num_records: int = 100, symbol: str = "AAPL"):
    """
    Run the complete data pipeline.
    
    Args:
        data_type: Type of financial data to fetch ("Historical Prices", "Income Statement", "Revenue", "Expenses")
        num_records: Number of mock records to generate (for Historical Prices)
        symbol: Stock symbol to fetch data for (e.g., "AAPL")
    """
    records_processed = 0
    try:
        print("Starting pipeline...")
        
        # Step 1: Generate and save mock data
        print(f"\n--- Step 1: Data Ingestion for {data_type} ---")
        timestamp = datetime.datetime.now().strftime('%Y%m%d_%H%M%S')
        
        if data_type == "Income Statement":
            # Fetch income statement data
            data = fetch_income_statement_from_fmp(symbol)
            filename = f"{symbol}_{data_type.lower().replace(' ', '_')}_{timestamp}.json"
        elif data_type == "Revenue" or data_type == "Expenses":
            # Generate specialized mock data for Revenue or Expenses
            data = generate_mock_financial_data(num_records, category=data_type)
            filename = f"{symbol}_{data_type.lower().replace(' ', '_')}_{timestamp}.json"
            
            # Ensure the description field is set to the symbol for proper querying
            for record in data:
                record["description"] = symbol
        else:
            # Default to historical prices (mock data)
            data = generate_mock_financial_data(num_records)
            filename = f"{symbol}_{data_type.lower().replace(' ', '_')}_{timestamp}.json"
            
            # Ensure the description field is set to the symbol for proper querying
            for record in data:
                record["description"] = symbol
        
        save_raw_data(data, filename, data_type)
        
        # Step 2: Load, standardize, and save to DB
        print("\n--- Step 2: Data Standardization ---")
        raw_data = load_raw_data(filename)
        standardized_data = apply_standardization_rules(raw_data, data_type)
        
        # Ensure all records have the correct symbol in the description field
        for record in standardized_data:
            if "description" not in record or not record["description"]:
                record["description"] = symbol
        
        load_standardized_data_to_db(standardized_data)
        
        # Set records processed count
        records_processed = len(standardized_data)
        
        # Update status
        status_message = f"SUCCESS: {records_processed} records processed"
        update_status(status_message)
        
        # Log pipeline run
        log_pipeline_run("SUCCESS", records_processed)
        
    except Exception as e:
        error_message = f"FAILURE: {str(e)}"
        print(f"Error in pipeline: {error_message}")
        print(traceback.format_exc())
        update_status(error_message)
        
        # Log pipeline run failure
        log_pipeline_run("FAILURE", records_processed)

if __name__ == "__main__":
    # Parse command line arguments
    parser = argparse.ArgumentParser(description='Run the financial data pipeline')
    parser.add_argument('--data_type', type=str, default="Historical Prices",
                        help='Type of financial data to fetch (Historical Prices or Income Statement)')
    parser.add_argument('--symbol', type=str, default="AAPL",
                        help='Stock symbol to fetch data for (e.g., AAPL)')
    parser.add_argument('--num_records', type=int, default=100,
                        help='Number of records to generate (for Historical Prices)')
    
    args = parser.parse_args()
    
    # Run the pipeline with the specified arguments
    run_pipeline(
        data_type=args.data_type,
        num_records=args.num_records,
        symbol=args.symbol
    )