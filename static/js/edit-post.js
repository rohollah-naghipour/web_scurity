// edit-post.js - JavaScript for post edit page
document.addEventListener('DOMContentLoaded', function() {
    const isEditPage = window.location.pathname.includes('/edit/');
    if (!isEditPage) return; // فقط در صفحات edit فعال می‌شود

    initializeEditForm();
    initializeImagePreview();
    initializeFormValidation();
});

// ==================== FORM INITIALIZATION ====================
function initializeEditForm() {
    const form = document.querySelector('form');
    const formContainer = document.querySelector('.form-container');
    
    if (!form || !formContainer) return;
    
    // استایل دادن به فرم کانتینر
    formContainer.style.cssText = `
        max-width: 700px;
        margin: 40px auto;
        padding: 30px;
        background: var(--dark-gray, #1a1a1a);
        border-radius: 12px;
        border: 1px solid var(--light-gray, #404040);
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
    `;
    
    // استایل دادن به عنوان
    const title = formContainer.querySelector('h1');
    if (title) {
        title.style.cssText = `
            color: var(--text-lighter, #ffffff);
            text-align: center;
            margin-bottom: 30px;
            font-size: 2rem;
            font-weight: 300;
            border-bottom: 2px solid var(--accent, #555);
            padding-bottom: 15px;
        `;
    }
    
    // استایل دادن به فیلدهای فرم
    styleFormFields(form);
}

function styleFormFields(form) {
    const inputGroups = form.querySelectorAll('.input-group');
    
    inputGroups.forEach(group => {
        group.style.cssText = `
            margin-bottom: 25px;
            direction: rtl;
        `;
        
        const label = group.querySelector('label');
        const input = group.querySelector('input');
        const textarea = group.querySelector('textarea');
        const errors = group.querySelector('.errorlist');
        
        if (label) {
            label.style.cssText = `
                display: block;
                color: var(--text-lighter, #ffffff);
                margin-bottom: 8px;
                font-weight: 500;
                font-size: 1rem;
            `;
        }
        
        if (input && input.type !== 'file') {
            input.style.cssText = `
                width: 100%;
                padding: 12px 15px;
                border-radius: 8px;
                background: var(--medium-gray, #2d2d2d);
                border: 1px solid var(--light-gray, #404040);
                color: var(--text-light, #e0e0e0);
                font-size: 1rem;
                transition: all 0.3s ease;
                direction: rtl;
            `;
            
            input.addEventListener('focus', function() {
                this.style.borderColor = 'var(--accent, #555)';
                this.style.boxShadow = '0 0 0 3px rgba(85, 85, 85, 0.2)';
                this.style.background = '#323232';
            });
            
            input.addEventListener('blur', function() {
                this.style.borderColor = 'var(--light-gray, #404040)';
                this.style.boxShadow = 'none';
                this.style.background = 'var(--medium-gray, #2d2d2d)';
            });
        }
        
        // استایل file input
        const fileInput = group.querySelector('input[type="file"]');
        if (fileInput) {
            styleFileInput(fileInput);
        }
        
        // استایل textarea
        if (textarea) {
            textarea.style.cssText = `
                width: 100%;
                min-height: 200px;
                padding: 12px 15px;
                border-radius: 8px;
                background: var(--medium-gray, #2d2d2d);
                border: 1px solid var(--light-gray, #404040);
                color: var(--text-light, #e0e0e0);
                font-size: 1rem;
                resize: vertical;
                transition: all 0.3s ease;
                direction: rtl;
                line-height: 1.6;
            `;
            
            textarea.addEventListener('focus', function() {
                this.style.borderColor = 'var(--accent, #555)';
                this.style.boxShadow = '0 0 0 3px rgba(85, 85, 85, 0.2)';
                this.style.background = '#323232';
            });
            
            textarea.addEventListener('blur', function() {
                this.style.borderColor = 'var(--light-gray, #404040)';
                this.style.boxShadow = 'none';
                this.style.background = 'var(--medium-gray, #2d2d2d)';
            });
            
            // اضافه کردن شمارنده کاراکتر
            addCharacterCounter(textarea);
        }
        
        // استایل خطاها
        if (errors) {
            errors.style.cssText = `
                color: #dc3545;
                font-size: 0.85rem;
                margin-top: 5px;
                direction: rtl;
                list-style: none;
                padding: 0;
            `;
        }
    });
    
    // استایل دادن به دکمه Submit
    const submitButton = form.querySelector('button[type="submit"]');
    if (submitButton) {
        submitButton.style.cssText = `
            background: var(--accent, #555);
            color: var(--text-lighter, #ffffff);
            border: none;
            padding: 14px 30px;
            border-radius: 8px;
            cursor: pointer;
            font-size: 1.1rem;
            font-weight: 500;
            transition: all 0.3s ease;
            width: 100%;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-top: 20px;
        `;
        
        submitButton.addEventListener('mouseenter', function() {
            this.style.background = 'var(--accent-hover, #666)';
            this.style.transform = 'translateY(-2px)';
            this.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.3)';
        });
        
        submitButton.addEventListener('mouseleave', function() {
            this.style.background = 'var(--accent, #555)';
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = 'none';
        });
        
        // تغییر handler برای جلوگیری از جلوگیری ارسال فرم
        submitButton.addEventListener('click', function(e) {
            // فقط تغییرات ظاهری، جلوگیری از ارسال فرم نداریم
            const originalText = this.textContent;
            this.innerHTML = 'در حال ذخیره...';
            this.disabled = true;
            this.style.opacity = '0.7';
            
            // فعال کردن مجدد دکمه بعد از 10 ثانیه در صورت خطا
            setTimeout(() => {
                this.innerHTML = originalText;
                this.disabled = false;
                this.style.opacity = '1';
            }, 10000);
        });
    }
}

function styleFileInput(fileInput) {
    const container = fileInput.closest('.input-group');
    
    fileInput.style.cssText = `
        width: 100%;
        padding: 12px 15px;
        border-radius: 8px;
        background: var(--medium-gray, #2d2d2d);
        border: 1px solid var(--light-gray, #404040);
        color: var(--text-light, #e0e0e0);
        font-size: 1rem;
        transition: all 0.3s ease;
        cursor: pointer;
    `;
    
    // ایجاد استایل سفارشی برای input file
    fileInput.addEventListener('change', function() {
        const fileName = this.files[0] ? this.files[0].name : 'هیچ فایلی انتخاب نشده';
        const fileDisplay = document.createElement('div');
        fileDisplay.className = 'file-display';
        fileDisplay.style.cssText = `
            color: var(--text-muted, #888);
            font-size: 0.9rem;
            margin-top: 5px;
            direction: rtl;
        `;
        fileDisplay.textContent = `فایل انتخاب شده: ${fileName}`;
        
        // حذف نمایشگر قبلی
        const existingDisplay = container.querySelector('.file-display');
        if (existingDisplay) {
            existingDisplay.remove();
        }
        
        container.appendChild(fileDisplay);
        
        // نمایش پیش‌نمایش برای تصاویر
        if (this.files[0] && this.files[0].type.startsWith('image/')) {
            showImagePreview(this.files[0]);
        }
    });
}

// ==================== IMAGE PREVIEW ====================
function initializeImagePreview() {
    // این تابع اکنون در styleFileInput صدا زده می‌شود
}

function showImagePreview(file) {
    const reader = new FileReader();
    
    reader.onload = function(e) {
        // حذف پیش‌نمایش قبلی
        const existingPreview = document.querySelector('.image-preview');
        if (existingPreview) {
            existingPreview.remove();
        }
        
        const preview = document.createElement('div');
        preview.className = 'image-preview';
        preview.style.cssText = `
            margin: 15px 0;
            text-align: center;
            border: 1px solid var(--light-gray, #404040);
            border-radius: 8px;
            padding: 15px;
            background: var(--medium-gray, #2d2d2d);
        `;
        
        const img = document.createElement('img');
        img.src = e.target.result;
        img.style.cssText = `
            max-width: 100%;
            max-height: 300px;
            border-radius: 6px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        `;
        
        const removeBtn = document.createElement('button');
        removeBtn.type = 'button';
        removeBtn.textContent = 'حذف تصویر';
        removeBtn.style.cssText = `
            background: #dc3545;
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 6px;
            cursor: pointer;
            margin-top: 10px;
            font-size: 0.9rem;
            transition: all 0.3s ease;
        `;
        
        removeBtn.addEventListener('mouseenter', function() {
            this.style.background = '#c82333';
            this.style.transform = 'translateY(-1px)';
        });
        
        removeBtn.addEventListener('mouseleave', function() {
            this.style.background = '#dc3545';
            this.style.transform = 'translateY(0)';
        });
        
        removeBtn.addEventListener('click', function() {
            const fileInput = document.querySelector('input[type="file"]');
            if (fileInput) {
                fileInput.value = '';
            }
            preview.remove();
            
            // حذف نمایش فایل
            const fileDisplay = document.querySelector('.file-display');
            if (fileDisplay) {
                fileDisplay.remove();
            }
        });
        
        preview.appendChild(img);
        preview.appendChild(removeBtn);
        
        const form = document.querySelector('form');
        const submitButton = form.querySelector('button[type="submit"]');
        form.insertBefore(preview, submitButton);
    };
    
    reader.readAsDataURL(file);
}

// ==================== FORM VALIDATION ====================
function initializeFormValidation() {
    const form = document.querySelector('form');
    if (!form) return;
    
    const inputs = form.querySelectorAll('input, textarea');
    
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        input.addEventListener('input', function() {
            clearFieldError(this);
        });
    });
    
    // اضافه کردن validation هنگام ارسال فرم
    form.addEventListener('submit', function(e) {
        let isValid = true;
        const inputs = this.querySelectorAll('input[required], textarea[required]');
        
        inputs.forEach(input => {
            if (!validateField(input)) {
                isValid = false;
            }
        });
        
        if (!isValid) {
            e.preventDefault();
            showFormError('لطفاً فیلدهای ضروری را پر کنید');
        }
    });
}

function validateField(field) {
    const value = field.value.trim();
    const fieldContainer = field.closest('.input-group');
    
    if (field.required && value === '') {
        showFieldError(field, 'این فیلد اجباری است');
        return false;
    }
    
    clearFieldError(field);
    showFieldSuccess(field);
    return true;
}

function showFieldError(field, message) {
    const fieldContainer = field.closest('.input-group');
    clearFieldError(field);
    
    field.style.borderColor = '#dc3545';
    
    const errorElement = document.createElement('div');
    errorElement.className = 'field-error';
    errorElement.style.cssText = `
        color: #dc3545;
        font-size: 0.85rem;
        margin-top: 5px;
        direction: rtl;
    `;
    errorElement.textContent = message;
    
    fieldContainer.appendChild(errorElement);
}

function showFieldSuccess(field) {
    field.style.borderColor = '#28a745';
}

function clearFieldError(field) {
    const fieldContainer = field.closest('.input-group');
    const errorElement = fieldContainer.querySelector('.field-error');
    
    if (errorElement) {
        errorElement.remove();
    }
    
    field.style.borderColor = 'var(--light-gray, #404040)';
}

function showFormError(message) {
    const notification = document.createElement('div');
    notification.className = 'form-error-notification';
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #dc3545;
        color: white;
        padding: 15px 25px;
        border-radius: 8px;
        font-size: 1rem;
        z-index: 1000;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        animation: slideIn 0.3s ease;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 5000);
}

// ==================== CHARACTER COUNTER ====================
function addCharacterCounter(textarea) {
    const counter = document.createElement('div');
    counter.className = 'char-counter';
    counter.style.cssText = `
        text-align: left;
        color: var(--text-muted, #888);
        font-size: 0.8rem;
        margin-top: 5px;
        direction: ltr;
    `;
    
    textarea.parentNode.appendChild(counter);
    
    textarea.addEventListener('input', function() {
        const length = this.value.length;
        const maxLength = this.getAttribute('maxlength');
        
        if (maxLength) {
            const remaining = maxLength - length;
            counter.textContent = `${length} / ${maxLength} کاراکتر`;
            counter.style.color = remaining < 50 ? '#dc3545' : 'var(--text-muted, #888)';
        } else {
            counter.textContent = `${length} کاراکتر`;
        }
    });
    
    // فعال کردن شمارنده اولیه
    textarea.dispatchEvent(new Event('input'));
}

// اضافه کردن استایل‌های انیمیشن
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    /* Responsive design */
    @media (max-width: 768px) {
        .form-container {
            margin: 20px 15px !important;
            padding: 20px !important;
        }
        
        h1 {
            font-size: 1.5rem !important;
        }
        
        input, textarea {
            padding: 10px 12px !important;
            font-size: 16px !important;
        }
        
        button[type="submit"] {
            padding: 12px 20px !important;
            font-size: 1rem !important;
        }
    }
    
    @media (max-width: 480px) {
        .form-container {
            margin: 10px !important;
            padding: 15px !important;
        }
        
        h1 {
            font-size: 1.3rem !important;
        }
    }
`;
document.head.appendChild(style);