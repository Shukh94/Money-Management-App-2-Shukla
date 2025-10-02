// Mobile-Specific Functionality - PRODUCTION VERSION
let currentFabMenu = null;

document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // FAB setup first (most important)
    setupFABForAllDevices();
    
    // Then other mobile features
    if (window.innerWidth <= 768) {
        initializeMobile();
        setupMobileEventListeners();
        updateMobileNavigation();
    }
    
    setupPageChangeListener();
}

function setupFABForAllDevices() {
    const fab = document.getElementById('fab');
    if (!fab) return;
    
    // FAB কে visible করুন
    fab.style.display = 'flex';
    fab.style.opacity = '1';
    fab.style.visibility = 'visible';
    
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    // Remove any existing event listeners by replacing the FAB
    const newFab = fab.cloneNode(true);
    fab.parentNode.replaceChild(newFab, fab);
    
    // Page-specific setup
    switch(currentPage) {
        case 'index.html':
            setupFABForDashboard();
            break;
        case 'transactions.html':
            setupFABForTransactions();
            break;
        case 'upcoming.html':
            setupFABForUpcoming();
            break;
        case 'fixed-expenses.html':
            setupFABForFixedExpenses();
            break;
        case 'settings.html':
            setupFABForSettings();
            break;
        default:
            setupFABForDefault();
    }
}

function setupFABForDashboard() {
    const fab = document.getElementById('fab');
    const fabIcon = fab.querySelector('.fab-icon');
    
    fab.setAttribute('title', 'দ্রুত লেনদেন যোগ করুন');
    fabIcon.textContent = '+';
    fabIcon.style.transform = 'rotate(0deg)';
    
    fab.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        if (currentFabMenu) {
            closeFabMenu();
            fabIcon.style.transform = 'rotate(0deg)';
        } else {
            showQuickActionMenu();
            fabIcon.style.transform = 'rotate(45deg)';
        }
    });
}

function showQuickActionMenu() {
    if (currentFabMenu) {
        closeFabMenu();
        return;
    }

    const fabMenu = document.createElement('div');
    fabMenu.className = 'fab-menu';
    fabMenu.innerHTML = `
        <div class="fab-menu-item" data-action="add-income">
            <span class="fab-menu-icon">💰</span>
            <span class="fab-menu-label">আয় যোগ করুন</span>
        </div>
        <div class="fab-menu-item" data-action="add-expense">
            <span class="fab-menu-icon">💸</span>
            <span class="fab-menu-label">খরচ যোগ করুন</span>
        </div>
        <div class="fab-menu-item" data-action="add-upcoming">
            <span class="fab-menu-icon">⏰</span>
            <span class="fab-menu-label">আসন্ন খরচ যোগ করুন</span>
        </div>
        <div class="fab-menu-item" data-action="add-fixed">
            <span class="fab-menu-icon">🔒</span>
            <span class="fab-menu-label">ফিক্সড খরচ যোগ করুন</span>
        </div>
    `;

    fabMenu.addEventListener('click', function(e) {
        const menuItem = e.target.closest('.fab-menu-item');
        if (menuItem) {
            const action = menuItem.getAttribute('data-action');
            handleQuickAction(action);
            closeFabMenu();
        }
    });

    document.body.appendChild(fabMenu);
    currentFabMenu = fabMenu;

    // Position menu
    const fab = document.getElementById('fab');
    const fabRect = fab.getBoundingClientRect();
    fabMenu.style.bottom = (window.innerHeight - fabRect.top + 10) + 'px';
    fabMenu.style.right = (window.innerWidth - fabRect.right) + 'px';

    // Background click handler
    setTimeout(() => {
        document.addEventListener('click', function closeFabMenuOnClick(e) {
            const fab = document.getElementById('fab');
            if (currentFabMenu && !fab.contains(e.target) && !currentFabMenu.contains(e.target)) {
                closeFabMenu();
            }
        }, true);
    }, 100);
}

function closeFabMenu() {
    if (currentFabMenu) {
        currentFabMenu.remove();
        currentFabMenu = null;
        
        const fabIcon = document.querySelector('#fab .fab-icon');
        if (fabIcon) {
            fabIcon.style.transform = 'rotate(0deg)';
        }
    }
}

function handleQuickAction(action) {
    closeFabMenu();
    
    switch(action) {
        case 'add-income':
            window.location.href = 'transactions.html?type=income';
            break;
        case 'add-expense':
            window.location.href = 'transactions.html?type=expense';
            break;
        case 'add-upcoming':
            window.location.href = 'upcoming.html';
            break;
        case 'add-fixed':
            window.location.href = 'fixed-expenses.html';
            break;
    }
}

// অন্যান্য FAB functions
function setupFABForTransactions() {
    const fab = document.getElementById('fab');
    fab.setAttribute('title', 'নতুন লেনদেন যোগ করুন');
    fab.querySelector('.fab-icon').textContent = '+';
    
    fab.addEventListener('click', function() {
        const form = document.getElementById('transactionForm');
        if (form) {
            form.scrollIntoView({ behavior: 'smooth' });
        }
    });
}

function setupFABForSettings() {
    const fab = document.getElementById('fab');
    fab.setAttribute('title', 'সেটিংস সংরক্ষণ করুন');
    fab.querySelector('.fab-icon').textContent = '💾';
    
    fab.addEventListener('click', function() {
        const saveBtn = document.getElementById('saveSettings');
        if (saveBtn) {
            fab.classList.add('fab-saving');
            saveBtn.click();
            setTimeout(() => fab.classList.remove('fab-saving'), 1000);
        }
    });
}

function setupFABForUpcoming() {
    const fab = document.getElementById('fab');
    fab.setAttribute('title', 'নতুন আসন্ন খরচ যোগ করুন');
    fab.querySelector('.fab-icon').textContent = '+';
    
    fab.addEventListener('click', function() {
        const form = document.getElementById('upcomingForm');
        if (form) {
            form.scrollIntoView({ behavior: 'smooth' });
        }
    });
}

function setupFABForFixedExpenses() {
    const fab = document.getElementById('fab');
    fab.setAttribute('title', 'নতুন ফিক্সড খরচ যোগ করুন');
    fab.querySelector('.fab-icon').textContent = '+';
    
    fab.addEventListener('click', function() {
        const form = document.getElementById('fixedExpenseForm');
        if (form) {
            form.scrollIntoView({ behavior: 'smooth' });
        }
    });
}

function setupFABForDefault() {
    const fab = document.getElementById('fab');
    fab.setAttribute('title', 'লেনদেন পেজে যান');
    fab.querySelector('.fab-icon').textContent = '+';
    
    fab.addEventListener('click', function() {
        window.location.href = 'transactions.html';
    });
}

// Mobile specific functions
function initializeMobile() {
    if (window.innerWidth > 768) return;
    addMobilePageHeaders();
    initializeMobileFeatures();
}

function setupMobileEventListeners() {
    if (window.innerWidth > 768) return;
    updateMobileNavigation();
    setupTouchEvents();
    setupMobileButtonEvents();
}

function setupMobileButtonEvents() {
    const mobileAddBtn = document.getElementById('mobileAddBtn');
    if (mobileAddBtn) {
        mobileAddBtn.addEventListener('click', function() {
            const form = document.getElementById('transactionForm');
            if (form) {
                form.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }
    
    const mobileRefreshBtn = document.getElementById('mobileRefreshBtn');
    if (mobileRefreshBtn) {
        mobileRefreshBtn.addEventListener('click', function() {
            location.reload();
        });
    }
    
    const mobileSaveBtn = document.getElementById('mobileSaveBtn');
    if (mobileSaveBtn) {
        mobileSaveBtn.addEventListener('click', function() {
            const saveBtn = document.getElementById('saveSettings');
            if (saveBtn) {
                saveBtn.click();
            }
        });
    }
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

        const container = document.querySelector('.container');
        const page = document.querySelector('.page');
        if (container && page) {
            container.insertBefore(pageHeader, page);
        }
    }
}

function initializeMobileFeatures() {
    setupPullToRefresh();
    improveTouchTargets();
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
        
        if (diff > 50 && startY > window.innerHeight - 100) {
            // Optional: Add swipe up action
        }
    });
}

function setupPullToRefresh() {
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
            e.preventDefault();
        }
    });
    
    document.addEventListener('touchend', function() {
        if (window.scrollY === 0 && currentY - startY > 100) {
            location.reload();
        }
    });
}

function improveTouchTargets() {
    const touchElements = document.querySelectorAll('button, a, input, select, textarea');
    touchElements.forEach(element => {
        element.style.minHeight = '44px';
        element.style.minWidth = '44px';
    });
}

function handleKeyboardEvents() {
    window.addEventListener('resize', function() {
        if (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA') {
            document.activeElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    });
}

function setupPageChangeListener() {
    document.addEventListener('click', function(e) {
        if (e.target.closest('a') && !e.target.closest('.fab-menu')) {
            closeFabMenu();
        }
    });
}

// Handle mobile resize
window.addEventListener('resize', function() {
    closeFabMenu();
    if (window.innerWidth <= 768) {
        initializeMobile();
    } else {
        const mobileHeader = document.querySelector('.mobile-page-header');
        if (mobileHeader) mobileHeader.remove();
    }
});

// Update navigation when page loads
window.addEventListener('load', function() {
    if (window.innerWidth <= 768) {
        updateMobileNavigation();
    }
});