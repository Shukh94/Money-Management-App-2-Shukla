// Settings Management - NETLIFY COMPATIBLE VERSION
console.log('🔧 Settings.js Loading...');

// Netlify compatibility check
if (typeof window === 'undefined') {
    console.log('❌ Window object not available');
} else {
    console.log('✅ Window object available');
}

document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 DOM Content Loaded - Initializing Settings');
    
    // Check if appState is available
    if (!window.appState) {
        console.error('❌ appState not available. Waiting...');
        // Retry after a delay
        setTimeout(() => {
            if (window.appState) {
                initializeSettings();
                setupSettingsEventListeners();
            } else {
                console.error('❌ appState still not available after timeout');
            }
        }, 1000);
        return;
    }
    
    initializeSettings();
    setupSettingsEventListeners();
});

function initializeSettings() {
    console.log('⚙️ Initializing Settings...');
    
    // Check required elements
    const requiredElements = ['saveSettings', 'exportData', 'importData', 'clearData', 'darkMode'];
    const missingElements = requiredElements.filter(id => !document.getElementById(id));
    
    if (missingElements.length > 0) {
        console.warn('⚠️ Missing elements:', missingElements);
    }
    
    try {
        loadSettingsForm();
        setupSettingsThemeToggle();
        console.log('✅ Settings initialized successfully');
    } catch (error) {
        console.error('❌ Error initializing settings:', error);
    }
}

function setupSettingsEventListeners() {
    console.log('🔧 Setting up event listeners...');
    
    try {
        // Save Settings
        const saveBtn = document.getElementById('saveSettings');
        if (saveBtn) {
            saveBtn.addEventListener('click', saveSettingsForm);
            console.log('✅ Save button listener added');
        } else {
            console.error('❌ Save button not found');
        }

        // Export Data
        const exportBtn = document.getElementById('exportData');
        if (exportBtn) {
            exportBtn.addEventListener('click', exportAllData);
            console.log('✅ Export button listener added');
        }

        // Import Data
        const importBtn = document.getElementById('importData');
        if (importBtn) {
            importBtn.addEventListener('click', importData);
            console.log('✅ Import button listener added');
        }

        // Clear Data
        const clearBtn = document.getElementById('clearData');
        if (clearBtn) {
            clearBtn.addEventListener('click', clearAllData);
            console.log('✅ Clear button listener added');
        }

        // Settings Page Specific Theme Toggle
        const settingsThemeToggle = document.getElementById('darkMode');
        if (settingsThemeToggle) {
            settingsThemeToggle.addEventListener('change', function() {
                console.log('🎨 Theme toggle changed:', this.checked);
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
            console.log('✅ Theme toggle listener added');
        } else {
            console.error('❌ Theme toggle not found');
        }

        // Language Toggle - Settings page specific
        const settingsLanguageToggle = document.getElementById('languageToggle');
        if (settingsLanguageToggle) {
            settingsLanguageToggle.addEventListener('click', function() {
                console.log('🌐 Language toggle clicked');
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
            console.log('✅ Language toggle listener added');
        }

        console.log('✅ All event listeners setup complete');
        
    } catch (error) {
        console.error('❌ Error setting up event listeners:', error);
    }
}

function setupSettingsThemeToggle() {
    console.log('🎨 Setting up settings theme toggle...');
    
    const darkModeToggle = document.getElementById('darkMode');
    if (darkModeToggle && window.appState) {
        // Current state load করুন
        darkModeToggle.checked = window.appState.settings.darkMode;
        
        // Initial state apply করুন
        if (window.appState.settings.darkMode) {
            document.body.classList.add('dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
        }
        console.log('✅ Theme toggle initialized:', darkModeToggle.checked);
    } else {
        console.error('❌ Theme toggle or appState not available');
    }
}

function loadSettingsForm() {
    console.log('📝 Loading settings form...');
    
    if (!window.appState) {
        console.error('❌ appState not available for loading form');
        return;
    }

    try {
        // Currency
        const currencySelect = document.getElementById('currency');
        if (currencySelect) {
            currencySelect.value = window.appState.settings.currency;
            console.log('✅ Currency loaded:', window.appState.settings.currency);
        }
        
        // Date Format
        const dateFormatSelect = document.getElementById('dateFormat');
        if (dateFormatSelect) {
            dateFormatSelect.value = window.appState.settings.dateFormat;
            console.log('✅ Date format loaded:', window.appState.settings.dateFormat);
        }
        
        // Dark Mode Toggle
        const darkModeToggle = document.getElementById('darkMode');
        if (darkModeToggle) {
            darkModeToggle.checked = window.appState.settings.darkMode;
            console.log('✅ Dark mode loaded:', window.appState.settings.darkMode);
        }
        
        // Language Toggle Button Text
        const languageToggle = document.getElementById('languageToggle');
        if (languageToggle) {
            languageToggle.textContent = window.appState.settings.language === 'bn' ? 'EN' : 'BN';
            console.log('✅ Language toggle loaded:', languageToggle.textContent);
        }
        
        console.log('✅ Settings form loaded successfully');
    } catch (error) {
        console.error('❌ Error loading settings form:', error);
    }
}

// বাকি functions একই রাখুন, শুধু error handling যোগ করুন
function saveSettingsForm() {
    console.log('💾 Saving settings...');
    
    if (!window.appState) {
        console.error('❌ appState not available for saving');
        showNotification('Error saving settings', 'error');
        return;
    }

    try {
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
        
        saveSettings();
        
        showNotification(
            window.appState.settings.language === 'bn' ? 
            'সেটিংস সংরক্ষণ করা হয়েছে!' : 
            'Settings saved successfully!', 
            'success'
        );
        
        console.log('✅ Settings saved successfully');
    } catch (error) {
        console.error('❌ Error saving settings:', error);
        showNotification('Error saving settings', 'error');
    }
}

// Helper function to update all theme toggle buttons in the app
function updateAllThemeToggleButtons() {
    console.log('🔄 Updating theme toggle buttons...');
    
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
    
    console.log('✅ Theme toggle buttons updated');
}

// বাকি functions (exportAllData, importData, clearAllData) একই রাখুন, শুধু console logs যোগ করুন

console.log('✅ Settings.js loaded successfully');