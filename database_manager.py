import sqlite3
import pandas as pd
from datetime import datetime
import json

class DatabaseManager:
    def __init__(self, db_path='feedback.db'):
        self.db_path = db_path
        self.init_database()
    
    def init_database(self):
        """Initialize the database with required tables"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        # Create feedback table
        cursor.execute('''
        CREATE TABLE IF NOT EXISTS feedback_items (
            id TEXT PRIMARY KEY,
            feedback_text TEXT NOT NULL,
            cleaned_text TEXT,
            source_type TEXT,
            date TEXT,
            category TEXT,
            confidence_score REAL,
            sentiment_score REAL,
            strategic_alignment_score REAL,
            priority_score REAL,
            key_entities TEXT,
            processed_date TEXT,
            analysis_method TEXT DEFAULT 'fallback'
        )
        ''')
        
        # Create strategic goals table
        cursor.execute('''
        CREATE TABLE IF NOT EXISTS strategic_goals (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            goal_name TEXT UNIQUE NOT NULL,
            description TEXT,
            weight INTEGER DEFAULT 5,
            created_date TEXT
        )
        ''')
        
        # Create processing history table
        cursor.execute('''
        CREATE TABLE IF NOT EXISTS processing_history (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            batch_id TEXT,
            records_processed INTEGER,
            processing_date TEXT,
            status TEXT
        )
        ''')
        
        # Insert default strategic goals if they don't exist
        default_goals = [
            ('Improve User Onboarding', 'Enhance the first-time user experience', 8),
            ('Enhance Data Visualization', 'Improve charts, graphs, and reporting features', 7),
            ('Optimize Performance', 'Improve system speed and responsiveness', 9),
            ('Improve Mobile Experience', 'Enhance mobile app functionality', 6),
            ('Enhance Security', 'Strengthen authentication and data protection', 8)
        ]
        
        for goal_name, description, weight in default_goals:
            cursor.execute('''
            INSERT OR IGNORE INTO strategic_goals (goal_name, description, weight, created_date)
            VALUES (?, ?, ?, ?)
            ''', (goal_name, description, weight, datetime.now().strftime('%Y-%m-%d %H:%M:%S')))
        
        conn.commit()
        conn.close()
    
    def save_feedback_batch(self, feedback_data):
        """Save a batch of processed feedback data"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        batch_id = f"batch_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
        
        try:
            for item in feedback_data:
                cursor.execute('''
                INSERT OR REPLACE INTO feedback_items (
                    id, feedback_text, cleaned_text, source_type, date, category,
                    confidence_score, sentiment_score, strategic_alignment_score,
                    priority_score, key_entities, processed_date, analysis_method
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                ''', (
                    item['id'], item['feedback_text'], item['cleaned_text'],
                    item['source_type'], item['date'], item['category'],
                    item['confidence_score'], item['sentiment_score'],
                    item['strategic_alignment_score'], item['priority_score'],
                    item['key_entities'], item['processed_date'],
                    item.get('analysis_method', 'fallback')
                ))
            
            # Log processing history
            cursor.execute('''
            INSERT INTO processing_history (batch_id, records_processed, processing_date, status)
            VALUES (?, ?, ?, ?)
            ''', (batch_id, len(feedback_data), datetime.now().strftime('%Y-%m-%d %H:%M:%S'), 'SUCCESS'))
            
            conn.commit()
            return True
            
        except Exception as e:
            print(f"Error saving feedback batch: {e}")
            conn.rollback()
            return False
        finally:
            conn.close()
    
    def get_all_feedback(self):
        """Get all feedback data as a DataFrame"""
        conn = sqlite3.connect(self.db_path)
        query = '''
        SELECT * FROM feedback_items 
        ORDER BY processed_date DESC
        '''
        df = pd.read_sql_query(query, conn)
        conn.close()
        return df
    
    def get_recent_feedback(self, limit=10):
        """Get recent feedback items"""
        conn = sqlite3.connect(self.db_path)
        query = '''
        SELECT * FROM feedback_items 
        ORDER BY processed_date DESC 
        LIMIT ?
        '''
        df = pd.read_sql_query(query, conn, params=(limit,))
        conn.close()
        return df
    
    def get_category_distribution(self):
        """Get distribution of feedback by category"""
        conn = sqlite3.connect(self.db_path)
        query = '''
        SELECT category, COUNT(*) as count 
        FROM feedback_items 
        GROUP BY category 
        ORDER BY count DESC
        '''
        df = pd.read_sql_query(query, conn)
        conn.close()
        return df
    
    def get_total_feedback_count(self):
        """Get total number of feedback items"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        cursor.execute('SELECT COUNT(*) FROM feedback_items')
        count = cursor.fetchone()[0]
        conn.close()
        return count
    
    def get_average_priority(self):
        """Get average priority score"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        cursor.execute('SELECT AVG(priority_score) FROM feedback_items')
        avg = cursor.fetchone()[0]
        conn.close()
        return avg if avg else 0.0
    
    def get_feedback_processed_today(self):
        """Get number of feedback items processed today"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        today = datetime.now().strftime('%Y-%m-%d')
        cursor.execute('SELECT COUNT(*) FROM feedback_items WHERE date(processed_date) = ?', (today,))
        count = cursor.fetchone()[0]
        conn.close()
        return count
    
    def get_strategic_goals(self):
        """Get all strategic goals"""
        conn = sqlite3.connect(self.db_path)
        query = 'SELECT * FROM strategic_goals ORDER BY weight DESC'
        df = pd.read_sql_query(query, conn)
        conn.close()
        return df
    
    def add_strategic_goal(self, goal_name, description, weight):
        """Add a new strategic goal"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        try:
            cursor.execute('''
            INSERT INTO strategic_goals (goal_name, description, weight, created_date)
            VALUES (?, ?, ?, ?)
            ''', (goal_name, description, weight, datetime.now().strftime('%Y-%m-%d %H:%M:%S')))
            conn.commit()
            return True
        except Exception as e:
            print(f"Error adding strategic goal: {e}")
            conn.rollback()
            return False
        finally:
            conn.close()
    
    def delete_strategic_goal(self, goal_id):
        """Delete a strategic goal"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        try:
            cursor.execute('DELETE FROM strategic_goals WHERE id = ?', (goal_id,))
            conn.commit()
            return True
        except Exception as e:
            print(f"Error deleting strategic goal: {e}")
            conn.rollback()
            return False
        finally:
            conn.close()
    
    def get_feedback_by_category(self, category):
        """Get feedback items by category"""
        conn = sqlite3.connect(self.db_path)
        query = '''
        SELECT * FROM feedback_items 
        WHERE category = ? 
        ORDER BY priority_score DESC
        '''
        df = pd.read_sql_query(query, conn, params=(category,))
        conn.close()
        return df
    
    def get_feedback_by_source(self, source_type):
        """Get feedback items by source type"""
        conn = sqlite3.connect(self.db_path)
        query = '''
        SELECT * FROM feedback_items 
        WHERE source_type = ? 
        ORDER BY priority_score DESC
        '''
        df = pd.read_sql_query(query, conn, params=(source_type,))
        conn.close()
        return df
    
    def get_high_priority_feedback(self, min_priority=7.0):
        """Get high priority feedback items"""
        conn = sqlite3.connect(self.db_path)
        query = '''
        SELECT * FROM feedback_items 
        WHERE priority_score >= ? 
        ORDER BY priority_score DESC
        '''
        df = pd.read_sql_query(query, conn, params=(min_priority,))
        conn.close()
        return df
    
    def get_processing_history(self):
        """Get processing history"""
        conn = sqlite3.connect(self.db_path)
        query = '''
        SELECT * FROM processing_history 
        ORDER BY processing_date DESC
        '''
        df = pd.read_sql_query(query, conn)
        conn.close()
        return df
    
    def clear_all_data(self):
        """Clear all data from the database (for testing)"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        try:
            cursor.execute('DELETE FROM feedback_items')
            cursor.execute('DELETE FROM processing_history')
            conn.commit()
            return True
        except Exception as e:
            print(f"Error clearing data: {e}")
            conn.rollback()
            return False
        finally:
            conn.close()
