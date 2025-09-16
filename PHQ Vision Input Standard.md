# PHQ Vision Input Standard: Detailed Documentation

## Overview

The PHQ Vision Input Standard is a flexible, JSON-based schema designed to capture process-related signals (e.g., symptoms, events, or observations) in a standardized way. It serves as the foundational data model for PHQ Vision, enabling seamless integration from diverse sources while supporting AI-driven analysis, executive planning, and reinforced human learning (RHL).

This standard is optimized for actionable insights without complex setups. It balances simplicity (minimal mandatory fields) with depth (optional extensions), ensuring it's connector-friendly (e.g., for tools like Smartsheet or Deltek) and scalable. Drawing inspiration from industry standards like Elastic Common Schema (ECS), it prioritizes:

-   **Traceability and Ethics**: Built-in fields for privacy, lineage, and deduplication.
-   **AI Readiness**: Structured data for clustering, root cause analysis (RCA), and learning.
-   **Extensibility**: Modular design with linked extensions for planning and RHL, allowing the repository to evolve as a graph of signals → decisions → outcomes.
-   **Industry Potential**: Versioned schema with suggested enums for adoption as an open standard.

The model consists of:

-   **Core Fields**: Mandatory for basic signal capture.
-   **Optional Fields**: Enrich signals for advanced analysis.
-   **Planning Extensions**: Linked (not embedded) for executive workflows like solutions and handoffs.
-   **Learning Extensions**: Linked for RHL, capturing decision paths to train future agents.

All objects include "schema_version" (e.g., "1.0") for evolution. Validation via JSON Schema ensures consistency, with partial population allowed for ease.

## Field Explanations

Each field is described below, including type, requirement, purpose, and how it supports key app functions (e.g., clustering, RCA, planning, RHL).

### Core Fields (Mandatory)

These form the essential backbone for any signal, ensuring every entry is identifiable and analyzable.

-   **input_id** (Type: string)
    -   **Purpose**: Unique identifier (e.g., UUID) for the signal, used for tracking, referencing, and linking to extensions.
    -   **Support for App Functions**: Enables deduplication in clustering; traces chains in RCA and correlations; serves as the key for linking to planning/learning extensions in the repository.
-   **timestamp** (Type: string)
    -   **Purpose**: ISO 8601 format with timezone (e.g., "2025-09-11T10:15:00Z") for when the event occurred.
    -   **Support for App Functions**: Supports time-series clustering (e.g., detect trends); correlates events in RCA; filters outcomes in tracking.
-   **received_at** (Type: string)
    -   **Purpose**: ISO 8601 timestamp for when the signal was ingested (distinguishes from event time).
    -   **Support for App Functions**: Aids in latency analysis for real-time hotspots; useful for debugging connectors and ensuring fresh data in analytics.
-   **source** (Type: object)
    -   **Purpose**: Details the origin. Subfields: type (string, enum: "app/system/person/sensor/api/other"); id (string); system_name (string, optional); details (object, optional).
    -   **Support for App Functions**: Weights reliability in RCA (e.g., sensor \> anecdotal); filters clustering by source; traces data_lineage for ethical audits.
-   **description** (Type: string)
    -   **Purpose**: Narrative text of the signal (Markdown supported).
    -   **Support for App Functions**: Core for NLP-based clustering/embedding; extracts keywords for RCA hints; human-readable for executive review in ideation.
-   **severity** (Type: string)
    -   **Purpose**: Qualitative level (enum: "low/medium/high/critical").
    -   **Support for App Functions**: Prioritizes hotspots in dashboards; escalates in RCA; influences suggestion urgency.
-   **severity_score** (Type: number)
    -   **Purpose**: Numeric mapping (e.g., 1-5) for quantitative analysis.
    -   **Support for App Functions**: Enables scoring in clustering algorithms; correlates with metrics in RCA for impact assessment.

### Optional Fields

These add context and depth, enhancing AI without mandating data from simple sources.

-   **process_context** (Type: object)
    -   **Purpose**: Workflow details. Subfields: process_type (string); process_id (string); step_id (string).
    -   **Support for App Functions**: Filters clustering by type; identifies sequence bottlenecks in RCA; links to initiatives.
-   **department** (Type: string)
    -   **Purpose**: Organizational unit (e.g., "Engineering").
    -   **Support for App Functions**: Enables cross-dept intelligence; refines tagging/clustering.
-   **team** (Type: string)
    -   **Purpose**: Sub-unit (e.g., "Structural Design").
    -   **Support for App Functions**: Granular assignment in tasks; targeted notifications in collaboration.
-   **metrics** (Type: array)
    -   **Purpose**: Quantitative data (e.g., [{"name": "delay", "value": 7, "unit": "days"}]).
    -   **Support for App Functions**: Numerical input for clustering; correlates in RCA.
-   **baseline_metrics** (Type: array)
    -   **Purpose**: Expected/pre-issue values (same structure as metrics).
    -   **Support for App Functions**: Delta calculations in RCA/outcomes; measures ROI in tracking.
-   **impact_estimate** (Type: object)
    -   **Purpose**: Projected effects (e.g., {"financial": 5000}).
    -   **Support for App Functions**: Prioritizes hotspots; informs suggestions and initiative ROI.
-   **related_entities** (Type: array)
    -   **Purpose**: Linked items (e.g., [{"type": "vendor", "id": "VEN-012"}]).
    -   **Support for App Functions**: Builds graphs for RCA; enhances clustering similarity.
-   **attachments** (Type: array)
    -   **Purpose**: Supporting media (e.g., [{"type": "log", "url": "..."}]).
    -   **Support for App Functions**: Multimodal analysis in AI; evidence in reviews.
-   **tags** (Type: object)
    -   **Purpose**: Key-value labels (e.g., {"category": "delay"}).
    -   **Support for App Functions**: Filtering/tagging in clustering; grouping in initiatives.
-   **correlations** (Type: array)
    -   **Purpose**: Links to other signals (e.g., ["issue-123"]).
    -   **Support for App Functions**: Threads RCA; groups in hotspots.
-   **vector_embedding** (Type: array)
    -   **Purpose**: Pre-computed vectors for text/metrics.
    -   **Support for App Functions**: Speeds clustering/search.
-   **confidence** (Type: number)
    -   **Purpose**: Signal reliability (e.g., 0.9).
    -   **Support for App Functions**: Weights in RCA; flags low-confidence for review.
-   **privacy_level** (Type: string)
    -   **Purpose**: Sensitivity (enum: "public/internal/sensitive").
    -   **Support for App Functions**: Ensures ethical handling in AI/learning.
-   **dedupe_key** (Type: string)
    -   **Purpose**: Hash for duplicate detection.
    -   **Support for App Functions**: Cleans repository for accurate analytics.
-   **custom** (Type: object)
    -   **Purpose**: Domain-specific additions.
    -   **Support for App Functions**: Flexibility for connectors/custom AI.
-   **collaboration_metadata** (Type: object)
    -   **Purpose**: Workflow notes (e.g., {"status": "open"}).
    -   **Support for App Functions**: Tracks in ideation/approvals.
-   **data_lineage** (Type: array)
    -   **Purpose**: Processing history (e.g., ["connector:zapier"]).
    -   **Support for App Functions**: Audits for trust/RHL.

### Planning Extensions (Optional, Linked)

Linked via correlations/input_id for modularity.

-   **ideas[]** (Type: array of objects)
    -   **Purpose**: Proposed fixes (e.g., {"idea_id": "IDEA-001", "description": "..."}).
    -   **Support for App Functions**: Seeds ideation hub.
-   **solutions[]** (Type: array of objects)
    -   **Purpose**: Approved ideas (e.g., {"solution_id": "SOL-001"}).
    -   **Support for App Functions**: Groups under initiatives.
-   **requirements[]** (Type: array of objects)
    -   **Purpose**: Directives (e.g., {"req_id": "REQ-001", "type": "strategic"}).
    -   **Support for App Functions**: Guides handoff.
-   **tasks[]** (Type: array of objects)
    -   **Purpose**: Assignments (e.g., {"task_id": "TASK-001", "assignee": "..."}).
    -   **Support for App Functions**: Executive-level planning.
-   **handoff_package** (Type: object)
    -   **Purpose**: Export details (e.g., {"format": "PDF"}).
    -   **Support for App Functions**: Aligns teams.
-   **outcomes[]** (Type: array of objects)
    -   **Purpose**: Results (e.g., {"outcome_id": "OUT-001", "success": true}).
    -   **Support for App Functions**: Measures ROI/tracking.
-   **trend_metadata** (Type: object)
    -   **Purpose**: Pattern insights (e.g., {"category_trend": "down 15%"}).
    -   **Support for App Functions**: Analytics/intelligence.
-   **intelligence_links** (Type: array)
    -   **Purpose**: Cross-references (e.g., ["hotspot:finance"]).
    -   **Support for App Functions**: Leading indicators.
-   **initiative_roi** (Type: object)
    -   **Purpose**: Payback metrics (e.g., {"savings": 42000}).
    -   **Support for App Functions**: Initiative dashboards.

### Learning Extensions (Optional, Linked)

Linked for RHL/agent training.

-   **decision_path** (Type: object)
    -   **Purpose**: Full cycle log (e.g., {"hotspot_id": "...", "final_status": "resolved"}).
    -   **Support for App Functions**: Builds playbooks for agents.
-   **reinforcement_signal** (Type: object)
    -   **Purpose**: Feedback metrics (e.g., {"exec_approval": true, "roi_value": 42000}).
    -   **Support for App Functions**: Trains models via RHL.

## Example

Here's a sample signal (core JSON) for a delay in an A&E project, with linked extensions noted.

```json
{
  "schema_version": "1.0",
  "input_id": "uuid-abc123-def456",
  "timestamp": "2025-09-11T10:15:00Z",
  "received_at": "2025-09-11T10:16:00Z",
  "source": {
    "type": "app",
    "id": "Smartsheet_GreenTower",
    "system_name": "Smartsheet",
    "details": {"version": "API v2"}
  },
  "description": "Design review delayed due to client approvals.",
  "severity": "high",
  "severity_score": 4,
  "metrics": [{"name": "delay", "value": 7, "unit": "days"}],
  "baseline_metrics": [{"name": "expected", "value": 0, "unit": "days"}],
  "impact_estimate": {"financial": 5000},
  "related_entities": [{"type": "client", "id": "CLI-045"}],
  "attachments": [{"type": "screenshot", "url": "..."}],
  "tags": {"category": "delay"},
  "correlations": ["HOT-001"],
  "vector_embedding": [0.123, -0.456],
  "confidence": 0.9,
  "privacy_level": "internal",
  "dedupe_key": "hash-xyz",
  "custom": {"business_impact": "Slippage"},
  "collaboration_metadata": {"status": "open"},
  "data_lineage": ["connector:zapier", "ai:enriched"]
}
```

**  
**

**Linked Planning Example** (Separate object, linked via correlations):

```json
{
  "schema_version": "1.0",
  "linked_input_ids": ["uuid-abc123-def456"],
  "ideas": [{"idea_id": "IDEA-001", "description": "Automate reminders"}],
  "solutions": [{"solution_id": "SOL-001", "initiative": "Feedback Optimization"}],
  "requirements": [{"req_id": "REQ-001", "description": "Fixed clauses"}],
  "tasks": [{"task_id": "TASK-001", "assignee": "Legal"}],
  "handoff_package": {"format": "PDF"},
  "outcomes": [{"outcome_id": "OUT-001", "success": true}],
  "trend_metadata": {"category_trend": "down 15%"},
  "intelligence_links": ["hotspot:finance"],
  "initiative_roi": {"savings": 42000}
}
```

**Linked Learning Example**:

```json
{
  "schema_version": "1.0",
  "linked_input_ids": ["uuid-abc123-def456"],
  "decision_path": {"hotspot_id": "HOT-001", "solutions": ["SOL-001"], "final_status": "resolved"},
  "reinforcement_signal": {"exec_approval": true, "outcome_success": true, "roi_value": 42000}
}
```

This model ensures PHQ Vision is a robust, future-proof standard for executive planning and agent evolution.
