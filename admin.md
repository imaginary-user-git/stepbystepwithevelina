# Admin Portal Product Requirements Document (PRD)
## Step by Step English - Global Administration

### 1. Executive Summary
The Admin Portal is the central nervous system for "Step by Step English." It is designed to manage a high-scale educational ecosystem consisting of hundreds of teachers, thousands of courses, and a global student base. The primary goal is to provide total visibility and granular control over the platform's data, quality, and security.

### 2. User Roles & Permissions (Admin Focus)
- **Super Admin**: Full platform access, including system configuration, financial overviews, and role management.
- **Moderator**: Access to course reviews, user support, and content flagging.
- **Support Staff**: Limited access to user profiles and enrollment issues.

### 3. Key Feature Modules

#### A. Comprehensive User Management
- **Teacher Onboarding**: Verify credentials, approve applications, and manage contractual documents.
- **Role Control**: Dynamically upgrade/downgrade users between Student, Teacher, and Admin roles.
- **Activity Monitoring**: Audit logs to track login patterns, data modifications, and platform usage.
- **Account Moderation**: Ability to ban, suspend, or reset accounts for security or policy violations.

#### B. Global Course Oversight
- **Quality Assurance (QA)**: Review and approve new courses before they go live.
- **Mass Management**: Bulk update course categories, tags, or pricing across the platform.
- **Content Auditing**: Search and review any lesson content (video, text, quizzes) to ensure academic standards.
- **Teacher Performance**: Track which teachers have the highest enrollment and best student ratings.

#### C. Enterprise Analytics & Reporting
- **Platform Health**: Real-time stats on total users, active students, and course completion rates.
- **Growth Metrics**: Monthly and yearly growth charts for user acquisition and retention.
- **Financial Overview**: (Future) Tracking revenue from paid courses and subscription tiers.
- **Heatmaps**: Identify which categories (e.g., Business English vs. Basic Grammar) are trending.

#### D. System Configuration & Security
- **Global Settings**: Manage site-wide announcements, maintenance modes, and featured content.
- **Data Integrity**: Tools to identify and merge duplicate accounts or clean up orphaned data.
- **Security Logs**: Monitor for suspicious activities, such as multiple concurrent logins or brute-force attempts.

### 4. Technical Requirements
- **Responsive Dashboard**: Full functionality on Desktop, Tablet, and Mobile for management on the go.
- **API Performance**: Optimized endpoints for high-volume data retrieval (pagination/filtering).
- **Audit Trails**: Every administrative action must be logged for accountability.

### 5. Success Metrics
- **Moderation Speed**: Average time from course submission to approval.
- **Teacher Retention**: Percentage of active teachers staying on the platform long-term.
- **Platform Stability**: Zero downtime during high-concurrency periods.
