import json
import uuid
import datetime

# This function takes a Python dictionary and serializes it into a formatted JSON string.
def generate_formatted_json(data):
    """
    Converts a Python dictionary to a formatted JSON string.
    
    Args:
        data (dict): The dictionary to convert.
    
    Returns:
        str: A pretty-printed JSON string.
    """
    return json.dumps(data, indent=4)

# --- Full Dummy Data Structure ---
# This list contains a total of 15 pieces of feedback, designed to be substantial
# enough to test all aspects of your dashboard prototype.

feedback_data = [
    {
        "feedback_id": str(uuid.uuid4()),
        "feedback_channel": "Sales Note",
        "feedback_date": (datetime.date.today() - datetime.timedelta(days=2)).isoformat(),
        "user_id": "Cust_9876",
        "user_segment": "Enterprise",
        "feedback_text": "The new reporting module is too slow when pulling large data sets. The client is considering a competitor if this isn't fixed.",
        "qualitative_tags": ["performance", "reporting", "speed"],
        "quantitative_rating": None,
        "product_area": "Reporting",
        "strategic_pillar": ["Client Retention", "Market Expansion"],
        "customer_sentiment": "Negative",
        "sales_data_value": 150000
    },
    {
        "feedback_id": str(uuid.uuid4()),
        "feedback_channel": "User Research",
        "feedback_date": (datetime.date.today() - datetime.timedelta(days=5)).isoformat(),
        "user_id": "Cust_5432",
        "user_segment": "SMB",
        "feedback_text": "The onboarding wizard was fantastic! I was able to get started without a single support call. Great job!",
        "qualitative_tags": ["onboarding", "UX", "positive"],
        "quantitative_rating": 5,
        "product_area": "Authentication",
        "strategic_pillar": ["User Growth"],
        "customer_sentiment": "Positive",
        "sales_data_value": 5000
    },
    {
        "feedback_id": str(uuid.uuid4()),
        "feedback_channel": "Customer Success Report",
        "feedback_date": (datetime.date.today() - datetime.timedelta(days=1)).isoformat(),
        "user_id": "Cust_1122",
        "user_segment": "Enterprise",
        "feedback_text": "We need better API documentation for our developers. It's difficult to integrate with your system without clear examples.",
        "qualitative_tags": ["API", "integration", "documentation"],
        "quantitative_rating": 2,
        "product_area": "APIs & Integrations",
        "strategic_pillar": ["Client Retention"],
        "customer_sentiment": "Negative",
        "sales_data_value": 75000
    },
    {
        "feedback_id": str(uuid.uuid4()),
        "feedback_channel": "Sales Note",
        "feedback_date": (datetime.date.today() - datetime.timedelta(days=10)).isoformat(),
        "user_id": "Cust_3344",
        "user_segment": "SMB",
        "feedback_text": "A new prospective client asked about support for international currencies. This is a key blocker for closing the deal.",
        "qualitative_tags": ["new feature", "international", "currency"],
        "quantitative_rating": None,
        "product_area": "Billing",
        "strategic_pillar": ["Market Expansion"],
        "customer_sentiment": "Neutral",
        "sales_data_value": 25000
    },
    {
        "feedback_id": str(uuid.uuid4()),
        "feedback_channel": "User Research",
        "feedback_date": (datetime.date.today() - datetime.timedelta(days=3)).isoformat(),
        "user_id": "Cust_007",
        "user_segment": "Enterprise",
        "feedback_text": "The user interface is very clean, but it's hard to find the advanced filter options. They are not intuitive.",
        "qualitative_tags": ["UX", "UI", "filters"],
        "quantitative_rating": 4,
        "product_area": "User Interface",
        "strategic_pillar": ["Client Retention"],
        "customer_sentiment": "Positive",
        "sales_data_value": 120000
    },
    {
        "feedback_id": str(uuid.uuid4()),
        "feedback_channel": "User Research",
        "feedback_date": (datetime.date.today() - datetime.timedelta(days=7)).isoformat(),
        "user_id": "Cust_6789",
        "user_segment": "Enterprise",
        "feedback_text": "I love the new dark mode! It makes working at night so much easier on the eyes. A great new feature.",
        "qualitative_tags": ["UI", "UX", "dark mode"],
        "quantitative_rating": 5,
        "product_area": "User Interface",
        "strategic_pillar": ["User Growth"],
        "customer_sentiment": "Positive",
        "sales_data_value": 110000
    },
    {
        "feedback_id": str(uuid.uuid4()),
        "feedback_channel": "Customer Success Report",
        "feedback_date": (datetime.date.today() - datetime.timedelta(days=4)).isoformat(),
        "user_id": "Cust_2233",
        "user_segment": "SMB",
        "feedback_text": "The billing page is confusing. I can't figure out how to update my payment method. This has been a recurring issue.",
        "qualitative_tags": ["billing", "UX", "payment"],
        "quantitative_rating": 1,
        "product_area": "Billing",
        "strategic_pillar": ["Client Retention"],
        "customer_sentiment": "Negative",
        "sales_data_value": 6000
    },
    {
        "feedback_id": str(uuid.uuid4()),
        "feedback_channel": "Sales Note",
        "feedback_date": (datetime.date.today() - datetime.timedelta(days=12)).isoformat(),
        "user_id": "Cust_4455",
        "user_segment": "Enterprise",
        "feedback_text": "Our client is excited about the customizable dashboard feature, but they are asking if we can add a new widget for real-time market data.",
        "qualitative_tags": ["customization", "dashboard", "new feature"],
        "quantitative_rating": None,
        "product_area": "Reporting",
        "strategic_pillar": ["Market Expansion"],
        "customer_sentiment": "Positive",
        "sales_data_value": 200000
    },
    {
        "feedback_id": str(uuid.uuid4()),
        "feedback_channel": "User Research",
        "feedback_date": (datetime.date.today() - datetime.timedelta(days=8)).isoformat(),
        "user_id": "Cust_7788",
        "user_segment": "SMB",
        "feedback_text": "I'm having trouble with the email notifications. They are not always sent out when a report is completed. This is a critical bug.",
        "qualitative_tags": ["notifications", "bug", "critical"],
        "quantitative_rating": 1,
        "product_area": "APIs & Integrations",
        "strategic_pillar": ["Client Retention"],
        "customer_sentiment": "Negative",
        "sales_data_value": 7500
    },
    {
        "feedback_id": str(uuid.uuid4()),
        "feedback_channel": "Customer Success Report",
        "feedback_date": (datetime.date.today() - datetime.timedelta(days=6)).isoformat(),
        "user_id": "Cust_9900",
        "user_segment": "Enterprise",
        "feedback_text": "The new tutorial videos are very helpful for our new hires. They get up to speed much faster now. Thank you!",
        "qualitative_tags": ["onboarding", "support", "positive"],
        "quantitative_rating": 5,
        "product_area": "Authentication",
        "strategic_pillar": ["User Growth"],
        "customer_sentiment": "Positive",
        "sales_data_value": 150000
    },
    {
        "feedback_id": str(uuid.uuid4()),
        "feedback_channel": "Sales Note",
        "feedback_date": (datetime.date.today() - datetime.timedelta(days=20)).isoformat(),
        "user_id": "Cust_8899",
        "user_segment": "Enterprise",
        "feedback_text": "The client is very happy with the system's performance, but they want to know if we plan to add support for cryptocurrency analysis in the future. This would be a game changer for them.",
        "qualitative_tags": ["new feature", "cryptocurrency", "finance"],
        "quantitative_rating": None,
        "product_area": "Reporting",
        "strategic_pillar": ["Market Expansion"],
        "customer_sentiment": "Positive",
        "sales_data_value": 300000
    },
    {
        "feedback_id": str(uuid.uuid4()),
        "feedback_channel": "User Research",
        "feedback_date": (datetime.date.today() - datetime.timedelta(days=1)).isoformat(),
        "user_id": "Cust_5566",
        "user_segment": "SMB",
        "feedback_text": "I had a great experience with the customer support team. They were very quick and helpful in resolving my issue. It's a huge plus!",
        "qualitative_tags": ["support", "positive", "customer service"],
        "quantitative_rating": 5,
        "product_area": "Customer Support",
        "strategic_pillar": ["Client Retention"],
        "customer_sentiment": "Positive",
        "sales_data_value": 8000
    },
    {
        "feedback_id": str(uuid.uuid4()),
        "feedback_channel": "Customer Success Report",
        "feedback_date": (datetime.date.today() - datetime.timedelta(days=15)).isoformat(),
        "user_id": "Cust_1010",
        "user_segment": "SMB",
        "feedback_text": "The integration with our CRM is not working correctly. The data is not syncing properly, causing a lot of frustration for our sales team. We need a fix soon.",
        "qualitative_tags": ["integration", "bug", "CRM"],
        "quantitative_rating": 1,
        "product_area": "APIs & Integrations",
        "strategic_pillar": ["Client Retention"],
        "customer_sentiment": "Negative",
        "sales_data_value": 10000
    },
    {
        "feedback_id": str(uuid.uuid4()),
        "feedback_channel": "Sales Note",
        "feedback_date": (datetime.date.today() - datetime.timedelta(days=9)).isoformat(),
        "user_id": "Cust_2020",
        "user_segment": "Enterprise",
        "feedback_text": "A prospective client from Germany mentioned the lack of EU-specific data compliance features. This is a major concern for them.",
        "qualitative_tags": ["compliance", "EU", "legal"],
        "quantitative_rating": None,
        "product_area": "Reporting",
        "strategic_pillar": ["Market Expansion"],
        "customer_sentiment": "Neutral",
        "sales_data_value": 250000
    },
    {
        "feedback_id": str(uuid.uuid4()),
        "feedback_channel": "User Research",
        "feedback_date": (datetime.date.today() - datetime.timedelta(days=2)).isoformat(),
        "user_id": "Cust_3030",
        "user_segment": "SMB",
        "feedback_text": "I really enjoy the clean, simple interface, but I wish there was an easier way to export my data to a spreadsheet. The current process is clunky.",
        "qualitative_tags": ["UI", "export", "UX"],
        "quantitative_rating": 3,
        "product_area": "User Interface",
        "strategic_pillar": ["User Growth"],
        "customer_sentiment": "Positive",
        "sales_data_value": 7000
    }
]

# --- Execution ---
# This will run the function with our dummy data and print the formatted JSON string.
formatted_json_string = generate_formatted_json(feedback_data)
print(formatted_json_string)
