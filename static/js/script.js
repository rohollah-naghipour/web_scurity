document.addEventListener('DOMContentLoaded', function() {
    // Add simple hover effects
    const postCards = document.querySelectorAll('.post-card');
    
    postCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
    
    // Add click functionality
    postCards.forEach(card => {
        card.addEventListener('click', function() {
            // Add your click behavior here
            console.log('Post clicked');
        });
    });
});