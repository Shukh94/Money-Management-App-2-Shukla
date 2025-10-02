// Reports Management - WITH EXPORT FUNCTIONALITY
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
    const generateBtn = document.getElementById('generateReport');
    if (generateBtn) {
        generateBtn.addEventListener('click', generateReport);
    }

    const reportYear = document.getElementById('reportYear');
    if (reportYear) {
        reportYear.addEventListener('change', generateReport);
    }

    const reportType = document.getElementById('reportType');
    if (reportType) {
        reportType.addEventListener('change', generateReport);
    }

    // Export Buttons
    const exportPDF = document.getElementById('exportPDF');
    if (exportPDF) {
        exportPDF.addEventListener('click', exportPDFReport);
    }

    const exportCSV = document.getElementById('exportCSV');
    if (exportCSV) {
        exportCSV.addEventListener('click', exportCSVReport);
    }
}

function populateYearFilter() {
    const yearSelect = document.getElementById('reportYear');
    if (!yearSelect) return;

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

// REAL EXPORT FUNCTIONALITY
function exportPDFReport() {
    try {
        const reportType = document.getElementById('reportType').value;
        const year = parseInt(document.getElementById('reportYear').value);
        
        // Create a simple PDF content
        let reportContent = `
            Personal Money Manager - Financial Report
            Generated on: ${new Date().toLocaleDateString()}
            Report Type: ${reportType}
            Year: ${year}
            
            SUMMARY:
        `;

        if (reportType === 'monthly') {
            const monthlyData = getMonthlyReportData(year);
            reportContent += '\nMonthly Income & Expense Report:\n';
            monthlyData.forEach((month, index) => {
                reportContent += `Month ${index + 1}: Income: ${formatCurrency(month.income)}, Expense: ${formatCurrency(month.expense)}\n`;
            });
        } else if (reportType === 'yearly') {
            const yearlyData = getYearlyReportData();
            reportContent += '\nYearly Comparison Report:\n';
            yearlyData.forEach(yearData => {
                reportContent += `Year ${yearData.year}: Income: ${formatCurrency(yearData.income)}, Expense: ${formatCurrency(yearData.expense)}\n`;
            });
        }

        // Create and download text file as simple PDF alternative
        const blob = new Blob([reportContent], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `financial_report_${reportType}_${year}_${Date.now()}.txt`;
        link.click();
        URL.revokeObjectURL(url);

        showNotification(
            window.appState.settings.language === 'bn' ? 
            'রিপোর্ট সফলভাবে ডাউনলোড করা হয়েছে!' : 
            'Report downloaded successfully!', 
            'success'
        );
        
    } catch (error) {
        console.error('PDF Export Error:', error);
        showNotification(
            window.appState.settings.language === 'bn' ? 
            'রিপোর্ট ডাউনলোড করতে সমস্যা হয়েছে' : 
            'Error downloading report', 
            'error'
        );
    }
}

function exportCSVReport() {
    try {
        const reportType = document.getElementById('reportType').value;
        const year = parseInt(document.getElementById('reportYear').value);
        
        let csvContent = '';
        let filename = '';

        if (reportType === 'monthly') {
            const monthlyData = getMonthlyReportData(year);
            csvContent = 'Month,Income,Expense,Balance\n';
            monthlyData.forEach((month, index) => {
                const balance = month.income - month.expense;
                csvContent += `Month ${index + 1},${month.income},${month.expense},${balance}\n`;
            });
            filename = `monthly_report_${year}.csv`;
            
        } else if (reportType === 'yearly') {
            const yearlyData = getYearlyReportData();
            csvContent = 'Year,Income,Expense,Balance\n';
            yearlyData.forEach(yearData => {
                const balance = yearData.income - yearData.expense;
                csvContent += `${yearData.year},${yearData.income},${yearData.expense},${balance}\n`;
            });
            filename = `yearly_report.csv`;
            
        } else if (reportType === 'category') {
            const categoryData = getCategoryReportData(year);
            csvContent = 'Category,Amount,Percentage\n';
            const total = categoryData.reduce((sum, item) => sum + item.amount, 0);
            categoryData.forEach(item => {
                const percentage = ((item.amount / total) * 100).toFixed(2);
                csvContent += `${item.category},${item.amount},${percentage}%\n`;
            });
            filename = `category_report_${year}.csv`;
        }

        // Create and download CSV file
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        link.click();
        URL.revokeObjectURL(url);

        showNotification(
            window.appState.settings.language === 'bn' ? 
            'CSV রিপোর্ট সফলভাবে ডাউনলোড করা হয়েছে!' : 
            'CSV report downloaded successfully!', 
            'success'
        );
        
    } catch (error) {
        console.error('CSV Export Error:', error);
        showNotification(
            window.appState.settings.language === 'bn' ? 
            'CSV রিপোর্ট ডাউনলোড করতে সমস্যা হয়েছে' : 
            'Error downloading CSV report', 
            'error'
        );
    }
}

// Helper functions for export data
function getMonthlyReportData(year) {
    const monthsData = [];
    
    for (let month = 0; month < 12; month++) {
        const monthlyTransactions = window.appState.transactions.filter(t => {
            const date = new Date(t.date);
            return date.getFullYear() === year && date.getMonth() === month;
        });
        
        const income = monthlyTransactions
            .filter(t => t.type === 'income')
            .reduce((sum, t) => sum + t.amount, 0);
            
        const expense = monthlyTransactions
            .filter(t => t.type === 'expense')
            .reduce((sum, t) => sum + t.amount, 0);
            
        monthsData.push({ income, expense });
    }
    
    return monthsData;
}

function getYearlyReportData() {
    const years = [...new Set(window.appState.transactions.map(t => 
        new Date(t.date).getFullYear()
    ))].sort();
    
    return years.map(year => {
        const yearlyTransactions = window.appState.transactions.filter(t => 
            new Date(t.date).getFullYear() === year
        );
        
        const income = yearlyTransactions
            .filter(t => t.type === 'income')
            .reduce((sum, t) => sum + t.amount, 0);
            
        const expense = yearlyTransactions
            .filter(t => t.type === 'expense')
            .reduce((sum, t) => sum + t.amount, 0);
            
        return { year, income, expense };
    });
}

function getCategoryReportData(year) {
    const currentMonth = new Date().getMonth();
    const monthlyExpenses = window.appState.transactions.filter(t => {
        const date = new Date(t.date);
        return t.type === 'expense' && 
               date.getFullYear() === year && 
               date.getMonth() === currentMonth;
    });
    
    const categoryTotals = {};
    monthlyExpenses.forEach(expense => {
        if (!categoryTotals[expense.category]) {
            categoryTotals[expense.category] = 0;
        }
        categoryTotals[expense.category] += expense.amount;
    });
    
    return Object.keys(categoryTotals).map(category => ({
        category: getCategoryLabel(category),
        amount: categoryTotals[category]
    }));
}

// Translation helper
function getTranslation(key) {
    const translations = {
        'bn': {
            'monthlySummary': 'মাসিক সারাংশ',
            'yearlySummary': 'বাৎসরিক সারাংশ',
            'monthlyIncomeExpense': 'মাসিক আয় ও ব্যয়',
            'yearlyIncomeExpense': 'বাৎসরিক আয় ও ব্যয়',
            'expenseBreakdown': 'খরচের বিভাজন',
            'monthlyExpenses': 'মাসিক খরচ',
            'monthlyExpenseTrend': 'মাসিক খরচের প্রবণতা',
            'expenseByCategory': 'ক্যাটাগরি অনুযায়ী খরচ',
            'income': 'আয়',
            'expense': 'খরচ'
        },
        'en': {
            'monthlySummary': 'Monthly Summary',
            'yearlySummary': 'Yearly Summary',
            'monthlyIncomeExpense': 'Monthly Income & Expense',
            'yearlyIncomeExpense': 'Yearly Income & Expense',
            'expenseBreakdown': 'Expense Breakdown',
            'monthlyExpenses': 'Monthly Expenses',
            'monthlyExpenseTrend': 'Monthly Expense Trend',
            'expenseByCategory': 'Expense by Category',
            'income': 'Income',
            'expense': 'Expense'
        }
    };
    
    return translations[window.appState.settings.language]?.[key] || key;
}