// home.js - JavaScript for homepage with section navigation
document.addEventListener('DOMContentLoaded', function() {
    initializeHomepage();
    initializeSectionNavigation();
    initializeKeyboardNavigation();
});

function initializeHomepage() {
    // Initialize stats counter animation
    animateStats();
    
    // Initialize feature cards interaction
    initializeFeatureCards();
    
    // Initialize preview cards
    initializePreviewCards();
}

function initializeSectionNavigation() {
    const sections = document.querySelectorAll('.page-section');
    const dots = document.querySelectorAll('.nav-dot');
    const nextButtons = document.querySelectorAll('.next-section-btn');
    const prevButtons = document.querySelectorAll('.prev-section-btn');

    // Navigation dots click event
    dots.forEach(dot => {
        dot.addEventListener('click', function() {
            const targetSection = this.getAttribute('data-section');
            switchSection(targetSection);
        });
    });

    // Next section buttons
    nextButtons.forEach(button => {
        button.addEventListener('click', function() {
            const nextSection = this.getAttribute('data-next');
            switchSection(nextSection);
        });
    });

    // Previous section buttons
    prevButtons.forEach(button => {
        button.addEventListener('click', function() {
            const prevSection = this.getAttribute('data-prev');
            switchSection(prevSection);
        });
    });

    // Mouse wheel navigation
    let wheelTimeout;
    document.addEventListener('wheel', function(e) {
        clearTimeout(wheelTimeout);
        wheelTimeout = setTimeout(() => {
            if (e.deltaY > 0) {
                navigateToNextSection();
            } else if (e.deltaY < 0) {
                navigateToPrevSection();
            }
        }, 100);
    });

    // Touch swipe navigation for mobile
    let touchStartY = 0;
    document.addEventListener('touchstart', function(e) {
        touchStartY = e.touches[0].clientY;
    });

    document.addEventListener('touchend', function(e) {
        const touchEndY = e.changedTouches[0].clientY;
        const diff = touchStartY - touchEndY;

        if (Math.abs(diff) > 50) { // Minimum swipe distance
            if (diff > 0) {
                navigateToNextSection(); // Swipe up
            } else {
                navigateToPrevSection(); // Swipe down
            }
        }
    });
}

function switchSection(targetSection) {
    const sections = document.querySelectorAll('.page-section');
    const dots = document.querySelectorAll('.nav-dot');
    
    // Hide all sections
    sections.forEach(section => {
        section.classList.remove('active');
    });
    
    // Remove active class from all dots
    dots.forEach(dot => {
        dot.classList.remove('active');
    });
    
    // Show target section
    const targetElement = document.getElementById(targetSection);
    if (targetElement) {
        targetElement.classList.add('active');
        
        // Update active dot
        const activeDot = document.querySelector(`.nav-dot[data-section="${targetSection}"]`);
        if (activeDot) {
            activeDot.classList.add('active');
        }
        
        // Smooth scroll to top of section
        targetElement.scrollTo(0, 0);
    }
}

function navigateToNextSection() {
    const sections = Array.from(document.querySelectorAll('.page-section'));
    const currentSection = document.querySelector('.page-section.active');
    const currentIndex = sections.indexOf(currentSection);
    
    if (currentIndex < sections.length - 1) {
        const nextSection = sections[currentIndex + 1];
        switchSection(nextSection.id);
    }
}

function navigateToPrevSection() {
    const sections = Array.from(document.querySelectorAll('.page-section'));
    const currentSection = document.querySelector('.page-section.active');
    const currentIndex = sections.indexOf(currentSection);
    
    if (currentIndex > 0) {
        const prevSection = sections[currentIndex - 1];
        switchSection(prevSection.id);
    }
}

function initializeKeyboardNavigation() {
    document.addEventListener('keydown', function(e) {
        switch(e.key) {
            case 'ArrowDown':
                e.preventDefault();
                navigateToNextSection();
                break;
            case 'ArrowUp':
                e.preventDefault();
                navigateToPrevSection();
                break;
            case '1':
                e.preventDefault();
                switchSection('hero');
                break;
            case '2':
                e.preventDefault();
                switchSection('features');
                break;
            case '3':
                e.preventDefault();
                switchSection('posts');
                break;
        }
    });
}

function animateStats() {
    const statElements = document.querySelectorAll('.stat-number');
    
    statElements.forEach(stat => {
        const target = parseInt(stat.textContent);
        let current = 0;
        const increment = target / 50;
        const duration = 2000;
        const stepTime = duration / 50;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                stat.textContent = target + '+';
                clearInterval(timer);
            } else {
                stat.textContent = Math.floor(current) + '+';
            }
        }, stepTime);
    });
}

function initializeFeatureCards() {
    const featureCards = document.querySelectorAll('.feature-card');
    
    featureCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
}

function initializePreviewCards() {
    const previewCards = document.querySelectorAll('.preview-card');
    
    previewCards.forEach(card => {
        card.addEventListener('click', function(e) {
            if (!e.target.closest('a')) {
                const link = this.querySelector('a');
                if (link) {
                    link.click();
                }
            }
        });
    });
}

// Add loading animation
window.addEventListener('load', function() {
    document.body.classList.add('loaded');
});

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initializeHomepage,
        initializeSectionNavigation,
        initializeKeyboardNavigation
    };
}