/**
 * Financial Adventure - Welcome Page JavaScript
 * Handles welcome page specific animations and interactions
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize staggered animations
    initStaggeredAnimations();
    
    // Initialize rocket animation
    initRocketAnimation();
    
    // Initialize text effects
    initTextEffects();
});

/**
 * Initializes staggered animations for welcome page elements
 */
function initStaggeredAnimations() {
    // Elements to animate in sequence
    const elements = [
        document.querySelector('.welcome-title'),
        document.querySelector('.welcome-subtitle'),
        document.querySelector('.financial-adventure'),
        document.querySelector('.welcome-description'),
        document.querySelector('.cta-button')
    ];
    
    // Filter out any null elements
    const validElements = elements.filter(el => el !== null);
    
    // Apply staggered animations
    validElements.forEach((element, index) => {
        // Add initial hidden state
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        
        // Animate with delay based on index
        setTimeout(() => {
            element.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }, 300 + (index * 200)); // Stagger by 200ms
    });
}

/**
 * Initializes rocket animation
 */
function initRocketAnimation() {
    const rocket = document.querySelector('.rocket-icon');
    if (!rocket) return;
    
    // Add bounce effect
    setInterval(() => {
        rocket.classList.add('bounce');
        
        // Remove class after animation completes
        setTimeout(() => {
            rocket.classList.remove('bounce');
        }, 1000);
    }, 3000); // Bounce every 3 seconds
}

/**
 * Initializes text effects for the welcome page
 */
function initTextEffects() {
    // Gradient text effect for welcome title
    const welcomeTitle = document.querySelector('.welcome-title');
    if (welcomeTitle) {
        // Shift gradient colors over time
        let hue = 0;
        setInterval(() => {
            hue = (hue + 1) % 360;
            welcomeTitle.style.background = `linear-gradient(to right, 
                hsl(${hue}, 80%, 70%), 
                hsl(${(hue + 60) % 360}, 80%, 70%))`;
            welcomeTitle.style.webkitBackgroundClip = 'text';
            welcomeTitle.style.backgroundClip = 'text';
        }, 100);
    }
    
    // Pulsing animation for financial adventure text
    const financialAdventure = document.querySelector('.financial-adventure');
    if (financialAdventure) {
        setInterval(() => {
            financialAdventure.classList.add('pulse');
            
            // Remove class after animation completes
            setTimeout(() => {
                financialAdventure.classList.remove('pulse');
            }, 1000);
        }, 2000); // Pulse every 2 seconds
    }
}

/**
 * CSS class for bounce animation
 */
document.head.insertAdjacentHTML('beforeend', `
<style>
    @keyframes bounce {
        0%, 20%, 50%, 80%, 100% {transform: translateY(0);}
        40% {transform: translateY(-20px);}
        60% {transform: translateY(-10px);}
    }
    
    .bounce {
        animation: bounce 1s ease;
    }
    
    @keyframes pulse {
        0% {transform: scale(1);}
        50% {transform: scale(1.05);}
        100% {transform: scale(1);}
    }
    
    .pulse {
        animation: pulse 1s ease;
    }
</style>
`);