# SafeSphere 🛡️

**Detect scams before they harm you.**

SafeSphere is an AI-powered digital safety web application designed for the Open Innovation hackathon challenge. It helps users identify potential online scams by analyzing suspicious messages, emails, and URLs, providing instant risk assessments and actionable recommendations.

![SafeSphere Banner](https://img.shields.io/badge/Status-MVP%20Ready-success) ![Version](https://img.shields.io/badge/Version-1.0.0-blue) ![License](https://img.shields.io/badge/License-MIT-green)

## 🚀 Live Demo

Once deployed, your SafeSphere app will be accessible at your hosting URL.

**Admin Access:**
- URL: `/admin.html`
- Username: `admin`
- Password: `admin123`

## 📋 Table of Contents

- [Features](#features)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [How It Works](#how-it-works)
- [Admin Dashboard](#admin-dashboard)
- [Detection Logic](#detection-logic)
- [Data Storage](#data-storage)
- [Future Enhancements](#future-enhancements)
- [Contributing](#contributing)
- [License](#license)

## ✨ Features

### Currently Implemented

#### 🎯 Main Features
- **Real-time Scam Analysis**: Instant analysis of suspicious messages, emails, and URLs
- **Risk Assessment**: 4-level risk classification (Safe, Low, Medium, High)
- **Visual Risk Score**: Interactive circular progress indicator showing risk score (0-100)
- **Detailed Breakdown**: Comprehensive analysis of detected threats and red flags
- **Personalized Recommendations**: Contextual safety advice based on detected threats

#### 🔍 Detection Capabilities
- **Urgency Detection**: Identifies pressure tactics and false urgency
- **Financial Scam Detection**: Recognizes money-related scam patterns
- **Authentication Requests**: Flags OTP, password, and verification code requests
- **URL Analysis**: Detects suspicious links, URL shorteners, and phishing domains
- **Personal Information Requests**: Identifies requests for sensitive data
- **Grammar & Formatting Analysis**: Detects poor grammar and suspicious formatting
- **Threat Language Detection**: Recognizes intimidation and threatening language

#### 📊 Admin Dashboard
- **Authentication System**: Secure login with hardcoded credentials (MVP)
- **Statistics Overview**: Total scans, suspicious cases, detection rates
- **Visual Analytics**: Interactive charts showing risk distribution and trends
- **Recent Activity Log**: Real-time feed of analyzed content (anonymized)
- **Data Management**: Export data as JSON, clear all records
- **Detailed Scans Table**: Comprehensive view of all analyzed content
- **Keyword Analysis**: Top threat indicators and scam type breakdown

#### 🎨 User Experience
- **Modern, Responsive Design**: Works seamlessly on desktop and mobile
- **Smooth Animations**: Polished transitions and interactive elements
- **Educational Tips**: 8 comprehensive scam prevention guidelines
- **Clean Interface**: Professional, trustworthy design aesthetic
- **Real-time Stats**: Community protection statistics

### 🚧 Features Not Yet Implemented

- Machine Learning-based detection
- Natural Language Processing (NLP) integration
- Real-time threat intelligence updates
- User accounts and authentication
- Browser extension
- Mobile app (iOS/Android)
- Email plugin integration
- Multi-language support
- Advanced reporting features
- API for third-party integration
- Bank and telecom partner integrations
- Social media integration

## 🛠️ Technology Stack

### Frontend
- **HTML5**: Semantic markup
- **CSS3**: Custom styling with CSS variables
- **JavaScript (ES6+)**: Vanilla JavaScript for core functionality
- **Chart.js**: Data visualization for admin dashboard

### Libraries & Frameworks
- **Font Awesome**: Icon library
- **Google Fonts (Inter)**: Typography

### Storage
- **localStorage**: Client-side data persistence
- **No backend required**: Fully static web application

### Deployment-Ready For
- Vercel
- Netlify
- GitHub Pages
- Any static hosting service

## 📁 Project Structure

```
safesphere/
├── index.html              # Main landing page and analyzer
├── admin.html             # Admin dashboard
├── css/
│   ├── styles.css         # Main application styles
│   └── admin.css          # Admin dashboard styles
├── js/
│   ├── main.js            # Main application logic and UI management
│   ├── analyzer.js        # Scam detection engine
│   └── admin.js           # Admin dashboard functionality
└── README.md              # Project documentation
```

## 🚀 Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- No build tools or dependencies required

### Installation

1. **Clone or download the project files**
   ```bash
   # Clone repository
   git clone [your-repo-url]
   cd safesphere
   ```

2. **Open in browser**
   - Simply open `index.html` in your web browser
   - Or use a local server (recommended):
     ```bash
     # Using Python 3
     python -m http.server 8000
     
     # Using Node.js http-server
     npx http-server
     ```

3. **Access the application**
   - Main App: `http://localhost:8000/index.html`
   - Admin Dashboard: `http://localhost:8000/admin.html`

### Deployment

#### Vercel
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

#### Netlify
1. Drag and drop the project folder to Netlify
2. Or use Netlify CLI:
   ```bash
   npm install -g netlify-cli
   netlify deploy
   ```

#### GitHub Pages
1. Push code to GitHub repository
2. Go to Settings > Pages
3. Select main branch as source
4. Your site will be live at `https://[username].github.io/safesphere`

## 🔍 How It Works

### User Flow

1. **Landing Page**
   - User sees app overview and value proposition
   - Clear call-to-action to start analysis

2. **Content Analysis**
   - User pastes suspicious message, email, or URL
   - Clicks "Analyze Content" button
   - System performs real-time analysis (< 2 seconds)

3. **Results Display**
   - Visual risk level indicator with color coding
   - Risk score (0-100) with circular progress
   - Detailed breakdown of detected threats
   - Personalized recommendations

4. **Education**
   - Access to scam prevention tips
   - Learn about common scam tactics
   - Stay informed about online safety

### Analysis Process

```
User Input → Keyword Detection → URL Analysis → 
Grammar Check → Risk Calculation → Result Display
```

## 👨‍💼 Admin Dashboard

### Access
- URL: `/admin.html`
- Username: `admin`
- Password: `admin123`

### Dashboard Sections

#### 1. Overview
- **Statistics Cards**: Total scans, suspicious cases, safe results, detection rate
- **Risk Distribution Chart**: Pie chart showing risk level breakdown
- **Activity Timeline**: Line graph of recent scan risk scores
- **Recent Activity**: Last 5 analyzed items with quick preview

#### 2. Recent Scans
- **Comprehensive Table**: All scans with timestamps, content previews, risk levels
- **Flag Indicators**: Visual tags for detected threat types
- **Actions**: View detailed analysis, export data
- **Data Management**: Clear all records with confirmation

#### 3. Analytics
- **Top Keywords**: Most frequently detected threat indicators
- **Score Distribution**: Bar chart showing risk score ranges
- **Scam Types**: Breakdown by phishing, financial, identity theft, etc.

#### 4. Settings
- **Notifications**: Email alerts configuration (UI only)
- **Security**: Password change, 2FA setup (UI only)
- **Data Export**: Download all data as JSON
- **Data Clearing**: Remove all stored information

## 🧠 Detection Logic

### Rule-Based Analysis

The scam detection engine uses pattern matching across multiple categories:

#### 1. Urgency Keywords (Weight: 8 per match, max 25)
- urgent, immediately, act now, limited time, expires, etc.

#### 2. Financial Terms (Weight: 10 per match, max 30)
- bank, money, prize, lottery, inheritance, cryptocurrency, etc.

#### 3. Authentication Requests (Weight: 12 per match, max 35)
- OTP, password, verification code, PIN, suspended account, etc.

#### 4. Action Keywords (Weight: 7 per match, max 20)
- click here, download, sign in, provide information, etc.

#### 5. Scam Indicators (Weight: 9 per match, max 25)
- congratulations, free, guarantee, 100%, risk-free, etc.

#### 6. Threat Language (Weight: 11 per match, max 30)
- suspend, terminate, legal action, arrest, warrant, fine, etc.

#### 7. URL Patterns (Weight: 20 per suspicious URL, max 40)
- URL shorteners, IP addresses, misspelled domains, suspicious TLDs

#### 8. Grammar Issues (Weight: 8 per issue)
- Excessive punctuation, ALL CAPS, poor formatting

#### 9. Personal Info Requests (Weight: 15 per request)
- SSN, credit card, passport, driver's license, etc.

### Risk Levels

| Score | Level | Description |
|-------|-------|-------------|
| 0-14 | Safe | No significant red flags |
| 15-39 | Low Risk | Minor concerns detected |
| 40-69 | Medium Risk | Multiple suspicious elements |
| 70-100 | High Risk | Strong scam indicators |

## 💾 Data Storage

### localStorage Structure

```json
{
  "safesphere_data": {
    "scans": [
      {
        "id": "scan_1234567890_abc123",
        "timestamp": "2024-01-15T10:30:00.000Z",
        "contentPreview": "URGENT! Your bank account has been...",
        "riskLevel": "high",
        "riskScore": 85,
        "flags": ["urgency", "financial", "authentication"],
        "flagCount": 3
      }
    ],
    "stats": {
      "totalScans": 150,
      "suspiciousCases": 45,
      "safeScans": 105,
      "lastUpdated": "2024-01-15T12:00:00.000Z"
    }
  }
}
```

### Privacy & Security

- **No personal data stored**: Only anonymized content previews (first 100 characters)
- **Client-side only**: All data stays in user's browser
- **No server transmission**: Zero data sent to external servers
- **User control**: Clear all data anytime from admin dashboard
- **No tracking**: No analytics or tracking scripts

## 🔮 Future Enhancements

### Short-term (MVP Extensions)
- [ ] Add export functionality for individual scans
- [ ] Implement search and filter in admin dashboard
- [ ] Add more detailed analytics charts
- [ ] Include threat type classification
- [ ] Add keyboard shortcuts for power users

### Medium-term
- [ ] Integrate machine learning model for improved detection
- [ ] Add user authentication system
- [ ] Implement real-time threat intelligence feed
- [ ] Create browser extension
- [ ] Add multi-language support

### Long-term
- [ ] Develop mobile applications (iOS/Android)
- [ ] Create API for third-party integration
- [ ] Partner with banks and telecom companies
- [ ] Build community reporting system
- [ ] Implement advanced NLP analysis

## 🎯 Recommended Next Steps

1. **Enhance Detection Logic**
   - Integrate machine learning models
   - Add more sophisticated URL analysis
   - Implement domain reputation checking

2. **Improve User Experience**
   - Add onboarding tutorial
   - Create interactive demos
   - Implement dark mode

3. **Expand Admin Features**
   - Add user management (if authentication added)
   - Implement advanced reporting
   - Create automated alerts system

4. **Deploy & Test**
   - Deploy to production hosting
   - Conduct user testing
   - Gather feedback and iterate

5. **Marketing & Outreach**
   - Create demo video
   - Prepare hackathon presentation
   - Share on social media

## 🤝 Contributing

This is a hackathon MVP. If you'd like to contribute:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see below for details:

```
MIT License

Copyright (c) 2024 SafeSphere

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

## 📞 Contact & Support

**Project Name**: SafeSphere  
**Version**: 1.0.0 (MVP)  
**Created For**: Open Innovation Hackathon  
**Date**: 2024

---

## ⚠️ Disclaimer

**SafeSphere is an awareness tool and does not guarantee 100% accuracy.** This application is designed to help users identify potential scams through pattern recognition and heuristic analysis. It should not be the sole basis for security decisions. Always:

- Exercise caution with unsolicited messages
- Verify suspicious content through official channels
- Use multiple layers of security protection
- Stay informed about evolving scam tactics
- Report suspicious activity to appropriate authorities

**This is an educational tool created for a hackathon.** While it provides valuable insights, professional security solutions should be consulted for critical security needs.

---

Made with ❤️ for the Open Innovation Hackathon | **#DigitalSafety #ScamPrevention #OpenInnovation**
#   S a f e S p h e r e  
 