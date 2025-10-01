// Mobile-Specific Functionality
let currentFabMenu = null;

document.addEventListener('DOMContentLoaded', function() {
    // Check if mobile
    if (window.innerWidth <= 768) {
        initializeMobile();
        setupMobileEventListeners();
        updateMobileNavigation();
    }
    
    // সব ডিভাইসের জন্য FAB সেটআপ করুন (ডেস্কটপ এবং মোবাইল উভয়তে)
    setupFABForAllDevices();
    setupPageChangeListener();
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
        
        // Mobile save button event listener যোগ করুন
        if (currentPage === 'settings.html') {
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
    }
}

// সব ডিভাইসের জন্য FAB সেটআপ
function setupFABForAllDevices() {
    const fab = document.getElementById('fab');
    if (!fab) {
        console.log('FAB button not found');
        return;
    }

    // FAB কে সবসময় দেখানোর জন্য স্টাইল প্রয়োগ
    fab.style.display = 'flex';
    
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    console.log('Setting up FAB for page:', currentPage);
    
    // পেজ অনুযায়ী FAB কাস্টমাইজ করুন
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
    
    // Remove any existing event listeners
    fab.replaceWith(fab.cloneNode(true));
    const newFab = document.getElementById('fab');
    const newFabIcon = newFab.querySelector('.fab-icon');
    
    newFab.addEventListener('click', function() {
        if (currentFabMenu) {
            // Menu থাকলে close করুন
            closeFabMenu();
            newFabIcon.style.transform = 'rotate(0deg)';
        } else {
            // Menu না থাকলে show করুন
            showQuickActionMenu();
            newFabIcon.style.transform = 'rotate(45deg)';
        }
    });
}

function showQuickActionMenu() {
    // যদি আগে থেকে menu থাকে তবে remove করুন
    if (currentFabMenu) {
        closeFabMenu();
        return;
    }

    // Quick action menu create করুন
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

    // Menu এর event listeners যোগ করুন
    fabMenu.addEventListener('click', function menuItemClick(e) {
        const menuItem = e.target.closest('.fab-menu-item');
        if (menuItem) {
            const action = menuItem.getAttribute('data-action');
            handleQuickAction(action);
            closeFabMenu();
        }
    });

    // Menu কে body তে append করুন
    document.body.appendChild(fabMenu);
    currentFabMenu = fabMenu;

    // Menu এর position set করুন
    const fab = document.getElementById('fab');
    const fabRect = fab.getBoundingClientRect();
    fabMenu.style.bottom = (window.innerHeight - fabRect.top + 10) + 'px';
    fabMenu.style.right = (window.innerWidth - fabRect.right) + 'px';

    // Background এ click করলে menu close হবে
    setTimeout(() => {
        document.addEventListener('click', closeFabMenuOnClick, true);
    }, 100);
}

function closeFabMenu() {
    if (currentFabMenu) {
        currentFabMenu.remove();
        currentFabMenu = null;
        document.removeEventListener('click', closeFabMenuOnClick, true);
        
        // FAB icon reset করুন
        const fabIcon = document.querySelector('#fab .fab-icon');
        if (fabIcon) {
            fabIcon.style.transform = 'rotate(0deg)';
        }
    }
}

function closeFabMenuOnClick(e) {
    const fab = document.getElementById('fab');
    if (currentFabMenu && !fab.contains(e.target) && !currentFabMenu.contains(e.target)) {
        closeFabMenu();
    }
}

function handleQuickAction(action) {
    // Menu close করুন
    closeFabMenu();
    
    // Action handle করুন
    switch(action) {
        case 'add-income':
            // Transactions পেজে নিয়ে যাবে এবং income type সেট করবে
            if (window.location.pathname.includes('transactions.html')) {
                // যদি ইতিমধ্যে transactions পেজে থাকে
                showTransactionForm('income');
            } else {
                window.location.href = 'transactions.html?type=income';
            }
            break;
        case 'add-expense':
            if (window.location.pathname.includes('transactions.html')) {
                showTransactionForm('expense');
            } else {
                window.location.href = 'transactions.html?type=expense';
            }
            break;
        case 'add-upcoming':
            if (window.location.pathname.includes('upcoming.html')) {
                showUpcomingForm();
            } else {
                window.location.href = 'upcoming.html';
            }
            break;
        case 'add-fixed':
            if (window.location.pathname.includes('fixed-expenses.html')) {
                showFixedExpenseForm();
            } else {
                window.location.href = 'fixed-expenses.html';
            }
            break;
    }
}

// Transactions পেজে ফর্ম দেখানোর ফাংশন
function showTransactionForm(type) {
    const form = document.getElementById('transactionForm');
    if (form) {
        form.scrollIntoView({ behavior: 'smooth' });
        
        // Type সেট করুন
        const typeSelect = document.getElementById('type');
        if (typeSelect) {
            typeSelect.value = type;
        }
        
        // প্রথম input focus করুন
        const firstInput = form.querySelector('input, select, textarea');
        if (firstInput) firstInput.focus();
    }
}

// Upcoming পেজে ফর্ম দেখানোর ফাংশন
function showUpcomingForm() {
    const form = document.getElementById('upcomingForm');
    if (form) {
        form.scrollIntoView({ behavior: 'smooth' });
        const firstInput = form.querySelector('input, select, textarea');
        if (firstInput) firstInput.focus();
    }
}

// Fixed Expenses পেজে ফর্ম দেখানোর ফাংশন
function showFixedExpenseForm() {
    const form = document.getElementById('fixedExpenseForm');
    if (form) {
        form.scrollIntoView({ behavior: 'smooth' });
        const firstInput = form.querySelector('input, select, textarea');
        if (firstInput) firstInput.focus();
    }
}

function setupFABForTransactions() {
    const fab = document.getElementById('fab');
    const fabIcon = fab.querySelector('.fab-icon');
    
    fab.setAttribute('title', 'নতুন লেনদেন যোগ করুন');
    fabIcon.textContent = '+';
    
    // Remove any existing event listeners
    fab.replaceWith(fab.cloneNode(true));
    const newFab = document.getElementById('fab');
    
    newFab.addEventListener('click', function() {
        const form = document.getElementById('transactionForm');
        if (form) {
            form.scrollIntoView({ behavior: 'smooth' });
            const firstInput = form.querySelector('input, select, textarea');
            if (firstInput) firstInput.focus();
        }
    });
}

function setupFABForUpcoming() {
    const fab = document.getElementById('fab');
    const fabIcon = fab.querySelector('.fab-icon');
    
    fab.setAttribute('title', 'নতুন আসন্ন খরচ যোগ করুন');
    fabIcon.textContent = '+';
    
    // Remove any existing event listeners
    fab.replaceWith(fab.cloneNode(true));
    const newFab = document.getElementById('fab');
    
    newFab.addEventListener('click', function() {
        const form = document.getElementById('upcomingForm');
        if (form) {
            form.scrollIntoView({ behavior: 'smooth' });
            const firstInput = form.querySelector('input, select, textarea');
            if (firstInput) firstInput.focus();
        }
    });
}

function setupFABForFixedExpenses() {
    const fab = document.getElementById('fab');
    const fabIcon = fab.querySelector('.fab-icon');
    
    fab.setAttribute('title', 'নতুন ফিক্সড খরচ যোগ করুন');
    fabIcon.textContent = '+';
    
    // Remove any existing event listeners
    fab.replaceWith(fab.cloneNode(true));
    const newFab = document.getElementById('fab');
    
    newFab.addEventListener('click', function() {
        const form = document.getElementById('fixedExpenseForm');
        if (form) {
            form.scrollIntoView({ behavior: 'smooth' });
            const firstInput = form.querySelector('input, select, textarea');
            if (firstInput) firstInput.focus();
        }
    });
}

function setupFABForSettings() {
    const fab = document.getElementById('fab');
    const fabIcon = fab.querySelector('.fab-icon');
    
    fab.setAttribute('title', 'সেটিংস সংরক্ষণ করুন');
    fabIcon.textContent = '💾';
    
    // Remove any existing event listeners
    fab.replaceWith(fab.cloneNode(true));
    const newFab = document.getElementById('fab');
    
    newFab.addEventListener('click', function() {
        const saveBtn = document.getElementById('saveSettings');
        if (saveBtn) {
            // এনিমেশন যোগ করুন
            newFab.classList.add('fab-saving');
            saveBtn.click();
            
            // 1 সেকেন্ড পর এনিমেশন রিমুভ করুন
            setTimeout(() => {
                newFab.classList.remove('fab-saving');
            }, 1000);
        }
    });
}

function setupFABForDefault() {
    const fab = document.getElementById('fab');
    const fabIcon = fab.querySelector('.fab-icon');
    
    fab.setAttribute('title', 'লেনদেন পেজে যান');
    fabIcon.textContent = '+';
    
    // Remove any existing event listeners
    fab.replaceWith(fab.cloneNode(true));
    const newFab = document.getElementById('fab');
    
    newFab.addEventListener('click', function() {
        window.location.href = 'transactions.html';
    });
}

function setupPageChangeListener() {
    // Navigation links এ click করলে menu close করুন
    document.addEventListener('click', function(e) {
        if (e.target.closest('a') && !e.target.closest('.fab-menu')) {
            closeFabMenu();
        }
    });
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
    closeFabMenu();
    
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

// Page unload হলে menu clean up করুন
window.addEventListener('beforeunload', function() {
    closeFabMenu();
});