import streamlit as st
import pandas as pd
import plotly.express as px
import plotly.graph_objects as go
from datetime import datetime
import sqlite3
import json
from feedback_processor import FeedbackProcessor
from database_manager import DatabaseManager

# Page configuration
st.set_page_config(
    page_title="Feedback Analysis System",
    page_icon="📊",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Initialize session state
if 'feedback_processor' not in st.session_state:
    st.session_state.feedback_processor = FeedbackProcessor()
if 'db_manager' not in st.session_state:
    st.session_state.db_manager = DatabaseManager()

def main():
    st.title("📊 Customer Feedback Analysis System")
    st.markdown("---")
    
    # Sidebar navigation
    page = st.sidebar.selectbox(
        "Navigation",
        ["🏠 Dashboard", "📤 Upload Feedback", "📈 Analysis", "⚙️ Settings"]
    )
    
    if page == "🏠 Dashboard":
        show_dashboard()
    elif page == "📤 Upload Feedback":
        show_upload_page()
    elif page == "📈 Analysis":
        show_analysis_page()
    elif page == "⚙️ Settings":
        show_settings_page()

def show_dashboard():
    st.header("📊 Feedback Dashboard")
    
    # Get summary statistics
    total_feedback = st.session_state.db_manager.get_total_feedback_count()
    categories = st.session_state.db_manager.get_category_distribution()
    recent_feedback = st.session_state.db_manager.get_recent_feedback(5)
    
    # Key metrics
    col1, col2, col3, col4 = st.columns(4)
    
    with col1:
        st.metric("Total Feedback", total_feedback)
    
    with col2:
        avg_priority = st.session_state.db_manager.get_average_priority()
        st.metric("Avg Priority Score", f"{avg_priority:.2f}")
    
    with col3:
        top_category = categories.iloc[0]['category'] if not categories.empty else "N/A"
        st.metric("Top Category", top_category)
    
    with col4:
        processed_today = st.session_state.db_manager.get_feedback_processed_today()
        st.metric("Processed Today", processed_today)
    
    st.markdown("---")
    
    # Category distribution chart
    if not categories.empty:
        st.subheader("📈 Feedback by Category")
        fig = px.bar(
            categories, 
            x='category', 
            y='count',
            title="Feedback Distribution by Category",
            color='count',
            color_continuous_scale='viridis'
        )
        fig.update_layout(xaxis_title="Category", yaxis_title="Count")
        st.plotly_chart(fig, use_container_width=True)
    
    # Recent feedback table
    if not recent_feedback.empty:
        st.subheader("🕒 Recent Feedback")
        st.dataframe(
            recent_feedback[['feedback_text', 'category', 'priority_score', 'source_type']].head(10),
            use_container_width=True
        )

def show_upload_page():
    st.header("📤 Upload Feedback Data")
    
    # File upload
    uploaded_file = st.file_uploader(
        "Choose a CSV file with feedback data",
        type=['csv'],
        help="Upload a CSV file with columns: feedback_text, source_type, date (optional)"
    )
    
    if uploaded_file is not None:
        try:
            # Read the uploaded file
            df = pd.read_csv(uploaded_file)
            st.success(f"✅ Successfully loaded {len(df)} feedback items")
            
            # Show preview
            st.subheader("📋 Data Preview")
            st.dataframe(df.head(), use_container_width=True)
            
            # Process button
            if st.button("🚀 Process Feedback", type="primary"):
                with st.spinner("Processing feedback..."):
                    # Process the feedback
                    processed_data = st.session_state.feedback_processor.process_feedback_batch(df)
                    
                    # Save to database
                    st.session_state.db_manager.save_feedback_batch(processed_data)
                    
                    st.success(f"✅ Successfully processed {len(processed_data)} feedback items!")
                    
                    # Show results
                    st.subheader("📊 Processing Results")
                    results_df = pd.DataFrame(processed_data)
                    st.dataframe(results_df, use_container_width=True)
        
        except Exception as e:
            st.error(f"❌ Error processing file: {str(e)}")
    
    # Sample data download
    st.markdown("---")
    st.subheader("📥 Sample Data Format")
    
    sample_data = {
        'feedback_text': [
            "The mobile app is too slow to load",
            "We need better data visualization features",
            "Login process is confusing",
            "Great user interface, very intuitive",
            "Please add export functionality"
        ],
        'source_type': ['support', 'sales', 'support', 'research', 'sales'],
        'date': ['2024-01-15', '2024-01-16', '2024-01-17', '2024-01-18', '2024-01-19']
    }
    
    sample_df = pd.DataFrame(sample_data)
    st.dataframe(sample_df, use_container_width=True)
    
    # Download sample CSV
    csv = sample_df.to_csv(index=False)
    st.download_button(
        label="📥 Download Sample CSV",
        data=csv,
        file_name="sample_feedback.csv",
        mime="text/csv"
    )

def show_analysis_page():
    st.header("📈 Feedback Analysis")
    
    # Get all feedback data
    all_feedback = st.session_state.db_manager.get_all_feedback()
    
    if all_feedback.empty:
        st.warning("No feedback data available. Please upload some data first.")
        return
    
    # Filters
    col1, col2, col3 = st.columns(3)
    
    with col1:
        categories = ['All'] + list(all_feedback['category'].unique())
        selected_category = st.selectbox("Filter by Category", categories)
    
    with col2:
        sources = ['All'] + list(all_feedback['source_type'].unique())
        selected_source = st.selectbox("Filter by Source", sources)
    
    with col3:
        min_priority = st.slider("Minimum Priority Score", 0.0, 10.0, 0.0)
    
    # Apply filters
    filtered_data = all_feedback.copy()
    if selected_category != 'All':
        filtered_data = filtered_data[filtered_data['category'] == selected_category]
    if selected_source != 'All':
        filtered_data = filtered_data[filtered_data['source_type'] == selected_source]
    filtered_data = filtered_data[filtered_data['priority_score'] >= min_priority]
    
    st.markdown(f"**Showing {len(filtered_data)} feedback items**")
    
    # Priority distribution
    st.subheader("🎯 Priority Score Distribution")
    fig = px.histogram(
        filtered_data, 
        x='priority_score',
        nbins=20,
        title="Distribution of Priority Scores"
    )
    fig.update_layout(xaxis_title="Priority Score", yaxis_title="Count")
    st.plotly_chart(fig, use_container_width=True)
    
    # Top priority feedback
    st.subheader("🔥 Top Priority Feedback")
    top_feedback = filtered_data.nlargest(10, 'priority_score')
    st.dataframe(
        top_feedback[['feedback_text', 'category', 'priority_score', 'source_type']],
        use_container_width=True
    )
    
    # Category analysis
    st.subheader("📊 Category Analysis")
    category_stats = filtered_data.groupby('category').agg({
        'priority_score': ['mean', 'count'],
        'feedback_text': 'count'
    }).round(2)
    
    # Flatten the MultiIndex columns and rename them properly
    category_stats.columns = ['_'.join(col).strip() for col in category_stats.columns.values]
    category_stats = category_stats.rename(columns={
        'priority_score_mean': 'Avg Priority',
        'priority_score_count': 'Priority Count',
        'feedback_text_count': 'Total Count'
    })
    
    st.dataframe(category_stats, use_container_width=True)

def show_settings_page():
    st.header("⚙️ System Settings")
    
    # Strategic goals management
    st.subheader("🎯 Strategic Goals")
    
    goals = st.session_state.db_manager.get_strategic_goals()
    
    if not goals.empty:
        st.dataframe(goals, use_container_width=True)
    
    # Add new goal
    with st.expander("➕ Add New Strategic Goal"):
        new_goal_name = st.text_input("Goal Name")
        new_goal_description = st.text_area("Goal Description")
        new_goal_weight = st.slider("Priority Weight", 1, 10, 5)
        
        if st.button("Add Goal"):
            if new_goal_name and new_goal_description:
                st.session_state.db_manager.add_strategic_goal(
                    new_goal_name, new_goal_description, new_goal_weight
                )
                st.success("✅ Goal added successfully!")
                st.rerun()
    
    # System information
    st.subheader("ℹ️ System Information")
    st.info(f"Database: {st.session_state.db_manager.db_path}")
    st.info(f"Total feedback items: {st.session_state.db_manager.get_total_feedback_count()}")
    st.info(f"Categories: {len(st.session_state.db_manager.get_category_distribution())}")

if __name__ == "__main__":
    main()
