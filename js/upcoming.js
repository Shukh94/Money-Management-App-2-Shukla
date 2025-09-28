// Upcoming Expenses Management
document.addEventListener('DOMContentLoaded', function() {
    initializeUpcoming();
    setupUpcomingEventListeners();
});

function initializeUpcoming() {
    renderUpcomingList();
    updateUpcomingSummary();
    populateMonthFilter();
}

function setupUpcomingEventListeners() {
    // Upcoming Expense Form
    document.getElementById('upcomingForm').addEventListener('submit', function(e) {
        e.preventDefault();
        addUpcomingExpense();
    });

    // Filters
    document.getElementById('filterUpcomingStatus').addEventListener('change', renderUpcomingList);
    document.getElementById('filterUpcomingMonth').addEventListener('change', renderUpcomingList);

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
        renderUpcomingList();
        updateUpcomingSummary();
    });
}

function addUpcomingExpense() {
    const title = document.getElementById('upcomingTitle').value;
    const amount = parseFloat(document.getElementById('upcomingAmount').value);
    const category = document.getElementById('upcomingCategory').value;
    const dueDate = document.getElementById('upcomingDueDate').value;
    const notes = document.getElementById('upcomingNotes').value;
    
    const expense = {
        id: generateId(),
        title,
        amount,
        category,
        dueDate,
        notes,
        paid: false,
        createdAt: new Date().toISOString()
    };
    
    window.appState.upcomingExpenses.push(expense);
    saveUpcomingExpenses();
    renderUpcomingList();
    updateUpcomingSummary();
    populateMonthFilter();
    
    // Reset form
    document.getElementById('upcomingForm').reset();
    
    showNotification(
        window.appState.settings.language === 'bn' ? 
        'আসন্ন খরচ সফলভাবে যোগ করা হয়েছে!' : 
        'Upcoming expense added successfully!', 
        'success'
    );
}

function renderUpcomingList() {
    const filterStatus = document.getElementById('filterUpcomingStatus').value;
    const filterMonth = document.getElementById('filterUpcomingMonth').value;
    
    let filteredExpenses = [...window.appState.upcomingExpenses];
    
    // Apply status filter
    if (filterStatus !== 'all') {
        filteredExpenses = filteredExpenses.filter(expense => 
            filterStatus === 'pending' ? !expense.paid : expense.paid
        );
    }
    
    // Apply month filter
    if (filterMonth !== 'all') {
        filteredExpenses = filteredExpenses.filter(expense => 
            expense.dueDate.startsWith(filterMonth)
        );
    }
    
    // Sort by due date (soonest first)
    filteredExpenses.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
    
    const upcomingList = document.getElementById('upcomingList');
    
    if (filteredExpenses.length === 0) {
        upcomingList.innerHTML = `<p>${window.appState.settings.language === 'bn' ? 
            'কোন আসন্ন খরচ পাওয়া যায়নি' : 'No upcoming expenses found'}</p>`;
        return;
    }
    
    upcomingList.innerHTML = filteredExpenses.map(expense => {
        const dueDate = new Date(expense.dueDate);
        const today = new Date();
        const diffTime = dueDate - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        let statusClass = '';
        if (expense.paid) {
            statusClass = 'paid';
        } else if (diffDays <= 3) {
            statusClass = 'due-soon';
        }
        
        let statusText = '';
        if (expense.paid) {
            statusText = getTranslation('paid');
        } else if (diffDays < 0) {
            statusText = `${Math.abs(diffDays)} ${window.appState.settings.language === 'bn' ? 'দিন অতীত' : 'days overdue'}`;
        } else {
            statusText = `${diffDays} ${window.appState.settings.language === 'bn' ? 'দিন বাকি' : 'days left'}`;
        }
        
        return `
            <div class="upcoming-item ${statusClass}">
                <div class="upcoming-info">
                    <h4>${expense.title}</h4>
                    <p>${getTranslation('amount')}: ${formatCurrency(expense.amount)}</p>
                    <p>${getTranslation('dueDate')}: ${formatDate(expense.dueDate)}</p>
                    <p>${getTranslation('status')}: ${statusText}</p>
                    ${expense.notes ? `<p>${getTranslation('notesOptional')}: ${expense.notes}</p>` : ''}
                    ${expense.fixedSourceId ? `<p class="fixed-source">${getTranslation('fromFixed')}</p>` : ''}
                </div>
                <div class="upcoming-actions">
                    ${!expense.paid ? `
                        <button onclick="markAsPaid('${expense.id}')">${getTranslation('markAsPaid')}</button>
                    ` : ''}
                    <button class="btn-danger" onclick="deleteUpcoming('${expense.id}')">${getTranslation('delete')}</button>
                </div>
            </div>
        `;
    }).join('');
}

function updateUpcomingSummary() {
    const totalUpcoming = window.appState.upcomingExpenses.reduce((sum, expense) => sum + expense.amount, 0);
    const pendingUpcoming = window.appState.upcomingExpenses
        .filter(expense => !expense.paid)
        .reduce((sum, expense) => sum + expense.amount, 0);
    const paidUpcoming = window.appState.upcomingExpenses
        .filter(expense => expense.paid)
        .reduce((sum, expense) => sum + expense.amount, 0);
    
    document.getElementById('totalUpcoming').textContent = formatCurrency(totalUpcoming);
    document.getElementById('pendingUpcoming').textContent = formatCurrency(pendingUpcoming);
    document.getElementById('paidUpcoming').textContent = formatCurrency(paidUpcoming);
}

function populateMonthFilter() {
    const monthFilter = document.getElementById('filterUpcomingMonth');
    const months = [...new Set(window.appState.upcomingExpenses.map(e => e.dueDate.substring(0, 7)))];
    
    monthFilter.innerHTML = '<option value="all">সব মাস</option>';
    months.sort().reverse().forEach(month => {
        const date = new Date(month + '-01');
        const monthName = window.appState.settings.language === 'bn' ? 
            getBanglaMonthName(date.getMonth()) : 
            date.toLocaleString('en', { month: 'long', year: 'numeric' });
        monthFilter.innerHTML += `<option value="${month}">${monthName}</option>`;
    });
}

function getBanglaMonthName(monthIndex) {
    const months = ['জানুয়ারী', 'ফেব্রুয়ারী', 'মার্চ', 'এপ্রিল', 'মে', 'জুন', 
                   'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'];
    return months[monthIndex];
}

// Global functions for HTML onclick
window.markAsPaid = function(id) {
    if (confirm(window.appState.settings.language === 'bn' ? 
        'আপনি কি এই খরচটি পরিশোধিত হিসেবে চিহ্নিত করতে চান?' : 
        'Are you sure you want to mark this expense as paid?')) {
        const expenseIndex = window.appState.upcomingExpenses.findIndex(e => e.id === id);
        if (expenseIndex !== -1) {
            window.appState.upcomingExpenses[expenseIndex].paid = true;
            saveUpcomingExpenses();
            renderUpcomingList();
            updateUpcomingSummary();
            
            showNotification(
                window.appState.settings.language === 'bn' ? 
                'খরচটি পরিশোধিত হিসেবে চিহ্নিত করা হয়েছে!' : 
                'Expense marked as paid!', 
                'success'
            );
        }
    }
};

window.deleteUpcoming = function(id) {
    if (confirm(getTranslation('confirmDelete'))) {
        window.appState.upcomingExpenses = window.appState.upcomingExpenses.filter(e => e.id !== id);
        saveUpcomingExpenses();
        renderUpcomingList();
        updateUpcomingSummary();
        populateMonthFilter();
        
        showNotification(
            window.appState.settings.language === 'bn' ? 
            'আসন্ন খরচ সফলভাবে মুছে ফেলা হয়েছে!' : 
            'Upcoming expense deleted successfully!', 
            'success'
        );
    }
};