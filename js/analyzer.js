/**
 * SafeSphere - Scam Analyzer Module
 * Core logic for analyzing suspicious content and detecting potential scams
 */

class ScamAnalyzer {
    constructor() {
        // Scam detection patterns and keywords
        this.patterns = {
            urgentKeywords: [
                'urgent', 'immediately', 'act now', 'limited time', 'expires',
                'hurry', 'quick', 'fast', 'now', 'today only', 'last chance',
                'don\'t miss', 'ending soon', 'final notice'
            ],
            financialKeywords: [
                'bank', 'account', 'credit card', 'payment', 'transaction',
                'money', 'cash', 'prize', 'winner', 'won', 'lottery',
                'inheritance', 'tax refund', 'reward', 'claim', 'deposit',
                'transfer', 'wire', 'bitcoin', 'cryptocurrency', 'investment'
            ],
            authenticationKeywords: [
                'otp', 'one-time password', 'verification code', 'pin',
                'password', 'security code', 'confirm', 'verify', 'authenticate',
                'validate', 'update', 'suspended', 'locked', 'blocked',
                'unauthorized', 'unusual activity', 'suspicious activity'
            ],
            actionKeywords: [
                'click here', 'click now', 'download', 'open attachment',
                'follow link', 'visit', 'go to', 'sign in', 'log in',
                'enter', 'provide', 'send', 'reply', 'call now', 'contact'
            ],
            scamIndicators: [
                'congratulations', 'selected', 'chosen', 'qualified',
                'free', 'gift', 'bonus', 'offer', 'deal', 'discount',
                'guarantee', '100%', 'risk-free', 'no catch', 'limited offer',
                'act fast', 'don\'t delay', 'time sensitive'
            ],
            threatKeywords: [
                'suspend', 'terminate', 'cancel', 'expire', 'close',
                'legal action', 'arrest', 'warrant', 'court', 'fine',
                'penalty', 'consequence', 'lose access', 'deactivate'
            ]
        };

        // URL patterns that are commonly used in phishing
        this.suspiciousUrlPatterns = [
            /bit\.ly/i,           // URL shorteners
            /tinyurl/i,
            /goo\.gl/i,
            /ow\.ly/i,
            /t\.co/i,
            /[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}/, // IP addresses
            /-verify/i,
            /-secure/i,
            /-update/i,
            /-login/i,
            /paypal[^\.]/i,      // Misspelled legitimate domains
            /amaz0n/i,
            /g00gle/i,
            /faceb00k/i,
            /micr0soft/i,
            /\.tk$/i,            // Suspicious TLDs
            /\.ml$/i,
            /\.ga$/i,
            /\.cf$/i,
            /\.gq$/i,
            /\d{5,}/,            // Long number sequences in URLs
        ];

        // Legitimate domain patterns (for comparison)
        this.legitimateDomains = [
            'paypal.com', 'amazon.com', 'google.com', 'microsoft.com',
            'facebook.com', 'apple.com', 'netflix.com', 'linkedin.com'
        ];
    }

    /**
     * Main analysis function
     * @param {string} content - The content to analyze
     * @returns {object} - Analysis results
     */
    analyze(content) {
        if (!content || content.trim().length === 0) {
            return {
                error: true,
                message: 'Please enter content to analyze'
            };
        }

        const analysis = {
            content: content,
            timestamp: new Date().toISOString(),
            riskScore: 0,
            riskLevel: 'safe',
            flags: [],
            details: [],
            recommendations: []
        };

        // Perform various checks
        this.checkUrgency(content, analysis);
        this.checkFinancialTerms(content, analysis);
        this.checkAuthentication(content, analysis);
        this.checkActions(content, analysis);
        this.checkScamIndicators(content, analysis);
        this.checkThreats(content, analysis);
        this.checkUrls(content, analysis);
        this.checkGrammar(content, analysis);
        this.checkPersonalInfo(content, analysis);
        
        // Calculate final risk score and level
        this.calculateRiskLevel(analysis);
        
        // Generate recommendations
        this.generateRecommendations(analysis);

        return analysis;
    }

    /**
     * Check for urgency indicators
     */
    checkUrgency(content, analysis) {
        const lowerContent = content.toLowerCase();
        let urgencyCount = 0;
        const foundKeywords = [];

        this.patterns.urgentKeywords.forEach(keyword => {
            if (lowerContent.includes(keyword)) {
                urgencyCount++;
                foundKeywords.push(keyword);
            }
        });

        if (urgencyCount > 0) {
            const score = Math.min(urgencyCount * 8, 25);
            analysis.riskScore += score;
            analysis.flags.push('urgency');
            analysis.details.push({
                type: 'warning',
                title: 'Urgency Detected',
                message: `Found ${urgencyCount} urgency indicator(s): ${foundKeywords.slice(0, 3).join(', ')}. Scammers often create false urgency to pressure quick decisions.`
            });
        }
    }

    /**
     * Check for financial terms
     */
    checkFinancialTerms(content, analysis) {
        const lowerContent = content.toLowerCase();
        let financialCount = 0;
        const foundKeywords = [];

        this.patterns.financialKeywords.forEach(keyword => {
            if (lowerContent.includes(keyword)) {
                financialCount++;
                foundKeywords.push(keyword);
            }
        });

        if (financialCount > 0) {
            const score = Math.min(financialCount * 10, 30);
            analysis.riskScore += score;
            analysis.flags.push('financial');
            analysis.details.push({
                type: 'warning',
                title: 'Financial Terms Detected',
                message: `Found ${financialCount} financial term(s): ${foundKeywords.slice(0, 3).join(', ')}. Be cautious of unsolicited financial requests.`
            });
        }
    }

    /**
     * Check for authentication requests
     */
    checkAuthentication(content, analysis) {
        const lowerContent = content.toLowerCase();
        let authCount = 0;
        const foundKeywords = [];

        this.patterns.authenticationKeywords.forEach(keyword => {
            if (lowerContent.includes(keyword)) {
                authCount++;
                foundKeywords.push(keyword);
            }
        });

        if (authCount > 0) {
            const score = Math.min(authCount * 12, 35);
            analysis.riskScore += score;
            analysis.flags.push('authentication');
            analysis.details.push({
                type: 'danger',
                title: 'Authentication Request Detected',
                message: `Found ${authCount} authentication term(s): ${foundKeywords.slice(0, 3).join(', ')}. Never share OTPs, passwords, or verification codes.`
            });
        }
    }

    /**
     * Check for action requests
     */
    checkActions(content, analysis) {
        const lowerContent = content.toLowerCase();
        let actionCount = 0;
        const foundKeywords = [];

        this.patterns.actionKeywords.forEach(keyword => {
            if (lowerContent.includes(keyword)) {
                actionCount++;
                foundKeywords.push(keyword);
            }
        });

        if (actionCount > 0) {
            const score = Math.min(actionCount * 7, 20);
            analysis.riskScore += score;
            analysis.flags.push('action_request');
            analysis.details.push({
                type: 'warning',
                title: 'Action Request Detected',
                message: `Found ${actionCount} action request(s): ${foundKeywords.slice(0, 3).join(', ')}. Verify before clicking links or downloading files.`
            });
        }
    }

    /**
     * Check for common scam indicators
     */
    checkScamIndicators(content, analysis) {
        const lowerContent = content.toLowerCase();
        let scamCount = 0;
        const foundKeywords = [];

        this.patterns.scamIndicators.forEach(keyword => {
            if (lowerContent.includes(keyword)) {
                scamCount++;
                foundKeywords.push(keyword);
            }
        });

        if (scamCount > 0) {
            const score = Math.min(scamCount * 9, 25);
            analysis.riskScore += score;
            analysis.flags.push('scam_indicators');
            analysis.details.push({
                type: 'warning',
                title: 'Scam Indicators Found',
                message: `Found ${scamCount} common scam indicator(s): ${foundKeywords.slice(0, 3).join(', ')}. "Too good to be true" offers are often scams.`
            });
        }
    }

    /**
     * Check for threat language
     */
    checkThreats(content, analysis) {
        const lowerContent = content.toLowerCase();
        let threatCount = 0;
        const foundKeywords = [];

        this.patterns.threatKeywords.forEach(keyword => {
            if (lowerContent.includes(keyword)) {
                threatCount++;
                foundKeywords.push(keyword);
            }
        });

        if (threatCount > 0) {
            const score = Math.min(threatCount * 11, 30);
            analysis.riskScore += score;
            analysis.flags.push('threats');
            analysis.details.push({
                type: 'danger',
                title: 'Threatening Language Detected',
                message: `Found ${threatCount} threat(s): ${foundKeywords.slice(0, 3).join(', ')}. Legitimate organizations rarely use threatening language.`
            });
        }
    }

    /**
     * Check URLs in content
     */
    checkUrls(content, analysis) {
        // Extract URLs
        const urlRegex = /(https?:\/\/[^\s]+)|(www\.[^\s]+)|([a-zA-Z0-9-]+\.[a-zA-Z]{2,}[^\s]*)/g;
        const urls = content.match(urlRegex) || [];
        
        if (urls.length > 0) {
            let suspiciousUrlCount = 0;
            const suspiciousUrls = [];

            urls.forEach(url => {
                let isSuspicious = false;
                
                // Check against suspicious patterns
                this.suspiciousUrlPatterns.forEach(pattern => {
                    if (pattern.test(url)) {
                        isSuspicious = true;
                    }
                });

                // Check for legitimate domain impersonation
                const urlLower = url.toLowerCase();
                this.legitimateDomains.forEach(domain => {
                    if (urlLower.includes(domain.split('.')[0]) && !urlLower.includes(domain)) {
                        isSuspicious = true;
                    }
                });

                if (isSuspicious) {
                    suspiciousUrlCount++;
                    suspiciousUrls.push(url);
                }
            });

            if (suspiciousUrlCount > 0) {
                const score = Math.min(suspiciousUrlCount * 20, 40);
                analysis.riskScore += score;
                analysis.flags.push('suspicious_urls');
                analysis.details.push({
                    type: 'danger',
                    title: 'Suspicious URLs Detected',
                    message: `Found ${suspiciousUrlCount} suspicious URL(s). These may be shortened links, use IP addresses, or impersonate legitimate domains.`
                });
            } else if (urls.length > 0) {
                analysis.details.push({
                    type: 'info',
                    title: 'URLs Found',
                    message: `Found ${urls.length} URL(s). Always verify URLs before clicking by hovering over links.`
                });
            }
        }
    }

    /**
     * Check for poor grammar and spelling
     */
    checkGrammar(content, analysis) {
        let grammarIssues = 0;

        // Check for excessive punctuation
        const excessivePunctuation = (content.match(/[!?]{2,}/g) || []).length;
        if (excessivePunctuation > 0) grammarIssues++;

        // Check for ALL CAPS
        const words = content.split(/\s+/);
        const capsWords = words.filter(word => word.length > 3 && word === word.toUpperCase() && /[A-Z]/.test(word));
        if (capsWords.length > words.length * 0.3) grammarIssues++;

        // Check for multiple spaces
        if (/\s{3,}/.test(content)) grammarIssues++;

        if (grammarIssues > 0) {
            const score = grammarIssues * 8;
            analysis.riskScore += score;
            analysis.flags.push('poor_grammar');
            analysis.details.push({
                type: 'warning',
                title: 'Grammar/Formatting Issues',
                message: 'Poor grammar, excessive punctuation, or unusual formatting detected. This is common in phishing attempts.'
            });
        }
    }

    /**
     * Check for personal information requests
     */
    checkPersonalInfo(content, analysis) {
        const personalInfoPatterns = [
            /social security/i,
            /ssn/i,
            /date of birth/i,
            /dob/i,
            /mother'?s maiden name/i,
            /passport/i,
            /driver'?s license/i,
            /credit card number/i,
            /cvv/i,
            /account number/i,
            /routing number/i
        ];

        let personalInfoCount = 0;
        personalInfoPatterns.forEach(pattern => {
            if (pattern.test(content)) {
                personalInfoCount++;
            }
        });

        if (personalInfoCount > 0) {
            const score = personalInfoCount * 15;
            analysis.riskScore += score;
            analysis.flags.push('personal_info_request');
            analysis.details.push({
                type: 'danger',
                title: 'Personal Information Request',
                message: 'Requests for sensitive personal information detected. Legitimate organizations rarely ask for this via email/text.'
            });
        }
    }

    /**
     * Calculate final risk level based on score
     */
    calculateRiskLevel(analysis) {
        const score = Math.min(analysis.riskScore, 100);
        analysis.riskScore = score;

        if (score >= 70) {
            analysis.riskLevel = 'high';
            analysis.riskMessage = 'HIGH RISK - This content shows multiple red flags commonly found in scams. Do not respond, click links, or provide any information.';
        } else if (score >= 40) {
            analysis.riskLevel = 'medium';
            analysis.riskMessage = 'MEDIUM RISK - This content contains several suspicious elements. Exercise extreme caution and verify through official channels.';
        } else if (score >= 15) {
            analysis.riskLevel = 'low';
            analysis.riskMessage = 'LOW RISK - Some minor concerns detected. Stay vigilant and verify sender identity if unsure.';
        } else {
            analysis.riskLevel = 'safe';
            analysis.riskMessage = 'SAFE - No significant red flags detected. However, always remain cautious with unsolicited messages.';
        }
    }

    /**
     * Generate personalized recommendations
     */
    generateRecommendations(analysis) {
        const recommendations = [];

        if (analysis.flags.includes('suspicious_urls')) {
            recommendations.push('Do NOT click on any links. Verify URLs by contacting the organization directly.');
        }

        if (analysis.flags.includes('authentication')) {
            recommendations.push('Never share OTPs, passwords, or verification codes with anyone, including support staff.');
        }

        if (analysis.flags.includes('personal_info_request')) {
            recommendations.push('Do not provide personal or financial information through unsecured channels.');
        }

        if (analysis.flags.includes('urgency')) {
            recommendations.push('Take time to verify. Legitimate organizations won\'t pressure you with extreme urgency.');
        }

        if (analysis.flags.includes('threats')) {
            recommendations.push('Contact the organization directly using official contact information to verify any claims.');
        }

        if (analysis.flags.includes('financial')) {
            recommendations.push('Verify any financial requests through official channels before taking action.');
        }

        // Always add general recommendations
        recommendations.push('When in doubt, contact the organization directly using verified contact information.');
        recommendations.push('Report suspicious messages to the appropriate authorities or platform.');
        
        if (analysis.riskLevel === 'high' || analysis.riskLevel === 'medium') {
            recommendations.push('Consider blocking the sender and marking the message as spam/phishing.');
        }

        analysis.recommendations = recommendations;
    }
}

// Initialize analyzer
const analyzer = new ScamAnalyzer();
