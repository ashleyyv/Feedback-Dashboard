import pandas as pd
import numpy as np
import re
import uuid
import os
from datetime import datetime
from textblob import TextBlob
import json
from openai import OpenAI
from feedback_processor import FeedbackProcessor

class EnhancedFeedbackProcessor:
    def __init__(self, openai_api_key=None):
        # Initialize OpenAI client
        self.openai_client = OpenAI(api_key=openai_api_key or os.getenv('OPENAI_API_KEY'))
        
        # Fallback processor (current system)
        self.fallback_processor = FeedbackProcessor()
        
        # Enhanced categories with OpenAI
        self.enhanced_categories = {
            'User Interface': 'UI/UX design, layout, buttons, menus, visual elements',
            'Performance': 'Speed, loading times, responsiveness, optimization',
            'Functionality': 'Features, tools, capabilities, workflow',
            'Data & Analytics': 'Reports, charts, dashboards, data visualization',
            'User Experience': 'Usability, ease of use, user journey, accessibility',
            'Technical Issues': 'Bugs, errors, crashes, system problems',
            'Mobile': 'Mobile app, phone, tablet, responsive design',
            'Integration': 'APIs, third-party connections, data sync',
            'Security': 'Authentication, privacy, data protection, login',
            'Support': 'Customer service, help, documentation, training'
        }
        
        # Strategic goals (enhanced)
        self.strategic_goals = {
            'Improve User Onboarding': {
                'keywords': ['onboarding', 'first time', 'new user', 'tutorial', 'guide'],
                'weight': 8,
                'description': 'Enhance the first-time user experience'
            },
            'Enhance Data Visualization': {
                'keywords': ['chart', 'graph', 'visualization', 'dashboard', 'report'],
                'weight': 7,
                'description': 'Improve charts, graphs, and reporting features'
            },
            'Optimize Performance': {
                'keywords': ['slow', 'performance', 'speed', 'loading', 'optimization'],
                'weight': 9,
                'description': 'Improve system speed and responsiveness'
            },
            'Improve Mobile Experience': {
                'keywords': ['mobile', 'app', 'phone', 'responsive', 'touch'],
                'weight': 6,
                'description': 'Enhance mobile app functionality'
            },
            'Enhance Security': {
                'keywords': ['security', 'privacy', 'authentication', 'login', 'password'],
                'weight': 8,
                'description': 'Strengthen authentication and data protection'
            }
        }
    
    def should_use_openai(self, text, source_type):
        """Determine if OpenAI should be used for this feedback"""
        # Use OpenAI for:
        # - Long/complex feedback (>50 characters)
        # - Support tickets (high priority)
        # - Ambiguous or unclear feedback
        # - High-value sources
        
        if len(text) > 50:
            return True
        
        if source_type.lower() in ['support', 'urgent', 'critical']:
            return True
        
        # Check for ambiguous indicators
        ambiguous_indicators = ['maybe', 'perhaps', 'not sure', 'unclear', 'confusing']
        if any(indicator in text.lower() for indicator in ambiguous_indicators):
            return True
        
        return False
    
    def process_feedback_batch(self, df):
        """Process a batch of feedback data with hybrid approach"""
        processed_data = []
        
        for _, row in df.iterrows():
            feedback_text = str(row.get('feedback_text', ''))
            source_type = str(row.get('source_type', 'unknown'))
            date = row.get('date', datetime.now().strftime('%Y-%m-%d'))
            
            # Decide whether to use OpenAI or fallback
            use_openai = self.should_use_openai(feedback_text, source_type)
            
            if use_openai:
                try:
                    processed_item = self.process_with_openai(feedback_text, source_type, date)
                except Exception as e:
                    print(f"OpenAI processing failed for: {feedback_text[:50]}... Error: {e}")
                    # Fallback to current system
                    processed_item = self.fallback_processor.process_single_feedback(
                        feedback_text, source_type, date
                    )
            else:
                # Use current system for simple feedback
                processed_item = self.fallback_processor.process_single_feedback(
                    feedback_text, source_type, date
                )
            
            processed_data.append(processed_item)
        
        return processed_data
    
    def process_with_openai(self, feedback_text, source_type, date):
        """Process feedback using OpenAI for enhanced analysis"""
        # Clean text
        cleaned_text = self.clean_text(feedback_text)
        
        # Enhanced categorization with OpenAI
        category, confidence = self.categorize_with_openai(cleaned_text)
        
        # Enhanced sentiment analysis
        sentiment_score = self.analyze_sentiment_with_openai(cleaned_text)
        
        # Enhanced strategic alignment
        strategic_alignment = self.analyze_strategic_alignment_with_openai(cleaned_text)
        
        # Enhanced entity extraction
        key_entities = self.extract_entities_with_openai(cleaned_text)
        
        # Calculate priority score
        priority_score = self.calculate_priority_score(
            confidence, sentiment_score, strategic_alignment, source_type
        )
        
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
            'processed_date': datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
            'analysis_method': 'openai'  # Track which method was used
        }
    
    def categorize_with_openai(self, text):
        """Enhanced categorization using OpenAI"""
        prompt = f"""
        Categorize this feedback into the most appropriate category from the following list:
        
        Categories:
        - User Interface: UI/UX design, layout, buttons, menus, visual elements
        - Performance: Speed, loading times, responsiveness, optimization
        - Functionality: Features, tools, capabilities, workflow
        - Data & Analytics: Reports, charts, dashboards, data visualization
        - User Experience: Usability, ease of use, user journey, accessibility
        - Technical Issues: Bugs, errors, crashes, system problems
        - Mobile: Mobile app, phone, tablet, responsive design
        - Integration: APIs, third-party connections, data sync
        - Security: Authentication, privacy, data protection, login
        - Support: Customer service, help, documentation, training
        
        Feedback: "{text}"
        
        Respond with only the category name and a confidence score (0-10) separated by a comma.
        Example: "User Interface, 8.5"
        """
        
        try:
            response = self.openai_client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[{"role": "user", "content": prompt}],
                max_tokens=50,
                temperature=0.3
            )
            
            result = response.choices[0].message.content.strip()
            category, confidence_str = result.split(',')
            confidence = float(confidence_str.strip())
            
            return category.strip(), min(confidence, 10.0)
            
        except Exception as e:
            print(f"OpenAI categorization failed: {e}")
            # Fallback to keyword-based categorization
            return self.fallback_processor.categorize_feedback(text)
    
    def analyze_sentiment_with_openai(self, text):
        """Enhanced sentiment analysis using OpenAI"""
        prompt = f"""
        Analyze the sentiment of this feedback and provide a score from 0 to 10.
        
        Scoring guide:
        - 0-2: Very negative (urgent problems, frustration)
        - 3-4: Negative (issues to address)
        - 5: Neutral (informational)
        - 6-7: Positive (suggestions, improvements)
        - 8-10: Very positive (praise, satisfaction)
        
        Consider context, sarcasm, and emotional tone.
        
        Feedback: "{text}"
        
        Respond with only the numerical score (0-10).
        """
        
        try:
            response = self.openai_client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[{"role": "user", "content": prompt}],
                max_tokens=10,
                temperature=0.1
            )
            
            score = float(response.choices[0].message.content.strip())
            return min(max(score, 0), 10)  # Ensure score is between 0-10
            
        except Exception as e:
            print(f"OpenAI sentiment analysis failed: {e}")
            # Fallback to TextBlob
            return self.fallback_processor.calculate_sentiment(text)
    
    def analyze_strategic_alignment_with_openai(self, text):
        """Enhanced strategic alignment analysis using OpenAI"""
        goals_text = "\n".join([
            f"- {goal}: {data['description']} (Weight: {data['weight']})"
            for goal, data in self.strategic_goals.items()
        ])
        
        prompt = f"""
        Analyze how well this feedback aligns with our strategic goals and provide a score from 0 to 10.
        
        Strategic Goals:
        {goals_text}
        
        Feedback: "{text}"
        
        Consider:
        1. How directly the feedback relates to our strategic goals
        2. The potential impact on business objectives
        3. The urgency and importance of addressing this feedback
        
        Respond with only the numerical score (0-10).
        """
        
        try:
            response = self.openai_client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[{"role": "user", "content": prompt}],
                max_tokens=10,
                temperature=0.2
            )
            
            score = float(response.choices[0].message.content.strip())
            return min(max(score, 0), 10)
            
        except Exception as e:
            print(f"OpenAI strategic alignment failed: {e}")
            # Fallback to keyword-based analysis
            return self.fallback_processor.calculate_strategic_alignment(text)
    
    def extract_entities_with_openai(self, text):
        """Enhanced entity extraction using OpenAI"""
        prompt = f"""
        Extract key entities from this feedback text. Focus on:
        - Product names and features
        - User types (e.g., "enterprise users", "developers")
        - Technical terms and technologies
        - Specific issues or requests
        
        Feedback: "{text}"
        
        Return a JSON array of entities. Example: ["mobile app", "loading time", "enterprise users"]
        """
        
        try:
            response = self.openai_client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[{"role": "user", "content": prompt}],
                max_tokens=100,
                temperature=0.1
            )
            
            entities_text = response.choices[0].message.content.strip()
            # Try to parse as JSON, fallback to simple list
            try:
                entities = json.loads(entities_text)
            except:
                # If JSON parsing fails, extract entities manually
                entities = [entity.strip() for entity in entities_text.strip('[]').split(',')]
            
            return entities[:5]  # Limit to 5 entities
            
        except Exception as e:
            print(f"OpenAI entity extraction failed: {e}")
            # Fallback to regex-based extraction
            return self.fallback_processor.extract_key_entities(text)
    
    def generate_insights(self, feedback_batch):
        """Generate actionable insights from feedback batch using OpenAI"""
        if not feedback_batch:
            return "No feedback data available for analysis."
        
        # Prepare feedback summary
        feedback_summary = []
        for item in feedback_batch[:10]:  # Limit to first 10 items for analysis
            feedback_summary.append(f"- {item['feedback_text']} (Priority: {item['priority_score']})")
        
        feedback_text = "\n".join(feedback_summary)
        
        prompt = f"""
        Analyze this feedback data and provide actionable insights:
        
        Feedback Data:
        {feedback_text}
        
        Please provide:
        1. **Top 3 Priority Issues** - Most critical problems to address
        2. **Common Themes** - Recurring patterns or topics
        3. **Actionable Recommendations** - Specific steps to improve
        4. **Business Impact** - Potential benefits of addressing these issues
        
        Format your response in clear sections with bullet points.
        """
        
        try:
            response = self.openai_client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[{"role": "user", "content": prompt}],
                max_tokens=500,
                temperature=0.3
            )
            
            return response.choices[0].message.content
            
        except Exception as e:
            print(f"OpenAI insight generation failed: {e}")
            return "Unable to generate insights at this time."
    
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
    
    def get_processing_stats(self, processed_data):
        """Get statistics about processing methods used"""
        total_items = len(processed_data)
        openai_items = sum(1 for item in processed_data if item.get('analysis_method') == 'openai')
        fallback_items = total_items - openai_items
        
        return {
            'total_processed': total_items,
            'openai_processed': openai_items,
            'fallback_processed': fallback_items,
            'openai_percentage': (openai_items / total_items * 100) if total_items > 0 else 0
        }
