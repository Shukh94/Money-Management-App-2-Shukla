// Settings Management
document.addEventListener('DOMContentLoaded', function() {
    initializeSettings();
    setupSettingsEventListeners();
});

function initializeSettings() {
    loadSettingsForm();
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

    // Theme Toggle
    document.getElementById('themeToggle').addEventListener('click', function() {
        document.body.classList.toggle('dark-mode');
        window.appState.settings.darkMode = document.body.classList.contains('dark-mode');
        saveSettings();
    });

    // Language Toggle
    document.getElementById('languageToggle').addEventListener('click', function() {
        const newLanguage = window.appState.settings.language === 'bn' ? 'en' : 'bn';
        window.appState.settings.language = newLanguage;
        saveSettings();
        applyLanguage(newLanguage);
        this.textContent = newLanguage === 'bn' ? 'EN' : 'BN';
        loadSettingsForm();
    });
}

function loadSettingsForm() {
    document.getElementById('currency').value = window.appState.settings.currency;
    document.getElementById('dateFormat').value = window.appState.settings.dateFormat;
    document.getElementById('darkMode').checked = window.appState.settings.darkMode;
}

function saveSettingsForm() {
    window.appState.settings.currency = document.getElementById('currency').value;
    window.appState.settings.dateFormat = document.getElementById('dateFormat').value;
    window.appState.settings.darkMode = document.getElementById('darkMode').checked;
    
    saveSettings();
    
    showNotification(
        window.appState.settings.language === 'bn' ? 
        'সেটিংস সংরক্ষণ করা হয়েছে!' : 
        'Settings saved successfully!', 
        'success'
    );
}

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
                    if (data.settings) window.appState.settings = data.settings;
                    
                    saveTransactions();
                    saveUpcomingExpenses();
                    saveFixedExpenses();
                    saveSettings();
                    
                    loadSettingsForm();
                    applyLanguage(window.appState.settings.language);
                    document.getElementById('languageToggle').textContent = 
                        window.appState.settings.language === 'bn' ? 'EN' : 'BN';
                    
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