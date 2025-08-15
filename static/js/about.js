/**
 * Financial Adventure - About Page JavaScript
 * Handles about page specific animations and interactions
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize feature card animations
    initFeatureCards();
    
    // Initialize experience section animations
    initExperienceSection();
    
    // Initialize scroll animations
    initScrollAnimations();
});

/**
 * Initializes feature card animations
 */
function initFeatureCards() {
    const featureCards = document.querySelectorAll('.feature-card');
    
    // Add hover effects and staggered entrance
    featureCards.forEach((card, index) => {
        // Initial state (hidden)
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        
        // Staggered entrance animation
        setTimeout(() => {
            card.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, 300 + (index * 150)); // Stagger by 150ms
        
        // Add subtle movement on hover
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.03)';
            this.style.boxShadow = '0 15px 30px rgba(0, 0, 0, 0.15)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
            this.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.1)';
        });
    });
}

/**
 * Initializes experience section animations
 */
function initExperienceSection() {
    const experienceItems = document.querySelectorAll('.experience-item');
    const experienceSection = document.querySelector('.experience-section');
    
    if (!experienceSection) return;
    
    // Add entrance animation for the section
    experienceSection.style.opacity = '0';
    experienceSection.style.transform = 'translateY(30px)';
    
    // Animate section when it comes into view
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.transition = 'opacity 1s ease, transform 1s ease';
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                
                // Animate experience items with delay
                experienceItems.forEach((item, index) => {
                    setTimeout(() => {
                        item.classList.add('animate-item');
                    }, 500 + (index * 200));
                });
                
                // Unobserve after animation
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });
    
    observer.observe(experienceSection);
}

/**
 * Initializes scroll-based animations
 */
function initScrollAnimations() {
    // Elements to animate on scroll
    const animatedElements = document.querySelectorAll('.about-header, .about-cta');
    
    // Create intersection observer
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });
    
    // Observe each element
    animatedElements.forEach(element => {
        // Set initial state
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        
        observer.observe(element);
    });
}

/**
 * CSS for animations
 */
document.head.insertAdjacentHTML('beforeend', `
<style>
    .animate-item {
        animation: fadeInUp 0.8s ease forwards;
    }
    
    .visible {
        opacity: 1 !important;
        transform: translateY(0) !important;
        transition: opacity 0.8s ease, transform 0.8s ease;
    }
    
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
</style>
`);

/**
 * Handles the quest button click
 */
function startQuest() {
    const questButton = document.querySelector('.quest-button');
    
    if (questButton) {
        questButton.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Add click animation
            this.classList.add('quest-button-clicked');
            
            // Navigate to dashboard after animation
            setTimeout(() => {
                window.location.href = '/dashboard';
            }, 300);
        });
    }
}

// Initialize quest button
document.addEventListener('DOMContentLoaded', startQuest);