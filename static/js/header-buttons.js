// header-buttons.js - Add header buttons to post list page
document.addEventListener('DOMContentLoaded', function() {
    createHeaderButtons();
    initializeHeaderAnimations();
});

function createHeaderButtons() {
    const createPostUrl = document.body.getAttribute('data-create-post-url') || '/create/';
    const logoutUrl = document.body.getAttribute('data-logout-url') || '/logout/';

    const headerButtons = document.createElement('div');
    headerButtons.className = 'header-buttons';
    headerButtons.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        display: flex;
        gap: 10px;
        z-index: 1000;
    `;

    const createPostBtn = document.createElement('a');
    createPostBtn.href = createPostUrl;
    createPostBtn.className = 'header-btn create-post-btn';
    createPostBtn.innerHTML = `
        <span class="btn-icon">📝</span>
        <span class="btn-text">Create Post</span>
    `;

    const logoutBtn = document.createElement('a');
    logoutBtn.href = logoutUrl;
    logoutBtn.className = 'header-btn logout-btn';
    logoutBtn.innerHTML = `
        <span class="btn-icon">🚪</span>
        <span class="btn-text">Logout</span>
    `;

    headerButtons.appendChild(createPostBtn);
    headerButtons.appendChild(logoutBtn);

    document.body.appendChild(headerButtons);

    addHeaderButtonsStyles();
}

function addHeaderButtonsStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .header-btn {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 10px 16px;
            border-radius: 8px;
            text-decoration: none;
            font-weight: 500;
            font-size: 14px;
            transition: all 0.3s ease;
            border: 1px solid var(--light-gray, #404040);
            background: var(--dark-gray, #1a1a1a);
            color: var(--text-light, #e0e0e0);
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
        }

        .header-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.4);
        }

        .create-post-btn:hover {
            background: var(--accent, #555);
            border-color: var(--accent, #555);
            color: var(--text-lighter, #ffffff);
        }

        .logout-btn:hover {
            background: #dc3545;
            border-color: #dc3545;
            color: var(--text-lighter, #ffffff);
        }

        .btn-icon {
            font-size: 16px;
        }

        .btn-text {
            white-space: nowrap;
        }

        /* Responsive design */
        @media (max-width: 768px) {
            .header-buttons {
                top: 10px;
                right: 10px;
                flex-direction: column;
                gap: 8px;
            }

            .header-btn {
                padding: 8px 12px;
                font-size: 12px;
            }

            .btn-text {
                display: none;
            }

            .header-btn:hover .btn-text {
                display: inline;
                position: absolute;
                left: -80px;
                background: var(--dark-gray);
                padding: 4px 8px;
                border-radius: 4px;
                border: 1px solid var(--light-gray);
            }
        }

        @media (max-width: 480px) {
            .header-buttons {
                top: 5px;
                right: 5px;
            }

            .header-btn {
                padding: 6px 10px;
            }
        }
    `;
    document.head.appendChild(style);
}

function initializeHeaderAnimations() {
    const headerButtons = document.querySelector('.header-buttons');
    
    if (headerButtons) {
        headerButtons.style.opacity = '0';
        headerButtons.style.transform = 'translateY(-20px)';
        
        setTimeout(() => {
            headerButtons.style.transition = 'all 0.5s ease';
            headerButtons.style.opacity = '1';
            headerButtons.style.transform = 'translateY(0)';
        }, 300);

        window.addEventListener('scroll', debounce(function() {
            const scrolled = window.pageYOffset;
            if (scrolled > 100) {
                headerButtons.style.transform = 'translateY(-5px) scale(0.95)';
            } else {
                headerButtons.style.transform = 'translateY(0) scale(1)';
            }
        }, 10));
    }
}

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