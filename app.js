// App State
let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
let upcomingExpenses = JSON.parse(localStorage.getItem('upcomingExpenses')) || [];
let settings = JSON.parse(localStorage.getItem('settings')) || {
    currency: 'BDT',
    dateFormat: 'dd-mm-yyyy',
    darkMode: false
};

// DOM Elements
const pages = document.querySelectorAll('.page');
const navLinks = document.querySelectorAll('.nav-link');
const themeToggle = document.getElementById('themeToggle');

// Initialize App
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    updateDashboard();
    renderTransactionList();
    renderUpcomingList();
    updateReports();
    loadSettings();
    
    // Add event listeners
    setupEventListeners();
});

// Set up all event listeners
function setupEventListeners() {
    // Navigation
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const pageId = this.getAttribute('data-page');
            
            // Update active nav link
            navLinks.forEach(nav => nav.classList.remove('active'));
            this.classList.add('active');
            
            // Show selected page
            pages.forEach(page => page.classList.remove('active'));
            document.getElementById(pageId).classList.add('active');
            
            // Update reports when navigating to reports page
            if (pageId === 'reports') {
                updateReports();
            }
        });
    });

    // Theme Toggle
    themeToggle.addEventListener('click', function() {
        document.body.classList.toggle('dark-mode');
        const isDarkMode = document.body.classList.contains('dark-mode');
        themeToggle.textContent = isDarkMode ? '☀️' : '🌙';
        
        // Save theme preference
        settings.darkMode = isDarkMode;
        saveSettings();
    });

    // Transaction Form
    document.getElementById('transactionForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
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
        
        transactions.push(transaction);
        saveTransactions();
        updateDashboard();
        renderTransactionList();
        
        // Reset form
        this.reset();
        document.getElementById('sourceGroup').style.display = 'none';
        
        // Show success message
        showNotification('লেনদেন সফলভাবে যোগ করা হয়েছে!', 'success');
    });

    // Transaction Type Change
    document.getElementById('type').addEventListener('change', function() {
        const type = this.value;
        const sourceGroup = document.getElementById('sourceGroup');
        const categoryGroup = document.getElementById('categoryGroup');
        
        if (type === 'income') {
            sourceGroup.style.display = 'block';
            categoryGroup.innerHTML = `
                <label for="category">উৎসের ধরন</label>
                <select id="category" required>
                    <option value="salary">বেতন</option>
                    <option value="business">ব্যবসা</option>
                    <option value="investment">বিনিয়োগ</option>
                    <option value="other">অন্যান্য</option>
                </select>
            `;
        } else if (type === 'expense') {
            sourceGroup.style.display = 'none';
            categoryGroup.innerHTML = `
                <label for="category">ক্যাটাগরি</label>
                <select id="category" required>
                    <option value="food">খাবার</option>
                    <option value="transport">যাতায়াত</option>
                    <option value="rent">বাড়ি ভাড়া</option>
                    <option value="utilities">ইউটিলিটি বিল</option>
                    <option value="entertainment">বিনোদন</option>
                    <option value="healthcare">স্বাস্থ্য সেবা</option>
                    <option value="education">শিক্ষা</option>
                    <option value="other">অন্যান্য</option>
                </select>
            `;
        } else if (type === 'saving') {
            sourceGroup.style.display = 'none';
            categoryGroup.innerHTML = `
                <label for="category">সঞ্চয়ের উদ্দেশ্য</label>
                <select id="category" required>
                    <option value="emergency">জরুরী তহবিল</option>
                    <option value="investment">বিনিয়োগ</option>
                    <option value="vacation">ছুটি</option>
                    <option value="education">শিক্ষা</option>
                    <option value="other">অন্যান্য</option>
                </select>
            `;
        } else {
            sourceGroup.style.display = 'none';
            categoryGroup.innerHTML = `
                <label for="category">ক্যাটাগরি</label>
                <select id="category">
                    <option value="">নির্বাচন করুন</option>
                </select>
            `;
        }
    });

    // Upcoming Expense Form
    document.getElementById('upcomingForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
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
        
        upcomingExpenses.push(expense);
        saveUpcomingExpenses();
        renderUpcomingList();
        updateDashboard();
        
        // Reset form
        this.reset();
        
        // Show success message
        showNotification('আসন্ন খরচ সফলভাবে যোগ করা হয়েছে!', 'success');
    });

    // Filter Transactions
    document.getElementById('filterType').addEventListener('change', renderTransactionList);
    document.getElementById('filterCategory').addEventListener('change', renderTransactionList);
    document.getElementById('filterMonth').addEventListener('change', renderTransactionList);

    // Save Settings
    document.getElementById('saveSettings').addEventListener('click', function() {
        settings.currency = document.getElementById('currency').value;
        settings.dateFormat = document.getElementById('dateFormat').value;
        settings.darkMode = document.getElementById('darkMode').checked;
        
        saveSettings();
        showNotification('সেটিংস সংরক্ষণ করা হয়েছে!', 'success');
    });

    // Export Data
    document.getElementById('exportData').addEventListener('click', function() {
        const data = {
            transactions,
            upcomingExpenses,
            settings,
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
        
        showNotification('ডেটা সফলভাবে এক্সপোর্ট করা হয়েছে!', 'success');
    });

    // Import Data
    document.getElementById('importData').addEventListener('click', function() {
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
                    
                    if (confirm('আপনি কি নিশ্চিত যে আপনি ডেটা ইম্পোর্ট করতে চান? বর্তমান ডেটা ওভাররাইট হয়ে যাবে।')) {
                        if (data.transactions) transactions = data.transactions;
                        if (data.upcomingExpenses) upcomingExpenses = data.upcomingExpenses;
                        if (data.settings) settings = data.settings;
                        
                        saveTransactions();
                        saveUpcomingExpenses();
                        saveSettings();
                        
                        initializeApp();
                        updateDashboard();
                        renderTransactionList();
                        renderUpcomingList();
                        loadSettings();
                        
                        showNotification('ডেটা সফলভাবে ইম্পোর্ট করা হয়েছে!', 'success');
                    }
                } catch (error) {
                    showNotification('ডেটা ইম্পোর্ট করতে সমস্যা হয়েছে। ফাইল ফরম্যাট সঠিক কিনা তা পরীক্ষা করুন।', 'error');
                }
            };
            
            reader.readAsText(file);
        });
        
        input.click();
    });

    // Clear Data
    document.getElementById('clearData').addEventListener('click', function() {
        if (confirm('আপনি কি নিশ্চিত যে আপনি সমস্ত ডেটা মুছতে চান? এই কাজটি পূর্বাবস্থায় ফেরানো যাবে না।')) {
            transactions = [];
            upcomingExpenses = [];
            
            saveTransactions();
            saveUpcomingExpenses();
            
            updateDashboard();
            renderTransactionList();
            renderUpcomingList();
            
            showNotification('সমস্ত ডেটা মুছে ফেলা হয়েছে!', 'success');
        }
    });

    // Export PDF
    document.getElementById('exportPDF').addEventListener('click', function() {
        showNotification('PDF এক্সপোর্ট ফিচারটি শীঘ্রই আসছে!', 'info');
    });

    // Export CSV
    document.getElementById('exportCSV').addEventListener('click', function() {
        showNotification('CSV এক্সপোর্ট ফিচারটি শীঘ্রই আসছে!', 'info');
    });
}

// Initialize App
function initializeApp() {
    // Set current date as default in forms
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('date').value = today;
    document.getElementById('upcomingDueDate').value = today;
    document.getElementById('filterMonth').value = today.substring(0, 7);
    
    // Initialize category filter options
    updateCategoryFilter();
}

// Update Dashboard
function updateDashboard() {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    
    // Filter transactions for current month
    const monthlyTransactions = transactions.filter(t => {
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
    
    // Update upcoming reminders
    updateUpcomingReminders();
    
    // Update recent transactions
    updateRecentTransactions();
}

// Render Transaction List
function renderTransactionList() {
    const filterType = document.getElementById('filterType').value;
    const filterCategory = document.getElementById('filterCategory').value;
    const filterMonth = document.getElementById('filterMonth').value;
    
    let filteredTransactions = [...transactions];
    
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
        transactionList.innerHTML = '<p>কোন লেনদেন পাওয়া যায়নি</p>';
        return;
    }
    
    transactionList.innerHTML = filteredTransactions.map(transaction => `
        <div class="transaction-item">
            <div class="transaction-info">
                <h4>${getCategoryLabel(transaction.category)}</h4>
                <p>${formatDate(transaction.date)} - ${transaction.description || ''}</p>
                ${transaction.source ? `<p>উৎস: ${transaction.source}</p>` : ''}
            </div>
            <div class="transaction-amount ${transaction.type}">
                ${transaction.type === 'income' ? '+' : '-'} ${formatCurrency(transaction.amount)}
            </div>
            <div class="transaction-actions">
                <button class="btn-danger" onclick="deleteTransaction('${transaction.id}')">মুছুন</button>
            </div>
        </div>
    `).join('');
}

// Render Upcoming Expenses List
function renderUpcomingList() {
    const upcomingList = document.getElementById('upcomingList');
    
    if (upcomingExpenses.length === 0) {
        upcomingList.innerHTML = '<p>কোন আসন্ন খরচ পাওয়া যায়নি</p>';
        return;
    }
    
    // Sort by due date (soonest first)
    const sortedExpenses = [...upcomingExpenses].sort((a, b) => 
        new Date(a.dueDate) - new Date(b.dueDate)
    );
    
    upcomingList.innerHTML = sortedExpenses.map(expense => {
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
        
        return `
            <div class="upcoming-item ${statusClass}">
                <div class="upcoming-info">
                    <h4>${expense.title}</h4>
                    <p>পরিমাণ: ${formatCurrency(expense.amount)}</p>
                    <p>নির্ধারিত তারিখ: ${formatDate(expense.dueDate)}</p>
                    <p>অবস্থা: ${expense.paid ? 'পরিশোধিত' : (diffDays < 0 ? `${Math.abs(diffDays)} দিন অতীত` : `${diffDays} দিন বাকি`)}</p>
                    ${expense.notes ? `<p>মন্তব্য: ${expense.notes}</p>` : ''}
                </div>
                <div class="upcoming-actions">
                    ${!expense.paid ? `
                        <button onclick="markAsPaid('${expense.id}')">পরিশোধিত</button>
                    ` : ''}
                    <button class="btn-danger" onclick="deleteUpcoming('${expense.id}')">মুছুন</button>
                </div>
            </div>
        `;
    }).join('');
}

// Update Reports
function updateReports() {
    updateMonthlyChart();
    updateCategoryChart();
}

// Update Monthly Chart
function updateMonthlyChart() {
    const ctx = document.getElementById('monthlyChart').getContext('2d');
    
    // Get current year and month
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    
    // Prepare data for each month
    const months = ['জানু', 'ফেব্রু', 'মার্চ', 'এপ্রিল', 'মে', 'জুন', 
                   'জুলাই', 'আগস্ট', 'সেপ্ট', 'অক্টো', 'নভে', 'ডিসে'];
    
    const incomeData = new Array(12).fill(0);
    const expenseData = new Array(12).fill(0);
    
    transactions.forEach(transaction => {
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
    
    // Destroy existing chart if it exists
    if (window.monthlyChartInstance) {
        window.monthlyChartInstance.destroy();
    }
    
    // Create new chart
    window.monthlyChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: months,
            datasets: [
                {
                    label: 'আয়',
                    data: incomeData,
                    backgroundColor: '#2ecc71'
                },
                {
                    label: 'খরচ',
                    data: expenseData,
                    backgroundColor: '#e74c3c'
                }
            ]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: `${currentYear} সালের মাসিক আয় ও খরচ`
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

// Update Category Chart
function updateCategoryChart() {
    const ctx = document.getElementById('categoryChart').getContext('2d');
    
    // Get current year and month
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();
    
    // Filter expenses for current month
    const monthlyExpenses = transactions.filter(t => {
        const date = new Date(t.date);
        return t.type === 'expense' && 
               date.getFullYear() === currentYear && 
               date.getMonth() === currentMonth;
    });
    
    // Group by category
    const categoryTotals = {};
    monthlyExpenses.forEach(expense => {
        if (!categoryTotals[expense.category]) {
            categoryTotals[expense.category] = 0;
        }
        categoryTotals[expense.category] += expense.amount;
    });
    
    // Prepare data for chart
    const categories = Object.keys(categoryTotals);
    const amounts = Object.values(categoryTotals);
    const backgroundColors = categories.map((_, i) => 
        `hsl(${i * 360 / categories.length}, 70%, 60%)`
    );
    
    // Destroy existing chart if it exists
    if (window.categoryChartInstance) {
        window.categoryChartInstance.destroy();
    }
    
    // Create new chart
    window.categoryChartInstance = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: categories.map(getCategoryLabel),
            datasets: [{
                data: amounts,
                backgroundColor: backgroundColors
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: `${months[currentMonth]} মাসের খরচের বিভাজন`
                },
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}

// Update Upcoming Reminders
function updateUpcomingReminders() {
    const remindersContainer = document.getElementById('upcomingReminders');
    const today = new Date();
    
    // Filter upcoming expenses (not paid and due within next 7 days)
    const upcoming = upcomingExpenses.filter(expense => {
        if (expense.paid) return false;
        
        const dueDate = new Date(expense.dueDate);
        const diffTime = dueDate - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        return diffDays <= 7;
    });
    
    if (upcoming.length === 0) {
        remindersContainer.innerHTML = '<p>কোন আসন্ন খরচের রিমাইন্ডার নেই</p>';
        return;
    }
    
    // Sort by due date (soonest first)
    upcoming.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
    
    remindersContainer.innerHTML = upcoming.map(expense => {
        const dueDate = new Date(expense.dueDate);
        const diffTime = dueDate - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        let urgency = '';
        if (diffDays < 0) {
            urgency = 'অতীত হয়েছে';
        } else if (diffDays === 0) {
            urgency = 'আজ';
        } else if (diffDays === 1) {
            urgency = 'আগামীকাল';
        } else {
            urgency = `${diffDays} দিন বাকি`;
        }
        
        return `
            <div class="upcoming-item ${diffDays <= 3 ? 'due-soon' : ''}">
                <div class="upcoming-info">
                    <h4>${expense.title}</h4>
                    <p>পরিমাণ: ${formatCurrency(expense.amount)}</p>
                    <p>নির্ধারিত তারিখ: ${formatDate(expense.dueDate)} (${urgency})</p>
                </div>
            </div>
        `;
    }).join('');
}

// Update Recent Transactions
function updateRecentTransactions() {
    const recentContainer = document.getElementById('recentTransactions');
    
    // Get last 5 transactions
    const recent = [...transactions]
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 5);
    
    if (recent.length === 0) {
        recentContainer.innerHTML = '<p>কোন সাম্প্রতিক লেনদেন নেই</p>';
        return;
    }
    
    recentContainer.innerHTML = recent.map(transaction => `
        <div class="transaction-item">
            <div class="transaction-info">
                <h4>${getCategoryLabel(transaction.category)}</h4>
                <p>${formatDate(transaction.date)}</p>
            </div>
            <div class="transaction-amount ${transaction.type}">
                ${transaction.type === 'income' ? '+' : '-'} ${formatCurrency(transaction.amount)}
            </div>
        </div>
    `).join('');
}

// Update Category Filter Options
function updateCategoryFilter() {
    const filterCategory = document.getElementById('filterCategory');
    const categories = [...new Set(transactions.map(t => t.category))];
    
    // Keep the "all" option and add current categories
    filterCategory.innerHTML = '<option value="all">সব ক্যাটাগরি</option>';
    categories.forEach(category => {
        filterCategory.innerHTML += `<option value="${category}">${getCategoryLabel(category)}</option>`;
    });
}

// Load Settings
function loadSettings() {
    document.getElementById('currency').value = settings.currency;
    document.getElementById('dateFormat').value = settings.dateFormat;
    document.getElementById('darkMode').checked = settings.darkMode;
    
    // Apply dark mode if enabled
    if (settings.darkMode) {
        document.body.classList.add('dark-mode');
        themeToggle.textContent = '☀️';
    }
}

// Save Transactions to LocalStorage
function saveTransactions() {
    localStorage.setItem('transactions', JSON.stringify(transactions));
    updateCategoryFilter();
}

// Save Upcoming Expenses to LocalStorage
function saveUpcomingExpenses() {
    localStorage.setItem('upcomingExpenses', JSON.stringify(upcomingExpenses));
}

// Save Settings to LocalStorage
function saveSettings() {
    localStorage.setItem('settings', JSON.stringify(settings));
}

// Delete Transaction - FIXED FUNCTION
function deleteTransaction(id) {
    if (confirm('আপনি কি এই লেনদেনটি মুছতে নিশ্চিত?')) {
        transactions = transactions.filter(t => t.id !== id);
        saveTransactions();
        updateDashboard();
        renderTransactionList();
        showNotification('লেনদেন সফলভাবে মুছে ফেলা হয়েছে!', 'success');
    }
}

// Delete Upcoming Expense - FIXED FUNCTION
function deleteUpcoming(id) {
    if (confirm('আপনি কি এই আসন্ন খরচটি মুছতে নিশ্চিত?')) {
        upcomingExpenses = upcomingExpenses.filter(e => e.id !== id);
        saveUpcomingExpenses();
        renderUpcomingList();
        updateDashboard();
        showNotification('আসন্ন খরচ সফলভাবে মুছে ফেলা হয়েছে!', 'success');
    }
}

// Mark Upcoming Expense as Paid
function markAsPaid(id) {
    if (confirm('আপনি কি এই খরচটি পরিশোধিত হিসেবে চিহ্নিত করতে চান?')) {
        const expenseIndex = upcomingExpenses.findIndex(e => e.id === id);
        if (expenseIndex !== -1) {
            upcomingExpenses[expenseIndex].paid = true;
            saveUpcomingExpenses();
            renderUpcomingList();
            updateDashboard();
            showNotification('খরচটি পরিশোধিত হিসেবে চিহ্নিত করা হয়েছে!', 'success');
        }
    }
}

// Show Notification
function showNotification(message, type = 'info') {
    // Remove existing notification if any
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Add styles
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
    `;
    
    // Set background color based on type
    if (type === 'success') {
        notification.style.backgroundColor = '#2ecc71';
    } else if (type === 'error') {
        notification.style.backgroundColor = '#e74c3c';
    } else {
        notification.style.backgroundColor = '#3498db';
    }
    
    // Add to page
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Add CSS for notification animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);

// Utility Functions
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

function formatCurrency(amount) {
    const formatter = new Intl.NumberFormat('bn-BD', {
        style: 'currency',
        currency: settings.currency,
        minimumFractionDigits: 2
    });
    
    return formatter.format(amount);
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    
    if (settings.dateFormat === 'dd-mm-yyyy') {
        return `${day}-${month}-${year}`;
    } else if (settings.dateFormat === 'mm-dd-yyyy') {
        return `${month}-${day}-${year}`;
    } else {
        return `${year}-${month}-${day}`;
    }
}

function getCategoryLabel(category) {
    const labels = {
        // Income categories
        salary: 'বেতন',
        business: 'ব্যবসা',
        investment: 'বিনিয়োগ',
        
        // Expense categories
        food: 'খাবার',
        transport: 'যাতায়াত',
        rent: 'বাড়ি ভাড়া',
        utilities: 'ইউটিলিটি বিল',
        entertainment: 'বিনোদন',
        healthcare: 'স্বাস্থ্য সেবা',
        education: 'শিক্ষা',
        
        // Savings categories
        emergency: 'জরুরী তহবিল',
        vacation: 'ছুটি',
        
        // Upcoming expense categories
        loan: 'লোন',
        insurance: 'বীমা',
        
        // Other
        other: 'অন্যান্য'
    };
    
    return labels[category] || category;
}

// Months names in Bengali
const months = ['জানুয়ারী', 'ফেব্রুয়ারী', 'মার্চ', 'এপ্রিল', 'মে', 'জুন', 
               'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'];