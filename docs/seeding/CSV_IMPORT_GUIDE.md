# FAEVision Signal Import CSV Template Guide

## 🎯 Expert Team Collaboration

**Database Architect:** Morgan Smith  
**Strategic Consultant:** Marcus Rodriguez  
**AI Architect:** Dr. Priya Patel  
**UX Expert:** Maya Rodriguez  
**Product Manager:** Sarah Chen

---

## 📋 CSV Template Overview

The `signal-import-template.csv` file provides a comprehensive template for importing strategic signals into FAEVision, specifically designed for Architecture & Engineering firms with 150+ employees.

## 🔑 Required Fields

### Core Signal Information

| Field         | Type   | Required | Description                                   | Example                                     |
| ------------- | ------ | -------- | --------------------------------------------- | ------------------------------------------- |
| `title`       | String | Yes      | Brief, executive-friendly title               | "CAD Standards Documentation Gap"           |
| `description` | Text   | Yes      | Detailed description of the issue/opportunity | "The current CAD standards are outdated..." |
| `severity`    | Enum   | Yes      | Business impact level                         | LOW, MEDIUM, HIGH, CRITICAL                 |

### Organizational Context

| Field             | Type   | Required | Description                              | Valid Values                                         |
| ----------------- | ------ | -------- | ---------------------------------------- | ---------------------------------------------------- |
| `department_name` | String | Yes      | Department name (auto-creates if needed) | Architecture, Executive, Field Services, Engineering |
| `team_name`       | String | No       | Team within department                   | Design Team, QC Team, Project Management             |
| `category_name`   | String | No       | Issue category                           | Documentation, Communication, Quality Assurance      |

### Source & Metadata

| Field           | Type   | Required | Description             | Valid Values                        |
| --------------- | ------ | -------- | ----------------------- | ----------------------------------- |
| `source_type`   | String | Yes      | How signal was captured | manual, system, webhook, email      |
| `system_name`   | String | No       | Source system name      | Revit, MS Project, Internal Process |
| `privacy_level` | String | No       | Access level            | public, internal, sensitive         |

### Structured Tagging System

| Field               | Type   | Required | Description               | Format                                        |
| ------------------- | ------ | -------- | ------------------------- | --------------------------------------------- |
| `tags_engineering`  | String | No       | Engineering-specific tags | Comma-separated: "standards,documentation"    |
| `tags_construction` | String | No       | Construction/field tags   | Comma-separated: "coordination,rework"        |
| `tags_quality`      | String | No       | Quality-related tags      | Comma-separated: "accuracy,compliance"        |
| `tags_client`       | String | No       | Client-facing tags        | Comma-separated: "communication,satisfaction" |
| `tags_process`      | String | No       | Process improvement tags  | Comma-separated: "standardization,workflow"   |

### Quantitative Metrics

| Field                   | Type   | Required | Description          | Units            |
| ----------------------- | ------ | -------- | -------------------- | ---------------- |
| `metric_timeline_days`  | Number | No       | Time impact in days  | Positive integer |
| `metric_cost_impact`    | Number | No       | Financial impact     | USD amount       |
| `metric_hours_affected` | Number | No       | Labor hours impacted | Hours            |

### Impact Assessment

| Field                            | Type   | Required | Description                | Range           |
| -------------------------------- | ------ | -------- | -------------------------- | --------------- |
| `impact_schedule_delay`          | Number | No       | Schedule delay in days     | Days            |
| `impact_budget_variance_percent` | String | No       | Budget variance            | "5.0" (percent) |
| `impact_quality_score`           | Number | No       | Quality impact             | 0.0-1.0         |
| `impact_client_satisfaction`     | Number | No       | Client satisfaction impact | 0.0-1.0         |

### Baseline Comparisons

| Field                        | Type   | Required | Description         | Format              |
| ---------------------------- | ------ | -------- | ------------------- | ------------------- |
| `baseline_expected_timeline` | String | No       | Expected timeline   | "5 days", "2 weeks" |
| `baseline_budget_amount`     | String | No       | Expected budget     | "$15,000"           |
| `baseline_quality_target`    | String | No       | Quality expectation | "90% accuracy"      |

### Related Entities

| Field                    | Type   | Required | Description                 | Example                              |
| ------------------------ | ------ | -------- | --------------------------- | ------------------------------------ |
| `entities_vendor`        | String | No       | Related vendors/contractors | "Design Team", "External Consultant" |
| `entities_client`        | String | No       | Client or client type       | "Metro Housing Development"          |
| `entities_project_phase` | String | No       | Project phase affected      | "Design Development", "Construction" |

### User Context

| Field                | Type   | Required | Description         | Format              |
| -------------------- | ------ | -------- | ------------------- | ------------------- |
| `created_by_email`   | String | Yes      | Creator's email     | Valid email address |
| `additional_context` | String | No       | Extra context/notes | Free text           |

---

## 🏗️ A&E Firm Specific Examples

### Department Structure Examples

- **Architecture**: Design teams, QC teams, specifications, coordination
- **Engineering**: Structural, MEP, civil, environmental
- **Executive**: Project management, business development, operations
- **Field Services**: Construction administration, field coordination

### Common Team Names

- Design Team, Design Standards, Quality Control
- Project Management, Specifications Team, Coordination Team
- Field Coordination, Construction Administration
- Training Team, Procurement Team, Data Analytics

### Category Examples

- **Documentation**: Standards, procedures, training materials
- **Communication**: RFIs, coordination, client relations
- **Quality Assurance**: QC processes, compliance, accuracy
- **Coordination**: BIM coordination, team coordination
- **Technology**: Software, mobile access, systems
- **Process Management**: Workflows, approvals, handoffs

### Severity Guidelines

- **CRITICAL**: Immediate business impact, work stoppage, major client issues
- **HIGH**: Significant delays, cost overruns, quality problems
- **MEDIUM**: Process inefficiencies, minor delays, training needs
- **LOW**: Documentation updates, branding consistency, minor improvements

---

## 📊 Sample Data Context

The template includes 15 realistic scenarios covering:

### Engineering & Design Issues

- CAD standards and documentation gaps
- RFI response delays
- Quality control checklist updates
- Structural coordination conflicts
- Material specification updates

### Project Management Challenges

- Change request workflow delays
- Schedule template inconsistencies
- Vendor qualification processes
- Construction administration handoffs

### Technology & Process Improvements

- Field communication technology gaps
- Mobile access limitations
- Permit submittal coordination
- Sustainability reporting compliance

### Business Operations

- Training documentation updates
- Rework tracking inconsistencies
- Client presentation standardization

---

## 🔄 Import Process

### 1. Data Preparation

- Use provided template as starting point
- Ensure all required fields are populated
- Validate email addresses exist in system
- Review severity assignments for consistency

### 2. CSV Formatting

- UTF-8 encoding required
- Standard CSV format with comma separators
- Quote strings containing commas
- No empty rows between data

### 3. Validation Rules

- Department/Team/Category names will auto-create if they don't exist
- Email addresses must belong to existing users
- Severity must be exactly: LOW, MEDIUM, HIGH, or CRITICAL
- Numeric fields must be valid numbers
- Dates in baseline fields can be flexible text format

### 4. AI Processing

After import, signals will be automatically:

- Tagged with enhanced AI analysis
- Analyzed for clustering potential
- Assigned initial confidence scores
- Prepared for executive dashboard display

---

## 🎯 Executive Dashboard Impact

Imported signals will appear in:

- **Strategic Input Pipeline**: Organized by department and severity
- **Hotspot Analysis**: AI-clustered for pattern recognition
- **Decision Matrix**: Prioritized by business impact
- **Performance Metrics**: Contributing to operational insights

---

## ⚠️ Important Notes

### Data Quality

- Consistent naming improves AI clustering
- Detailed descriptions enhance AI analysis
- Proper tagging enables better insights
- Accurate metrics support decision-making

### Security & Privacy

- All imports respect privacy_level settings
- Internal data remains organization-only
- Sensitive data requires appropriate classification
- User permissions apply to imported data

### Performance

- Batch import recommended for large datasets
- AI processing occurs asynchronously after import
- Dashboard updates may take 5-10 minutes
- Real-time clustering triggers automatically

---

## 🔧 Technical Implementation

This CSV template integrates with:

- **Signal Model**: PHQ Vision Standard compliant
- **AI Tagging System**: Enhanced multi-dimensional tagging
- **Clustering Engine**: Hybrid HDBSCAN clustering
- **Executive Dashboard**: Real-time business intelligence

For technical questions or custom import requirements, contact the Database Architect (Morgan Smith) or AI Architect (Dr. Priya Patel).
