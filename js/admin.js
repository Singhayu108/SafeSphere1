/**
 * SafeSphere - Admin Dashboard
 * Handles admin authentication, dashboard display, and analytics
 */

class AdminDashboard {
    constructor() {
        this.adminCredentials = {
            username: 'admin',
            password: 'admin123'
        };
        
        this.charts = {};
        this.initDashboard();
    }

    initDashboard() {
        // Check if already logged in
        if (this.isLoggedIn()) {
            this.showDashboard();
        } else {
            this.showLogin();
        }

        this.attachEventListeners();
    }

    attachEventListeners() {
        // Login form
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        }

        // Logout button
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => this.handleLogout());
        }

        // Navigation items
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const section = item.dataset.section;
                this.showSection(section);
                
                // Update active state
                document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));
                item.classList.add('active');
            });
        });

        // View all links
        document.querySelectorAll('.view-all').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const section = link.dataset.section;
                this.showSection(section);
                
                // Update nav active state
                document.querySelectorAll('.nav-item').forEach(nav => {
                    nav.classList.remove('active');
                    if (nav.dataset.section === section) {
                        nav.classList.add('active');
                    }
                });
            });
        });

        // Refresh scans button
        const refreshScans = document.getElementById('refreshScans');
        if (refreshScans) {
            refreshScans.addEventListener('click', () => this.loadScansTable());
        }

        // Clear data buttons
        const clearAllData = document.getElementById('clearAllData');
        if (clearAllData) {
            clearAllData.addEventListener('click', () => this.handleClearData());
        }

        const clearDataBtn = document.getElementById('clearDataBtn');
        if (clearDataBtn) {
            clearDataBtn.addEventListener('click', () => this.handleClearData());
        }

        // Export data button
        const activityChartPeriod = document.getElementById('activityChartPeriod');
        if (activityChartPeriod) {
            activityChartPeriod.addEventListener('change', () => this.loadActivityChart());
        }

        const chartPeriod = document.getElementById('chartPeriod');
        if (chartPeriod) {
            chartPeriod.addEventListener('change', () => this.loadRiskDistributionChart());
        }
    }

    getScansByPeriod(period) {
        const scans = this.getData().scans;
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

        if (period === 'today') {
            return scans.filter(scan => {
                const scanDate = new Date(scan.timestamp);
                return scanDate >= today;
            });
        } else if (period === '7d') {
            const sevenDaysAgo = new Date(today);
            sevenDaysAgo.setDate(today.getDate() - 7);
            return scans.filter(scan => {
                const scanDate = new Date(scan.timestamp);
                return scanDate >= sevenDaysAgo;
            });
        } else {
            return scans;
        }
    }
    handleLogin(e) {
        e.preventDefault();
        
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const loginError = document.getElementById('loginError');

        if (username === this.adminCredentials.username && 
            password === this.adminCredentials.password) {
            // Login successful
            sessionStorage.setItem('safesphere_admin_logged_in', 'true');
            sessionStorage.setItem('safesphere_admin_username', username);
            this.showDashboard();
        } else {
            // Login failed
            loginError.style.display = 'flex';
            setTimeout(() => {
                loginError.style.display = 'none';
            }, 3000);
        }
    }

    handleLogout() {
        sessionStorage.removeItem('safesphere_admin_logged_in');
        sessionStorage.removeItem('safesphere_admin_username');
        window.location.href = 'admin.html';
    }

    isLoggedIn() {
        return sessionStorage.getItem('safesphere_admin_logged_in') === 'true';
    }

    showLogin() {
        document.getElementById('loginScreen').style.display = 'flex';
        document.getElementById('adminDashboard').style.display = 'none';
    }

    showDashboard() {
        document.getElementById('loginScreen').style.display = 'none';
        document.getElementById('adminDashboard').style.display = 'flex';
        
        // Set admin username
        const username = sessionStorage.getItem('safesphere_admin_username') || 'Admin';
        const adminUsernameEl = document.getElementById('adminUsername');
        if (adminUsernameEl) {
            adminUsernameEl.textContent = username;
        }
        
        // Load dashboard data
        this.loadDashboardData();
    }

    showSection(sectionName) {
        // Hide all sections
        document.querySelectorAll('.content-section').forEach(section => {
            section.classList.remove('active');
        });

        // Show selected section
        const section = document.getElementById(`${sectionName}Section`);
        if (section) {
            section.classList.add('active');
        }

        // Update page title
        const titles = {
            'overview': 'Dashboard Overview',
            'scans': 'Recent Scans',
            'analytics': 'Detailed Analytics',
            'settings': 'Settings'
        };
        const pageTitle = document.getElementById('pageTitle');
        if (pageTitle) {
            pageTitle.textContent = titles[sectionName] || 'Dashboard';
        }

        // Load section-specific data
        if (sectionName === 'scans') {
            this.loadScansTable();
        } else if (sectionName === 'analytics') {
            this.loadAnalytics();
        }
    }

    loadDashboardData() {
        const data = this.getData();
        const stats = data.stats;

        // Update stat cards
        this.updateStatCard('dashTotalScans', stats.totalScans);
        this.updateStatCard('dashSuspiciousCases', stats.suspiciousCases);
        this.updateStatCard('dashSafeScans', stats.safeScans);
        
        // Calculate detection rate
        const detectionRate = stats.totalScans > 0 
            ? Math.round((stats.suspiciousCases / stats.totalScans) * 100) 
            : 0;
        this.updateStatCard('dashDetectionRate', detectionRate + '%');

        // Load charts
        this.loadRiskDistributionChart();
        this.loadActivityChart();
        
        // Load recent activity
        this.loadRecentActivity();
    }

    updateStatCard(elementId, value) {
        const element = document.getElementById(elementId);
        if (element) {
            // Animate counter
            const current = parseInt(element.textContent) || 0;
            const target = typeof value === 'string' ? parseInt(value) : value;
            
            if (typeof target === 'number' && !isNaN(target)) {
                this.animateValue(element, current, target, 1000);
            } else {
                element.textContent = value;
            }
        }
    }

    animateValue(element, start, end, duration) {
        const range = end - start;
        const increment = range / (duration / 16);
        let current = start;

        const timer = setInterval(() => {
            current += increment;
            if ((increment > 0 && current >= end) || (increment < 0 && current <= end)) {
                current = end;
                clearInterval(timer);
            }
            
            const displayValue = Math.round(current);
            if (element.id.includes('Rate')) {
                element.textContent = displayValue + '%';
            } else {
                element.textContent = displayValue.toLocaleString();
            }
        }, 16);
    }

    loadRiskDistributionChart() {
        const period = document.getElementById('chartPeriod').value;
        const scans = this.getScansByPeriod(period);

        // Count risk levels
        const riskCounts = {
            safe: 0,
            low: 0,
            medium: 0,
            high: 0
        };

        scans.forEach(scan => {
            riskCounts[scan.riskLevel]++;
        });

        const ctx = document.getElementById('riskDistributionChart');
        if (!ctx) return;

        // Destroy existing chart if it exists
        if (this.charts.riskDistribution) {
            this.charts.riskDistribution.destroy();
        }

        this.charts.riskDistribution = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Safe', 'Low Risk', 'Medium Risk', 'High Risk'],
                datasets: [{
                    data: [riskCounts.safe, riskCounts.low, riskCounts.medium, riskCounts.high],
                    backgroundColor: ['#10b981', '#3b82f6', '#f59e0b', '#ef4444'],
                    borderWidth: 2,
                    borderColor: '#ffffff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            padding: 15,
                            font: { size: 12 }
                        }
                    }
                }
            }
        });
    }

    loadActivityChart() {
        const period = document.getElementById('activityChartPeriod').value;
        const scans = this.getScansByPeriod(period).slice(0, 20).reverse(); // Last 20 scans of the period

        const labels = scans.map((scan, index) => `Scan ${index + 1}`);
        const scores = scans.map(scan => scan.riskScore);

        const ctx = document.getElementById('activityChart');
        if (!ctx) return;

        // Destroy existing chart if it exists
        if (this.charts.activity) {
            this.charts.activity.destroy();
        }

        this.charts.activity = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Risk Score',
                    data: scores,
                    borderColor: '#2563eb',
                    backgroundColor: 'rgba(37, 99, 235, 0.1)',
                    tension: 0.4,
                    fill: true,
                    pointRadius: 4,
                    pointHoverRadius: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100,
                        ticks: {
                            callback: (value) => value + '%'
                        }
                    }
                }
            }
        });
    }

    loadRecentActivity() {
        const data = this.getData();
        const recentScans = data.scans.slice(0, 5);
        const activityList = document.getElementById('recentActivityList');
        
        if (!activityList) return;

        if (recentScans.length === 0) {
            activityList.innerHTML = '<p style="text-align: center; color: var(--gray-500); padding: var(--spacing-lg);">No activity yet</p>';
            return;
        }

        activityList.innerHTML = recentScans.map(scan => {
            const timeAgo = this.getTimeAgo(scan.timestamp);
            const iconClass = scan.riskLevel === 'high' || scan.riskLevel === 'medium' ? 'suspicious' : 'safe';
            
            return `
                <div class="activity-item">
                    <div class="activity-icon ${iconClass}">
                        <i class="fas fa-search"></i>
                    </div>
                    <div class="activity-details">
                        <div class="activity-content">${scan.contentPreview}</div>
                        <div class="activity-time">${timeAgo}</div>
                    </div>
                    <span class="activity-badge ${scan.riskLevel}">${scan.riskLevel}</span>
                </div>
            `;
        }).join('');
    }

    loadScansTable() {
        const data = this.getData();
        const scans = data.scans;
        const tbody = document.getElementById('scansTableBody');
        const noScansMessage = document.getElementById('noScansMessage');
        
        if (!tbody) return;

        if (scans.length === 0) {
            tbody.innerHTML = '';
            if (noScansMessage) noScansMessage.style.display = 'block';
            return;
        }

        if (noScansMessage) noScansMessage.style.display = 'none';

        tbody.innerHTML = scans.map(scan => {
            const timestamp = new Date(scan.timestamp).toLocaleString();
            const flagBadges = scan.flags.map(flag => 
                `<span class="flag-badge">${flag.replace(/_/g, ' ')}</span>`
            ).join('');

            return `
                <tr>
                    <td>${timestamp}</td>
                    <td><div class="content-preview">${scan.contentPreview}</div></td>
                    <td><span class="activity-badge ${scan.riskLevel}">${scan.riskLevel}</span></td>
                    <td><strong>${scan.riskScore}</strong>/100</td>
                    <td>${flagBadges || '<span style="color: var(--gray-500);">None</span>'}</td>
                    <td><button class="btn-view" onclick="alert('Detailed view feature coming soon!')">View</button></td>
                </tr>
            `;
        }).join('');
    }

    loadAnalytics() {
        const data = this.getData();
        const scans = data.scans;

        // Load keyword analysis
        this.loadTopKeywords(scans);
        
        // Load score distribution
        this.loadScoreDistribution(scans);
        
        // Load scam type analysis
        this.loadScamTypes(scans);
    }

    loadTopKeywords(scans) {
        const keywordCounts = {};
        
        scans.forEach(scan => {
            scan.flags.forEach(flag => {
                keywordCounts[flag] = (keywordCounts[flag] || 0) + 1;
            });
        });

        const sortedKeywords = Object.entries(keywordCounts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 10);

        const keywordsList = document.getElementById('topKeywordsList');
        if (!keywordsList) return;

        if (sortedKeywords.length === 0) {
            keywordsList.innerHTML = '<p style="color: var(--gray-500);">No data available</p>';
            return;
        }

        keywordsList.innerHTML = sortedKeywords.map(([keyword, count]) => `
            <div class="keyword-item">
                <span class="keyword-name">${keyword.replace(/_/g, ' ')}</span>
                <span class="keyword-count">${count}</span>
            </div>
        `).join('');
    }

    loadScoreDistribution(scans) {
        // Group scores into ranges
        const ranges = {
            '0-20': 0,
            '21-40': 0,
            '41-60': 0,
            '61-80': 0,
            '81-100': 0
        };

        scans.forEach(scan => {
            const score = scan.riskScore;
            if (score <= 20) ranges['0-20']++;
            else if (score <= 40) ranges['21-40']++;
            else if (score <= 60) ranges['41-60']++;
            else if (score <= 80) ranges['61-80']++;
            else ranges['81-100']++;
        });

        const ctx = document.getElementById('scoreDistributionChart');
        if (!ctx) return;

        // Destroy existing chart if it exists
        if (this.charts.scoreDistribution) {
            this.charts.scoreDistribution.destroy();
        }

        this.charts.scoreDistribution = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: Object.keys(ranges),
                datasets: [{
                    label: 'Number of Scans',
                    data: Object.values(ranges),
                    backgroundColor: ['#10b981', '#3b82f6', '#f59e0b', '#f59e0b', '#ef4444'],
                    borderRadius: 5
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            stepSize: 1
                        }
                    }
                }
            }
        });
    }

    loadScamTypes(scans) {
        const types = {
            'Phishing': 0,
            'Financial Scam': 0,
            'Identity Theft': 0,
            'Urgency Tactics': 0,
            'Other': 0
        };

        scans.forEach(scan => {
            if (scan.flags.includes('suspicious_urls')) types['Phishing']++;
            if (scan.flags.includes('financial')) types['Financial Scam']++;
            if (scan.flags.includes('personal_info_request') || scan.flags.includes('authentication')) {
                types['Identity Theft']++;
            }
            if (scan.flags.includes('urgency')) types['Urgency Tactics']++;
            if (scan.flags.length > 0 && !scan.flags.some(f => 
                ['suspicious_urls', 'financial', 'personal_info_request', 'authentication', 'urgency'].includes(f)
            )) {
                types['Other']++;
            }
        });

        const scamTypesList = document.getElementById('scamTypesList');
        if (!scamTypesList) return;

        scamTypesList.innerHTML = Object.entries(types).map(([type, count]) => `
            <div class="scam-type-item">
                <div class="scam-type-count">${count}</div>
                <div class="scam-type-label">${type}</div>
            </div>
        `).join('');
    }

    handleClearData() {
        if (confirm('Are you sure you want to clear all scan data? This action cannot be undone.')) {
            storage.clearAllData();
            alert('All data has been cleared successfully.');
            
            // Reload dashboard
            this.loadDashboardData();
            this.loadScansTable();
        }
    }

    handleExportData() {
        const data = this.getData();
        const dataStr = JSON.stringify(data, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `safesphere-data-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        
        alert('Data exported successfully!');
    }

    getData() {
        return storage.getData();
    }

    getTimeAgo(timestamp) {
        const now = new Date();
        const time = new Date(timestamp);
        const diffMs = now - time;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
        if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
        if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
        return time.toLocaleDateString();
    }
}

// Initialize admin dashboard when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const adminDashboard = new AdminDashboard();
    console.log('Admin dashboard initialized');
});
