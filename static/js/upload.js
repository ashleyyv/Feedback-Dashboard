/**
 * Financial Adventure - Upload Page JavaScript
 * Handles file upload, data preview, and processing
 */

document.addEventListener('DOMContentLoaded', function() {
    // Get form elements
    const uploadForm = document.getElementById('uploadForm');
    const dataFileInput = document.getElementById('dataFile');
    const dataSymbolInput = document.getElementById('dataSymbol');
    const dataCategorySelect = document.getElementById('dataCategory');
    const customCategoryGroup = document.getElementById('customCategoryGroup');
    const customCategoryInput = document.getElementById('customCategory');
const dateColumnSelect = document.getElementById('dateColumn');
    const valueColumnSelect = document.getElementById('valueColumn');
    const descriptionColumnSelect = document.getElementById('descriptionColumn');
    const columnMappingPreviewSection = document.getElementById('columnMappingPreviewSection');
    const columnMappingList = document.getElementById('columnMappingList');
    const previewBtn = document.getElementById('previewBtn');
    const uploadStatus = document.getElementById('uploadStatus');
    const statusMessage = document.getElementById('statusMessage');
    const progressBar = document.getElementById('progressBar');
    const previewSection = document.getElementById('previewSection');
    const closePreviewBtn = document.getElementById('closePreviewBtn');
    const resultsSection = document.getElementById('resultsSection');
    const uploadAnotherBtn = document.getElementById('uploadAnotherBtn');
    
    // File data storage
    let fileData = null;
    let fileName = '';
    let fileSize = 0;
    
    // Show/hide custom category input based on selection
    dataCategorySelect.addEventListener('change', function() {
        if (this.value === 'Custom') {
            customCategoryGroup.style.display = 'block';
            customCategoryInput.setAttribute('required', 'required');
        } else {
            customCategoryGroup.style.display = 'none';
            customCategoryInput.removeAttribute('required');
        }
    });
    
    // Enable preview button when file is selected
    dataFileInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            fileName = file.name;
            fileSize = file.size;
            previewBtn.disabled = false;
            
            // Read the file
            const reader = new FileReader();
            reader.onload = function(event) {
                try {
                    // Parse file based on type
                    if (file.name.endsWith('.csv')) {
                        fileData = parseCSV(event.target.result);
                    } else if (file.name.endsWith('.json')) {
                        fileData = JSON.parse(event.target.result);
                    } else if (file.name.endsWith('.xlsx')) {
                        // For Excel files, we'd need a library like SheetJS
                        // This is a placeholder for now
                        fileData = [{ message: "Excel parsing would be implemented with a library" }];
                        showNotification("Excel parsing is a placeholder. In a real app, we'd use a library like SheetJS.", "warning");
                    }
                } catch (error) {
                    showNotification("Error parsing file: " + error.message, "error");
                    fileData = null;
                    previewBtn.disabled = true;

        // Clear and reset column dropdowns
        populateColumnDropdowns([]);
                }
            };
            
            if (file.name.endsWith('.csv') || file.name.endsWith('.json')) {
                reader.readAsText(file);
            } else {
                reader.readAsArrayBuffer(file);
            }
        } else {
            previewBtn.disabled = true;

        // Clear and reset column dropdowns
        populateColumnDropdowns([]);
        }
    });
    
    // Preview button click handler
    previewBtn.addEventListener('click', function() {
        if (!fileData) {
            showNotification("No data to preview", "error");
            return;
        }
        
        showDataPreview(fileData);
        updateColumnMappingPreview(); // Also update mapping preview when previewing data
    });
    
    // Close preview button
    closePreviewBtn.addEventListener('click', function() {
        previewSection.style.display = 'none';
    });
    
    // Upload another button
    uploadAnotherBtn.addEventListener('click', function() {
        // Reset form
        uploadForm.reset();
        
        // Hide results section
        resultsSection.style.display = 'none';
        
        // Hide preview section
        previewSection.style.display = 'none';
        
        // Reset file data
        fileData = null;
        fileName = '';
// Populate column dropdowns
    function populateColumnDropdowns(headers) {
        // Clear existing options
        dateColumnSelect.innerHTML = '&lt;option value=""&gt;Select Date Column&lt;/option&gt;';
        valueColumnSelect.innerHTML = '&lt;option value=""&gt;Select Value Column&lt;/option&gt;';
        descriptionColumnSelect.innerHTML = '&lt;option value=""&gt;Select Description Column (Optional)&lt;/option&gt;';
        
        headers.forEach(header => {
            const optionDate = document.createElement('option');
            optionDate.value = header;
            optionDate.textContent = header;
            dateColumnSelect.appendChild(optionDate);
            
            const optionValue = document.createElement('option');
            optionValue.value = header;
            optionValue.textContent = header;
            valueColumnSelect.appendChild(optionValue);
            
            const optionDescription = document.createElement('option');
            optionDescription.value = header;
            optionDescription.textContent = header;
            descriptionColumnSelect.appendChild(optionDescription);
        });
    }

    // Event listener for column selection changes to update mapping preview
    [dateColumnSelect, valueColumnSelect, descriptionColumnSelect].forEach(selectElement => {
        selectElement.addEventListener('change', updateColumnMappingPreview);
    });

    // Update column mapping preview
    function updateColumnMappingPreview() {
        columnMappingList.innerHTML = ''; // Clear previous preview

        const dateCol = dateColumnSelect.value;
        const valueCol = valueColumnSelect.value;
        const descCol = descriptionColumnSelect.value;

        if (dateCol) {
            const li = document.createElement('li');
            li.innerHTML = '&lt;strong&gt;Date Column:&lt;/strong&gt; &lt;span&gt;${dateCol}&lt;/span&gt;';
            columnMappingList.appendChild(li);
        }
        if (valueCol) {
            const li = document.createElement('li');
            li.innerHTML = '&lt;strong&gt;Value Column:&lt;/strong&gt; &lt;span&gt;${valueCol}&lt;/span&gt;';
            columnMappingList.appendChild(li);
        }
        if (descCol) {
            const li = document.createElement('li');
            li.innerHTML = '&lt;strong&gt;Description Column:&lt;/strong&gt; &lt;span&gt;${descCol}&lt;/span&gt;';
            columnMappingList.appendChild(li);
        }

        if (dateCol || valueCol || descCol) {
            columnMappingPreviewSection.style.display = 'block';
            columnMappingPreviewSection.scrollIntoView({ behavior: 'smooth' });
        } else {
            columnMappingPreviewSection.style.display = 'none';
        }
    }
        fileSize = 0;
        
        // Disable preview button
        previewBtn.disabled = true;

        // Clear and reset column dropdowns
        populateColumnDropdowns([]);
    });
    
    // Form submission
    uploadForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (!fileData) {
            showNotification("Please select a file to upload", "error");
            return;
        }
        
        // Get form values
        const symbol = dataSymbolInput.value.trim().toUpperCase();
        let category = dataCategorySelect.value;
        
        if (category === 'Custom') {
            category = customCategoryInput.value.trim();
            if (!category) {
                showNotification("Please enter a custom category name", "error");
                return;
            }
        }
        
        // Get mapping values
        const dateColumn = dateColumnSelect.value;
        const valueColumn = valueColumnSelect.value;
        const descriptionColumn = descriptionColumnSelect.value;
        
        if (!dateColumn || !valueColumn) {
            showNotification("Please specify date and value column names", "error");
            return;
        }
        
        // Show upload status
        uploadStatus.style.display = 'block';
        statusMessage.textContent = "Processing your data...";
        progressBar.style.width = "0%";
        
        // Simulate progress (in a real app, this would be based on actual progress)
        let progress = 0;
        const progressInterval = setInterval(function() {
            progress += 5;
            progressBar.style.width = progress + "%";
            
            if (progress >= 100) {
                clearInterval(progressInterval);
                
                // Process the data
                processData(fileData, {
                    symbol: symbol,
                    category: category,
                    dateColumn: dateColumn,
                    valueColumn: valueColumn,
                    descriptionColumn: descriptionColumn
                });
            }
        }, 200);
    });
    
    /**
// Populate column dropdowns with detected headers
        populateColumnDropdowns(headers);
     * Parse CSV data
     * @param {string} csvText - CSV text content
     * @returns {Array} - Array of objects representing the CSV data
     */
    function parseCSV(csvText) {
        // Simple CSV parser (for a real app, consider using a library like PapaParse)
        const lines = csvText.split('\n');
        const headers = lines[0].split(',').map(header => header.trim());
        const result = [];
        
        for (let i = 1; i < lines.length; i++) {
            if (!lines[i].trim()) continue; // Skip empty lines
            
            const values = lines[i].split(',');
            const obj = {};
            
            for (let j = 0; j < headers.length; j++) {
                obj[headers[j]] = values[j] ? values[j].trim() : '';
            }
            
            result.push(obj);
        }
        
        return result;
    }
    
    /**
     * Show data preview
     * @param {Array} data - Data to preview
     */
    function showDataPreview(data) {
        if (!data || !data.length) {
            showNotification("No data to preview", "error");
            return;
        }
        
        const previewHeader = document.getElementById('previewHeader');
        const previewBody = document.getElementById('previewBody');
        const previewCount = document.getElementById('previewCount');
        
        // Clear previous content
        previewHeader.innerHTML = '';
        previewBody.innerHTML = '';
        
        // Get headers from first row
        const headers = Object.keys(data[0]);
        
        // Create header row
        headers.forEach(header => {
            const th = document.createElement('th');
            th.textContent = header;
            previewHeader.appendChild(th);
        });
        
        // Create data rows (limit to 10 for preview)
        const rowCount = Math.min(10, data.length);
        for (let i = 0; i < rowCount; i++) {
            const tr = document.createElement('tr');
            
            headers.forEach(header => {
                const td = document.createElement('td');
                td.textContent = data[i][header] || '';
                tr.appendChild(td);
            });
            
            previewBody.appendChild(tr);
        }
        
        // Update preview count
        previewCount.textContent = `Showing first ${rowCount} of ${data.length} rows`;
        
        // Show preview section
        previewSection.style.display = 'block';
        
        // Scroll to preview section
        previewSection.scrollIntoView({ behavior: 'smooth' });
    }
    
    /**
     * Process the uploaded data
     * @param {Array} data - Data to process
     * @param {Object} options - Processing options
     */
    function processData(data, options) {
        // In a real app, this would send the data to the server for processing
        // For now, we'll simulate the processing
        
        // Prepare the data for submission
        const processedData = data.map(item => {
            return {
                date: item[options.dateColumn] || '',
                value: item[options.valueColumn] || '',
                description: options.descriptionColumn ? (item[options.descriptionColumn] || options.symbol) : options.symbol
            };
        });
        
        // Create form data for submission
        const formData = new FormData();
        formData.append('data', JSON.stringify(processedData));
        formData.append('symbol', options.symbol);
        formData.append('category', options.category);
        
        // Send data to server
        fetch('/process_uploaded_data', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(result => {
            // Hide upload status
            uploadStatus.style.display = 'none';
            
            // Update results
            document.getElementById('fileDetails').textContent = `${fileName} (${formatFileSize(fileSize)})`;
            document.getElementById('recordCount').textContent = `${processedData.length} records standardized and stored`;
            
            // Show results section
            resultsSection.style.display = 'block';
            
            // Scroll to results section
            resultsSection.scrollIntoView({ behavior: 'smooth' });
            
            // Show success notification
            showNotification(`Successfully processed ${processedData.length} records`, "success");
        })
        .catch(error => {
            // Hide upload status
            uploadStatus.style.display = 'none';
            
            // Show error notification
            showNotification("Error processing data: " + error.message, "error");
        });
    }
    
    /**
     * Format file size in human-readable format
     * @param {number} bytes - File size in bytes
     * @returns {string} - Formatted file size
// Add CSS for column mapping preview
const style = document.createElement('style');
style.textContent = `
    .mapping-preview-list {
        list-style: none;
        padding: 0;
        margin-top: 15px;
        border-top: 1px solid #eee;
        padding-top: 15px;
    }
    .mapping-preview-list li {
        margin-bottom: 10px;
        font-size: 1rem;
        color: #333;
    }
    .mapping-preview-list li strong {
        color: #555;
        display: inline-block;
        width: 120px; /* Align labels */
    }
    .mapping-preview-list li span {
        font-weight: bold;
        color: #3498db;
    }
`;
document.head.appendChild(style);
// Add CSS for column mapping preview
const style = document.createElement('style');
style.textContent = `
    .mapping-preview-list {
        list-style: none;
        padding: 0;
        margin-top: 15px;
        border-top: 1px solid #eee;
        padding-top: 15px;
    }
    .mapping-preview-list li {
        margin-bottom: 10px;
        font-size: 1rem;
        color: #333;
    }
    .mapping-preview-list li strong {
        color: #555;
        display: inline-block;
        width: 120px; /* Align labels */
    }
    .mapping-preview-list li span {
        font-weight: bold;
        color: #3498db;
    }
`;
document.head.appendChild(style);
// Add CSS for column mapping preview
document.head.insertAdjacentHTML('beforeend', `
&lt;style&gt;
    .mapping-preview-list {
        list-style: none;
        padding: 0;
        margin-top: 15px;
        border-top: 1px solid #eee;
        padding-top: 15px;
    }
    .mapping-preview-list li {
        margin-bottom: 10px;
        font-size: 1rem;
        color: #333;
    }
    .mapping-preview-list li strong {
        color: #555;
        display: inline-block;
        width: 120px; /* Align labels */
    }
    .mapping-preview-list li span {
        font-weight: bold;
        color: #3498db;
    }
&lt;/style&gt;
`);
// Add CSS for column mapping preview
const style = document.createElement('style');
style.textContent = `
    .mapping-preview-list {
        list-style: none;
        padding: 0;
        margin-top: 15px;
        border-top: 1px solid #eee;
        padding-top: 15px;
    }
    .mapping-preview-list li {
        margin-bottom: 10px;
        font-size: 1rem;
        color: #333;
    }
    .mapping-preview-list li strong {
        color: #555;
        display: inline-block;
        width: 120px; /* Align labels */
    }
    .mapping-preview-list li span {
        font-weight: bold;
        color: #3498db;
    }
`;
document.head.appendChild(style);
// Add CSS for column mapping preview
document.head.insertAdjacentHTML('beforeend', `
&lt;style&gt;
    .mapping-preview-list {
        list-style: none;
        padding: 0;
        margin-top: 15px;
        border-top: 1px solid #eee;
        padding-top: 15px;
    }
    .mapping-preview-list li {
        margin-bottom: 10px;
        font-size: 1rem;
        color: #333;
    }
    .mapping-preview-list li strong {
        color: #555;
        display: inline-block;
        width: 120px; /* Align labels */
    }
    .mapping-preview-list li span {
        font-weight: bold;
        color: #3498db;
    }
&lt;/style&gt;
`);
// Add CSS for column mapping preview
document.head.insertAdjacentHTML('beforeend', `
&lt;style&gt;
    .mapping-preview-list {
        list-style: none;
        padding: 0;
        margin-top: 15px;
        border-top: 1px solid #eee;
        padding-top: 15px;
    }
    .mapping-preview-list li {
        margin-bottom: 10px;
        font-size: 1rem;
        color: #333;
    }
    .mapping-preview-list li strong {
        color: #555;
        display: inline-block;
        width: 120px; /* Align labels */
    }
    .mapping-preview-list li span {
        font-weight: bold;
        color: #3498db;
    }
&lt;/style&gt;
`);
// Add CSS for column mapping preview
document.head.insertAdjacentHTML('beforeend', `
&lt;style&gt;
    .mapping-preview-list {
        list-style: none;
        padding: 0;
        margin-top: 15px;
        border-top: 1px solid #eee;
        padding-top: 15px;
    }
    .mapping-preview-list li {
        margin-bottom: 10px;
        font-size: 1rem;
        color: #333;
    }
    .mapping-preview-list li strong {
        color: #555;
        display: inline-block;
        width: 120px; /* Align labels */
    }
    .mapping-preview-list li span {
        font-weight: bold;
        color: #3498db;
    }
&lt;/style&gt;
`);
// Add CSS for column mapping preview
document.head.insertAdjacentHTML('beforeend', `
&lt;style&gt;
    .mapping-preview-list {
        list-style: none;
        padding: 0;
        margin-top: 15px;
        border-top: 1px solid #eee;
        padding-top: 15px;
    }
    .mapping-preview-list li {
        margin-bottom: 10px;
        font-size: 1rem;
        color: #333;
    }
    .mapping-preview-list li strong {
        color: #555;
        display: inline-block;
        width: 120px; /* Align labels */
    }
    .mapping-preview-list li span {
        font-weight: bold;
        color: #3498db;
    }
&lt;/style&gt;
`);
     */
    function formatFileSize(bytes) {
// Add CSS for column mapping preview
document.head.insertAdjacentHTML('beforeend', `
&lt;style&gt;
    .mapping-preview-list {
        list-style: none;
        padding: 0;
        margin-top: 15px;
        border-top: 1px solid #eee;
        padding-top: 15px;
    }
    .mapping-preview-list li {
        margin-bottom: 10px;
        font-size: 1rem;
        color: #333;
    }
    .mapping-preview-list li strong {
        color: #555;
        display: inline-block;
        width: 120px; /* Align labels */
    }
    .mapping-preview-list li span {
        font-weight: bold;
        color: #3498db;
    }
&lt;/style&gt;
`);
        if (bytes === 0) return '0 Bytes';
        
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
    
    /**
     * Show notification
     * @param {string} message - Notification message
     * @param {string} type - Notification type (success, error, warning, info)
     */
    function showNotification(message, type = 'info') {
        // Check if notification container exists
        let container = document.querySelector('.notification-container');
        
        // Create container if it doesn't exist
        if (!container) {
            container = document.createElement('div');
            container.className = 'notification-container';
            document.body.appendChild(container);
        }
        
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        
        // Add icon based on type
        let icon = '';
        switch (type) {
            case 'success':
                icon = '<i class="fas fa-check-circle"></i>';
                break;
            case 'error':
                icon = '<i class="fas fa-exclamation-circle"></i>';
                break;
            case 'warning':
                icon = '<i class="fas fa-exclamation-triangle"></i>';
                break;
            default:
                icon = '<i class="fas fa-info-circle"></i>';
        }
        
        // Set notification content
        notification.innerHTML = `
            ${icon}
            <span>${message}</span>
            <button class="close-notification"><i class="fas fa-times"></i></button>
        `;
        
        // Add to container
        container.appendChild(notification);
        
        // Add event listener to close button
        notification.querySelector('.close-notification').addEventListener('click', function() {
            notification.classList.add('fade-out');
            setTimeout(() => {
                notification.remove();
            }, 300);
        });
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.classList.add('fade-out');
                setTimeout(() => {
                    if (notification.parentNode) {
                        notification.remove();
                    }
                }, 300);
            }
        }, 5000);
    }
});

// Add CSS for notifications and upload page
document.head.insertAdjacentHTML('beforeend', `
<style>
    /* Upload Form Styles */
    .upload-form-container {
        padding: 20px;
    }
    
    .form-group {
        margin-bottom: 20px;
    }
    
    .form-group label {
        display: block;
        font-weight: bold;
        margin-bottom: 5px;
    }
    
    .form-group input[type="file"],
    .form-group input[type="text"],
    .form-group select {
        width: 100%;
        padding: 10px;
        border: 1px solid #ddd;
        border-radius: 4px;
        font-size: 16px;
    }
    
    .form-help {
        font-size: 0.85rem;
        color: #666;
        margin-top: 5px;
    }
    
    .mapping-section {
        background-color: #f8f9fa;
        padding: 15px;
        border-radius: 4px;
        border: 1px solid #eee;
    }
    
    .mapping-section h3 {
        margin-top: 0;
        margin-bottom: 10px;
    }
    
    .mapping-fields {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
        gap: 15px;
    }
    
    .mapping-field {
        margin-bottom: 10px;
    }
    
    .form-actions {
        display: flex;
        gap: 10px;
        margin-top: 20px;
    }
    
    .primary-button {
        background-color: #3498db;
        color: white;
        border: none;
        padding: 10px 20px;
        border-radius: 4px;
        cursor: pointer;
        font-size: 16px;
        display: inline-flex;
        align-items: center;
        text-decoration: none;
    }
    
    .primary-button i {
        margin-right: 8px;
    }
    
    .primary-button:hover {
        background-color: #2980b9;
    }
    
    .secondary-button {
        background-color: #f8f9fa;
        color: #333;
        border: 1px solid #ddd;
        padding: 10px 20px;
        border-radius: 4px;
        cursor: pointer;
        font-size: 16px;
        display: inline-flex;
        align-items: center;
    }
    
    .secondary-button i {
        margin-right: 8px;
    }
    
    .secondary-button:hover {
        background-color: #e9ecef;
    }
    
    .secondary-button:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }
    
    /* Upload Status Styles */
    .upload-status {
        margin-top: 20px;
        padding: 20px;
        background-color: #f8f9fa;
        border-radius: 4px;
        text-align: center;
    }
    
    .progress-bar-container {
        height: 10px;
        background-color: #e9ecef;
        border-radius: 5px;
        margin-top: 15px;
        overflow: hidden;
    }
    
    .progress-bar {
        height: 100%;
        background-color: #3498db;
        width: 0%;
        transition: width 0.3s ease;
    }
    
    /* Preview Section Styles */
    .preview-container {
        padding: 20px;
    }
    
    .preview-controls {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 15px;
    }
    
    .close-button {
        background: none;
        border: none;
        color: #666;
        cursor: pointer;
        font-size: 18px;
    }
    
    .close-button:hover {
        color: #333;
    }
    
    .preview-table-container {
        overflow-x: auto;
    }
    
    .preview-table {
        width: 100%;
        border-collapse: collapse;
    }
    
    .preview-table th {
        background-color: #f8f9fa;
        padding: 10px;
        text-align: left;
        border-bottom: 2px solid #ddd;
    }
    
    .preview-table td {
        padding: 8px 10px;
        border-bottom: 1px solid #eee;
    }
    
    .preview-table tr:nth-child(even) {
        background-color: #f8f9fa;
    }
    
    /* Results Section Styles */
    .results-container {
        padding: 20px;
    }
    
    .upload-results {
        margin-bottom: 20px;
    }
    
    .result-item {
        display: flex;
        align-items: flex-start;
        margin-bottom: 15px;
        padding: 15px;
        background-color: #f8f9fa;
        border-radius: 4px;
    }
    
    .result-item i {
        font-size: 24px;
        color: #3498db;
        margin-right: 15px;
        margin-top: 3px;
    }
    
    .result-details h3 {
        margin-top: 0;
        margin-bottom: 5px;
    }
    
    .result-details p {
        margin: 0;
        color: #666;
    }
    
    .result-actions {
        display: flex;
        gap: 10px;
    }
    
    /* Notification Styles */
    .notification-container {
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 1000;
        display: flex;
        flex-direction: column;
        gap: 10px;
    }
    
    .notification {
        display: flex;
        align-items: center;
        padding: 15px;
        border-radius: 4px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        min-width: 300px;
        max-width: 400px;
        animation: slide-in 0.3s ease;
    }
    
    .notification.fade-out {
        animation: fade-out 0.3s ease forwards;
    }
    
    .notification i {
        margin-right: 10px;
        font-size: 18px;
    }
    
    .notification span {
        flex-grow: 1;
    }
    
    .notification .close-notification {
        background: none;
        border: none;
        cursor: pointer;
        color: inherit;
        opacity: 0.7;
    }
    
    .notification .close-notification:hover {
        opacity: 1;
    }
    
    .notification.success {
        background-color: #d4edda;
        color: #155724;
    }
    
    .notification.error {
        background-color: #f8d7da;
        color: #721c24;
    }
    
    .notification.warning {
        background-color: #fff3cd;
        color: #856404;
    }
    
    .notification.info {
        background-color: #d1ecf1;
        color: #0c5460;
    }
    
    @keyframes slide-in {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes fade-out {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
</style>
`);