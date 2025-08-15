/**
 * Financial Adventure - Main JavaScript
 * Common functionality shared across all pages
 */

// Initialize animations and effects when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize floating elements
    initFloatingElements();
    
    // Initialize any progress bars
    initProgressBars();
    
    // Add page transition effects
    addPageTransitions();
});

/**
 * Creates floating star and orb elements for cosmic theme
 */
function initFloatingElements() {
    // Only add stars and orbs to pages with the cosmic theme
    const cosmicContainers = document.querySelectorAll('.welcome-page, .dashboard-page');
    
    cosmicContainers.forEach(container => {
        // Create stars
        for (let i = 0; i < 20; i++) {
            createStar(container);
        }
        
        // Create orbs
        for (let i = 0; i < 5; i++) {
            createOrb(container);
        }
    });
}

/**
 * Creates a single star element with random properties
 */
function createStar(container) {
    const star = document.createElement('div');
    star.classList.add('star');
    
    // Random position
    const x = Math.random() * 100;
    const y = Math.random() * 100;
    
    // Random size
    const size = Math.random() * 4 + 1;
    
    // Random animation delay
    const delay = Math.random() * 5;
    
    // Set styles
    star.style.left = `${x}%`;
    star.style.top = `${y}%`;
    star.style.width = `${size}px`;
    star.style.height = `${size}px`;
    star.style.animationDelay = `${delay}s`;
    
    container.appendChild(star);
}

/**
 * Creates a single orb element with random properties
 */
function createOrb(container) {
    const orb = document.createElement('div');
    orb.classList.add('orb');
    
    // Random position
    const x = Math.random() * 100;
    const y = Math.random() * 100;
    
    // Random size
    const size = Math.random() * 150 + 50;
    
    // Random color
    const hue = Math.random() * 60 + 220; // Blue to purple range
    
    // Set styles
    orb.style.left = `${x}%`;
    orb.style.top = `${y}%`;
    orb.style.width = `${size}px`;
    orb.style.height = `${size}px`;
    orb.style.backgroundColor = `hsla(${hue}, 70%, 60%, 0.3)`;
    
    container.appendChild(orb);
}

/**
 * Initializes progress bars with animation
 */
function initProgressBars() {
    const progressBars = document.querySelectorAll('.progress-fill');
    
    progressBars.forEach(bar => {
        const targetWidth = bar.getAttribute('data-progress') || '0';
        
        // Use setTimeout to ensure the animation runs after initial render
        setTimeout(() => {
            bar.style.width = `${targetWidth}%`;
        }, 300);
    });
}

/**
 * Adds smooth page transition effects
 */
function addPageTransitions() {
    const links = document.querySelectorAll('a[href^="/"], button[data-href]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            // Only handle internal links
            const href = this.getAttribute('href') || this.getAttribute('data-href');
            if (!href || href.startsWith('http')) return;
            
            e.preventDefault();
            
            // Add exit animation to current page
            document.body.classList.add('page-exit');
            
            // Navigate after animation completes
            setTimeout(() => {
                window.location.href = href;
            }, 300);
        });
    });
}

/**
 * Shows a notification with animation
 * @param {string} message - The message to display
 * @param {string} type - The type of notification (success, error, info)
 */
function showNotification(message, type = 'info') {
    // Create notification element if it doesn't exist
    let notification = document.querySelector('.notification');
    
    if (!notification) {
        notification = document.createElement('div');
        notification.classList.add('notification');
        document.body.appendChild(notification);
    }
    
    // Set type class
    notification.className = 'notification';
    notification.classList.add(`notification-${type}`);
    
    // Set message
    notification.textContent = message;
    
    // Show notification
    notification.classList.add('show');
    
    // Hide after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

/**
 * Handles API calls with error handling
 * @param {string} url - The API endpoint
 * @param {Object} options - Fetch options
 * @returns {Promise} - The fetch promise
 */
async function fetchAPI(url, options = {}) {
    try {
        const response = await fetch(url, options);
        
        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('API request failed:', error);
        showNotification(`Request failed: ${error.message}`, 'error');
        throw error;
    }
}