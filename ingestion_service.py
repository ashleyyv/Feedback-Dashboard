import json
import os
import random
import datetime
import uuid
import requests
import math
from typing import List, Dict, Any, Optional
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

def generate_mock_financial_data(num_records: int, category: str = "Historical Prices") -> list[dict]:
    """
    Generate mock financial data records.
    
    Args:
        num_records: Number of records to generate
        category: Type of financial data to generate ("Historical Prices", "Revenue", "Expenses")
        
    Returns:
        List of dictionaries containing mock financial records
    """
    records = []
    
    # Sample descriptions based on category
    if category == "Revenue":
        descriptions = [
            "Product Sales", "Service Revenue", "Subscription Income",
            "Licensing Fees", "Advertising Revenue"
        ]
        value_range = (100000, 5000000)  # Higher values for revenue
    elif category == "Expenses":
        descriptions = [
            "Operating Expenses", "Marketing Costs", "R&D Expenses",
            "Administrative Costs", "Infrastructure Expenses"
        ]
        value_range = (50000, 2000000)  # Moderate values for expenses
    else:
        # Default to historical prices
        descriptions = [
            "Stock Price", "Market Value", "Trading Price",
            "Share Value", "Equity Price"
        ]
        value_range = (10, 1000)  # Lower values for stock prices
    
    # Date formats - standardize to YYYY-MM-DD for better consistency
    date_formats = [
        "%Y-%m-%d",    # YYYY-MM-DD
    ]
    
    # Generate sequential dates within the last year for better visualization
    end_date = datetime.datetime.now()
    start_date = end_date - datetime.timedelta(days=365)
    date_range = (end_date - start_date).days
    
    # Create evenly distributed dates
    date_step = max(1, date_range // num_records)
    
    for i in range(num_records):
        # Generate sequential date
        days_offset = i * date_step
        current_date = start_date + datetime.timedelta(days=days_offset)
        date_format = date_formats[0]  # Use consistent format
        date_str = current_date.strftime(date_format)
        
        # Generate value with trend and some randomness
        base_value = random.uniform(*value_range)
        
        # Add trend component based on category
        if category == "Revenue":
            # Upward trend for revenue with seasonal variations
            trend_factor = 1.0 + (i / num_records) * 0.5  # 50% growth over the period
            seasonal = 0.2 * math.sin(i * (2 * math.pi / (num_records / 4)))  # Quarterly seasonality
            value = base_value * trend_factor * (1 + seasonal)
        elif category == "Expenses":
            # Slightly upward trend for expenses with less variation
            trend_factor = 1.0 + (i / num_records) * 0.3  # 30% growth over the period
            seasonal = 0.1 * math.sin(i * (2 * math.pi / (num_records / 2)))  # Biannual seasonality
            value = base_value * trend_factor * (1 + seasonal)
        else:
            # More volatile for stock prices with overall upward trend
            trend_factor = 1.0 + (i / num_records) * 0.4  # 40% growth over the period
            volatility = 0.3 * (random.random() - 0.5)  # Random volatility
            value = base_value * trend_factor * (1 + volatility)
        
        # Format with different styles
        if random.choice([True, False]):
            value_str = f"${value:.2f}"
        else:
            value_str = f"{int(value):,}"
        
        # Create record
        record = {
            "id": str(uuid.uuid4()),
            "date": date_str,
            "value": value_str,
            "description": random.choice(descriptions)
        }
        
        records.append(record)
    
    return records

def fetch_income_statement_from_fmp(symbol: str, period: str = 'annual') -> List[Dict[str, Any]]:
    """
    Fetch income statement data from Financial Modeling Prep API.
    
    Args:
        symbol: Stock symbol (e.g., 'AAPL')
        period: Data period ('annual' or 'quarter')
        
    Returns:
        List of dictionaries containing income statement data
    """
    # API key for Financial Modeling Prep from environment variable
    api_key = os.getenv("FMP_API_KEY")
    
    # Check if API key is valid
    if not api_key or api_key in ["your_api_key_here", "test_financial_pipeline_key_123456"]:
        print("Warning: Invalid or missing API key. Using mock data instead.")
        print("Please update your .env file with a valid FMP API key from https://financialmodelingprep.com/developer/docs/pricing")
        return generate_mock_income_statement(symbol, period)
    
    # FMP API endpoint for income statements
    url = f"https://financialmodelingprep.com/api/v3/income-statement/{symbol}?period={period}&apikey={api_key}"
    
    try:
        # Make API request
        response = requests.get(url, timeout=10)
        
        # Check if request was successful
        if response.status_code == 200:
            data = response.json()
            
            # Check if data is empty
            if not data:
                print(f"No income statement data found for symbol: {symbol}")
                # Generate mock income statement data for demo purposes
                return generate_mock_income_statement(symbol, period)
                
            print(f"Successfully fetched income statement data for {symbol}: {len(data)} periods")
            return data
        else:
            print(f"Error fetching income statement data: HTTP {response.status_code}")
            print(f"Response: {response.text}")
            # Generate mock income statement data for demo purposes
            return generate_mock_income_statement(symbol, period)
            
    except Exception as e:
        print(f"Exception while fetching income statement data: {str(e)}")
        # Generate mock income statement data for demo purposes
        return generate_mock_income_statement(symbol, period)

def generate_mock_income_statement(symbol: str, period: str = 'annual') -> List[Dict[str, Any]]:
    """
    Generate mock income statement data for demonstration purposes.
    
    Args:
        symbol: Stock symbol (e.g., 'AAPL')
        period: Data period ('annual' or 'quarter')
        
    Returns:
        List of dictionaries containing mock income statement data
    """
    print(f"Generating mock income statement data for {symbol}")
    
    # Number of periods to generate
    num_periods = 8 if period == 'quarter' else 5
    
    # Base date for the most recent period
    if period == 'quarter':
        # Start from the most recent quarter
        current_date = datetime.datetime.now()
        # Adjust to end of quarter
        month = ((current_date.month - 1) // 3) * 3 + 3
        base_date = datetime.datetime(current_date.year, month, 30)
    else:
        # Start from the most recent year
        current_year = datetime.datetime.now().year
        base_date = datetime.datetime(current_year, 12, 31)
    
    # Generate data for each period
    statements = []
    
    # Base values (in millions)
    base_revenue = random.uniform(5000, 50000)
    base_cost_ratio = random.uniform(0.4, 0.7)  # Cost of revenue as % of revenue
    base_op_expense_ratio = random.uniform(0.1, 0.3)  # Operating expenses as % of revenue
    base_tax_rate = random.uniform(0.15, 0.35)  # Tax rate
    
    # Growth rates
    revenue_growth = random.uniform(0.05, 0.2)  # 5-20% annual growth
    
    for i in range(num_periods):
        # Calculate period date
        if period == 'quarter':
            period_date = base_date - datetime.timedelta(days=90 * i)
        else:
            period_date = base_date.replace(year=base_date.year - i)
        
        date_str = period_date.strftime("%Y-%m-%d")
        
        # Calculate financial metrics with some randomness
        # Revenue decreases as we go back in time
        revenue = base_revenue / ((1 + revenue_growth) ** i)
        
        # Add some random variation
        revenue_variation = random.uniform(0.9, 1.1)
        revenue *= revenue_variation
        
        # Calculate other metrics based on revenue
        cost_of_revenue = revenue * base_cost_ratio * random.uniform(0.9, 1.1)
        gross_profit = revenue - cost_of_revenue
        
        operating_expenses = revenue * base_op_expense_ratio * random.uniform(0.9, 1.1)
        operating_income = gross_profit - operating_expenses
        
        # Other income/expenses (random small value)
        other_income = revenue * random.uniform(-0.05, 0.05)
        
        # Income before tax
        income_before_tax = operating_income + other_income
        
        # Income tax
        income_tax = income_before_tax * base_tax_rate * random.uniform(0.9, 1.1)
        
        # Net income
        net_income = income_before_tax - income_tax
        
        # EBITDA (approximation)
        ebitda = operating_income + (revenue * 0.1)  # Adding estimated depreciation/amortization
        
        # EPS (based on assumed outstanding shares)
        outstanding_shares = random.uniform(1000, 5000)  # In millions
        eps = net_income / outstanding_shares
        
        # Create statement object
        statement = {
            "date": date_str,
            "symbol": symbol,
            "period": period,
            "calendarYear": str(period_date.year),
            "revenue": revenue,
            "costOfRevenue": cost_of_revenue,
            "grossProfit": gross_profit,
            "operatingExpenses": operating_expenses,
            "operatingIncome": operating_income,
            "incomeBeforeTax": income_before_tax,
            "incomeTax": income_tax,
            "netIncome": net_income,
            "ebitda": ebitda,
            "eps": eps
        }
        
        statements.append(statement)
    
    return statements

def save_raw_data(data: List[Dict[str, Any]], filename: str, data_type: str = "Historical Prices"):
    """
    Save generated data to a JSON file in the raw_data directory.
    
    Args:
        data: List of dictionaries containing financial records
        filename: Name of the file to save data to
        data_type: Type of financial data (for logging purposes)
    """
    # Ensure raw_data directory exists
    os.makedirs("raw_data", exist_ok=True)
    
    # Create full path
    file_path = os.path.join("raw_data", filename)
    
    # Save data to JSON file
    with open(file_path, 'w') as f:
        json.dump(data, f, indent=2)
    
    print(f"Saved {len(data)} records of {data_type} data to {file_path}")

if __name__ == "__main__":
    # Test the functions
    print("Testing historical price data generation:")
    mock_data = generate_mock_financial_data(10)
    save_raw_data(mock_data, "test_historical_prices.json", "Historical Prices")
    
    print("\nTesting income statement data fetching:")
    income_data = fetch_income_statement_from_fmp("AAPL")
    if income_data:
        save_raw_data(income_data, "test_income_statement.json", "Income Statement")