# 📊 Customer Feedback Analysis System

A Streamlit-based application for analyzing and prioritizing customer feedback using AI-powered categorization and strategic alignment scoring.

## 🚀 Features

### Core Functionality
- **📤 Data Upload**: Upload CSV files with customer feedback
- **🤖 AI Processing**: Automatic categorization using NLP
- **🎯 Priority Scoring**: Strategic alignment-based prioritization
- **📈 Interactive Dashboard**: Real-time analytics and visualizations
- **⚙️ Configurable Goals**: Manage strategic business objectives

### Key Capabilities
- **Automatic Categorization**: 8 predefined categories (UI, Performance, Functionality, etc.)
- **Sentiment Analysis**: Positive/negative sentiment scoring
- **Strategic Alignment**: Score feedback against business goals
- **Priority Ranking**: Multi-factor priority calculation
- **Data Visualization**: Charts and analytics for insights

## 🏗️ Architecture

### Components
- **`feedback_app.py`**: Main Streamlit application
- **`feedback_processor.py`**: NLP processing and analysis engine
- **`database_manager.py`**: SQLite database operations
- **`sample_data_generator.py`**: Mock data generation for testing

### Database Schema
```sql
-- Feedback items table
CREATE TABLE feedback_items (
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
    processed_date TEXT
);

-- Strategic goals table
CREATE TABLE strategic_goals (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    goal_name TEXT UNIQUE NOT NULL,
    description TEXT,
    weight INTEGER DEFAULT 5,
    created_date TEXT
);
```

## 🛠️ Installation & Setup

### Prerequisites
- Python 3.8+
- pip

### Installation Steps
1. **Clone/Setup Project**
   ```bash
   cd FeedbackProject
   python3 -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

2. **Install Dependencies**
   ```bash
   pip install -r requirements.txt
   ```

3. **Generate Sample Data** (Optional)
   ```bash
   python sample_data_generator.py
   ```

4. **Run the Application**
   ```bash
   streamlit run feedback_app.py
   ```

5. **Access the Application**
   - Open your browser to: `http://localhost:8501`

## 📊 Usage Guide

### 1. Dashboard Overview
- **Key Metrics**: Total feedback, average priority, top category
- **Category Distribution**: Visual breakdown of feedback types
- **Recent Feedback**: Latest processed items

### 2. Upload Feedback
- **Supported Format**: CSV files with columns: `feedback_text`, `source_type`, `date`
- **Sample Data**: Download sample CSV for reference
- **Processing**: Automatic categorization and scoring

### 3. Analysis Features
- **Filtering**: By category, source, and priority score
- **Visualizations**: Priority distribution, category analysis
- **Top Priority**: Highest-scoring feedback items

### 4. Settings Management
- **Strategic Goals**: Add/modify business objectives
- **System Info**: Database status and statistics

## 🎯 Feedback Categories

The system automatically categorizes feedback into:

1. **User Interface**: UI/UX design, layout, visual elements
2. **Performance**: Speed, loading times, optimization
3. **Functionality**: Features, capabilities, tools
4. **Data & Analytics**: Reports, charts, visualizations
5. **User Experience**: Usability, workflow, ease of use
6. **Technical Issues**: Bugs, errors, system problems
7. **Mobile**: Mobile app, responsive design
8. **Integration**: APIs, third-party connections

## 🧮 Priority Scoring Algorithm

The priority score combines multiple factors:

```
Priority Score = (Confidence × 0.3) + (Sentiment Impact × 0.2) + (Strategic Alignment × 0.4) × Source Multiplier
```

Where:
- **Confidence**: Category classification confidence (0-10)
- **Sentiment Impact**: Negative sentiment increases priority
- **Strategic Alignment**: Alignment with business goals (0-10)
- **Source Multiplier**: Support (1.2x), Sales (1.0x), Research (0.8x)

## 📁 File Structure

```
FeedbackProject/
├── feedback_app.py              # Main Streamlit application
├── feedback_processor.py        # NLP processing engine
├── database_manager.py          # Database operations
├── sample_data_generator.py     # Mock data generator
├── requirements.txt             # Python dependencies
├── sample_feedback.csv          # Sample data file
├── feedback.db                  # SQLite database
└── README.md                    # This file
```

## 🔧 Configuration

### Strategic Goals
Default strategic goals with weights:
- **Improve User Onboarding** (Weight: 8)
- **Enhance Data Visualization** (Weight: 7)
- **Optimize Performance** (Weight: 9)
- **Improve Mobile Experience** (Weight: 6)
- **Enhance Security** (Weight: 8)

### Customization
- Add new categories in `feedback_processor.py`
- Modify strategic goals through the Settings page
- Adjust scoring weights in the priority algorithm

## 🚀 Future Enhancements

### Planned Features
- **Advanced NLP**: spaCy integration for better entity recognition
- **Machine Learning**: Predictive analytics for feedback trends
- **API Integration**: Connect to external feedback sources
- **Real-time Processing**: Webhook support for live feedback
- **Advanced Analytics**: Trend analysis and forecasting
- **Export Capabilities**: PDF reports and data export

### Technical Improvements
- **Scalability**: PostgreSQL migration for larger datasets
- **Performance**: Caching and optimization
- **Security**: User authentication and data encryption
- **Monitoring**: Application metrics and error tracking

## 🐛 Troubleshooting

### Common Issues
1. **Port Already in Use**: Change port with `streamlit run feedback_app.py --server.port 8502`
2. **Database Errors**: Delete `feedback.db` to reset
3. **Import Errors**: Ensure all dependencies are installed
4. **Performance Issues**: Reduce sample data size for testing

### Debug Mode
```bash
streamlit run feedback_app.py --logger.level debug
```

## 📈 Sample Data

The system includes a sample data generator that creates realistic feedback data:

```python
# Generate 100 sample feedback records
python sample_data_generator.py
```

Sample feedback format:
```csv
feedback_text,source_type,date
"The mobile app is too slow to load",support,2024-01-15
"We need better data visualization features",sales,2024-01-16
"Login process is confusing",support,2024-01-17
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For issues and questions:
1. Check the troubleshooting section
2. Review the code comments
3. Create an issue in the repository

---

**Built with ❤️ using Streamlit, Python, and AI/ML technologies**
