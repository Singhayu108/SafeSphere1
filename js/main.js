/**
 * SafeSphere - Main Application Logic
 * Handles UI interactions, data storage, and analytics
 */

// Storage Manager
class StorageManager {
    constructor() {
        this.storageKey = 'safesphere_data';
        this.initStorage();
    }

    initStorage() {
        if (!localStorage.getItem(this.storageKey)) {
            const initialData = {
                scans: [],
                stats: {
                    totalScans: 0,
                    suspiciousCases: 0,
                    safeScans: 0,
                    lastUpdated: new Date().toISOString()
                }
            };
            localStorage.setItem(this.storageKey, JSON.stringify(initialData));
        }
    }

    getData() {
        try {
            return JSON.parse(localStorage.getItem(this.storageKey));
        } catch (e) {
            console.error('Error reading data:', e);
            this.initStorage();
            return this.getData();
        }
    }

    saveData(data) {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(data));
        } catch (e) {
            console.error('Error saving data:', e);
        }
    }

    addScan(scanResult) {
        const data = this.getData();
        
        // Add scan with anonymized content (first 100 chars only)
        const anonymizedScan = {
            id: this.generateId(),
            timestamp: scanResult.timestamp,
            contentPreview: scanResult.content.substring(0, 100) + '...',
            riskLevel: scanResult.riskLevel,
            riskScore: scanResult.riskScore,
            flags: scanResult.flags,
            flagCount: scanResult.flags.length
        };
        
        data.scans.unshift(anonymizedScan);
        
        // Keep only last 100 scans
        if (data.scans.length > 100) {
            data.scans = data.scans.slice(0, 100);
        }
        
        // Update stats
        data.stats.totalScans++;
        if (scanResult.riskLevel === 'high' || scanResult.riskLevel === 'medium') {
            data.stats.suspiciousCases++;
        } else {
            data.stats.safeScans++;
        }
        data.stats.lastUpdated = new Date().toISOString();
        
        this.saveData(data);
        return anonymizedScan;
    }

    getStats() {
        return this.getData().stats;
    }

    getScans(limit = 50) {
        const data = this.getData();
        return data.scans.slice(0, limit);
    }

    clearAllData() {
        this.initStorage();
    }

    generateId() {
        return 'scan_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }
}

// Initialize storage manager
const storage = new StorageManager();

// UI Manager
class UIManager {
    constructor() {
        this.initElements();
        this.attachEventListeners();
        this.updateStats();
    }

    initElements() {
        // Mobile Nav elements
        this.mobileNavToggle = document.querySelector('.mobile-nav-toggle');
        this.mobileNavClose = document.querySelector('.mobile-nav-close');
        this.sideNav = document.getElementById('sideNav');
        this.overlay = document.getElementById('overlay');
        
        // Analyzer elements
        this.contentInput = document.getElementById('contentInput');
        this.analyzeBtn = document.getElementById('analyzeBtn');
        this.clearBtn = document.getElementById('clearBtn');
        this.loadingState = document.getElementById('loadingState');
        this.resultsSection = document.getElementById('resultsSection');
        this.newAnalysisBtn = document.getElementById('newAnalysisBtn');
        
        // Results elements
        this.riskDisplay = document.getElementById('riskDisplay');
        this.riskIcon = document.getElementById('riskIcon');
        this.riskLevel = document.getElementById('riskLevel');
        this.riskDescription = document.getElementById('riskDescription');
        this.scoreValue = document.getElementById('scoreValue');
        this.scoreCircle = document.getElementById('scoreCircle');
        this.detailedResults = document.getElementById('detailedResults');
        this.recommendationsList = document.getElementById('recommendationsList');
        
        // Stats elements
        this.totalScansEl = document.getElementById('totalScans');
        this.suspiciousCasesEl = document.getElementById('suspiciousCases');
        this.usersProtectedEl = document.getElementById('usersProtected');
    }

    attachEventListeners() {
        // Mobile Nav listeners
        if (this.mobileNavToggle) {
            this.mobileNavToggle.addEventListener('click', () => this.openSideNav());
        }
        if (this.mobileNavClose) {
            this.mobileNavClose.addEventListener('click', () => this.closeSideNav());
        }
        if (this.overlay) {
            this.overlay.addEventListener('click', () => this.closeSideNav());
        }

        // Analyzer listeners
        if (this.analyzeBtn) {
            this.analyzeBtn.addEventListener('click', () => this.handleAnalyze());
        }
        if (this.clearBtn) {
            this.clearBtn.addEventListener('click', () => this.handleClear());
        }
        if (this.newAnalysisBtn) {
            this.newAnalysisBtn.addEventListener('click', () => this.handleNewAnalysis());
        }

        // Smooth scrolling for nav links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                this.closeSideNav(); // Close nav on link click
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    
                    // Update active nav link
                    document.querySelectorAll('.nav-link').forEach(link => {
                        link.classList.remove('active');
                    });
                    if (anchor.classList.contains('nav-link')) {
                        anchor.classList.add('active');
                    }
                }
            });
        });

        // Keyboard shortcut: Ctrl/Cmd + Enter to analyze
        if (this.contentInput) {
            this.contentInput.addEventListener('keydown', (e) => {
                if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                    e.preventDefault();
                    this.handleAnalyze();
                }
            });
        }
    }

    openSideNav() {
        if (this.sideNav) this.sideNav.classList.add('is-open');
        if (this.overlay) this.overlay.classList.add('is-active');
    }

    closeSideNav() {
        if (this.sideNav) this.sideNav.classList.remove('is-open');
        if (this.overlay) this.overlay.classList.remove('is-active');
    }

    handleAnalyze() {
        const content = this.contentInput.value.trim();
        
        if (!content) {
            this.showError('Please enter some content to analyze');
            return;
        }

        // Disable button and show loading
        this.analyzeBtn.disabled = true;
        this.loadingState.style.display = 'block';
        this.resultsSection.style.display = 'none';

        // Using a setTimeout to allow the UI to update and show the loading state
        setTimeout(() => {
            try {
                // Perform analysis using the local analyzer
                const result = analyzer.analyze(content);

                if (result.error) {
                    throw new Error(result.message);
                }

                // The local analyzer already provides all necessary fields.
                // We just need to add the original content for storage.
                const scanData = {
                    ...result,
                    content: content
                };

                // Save to storage
                storage.addScan(scanData);
                
                // Display results
                this.displayResults(result);
                
                // Update stats
                this.updateStats();

            } catch (error) {
                console.error('Analysis error:', error);
                this.showError(`An error occurred during analysis: ${error.message}`);
            } finally {
                this.analyzeBtn.disabled = false;
                this.loadingState.style.display = 'none';
            }
        }, 100); // A small delay to ensure loading spinner is shown
    }

    handleClear() {
        this.contentInput.value = '';
        this.contentInput.focus();
    }

    handleNewAnalysis() {
        this.resultsSection.style.display = 'none';
        this.contentInput.value = '';
        this.contentInput.focus();
        
        // Smooth scroll to analyzer
        document.getElementById('analyzer').scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start' 
        });
    }

    displayResults(result) {
        // Show results section
        this.resultsSection.style.display = 'block';
        
        // Update risk display
        this.riskDisplay.className = `risk-display ${result.riskLevel}`;
        this.riskLevel.textContent = this.formatRiskLevel(result.riskLevel);
        this.riskDescription.textContent = result.riskMessage;
        
        // Update risk icon
        const iconClass = this.getRiskIcon(result.riskLevel);
        this.riskIcon.className = `fas ${iconClass}`;
        
        // Update score
        this.updateScore(result.riskScore);
        
        // Display detailed analysis
        this.displayDetails(result.details);
        
        // Display recommendations
        this.displayRecommendations(result.recommendations);
        
        // Smooth scroll to results
        setTimeout(() => {
            this.resultsSection.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'nearest' 
            });
        }, 100);
    }

    formatRiskLevel(level) {
        const levels = {
            'safe': '✓ Safe',
            'low': '⚠ Low Risk',
            'medium': '⚠ Medium Risk',
            'high': '✖ High Risk'
        };
        return levels[level] || level;
    }

    getRiskIcon(level) {
        const icons = {
            'safe': 'fa-shield-check',
            'low': 'fa-shield-alt',
            'medium': 'fa-exclamation-triangle',
            'high': 'fa-exclamation-circle'
        };
        return icons[level] || 'fa-shield-alt';
    }

    updateScore(score) {
        // Animate score number
        let current = 0;
        const increment = score / 30;
        const timer = setInterval(() => {
            current += increment;
            if (current >= score) {
                current = score;
                clearInterval(timer);
            }
            this.scoreValue.textContent = Math.round(current);
        }, 30);
        
        // Update circle progress
        const circumference = 2 * Math.PI * 50; // radius = 50
        const offset = circumference - (score / 100) * circumference;
        this.scoreCircle.style.strokeDashoffset = offset;
        
        // Set color based on risk
        let color;
        if (score >= 70) color = '#ef4444'; // danger
        else if (score >= 40) color = '#f59e0b'; // warning
        else if (score >= 15) color = '#3b82f6'; // low
        else color = '#10b981'; // safe
        
        this.scoreCircle.style.stroke = color;
    }

    displayDetails(details) {
        if (!details || details.length === 0) {
            this.detailedResults.innerHTML = '<p style="color: var(--gray-600);">No significant issues detected.</p>';
            return;
        }

        this.detailedResults.innerHTML = details.map(detail => `
            <div class="detail-item">
                <i class="fas ${this.getDetailIcon(detail.type)}"></i>
                <div>
                    <strong>${detail.title}</strong>
                    <p style="margin-top: 4px; color: var(--gray-600);">${detail.message}</p>
                </div>
            </div>
        `).join('');
    }

    getDetailIcon(type) {
        const icons = {
            'info': 'fa-info-circle',
            'warning': 'fa-exclamation-triangle',
            'danger': 'fa-exclamation-circle',
            'success': 'fa-check-circle'
        };
        return icons[type] || 'fa-info-circle';
    }

    displayRecommendations(recommendations) {
        if (!recommendations || recommendations.length === 0) {
            this.recommendationsList.innerHTML = '<li>Continue to stay vigilant with unsolicited messages.</li>';
            return;
        }

        this.recommendationsList.innerHTML = recommendations.map(rec => `
            <li>
                <i class="fas fa-check-circle"></i>
                <span>${rec}</span>
            </li>
        `).join('');
    }

    updateStats() {
        const stats = storage.getStats();
        
        if (this.totalScansEl) {
            this.animateCounter(this.totalScansEl, stats.totalScans);
        }
        if (this.suspiciousCasesEl) {
            this.animateCounter(this.suspiciousCasesEl, stats.suspiciousCases);
        }
        if (this.usersProtectedEl) {
            // Calculate "users protected" as total scans (simulated)
            this.animateCounter(this.usersProtectedEl, stats.totalScans);
        }
    }

    animateCounter(element, target) {
        const current = parseInt(element.textContent) || 0;
        if (current === target) return;
        
        const increment = Math.ceil((target - current) / 20);
        let value = current;
        
        const timer = setInterval(() => {
            value += increment;
            if (value >= target) {
                value = target;
                clearInterval(timer);
            }
            element.textContent = value.toLocaleString();
        }, 50);
    }

    showError(message) {
        alert(message); // Simple error display for MVP
    }
}

// Initialize UI when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const ui = new UIManager();
    console.log('SafeSphere initialized successfully');
});
