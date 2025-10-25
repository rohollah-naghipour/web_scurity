// post-detail.js - JavaScript for post detail page
document.addEventListener('DOMContentLoaded', function() {
    initializeCommentSection();
    initializeCommentForm();
    initializeImageZoom();
    initializeScrollToComments();
    initializeSocialShare();
    styleBackLink();
    styleComments(); // تابع جدید برای استایل دادن به کامنت‌ها
});

// ==================== COMMENT STYLING ====================
function styleComments() {
    const comments = document.querySelectorAll('.comment');
    
    comments.forEach((comment, index) => {
        // حذف خط زیرین (h2)
        const separator = comment.querySelector('h2');
        if (separator) {
            separator.remove();
        }
        
        // استایل دادن به کامنت
        comment.style.cssText = `
            background: var(--medium-gray, #2d2d2d);
            padding: 20px;
            border-radius: 10px;
            border: 1px solid var(--light-gray, #404040);
            margin-bottom: 15px;
            transition: all 0.3s ease;
            position: relative;
        `;
        
        // استایل نویسنده کامنت
        const author = comment.querySelector('.comment-author');
        if (author) {
            author.style.cssText = `
                color: var(--text-lighter, #ffffff);
                font-weight: 600;
                font-size: 16px;
                margin-bottom: 8px;
                display: flex;
                align-items: center;
                gap: 8px;
            `;
            
            // اضافه کردن آواتار قبل از نام کاربر
            const avatar = document.createElement('span');
            avatar.textContent = '👤';
            avatar.style.fontSize = '14px';
            author.insertBefore(avatar, author.firstChild);
        }
        
        // استایل محتوای کامنت
        const content = comment.querySelector('.comment-content');
        if (content) {
            content.style.cssText = `
                color: var(--text-light, #e0e0e0);
                font-size: 14px;
                line-height: 1.6;
                margin-bottom: 10px;
                padding: 10px;
                background: var(--dark-gray, #1a1a1a);
                border-radius: 6px;
                border-left: 3px solid var(--accent, #555);
            `;
        }
        
        // استایل زمان کامنت
        const time = comment.querySelector('.comment-time');
        if (time) {
            time.style.cssText = `
                color: var(--text-muted, #888);
                font-size: 12px;
                text-align: left;
                direction: ltr;
                display: flex;
                align-items: center;
                gap: 5px;
                justify-content: flex-end;
            `;
            
            // اضافه کردن آیکون ساعت
            const clockIcon = document.createElement('span');
            clockIcon.textContent = '🕒';
            clockIcon.style.fontSize = '10px';
            time.insertBefore(clockIcon, time.firstChild);
        }
        
        // افکت‌های hover
        comment.addEventListener('mouseenter', function() {
            this.style.transform = 'translateX(-5px)';
            this.style.borderColor = 'var(--accent, #555)';
            this.style.boxShadow = '0 5px 20px rgba(0, 0, 0, 0.3)';
        });
        
        comment.addEventListener('mouseleave', function() {
            this.style.transform = 'translateX(0)';
            this.style.borderColor = 'var(--light-gray, #404040)';
            this.style.boxShadow = 'none';
        });
        
        // انیمیشن fade-in برای کامنت‌ها
        comment.style.opacity = '0';
        comment.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            comment.style.transition = 'all 0.5s ease';
            comment.style.opacity = '1';
            comment.style.transform = 'translateY(0)';
        }, index * 100);
    });
    
    // استایل برای حالت خالی (No comments)
    const emptyState = document.querySelector('.comment-section p');
    if (emptyState && !emptyState.closest('.comment')) {
        emptyState.style.cssText = `
            text-align: center;
            color: var(--text-muted, #888);
            font-style: italic;
            padding: 40px 20px;
            background: var(--medium-gray, #2d2d2d);
            border-radius: 10px;
            border: 1px solid var(--light-gray, #404040);
            font-size: 16px;
        `;
    }
    
    // استایل برای عنوان User Comments
    const commentsTitle = document.querySelector('.comment-section h1');
    if (commentsTitle) {
        commentsTitle.style.cssText = `
            color: var(--text-lighter, #ffffff);
            font-size: 24px;
            margin-bottom: 25px;
            text-align: center;
            padding-bottom: 10px;
            border-bottom: 2px solid var(--accent, #555);
            position: relative;
        `;
        
        // حذف تگ p اطراف h1
        const parentP = commentsTitle.closest('p');
        if (parentP) {
            parentP.replaceWith(commentsTitle);
        }
    }
}

// ==================== COMMENT SECTION ====================
function initializeCommentSection() {
    const comments = document.querySelectorAll('.comment');
    
    comments.forEach((comment, index) => {
        // Add fade-in animation to comments
        comment.style.opacity = '0';
        comment.style.transform = 'translateX(30px)';
        comment.style.transition = 'all 0.5s ease';
        
        setTimeout(() => {
            comment.style.opacity = '1';
            comment.style.transform = 'translateX(0)';
        }, index * 100);
    });
}

// ==================== COMMENT FORM ====================
function initializeCommentForm() {
    const commentForm = document.querySelector('.comment-section form');
    const commentTextarea = document.querySelector('#id_text');
    
    if (!commentForm || !commentTextarea) return;
    
    // Create and style the comment form
    styleCommentForm(commentForm, commentTextarea);
    
    // Add character counter
    addCharacterCounter(commentTextarea);
    
    // Add form submission handler
    commentForm.addEventListener('submit', handleCommentSubmit);
    
    // Auto-resize textarea
    commentTextarea.addEventListener('input', autoResizeTextarea);
}

function styleCommentForm(form, textarea) {
    // Style the form container
    form.style.cssText = `
        background: var(--medium-gray, #2d2d2d);
        padding: 20px;
        border-radius: 10px;
        border: 1px solid var(--light-gray, #404040);
        margin: 20px 0;
    `;
    
    // Style the textarea
    textarea.style.cssText = `
        width: 100%;
        min-height: 80px;
        padding: 12px 15px;
        border-radius: 8px;
        background: var(--dark-gray, #1a1a1a);
        border: 1px solid var(--light-gray, #404040);
        color: var(--text-light, #e0e0e0);
        font-size: 14px;
        resize: vertical;
        transition: all 0.3s ease;
        font-family: inherit;
    `;
    
    textarea.addEventListener('focus', function() {
        this.style.borderColor = 'var(--accent, #555)';
        this.style.boxShadow = '0 0 0 2px rgba(85, 85, 85, 0.2)';
    });
    
    textarea.addEventListener('blur', function() {
        this.style.borderColor = 'var(--light-gray, #404040)';
        this.style.boxShadow = 'none';
    });
    
    // Style the submit button
    const submitButton = form.querySelector('button[type="submit"]');
    if (submitButton) {
        submitButton.style.cssText = `
            background: var(--accent, #555);
            color: var(--text-lighter, #ffffff);
            border: none;
            padding: 10px 20px;
            border-radius: 6px;
            cursor: pointer;
            font-size: 14px;
            margin-top: 10px;
            transition: all 0.3s ease;
            float: left;
        `;
        
        submitButton.addEventListener('mouseenter', function() {
            this.style.background = 'var(--accent-hover, #666)';
            this.style.transform = 'translateY(-2px)';
        });
        
        submitButton.addEventListener('mouseleave', function() {
            this.style.background = 'var(--accent, #555)';
            this.style.transform = 'translateY(0)';
        });
    }
}

function addCharacterCounter(textarea) {
    const counter = document.createElement('div');
    counter.className = 'comment-char-counter';
    counter.style.cssText = `
        text-align: left;
        color: var(--text-muted, #888);
        font-size: 12px;
        margin-top: 5px;
        direction: ltr;
    `;
    
    textarea.parentNode.insertBefore(counter, textarea.nextSibling);
    
    textarea.addEventListener('input', function() {
        const length = this.value.length;
        counter.textContent = `${length} character${length !== 1 ? 's' : ''}`;
        
        if (length > 500) {
            counter.style.color = '#dc3545';
        } else if (length > 300) {
            counter.style.color = '#ffc107';
        } else {
            counter.style.color = 'var(--text-muted, #888)';
        }
    });
    
    // Trigger initial count
    textarea.dispatchEvent(new Event('input'));
}

function autoResizeTextarea() {
    this.style.height = 'auto';
    this.style.height = (this.scrollHeight) + 'px';
}

function handleCommentSubmit(e) {
    const submitButton = this.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    
    // Show loading state
    submitButton.textContent = 'Submitting...';
    submitButton.disabled = true;
    submitButton.style.opacity = '0.7';
    
    // Re-enable after 10 seconds in case of error
    setTimeout(() => {
        submitButton.textContent = originalText;
        submitButton.disabled = false;
        submitButton.style.opacity = '1';
    }, 10000);
}

// ==================== BACK LINK STYLING ====================
function styleBackLink() {
    const backLink = document.querySelector('.back-link');
    
    if (!backLink) return;
    
    // تبدیل لینک به دکمه
    backLink.style.cssText = `
        display: block;
        background: var(--medium-gray, #2d2d2d);
        color: var(--text-light, #e0e0e0);
        text-decoration: none;
        padding: 10px 20px;
        border-radius: 6px;
        border: 1px solid var(--light-gray, #404040);
        text-align: center;
        margin-top: 10px;
        transition: all 0.3s ease;
        font-size: 14px;
        cursor: pointer;
    `;
    
    // افکت‌های hover مشابه دکمه Submit
    backLink.addEventListener('mouseenter', function() {
        this.style.background = 'var(--accent, #555)';
        this.style.color = 'var(--text-lighter, #ffffff)';
        this.style.transform = 'translateY(-2px)';
        this.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.2)';
    });
    
    backLink.addEventListener('mouseleave', function() {
        this.style.background = 'var(--medium-gray, #2d2d2d)';
        this.style.color = 'var(--text-light, #e0e0e0)';
        this.style.transform = 'translateY(0)';
        this.style.boxShadow = 'none';
    });
    
    // قرار دادن دقیقاً زیر دکمه Submit
    const commentForm = document.querySelector('.comment-section form');
    if (commentForm) {
        // ایجاد کانتینر برای دکمه‌ها
        const buttonsContainer = document.createElement('div');
        buttonsContainer.className = 'form-buttons-container';
        buttonsContainer.style.cssText = `
            display: flex;
            flex-direction: column;
            gap: 10px;
            margin-top: 15px;
            clear: both;
        `;
        
        // جابجایی دکمه Submit به کانتینر جدید
        const submitButton = commentForm.querySelector('button[type="submit"]');
        if (submitButton) {
            submitButton.style.float = 'none';
            submitButton.style.marginTop = '0';
            submitButton.style.width = '100%';
            
            buttonsContainer.appendChild(submitButton);
        }
        
        // اضافه کردن دکمه بازگشت به کانتینر
        buttonsContainer.appendChild(backLink);
        
        // اضافه کردن کانتینر به فرم
        commentForm.appendChild(buttonsContainer);
    }
}

// ==================== IMAGE ZOOM ====================
function initializeImageZoom() {
    const postImage = document.querySelector('.container img');
    
    if (!postImage) return;
    
    postImage.style.cursor = 'zoom-in';
    postImage.addEventListener('click', toggleImageZoom);
}

function toggleImageZoom() {
    if (this.classList.contains('zoomed')) {
        // Zoom out
        this.classList.remove('zoomed');
        this.style.cssText = `
            cursor: zoom-in;
            position: relative;
            z-index: 1;
        `;
        
        // Remove overlay
        const overlay = document.querySelector('.image-overlay');
        if (overlay) overlay.remove();
        
        // Re-enable scrolling
        document.body.style.overflow = 'auto';
    } else {
        // Zoom in
        this.classList.add('zoomed');
        this.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) scale(1.5);
            max-width: 90vw;
            max-height: 90vh;
            z-index: 1000;
            cursor: zoom-out;
            box-shadow: 0 0 50px rgba(0, 0, 0, 0.8);
        `;
        
        // Create overlay
        const overlay = document.createElement('div');
        overlay.className = 'image-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.9);
            z-index: 999;
            cursor: zoom-out;
        `;
        
        overlay.addEventListener('click', () => {
            this.classList.remove('zoomed');
            this.style.cssText = '';
            overlay.remove();
            document.body.style.overflow = 'auto';
        });
        
        document.body.appendChild(overlay);
        
        // Disable scrolling
        document.body.style.overflow = 'hidden';
    }
}

// ==================== SCROLL TO COMMENTS ====================
function initializeScrollToComments() {
    // Add smooth scroll to comments section
    const commentLinks = document.querySelectorAll('a[href="#comments"]');
    
    commentLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const commentSection = document.querySelector('.comment-section');
            if (commentSection) {
                commentSection.scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// ==================== SOCIAL SHARE ====================
function initializeSocialShare() {
    // Create social share buttons if needed
    const shareContainer = document.createElement('div');
    shareContainer.className = 'social-share';
    shareContainer.style.cssText = `
        display: flex;
        gap: 10px;
        margin: 20px 0;
        justify-content: center;
    `;
    
    const shareButtons = [
        { name: 'Twitter', class: 'twitter', icon: '🐦' },
        { name: 'Facebook', class: 'facebook', icon: '📘' },
        { name: 'LinkedIn', class: 'linkedin', icon: '💼' },
        { name: 'Copy Link', class: 'copy', icon: '🔗' }
    ];
    
    shareButtons.forEach(button => {
        const btn = document.createElement('button');
        btn.className = `share-btn ${button.class}`;
        btn.innerHTML = `${button.icon} ${button.name}`;
        btn.style.cssText = `
            background: var(--medium-gray, #2d2d2d);
            border: 1px solid var(--light-gray, #404040);
            color: var(--text-light, #e0e0e0);
            padding: 8px 12px;
            border-radius: 6px;
            cursor: pointer;
            font-size: 12px;
            transition: all 0.3s ease;
        `;
        
        btn.addEventListener('mouseenter', function() {
            this.style.background = 'var(--accent, #555)';
            this.style.transform = 'translateY(-2px)';
        });
        
        btn.addEventListener('mouseleave', function() {
            this.style.background = 'var(--medium-gray, #2d2d2d)';
            this.style.transform = 'translateY(0)';
        });
        
        btn.addEventListener('click', function() {
            handleShare(button.class);
        });
        
        shareContainer.appendChild(btn);
    });
    
    // Insert after post content
    const postContent = document.querySelector('.container hr');
    if (postContent) {
        postContent.parentNode.insertBefore(shareContainer, postContent.nextSibling);
    }
}

function handleShare(platform) {
    const url = window.location.href;
    const title = document.title;
    
    switch(platform) {
        case 'twitter':
            window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`, '_blank');
            break;
        case 'facebook':
            window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
            break;
        case 'linkedin':
            window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank');
            break;
        case 'copy':
            navigator.clipboard.writeText(url).then(() => {
                showNotification('Link copied to clipboard!');
            });
            break;
    }
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--accent, #555);
        color: var(--text-lighter, #ffffff);
        padding: 10px 20px;
        border-radius: 6px;
        z-index: 1001;
        font-size: 14px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// ==================== KEYBOARD SHORTCUTS ====================
document.addEventListener('keydown', function(e) {
    // Press 'C' to focus comment box
    if (e.key === 'c' && !e.ctrlKey && !e.altKey) {
        const commentTextarea = document.querySelector('#id_text');
        if (commentTextarea && document.activeElement !== commentTextarea) {
            e.preventDefault();
            commentTextarea.focus();
        }
    }
    
    // Press 'Escape' to close zoomed image
    if (e.key === 'Escape') {
        const zoomedImage = document.querySelector('img.zoomed');
        if (zoomedImage) {
            zoomedImage.click();
        }
    }
    
    // Press 'B' to go back to post list
    if (e.key === 'b' && !e.ctrlKey && !e.altKey) {
        const backLink = document.querySelector('.back-link');
        if (backLink) {
            e.preventDefault();
            backLink.click();
        }
    }
});