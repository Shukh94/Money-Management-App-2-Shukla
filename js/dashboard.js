// Dashboard Management
document.addEventListener('DOMContentLoaded', function() {
    initializeDashboard();
    setupDashboardEventListeners();
});

function initializeDashboard() {
    updateDashboard();
    updateUpcomingReminders();
    updateRecentTransactions();
    updateFixedExpensesSummary();
    updateFinancialHealth();
    updateMonthlyComparison();
}

function setupDashboardEventListeners() {
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
        updateDashboard();
        updateUpcomingReminders();
        updateRecentTransactions();
        updateFixedExpensesSummary();
    });

    // Quick Action Buttons
    document.querySelectorAll('.quick-action-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const action = this.getAttribute('data-action');
            handleQuickAction(action);
        });
    });
}

function updateDashboard() {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    
    // Filter transactions for current month
    const monthlyTransactions = window.appState.transactions.filter(t => {
        const transactionDate = new Date(t.date);
        return transactionDate.getMonth() === currentMonth && 
               transactionDate.getFullYear() === currentYear;
    });
    
    // Calculate totals
    const totalIncome = monthlyTransactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);
        
    const totalExpense = monthlyTransactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);
        
    const totalSavings = monthlyTransactions
        .filter(t => t.type === 'saving')
        .reduce((sum, t) => sum + t.amount, 0);
        
    const currentBalance = totalIncome - totalExpense;
    
    // Update dashboard elements
    document.getElementById('totalIncome').textContent = formatCurrency(totalIncome);
    document.getElementById('totalExpense').textContent = formatCurrency(totalExpense);
    document.getElementById('currentBalance').textContent = formatCurrency(currentBalance);
    document.getElementById('totalSavings').textContent = formatCurrency(totalSavings);
    
    // Update charts if they exist
    updateDashboardCharts();
}

function updateUpcomingReminders() {
    const remindersContainer = document.getElementById('upcomingReminders');
    const today = new Date();
    
    // Filter upcoming expenses (not paid and due within next 7 days)
    const upcoming = window.appState.upcomingExpenses.filter(expense => {
        if (expense.paid) return false;
        
        const dueDate = new Date(expense.dueDate);
        const diffTime = dueDate - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        return diffDays <= 7;
    });
    
    if (upcoming.length === 0) {
        remindersContainer.innerHTML = `
            <div class="empty-state">
                <p>${window.appState.settings.language === 'bn' ? 
                    'কোন আসন্ন খরচের রিমাইন্ডার নেই' : 
                    'No upcoming expense reminders'}</p>
            </div>
        `;
        return;
    }
    
    // Sort by due date (soonest first)
    upcoming.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
    
    remindersContainer.innerHTML = upcoming.map(expense => {
        const dueDate = new Date(expense.dueDate);
        const diffTime = dueDate - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        let urgency = '';
        let urgencyClass = '';
        if (diffDays < 0) {
            urgency = window.appState.settings.language === 'bn' ? 'অতীত হয়েছে' : 'Overdue';
            urgencyClass = 'due-soon';
        } else if (diffDays === 0) {
            urgency = window.appState.settings.language === 'bn' ? 'আজ' : 'Today';
            urgencyClass = 'due-soon';
        } else if (diffDays === 1) {
            urgency = window.appState.settings.language === 'bn' ? 'আগামীকাল' : 'Tomorrow';
            urgencyClass = 'due-soon';
        } else if (diffDays <= 3) {
            urgency = `${diffDays} ${window.appState.settings.language === 'bn' ? 'দিন বাকি' : 'days left'}`;
            urgencyClass = 'due-soon';
        } else {
            urgency = `${diffDays} ${window.appState.settings.language === 'bn' ? 'দিন বাকি' : 'days left'}`;
        }
        
        return `
            <div class="upcoming-item ${urgencyClass}">
                <div class="upcoming-info">
                    <h4>${expense.title}</h4>
                    <p>${getTranslation('amount')}: ${formatCurrency(expense.amount)}</p>
                    <p>${getTranslation('dueDate')}: ${formatDate(expense.dueDate)}</p>
                    <p class="urgency">${urgency}</p>
                </div>
                <div class="upcoming-actions">
                    <button onclick="markUpcomingAsPaid('${expense.id}')" class="btn-success">
                        ${getTranslation('markAsPaid')}
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

function updateRecentTransactions() {
    const recentContainer = document.getElementById('recentTransactions');
    
    // Get last 5 transactions
    const recent = [...window.appState.transactions]
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 5);
    
    if (recent.length === 0) {
        recentContainer.innerHTML = `
            <div class="empty-state">
                <p>${window.appState.settings.language === 'bn' ? 
                    'কোন সাম্প্রতিক লেনদেন নেই' : 
                    'No recent transactions'}</p>
            </div>
        `;
        return;
    }
    
    recentContainer.innerHTML = recent.map(transaction => {
        const amountClass = transaction.type === 'income' ? 'positive' : 'negative';
        const amountSign = transaction.type === 'income' ? '+' : '-';
        
        return `
            <div class="activity-item">
                <div class="activity-icon ${transaction.type}">
                    ${transaction.type === 'income' ? '💰' : transaction.type === 'expense' ? '💸' : '🏦'}
                </div>
                <div class="activity-content">
                    <div class="activity-title">${getCategoryLabel(transaction.category)}</div>
                    <div class="activity-description">${transaction.description || ''}</div>
                    <div class="activity-date">${formatDate(transaction.date)}</div>
                </div>
                <div class="activity-amount ${amountClass}">
                    ${amountSign}${formatCurrency(transaction.amount)}
                </div>
            </div>
        `;
    }).join('');
}

function updateFixedExpensesSummary() {
    const summaryContainer = document.getElementById('fixedExpensesSummary');
    
    // Get active fixed expenses
    const activeFixed = window.appState.fixedExpenses.filter(expense => expense.active);
    
    if (activeFixed.length === 0) {
        summaryContainer.innerHTML = `
            <div class="empty-state">
                <p>${window.appState.settings.language === 'bn' ? 
                    'কোন ফিক্সড খরচ সেটআপ করা নেই' : 
                    'No fixed expenses setup'}</p>
            </div>
        `;
        return;
    }
    
    const totalMonthly = activeFixed.reduce((sum, expense) => sum + expense.amount, 0);
    
    summaryContainer.innerHTML = `
        <div class="financial-health">
            <div class="health-label">${getTranslation('monthlyFixedExpenses')}</div>
            <div class="health-meter">
                <div class="health-progress" style="width: ${Math.min((totalMonthly / 50000) * 100, 100)}%"></div>
            </div>
            <div class="health-amount">${formatCurrency(totalMonthly)}</div>
        </div>
        
        <div class="budget-progress">
            ${activeFixed.map(expense => `
                <div class="budget-item">
                    <div class="budget-header">
                        <span class="budget-name">${expense.title}</span>
                        <span class="budget-amount">${formatCurrency(expense.amount)}</span>
                    </div>
                    <div class="budget-bar">
                        <div class="budget-progress-bar" style="width: 100%"></div>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

function updateFinancialHealth() {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    
    // Calculate monthly totals
    const monthlyTransactions = window.appState.transactions.filter(t => {
        const transactionDate = new Date(t.date);
        return transactionDate.getMonth() === currentMonth && 
               transactionDate.getFullYear() === currentYear;
    });
    
    const totalIncome = monthlyTransactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);
        
    const totalExpense = monthlyTransactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);
    
    // Calculate financial health score (0-100)
    let healthScore = 0;
    if (totalIncome > 0) {
        const expenseRatio = totalExpense / totalIncome;
        if (expenseRatio <= 0.5) {
            healthScore = 100; // Excellent
        } else if (expenseRatio <= 0.7) {
            healthScore = 75; // Good
        } else if (expenseRatio <= 0.9) {
            healthScore = 50; // Fair
        } else {
            healthScore = 25; // Poor
        }
    }
    
    // Update health indicator if element exists
    const healthElement = document.getElementById('financialHealth');
    if (healthElement) {
        let healthStatus = '';
        let healthClass = '';
        
        if (healthScore >= 80) {
            healthStatus = window.appState.settings.language === 'bn' ? 'চমৎকার' : 'Excellent';
            healthClass = 'excellent';
        } else if (healthScore >= 60) {
            healthStatus = window.appState.settings.language === 'bn' ? 'ভাল' : 'Good';
            healthClass = 'good';
        } else if (healthScore >= 40) {
            healthStatus = window.appState.settings.language === 'bn' ? 'মধ্যম' : 'Fair';
            healthClass = 'fair';
        } else {
            healthStatus = window.appState.settings.language === 'bn' ? 'খারাপ' : 'Poor';
            healthClass = 'poor';
        }
        
        healthElement.innerHTML = `
            <div class="financial-health">
                <div class="health-label">${healthStatus}</div>
                <div class="health-meter">
                    <div class="health-progress ${healthClass}" style="width: ${healthScore}%"></div>
                </div>
                <div class="health-score">${healthScore}%</div>
            </div>
        `;
    }
}

function updateMonthlyComparison() {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    
    // Current month data
    const currentMonthTransactions = window.appState.transactions.filter(t => {
        const transactionDate = new Date(t.date);
        return transactionDate.getMonth() === currentMonth && 
               transactionDate.getFullYear() === currentYear;
    });
    
    const currentIncome = currentMonthTransactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);
        
    const currentExpense = currentMonthTransactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);
    
    // Previous month data
    const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const prevYear = currentMonth === 0 ? currentYear - 1 : currentYear;
    
    const prevMonthTransactions = window.appState.transactions.filter(t => {
        const transactionDate = new Date(t.date);
        return transactionDate.getMonth() === prevMonth && 
               transactionDate.getFullYear() === prevYear;
    });
    
    const prevIncome = prevMonthTransactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);
        
    const prevExpense = prevMonthTransactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);
    
    // Calculate changes
    const incomeChange = prevIncome > 0 ? ((currentIncome - prevIncome) / prevIncome) * 100 : 0;
    const expenseChange = prevExpense > 0 ? ((currentExpense - prevExpense) / prevExpense) * 100 : 0;
    
    // Update comparison if element exists
    const comparisonElement = document.getElementById('monthlyComparison');
    if (comparisonElement) {
        comparisonElement.innerHTML = `
            <div class="comparison-card">
                <div class="comparison-item current">
                    <div class="comparison-label">${getTranslation('currentMonth')}</div>
                    <div class="comparison-value">${formatCurrency(currentIncome - currentExpense)}</div>
                    <div class="comparison-change ${incomeChange >= 0 ? 'positive' : 'negative'}">
                        ${incomeChange >= 0 ? '↑' : '↓'} ${Math.abs(incomeChange).toFixed(1)}%
                    </div>
                </div>
                <div class="comparison-item previous">
                    <div class="comparison-label">${getTranslation('previousMonth')}</div>
                    <div class="comparison-value">${formatCurrency(prevIncome - prevExpense)}</div>
                    <div class="comparison-change">${getTranslation('baseline')}</div>
                </div>
            </div>
        `;
    }
}

function updateDashboardCharts() {
    // Check if Chart.js is available and chart container exists
    if (typeof Chart === 'undefined' || !document.getElementById('dashboardChart')) {
        return;
    }
    
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    
    // Prepare data for monthly chart
    const months = window.appState.settings.language === 'bn' ? 
        ['জানু', 'ফেব্রু', 'মার্চ', 'এপ্রিল', 'মে', 'জুন', 
         'জুলাই', 'আগস্ট', 'সেপ্ট', 'অক্টো', 'নভে', 'ডিসে'] :
        ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
         'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    const incomeData = new Array(12).fill(0);
    const expenseData = new Array(12).fill(0);
    
    window.appState.transactions.forEach(transaction => {
        const date = new Date(transaction.date);
        if (date.getFullYear() === currentYear) {
            const month = date.getMonth();
            if (transaction.type === 'income') {
                incomeData[month] += transaction.amount;
            } else if (transaction.type === 'expense') {
                expenseData[month] += transaction.amount;
            }
        }
    });
    
    const ctx = document.getElementById('dashboardChart').getContext('2d');
    
    // Destroy existing chart if it exists
    if (window.dashboardChartInstance) {
        window.dashboardChartInstance.destroy();
    }
    
    // Create new chart
    window.dashboardChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: months.slice(0, currentDate.getMonth() + 1),
            datasets: [
                {
                    label: getTranslation('income'),
                    data: incomeData.slice(0, currentDate.getMonth() + 1),
                    backgroundColor: '#2ecc71',
                    borderRadius: 4
                },
                {
                    label: getTranslation('expense'),
                    data: expenseData.slice(0, currentDate.getMonth() + 1),
                    backgroundColor: '#e74c3c',
                    borderRadius: 4
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: `${currentYear} ${getTranslation('monthlySummary')}`,
                    font: {
                        size: 14
                    }
                },
                legend: {
                    position: 'bottom'
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return formatCurrency(value);
                        }
                    }
                }
            }
        }
    });
}

function handleQuickAction(action) {
    switch (action) {
        case 'add-income':
            window.location.href = 'transactions.html';
            break;
        case 'add-expense':
            window.location.href = 'transactions.html';
            break;
        case 'view-reports':
            window.location.href = 'reports.html';
            break;
        case 'manage-upcoming':
            window.location.href = 'upcoming.html';
            break;
        default:
            console.log('Unknown action:', action);
    }
}

// Global function for marking upcoming as paid
window.markUpcomingAsPaid = function(id) {
    if (confirm(window.appState.settings.language === 'bn' ? 
        'আপনি কি এই খরচটি পরিশোধিত হিসেবে চিহ্নিত করতে চান?' : 
        'Are you sure you want to mark this expense as paid?')) {
        const expenseIndex = window.appState.upcomingExpenses.findIndex(e => e.id === id);
        if (expenseIndex !== -1) {
            window.appState.upcomingExpenses[expenseIndex].paid = true;
            saveUpcomingExpenses();
            updateUpcomingReminders();
            
            showNotification(
                window.appState.settings.language === 'bn' ? 
                'খরচটি পরিশোধিত হিসেবে চিহ্নিত করা হয়েছে!' : 
                'Expense marked as paid!', 
                'success'
            );
        }
    }
};

// Utility function to get category label
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

// Auto-refresh dashboard every 30 seconds
setInterval(() => {
    if (document.getElementById('dashboard')?.classList.contains('active')) {
        updateDashboard();
        updateUpcomingReminders();
    }
}, 30000);