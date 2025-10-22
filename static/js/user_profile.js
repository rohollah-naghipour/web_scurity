// user_profile.js - JavaScript for user profile page
document.addEventListener('DOMContentLoaded', function() {
    initializeProfileAnimations();
    initializeInteractiveElements();
});

function initializeProfileAnimations() {
    // Animate stats cards
    const statCards = document.querySelectorAll('.stat-card');
    statCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            card.style.transition = 'all 0.6s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 100);
    });
    
    // Animate info items
    const infoItems = document.querySelectorAll('.info-item');
    infoItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateX(-20px)';
        
        setTimeout(() => {
            item.style.transition = 'all 0.5s ease';
            item.style.opacity = '1';
            item.style.transform = 'translateX(0)';
        }, 300 + (index * 50));
    });
}

function initializeInteractiveElements() {
    // Add click effects to action cards
    const actionCards = document.querySelectorAll('.action-card');
    actionCards.forEach(card => {
        card.addEventListener('mousedown', function() {
            this.style.transform = 'translateY(-1px) scale(0.98)';
        });
        
        card.addEventListener('mouseup', function() {
            this.style.transform = 'translateY(-3px) scale(1)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // Add hover effects to post cards
    const postCards = document.querySelectorAll('.post-card');
    postCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.3)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.boxShadow = 'none';
        });
    });
}

// Update relative time for last login
function updateRelativeTime() {
    const lastLoginElement = document.querySelector('.info-item:nth-child(4) .info-value');
    if (lastLoginElement) {
        const lastLoginText = lastLoginElement.textContent;
        // You can add relative time calculation here if needed
        console.log('Last login:', lastLoginText);
    }
}

// Initialize when page loads
initializeProfileAnimations();
initializeInteractiveElements();
updateRelativeTime();