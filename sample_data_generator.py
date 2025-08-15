import pandas as pd
import random
from datetime import datetime, timedelta

def generate_sample_feedback_data(num_records=50):
    """Generate sample feedback data for testing"""
    
    # Sample feedback templates
    feedback_templates = {
        'User Interface': [
            "The {feature} interface is {sentiment} to use",
            "We need better {feature} design",
            "The {feature} layout is {sentiment}",
            "Please improve the {feature} UI",
            "The {feature} screen is {sentiment}"
        ],
        'Performance': [
            "The {feature} is too {sentiment}",
            "We need faster {feature} loading",
            "The {feature} performance is {sentiment}",
            "Please optimize {feature} speed",
            "The {feature} is {sentiment} to load"
        ],
        'Functionality': [
            "We need {feature} functionality",
            "Please add {feature} feature",
            "The {feature} capability is missing",
            "We want {feature} options",
            "Please implement {feature} tool"
        ],
        'Data & Analytics': [
            "We need better {feature} reports",
            "Please add {feature} charts",
            "The {feature} data is {sentiment}",
            "We want {feature} analytics",
            "Please improve {feature} visualization"
        ],
        'User Experience': [
            "The {feature} experience is {sentiment}",
            "We need more {sentiment} {feature}",
            "The {feature} workflow is {sentiment}",
            "Please make {feature} more {sentiment}",
            "The {feature} is {sentiment} to understand"
        ],
        'Technical Issues': [
            "There's a bug with {feature}",
            "The {feature} is not working",
            "We're getting errors with {feature}",
            "The {feature} keeps crashing",
            "There's an issue with {feature}"
        ],
        'Mobile': [
            "The mobile {feature} is {sentiment}",
            "We need better mobile {feature}",
            "The {feature} app is {sentiment}",
            "Please improve mobile {feature}",
            "The {feature} on mobile is {sentiment}"
        ],
        'Integration': [
            "We need {feature} integration",
            "Please connect {feature} with other tools",
            "The {feature} API is {sentiment}",
            "We want {feature} sync capability",
            "Please add {feature} webhook support"
        ]
    }
    
    # Features for each category
    features = {
        'User Interface': ['dashboard', 'navigation', 'menu', 'button', 'form', 'sidebar'],
        'Performance': ['page loading', 'search', 'report generation', 'data processing', 'file upload'],
        'Functionality': ['export', 'import', 'filtering', 'sorting', 'search', 'notifications'],
        'Data & Analytics': ['charts', 'reports', 'metrics', 'statistics', 'dashboards', 'graphs'],
        'User Experience': ['onboarding', 'tutorial', 'help system', 'feedback form', 'settings'],
        'Technical Issues': ['login', 'authentication', 'data sync', 'file upload', 'search'],
        'Mobile': ['app', 'responsive design', 'touch interface', 'offline mode', 'push notifications'],
        'Integration': ['API', 'webhook', 'third-party tools', 'data import', 'export']
    }
    
    # Sentiment words
    positive_sentiments = ['great', 'excellent', 'good', 'easy', 'intuitive', 'fast', 'smooth']
    negative_sentiments = ['slow', 'difficult', 'confusing', 'frustrating', 'broken', 'poor', 'bad']
    
    # Source types
    source_types = ['support', 'sales', 'research', 'user_feedback', 'survey']
    
    # Generate data
    data = []
    
    for i in range(num_records):
        # Randomly select category
        category = random.choice(list(feedback_templates.keys()))
        
        # Get template and feature
        template = random.choice(feedback_templates[category])
        feature = random.choice(features[category])
        
        # Select sentiment
        sentiment = random.choice(positive_sentiments + negative_sentiments)
        
        # Generate feedback text
        feedback_text = template.format(feature=feature, sentiment=sentiment)
        
        # Add some variety
        if random.random() < 0.3:
            feedback_text += f" - {random.choice(['urgent', 'important', 'critical', 'nice to have'])}"
        
        # Generate date (within last 30 days)
        days_ago = random.randint(0, 30)
        date = (datetime.now() - timedelta(days=days_ago)).strftime('%Y-%m-%d')
        
        # Select source type
        source_type = random.choice(source_types)
        
        data.append({
            'feedback_text': feedback_text,
            'source_type': source_type,
            'date': date
        })
    
    return pd.DataFrame(data)

def create_sample_csv(filename='sample_feedback.csv', num_records=50):
    """Create and save a sample CSV file"""
    df = generate_sample_feedback_data(num_records)
    df.to_csv(filename, index=False)
    print(f"✅ Created sample feedback file: {filename}")
    print(f"📊 Generated {len(df)} feedback records")
    return df

if __name__ == "__main__":
    # Create sample data
    df = create_sample_csv('sample_feedback.csv', 100)
    
    # Show sample
    print("\n📋 Sample feedback data:")
    print(df.head(10))
    
    # Show distribution
    print("\n📊 Source type distribution:")
    print(df['source_type'].value_counts())
