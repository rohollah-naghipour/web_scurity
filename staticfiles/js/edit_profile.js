// edit_profile.js - JavaScript for profile editing page with password functionality
document.addEventListener('DOMContentLoaded', function() {
    initializeProfileForm();
    initializeRealTimeValidation();
    initializeFormAnimations();
    initializePasswordFeatures();
});

function initializeProfileForm() {
    const form = document.querySelector('.profile-form');
    const submitButton = form.querySelector('button[type="submit"]');
    
    form.addEventListener('submit', function(e) {
        // Add loading state to submit button
        if (submitButton) {
            const originalText = submitButton.innerHTML;
            submitButton.innerHTML = '<span class="btn-icon">⏳</span>Saving...';
            submitButton.classList.add('loading');
            submitButton.disabled = true;
            
            // Revert after 10 seconds if something goes wrong
            setTimeout(() => {
                submitButton.innerHTML = originalText;
                submitButton.classList.remove('loading');
                submitButton.disabled = false;
            }, 10000);
        }
    });
}

function initializePasswordFeatures() {
    // Clear password fields button
    const clearPasswordBtn = document.getElementById('clear-password');
    if (clearPasswordBtn) {
        clearPasswordBtn.addEventListener('click', function() {
            const passwordFields = document.querySelectorAll('input[type="password"]');
            passwordFields.forEach(field => {
                field.value = '';
            });
            showTemporaryMessage('Password fields cleared', 'success');
        });
    }
    
    // Password strength indicator
    const newPasswordField = document.querySelector('input[name="new_password1"]');
    if (newPasswordField) {
        newPasswordField.addEventListener('input', function() {
            updatePasswordStrength(this.value);
        });
    }
    
    // Toggle password visibility
    const passwordFields = document.querySelectorAll('.password-field');
    passwordFields.forEach(field => {
        const input = field.querySelector('input[type="password"]');
        const toggleBtn = document.createElement('button');
        toggleBtn.type = 'button';
        toggleBtn.className = 'password-toggle';
        toggleBtn.innerHTML = '👁️';
        toggleBtn.setAttribute('aria-label', 'Toggle password visibility');
        
        toggleBtn.addEventListener('click', function() {
            const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
            input.setAttribute('type', type);
            this.innerHTML = type === 'password' ? '👁️' : '👁️‍🗨️';
        });
        
        field.appendChild(toggleBtn);
    });
    
    // Real-time password matching
    const newPassword1 = document.querySelector('input[name="new_password1"]');
    const newPassword2 = document.querySelector('input[name="new_password2"]');
    
    if (newPassword1 && newPassword2) {
        newPassword2.addEventListener('input', function() {
            validatePasswordMatch();
        });
    }
}

function updatePasswordStrength(password) {
    let strength = 0;
    const strengthBar = document.querySelector('.strength-bar');
    
    if (!strengthBar) return;
    
    // Reset strength bar
    strengthBar.className = 'strength-bar';
    strengthBar.style.width = '0%';
    
    if (password.length === 0) return;
    
    // Length check
    if (password.length >= 8) strength += 1;
    
    // Character variety checks
    if (password.match(/[a-z]/)) strength += 1;
    if (password.match(/[A-Z]/)) strength += 1;
    if (password.match(/[0-9]/)) strength += 1;
    if (password.match(/[^a-zA-Z0-9]/)) strength += 1;
    
    // Update strength bar
    if (strength <= 2) {
        strengthBar.classList.add('strength-weak');
    } else if (strength <= 4) {
        strengthBar.classList.add('strength-medium');
    } else {
        strengthBar.classList.add('strength-strong');
    }
}

function validatePasswordMatch() {
    const newPassword1 = document.querySelector('input[name="new_password1"]');
    const newPassword2 = document.querySelector('input[name="new_password2"]');
    
    if (!newPassword1 || !newPassword2) return;
    
    if (newPassword2.value && newPassword1.value !== newPassword2.value) {
        newPassword2.style.borderColor = 'var(--error)';
    } else if (newPassword2.value) {
        newPassword2.style.borderColor = 'var(--success)';
    } else {
        newPassword2.style.borderColor = 'var(--light-gray)';
    }
}

function initializeRealTimeValidation() {
    const inputs = document.querySelectorAll('.form-input');
    
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        input.addEventListener('input', function() {
            clearFieldError(this);
        });
    });
}

function validateField(field) {
    const value = field.value.trim();
    const fieldContainer = field.closest('.form-group');
    
    // Clear previous errors
    clearFieldError(field);
    
    // Required field validation (for non-password required fields)
    if (field.required && !field.type.includes('password') && value === '') {
        showFieldError(field, 'This field is required');
        return false;
    }
    
    // Email validation
    if (field.type === 'email' && value !== '') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            showFieldError(field, 'Please enter a valid email address');
            return false;
        }
    }
    
    // Username validation
    if (field.name === 'username' && value !== '') {
        if (value.length < 3) {
            showFieldError(field, 'Username must be at least 3 characters long');
            return false;
        }
        
        const usernameRegex = /^[a-zA-Z0-9_]+$/;
        if (!usernameRegex.test(value)) {
            showFieldError(field, 'Username can only contain letters, numbers, and underscores');
            return false;
        }
    }
    
    // Show success state for non-password fields
    if (!field.type.includes('password')) {
        showFieldSuccess(field);
    }
    
    return true;
}

function showFieldError(field, message) {
    const fieldContainer = field.closest('.form-group');
    
    field.style.borderColor = 'var(--error)';
    
    const errorElement = document.createElement('div');
    errorElement.className = 'error-message';
    errorElement.textContent = message;
    
    fieldContainer.appendChild(errorElement);
}

function showFieldSuccess(field) {
    field.style.borderColor = 'var(--success)';
    
    // Remove success color after 2 seconds
    setTimeout(() => {
        field.style.borderColor = 'var(--light-gray)';
    }, 2000);
}

function clearFieldError(field) {
    const fieldContainer = field.closest('.form-group');
    const errorElement = fieldContainer.querySelector('.error-message');
    
    if (errorElement) {
        errorElement.remove();
    }
    
    field.style.borderColor = 'var(--light-gray)';
}

function showTemporaryMessage(message, type) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `password-success message-${type}`;
    messageDiv.textContent = message;
    messageDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 1000;
        padding: 15px 20px;
        border-radius: 8px;
        background: ${type === 'success' ? 'var(--success)' : 'var(--error)'};
        color: white;
        font-weight: 500;
    `;
    
    document.body.appendChild(messageDiv);
    
    setTimeout(() => {
        messageDiv.remove();
    }, 3000);
}

function initializeFormAnimations() {
    const formSections = document.querySelectorAll('.form-section');
    
    formSections.forEach((section, index) => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            section.style.transition = 'all 0.6s ease';
            section.style.opacity = '1';
            section.style.transform = 'translateY(0)';
        }, index * 200);
    });
}