// Reports Management
document.addEventListener('DOMContentLoaded', function() {
    initializeReports();
    setupReportsEventListeners();
});

function initializeReports() {
    populateYearFilter();
    generateReport();
}

function setupReportsEventListeners() {
    // Report Generation
    document.getElementById('generateReport').addEventListener('click', generateReport);
    document.getElementById('reportYear').addEventListener('change', generateReport);
    document.getElementById('reportType').addEventListener('change', generateReport);

    // Export Buttons
    document.getElementById('exportPDF').addEventListener('click', exportPDF);
    document.getElementById('exportCSV').addEventListener('click', exportCSV);

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
        populateYearFilter();
        generateReport();
    });
}

function populateYearFilter() {
    const yearSelect = document.getElementById('reportYear');
    const years = [...new Set(window.appState.transactions.map(t => 
        new Date(t.date).getFullYear()
    ))];
    
    // Add current year if not present
    const currentYear = new Date().getFullYear();
    if (!years.includes(currentYear)) {
        years.push(currentYear);
    }
    
    years.sort((a, b) => b - a);
    
    yearSelect.innerHTML = '';
    years.forEach(year => {
        yearSelect.innerHTML += `<option value="${year}">${year}</option>`;
    });
    
    // Set to current year by default
    yearSelect.value = currentYear;
}

function generateReport() {
    const reportType = document.getElementById('reportType').value;
    const year = parseInt(document.getElementById('reportYear').value);
    
    if (reportType === 'monthly') {
        generateMonthlyReport(year);
    } else if (reportType === 'yearly') {
        generateYearlyReport();
    } else if (reportType === 'category') {
        generateCategoryReport(year);
    }
}

function generateMonthlyReport(year) {
    const months = window.appState.settings.language === 'bn' ? 
        ['জানু', 'ফেব্রু', 'মার্চ', 'এপ্রিল', 'মে', 'জুন', 
         'জুলাই', 'আগস্ট', 'সেপ্ট', 'অক্টো', 'নভে', 'ডিসে'] :
        ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
         'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    const incomeData = new Array(12).fill(0);
    const expenseData = new Array(12).fill(0);
    
    window.appState.transactions.forEach(transaction => {
        const date = new Date(transaction.date);
        if (date.getFullYear() === year) {
            const month = date.getMonth();
            if (transaction.type === 'income') {
                incomeData[month] += transaction.amount;
            } else if (transaction.type === 'expense') {
                expenseData[month] += transaction.amount;
            }
        }
    });
    
    // Update report title
    document.getElementById('reportTitle').textContent = 
        `${year} ${getTranslation('monthlySummary')}`;
    
    // Show/hide category report card
    document.getElementById('categoryReportCard').style.display = 'none';
    
    // Destroy existing chart if it exists
    if (window.mainChartInstance) {
        window.mainChartInstance.destroy();
    }
    
    // Create new chart
    const ctx = document.getElementById('mainChart').getContext('2d');
    window.mainChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: months,
            datasets: [
                {
                    label: getTranslation('income'),
                    data: incomeData,
                    backgroundColor: '#2ecc71'
                },
                {
                    label: getTranslation('expense'),
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
                    text: `${year} ${getTranslation('monthlyIncomeExpense')}`
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

function generateYearlyReport() {
    const years = [...new Set(window.appState.transactions.map(t => 
        new Date(t.date).getFullYear()
    ))].sort();
    
    const incomeData = [];
    const expenseData = [];
    
    years.forEach(year => {
        const yearlyTransactions = window.appState.transactions.filter(t => 
            new Date(t.date).getFullYear() === year
        );
        
        const income = yearlyTransactions
            .filter(t => t.type === 'income')
            .reduce((sum, t) => sum + t.amount, 0);
            
        const expense = yearlyTransactions
            .filter(t => t.type === 'expense')
            .reduce((sum, t) => sum + t.amount, 0);
            
        incomeData.push(income);
        expenseData.push(expense);
    });
    
    // Update report title
    document.getElementById('reportTitle').textContent = getTranslation('yearlySummary');
    
    // Show/hide category report card
    document.getElementById('categoryReportCard').style.display = 'none';
    
    // Destroy existing chart if it exists
    if (window.mainChartInstance) {
        window.mainChartInstance.destroy();
    }
    
    // Create new chart
    const ctx = document.getElementById('mainChart').getContext('2d');
    window.mainChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: years,
            datasets: [
                {
                    label: getTranslation('income'),
                    data: incomeData,
                    backgroundColor: '#2ecc71'
                },
                {
                    label: getTranslation('expense'),
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
                    text: getTranslation('yearlyIncomeExpense')
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

function generateCategoryReport(year) {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    
    // Filter expenses for selected year and current month
    const monthlyExpenses = window.appState.transactions.filter(t => {
        const date = new Date(t.date);
        return t.type === 'expense' && 
               date.getFullYear() === year && 
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
    
    // Update report title
    document.getElementById('reportTitle').textContent = 
        `${getBanglaMonthName(currentMonth)} ${year} ${getTranslation('expenseBreakdown')}`;
    
    // Show category report card
    document.getElementById('categoryReportCard').style.display = 'block';
    
    // Destroy existing charts if they exist
    if (window.mainChartInstance) {
        window.mainChartInstance.destroy();
    }
    if (window.categoryChartInstance) {
        window.categoryChartInstance.destroy();
    }
    
    // Create main chart (monthly comparison)
    const monthlyData = getMonthlyExpenseData(year);
    const ctx1 = document.getElementById('mainChart').getContext('2d');
    window.mainChartInstance = new Chart(ctx1, {
        type: 'bar',
        data: {
            labels: window.appState.settings.language === 'bn' ? 
                ['জানু', 'ফেব্রু', 'মার্চ', 'এপ্রিল', 'মে', 'জুন', 
                 'জুলাই', 'আগস্ট', 'সেপ্ট', 'অক্টো', 'নভে', 'ডিসে'] :
                ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            datasets: [{
                label: getTranslation('monthlyExpenses'),
                data: monthlyData,
                backgroundColor: '#3498db'
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: `${year} ${getTranslation('monthlyExpenseTrend')}`
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
    
    // Create category chart
    const ctx2 = document.getElementById('categoryChart').getContext('2d');
    window.categoryChartInstance = new Chart(ctx2, {
        type: 'pie',
        data: {
            labels: categories.map(cat => getCategoryLabel(cat)),
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
                    text: getTranslation('expenseByCategory')
                },
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}

function getMonthlyExpenseData(year) {
    const monthlyData = new Array(12).fill(0);
    
    window.appState.transactions.forEach(transaction => {
        const date = new Date(transaction.date);
        if (date.getFullYear() === year && transaction.type === 'expense') {
            const month = date.getMonth();
            monthlyData[month] += transaction.amount;
        }
    });
    
    return monthlyData;
}

function getBanglaMonthName(monthIndex) {
    const months = ['জানুয়ারী', 'ফেব্রুয়ারী', 'মার্চ', 'এপ্রিল', 'মে', 'জুন', 
                   'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'];
    return months[monthIndex];
}

function getCategoryLabel(category) {
    const labels = {
        food: window.appState.settings.language === 'bn' ? 'খাবার' : 'Food',
        transport: window.appState.settings.language === 'bn' ? 'যাতায়াত' : 'Transport',
        rent: window.appState.settings.language === 'bn' ? 'বাড়ি ভাড়া' : 'Rent',
        utilities: window.appState.settings.language === 'bn' ? 'ইউটিলিটি বিল' : 'Utilities',
        entertainment: window.appState.settings.language === 'bn' ? 'বিনোদন' : 'Entertainment',
        healthcare: window.appState.settings.language === 'bn' ? 'স্বাস্থ্য সেবা' : 'Healthcare',
        education: window.appState.settings.language === 'bn' ? 'শিক্ষা' : 'Education',
        other: window.appState.settings.language === 'bn' ? 'অন্যান্য' : 'Other'
    };
    
    return labels[category] || category;
}

function exportPDF() {
    showNotification(
        window.appState.settings.language === 'bn' ? 
        'PDF এক্সপোর্ট ফিচারটি শীঘ্রই আসছে!' : 
        'PDF export feature coming soon!', 
        'info'
    );
}

function exportCSV() {
    showNotification(
        window.appState.settings.language === 'bn' ? 
        'CSV এক্সপোর্ট ফিচারটি শীঘ্রই আসছে!' : 
        'CSV export feature coming soon!', 
        'info'
    );
}