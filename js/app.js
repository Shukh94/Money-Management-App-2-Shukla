// Global App State
window.appState = {
    transactions: JSON.parse(localStorage.getItem('transactions')) || [],
    upcomingExpenses: JSON.parse(localStorage.getItem('upcomingExpenses')) || [],
    fixedExpenses: JSON.parse(localStorage.getItem('fixedExpenses')) || [],
    settings: JSON.parse(localStorage.getItem('settings')) || {
        currency: 'BDT',
        dateFormat: 'dd-mm-yyyy',
        darkMode: false,
        language: 'bn'
    }
};

// Language translations
const translations = {
    'bn': {
        // ... existing translations ...
        'fixedExpenseManagement': 'ফিক্সড খরচ ব্যবস্থাপনা',
        'totalFixedExpenses': 'মোট ফিক্সড খরচ',
        'activeFixedExpenses': 'একটিভ ফিক্সড খরচ',
        'inactiveFixedExpenses': 'নিষ্ক্রিয় ফিক্সড খরচ',
        'addFixedExpense': 'ফিক্সড খরচ যোগ করুন',
        'dueDay': 'পরিশোধের দিন',
        'startDate': 'শুরুর তারিখ',
        'endDate': 'শেষ তারিখ',
        'active': 'একটিভ',
        'inactive': 'নিষ্ক্রিয়',
        'fixedExpenseList': 'ফিক্সড খরচের তালিকা',
        'fixedExpensesSummary': 'ফিক্সড মাসিক খরচ',
        'monthlyFixedExpenses': 'মাসিক ফিক্সড খরচ',
        'toggleActive': 'একটিভ/নিষ্ক্রিয় করুন',
        'markAsPaid': 'পরিশোধিত করুন',
        'generateThisMonth': 'এই মাসের জন্য জেনারেট করুন'
    },
    'en': {
        // ... existing translations ...
        'fixedExpenseManagement': 'Fixed Expense Management',
        'totalFixedExpenses': 'Total Fixed Expenses',
        'activeFixedExpenses': 'Active Fixed Expenses',
        'inactiveFixedExpenses': 'Inactive Fixed Expenses',
        'addFixedExpense': 'Add Fixed Expense',
        'dueDay': 'Due Day',
        'startDate': 'Start Date',
        'endDate': 'End Date',
        'active': 'Active',
        'inactive': 'Inactive',
        'fixedExpenseList': 'Fixed Expense List',
        'fixedExpensesSummary': 'Fixed Monthly Expenses',
        'monthlyFixedExpenses': 'Monthly Fixed Expenses',
        'toggleActive': 'Toggle Active/Inactive',
        'markAsPaid': 'Mark as Paid',
        'generateThisMonth': 'Generate for This Month'
    }
};

// Common Utility Functions
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

function formatCurrency(amount) {
    const formatter = new Intl.NumberFormat(
        window.appState.settings.language === 'bn' ? 'bn-BD' : 'en-US', 
        {
            style: 'currency',
            currency: window.appState.settings.currency,
            minimumFractionDigits: 2
        }
    );
    return formatter.format(amount);
}

function formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    
    if (window.appState.settings.dateFormat === 'dd-mm-yyyy') {
        return `${day}-${month}-${year}`;
    } else if (window.appState.settings.dateFormat === 'mm-dd-yyyy') {
        return `${month}-${day}-${year}`;
    } else {
        return `${year}-${month}-${day}`;
    }
}

function getTranslation(key) {
    return translations[window.appState.settings.language]?.[key] || key;
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 5px;
        color: white;
        font-weight: bold;
        z-index: 1000;
        animation: slideIn 0.3s ease;
        max-width: 300px;
        background-color: ${type === 'success' ? '#2ecc71' : type === 'error' ? '#e74c3c' : '#3498db'};
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Initialize common functionality
document.addEventListener('DOMContentLoaded', function() {
    initializeCommon();
});

function initializeCommon() {
    // Set current date as default in forms
    const today = new Date().toISOString().split('T')[0];
    const dateInputs = document.querySelectorAll('input[type="date"]');
    dateInputs.forEach(input => {
        if (!input.value) input.value = today;
    });
    
    // Apply saved settings
    applySettings();
}

function applySettings() {
    // Apply dark mode
    if (window.appState.settings.darkMode) {
        document.body.classList.add('dark-mode');
    }
    
    // Apply language
    applyLanguage(window.appState.settings.language);
}

function applyLanguage(language) {
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (translations[language]?.[key]) {
            element.textContent = translations[language][key];
        }
    });
}

// Save functions
function saveTransactions() {
    localStorage.setItem('transactions', JSON.stringify(window.appState.transactions));
}

function saveUpcomingExpenses() {
    localStorage.setItem('upcomingExpenses', JSON.stringify(window.appState.upcomingExpenses));
}

function saveFixedExpenses() {
    localStorage.setItem('fixedExpenses', JSON.stringify(window.appState.fixedExpenses));
}

function saveSettings() {
    localStorage.setItem('settings', JSON.stringify(window.appState.settings));
}