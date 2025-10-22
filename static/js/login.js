// script.js - Main JavaScript file for the blog
document.addEventListener('DOMContentLoaded', function() {
    initializeTheme();
    initializeFormValidations();
    initializePasswordToggle();
    initializeCharacterCounter();
    initializePostInteractions();
    initializeAnimations();
});

// ==================== THEME & UI INITIALIZATION ====================
function initializeTheme() {
    // Add smooth scrolling to the entire document
    document.documentElement.style.scrollBehavior = 'smooth';
    
    // Initialize theme toggle if needed
    createThemeToggle();
}

function createThemeToggle() {
    // This can be expanded to add a light/dark mode toggle
    console.log('Theme system initialized - ready for toggle implementation');
}

// ==================== FORM VALIDATIONS ====================
function initializeFormValidations() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        form.addEventListener('submit', handleFormSubmit);
        
        const inputs = form.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', handleInputValidation);
            input.addEventListener('input', handleInputChange);
        });
    });
}

function handleFormSubmit(e) {
    const form = e.target;
    const submitButton = form.querySelector('button[type="submit"]');
    
    if (submitButton) {
        submitButton.classList.add('loading');
        submitButton.disabled = true;
        submitButton.innerHTML = 'Submitting...';
        
        // Re-enable button after 5 seconds in case of error
        setTimeout(() => {
            submitButton.classList.remove('loading');
            submitButton.disabled = false;
            submitButton.innerHTML = submitButton.getAttribute('data-original-text') || 'send';
        }, 5000);
    }
}

function handleInputValidation(e) {
    const input = e.target;
    const inputGroup = input.closest('.input-group');
    
    if (!inputGroup) return;
    
    if (input.value.trim() === '' && input.required) {
        inputGroup.classList.add('error');
        inputGroup.classList.remove('success');
    } else {
        inputGroup.classList.remove('error');
        inputGroup.classList.add('success');
    }
}

function handleInputChange(e) {
    const input = e.target;
    const inputGroup = input.closest('.input-group');
    
    if (!inputGroup) return;
    
    if (input.value.trim() !== '') {
        inputGroup.classList.remove('error');
    }
}

// ==================== PASSWORD TOGGLE ====================
function initializePasswordToggle() {
    const passwordInputs = document.querySelectorAll('input[type="password"]');
    
    passwordInputs.forEach(input => {
        createPasswordToggle(input);
    });
}

function createPasswordToggle(passwordInput) {
    const passwordContainer = document.createElement('div');
    passwordContainer.className = 'password-container';
    
    passwordInput.parentNode.insertBefore(passwordContainer, passwordInput);
    passwordContainer.appendChild(passwordInput);
    
    const toggleButton = document.createElement('button');
    toggleButton.type = 'button';
    toggleButton.className = 'password-toggle';
    toggleButton.innerHTML = '👁️';
    toggleButton.setAttribute('aria-label', 'Show password');
    passwordContainer.appendChild(toggleButton);
    
    toggleButton.addEventListener('click', function() {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        this.innerHTML = type === 'password' ? '👁️' : '👁️‍🗨️';
        this.setAttribute('aria-label', type === 'password' ? 'Show password' : 'Hide password');
    });
}

// ==================== CHARACTER COUNTER ====================
function initializeCharacterCounter() {
    const textareas = document.querySelectorAll('textarea');
    
    textareas.forEach(textarea => {
        createCharacterCounter(textarea);
    });
}

function createCharacterCounter(textarea) {
    const counter = document.createElement('div');
    counter.className = 'char-counter';
    counter.textContent = `0 character`;
    
    textarea.parentNode.appendChild(counter);
    
    textarea.addEventListener('input', function() {
        const length = this.value.length;
        const maxLength = this.getAttribute('maxlength');
        
        if (maxLength) {
            const remaining = maxLength - length;
            counter.textContent = `${length} / ${maxLength} character${length !== 1 ? 's' : ''}`;
            counter.style.color = remaining < 50 ? '#dc3545' : 'var(--text-muted)';
        } else {
            counter.textContent = `${length} character${length !== 1 ? 's' : ''}`;
        }
    });
    
    // Trigger initial count
    textarea.dispatchEvent(new Event('input'));
}

// ==================== POST INTERACTIONS ====================
function initializePostInteractions() {
    const postCards = document.querySelectorAll('.post-card');
    
    postCards.forEach(card => {
        card.addEventListener('mouseenter', handleCardHover);
        card.addEventListener('mouseleave', handleCardLeave);
        card.addEventListener('touchstart', handleCardTouch, { passive: true });
        
        // Add loading state for images
        const img = card.querySelector('img');
        if (img) {
            handleImageLoading(img);
        }
    });
    
    initializeDeleteConfirmations();
}

function handleCardHover(e) {
    const card = e.currentTarget;
    card.style.zIndex = '10';
    card.style.boxShadow = '0 15px 35px rgba(0, 0, 0, 0.4)';
}

function handleCardLeave(e) {
    const card = e.currentTarget;
    card.style.zIndex = '';
    card.style.boxShadow = '';
}

function handleCardTouch(e) {
    const card = e.currentTarget;
    card.style.transform = 'scale(0.98)';
    setTimeout(() => {
        card.style.transform = '';
    }, 150);
}

function handleImageLoading(img) {
    img.style.opacity = '0';
    img.style.transition = 'opacity 0.3s ease';
    
    img.onload = function() {
        this.style.opacity = '1';
    };
    
    if (img.complete) {
        img.style.opacity = '1';
    }
}

function initializeDeleteConfirmations() {
    const deleteButtons = document.querySelectorAll('.delete-btn');
    
    deleteButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
           if (!confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
                e.preventDefault();
                e.stopPropagation();
                
                this.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    this.style.transform = '';
                }, 200);
            } else {
                this.textContent = 'Deleting...';
                this.style.opacity = '0.7';
                this.style.pointerEvents = 'none';
            }
        });
    });
}

// ==================== ANIMATIONS ====================
function initializeAnimations() {
    initializeScrollAnimations();
    initializeHeaderParallax();
}

function initializeScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animationPlayState = 'running';
            }
        });
    }, observerOptions);
    
    document.querySelectorAll('.post-card').forEach(card => {
        observer.observe(card);
    });
}

function initializeHeaderParallax() {
    window.addEventListener('scroll', debounce(handleHeaderParallax, 10));
}

function handleHeaderParallax() {
    const scrolled = window.pageYOffset;
    const parallax = document.querySelector('h1');
    
    if (parallax) {
        const rate = scrolled * -0.5;
        parallax.style.transform = `translateY(${rate}px)`;
    }
}

// ==================== UTILITY FUNCTIONS ====================
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Image error handling
function initializeImageHandling() {
    const images = document.querySelectorAll('img');
    
    images.forEach(img => {
        img.addEventListener('error', function() {
            this.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMmQyZDJkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzg4ODg4OCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg';
            this.alt = 'Image not available';
        });
        
        if ('loading' in HTMLImageElement.prototype) {
            img.loading = 'lazy';
        }
    });
}

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initializeTheme,
        initializeFormValidations,
        initializePasswordToggle,
        initializeCharacterCounter,
        initializePostInteractions,
        initializeAnimations
    };
}