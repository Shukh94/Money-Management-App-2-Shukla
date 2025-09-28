// Fixed Expenses Management
document.addEventListener('DOMContentLoaded', function() {
    initializeFixedExpenses();
    setupFixedExpensesEventListeners();
});

function initializeFixedExpenses() {
    renderFixedExpenseList();
    updateFixedExpensesSummary();
    
    // Set default start date to current month's first day
    const currentDate = new Date();
    const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    document.getElementById('fixedStartDate').value = firstDay.toISOString().split('T')[0];
}

function setupFixedExpensesEventListeners() {
    // Fixed Expense Form
    document.getElementById('fixedExpenseForm').addEventListener('submit', function(e) {
        e.preventDefault();
        addFixedExpense();
    });

    // Filter
    document.getElementById('filterFixedStatus').addEventListener('change', renderFixedExpenseList);

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
        renderFixedExpenseList();
        updateFixedExpensesSummary();
    });
}

function addFixedExpense() {
    const title = document.getElementById('fixedTitle').value;
    const amount = parseFloat(document.getElementById('fixedAmount').value);
    const category = document.getElementById('fixedCategory').value;
    const dueDay = parseInt(document.getElementById('fixedDueDay').value);
    const startDate = document.getElementById('fixedStartDate').value;
    const endDate = document.getElementById('fixedEndDate').value;
    const notes = document.getElementById('fixedNotes').value;
    const active = document.getElementById('fixedActive').checked;

    const fixedExpense = {
        id: generateId(),
        title,
        amount,
        category,
        dueDay,
        startDate,
        endDate,
        notes,
        active,
        createdAt: new Date().toISOString()
    };

    window.appState.fixedExpenses.push(fixedExpense);
    saveFixedExpenses();
    renderFixedExpenseList();
    updateFixedExpensesSummary();

    // Reset form
    document.getElementById('fixedExpenseForm').reset();
    
    // Set default start date
    const currentDate = new Date();
    const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    document.getElementById('fixedStartDate').value = firstDay.toISOString().split('T')[0];

    showNotification(
        window.appState.settings.language === 'bn' ? 
        'ফিক্সড খরচ সফলভাবে যোগ করা হয়েছে!' : 
        'Fixed expense added successfully!', 
        'success'
    );
}

function renderFixedExpenseList() {
    const filterStatus = document.getElementById('filterFixedStatus').value;
    let filteredExpenses = [...window.appState.fixedExpenses];

    // Apply filter
    if (filterStatus !== 'all') {
        filteredExpenses = filteredExpenses.filter(expense => 
            filterStatus === 'active' ? expense.active : !expense.active
        );
    }

    // Sort by active status and title
    filteredExpenses.sort((a, b) => {
        if (a.active !== b.active) return b.active ? 1 : -1;
        return a.title.localeCompare(b.title);
    });

    const fixedList = document.getElementById('fixedExpenseList');

    if (filteredExpenses.length === 0) {
        fixedList.innerHTML = `<p>${window.appState.settings.language === 'bn' ? 
            'কোন ফিক্সড খরচ পাওয়া যায়নি' : 'No fixed expenses found'}</p>`;
        return;
    }

    fixedList.innerHTML = filteredExpenses.map(expense => {
        const isActive = expense.active;
        const currentDate = new Date();
        const dueDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), expense.dueDay);
        
        return `
            <div class="fixed-expense-item ${isActive ? 'active' : 'inactive'}">
                <div class="fixed-expense-info">
                    <h4>${expense.title} <span class="status-badge ${isActive ? 'active' : 'inactive'}">
                        ${isActive ? getTranslation('active') : getTranslation('inactive')}
                    </span></h4>
                    <p>${getTranslation('amount')}: ${formatCurrency(expense.amount)}</p>
                    <p>${getTranslation('dueDay')}: ${expense.dueDay}</p>
                    <p>${getTranslation('startDate')}: ${formatDate(expense.startDate)}</p>
                    ${expense.endDate ? `<p>${getTranslation('endDate')}: ${formatDate(expense.endDate)}</p>` : ''}
                    ${expense.notes ? `<p>${getTranslation('notesOptional')}: ${expense.notes}</p>` : ''}
                    <p class="next-due">${getTranslation('nextDue')}: ${formatDate(dueDate.toISOString().split('T')[0])}</p>
                </div>
                <div class="fixed-expense-actions">
                    <button onclick="toggleFixedExpenseActive('${expense.id}')" class="${isActive ? 'btn-warning' : 'btn-success'}">
                        ${getTranslation('toggleActive')}
                    </button>
                    <button onclick="generateUpcomingFromFixed('${expense.id}')" class="btn-info" ${!isActive ? 'disabled' : ''}>
                        ${getTranslation('generateThisMonth')}
                    </button>
                    <button onclick="deleteFixedExpense('${expense.id}')" class="btn-danger">
                        ${getTranslation('delete')}
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

function updateFixedExpensesSummary() {
    const totalFixed = window.appState.fixedExpenses.reduce((sum, expense) => sum + expense.amount, 0);
    const activeFixed = window.appState.fixedExpenses
        .filter(expense => expense.active)
        .reduce((sum, expense) => sum + expense.amount, 0);
    const inactiveFixed = window.appState.fixedExpenses
        .filter(expense => !expense.active)
        .reduce((sum, expense) => sum + expense.amount, 0);

    document.getElementById('totalFixed').textContent = formatCurrency(totalFixed);
    document.getElementById('activeFixed').textContent = formatCurrency(activeFixed);
    document.getElementById('inactiveFixed').textContent = formatCurrency(inactiveFixed);
}

// Global functions for HTML onclick
window.toggleFixedExpenseActive = function(id) {
    const expense = window.appState.fixedExpenses.find(e => e.id === id);
    if (expense) {
        expense.active = !expense.active;
        saveFixedExpenses();
        renderFixedExpenseList();
        updateFixedExpensesSummary();
        
        showNotification(
            window.appState.settings.language === 'bn' ? 
            `খরচ ${expense.active ? 'একটিভ' : 'নিষ্ক্রিয়'} করা হয়েছে!` : 
            `Expense ${expense.active ? 'activated' : 'deactivated'}!`, 
            'success'
        );
    }
};

window.generateUpcomingFromFixed = function(id) {
    const fixedExpense = window.appState.fixedExpenses.find(e => e.id === id);
    if (!fixedExpense || !fixedExpense.active) return;

    const currentDate = new Date();
    const dueDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), fixedExpense.dueDay);
    
    // Check if already exists for this month
    const existing = window.appState.upcomingExpenses.find(expense => 
        expense.fixedSourceId === id && 
        new Date(expense.dueDate).getMonth() === currentDate.getMonth() &&
        new Date(expense.dueDate).getFullYear() === currentDate.getFullYear()
    );

    if (existing) {
        showNotification(
            window.appState.settings.language === 'bn' ? 
            'এই মাসের জন্য ইতিমধ্যেই তৈরি করা হয়েছে!' : 
            'Already generated for this month!', 
            'info'
        );
        return;
    }

    const upcomingExpense = {
        id: generateId(),
        title: fixedExpense.title,
        amount: fixedExpense.amount,
        category: fixedExpense.category,
        dueDate: dueDate.toISOString().split('T')[0],
        notes: `${fixedExpense.notes || ''} [ফিক্সড খরচ]`.trim(),
        paid: false,
        fixedSourceId: id,
        createdAt: new Date().toISOString()
    };

    window.appState.upcomingExpenses.push(upcomingExpense);
    saveUpcomingExpenses();
    
    showNotification(
        window.appState.settings.language === 'bn' ? 
        'আসন্ন খরচ হিসেবে যোগ করা হয়েছে!' : 
        'Added to upcoming expenses!', 
        'success'
    );
};

window.deleteFixedExpense = function(id) {
    if (confirm(getTranslation('confirmDelete'))) {
        window.appState.fixedExpenses = window.appState.fixedExpenses.filter(e => e.id !== id);
        saveFixedExpenses();
        renderFixedExpenseList();
        updateFixedExpensesSummary();
        
        showNotification(
            window.appState.settings.language === 'bn' ? 
            'ফিক্সড খরচ মুছে ফেলা হয়েছে!' : 
            'Fixed expense deleted!', 
            'success'
        );
    }
};