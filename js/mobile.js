// Mobile-Specific Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Check if mobile
    if (window.innerWidth <= 768) {
        initializeMobile();
        setupMobileEventListeners();
        updateMobileNavigation();
    }
});

function initializeMobile() {
    // Only run on mobile devices
    if (window.innerWidth > 768) return;
    
    console.log('Mobile interface initialized');
    
    // Add mobile page headers if they don't exist
    addMobilePageHeaders();
    
    // Initialize mobile-specific features
    initializeMobileFeatures();
}

function setupMobileEventListeners() {
    // Only run on mobile devices
    if (window.innerWidth > 768) return;

    // FAB functionality
    const fab = document.getElementById('fab');
    if (fab) {
        fab.addEventListener('click', function() {
            handleFABClick();
        });
    }

    // Mobile navigation active state
    updateMobileNavigation();

    // Touch events for better mobile experience
    setupTouchEvents();
    
    // Mobile-specific button events
    setupMobileButtonEvents();
}

function setupMobileButtonEvents() {
    // Mobile add button
    const mobileAddBtn = document.getElementById('mobileAddBtn');
    if (mobileAddBtn) {
        mobileAddBtn.addEventListener('click', function() {
            // Scroll to form or show add modal
            const form = document.getElementById('transactionForm');
            if (form) {
                form.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }
    
    // Mobile refresh button
    const mobileRefreshBtn = document.getElementById('mobileRefreshBtn');
    if (mobileRefreshBtn) {
        mobileRefreshBtn.addEventListener('click', function() {
            location.reload();
        });
    }
    
    // Mobile save button
    const mobileSaveBtn = document.getElementById('mobileSaveBtn');
    if (mobileSaveBtn) {
        mobileSaveBtn.addEventListener('click', function() {
            // Trigger settings save
            const saveBtn = document.querySelector('#settingsForm button[type="submit"]');
            if (saveBtn) {
                saveBtn.click();
            }
        });
    }
}


// Mobile-Specific Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Check if mobile
    if (window.innerWidth <= 768) {
        initializeMobile();
        setupMobileEventListeners();
        updateMobileNavigation();
    }
});

function initializeMobile() {
    // Only run on mobile devices
    if (window.innerWidth > 768) return;
    
    console.log('Mobile interface initialized');
    
    // Add mobile page headers if they don't exist
    addMobilePageHeaders();
    
    // Initialize mobile-specific features
    initializeMobileFeatures();
}

function setupMobileEventListeners() {
    // Only run on mobile devices
    if (window.innerWidth > 768) return;

    // FAB functionality
    const fab = document.getElementById('fab');
    if (fab) {
        fab.addEventListener('click', function() {
            handleFABClick();
        });
    }

    // Mobile navigation active state
    updateMobileNavigation();

    // Touch events for better mobile experience
    setupTouchEvents();
}

function updateMobileNavigation() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navItems = document.querySelectorAll('.mobile-nav-item');
    
    navItems.forEach(item => {
        const href = item.getAttribute('href');
        if (href === currentPage) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });
}

function addMobilePageHeaders() {
    const pageTitles = {
        'index.html': 'ড্যাশবোর্ড',
        'transactions.html': 'লেনদেন',
        'reports.html': 'রিপোর্ট',
        'upcoming.html': 'আসন্ন খরচ',
        'fixed-expenses.html': 'ফিক্সড খরচ',
        'settings.html': 'সেটিংস'
    };

    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const pageTitle = pageTitles[currentPage] || 'পেজ';

    // Check if mobile header already exists
    if (!document.querySelector('.mobile-page-header')) {
        const pageHeader = document.createElement('div');
        pageHeader.className = 'mobile-page-header';
        pageHeader.innerHTML = `
            <h1 class="mobile-page-title">${pageTitle}</h1>
            <div class="mobile-header-actions">
                ${currentPage === 'transactions.html' ? 
                    '<button class="mobile-action-btn" id="mobileAddBtn"><span class="action-icon">+</span></button>' : 
                currentPage === 'reports.html' ?
                    '<button class="mobile-action-btn" id="mobileRefreshBtn"><span class="action-icon">🔄</span></button>' :
                currentPage === 'settings.html' ?
                    '<button class="mobile-action-btn" id="mobileSaveBtn"><span class="action-icon">💾</span></button>' :
                    ''}
            </div>
        `;

        // Insert after container but before page content
        const container = document.querySelector('.container');
        const page = document.querySelector('.page');
        container.insertBefore(pageHeader, page);
    }
}

function handleFABClick() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    switch(currentPage) {
        case 'index.html':
            window.location.href = 'transactions.html';
            break;
        case 'transactions.html':
            // Scroll to form and focus on first input
            const form = document.getElementById('transactionForm');
            if (form) {
                form.scrollIntoView({ behavior: 'smooth' });
                const firstInput = form.querySelector('input, select, textarea');
                if (firstInput) firstInput.focus();
            }
            break;
        case 'upcoming.html':
            const upcomingForm = document.getElementById('upcomingForm');
            if (upcomingForm) {
                upcomingForm.scrollIntoView({ behavior: 'smooth' });
                const firstInput = upcomingForm.querySelector('input, select, textarea');
                if (firstInput) firstInput.focus();
            }
            break;
        case 'fixed-expenses.html':
            const fixedForm = document.getElementById('fixedExpenseForm');
            if (fixedForm) {
                fixedForm.scrollIntoView({ behavior: 'smooth' });
                const firstInput = fixedForm.querySelector('input, select, textarea');
                if (firstInput) firstInput.focus();
            }
            break;
        default:
            window.location.href = 'transactions.html';
    }
}

function initializeMobileFeatures() {
    // Add pull-to-refresh on mobile
    setupPullToRefresh();
    
    // Improve touch targets
    improveTouchTargets();
    
    // Handle keyboard appearance on mobile
    handleKeyboardEvents();
}

function setupTouchEvents() {
    let startY = 0;
    
    document.addEventListener('touchstart', function(e) {
        startY = e.touches[0].clientY;
    });
    
    document.addEventListener('touchend', function(e) {
        const endY = e.changedTouches[0].clientY;
        const diff = startY - endY;
        
        // Swipe up from bottom - could be used for additional actions
        if (diff > 50 && startY > window.innerHeight - 100) {
            // Optional: Add swipe up action
        }
    });
}

function setupPullToRefresh() {
    // Simple pull-to-refresh implementation
    let startY = 0;
    let currentY = 0;
    
    document.addEventListener('touchstart', function(e) {
        if (window.scrollY === 0) {
            startY = e.touches[0].pageY;
        }
    });
    
    document.addEventListener('touchmove', function(e) {
        currentY = e.touches[0].pageY;
        
        if (window.scrollY === 0 && currentY > startY) {
            // Pull to refresh triggered
            e.preventDefault();
        }
    });
    
    document.addEventListener('touchend', function() {
        if (window.scrollY === 0 && currentY - startY > 100) {
            // Refresh the current view
            location.reload();
        }
    });
}

function improveTouchTargets() {
    // Ensure buttons and links have proper touch targets
    const touchElements = document.querySelectorAll('button, a, input, select, textarea');
    touchElements.forEach(element => {
        element.style.minHeight = '44px';
        element.style.minWidth = '44px';
    });
}

function handleKeyboardEvents() {
    // Handle viewport adjustments when keyboard appears
    window.addEventListener('resize', function() {
        if (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA') {
            document.activeElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    });
}

// Handle mobile resize
window.addEventListener('resize', function() {
    if (window.innerWidth <= 768) {
        initializeMobile();
    } else {
        // Remove mobile-specific elements when switching to desktop
        const mobileHeader = document.querySelector('.mobile-page-header');
        if (mobileHeader) {
            mobileHeader.remove();
        }
    }
});

// Update navigation when page loads
window.addEventListener('load', function() {
    if (window.innerWidth <= 768) {
        updateMobileNavigation();
    }
});

