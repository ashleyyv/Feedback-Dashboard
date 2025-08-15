/**
 * Financial Adventure - Dashboard Page JavaScript
 * Handles dashboard functionality, data fetching, and visualizations
 */

// Global chart objects
let mainChart = null;
let secondaryChart = null;
let currentSymbol = null;
let currentDataCategory = 'Historical Prices';
let chartData = null;

document.addEventListener('DOMContentLoaded', function() {
    // Initialize company selection
    initCompanySelection();
    
    // Initialize data category selection
    initDataCategorySelection();
    
    // Initialize charts
    initCharts();
    
    // Initialize date range selector
    initDateRangeSelector();
});


/**
 * Initializes company selection functionality
 */
function initCompanySelection() {
    const companyItems = document.querySelectorAll('.company-item');
    
    companyItems.forEach(item => {
        item.addEventListener('click', function() {
            // Remove active class from all items
            companyItems.forEach(c => c.classList.remove('active'));
            
            // Add active class to clicked item
            this.classList.add('active');
            
            // Get company symbol
            const symbol = this.getAttribute('data-symbol');
            currentSymbol = symbol;
            
            // Update charts with selected company data
            updateCharts(symbol, currentDataCategory);
            
            // Update insights for selected company
            updateInsights(symbol, currentDataCategory);
            
            // Show selection notification
            const companyName = this.querySelector('.company-name').textContent;
            showNotification(`${companyName} selected. Loading ${currentDataCategory} data...`, 'info');
            
            // Update data source indicator
            updateDataSourceIndicator(symbol, currentDataCategory);
        });
    });
}

/**
 * Initializes data category selection functionality
 */
function initDataCategorySelection() {
    const dataCategorySelect = document.getElementById('dataCategorySelect');
    
    if (dataCategorySelect) {
        dataCategorySelect.addEventListener('change', function() {
            const category = this.value;
            currentDataCategory = category;
            
            if (currentSymbol) {
                // Update charts with selected category
                updateCharts(currentSymbol, category);
                
                // Update insights
                updateInsights(currentSymbol, category);
                
                // Show notification
                showNotification(`Displaying ${category} data for ${currentSymbol}`, 'info');
                
                // Update data source indicator
                updateDataSourceIndicator(currentSymbol, category);
                
                // Sync with pipeline controls
                const dataTypeSelect = document.getElementById('dataTypeSelect');
                if (dataTypeSelect) {
                    dataTypeSelect.value = category;
                }
            }
        });
    }
}

/**
 * Updates the data source indicator
 */
function updateDataSourceIndicator(symbol, category) {
    const dataSourceIndicator = document.getElementById('dataSourceIndicator');
    if (dataSourceIndicator) {
        dataSourceIndicator.innerHTML = `
            <div class="data-source-info">
                <i class="fas fa-database"></i>
                <span>Showing ${category} data for ${symbol}</span>
            </div>
        `;
        dataSourceIndicator.style.display = 'block';
    }
}

/**
 * Initializes date range selector
 */
function initDateRangeSelector() {
    const dateRangeSelect = document.getElementById('dateRangeSelect');
    
    if (dateRangeSelect) {
        dateRangeSelect.addEventListener('change', function() {
            if (chartData && mainChart) {
                applyDateFilter(this.value);
            }
        });
    }
}

/**
 * Applies date filter to the chart
 */
function applyDateFilter(range) {
    if (!chartData || !mainChart) return;
    
    const dates = chartData.dates;
    const values = chartData.values;
    
    if (!dates || !values || dates.length === 0) return;
    
    let filteredDates = [];
    let filteredValues = [];
    
    // Calculate the cutoff date based on the selected range
    const now = new Date();
    let cutoffDate = new Date();
    
    switch(range) {
        case '1m':
            cutoffDate.setMonth(now.getMonth() - 1);
            break;
        case '3m':
            cutoffDate.setMonth(now.getMonth() - 3);
            break;
        case '6m':
            cutoffDate.setMonth(now.getMonth() - 6);
            break;
        case '1y':
            cutoffDate.setFullYear(now.getFullYear() - 1);
            break;
        case 'all':
        default:
            // No filtering needed
            filteredDates = dates;
            filteredValues = values;
            updateChart(filteredDates, filteredValues);
            return;
    }
    
    // Convert cutoff date to string format for comparison
    const cutoffDateStr = cutoffDate.toISOString().split('T')[0];
    
    // Filter the data
    for (let i = 0; i < dates.length; i++) {
        if (dates[i] >= cutoffDateStr) {
            filteredDates.push(dates[i]);
            filteredValues.push(values[i]);
        }
    }
    
    // Update the chart with filtered data
    updateChart(filteredDates, filteredValues);
}

/**
 * Updates the chart with filtered data
 */
function updateChart(dates, values) {
    if (!mainChart) return;
    
    mainChart.data.labels = dates;
    mainChart.data.datasets[0].data = values;
    mainChart.update();
    
    // Update data points count indicator
    const dataPointsIndicator = document.getElementById('dataPointsIndicator');
    if (dataPointsIndicator) {
        dataPointsIndicator.textContent = `Showing ${dates.length} data points`;
    }
}

/**
 * Initializes chart containers and placeholders
 */
function initCharts() {
    // Set up chart containers
    const chartArea = document.querySelector('.chart-area');
    const insightsContent = document.querySelector('.insights-content');
    
    if (!chartArea || !insightsContent) return;
    
    // Create canvas for main chart if it doesn't exist
    if (!document.getElementById('financialChart')) {
        const canvas = document.createElement('canvas');
        canvas.id = 'financialChart';
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        chartArea.appendChild(canvas);
    }
}

/**
 * Updates charts with data for the selected company and category
 * @param {string} symbol - The company symbol
 * @param {string} category - The data category
 */
function updateCharts(symbol, category) {
    // Show loading state
    const chartArea = document.querySelector('.chart-area');
    if (!chartArea) return;
    
    chartArea.innerHTML = `
        <div class="chart-loading">
            <div class="spinner"></div>
            <p>Loading ${category} data for ${symbol}...</p>
        </div>
    `;
    
    // Fetch data from API
    fetchAPI(`/api/historical_chart_data/${symbol}?data_type=${encodeURIComponent(category)}`)
        .then(data => {
            // Store the data globally
            chartData = data;
            
            // Check if there's an error in the response
            if (data.error) {
                throw new Error(data.error);
            }
            
            // Check if we have data to display
            if (!data.dates || data.dates.length === 0 || !data.values || data.values.length === 0) {
                chartArea.innerHTML = `
                    <div class="chart-error">
                        <i class="fas fa-exclamation-triangle"></i>
                        <p>No ${category} data available for ${symbol}. Please run the pipeline first using the Pipeline Controls.</p>
                        <button class="show-pipeline-btn">Show Pipeline Controls</button>
                    </div>
                `;
                
                // Add event listener to show pipeline controls button
                const showPipelineBtn = chartArea.querySelector('.show-pipeline-btn');
                if (showPipelineBtn) {
                    showPipelineBtn.addEventListener('click', function() {
                        const pipelineButton = document.querySelector('.pipeline-button');
                        if (pipelineButton) {
                            pipelineButton.click();
                        }
                    });
                }
                return;
            }
            
            // Clear loading state
            chartArea.innerHTML = '';
            
            // Create chart controls
            const chartControls = document.createElement('div');
            chartControls.className = 'chart-controls';
            chartControls.innerHTML = `
                <div class="chart-info">
                    <span id="dataPointsIndicator">Showing ${data.dates.length} data points</span>
                </div>
                <div class="chart-actions">
                    <button id="zoomInBtn" class="chart-btn"><i class="fas fa-search-plus"></i></button>
                    <button id="zoomOutBtn" class="chart-btn"><i class="fas fa-search-minus"></i></button>
                    <button id="resetZoomBtn" class="chart-btn"><i class="fas fa-undo"></i></button>
                </div>
            `;
            chartArea.appendChild(chartControls);
            
            // Create canvas
            const canvas = document.createElement('canvas');
            canvas.id = 'financialChart';
            chartArea.appendChild(canvas);
            
            // Create chart
            createChart(canvas, data);
            
            // Apply any active date filter
            const dateRangeSelect = document.getElementById('dateRangeSelect');
            if (dateRangeSelect && dateRangeSelect.value !== 'all') {
                applyDateFilter(dateRangeSelect.value);
            }
            
            // Add event listeners for zoom buttons
            document.getElementById('zoomInBtn').addEventListener('click', function() {
                if (mainChart) {
                    // Zoom in by reducing the visible data points by 25%
                    const visiblePoints = mainChart.data.labels.length;
                    const newVisiblePoints = Math.max(10, Math.floor(visiblePoints * 0.75));
                    const startIndex = Math.floor((visiblePoints - newVisiblePoints) / 2);
                    
                    const newLabels = mainChart.data.labels.slice(startIndex, startIndex + newVisiblePoints);
                    const newData = mainChart.data.datasets[0].data.slice(startIndex, startIndex + newVisiblePoints);
                    
                    updateChart(newLabels, newData);
                }
            });
            
            document.getElementById('zoomOutBtn').addEventListener('click', function() {
                if (mainChart && chartData) {
                    // If we're already showing all data, do nothing
                    if (mainChart.data.labels.length >= chartData.dates.length) {
                        updateChart(chartData.dates, chartData.values);
                        return;
                    }
                    
                    // Zoom out by increasing the visible data points by 25%
                    const visiblePoints = mainChart.data.labels.length;
                    const newVisiblePoints = Math.min(chartData.dates.length, Math.ceil(visiblePoints * 1.25));
                    const startIndex = Math.max(0, Math.floor((chartData.dates.length - newVisiblePoints) / 2));
                    
                    const newLabels = chartData.dates.slice(startIndex, startIndex + newVisiblePoints);
                    const newData = chartData.values.slice(startIndex, startIndex + newVisiblePoints);
                    
                    updateChart(newLabels, newData);
                }
            });
            
            document.getElementById('resetZoomBtn').addEventListener('click', function() {
                if (chartData) {
                    // Reset to show all data
                    updateChart(chartData.dates, chartData.values);
                    
                    // Also reset the date range selector
                    const dateRangeSelect = document.getElementById('dateRangeSelect');
                    if (dateRangeSelect) {
                        dateRangeSelect.value = 'all';
                    }
                }
            });
        })
        .catch(error => {
            chartArea.innerHTML = `
                <div class="chart-error">
                    <i class="fas fa-exclamation-triangle"></i>
                    <p>Error loading chart data: ${error.message}</p>
                    <p>Please make sure you have run the pipeline with a valid API key.</p>
                    <button class="show-pipeline-btn">Show Pipeline Controls</button>
                </div>
            `;
            
            // Add event listener to show pipeline controls button
            const showPipelineBtn = chartArea.querySelector('.show-pipeline-btn');
            if (showPipelineBtn) {
                showPipelineBtn.addEventListener('click', function() {
                    const pipelineButton = document.querySelector('.pipeline-button');
                    if (pipelineButton) {
                        pipelineButton.click();
                    }
                });
            }
        });
}

/**
 * Creates a chart with the provided data
 * @param {HTMLElement} canvas - The canvas element
 * @param {Object} data - The chart data
 */
function createChart(canvas, data) {
    const ctx = canvas.getContext('2d');
    
    // Destroy existing chart if it exists
    if (mainChart) {
        mainChart.destroy();
    }
    
    // Create gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, 'rgba(54, 162, 235, 0.6)');
    gradient.addColorStop(1, 'rgba(54, 162, 235, 0)');
    
    // Determine appropriate point radius based on data size
    let pointRadius = 3;
    if (data.dates.length > 50) {
        pointRadius = 2;
    }
    if (data.dates.length > 100) {
        pointRadius = 1;
    }
    if (data.dates.length > 200) {
        pointRadius = 0;
    }
    
    // Create chart
    mainChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: data.dates || [],
            datasets: [{
                label: `${data.symbol || 'Stock'} ${data.data_type || currentDataCategory}`,
                data: data.values || [],
                backgroundColor: gradient,
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 2,
                pointRadius: pointRadius,
                pointHoverRadius: 5,
                pointBackgroundColor: 'rgba(54, 162, 235, 1)',
                tension: 0.3,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                    position: 'top',
                    labels: {
                        font: {
                            size: 14
                        }
                    }
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                    callbacks: {
                        label: function(context) {
                            return `$${context.raw.toLocaleString()}`;
                        }
                    },
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    titleFont: {
                        size: 14
                    },
                    bodyFont: {
                        size: 13
                    },
                    padding: 10,
                    cornerRadius: 4
                }
            },
            scales: {
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        maxRotation: 45,
                        minRotation: 45,
                        autoSkip: true,
                        maxTicksLimit: 15
                    }
                },
                y: {
                    beginAtZero: false,
                    ticks: {
                        callback: function(value) {
                            return '$' + value.toLocaleString();
                        }
                    },
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    }
                }
            },
            animation: {
                duration: 1000,
                easing: 'easeOutQuart'
            },
            interaction: {
                mode: 'nearest',
                axis: 'x',
                intersect: false
            },
            elements: {
                line: {
                    tension: 0.4
                }
            }
        }
    });
}

/**
 * Updates insights section with data for the selected company
 * @param {string} symbol - The company symbol
 * @param {string} category - The data category
 */
function updateInsights(symbol, category) {
    const insightsContent = document.querySelector('.insights-content');
    if (!insightsContent) return;
    
    // Show loading state
    insightsContent.innerHTML = `
        <div class="insights-loading">
            <div class="spinner"></div>
            <p>Analyzing ${symbol} ${category} data...</p>
        </div>
    `;
    
    // In a real app, we would fetch insights from an API based on the symbol and category
    // For now, we'll simulate insights loading with different content based on category
    setTimeout(() => {
        // Get company name based on symbol
        let companyName = 'Company';
        const companyItem = document.querySelector(`.company-item[data-symbol="${symbol}"]`);
        if (companyItem) {
            companyName = companyItem.querySelector('.company-name').textContent;
        }
        
        // Generate insights based on symbol and category
        let insights = '';
        
        if (category === 'Income Statement') {
            // Income Statement specific insights
            switch(symbol) {
                case 'AAPL':
                    insights = `
                        <h3>Apple Inc. Income Analysis</h3>
                        <p>Apple shows strong financial performance with consistent growth in revenue and profitability.</p>
                        <ul>
                            <li>Revenue growth of 8% year-over-year</li>
                            <li>Gross margin improved to 43.3%</li>
                            <li>Operating expenses well controlled at 12.8% of revenue</li>
                        </ul>
                    `;
                    break;
                case 'MSFT':
                    insights = `
                        <h3>Microsoft Corp. Income Analysis</h3>
                        <p>Microsoft demonstrates robust growth in cloud services revenue and overall profitability.</p>
                        <ul>
                            <li>Cloud revenue up 22% year-over-year</li>
                            <li>Operating margin expanded to 41.5%</li>
                            <li>Recurring revenue now accounts for 70% of total</li>
                        </ul>
                    `;
                    break;
                case 'GOOGL':
                    insights = `
                        <h3>Alphabet Inc. Income Analysis</h3>
                        <p>Google's parent company maintains strong advertising revenue while diversifying income streams.</p>
                        <ul>
                            <li>Ad revenue grew 12% despite market challenges</li>
                            <li>YouTube revenue increased by 15%</li>
                            <li>Cloud division approaching profitability</li>
                        </ul>
                    `;
                    break;
                case 'TSLA':
                    insights = `
                        <h3>Tesla Inc. Income Analysis</h3>
                        <p>Tesla shows improving profitability despite competitive pressures in the EV market.</p>
                        <ul>
                            <li>Automotive gross margin of 25.1%</li>
                            <li>Energy business revenue up 58%</li>
                            <li>Operating expenses as percentage of revenue decreased</li>
                        </ul>
                    `;
                    break;
                default:
                    insights = `
                        <h3>${companyName} Income Analysis</h3>
                        <p>Select a company to see detailed income statement analysis.</p>
                    `;
            }
        } else {
            // Default to Historical Prices insights
            switch(symbol) {
                case 'AAPL':
                    insights = `
                        <h3>Apple Inc. Price Analysis</h3>
                        <p>Apple shows strong financial performance with consistent growth in stock price.</p>
                        <ul>
                            <li>Steady increase in stock price over the past year</li>
                            <li>Strong cash reserves provide stability</li>
                            <li>Product innovation continues to drive growth</li>
                        </ul>
                    `;
                    break;
                case 'MSFT':
                    insights = `
                        <h3>Microsoft Corp. Price Analysis</h3>
                        <p>Microsoft demonstrates robust growth in stock value driven by cloud services.</p>
                        <ul>
                            <li>Azure cloud platform shows accelerating adoption</li>
                            <li>Diversified revenue streams provide stability</li>
                            <li>Strategic acquisitions strengthen market position</li>
                        </ul>
                    `;
                    break;
                case 'GOOGL':
                    insights = `
                        <h3>Alphabet Inc. Price Analysis</h3>
                        <p>Google's parent company maintains stable stock performance while expanding into new areas.</p>
                        <ul>
                            <li>Search and advertising remain core revenue drivers</li>
                            <li>YouTube growth accelerating as video consumption increases</li>
                            <li>Investments in AI and cloud show promising returns</li>
                        </ul>
                    `;
                    break;
                case 'TSLA':
                    insights = `
                        <h3>Tesla Inc. Price Analysis</h3>
                        <p>Tesla continues to show price volatility while maintaining overall growth trajectory.</p>
                        <ul>
                            <li>Vehicle delivery growth remains strong</li>
                            <li>Energy business provides diversification</li>
                            <li>Manufacturing efficiency improving margins</li>
                        </ul>
                    `;
                    break;
                default:
                    insights = `
                        <h3>${companyName} Analysis</h3>
                        <p>Select a company to see detailed financial insights and analysis.</p>
                    `;
            }
        }
        
        // Update insights content
        insightsContent.innerHTML = `
            <div class="insights-analysis">
                ${insights}
                <div class="insights-badge">
                    <i class="fas fa-brain"></i>
                    <span>${category} Analysis</span>
                </div>
            </div>
        `;
        
        // Add animation classes
        const elements = insightsContent.querySelectorAll('h3, p, ul');
        elements.forEach((el, index) => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            }, 100 + (index * 150));
        });
    }, 1000);
}


/**
 * CSS for dashboard-specific elements
 */
document.head.insertAdjacentHTML('beforeend', `
<style>
    .spinner {
        width: 40px;
        height: 40px;
        border: 4px solid rgba(255, 255, 255, 0.3);
        border-radius: 50%;
        border-top-color: #3498db;
        animation: spin 1s ease-in-out infinite;
        margin: 0 auto 15px;
    }
    
    @keyframes spin {
        to { transform: rotate(360deg); }
    }
    
    .chart-loading, .insights-loading {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        height: 100%;
        color: #666;
    }
    
    .chart-error {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        height: 100%;
        color: #e74c3c;
    }
    
    .chart-error i {
        font-size: 3rem;
        margin-bottom: 15px;
    }
    
    .insights-badge {
        display: inline-flex;
        align-items: center;
        background-color: #f0f7ff;
        padding: 5px 10px;
        border-radius: 15px;
        margin-top: 15px;
        font-size: 0.9rem;
        color: #3498db;
    }
    
    .insights-badge i {
        margin-right: 5px;
    }
    
    .company-item.active {
        border-left: 4px solid #4CAF50;
        background-color: #f0f7ff;
    }
    
    .chart-controls {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 10px;
        padding: 5px 10px;
        background-color: #f8f9fa;
        border-radius: 4px;
    }
    
    .chart-actions {
        display: flex;
        gap: 5px;
    }
    
    .chart-btn {
        background-color: #fff;
        border: 1px solid #ddd;
        border-radius: 4px;
        padding: 5px 10px;
        cursor: pointer;
        transition: all 0.2s;
    }
    
    .chart-btn:hover {
        background-color: #f0f7ff;
        border-color: #3498db;
    }
    
    .data-source-info {
        display: inline-flex;
        align-items: center;
        background-color: #f0f7ff;
        padding: 5px 10px;
        border-radius: 4px;
        font-size: 0.9rem;
        color: #3498db;
        margin-bottom: 10px;
    }
    
    .data-source-info i {
        margin-right: 5px;
    }
    
    .data-category-selector {
        margin-bottom: 15px;
        padding: 10px;
        background-color: #f8f9fa;
        border-radius: 4px;
        border: 1px solid #eee;
    }
    
    .data-category-selector select {
        padding: 8px;
        border-radius: 4px;
        border: 1px solid #ddd;
        min-width: 180px;
        background-color: white;
    }
    
    .data-category-selector label {
        font-weight: bold;
        margin-right: 10px;
    }
    
    .date-range-selector {
        display: flex;
        align-items: center;
        gap: 10px;
    }
    
    .date-range-selector select {
        padding: 5px;
        border-radius: 4px;
        border: 1px solid #ddd;
    }
    
    #dataPointsIndicator {
        font-size: 0.85rem;
        color: #666;
    }
</style>
`);