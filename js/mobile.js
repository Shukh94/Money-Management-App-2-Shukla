// Mobile-Specific Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Check if mobile
    if (window.innerWidth <= 768) {
        initializeMobile();
        setupMobileEventListeners();
    }
});

function initializeMobile() {
    // Only run on mobile devices
    if (window.innerWidth > 768) return;
    
    console.log('Mobile interface initialized');
}

function setupMobileEventListeners() {
    // Only run on mobile devices
    if (window.innerWidth > 768) return;

    // FAB functionality
    const fab = document.getElementById('fab');
    if (fab) {
        fab.addEventListener('click', function() {
            // Default FAB action - go to add transaction
            window.location.href = 'transactions.html';
        });
    }

    // Mobile navigation active state
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

// Handle mobile resize
window.addEventListener('resize', function() {
    if (window.innerWidth <= 768) {
        initializeMobile();
    }
});