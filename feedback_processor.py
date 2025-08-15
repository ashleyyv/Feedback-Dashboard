import pandas as pd
import numpy as np
import re
import uuid
from datetime import datetime
from textblob import TextBlob
import json

class FeedbackProcessor:
    def __init__(self):
        # Define feedback categories and their keywords
        self.categories = {
            'User Interface': [
                'ui', 'interface', 'design', 'layout', 'button', 'menu', 'navigation',
                'screen', 'page', 'visual', 'appearance', 'look', 'feel'
            ],
            'Performance': [
                'slow', 'fast', 'speed', 'performance', 'loading', 'lag', 'delay',
                'response time', 'bottleneck', 'optimization'
            ],
            'Functionality': [
                'feature', 'function', 'capability', 'tool', 'option', 'setting',
                'configuration', 'customization', 'workflow'
            ],
            'Data & Analytics': [
                'data', 'analytics', 'report', 'chart', 'graph', 'visualization',
                'dashboard', 'metrics', 'statistics', 'export', 'import'
            ],
            'User Experience': [
                'experience', 'usability', 'user-friendly', 'intuitive', 'easy',
                'simple', 'complicated', 'confusing', 'frustrating'
            ],
            'Technical Issues': [
                'bug', 'error', 'crash', 'broken', 'not working', 'issue',
                'problem', 'glitch', 'failure', 'exception'
            ],
            'Mobile': [
                'mobile', 'app', 'phone', 'tablet', 'ios', 'android', 'responsive',
                'touch', 'swipe', 'gesture'
            ],
            'Integration': [
                'integration', 'api', 'connect', 'sync', 'import', 'export',
                'third-party', 'external', 'webhook'
            ]
        }
        
        # Strategic goals with weights
        self.strategic_goals = {
            'Improve User Onboarding': {
                'keywords': ['onboarding', 'first time', 'new user', 'tutorial', 'guide'],
                'weight': 8
            },
            'Enhance Data Visualization': {
                'keywords': ['chart', 'graph', 'visualization', 'dashboard', 'report'],
                'weight': 7
            },
            'Optimize Performance': {
                'keywords': ['slow', 'performance', 'speed', 'loading', 'optimization'],
                'weight': 9
            },
            'Improve Mobile Experience': {
                'keywords': ['mobile', 'app', 'phone', 'responsive', 'touch'],
                'weight': 6
            },
            'Enhance Security': {
                'keywords': ['security', 'privacy', 'authentication', 'login', 'password'],
                'weight': 8
            }
        }
    
    def process_feedback_batch(self, df):
        """Process a batch of feedback data"""
        processed_data = []
        
        for _, row in df.iterrows():
            feedback_text = str(row.get('feedback_text', ''))
            source_type = str(row.get('source_type', 'unknown'))
            date = row.get('date', datetime.now().strftime('%Y-%m-%d'))
            
            # Process individual feedback
            processed_item = self.process_single_feedback(
                feedback_text, source_type, date
            )
            processed_data.append(processed_item)
        
        return processed_data
    
    def process_single_feedback(self, feedback_text, source_type, date):
        """Process a single feedback item"""
        # Clean and normalize text
        cleaned_text = self.clean_text(feedback_text)
        
        # Categorize feedback
        category, confidence = self.categorize_feedback(cleaned_text)
        
        # Calculate sentiment
        sentiment_score = self.calculate_sentiment(cleaned_text)
        
        # Calculate strategic alignment
        strategic_alignment = self.calculate_strategic_alignment(cleaned_text)
        
        # Calculate priority score
        priority_score = self.calculate_priority_score(
            confidence, sentiment_score, strategic_alignment, source_type
        )
        
        # Extract key entities
        key_entities = self.extract_key_entities(cleaned_text)
        
        return {
            'id': str(uuid.uuid4()),
            'feedback_text': feedback_text,
            'cleaned_text': cleaned_text,
            'source_type': source_type,
            'date': date,
            'category': category,
            'confidence_score': confidence,
            'sentiment_score': sentiment_score,
            'strategic_alignment_score': strategic_alignment,
            'priority_score': priority_score,
            'key_entities': json.dumps(key_entities),
            'processed_date': datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        }
    
    def clean_text(self, text):
        """Clean and normalize text"""
        if not text:
            return ""
        
        # Convert to lowercase
        text = text.lower()
        
        # Remove special characters but keep spaces
        text = re.sub(r'[^\w\s]', ' ', text)
        
        # Remove extra whitespace
        text = re.sub(r'\s+', ' ', text).strip()
        
        return text
    
    def categorize_feedback(self, text):
        """Categorize feedback based on keywords"""
        if not text:
            return "Uncategorized", 0.0
        
        best_category = "Uncategorized"
        best_score = 0.0
        
        for category, keywords in self.categories.items():
            score = 0
            for keyword in keywords:
                if keyword in text:
                    score += 1
            
            # Normalize score by number of keywords
            normalized_score = score / len(keywords)
            
            if normalized_score > best_score:
                best_score = normalized_score
                best_category = category
        
        return best_category, min(best_score * 10, 10.0)  # Scale to 0-10
    
    def calculate_sentiment(self, text):
        """Calculate sentiment score using TextBlob"""
        if not text:
            return 0.0
        
        try:
            blob = TextBlob(text)
            # Convert from -1 to 1 scale to 0 to 10 scale
            sentiment = (blob.sentiment.polarity + 1) * 5
            return round(sentiment, 2)
        except:
            return 5.0  # Neutral sentiment as default
    
    def calculate_strategic_alignment(self, text):
        """Calculate alignment with strategic goals"""
        if not text:
            return 0.0
        
        total_score = 0
        total_weight = 0
        
        for goal_name, goal_data in self.strategic_goals.items():
            weight = goal_data['weight']
            keywords = goal_data['keywords']
            
            # Count keyword matches
            matches = sum(1 for keyword in keywords if keyword in text)
            
            if matches > 0:
                # Calculate score based on matches and weight
                score = (matches / len(keywords)) * weight
                total_score += score
                total_weight += weight
        
        if total_weight == 0:
            return 0.0
        
        # Normalize to 0-10 scale
        alignment_score = (total_score / total_weight) * 10
        return round(min(alignment_score, 10.0), 2)
    
    def calculate_priority_score(self, confidence, sentiment, strategic_alignment, source_type):
        """Calculate overall priority score"""
        # Base score from confidence
        base_score = confidence * 0.3
        
        # Sentiment impact (negative sentiment = higher priority)
        sentiment_impact = (10 - sentiment) * 0.2  # Invert sentiment
        
        # Strategic alignment impact
        strategic_impact = strategic_alignment * 0.4
        
        # Source type impact
        source_weights = {
            'support': 1.2,  # Support tickets get higher weight
            'sales': 1.0,    # Sales feedback gets normal weight
            'research': 0.8, # Research gets slightly lower weight
            'unknown': 1.0   # Default weight
        }
        source_multiplier = source_weights.get(source_type.lower(), 1.0)
        
        # Calculate final score
        priority_score = (base_score + sentiment_impact + strategic_impact) * source_multiplier
        
        return round(min(priority_score, 10.0), 2)
    
    def extract_key_entities(self, text):
        """Extract key entities from text"""
        if not text:
            return []
        
        # Simple entity extraction based on common patterns
        entities = []
        
        # Extract potential product names (words starting with capital letters)
        product_pattern = r'\b[A-Z][a-z]+\b'
        products = re.findall(product_pattern, text)
        entities.extend(products[:3])  # Limit to 3 products
        
        # Extract potential feature names (common feature keywords)
        feature_keywords = ['feature', 'function', 'tool', 'option', 'setting', 'button', 'menu']
        for keyword in feature_keywords:
            if keyword in text:
                entities.append(keyword)
        
        # Extract numbers (potential metrics)
        numbers = re.findall(r'\b\d+\b', text)
        entities.extend(numbers[:2])  # Limit to 2 numbers
        
        return list(set(entities))  # Remove duplicates
    
    def get_category_keywords(self):
        """Get all category keywords for reference"""
        return self.categories
    
    def get_strategic_goals(self):
        """Get strategic goals for reference"""
        return self.strategic_goals
