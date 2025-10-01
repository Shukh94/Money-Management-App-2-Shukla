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

// Complete Language translations
const translations = {
    'bn': {
        // Navigation
        'dashboard': 'ড্যাশবোর্ড',
        'transactions': 'লেনদেন',
        'reports': 'রিপোর্ট',
        'upcoming': 'আসন্ন',
        'upcomingExpenses': 'আসন্ন খরচ',
        'fixed': 'ফিক্সড',
        'fixedExpenses': 'ফিক্সড খরচ',
        'settings': 'সেটিংস',
        
        // Common
        'add': 'যোগ করুন',
        'edit': 'সম্পাদনা',
        'delete': 'মুছুন',
        'save': 'সংরক্ষণ',
        'cancel': 'বাতিল',
        'submit': 'জমা দিন',
        'filter': 'ফিল্টার',
        'search': 'খুঁজুন',
        'total': 'মোট',
        'amount': 'পরিমাণ',
        'date': 'তারিখ',
        'description': 'বিবরণ',
        'category': 'ক্যাটাগরি',
        'type': 'ধরন',
        'income': 'আয়',
        'expense': 'খরচ',
        
        // Dashboard
        'totalBalance': 'মোট ব্যালেন্স',
        'totalIncome': 'মোট আয়',
        'totalExpense': 'মোট খরচ',
        'recentTransactions': 'সাম্প্রতিক লেনদেন',
        'noTransactions': 'কোন লেনদেন নেই',
        
        // Transactions
        'addTransaction': 'লেনদেন যোগ করুন',
        'transactionType': 'লেনদেনের ধরন',
        'transactionDate': 'লেনদেনের তারিখ',
        'transactionAmount': 'লেনদেনের পরিমাণ',
        'transactionCategory': 'লেনদেনের ক্যাটাগরি',
        'transactionDescription': 'লেনদেনের বিবরণ',
        
        // Categories
        'food': 'খাবার',
        'transport': 'যাতায়াত',
        'shopping': 'কেনাকাটা',
        'entertainment': 'বিনোদন',
        'bills': 'বিল',
        'healthcare': 'স্বাস্থ্য',
        'education': 'শিক্ষা',
        'salary': 'বেতন',
        'other': 'অন্যান্য',
        
        // Fixed Expenses
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
        'generateThisMonth': 'এই মাসের জন্য জেনারেট করুন',
        
        // Settings
        'currencySettings': 'কারেন্সি সেটিংস',
        'dateFormatSettings': 'তারিখ ফরম্যাট সেটিংস',
        'languageSettings': 'ভাষা সেটিংস',
        'darkModeSettings': 'ডার্ক মোড সেটিংস',
        'selectCurrency': 'কারেন্সি নির্বাচন করুন',
        'selectDateFormat': 'তারিখ ফরম্যাট নির্বাচন করুন',
        'selectLanguage': 'ভাষা নির্বাচন করুন',
        
        // Notifications
        'darkModeEnabled': 'ডার্ক মোড সক্রিয় করা হয়েছে',
        'lightModeEnabled': 'লাইট মোড সক্রিয় করা হয়েছে',
        'settingsSaved': 'সেটিংস সংরক্ষণ করা হয়েছে',
        'transactionAdded': 'লেনদেন যোগ করা হয়েছে',
        'transactionDeleted': 'লেনদেন মুছে ফেলা হয়েছে'
    },
    'en': {
        // Navigation
        'dashboard': 'Dashboard',
        'transactions': 'Transactions',
        'reports': 'Reports',
        'upcoming': 'Upcoming',
        'upcomingExpenses': 'Upcoming Expenses',
        'fixed': 'Fixed',
        'fixedExpenses': 'Fixed Expenses',
        'settings': 'Settings',
        
        // Common
        'add': 'Add',
        'edit': 'Edit',
        'delete': 'Delete',
        'save': 'Save',
        'cancel': 'Cancel',
        'submit': 'Submit',
        'filter': 'Filter',
        'search': 'Search',
        'total': 'Total',
        'amount': 'Amount',
        'date': 'Date',
        'description': 'Description',
        'category': 'Category',
        'type': 'Type',
        'income': 'Income',
        'expense': 'Expense',
        
        // Dashboard
        'totalBalance': 'Total Balance',
        'totalIncome': 'Total Income',
        'totalExpense': 'Total Expense',
        'recentTransactions': 'Recent Transactions',
        'noTransactions': 'No Transactions',
        
        // Transactions
        'addTransaction': 'Add Transaction',
        'transactionType': 'Transaction Type',
        'transactionDate': 'Transaction Date',
        'transactionAmount': 'Transaction Amount',
        'transactionCategory': 'Transaction Category',
        'transactionDescription': 'Transaction Description',
        
        // Categories
        'food': 'Food',
        'transport': 'Transport',
        'shopping': 'Shopping',
        'entertainment': 'Entertainment',
        'bills': 'Bills',
        'healthcare': 'Healthcare',
        'education': 'Education',
        'salary': 'Salary',
        'other': 'Other',
        
        // Fixed Expenses
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
        'generateThisMonth': 'Generate for This Month',
        
        // Settings
        'currencySettings': 'Currency Settings',
        'dateFormatSettings': 'Date Format Settings',
        'languageSettings': 'Language Settings',
        'darkModeSettings': 'Dark Mode Settings',
        'selectCurrency': 'Select Currency',
        'selectDateFormat': 'Select Date Format',
        'selectLanguage': 'Select Language',
        
        // Notifications
        'darkModeEnabled': 'Dark mode enabled',
        'lightModeEnabled': 'Light mode enabled',
        'settingsSaved': 'Settings saved successfully',
        'transactionAdded': 'Transaction added successfully',
        'transactionDeleted': 'Transaction deleted successfully'
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
    
    // Initialize theme toggles for both mobile and desktop
    initializeThemeToggles();
    
    // Initialize language toggles for both mobile and desktop
    initializeLanguageToggles();
}

function initializeThemeToggles() {
    // Mobile theme toggle
    const mobileThemeToggle = document.getElementById('mobileThemeToggle');
    if (mobileThemeToggle) {
        mobileThemeToggle.addEventListener('click', toggleDarkMode);
        updateThemeToggleButton(mobileThemeToggle);
    }
    
    // Desktop theme toggle
    const desktopThemeToggle = document.getElementById('desktopThemeToggle');
    if (desktopThemeToggle) {
        desktopThemeToggle.addEventListener('click', toggleDarkMode);
        updateThemeToggleButton(desktopThemeToggle);
    }
}

function initializeLanguageToggles() {
    // Mobile language toggle
    const mobileLanguageToggle = document.getElementById('mobileLanguageToggle');
    if (mobileLanguageToggle) {
        mobileLanguageToggle.addEventListener('click', toggleLanguage);
        updateLanguageToggleButton(mobileLanguageToggle);
    }
    
    // Desktop language toggle
    const desktopLanguageToggle = document.getElementById('desktopLanguageToggle');
    if (desktopLanguageToggle) {
        desktopLanguageToggle.addEventListener('click', toggleLanguage);
        updateLanguageToggleButton(desktopLanguageToggle);
    }
}

function toggleDarkMode() {
    window.appState.settings.darkMode = !window.appState.settings.darkMode;
    saveSettings();
    applySettings();
    
    // Update all theme toggle buttons
    const mobileToggle = document.getElementById('mobileThemeToggle');
    const desktopToggle = document.getElementById('desktopThemeToggle');
    
    if (mobileToggle) updateThemeToggleButton(mobileToggle);
    if (desktopToggle) updateThemeToggleButton(desktopToggle);
    
    showNotification(
        getTranslation(window.appState.settings.darkMode ? 'darkModeEnabled' : 'lightModeEnabled'),
        'success'
    );
}

function updateThemeToggleButton(button) {
    if (window.appState.settings.darkMode) {
        button.textContent = '☀️';
        button.title = 'Light Mode';
    } else {
        button.textContent = '🌙';
        button.title = 'Dark Mode';
    }
}

function toggleLanguage() {
    const currentLang = window.appState.settings.language;
    window.appState.settings.language = currentLang === 'bn' ? 'en' : 'bn';
    saveSettings();
    applySettings();
    
    // Update all language toggle buttons
    const mobileToggle = document.getElementById('mobileLanguageToggle');
    const desktopToggle = document.getElementById('desktopLanguageToggle');
    
    if (mobileToggle) updateLanguageToggleButton(mobileToggle);
    if (desktopToggle) updateLanguageToggleButton(desktopToggle);
    
    // Apply language to entire page without reload
    applyLanguageToPage();
    
    showNotification(
        window.appState.settings.language === 'bn' ? 
        'বাংলা ভাষা সক্রিয়' : 
        'English language activated',
        'success'
    );
}

function updateLanguageToggleButton(button) {
    if (window.appState.settings.language === 'bn') {
        button.textContent = 'EN';
        button.title = 'Switch to English';
    } else {
        button.textContent = 'BN';
        button.title = 'বাংলায় পরিবর্তন করুন';
    }
}

function applySettings() {
    // Apply dark mode
    if (window.appState.settings.darkMode) {
        document.body.classList.add('dark-mode');
    } else {
        document.body.classList.remove('dark-mode');
    }
    
    // Apply language to entire page
    applyLanguageToPage();
    
    // Update all buttons to reflect current state
    updateAllToggleButtons();
}

function updateAllToggleButtons() {
    // Update theme buttons
    const mobileTheme = document.getElementById('mobileThemeToggle');
    const desktopTheme = document.getElementById('desktopThemeToggle');
    
    if (mobileTheme) updateThemeToggleButton(mobileTheme);
    if (desktopTheme) updateThemeToggleButton(desktopTheme);
    
    // Update language buttons
    const mobileLang = document.getElementById('mobileLanguageToggle');
    const desktopLang = document.getElementById('desktopLanguageToggle');
    
    if (mobileLang) updateLanguageToggleButton(mobileLang);
    if (desktopLang) updateLanguageToggleButton(desktopLang);
}

// New function to translate entire page
function applyLanguageToPage() {
    const language = window.appState.settings.language;
    
    // Translate elements with data-i18n attribute
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (translations[language]?.[key]) {
            element.textContent = translations[language][key];
        }
    });
    
    // Translate navigation items
    translateNavigation();
    
    // Translate buttons
    translateButtons();
    
    // Translate form elements
    translateFormElements();
    
    // Translate placeholders
    translatePlaceholders();
    
    // Update dynamic content if needed
    updateDynamicContent();
}

function translateNavigation() {
    const language = window.appState.settings.language;
    
    // Desktop navigation
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        const text = link.textContent.trim();
        const translationKey = getKeyByValue(translations[language === 'bn' ? 'en' : 'bn'], text);
        if (translationKey && translations[language]?.[translationKey]) {
            link.textContent = translations[language][translationKey];
        }
    });
    
    // Mobile navigation
    const mobileNavLabels = document.querySelectorAll('.nav-label');
    mobileNavLabels.forEach(label => {
        const text = label.textContent.trim();
        const translationKey = getKeyByValue(translations[language === 'bn' ? 'en' : 'bn'], text);
        if (translationKey && translations[language]?.[translationKey]) {
            label.textContent = translations[language][translationKey];
        }
    });
}

function translateButtons() {
    const language = window.appState.settings.language;
    const buttons = document.querySelectorAll('button');
    
    buttons.forEach(button => {
        // Skip toggle buttons
        if (button.classList.contains('language-toggle') || button.classList.contains('theme-toggle')) {
            return;
        }
        
        const text = button.textContent.trim();
        if (text) {
            const translationKey = getKeyByValue(translations[language === 'bn' ? 'en' : 'bn'], text);
            if (translationKey && translations[language]?.[translationKey]) {
                button.textContent = translations[language][translationKey];
            }
        }
    });
}

function translateFormElements() {
    const language = window.appState.settings.language;
    
    // Translate labels
    const labels = document.querySelectorAll('label');
    labels.forEach(label => {
        const text = label.textContent.trim();
        if (text) {
            const translationKey = getKeyByValue(translations[language === 'bn' ? 'en' : 'bn'], text);
            if (translationKey && translations[language]?.[translationKey]) {
                label.textContent = translations[language][translationKey];
            }
        }
    });
    
    // Translate options in select elements
    const selectElements = document.querySelectorAll('select');
    selectElements.forEach(select => {
        Array.from(select.options).forEach(option => {
            const text = option.textContent.trim();
            if (text) {
                const translationKey = getKeyByValue(translations[language === 'bn' ? 'en' : 'bn'], text);
                if (translationKey && translations[language]?.[translationKey]) {
                    option.textContent = translations[language][translationKey];
                }
            }
        });
    });
}

function translatePlaceholders() {
    const language = window.appState.settings.language;
    const inputs = document.querySelectorAll('input[placeholder], textarea[placeholder]');
    
    inputs.forEach(input => {
        const placeholder = input.getAttribute('placeholder');
        if (placeholder) {
            const translationKey = getKeyByValue(translations[language === 'bn' ? 'en' : 'bn'], placeholder);
            if (translationKey && translations[language]?.[translationKey]) {
                input.setAttribute('placeholder', translations[language][translationKey]);
            }
        }
    });
}

function updateDynamicContent() {
    // This function can be extended to update dynamic content
    // like transaction lists, charts, etc.
    if (typeof updateTransactionsDisplay === 'function') {
        updateTransactionsDisplay();
    }
    
    if (typeof updateFixedExpensesDisplay === 'function') {
        updateFixedExpensesDisplay();
    }
}

// Helper function to find translation key by value
function getKeyByValue(object, value) {
    return Object.keys(object).find(key => object[key] === value);
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