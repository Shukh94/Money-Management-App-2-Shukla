// Transactions Management
document.addEventListener('DOMContentLoaded', function() {
    initializeTransactions();
    setupTransactionsEventListeners();
});

function initializeTransactions() {
    renderTransactionList();
    updateCategoryFilter();
}

function setupTransactionsEventListeners() {
    // Transaction Form
    document.getElementById('transactionForm').addEventListener('submit', function(e) {
        e.preventDefault();
        addTransaction();
    });

    // Transaction Type Change
    document.getElementById('type').addEventListener('change', function() {
        updateCategoryOptions();
    });

    // Filters
    document.getElementById('filterType').addEventListener('change', renderTransactionList);
    document.getElementById('filterCategory').addEventListener('change', renderTransactionList);
    document.getElementById('filterMonth').addEventListener('change', renderTransactionList);
    document.getElementById('clearFilters').addEventListener('click', clearFilters);

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
        updateCategoryOptions();
        renderTransactionList();
    });
}

function updateCategoryOptions() {
    const type = document.getElementById('type').value;
    const categoryGroup = document.getElementById('categoryGroup');
    const sourceGroup = document.getElementById('sourceGroup');

    if (type === 'income') {
        sourceGroup.style.display = 'block';
        categoryGroup.innerHTML = `
            <label for="category" data-i18n="category">${getTranslation('category')}</label>
            <select id="category" required>
                <option value="" data-i18n="selectOption">${getTranslation('selectOption')}</option>
                <option value="salary">${getTranslation('salary')}</option>
                <option value="business">${getTranslation('business')}</option>
                <option value="investment">${getTranslation('investment')}</option>
                <option value="other">${getTranslation('other')}</option>
            </select>
        `;
    } else if (type === 'expense') {
        sourceGroup.style.display = 'none';
        categoryGroup.innerHTML = `
            <label for="category" data-i18n="category">${getTranslation('category')}</label>
            <select id="category" required>
                <option value="" data-i18n="selectOption">${getTranslation('selectOption')}</option>
                <option value="food">${getTranslation('food')}</option>
                <option value="transport">${getTranslation('transport')}</option>
                <option value="rent">${getTranslation('rent')}</option>
                <option value="utilities">${getTranslation('utilities')}</option>
                <option value="entertainment">${getTranslation('entertainment')}</option>
                <option value="healthcare">${getTranslation('healthcare')}</option>
                <option value="education">${getTranslation('education')}</option>
                <option value="other">${getTranslation('other')}</option>
            </select>
        `;
    } else if (type === 'saving') {
        sourceGroup.style.display = 'none';
        categoryGroup.innerHTML = `
            <label for="category" data-i18n="category">${getTranslation('category')}</label>
            <select id="category" required>
                <option value="" data-i18n="selectOption">${getTranslation('selectOption')}</option>
                <option value="emergency">${getTranslation('emergency')}</option>
                <option value="investment">${getTranslation('investment')}</option>
                <option value="vacation">${getTranslation('vacation')}</option>
                <option value="education">${getTranslation('education')}</option>
                <option value="other">${getTranslation('other')}</option>
            </select>
        `;
    } else {
        sourceGroup.style.display = 'none';
        categoryGroup.innerHTML = `
            <label for="category" data-i18n="category">${getTranslation('category')}</label>
            <select id="category">
                <option value="" data-i18n="selectOption">${getTranslation('selectOption')}</option>
            </select>
        `;
    }
    
    applyLanguage(window.appState.settings.language);
}

function addTransaction() {
    const type = document.getElementById('type').value;
    const amount = parseFloat(document.getElementById('amount').value);
    const category = document.getElementById('category').value;
    const source = document.getElementById('source').value;
    const date = document.getElementById('date').value;
    const description = document.getElementById('description').value;
    
    const transaction = {
        id: generateId(),
        type,
        amount,
        category,
        source: type === 'income' ? source : '',
        date,
        description,
        createdAt: new Date().toISOString()
    };
    
    window.appState.transactions.push(transaction);
    saveTransactions();
    renderTransactionList();
    updateCategoryFilter();
    
    // Reset form
    document.getElementById('transactionForm').reset();
    document.getElementById('sourceGroup').style.display = 'none';
    
    showNotification(
        window.appState.settings.language === 'bn' ? 
        'লেনদেন সফলভাবে যোগ করা হয়েছে!' : 
        'Transaction added successfully!', 
        'success'
    );
}

function renderTransactionList() {
    const filterType = document.getElementById('filterType').value;
    const filterCategory = document.getElementById('filterCategory').value;
    const filterMonth = document.getElementById('filterMonth').value;
    
    let filteredTransactions = [...window.appState.transactions];
    
    // Apply filters
    if (filterType !== 'all') {
        filteredTransactions = filteredTransactions.filter(t => t.type === filterType);
    }
    
    if (filterCategory !== 'all') {
        filteredTransactions = filteredTransactions.filter(t => t.category === filterCategory);
    }
    
    if (filterMonth) {
        filteredTransactions = filteredTransactions.filter(t => 
            t.date.startsWith(filterMonth)
        );
    }
    
    // Sort by date (newest first)
    filteredTransactions.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    const transactionList = document.getElementById('transactionList');
    
    if (filteredTransactions.length === 0) {
        transactionList.innerHTML = `<p>${window.appState.settings.language === 'bn' ? 
            'কোন লেনদেন পাওয়া যায়নি' : 'No transactions found'}</p>`;
        return;
    }
    
    transactionList.innerHTML = filteredTransactions.map(transaction => `
        <div class="transaction-item">
            <div class="transaction-info">
                <h4>${getCategoryLabel(transaction.category)}</h4>
                <p>${formatDate(transaction.date)} - ${transaction.description || ''}</p>
                ${transaction.source ? `<p>${getTranslation('source')}: ${transaction.source}</p>` : ''}
            </div>
            <div class="transaction-amount ${transaction.type}">
                ${transaction.type === 'income' ? '+' : '-'} ${formatCurrency(transaction.amount)}
            </div>
            <div class="transaction-actions">
                <button class="btn-danger" onclick="deleteTransaction('${transaction.id}')">${getTranslation('delete')}</button>
            </div>
        </div>
    `).join('');
}

function updateCategoryFilter() {
    const filterCategory = document.getElementById('filterCategory');
    const categories = [...new Set(window.appState.transactions.map(t => t.category))];
    
    filterCategory.innerHTML = `<option value="all">${getTranslation('allCategories')}</option>`;
    categories.forEach(category => {
        filterCategory.innerHTML += `<option value="${category}">${getCategoryLabel(category)}</option>`;
    });
}

function clearFilters() {
    document.getElementById('filterType').value = 'all';
    document.getElementById('filterCategory').value = 'all';
    document.getElementById('filterMonth').value = '';
    renderTransactionList();
}

function getCategoryLabel(category) {
    const labels = {
        // Income categories
        salary: window.appState.settings.language === 'bn' ? 'বেতন' : 'Salary',
        business: window.appState.settings.language === 'bn' ? 'ব্যবসা' : 'Business',
        investment: window.appState.settings.language === 'bn' ? 'বিনিয়োগ' : 'Investment',
        
        // Expense categories
        food: window.appState.settings.language === 'bn' ? 'খাবার' : 'Food',
        transport: window.appState.settings.language === 'bn' ? 'যাতায়াত' : 'Transport',
        rent: window.appState.settings.language === 'bn' ? 'বাড়ি ভাড়া' : 'Rent',
        utilities: window.appState.settings.language === 'bn' ? 'ইউটিলিটি বিল' : 'Utilities',
        entertainment: window.appState.settings.language === 'bn' ? 'বিনোদন' : 'Entertainment',
        healthcare: window.appState.settings.language === 'bn' ? 'স্বাস্থ্য সেবা' : 'Healthcare',
        education: window.appState.settings.language === 'bn' ? 'শিক্ষা' : 'Education',
        
        // Savings categories
        emergency: window.appState.settings.language === 'bn' ? 'জরুরী তহবিল' : 'Emergency Fund',
        vacation: window.appState.settings.language === 'bn' ? 'ছুটি' : 'Vacation',
        
        // Other
        other: window.appState.settings.language === 'bn' ? 'অন্যান্য' : 'Other'
    };
    
    return labels[category] || category;
}

// Global function for HTML onclick
window.deleteTransaction = function(id) {
    if (confirm(getTranslation('confirmDelete'))) {
        window.appState.transactions = window.appState.transactions.filter(t => t.id !== id);
        saveTransactions();
        renderTransactionList();
        updateCategoryFilter();
        
        showNotification(
            window.appState.settings.language === 'bn' ? 
            'লেনদেন সফলভাবে মুছে ফেলা হয়েছে!' : 
            'Transaction deleted successfully!', 
            'success'
        );
    }
};