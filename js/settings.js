// Settings Management - FIXED VERSION
document.addEventListener('DOMContentLoaded', function() {
    initializeSettings();
    setupSettingsEventListeners();
});

function initializeSettings() {
    loadSettingsForm();
    
    // Settings page specific theme toggle setup
    setupSettingsThemeToggle();
}

function setupSettingsEventListeners() {
    // Save Settings
    document.getElementById('saveSettings').addEventListener('click', saveSettingsForm);

    // Export Data
    document.getElementById('exportData').addEventListener('click', exportAllData);

    // Import Data
    document.getElementById('importData').addEventListener('click', importData);

    // Clear Data
    document.getElementById('clearData').addEventListener('click', clearAllData);

    // Settings Page Specific Theme Toggle
    const settingsThemeToggle = document.getElementById('darkMode');
    if (settingsThemeToggle) {
        settingsThemeToggle.addEventListener('change', function() {
            const isDarkMode = this.checked;
            window.appState.settings.darkMode = isDarkMode;
            
            // Apply theme immediately
            if (isDarkMode) {
                document.body.classList.add('dark-mode');
            } else {
                document.body.classList.remove('dark-mode');
            }
            
            // Save settings
            saveSettings();
            
            // Update all theme toggle buttons in the app
            updateAllThemeToggleButtons();
            
            showNotification(
                window.appState.settings.language === 'bn' ? 
                (isDarkMode ? 'ডার্ক মোড সক্রিয় করা হয়েছে' : 'লাইট মোড সক্রিয় করা হয়েছে') : 
                (isDarkMode ? 'Dark mode enabled' : 'Light mode enabled'), 
                'success'
            );
        });
    }

    // Language Toggle - Settings page specific
    const settingsLanguageToggle = document.getElementById('languageToggle');
    if (settingsLanguageToggle) {
        settingsLanguageToggle.addEventListener('click', function() {
            const newLanguage = window.appState.settings.language === 'bn' ? 'en' : 'bn';
            window.appState.settings.language = newLanguage;
            saveSettings();
            applyLanguage(newLanguage);
            this.textContent = newLanguage === 'bn' ? 'EN' : 'BN';
            loadSettingsForm();
            
            showNotification(
                newLanguage === 'bn' ? 'বাংলা ভাষা সক্রিয়' : 'English language activated',
                'success'
            );
        });
    }
}

function setupSettingsThemeToggle() {
    // Settings page এর জন্য আলাদা theme toggle setup
    const darkModeToggle = document.getElementById('darkMode');
    if (darkModeToggle) {
        // Current state load করুন
        darkModeToggle.checked = window.appState.settings.darkMode;
        
        // Initial state apply করুন
        if (window.appState.settings.darkMode) {
            document.body.classList.add('dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
        }
    }
}

function loadSettingsForm() {
    // Currency
    const currencySelect = document.getElementById('currency');
    if (currencySelect) {
        currencySelect.value = window.appState.settings.currency;
    }
    
    // Date Format
    const dateFormatSelect = document.getElementById('dateFormat');
    if (dateFormatSelect) {
        dateFormatSelect.value = window.appState.settings.dateFormat;
    }
    
    // Dark Mode Toggle
    const darkModeToggle = document.getElementById('darkMode');
    if (darkModeToggle) {
        darkModeToggle.checked = window.appState.settings.darkMode;
    }
    
    // Language Toggle Button Text
    const languageToggle = document.getElementById('languageToggle');
    if (languageToggle) {
        languageToggle.textContent = window.appState.settings.language === 'bn' ? 'EN' : 'BN';
    }
}

function saveSettingsForm() {
    // Currency
    const currencySelect = document.getElementById('currency');
    if (currencySelect) {
        window.appState.settings.currency = currencySelect.value;
    }
    
    // Date Format
    const dateFormatSelect = document.getElementById('dateFormat');
    if (dateFormatSelect) {
        window.appState.settings.dateFormat = dateFormatSelect.value;
    }
    
    // Dark Mode - settings form থেকে নেওয়া হচ্ছে না কারণ real-time update হয়
    // window.appState.settings.darkMode already updated via toggle
    
    saveSettings();
    
    showNotification(
        window.appState.settings.language === 'bn' ? 
        'সেটিংস সংরক্ষণ করা হয়েছে!' : 
        'Settings saved successfully!', 
        'success'
    );
}

// Helper function to update all theme toggle buttons in the app
function updateAllThemeToggleButtons() {
    // Mobile theme toggle
    const mobileThemeToggle = document.getElementById('mobileThemeToggle');
    if (mobileThemeToggle) {
        if (window.appState.settings.darkMode) {
            mobileThemeToggle.textContent = '☀️';
            mobileThemeToggle.title = 'Light Mode';
        } else {
            mobileThemeToggle.textContent = '🌙';
            mobileThemeToggle.title = 'Dark Mode';
        }
    }
    
    // Desktop theme toggle
    const desktopThemeToggle = document.getElementById('desktopThemeToggle');
    if (desktopThemeToggle) {
        if (window.appState.settings.darkMode) {
            desktopThemeToggle.textContent = '☀️';
            desktopThemeToggle.title = 'Light Mode';
        } else {
            desktopThemeToggle.textContent = '🌙';
            desktopThemeToggle.title = 'Dark Mode';
        }
    }
}

// বাকি functions (exportAllData, importData, clearAllData) একই থাকবে
function exportAllData() {
    const data = {
        transactions: window.appState.transactions,
        upcomingExpenses: window.appState.upcomingExpenses,
        fixedExpenses: window.appState.fixedExpenses,
        settings: window.appState.settings,
        exportedAt: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `money_manager_backup_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    URL.revokeObjectURL(url);
    
    showNotification(
        window.appState.settings.language === 'bn' ? 
        'ডেটা সফলভাবে এক্সপোর্ট করা হয়েছে!' : 
        'Data exported successfully!', 
        'success'
    );
}

function importData() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    
    input.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                const data = JSON.parse(e.target.result);
                
                if (confirm(getTranslation('confirmImport'))) {
                    if (data.transactions) window.appState.transactions = data.transactions;
                    if (data.upcomingExpenses) window.appState.upcomingExpenses = data.upcomingExpenses;
                    if (data.fixedExpenses) window.appState.fixedExpenses = data.fixedExpenses;
                    if (data.settings) {
                        window.appState.settings = data.settings;
                        // Settings reload করুন
                        loadSettingsForm();
                        applySettings();
                    }
                    
                    saveTransactions();
                    saveUpcomingExpenses();
                    saveFixedExpenses();
                    saveSettings();
                    
                    showNotification(
                        window.appState.settings.language === 'bn' ? 
                        'ডেটা সফলভাবে ইম্পোর্ট করা হয়েছে!' : 
                        'Data imported successfully!', 
                        'success'
                    );
                }
            } catch (error) {
                showNotification(
                    window.appState.settings.language === 'bn' ? 
                    'ডেটা ইম্পোর্ট করতে সমস্যা হয়েছে। ফাইল ফরম্যাট সঠিক কিনা তা পরীক্ষা করুন।' : 
                    'Error importing data. Please check the file format.', 
                    'error'
                );
            }
        };
        
        reader.readAsText(file);
    });
    
    input.click();
}

function clearAllData() {
    if (confirm(getTranslation('confirmClear'))) {
        window.appState.transactions = [];
        window.appState.upcomingExpenses = [];
        window.appState.fixedExpenses = [];
        
        saveTransactions();
        saveUpcomingExpenses();
        saveFixedExpenses();
        
        showNotification(
            window.appState.settings.language === 'bn' ? 
            'সমস্ত ডেটা মুছে ফেলা হয়েছে!' : 
            'All data cleared successfully!', 
            'success'
        );
    }
}

// Translation helper function
function getTranslation(key) {
    const translations = {
        'bn': {
            'confirmImport': 'আপনি কি নিশ্চিত যে আপনি ডেটা ইম্পোর্ট করতে চান? বর্তমান ডেটা প্রতিস্থাপিত হবে।',
            'confirmClear': 'আপনি কি নিশ্চিত যে আপনি সমস্ত ডেটা মুছতে চান? এই কাজটি পূর্বাবস্থায় ফিরিয়ে নেওয়া যাবে না।'
        },
        'en': {
            'confirmImport': 'Are you sure you want to import data? Current data will be replaced.',
            'confirmClear': 'Are you sure you want to clear all data? This action cannot be undone.'
        }
    };
    
    return translations[window.appState.settings.language]?.[key] || key;
}