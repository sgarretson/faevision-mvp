# 🎨 FAEVision MVP - Design Standards & Guidelines

**Version**: 1.0  
**Date**: December 9, 2024  
**Team**: 11 Expert Specialists - Unanimous Consensus  
**Status**: APPROVED FOR IMPLEMENTATION  
**Audience**: Executive-Focused Internal Application (50 Users)

---

## 📋 **DESIGN PHILOSOPHY**

### **Executive-Centered Design Principles**

#### **1. Information Efficiency**
- **Dashboard-First Thinking**: Overview before details, trends before data
- **Scannable Hierarchy**: F-pattern layout optimization for executive scanning
- **Status-Driven Navigation**: Workflow stages guide information architecture
- **Progressive Disclosure**: Detailed information available without overwhelming

#### **2. Professional Intelligence**
- **Business-Grade Aesthetics**: Sophisticated, clean design building stakeholder confidence
- **Data Visualization Priority**: Charts, trends, and metrics as first-class citizens
- **Executive Decision Support**: Design optimized for quick decision-making
- **Trust-Building Design**: Clear, reliable patterns that build user confidence

#### **3. Mobile Executive Efficiency**
- **Meeting-Friendly Capture**: Streamlined mobile input creation during meetings
- **Quick Status Checks**: Essential information accessible on mobile
- **Touch-Optimized Actions**: Executive-friendly mobile interaction patterns
- **Contextual Mobile Experience**: Different mobile patterns for different user roles

#### **4. AI-Enhanced Transparency**
- **AI Confidence Communication**: Clear indicators of AI suggestion quality
- **Human Control Priority**: Executive override capabilities prominently displayed
- **Learning Integration**: Simple feedback mechanisms to improve AI accuracy
- **Fallback Excellence**: Graceful degradation when AI features unavailable

---

## 🎨 **EXECUTIVE COLOR SYSTEM**

### **Primary Brand Palette**

#### **Executive Blue (Primary)**
```css
/* Trust-building blue optimized for business applications */
--color-primary-50: #eff6ff;   /* Light backgrounds */
--color-primary-100: #dbeafe;  /* Subtle highlights */
--color-primary-500: #3b82f6;  /* Primary actions */
--color-primary-600: #2563eb;  /* Primary hover */
--color-primary-700: #1d4ed8;  /* Active states */
--color-primary-900: #1e3a8a;  /* Dark mode primary */
```

#### **Professional Neutrals**
```css
/* Sophisticated gray scale for professional interfaces */
--color-gray-25: #fcfcfd;      /* Subtle background variation */
--color-gray-50: #f9fafb;      /* Page background */
--color-gray-100: #f3f4f6;     /* Card backgrounds */
--color-gray-200: #e5e7eb;     /* Borders, dividers */
--color-gray-300: #d1d5db;     /* Form borders */
--color-gray-400: #9ca3af;     /* Placeholder text */
--color-gray-500: #6b7280;     /* Secondary text */
--color-gray-600: #4b5563;     /* Body text */
--color-gray-700: #374151;     /* Emphasized text */
--color-gray-800: #1f2937;     /* Headings */
--color-gray-900: #111827;     /* Primary text */
--color-gray-950: #030712;     /* Maximum contrast */
```

### **Business Intelligence Colors**

#### **Status Communication Palette**
```css
/* Success - Professional Green */
--color-success-50: #f0fdf4;
--color-success-100: #dcfce7;
--color-success-500: #22c55e;   /* Completed, approved, positive trends */
--color-success-600: #16a34a;
--color-success-700: #15803d;

/* Warning - Executive Orange */
--color-warning-50: #fffbeb;
--color-warning-100: #fef3c7;
--color-warning-500: #f59e0b;   /* Attention needed, pending review */
--color-warning-600: #d97706;
--color-warning-700: #b45309;

/* Critical - Professional Red */
--color-critical-50: #fef2f2;
--color-critical-100: #fee2e2;
--color-critical-500: #ef4444;  /* Urgent, blocked, critical issues */
--color-critical-600: #dc2626;
--color-critical-700: #b91c1c;

/* Information - Trustworthy Blue */
--color-info-50: #eff6ff;
--color-info-100: #dbeafe;
--color-info-500: #3b82f6;     /* Informational, in progress */
--color-info-600: #2563eb;
--color-info-700: #1d4ed8;
```

#### **AI & Intelligence Colors**
```css
/* AI Features - Sophisticated Purple */
--color-ai-50: #faf5ff;
--color-ai-100: #f3e8ff;
--color-ai-500: #a855f7;       /* AI suggestions, generated content */
--color-ai-600: #9333ea;
--color-ai-700: #7c3aed;

/* Analytics - Deep Teal */
--color-analytics-50: #f0fdfa;
--color-analytics-100: #ccfbf1;
--color-analytics-500: #14b8a6; /* Charts, data visualization */
--color-analytics-600: #0d9488;
--color-analytics-700: #0f766e;
```

### **Department Color Coding**

#### **Subtle Department Identification**
```css
/* Subtle color coding for department identification */
--color-dept-engineering: #3b82f6;    /* Blue */
--color-dept-design: #8b5cf6;         /* Purple */
--color-dept-marketing: #f59e0b;      /* Orange */
--color-dept-sales: #22c55e;          /* Green */
--color-dept-operations: #6b7280;     /* Gray */
--color-dept-executive: #1f2937;      /* Dark Gray */
```

### **Color Usage Guidelines**

#### **Executive Dashboard Colors**
- **Key Metrics**: Primary blue for positive indicators
- **Trend Arrows**: Green (up), red (down), gray (stable)
- **Status Indicators**: Success, warning, critical, info colors
- **Department Tags**: Subtle department colors with 10% opacity backgrounds

#### **Collaboration Colors**
- **Voting**: Primary blue for upvotes, gray for downvotes
- **Comments**: Gray for standard, blue for @mentions
- **AI Suggestions**: Purple accent for AI-generated content
- **Executive Actions**: Slightly darker primary for executive-only actions

---

## 📝 **EXECUTIVE TYPOGRAPHY SYSTEM**

### **Typography Hierarchy for Business Intelligence**

#### **Executive Dashboard Typography**
```css
/* Executive Page Title */
.executive-title {
  font-size: 2.25rem;    /* 36px */
  line-height: 2.5rem;   /* 40px */
  font-weight: 700;      /* Bold */
  color: var(--color-gray-900);
  letter-spacing: -0.025em;
}

/* Key Metric Numbers */
.metric-value {
  font-size: 3rem;       /* 48px */
  line-height: 1;        /* Tight */
  font-weight: 800;      /* Extra bold */
  color: var(--color-gray-900);
  font-variant-numeric: tabular-nums;
}

/* Metric Labels */
.metric-label {
  font-size: 0.875rem;   /* 14px */
  line-height: 1.25rem;  /* 20px */
  font-weight: 500;      /* Medium */
  color: var(--color-gray-600);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

/* Section Headers */
.section-header {
  font-size: 1.5rem;     /* 24px */
  line-height: 2rem;     /* 32px */
  font-weight: 600;      /* Semibold */
  color: var(--color-gray-900);
  margin-bottom: 1rem;   /* 16px */
}

/* Card Titles */
.card-title {
  font-size: 1.125rem;   /* 18px */
  line-height: 1.75rem;  /* 28px */
  font-weight: 600;      /* Semibold */
  color: var(--color-gray-900);
}

/* Body Text for Business Content */
.business-text {
  font-size: 0.875rem;   /* 14px */
  line-height: 1.5rem;   /* 24px */
  font-weight: 400;      /* Normal */
  color: var(--color-gray-700);
}

/* Supporting Text */
.supporting-text {
  font-size: 0.75rem;    /* 12px */
  line-height: 1.25rem;  /* 20px */
  font-weight: 400;      /* Normal */
  color: var(--color-gray-500);
}
```

#### **AI Content Typography**
```css
/* AI-Generated Content Styling */
.ai-content {
  font-family: inherit;
  font-style: normal;
  position: relative;
}

.ai-content::before {
  content: "✨";
  position: absolute;
  left: -1.5rem;
  color: var(--color-ai-500);
  font-size: 0.75rem;
}

/* AI Confidence Indicators */
.ai-confidence-high {
  border-left: 3px solid var(--color-success-500);
  padding-left: 0.75rem;
}

.ai-confidence-medium {
  border-left: 3px solid var(--color-warning-500);
  padding-left: 0.75rem;
}

.ai-confidence-low {
  border-left: 3px solid var(--color-gray-400);
  padding-left: 0.75rem;
}
```

### **Typography Usage Patterns**

#### **Executive Dashboard Hierarchy**
```html
<!-- Page structure for executive dashboards -->
<h1 class="executive-title">Organizational Intelligence Dashboard</h1>

<div class="metrics-section">
  <div class="metric-card">
    <div class="metric-value">24</div>
    <div class="metric-label">Active Inputs</div>
  </div>
</div>

<section>
  <h2 class="section-header">Recent Activity</h2>
  <div class="activity-list">
    <div class="activity-item">
      <h3 class="card-title">Network Infrastructure Issues</h3>
      <p class="business-text">Multiple reports of connectivity problems...</p>
      <p class="supporting-text">Created 2 hours ago • Engineering Department</p>
    </div>
  </div>
</section>
```

---

## 📐 **EXECUTIVE LAYOUT PATTERNS**

### **Dashboard Layout Architecture**

#### **Executive Dashboard Structure**
```css
/* Executive dashboard grid */
.executive-dashboard {
  display: grid;
  gap: 1.5rem;
  grid-template-areas:
    "header header header"
    "metrics metrics metrics"
    "trends activity priority"
    "details details details";
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: auto auto auto 1fr;
}

.dashboard-header { grid-area: header; }
.dashboard-metrics { grid-area: metrics; }
.dashboard-trends { grid-area: trends; }
.dashboard-activity { grid-area: activity; }
.dashboard-priority { grid-area: priority; }
.dashboard-details { grid-area: details; }

/* Responsive dashboard */
@media (max-width: 1023px) {
  .executive-dashboard {
    grid-template-areas:
      "header"
      "metrics"
      "priority"
      "activity"
      "trends"
      "details";
    grid-template-columns: 1fr;
  }
}
```

#### **Card-Based Information Architecture**
```css
/* Executive information cards */
.executive-card {
  background: white;
  border: 1px solid var(--color-gray-200);
  border-radius: 0.75rem;  /* 12px - slightly more sophisticated */
  box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
  overflow: hidden;
  transition: box-shadow 200ms ease;
}

.executive-card:hover {
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
}

/* Card header with status indicator */
.card-header-executive {
  padding: 1rem 1.5rem;
  border-bottom: 1px solid var(--color-gray-200);
  background: var(--color-gray-25);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.card-status-indicator {
  width: 0.75rem;
  height: 0.75rem;
  border-radius: 50%;
  flex-shrink: 0;
}
```

### **Input & Solution Display Patterns**

#### **Input Card for Executive Scanning**
```css
/* Optimized input card for executive review */
.input-card-executive {
  display: grid;
  grid-template-areas:
    "status title actions"
    "meta description votes"
    "tags tags engagement";
  grid-template-columns: auto 1fr auto;
  gap: 0.75rem;
  padding: 1.25rem;
  background: white;
  border: 1px solid var(--color-gray-200);
  border-radius: 0.75rem;
}

.input-status { grid-area: status; }
.input-title { grid-area: title; }
.input-actions { grid-area: actions; }
.input-meta { grid-area: meta; }
.input-description { grid-area: description; }
.input-votes { grid-area: votes; }
.input-tags { grid-area: tags; }
.input-engagement { grid-area: engagement; }

/* Mobile adaptation */
@media (max-width: 767px) {
  .input-card-executive {
    grid-template-areas:
      "status title"
      "description description"
      "tags votes"
      "meta actions";
    grid-template-columns: auto 1fr;
  }
}
```

#### **Executive Action Patterns**
```css
/* Executive-specific action buttons */
.executive-actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.executive-action-primary {
  background: var(--color-primary-600);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  font-weight: 500;
  font-size: 0.875rem;
  border: none;
  cursor: pointer;
  transition: all 150ms ease;
}

.executive-action-secondary {
  background: white;
  color: var(--color-gray-700);
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  font-weight: 500;
  font-size: 0.875rem;
  border: 1px solid var(--color-gray-300);
  cursor: pointer;
  transition: all 150ms ease;
}

/* Quick action buttons for mobile */
.quick-action-mobile {
  background: var(--color-primary-600);
  color: white;
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgb(59 130 246 / 0.4);
  position: fixed;
  bottom: 1.5rem;
  right: 1.5rem;
  z-index: 50;
}
```

---

## 📊 **DATA VISUALIZATION STANDARDS**

### **Executive Metrics Display**

#### **Key Performance Indicator Cards**
```css
/* Executive KPI card styling */
.kpi-card {
  background: white;
  padding: 2rem;
  border-radius: 0.75rem;
  border: 1px solid var(--color-gray-200);
  text-align: center;
  position: relative;
  overflow: hidden;
}

.kpi-value {
  font-size: 3rem;       /* 48px */
  line-height: 1;
  font-weight: 800;
  color: var(--color-gray-900);
  font-variant-numeric: tabular-nums;
  margin-bottom: 0.5rem;
}

.kpi-label {
  font-size: 0.875rem;   /* 14px */
  font-weight: 600;
  color: var(--color-gray-600);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: 0.75rem;
}

.kpi-trend {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.25rem;
  font-size: 0.75rem;
  font-weight: 500;
}

.kpi-trend-positive {
  color: var(--color-success-600);
}

.kpi-trend-negative {
  color: var(--color-critical-600);
}

.kpi-trend-neutral {
  color: var(--color-gray-500);
}
```

#### **Progress Indicators for Solutions**
```css
/* Solution progress visualization */
.solution-progress {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.progress-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.progress-title {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--color-gray-700);
}

.progress-percentage {
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--color-gray-900);
  font-variant-numeric: tabular-nums;
}

.progress-bar-executive {
  width: 100%;
  height: 0.75rem;      /* 12px - larger for executive visibility */
  background: var(--color-gray-200);
  border-radius: 9999px;
  overflow: hidden;
  position: relative;
}

.progress-fill-executive {
  height: 100%;
  background: linear-gradient(90deg, var(--color-primary-500), var(--color-primary-600));
  border-radius: 9999px;
  transition: width 500ms ease;
  position: relative;
}

/* Progress status variants */
.progress-completed .progress-fill-executive {
  background: linear-gradient(90deg, var(--color-success-500), var(--color-success-600));
}

.progress-blocked .progress-fill-executive {
  background: linear-gradient(90deg, var(--color-critical-500), var(--color-critical-600));
}
```

### **Chart & Graph Standards**

#### **Executive Chart Color Palette**
```css
/* Data visualization color sequence */
:root {
  --chart-color-1: #3b82f6;  /* Primary blue */
  --chart-color-2: #22c55e;  /* Success green */
  --chart-color-3: #f59e0b;  /* Warning orange */
  --chart-color-4: #a855f7;  /* AI purple */
  --chart-color-5: #14b8a6;  /* Analytics teal */
  --chart-color-6: #ef4444;  /* Critical red */
  --chart-color-7: #6b7280;  /* Neutral gray */
  --chart-color-8: #8b5cf6;  /* Secondary purple */
}

/* Chart background and grid */
.chart-background {
  background: white;
  border: 1px solid var(--color-gray-200);
  border-radius: 0.75rem;
}

.chart-grid-lines {
  stroke: var(--color-gray-200);
  stroke-width: 1;
}

.chart-axis-labels {
  font-size: 0.75rem;
  fill: var(--color-gray-500);
  font-weight: 500;
}
```

---

## 🧭 **EXECUTIVE NAVIGATION PATTERNS**

### **Primary Navigation for Executive Users**

#### **Sidebar Navigation Structure**
```css
/* Executive-optimized sidebar */
.sidebar-executive {
  width: 18rem;          /* 288px - wider for better readability */
  background: white;
  border-right: 1px solid var(--color-gray-200);
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
  display: flex;
  flex-direction: column;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 40;
}

/* Executive user profile section */
.sidebar-user-profile {
  padding: 1.5rem;
  border-bottom: 1px solid var(--color-gray-200);
  background: var(--color-gray-25);
}

.user-profile-executive {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.user-avatar-executive {
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  background: var(--color-primary-600);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 1.125rem;
}

.user-info-executive {
  flex: 1;
}

.user-name-executive {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--color-gray-900);
  margin-bottom: 0.125rem;
}

.user-role-executive {
  font-size: 0.75rem;
  color: var(--color-gray-600);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
```

#### **Navigation Menu Patterns**
```css
/* Executive navigation sections */
.nav-section-executive {
  padding: 1rem 0.75rem;
}

.nav-section-title {
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--color-gray-500);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: 0.5rem;
  padding: 0 0.5rem;
}

/* Navigation items optimized for executive scanning */
.nav-item-executive {
  display: flex;
  align-items: center;
  padding: 0.75rem 0.75rem;
  margin: 0.125rem 0;
  border-radius: 0.5rem;
  color: var(--color-gray-700);
  text-decoration: none;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 150ms ease;
  position: relative;
}

.nav-item-executive:hover {
  background: var(--color-gray-100);
  color: var(--color-gray-900);
}

.nav-item-executive.active {
  background: var(--color-primary-50);
  color: var(--color-primary-700);
  border-right: 3px solid var(--color-primary-600);
}

/* Navigation icons */
.nav-icon-executive {
  width: 1.25rem;
  height: 1.25rem;
  margin-right: 0.75rem;
  flex-shrink: 0;
}

/* Notification badges on navigation */
.nav-badge {
  background: var(--color-critical-500);
  color: white;
  font-size: 0.625rem;
  font-weight: 600;
  padding: 0.125rem 0.375rem;
  border-radius: 9999px;
  margin-left: auto;
}
```

### **Breadcrumb Navigation for Context**

#### **Executive Breadcrumb Pattern**
```css
.breadcrumb-executive {
  display: flex;
  align-items: center;
  padding: 1rem 0;
  font-size: 0.875rem;
  color: var(--color-gray-500);
}

.breadcrumb-item-executive {
  display: flex;
  align-items: center;
}

.breadcrumb-item-executive:not(:last-child)::after {
  content: "›";
  margin: 0 0.75rem;
  color: var(--color-gray-400);
  font-weight: 600;
}

.breadcrumb-link-executive {
  color: var(--color-gray-600);
  text-decoration: none;
  transition: color 150ms ease;
  font-weight: 500;
}

.breadcrumb-link-executive:hover {
  color: var(--color-primary-600);
}

.breadcrumb-current-executive {
  color: var(--color-gray-900);
  font-weight: 600;
}
```

---

## 🎛️ **INTERACTIVE ELEMENTS FOR EXECUTIVES**

### **Executive Button System**

#### **Primary Action Buttons**
```css
/* Executive primary button - larger, more prominent */
.btn-executive-primary {
  background: var(--color-primary-600);
  color: white;
  padding: 0.75rem 1.5rem;  /* 12px 24px - larger for executive use */
  border-radius: 0.5rem;    /* 8px */
  font-weight: 600;
  font-size: 0.875rem;
  border: none;
  cursor: pointer;
  transition: all 200ms ease;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  min-height: 2.75rem;      /* 44px - touch-friendly */
}

.btn-executive-primary:hover {
  background: var(--color-primary-700);
  transform: translateY(-1px);
  box-shadow: 0 8px 25px rgb(59 130 246 / 0.2);
}

.btn-executive-primary:active {
  transform: translateY(0);
}

/* Executive approval button */
.btn-executive-approve {
  background: var(--color-success-600);
  color: white;
  /* Same structure as primary */
}

.btn-executive-approve:hover {
  background: var(--color-success-700);
  box-shadow: 0 8px 25px rgb(34 197 94 / 0.2);
}

/* Executive reject button */
.btn-executive-reject {
  background: var(--color-critical-600);
  color: white;
  /* Same structure as primary */
}
```

#### **Quick Action Buttons**
```css
/* Quick actions for executive efficiency */
.quick-action-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(8rem, 1fr));
  gap: 0.75rem;
  margin: 1rem 0;
}

.quick-action-btn {
  background: white;
  border: 1px solid var(--color-gray-300);
  border-radius: 0.5rem;
  padding: 1rem;
  text-align: center;
  cursor: pointer;
  transition: all 150ms ease;
  min-height: 4rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.25rem;
}

.quick-action-btn:hover {
  border-color: var(--color-primary-500);
  background: var(--color-primary-50);
  transform: translateY(-2px);
}

.quick-action-icon {
  width: 1.5rem;
  height: 1.5rem;
  color: var(--color-gray-600);
}

.quick-action-label {
  font-size: 0.75rem;
  font-weight: 500;
  color: var(--color-gray-700);
}
```

### **Voting & Collaboration for Executives**

#### **Executive Voting Interface**
```css
/* Voting interface optimized for executive use */
.voting-executive {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: var(--color-gray-50);
  padding: 0.5rem;
  border-radius: 0.5rem;
  border: 1px solid var(--color-gray-200);
}

.vote-btn-executive {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 0.375rem;
  border: 1px solid var(--color-gray-300);
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 150ms ease;
}

.vote-btn-executive:hover {
  background: var(--color-gray-100);
  border-color: var(--color-gray-400);
}

.vote-btn-executive.voted-up {
  background: var(--color-primary-600);
  border-color: var(--color-primary-600);
  color: white;
}

.vote-btn-executive.voted-down {
  background: var(--color-gray-600);
  border-color: var(--color-gray-600);
  color: white;
}

.vote-count-executive {
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--color-gray-900);
  font-variant-numeric: tabular-nums;
  min-width: 2rem;
  text-align: center;
}
```

#### **Comment System for Executive Collaboration**
```css
/* Executive comment interface */
.comment-executive {
  background: white;
  border: 1px solid var(--color-gray-200);
  border-radius: 0.5rem;
  padding: 1rem;
  margin: 0.75rem 0;
}

.comment-header-executive {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.75rem;
}

.comment-author-executive {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.comment-avatar-executive {
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  background: var(--color-gray-600);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 600;
}

.comment-author-name {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--color-gray-900);
}

.comment-author-role {
  font-size: 0.75rem;
  color: var(--color-gray-500);
  background: var(--color-gray-100);
  padding: 0.125rem 0.375rem;
  border-radius: 0.25rem;
}

.comment-timestamp {
  font-size: 0.75rem;
  color: var(--color-gray-500);
}

.comment-content-executive {
  font-size: 0.875rem;
  line-height: 1.5;
  color: var(--color-gray-700);
}
```

---

## 📱 **MOBILE EXECUTIVE PATTERNS**

### **Mobile Dashboard for Executives**

#### **Mobile Executive Dashboard**
```css
/* Mobile-first executive dashboard */
.mobile-executive-dashboard {
  padding: 1rem;
  background: var(--color-gray-50);
  min-height: 100vh;
}

/* Mobile metric cards - stacked layout */
.mobile-metrics {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}

.mobile-metric-card {
  background: white;
  padding: 1.25rem 1rem;
  border-radius: 0.75rem;
  border: 1px solid var(--color-gray-200);
  text-align: center;
}

.mobile-metric-value {
  font-size: 1.875rem;   /* 30px */
  line-height: 1;
  font-weight: 800;
  color: var(--color-gray-900);
  margin-bottom: 0.25rem;
}

.mobile-metric-label {
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--color-gray-600);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
```

#### **Mobile Input Capture**
```css
/* Streamlined mobile input creation */
.mobile-input-capture {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: white;
  border-top: 1px solid var(--color-gray-200);
  border-radius: 1rem 1rem 0 0;
  padding: 1.5rem 1rem 2rem;
  transform: translateY(100%);
  transition: transform 300ms ease;
  z-index: 50;
}

.mobile-input-capture.open {
  transform: translateY(0);
}

.mobile-input-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.mobile-input-title {
  font-size: 1rem;
  padding: 0.75rem;
  border: 1px solid var(--color-gray-300);
  border-radius: 0.5rem;
  background: white;
}

.mobile-input-description {
  font-size: 1rem;
  padding: 0.75rem;
  border: 1px solid var(--color-gray-300);
  border-radius: 0.5rem;
  min-height: 4rem;
  resize: vertical;
}

/* Mobile action buttons */
.mobile-action-row {
  display: flex;
  gap: 0.75rem;
  margin-top: 1rem;
}

.mobile-btn-cancel {
  flex: 1;
  padding: 0.875rem;
  background: var(--color-gray-100);
  color: var(--color-gray-700);
  border: 1px solid var(--color-gray-300);
  border-radius: 0.5rem;
  font-weight: 500;
}

.mobile-btn-submit {
  flex: 2;
  padding: 0.875rem;
  background: var(--color-primary-600);
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-weight: 600;
}
```

---

## 🤖 **AI FEATURE DESIGN PATTERNS**

### **AI Suggestion Interface**

#### **AI Confidence Communication**
```css
/* AI suggestion container */
.ai-suggestion {
  background: var(--color-ai-50);
  border: 1px solid var(--color-ai-200);
  border-radius: 0.5rem;
  padding: 1rem;
  margin: 0.75rem 0;
  position: relative;
}

.ai-suggestion::before {
  content: "✨ AI Suggestion";
  position: absolute;
  top: -0.5rem;
  left: 1rem;
  background: var(--color-ai-500);
  color: white;
  font-size: 0.625rem;
  font-weight: 600;
  padding: 0.125rem 0.5rem;
  border-radius: 0.25rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

/* Confidence indicator */
.ai-confidence {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.ai-confidence-bar {
  flex: 1;
  height: 0.25rem;
  background: var(--color-gray-200);
  border-radius: 9999px;
  overflow: hidden;
}

.ai-confidence-fill {
  height: 100%;
  border-radius: 9999px;
  transition: width 300ms ease;
}

.ai-confidence-high .ai-confidence-fill {
  width: 90%;
  background: var(--color-success-500);
}

.ai-confidence-medium .ai-confidence-fill {
  width: 70%;
  background: var(--color-warning-500);
}

.ai-confidence-low .ai-confidence-fill {
  width: 40%;
  background: var(--color-gray-400);
}

.ai-confidence-label {
  font-size: 0.75rem;
  font-weight: 500;
  color: var(--color-gray-600);
}
```

#### **AI Processing States**
```css
/* AI processing indicator */
.ai-processing {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  background: var(--color-ai-50);
  border: 1px solid var(--color-ai-200);
  border-radius: 0.5rem;
  margin: 1rem 0;
}

.ai-processing-spinner {
  width: 1.5rem;
  height: 1.5rem;
  border: 2px solid var(--color-ai-200);
  border-top: 2px solid var(--color-ai-600);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.ai-processing-text {
  font-size: 0.875rem;
  color: var(--color-ai-700);
  font-weight: 500;
}

/* AI generated content indicator */
.ai-generated {
  position: relative;
  padding-left: 1.5rem;
}

.ai-generated::before {
  content: "✨";
  position: absolute;
  left: 0;
  top: 0;
  color: var(--color-ai-500);
  font-size: 1rem;
}
```

### **Document Generation Interface**

#### **FRD Generation Progress**
```css
/* Document generation interface */
.document-generation {
  background: white;
  border: 1px solid var(--color-gray-200);
  border-radius: 0.75rem;
  padding: 2rem;
  text-align: center;
  max-width: 32rem;
  margin: 2rem auto;
}

.document-generation-icon {
  width: 4rem;
  height: 4rem;
  background: var(--color-ai-100);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem;
}

.document-generation-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--color-gray-900);
  margin-bottom: 0.5rem;
}

.document-generation-progress {
  width: 100%;
  height: 0.5rem;
  background: var(--color-gray-200);
  border-radius: 9999px;
  overflow: hidden;
  margin: 1rem 0;
}

.document-generation-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--color-ai-500), var(--color-ai-600));
  border-radius: 9999px;
  transition: width 500ms ease;
}

.document-generation-status {
  font-size: 0.875rem;
  color: var(--color-gray-600);
  margin-bottom: 1.5rem;
}
```

---

## 📊 **STATUS & WORKFLOW VISUALIZATION**

### **Workflow Status Indicators**

#### **Status Badge System**
```css
/* Executive status badges with enhanced visibility */
.status-badge-executive {
  display: inline-flex;
  align-items: center;
  padding: 0.375rem 0.75rem;  /* 6px 12px - larger for executive visibility */
  font-size: 0.75rem;
  font-weight: 600;
  border-radius: 9999px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border: 1px solid transparent;
}

/* Status variants */
.status-new {
  background: var(--color-gray-100);
  color: var(--color-gray-700);
  border-color: var(--color-gray-200);
}

.status-discussing {
  background: var(--color-info-100);
  color: var(--color-info-700);
  border-color: var(--color-info-200);
}

.status-organized {
  background: var(--color-warning-100);
  color: var(--color-warning-700);
  border-color: var(--color-warning-200);
}

.status-in-solution {
  background: var(--color-primary-100);
  color: var(--color-primary-700);
  border-color: var(--color-primary-200);
}

.status-completed {
  background: var(--color-success-100);
  color: var(--color-success-700);
  border-color: var(--color-success-200);
}

/* Status with icons */
.status-badge-executive::before {
  content: "";
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 50%;
  margin-right: 0.375rem;
  background: currentColor;
}
```

#### **Workflow Progress Visualization**
```css
/* Executive workflow progress indicator */
.workflow-progress {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem;
  background: white;
  border: 1px solid var(--color-gray-200);
  border-radius: 0.5rem;
  margin: 1rem 0;
}

.workflow-step {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  position: relative;
}

.workflow-step:not(:last-child)::after {
  content: "";
  position: absolute;
  top: 1rem;
  right: -50%;
  width: 100%;
  height: 2px;
  background: var(--color-gray-200);
  z-index: 1;
}

.workflow-step.completed::after {
  background: var(--color-success-500);
}

.workflow-step-icon {
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  background: var(--color-gray-200);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 0.5rem;
  z-index: 2;
  position: relative;
}

.workflow-step.completed .workflow-step-icon {
  background: var(--color-success-500);
  color: white;
}

.workflow-step.current .workflow-step-icon {
  background: var(--color-primary-600);
  color: white;
}

.workflow-step-label {
  font-size: 0.75rem;
  font-weight: 500;
  color: var(--color-gray-600);
  text-align: center;
}

.workflow-step.completed .workflow-step-label {
  color: var(--color-success-600);
}

.workflow-step.current .workflow-step-label {
  color: var(--color-primary-600);
  font-weight: 600;
}
```

---

## 🏗️ **EXECUTIVE DASHBOARD PATTERNS**

### **Dashboard Layout Architecture**

#### **Executive Dashboard Grid**
```css
/* Executive dashboard optimized for information consumption */
.executive-dashboard {
  display: grid;
  gap: 1.5rem;
  padding: 1.5rem;
  background: var(--color-gray-50);
  min-height: 100vh;
}

/* Desktop layout */
@media (min-width: 1024px) {
  .executive-dashboard {
    grid-template-areas:
      "header header header header"
      "metrics metrics metrics metrics"
      "trends activity priority alerts"
      "details details details details";
    grid-template-columns: 1fr 1fr 1fr 1fr;
    grid-template-rows: auto auto auto 1fr;
    padding: 2rem;
  }
}

/* Tablet layout */
@media (min-width: 768px) and (max-width: 1023px) {
  .executive-dashboard {
    grid-template-areas:
      "header header"
      "metrics metrics"
      "trends activity"
      "priority alerts"
      "details details";
    grid-template-columns: 1fr 1fr;
  }
}

/* Mobile layout */
@media (max-width: 767px) {
  .executive-dashboard {
    grid-template-areas:
      "header"
      "metrics"
      "priority"
      "activity"
      "trends"
      "alerts"
      "details";
    grid-template-columns: 1fr;
    gap: 1rem;
    padding: 1rem;
  }
}
```

#### **Dashboard Section Styling**
```css
.dashboard-section {
  background: white;
  border: 1px solid var(--color-gray-200);
  border-radius: 0.75rem;
  overflow: hidden;
}

.dashboard-section-header {
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid var(--color-gray-200);
  background: var(--color-gray-25);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.dashboard-section-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--color-gray-900);
}

.dashboard-section-action {
  font-size: 0.875rem;
  color: var(--color-primary-600);
  text-decoration: none;
  font-weight: 500;
}

.dashboard-section-content {
  padding: 1.5rem;
}
```

### **Executive Alert & Priority Patterns**

#### **Priority Queue Interface**
```css
/* Executive priority queue */
.priority-queue {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.priority-item {
  background: white;
  border: 1px solid var(--color-gray-200);
  border-left: 4px solid var(--color-gray-300);
  border-radius: 0 0.5rem 0.5rem 0;
  padding: 1rem;
  transition: all 150ms ease;
}

.priority-item:hover {
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
}

.priority-item.high-priority {
  border-left-color: var(--color-critical-500);
}

.priority-item.medium-priority {
  border-left-color: var(--color-warning-500);
}

.priority-item.low-priority {
  border-left-color: var(--color-success-500);
}

.priority-item-header {
  display: flex;
  align-items: center;
  justify-content: between;
  margin-bottom: 0.5rem;
}

.priority-item-title {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--color-gray-900);
  flex: 1;
}

.priority-item-actions {
  display: flex;
  gap: 0.5rem;
}

.priority-action-btn {
  padding: 0.25rem 0.5rem;
  font-size: 0.75rem;
  font-weight: 500;
  border-radius: 0.25rem;
  border: 1px solid var(--color-gray-300);
  background: white;
  cursor: pointer;
  transition: all 150ms ease;
}

.priority-action-approve {
  background: var(--color-success-600);
  color: white;
  border-color: var(--color-success-600);
}

.priority-action-defer {
  background: var(--color-warning-600);
  color: white;
  border-color: var(--color-warning-600);
}
```

---

## 📋 **FORM PATTERNS FOR EXECUTIVES**

### **Executive Form Design**

#### **Requirements Creation Form**
```css
/* Executive requirements form */
.executive-form {
  background: white;
  border: 1px solid var(--color-gray-200);
  border-radius: 0.75rem;
  padding: 2rem;
  max-width: 48rem;
  margin: 0 auto;
}

.executive-form-header {
  text-align: center;
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid var(--color-gray-200);
}

.executive-form-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--color-gray-900);
  margin-bottom: 0.5rem;
}

.executive-form-description {
  font-size: 0.875rem;
  color: var(--color-gray-600);
}

/* Form sections */
.executive-form-section {
  margin-bottom: 2rem;
}

.executive-form-section-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--color-gray-900);
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.executive-form-section-icon {
  width: 1.25rem;
  height: 1.25rem;
  color: var(--color-primary-600);
}

/* Executive form controls */
.executive-input {
  width: 100%;
  padding: 0.875rem 1rem;   /* 14px 16px - larger for executive use */
  border: 1px solid var(--color-gray-300);
  border-radius: 0.5rem;
  font-size: 1rem;          /* 16px - larger for readability */
  line-height: 1.5rem;
  transition: all 150ms ease;
  background: white;
}

.executive-input:focus {
  outline: none;
  border-color: var(--color-primary-500);
  box-shadow: 0 0 0 3px rgb(59 130 246 / 0.1);
}

.executive-textarea {
  min-height: 8rem;         /* 128px - adequate space for executive content */
  resize: vertical;
  font-family: inherit;
}

.executive-select {
  background-image: url("data:image/svg+xml,..."); /* Custom dropdown arrow */
  background-repeat: no-repeat;
  background-position: right 0.75rem center;
  padding-right: 2.5rem;
}
```

#### **Form Actions for Executives**
```css
/* Executive form action area */
.executive-form-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 1.5rem;
  border-top: 1px solid var(--color-gray-200);
  gap: 1rem;
}

.executive-form-actions-left {
  display: flex;
  gap: 0.75rem;
}

.executive-form-actions-right {
  display: flex;
  gap: 0.75rem;
}

/* Save draft button */
.btn-save-draft {
  background: var(--color-gray-100);
  color: var(--color-gray-700);
  border: 1px solid var(--color-gray-300);
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 150ms ease;
}

/* Executive submit button */
.btn-executive-submit {
  background: var(--color-primary-600);
  color: white;
  border: none;
  padding: 0.75rem 2rem;
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 150ms ease;
  min-width: 8rem;
}

.btn-executive-submit:hover {
  background: var(--color-primary-700);
  transform: translateY(-1px);
  box-shadow: 0 8px 25px rgb(59 130 246 / 0.25);
}
```

---

## 📱 **RESPONSIVE EXECUTIVE PATTERNS**

### **Executive Mobile Patterns**

#### **Mobile Executive Navigation**
```css
/* Bottom navigation for executive mobile use */
.mobile-executive-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: white;
  border-top: 1px solid var(--color-gray-200);
  padding: 0.75rem 1rem 1.5rem;
  display: flex;
  justify-content: space-around;
  z-index: 50;
}

.mobile-nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  padding: 0.5rem;
  border-radius: 0.5rem;
  transition: all 150ms ease;
  text-decoration: none;
  min-width: 4rem;
}

.mobile-nav-item:hover {
  background: var(--color-gray-100);
}

.mobile-nav-item.active {
  background: var(--color-primary-100);
  color: var(--color-primary-700);
}

.mobile-nav-icon {
  width: 1.5rem;
  height: 1.5rem;
  color: var(--color-gray-600);
}

.mobile-nav-item.active .mobile-nav-icon {
  color: var(--color-primary-600);
}

.mobile-nav-label {
  font-size: 0.625rem;
  font-weight: 500;
  color: var(--color-gray-600);
}

.mobile-nav-item.active .mobile-nav-label {
  color: var(--color-primary-600);
}

/* Notification badge on navigation */
.mobile-nav-badge {
  position: absolute;
  top: 0.25rem;
  right: 0.25rem;
  background: var(--color-critical-500);
  color: white;
  font-size: 0.625rem;
  font-weight: 600;
  padding: 0.125rem 0.25rem;
  border-radius: 9999px;
  min-width: 1rem;
  height: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
}
```

### **Tablet Executive Interface**

#### **Tablet Split-View Pattern**
```css
/* Tablet split-view for executive efficiency */
.tablet-split-view {
  display: grid;
  grid-template-columns: 24rem 1fr;  /* 384px sidebar, flexible content */
  height: 100vh;
  gap: 1px;
  background: var(--color-gray-200);
}

.tablet-sidebar {
  background: white;
  overflow-y: auto;
  border-right: 1px solid var(--color-gray-200);
}

.tablet-main-content {
  background: white;
  overflow-y: auto;
  padding: 1.5rem;
}

/* Tablet sidebar list */
.tablet-sidebar-list {
  padding: 1rem;
}

.tablet-sidebar-item {
  padding: 1rem;
  border-bottom: 1px solid var(--color-gray-200);
  cursor: pointer;
  transition: background 150ms ease;
}

.tablet-sidebar-item:hover {
  background: var(--color-gray-50);
}

.tablet-sidebar-item.selected {
  background: var(--color-primary-50);
  border-right: 3px solid var(--color-primary-600);
}
```

---

## 🎯 **ACCESSIBILITY FOR EXECUTIVES**

### **Executive Accessibility Enhancements**

#### **High-Contrast Executive Mode**
```css
/* High contrast mode for executive users */
@media (prefers-contrast: high) {
  :root {
    --color-primary-600: #1d4ed8;
    --color-gray-900: #000000;
    --color-gray-100: #f3f4f6;
    --color-gray-200: #d1d5db;
  }
  
  .executive-card {
    border-width: 2px;
  }
  
  .status-badge-executive {
    border-width: 2px;
    font-weight: 700;
  }
}
```

#### **Focus Management for Executive Workflows**
```css
/* Enhanced focus indicators for executive interfaces */
.executive-focus {
  transition: box-shadow 150ms ease;
}

.executive-focus:focus {
  outline: none;
  box-shadow: 
    0 0 0 3px rgb(59 130 246 / 0.1),
    0 0 0 1px var(--color-primary-600);
}

/* Skip links for executive efficiency */
.executive-skip-link {
  position: absolute;
  top: -3rem;
  left: 1rem;
  background: var(--color-gray-900);
  color: white;
  padding: 0.75rem 1rem;
  border-radius: 0.375rem;
  font-weight: 600;
  text-decoration: none;
  z-index: 1000;
  transition: top 150ms ease;
}

.executive-skip-link:focus {
  top: 1rem;
}
```

### **Screen Reader Optimization**

#### **Executive Content Structure**
```html
<!-- Semantic structure for executive content -->
<main role="main" aria-label="Executive Dashboard">
  <section aria-labelledby="metrics-title">
    <h2 id="metrics-title" class="sr-only">Key Performance Metrics</h2>
    <!-- Metrics content -->
  </section>
  
  <section aria-labelledby="priority-title">
    <h2 id="priority-title" class="sr-only">Priority Items Requiring Attention</h2>
    <!-- Priority content -->
  </section>
</main>

<!-- ARIA labels for executive actions -->
<button 
  aria-label="Approve solution: Network Infrastructure Upgrade"
  aria-describedby="solution-details"
>
  Approve
</button>

<!-- Status announcements -->
<div aria-live="polite" aria-atomic="true" class="sr-only">
  <span id="status-announcements"></span>
</div>
```

---

## 📊 **DATA VISUALIZATION STANDARDS**

### **Executive Chart Patterns**

#### **Trend Chart Styling**
```css
/* Executive trend charts */
.trend-chart-container {
  background: white;
  border: 1px solid var(--color-gray-200);
  border-radius: 0.75rem;
  padding: 1.5rem;
  position: relative;
}

.trend-chart-header {
  display: flex;
  align-items: center;
  justify-content: between;
  margin-bottom: 1.5rem;
}

.trend-chart-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--color-gray-900);
}

.trend-chart-period {
  font-size: 0.875rem;
  color: var(--color-gray-500);
  background: var(--color-gray-100);
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
}

/* Chart styling */
.trend-line {
  stroke: var(--color-primary-600);
  stroke-width: 3;
  fill: none;
}

.trend-area {
  fill: url(#trendGradient);
  opacity: 0.1;
}

.trend-points {
  fill: var(--color-primary-600);
  stroke: white;
  stroke-width: 2;
  r: 4;
}

.trend-grid {
  stroke: var(--color-gray-200);
  stroke-width: 1;
  stroke-dasharray: 2,2;
}
```

#### **Department Performance Visualization**
```css
/* Department performance comparison */
.department-performance {
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(auto-fit, minmax(12rem, 1fr));
}

.department-card {
  background: white;
  border: 1px solid var(--color-gray-200);
  border-radius: 0.5rem;
  padding: 1.25rem;
  text-align: center;
  position: relative;
  overflow: hidden;
}

.department-card::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 0.25rem;
  background: var(--department-color, var(--color-gray-400));
}

.department-name {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--color-gray-900);
  margin-bottom: 1rem;
}

.department-metrics {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  text-align: center;
}

.department-metric-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-gray-900);
  line-height: 1;
}

.department-metric-label {
  font-size: 0.75rem;
  color: var(--color-gray-600);
  margin-top: 0.25rem;
}
```

---

## ⚡ **PERFORMANCE & ANIMATION STANDARDS**

### **Executive-Appropriate Animations**

#### **Subtle Professional Animations**
```css
/* Sophisticated micro-interactions */
.executive-hover {
  transition: 
    transform 200ms cubic-bezier(0.4, 0, 0.2, 1),
    box-shadow 200ms cubic-bezier(0.4, 0, 0.2, 1);
}

.executive-hover:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgb(0 0 0 / 0.1), 0 4px 10px rgb(0 0 0 / 0.05);
}

/* Status change animations */
.status-change {
  animation: statusPulse 600ms ease-out;
}

@keyframes statusPulse {
  0% { 
    background-color: var(--color-primary-100);
    transform: scale(1);
  }
  50% { 
    background-color: var(--color-primary-200);
    transform: scale(1.02);
  }
  100% { 
    background-color: white;
    transform: scale(1);
  }
}

/* Loading states for executive patience */
.executive-loading {
  position: relative;
  overflow: hidden;
}

.executive-loading::after {
  content: "";
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    var(--color-primary-100),
    transparent
  );
  animation: shimmer 1.5s infinite;
}

@keyframes shimmer {
  100% { left: 100%; }
}
```

### **Performance Optimization for Executive Use**

#### **Critical Performance Patterns**
```css
/* Performance-optimized patterns */
.critical-above-fold {
  /* Styles for above-the-fold content that must load immediately */
  content-visibility: auto;
  contain-intrinsic-size: 0 500px;
}

.lazy-load-content {
  /* Styles for content that can load progressively */
  content-visibility: auto;
  contain-intrinsic-size: 0 200px;
}

/* Executive-optimized image loading */
.executive-image {
  width: 100%;
  height: auto;
  border-radius: 0.5rem;
  transition: opacity 300ms ease;
}

.executive-image[loading="lazy"] {
  opacity: 0;
}

.executive-image.loaded {
  opacity: 1;
}
```

---

## 🛠️ **IMPLEMENTATION GUIDELINES**

### **Next.js + Tailwind Implementation**

#### **Tailwind Configuration for FAEVision**
```javascript
// tailwind.config.js
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          900: '#1e3a8a',
        },
        gray: {
          25: '#fcfcfd',
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
          950: '#030712',
        },
        ai: {
          50: '#faf5ff',
          100: '#f3e8ff',
          500: '#a855f7',
          600: '#9333ea',
          700: '#7c3aed',
        },
        analytics: {
          50: '#f0fdfa',
          100: '#ccfbf1',
          500: '#14b8a6',
          600: '#0d9488',
          700: '#0f766e',
        }
      },
      fontFamily: {
        sans: ['ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'executive-title': ['2.25rem', { lineHeight: '2.5rem', fontWeight: '700' }],
        'metric-value': ['3rem', { lineHeight: '1', fontWeight: '800' }],
        'section-header': ['1.5rem', { lineHeight: '2rem', fontWeight: '600' }],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
      boxShadow: {
        'executive': '0 8px 25px rgb(0 0 0 / 0.1), 0 4px 10px rgb(0 0 0 / 0.05)',
        'executive-hover': '0 12px 35px rgb(0 0 0 / 0.15), 0 6px 15px rgb(0 0 0 / 0.08)',
      }
    }
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
}
```

#### **Component Implementation Pattern**
```typescript
// Example executive component implementation
import React from 'react';
import { cn } from '@/lib/utils';

interface ExecutiveCardProps {
  title: string;
  status: 'new' | 'discussing' | 'organized' | 'in-solution' | 'completed';
  priority: 'low' | 'medium' | 'high';
  department: string;
  voteCount: number;
  commentCount: number;
  aiGenerated?: boolean;
  className?: string;
  children: React.ReactNode;
}

export function ExecutiveCard({
  title,
  status,
  priority,
  department,
  voteCount,
  commentCount,
  aiGenerated = false,
  className,
  children
}: ExecutiveCardProps) {
  const statusColors = {
    new: 'border-gray-300 bg-gray-50',
    discussing: 'border-info-300 bg-info-50',
    organized: 'border-warning-300 bg-warning-50',
    'in-solution': 'border-primary-300 bg-primary-50',
    completed: 'border-success-300 bg-success-50'
  };

  const priorityIndicators = {
    low: 'border-l-success-500',
    medium: 'border-l-warning-500',
    high: 'border-l-critical-500'
  };

  return (
    <div className={cn(
      'executive-card',
      'border-l-4',
      statusColors[status],
      priorityIndicators[priority],
      aiGenerated && 'ai-generated',
      className
    )}>
      <div className="card-header-executive">
        <h3 className="card-title text-lg font-semibold text-gray-900">
          {title}
        </h3>
        <div className="flex items-center gap-2">
          <span className={cn('status-badge-executive', `status-${status}`)}>
            {status}
          </span>
          {aiGenerated && (
            <span className="ai-indicator text-ai-600">✨</span>
          )}
        </div>
      </div>
      
      <div className="card-body p-6">
        {children}
      </div>
      
      <div className="card-footer bg-gray-25 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <span>{department}</span>
            <span>•</span>
            <span>{voteCount} votes</span>
            <span>•</span>
            <span>{commentCount} comments</span>
          </div>
          <div className="voting-executive">
            {/* Voting component */}
          </div>
        </div>
      </div>
    </div>
  );
}
```

---

## 🎯 **DESIGN SYSTEM SUMMARY**

### **Executive-Focused Adaptations**

Our design standards build upon the Universal Design System foundation with specific adaptations for executive users:

#### **✅ Information Architecture**
- **Dashboard-first approach** with overview before details
- **Status-driven navigation** following workflow progression
- **Progressive disclosure** preventing information overload
- **Scannable layouts** optimized for F-pattern reading

#### **✅ Visual Design**
- **Professional color palette** building stakeholder confidence
- **Enhanced typography** for business intelligence display
- **Sophisticated status indicators** for quick comprehension
- **Data visualization** as first-class design elements

#### **✅ Interaction Design**
- **Executive-sized touch targets** (44px minimum)
- **Quick action patterns** for efficiency
- **Mobile executive workflows** for meeting-friendly capture
- **AI transparency** with confidence indicators and override controls

#### **✅ Accessibility & Performance**
- **WCAG 2.1 AA compliance** with executive-specific enhancements
- **High-contrast modes** for various viewing conditions
- **Performance optimization** for executive patience levels
- **Cross-device consistency** maintaining professional appearance

### **Implementation Priorities**

1. **Week 1**: Establish design system foundation and component library
2. **Week 2**: Implement executive dashboard patterns and navigation
3. **Week 3-4**: Build collaboration interfaces and mobile patterns
4. **Week 5-6**: Develop AI feature patterns and data visualization
5. **Week 7-8**: Requirements and approval interface patterns
6. **Week 9-10**: Document generation interfaces and final polish

---

**Document Status**: ✅ **APPROVED FOR IMPLEMENTATION**  
**Design System Foundation**: Universal Design System with Executive Adaptations  
**Team Commitment**: All 11 experts committed to design standard adherence

---

*This document represents the comprehensive design standards for FAEVision MVP, specifically tailored for executive users and approved by unanimous expert team consensus.*
