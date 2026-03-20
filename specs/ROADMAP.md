# Warehouse IQ – Product Roadmap

**Integrated user stories and functional specifications by epic.**

Use Obsidian's graph view to explore relationships between stories and specs.

---

## Yard Management
**Epic Tag:** #epic-yard


## Labor Management
**Epic Tag:** #epic-labor

### the-system-to-automatically-detect-workload-imbala

**User Story:** As a warehouse manager, I want the system to automatically detect workload imbalances across regions and suggest moving labor from surplus to deficit areas so that I can improve utilization and service levels.

#### Related Specifications

**[[FS-205]]: Automatic Workload Imbalance Detection and Labor Reassignment Suggestions**

Automatic Workload Imbalance Detection and Labor Reassignment Suggestions
- **Source:** US-10
- **Status:** ✅ Implemented
- **Description:** System automatically detects workload imbalances and suggests moving labor from surplus to deficit areas.
- **Notes:** Implemented in `LaborManagement.jsx` with `REBALANCING_RECS` providing specific reassignment suggestions.

---

### recommended-labor-reassignments-to-consider-each-w

**User Story:** As a warehouse manager, I want recommended labor reassignments to consider each worker’s prior experience in target areas so that reassigned workers can be effective quickly.

#### Related Specifications

**[[FS-206]]: Experience-Aware Labor Reassignment Recommendations**

Experience-Aware Labor Reassignment Recommendations
- **Source:** US-11
- **Status:** ✅ Implemented
- **Description:** Recommended labor reassignments consider each worker's prior experience in target areas to ensure quick effectiveness.
- **Notes:** Implemented in recommendation cards with worker experience levels and target zone fit assessment.

---

### labor-reassignment-recommendations-to-account-for-

**User Story:** As a warehouse manager, I want labor reassignment recommendations to account for expected equipment and automation maintenance schedules so that I do not over‑allocate labor to zones with upcoming downtime..

#### Related Specifications

**[[FS-207]]: Maintenance Schedule Consideration in Reassignments**

Maintenance Schedule Consideration in Reassignments
- **Source:** US-12
- **Status:** ❌ Missing
- **Description:** Labor reassignment recommendations account for expected equipment and automation maintenance schedules to avoid over-allocating to zones with downtime.
- **Notes:** No integration of maintenance data in `REBALANCING_RECS` mock data.


## 3. Plan vs Execution

**[[FS-1310]]: Visual KPI Gauge Display**

Visual KPI Gauge Display
- **Source:** US-90
- **Status:** ⚠️ Partial
- **Description:** KPI cards in handover report support visual formats like gauges with red/yellow/green ranges.
- **Notes:** OTIF has custom SVG gauge; remaining KPI cards (Absenteeism, Labor Planned, Labor Executed) use plain numeric display without gauge visuals.


## Gap Analysis

### Fully Missing (❌) – 8 items

1. **FS-104 – Automatic Photo Capture and Item Detail Extraction (US-4)**
   - Impact: Yard container scanning lacks AI-powered item detail capture
   - Effort: High (requires image processing, AI integration, item database)

2. **FS-207 – Maintenance Schedule Consideration (US-12)**
   - Impact: Labor reassignment suggestions do not account for equipment downtime
   - Effort: Medium (requires maintenance data integration in mock data and recommendation logic)

3. **FS-301 – Dedicated Planned vs Executed Tab (US-13)**
   - Impact: Plan vs Execution screen lacks primary summary view; insights scattered across sub-tabs
   - Effort: High (requires consolidating bar chart data model and variance decomposition logic)

4. **FS-404 – Entity Reference Autocomplete (US-37)**
   - Impact: Natural language queries lack @-prefix autocomplete for entity references
   - Effort: Low (UI enhancement with entity parsing)

5. **FS-503 – MFA Simulation Tab (US-40)**
   - Impact: MFA lacks dedicated simulation space; separate Simulation screen exists but not integrated
   - Effort: Medium (requires refactoring Simulation screen as MFA sub-tab)

6. **FS-809 – Historical Order Grid for SKU Pairs (US-60)**
   - Impact: Product Pair analysis lacks order-level historical context grid
   - Effort: Medium (requires adding grid data model to detail panel)

### Partially Implemented (⚠️) – 15 items

**High Priority (blocks other features or creates user confusion):**

- **FS-101 – Container Recommendation Logic (US-1)**: Recommendation algorithm is mock-data-driven without live PO/workload analysis; per-criterion highlighting missing
- **FS-301–303 – Plan vs Execution Summary (US-13–15)**: Core "Planned vs Executed" bar chart view missing; variance and projection incomplete
- **FS-305, FS-312 – WES Context Integration (US-17, US-24)**: Exception pattern routes lack deep WES integration (conveyor speeds, micro-stoppages)

**Medium Priority (improves polish or completeness):**

- **FS-103 – Per-Criterion Highlighting (US-3)**: UI shows combined recommendation but not individual criterion winners
- **FS-105 – Real-Time Re-estimation (US-5)**: Single trigger instead of continuous update mechanism
- **FS-306 – Suggested Actions Interactivity (US-18)**: Action buttons present but not fully integrated with backend

**Lower Priority (minor gaps or aspirational features):**

- **FS-309, FS-314, FS-321 – Projected Metrics (US-21, US-26)**: Future-looking metrics partially mocked
- **FS-1305 – Markdown Rendering (US-85)**: Textarea supports writing but does not render markdown preview
- **FS-1307, FS-1310 – Handover Report Visuals (US-87, US-90)**: Extra card removal UI implicit; only OTIF gauge implemented


## Implementation Roadmap Suggestions

### Phase 1 – Critical User Experience (Highest Impact)
1. **FS-301–303**: Implement dedicated "Planned vs Executed" summary tab with horizontal bar charts and variance decomposition
2. **FS-101**: Enhance container recommendation with live PO attributes and per-criterion winner highlighting
3. **FS-207**: Add maintenance schedule data and integrate into reassignment logic

### Phase 2 – Feature Completion (Medium Complexity)
1. **FS-404**: Add @-prefix autocomplete to Natural Language Query
2. **FS-503**: Refactor Simulation screen as MFA sub-tab
3. **FS-809**: Add historical order grid to Product Pair detail
4. **FS-305, FS-312**: Deepen WES context integration in Exception Patterns

### Phase 3 – Polish and Refinement (Quality)
1. **FS-105**: Convert single-trigger re-estimation to continuous update mechanism
2. **FS-1305, FS-1310**: Add markdown rendering preview and expanded gauge display for all KPIs
3. **FS-306**: Make suggested actions fully interactive and backend-integrated
4. **FS-103**: Implement per-criterion recommendation highlighting

### Phase 4 – Advanced Features (Future Investment)
1. **FS-104**: Automatic photo capture and item detail extraction (requires AI/ML integration)


## References

- User Stories: `docs/user_stories.md`
- Component Architecture: `src/components/` (component-per-feature structure)
- Mock Data: `src/mockData.js` (data store for all screens)
- Memory Records: See `/Users/admin/.claude/projects/-Users-admin-git-burl-demo/memory/MEMORY.md` for implementation patterns and zone nomenclature

---


## Plan vs. Execution Screen
**Epic Tag:** #epic-plan-vs-exec

### a-tab-that-displays-planned-tasks-versus-executed-

**User Story:** As a warehouse manager, I want a tab that displays planned tasks versus executed work shift‑to‑date using horizontal bar charts by wave or order so that I can see at a glance how execution compares to plan.

#### Related Specifications

**[[FS-301]]: Planned vs Executed Bar Chart by Wave/Order**

Planned vs Executed Bar Chart by Wave/Order
- **Source:** US-13
- **Status:** ⚠️ Partial
- **Description:** Dedicated tab displaying planned tasks versus executed work shift-to-date using horizontal bar charts by wave or order.
- **Notes:** For DC Manager, `DCDaySummary` partially covers projections. For Inbound Manager, `OverviewDashboard` shows KPI counters but not horizontal bar charts by wave/order with variance decomposition. No dedicated "Planned vs Executed" tab exists as described in the specification.

**[[FS-1310]]: Visual KPI Gauge Display**

Visual KPI Gauge Display
- **Source:** US-90
- **Status:** ⚠️ Partial
- **Description:** KPI cards in handover report support visual formats like gauges with red/yellow/green ranges.
- **Notes:** OTIF has custom SVG gauge; remaining KPI cards (Absenteeism, Labor Planned, Labor Executed) use plain numeric display without gauge visuals.


## Gap Analysis

### Fully Missing (❌) – 8 items

1. **FS-104 – Automatic Photo Capture and Item Detail Extraction (US-4)**
   - Impact: Yard container scanning lacks AI-powered item detail capture
   - Effort: High (requires image processing, AI integration, item database)

2. **FS-207 – Maintenance Schedule Consideration (US-12)**
   - Impact: Labor reassignment suggestions do not account for equipment downtime
   - Effort: Medium (requires maintenance data integration in mock data and recommendation logic)

3. **FS-301 – Dedicated Planned vs Executed Tab (US-13)**
   - Impact: Plan vs Execution screen lacks primary summary view; insights scattered across sub-tabs
   - Effort: High (requires consolidating bar chart data model and variance decomposition logic)

4. **FS-404 – Entity Reference Autocomplete (US-37)**
   - Impact: Natural language queries lack @-prefix autocomplete for entity references
   - Effort: Low (UI enhancement with entity parsing)

5. **FS-503 – MFA Simulation Tab (US-40)**
   - Impact: MFA lacks dedicated simulation space; separate Simulation screen exists but not integrated
   - Effort: Medium (requires refactoring Simulation screen as MFA sub-tab)

6. **FS-809 – Historical Order Grid for SKU Pairs (US-60)**
   - Impact: Product Pair analysis lacks order-level historical context grid
   - Effort: Medium (requires adding grid data model to detail panel)

### Partially Implemented (⚠️) – 15 items

**High Priority (blocks other features or creates user confusion):**

- **FS-101 – Container Recommendation Logic (US-1)**: Recommendation algorithm is mock-data-driven without live PO/workload analysis; per-criterion highlighting missing
- **FS-301–303 – Plan vs Execution Summary (US-13–15)**: Core "Planned vs Executed" bar chart view missing; variance and projection incomplete
- **FS-305, FS-312 – WES Context Integration (US-17, US-24)**: Exception pattern routes lack deep WES integration (conveyor speeds, micro-stoppages)

**Medium Priority (improves polish or completeness):**

- **FS-103 – Per-Criterion Highlighting (US-3)**: UI shows combined recommendation but not individual criterion winners
- **FS-105 – Real-Time Re-estimation (US-5)**: Single trigger instead of continuous update mechanism
- **FS-306 – Suggested Actions Interactivity (US-18)**: Action buttons present but not fully integrated with backend

**Lower Priority (minor gaps or aspirational features):**

- **FS-309, FS-314, FS-321 – Projected Metrics (US-21, US-26)**: Future-looking metrics partially mocked
- **FS-1305 – Markdown Rendering (US-85)**: Textarea supports writing but does not render markdown preview
- **FS-1307, FS-1310 – Handover Report Visuals (US-87, US-90)**: Extra card removal UI implicit; only OTIF gauge implemented


## Implementation Roadmap Suggestions

### Phase 1 – Critical User Experience (Highest Impact)
1. **FS-301–303**: Implement dedicated "Planned vs Executed" summary tab with horizontal bar charts and variance decomposition
2. **FS-101**: Enhance container recommendation with live PO attributes and per-criterion winner highlighting
3. **FS-207**: Add maintenance schedule data and integrate into reassignment logic

### Phase 2 – Feature Completion (Medium Complexity)
1. **FS-404**: Add @-prefix autocomplete to Natural Language Query
2. **FS-503**: Refactor Simulation screen as MFA sub-tab
3. **FS-809**: Add historical order grid to Product Pair detail
4. **FS-305, FS-312**: Deepen WES context integration in Exception Patterns

### Phase 3 – Polish and Refinement (Quality)
1. **FS-105**: Convert single-trigger re-estimation to continuous update mechanism
2. **FS-1305, FS-1310**: Add markdown rendering preview and expanded gauge display for all KPIs
3. **FS-306**: Make suggested actions fully interactive and backend-integrated
4. **FS-103**: Implement per-criterion recommendation highlighting

### Phase 4 – Advanced Features (Future Investment)
1. **FS-104**: Automatic photo capture and item detail extraction (requires AI/ML integration)


## References

- User Stories: `docs/user_stories.md`
- Component Architecture: `src/components/` (component-per-feature structure)
- Mock Data: `src/mockData.js` (data store for all screens)
- Memory Records: See `/Users/admin/.claude/projects/-Users-admin-git-burl-demo/memory/MEMORY.md` for implementation patterns and zone nomenclature

---

### each-bar-pair-to-show-expected-workload-hours-vers

**User Story:** As a warehouse manager, I want each bar pair to show expected workload hours versus actual execution time and visually differentiate the portion of variance due to delays versus pick denials so that I can diagnose the sources of deviation.

#### Related Specifications

**[[FS-302]]: Variance Decomposition (Delays vs Pick Denials)**

Variance Decomposition (Delays vs Pick Denials)
- **Source:** US-14
- **Status:** ⚠️ Partial
- **Description:** Each bar pair shows expected vs actual workload and visually differentiates variance due to delays versus pick denials.
- **Notes:** Partially addressed in `ExceptionPatterns.jsx` and `HistoricalTrace.jsx` but not integrated into a primary "Planned vs Executed" summary chart.

---

### to-see-an-accumulated-variance-over-the-shift-or-d

**User Story:** As a warehouse manager, I want to see an accumulated variance over the shift or day (ahead or behind schedule) and a projected end‑of‑shift outcome so that I can anticipate whether we will meet the plan..

#### Related Specifications

**[[FS-303]]: Accumulated Variance and End-of-Shift Projection**

Accumulated Variance and End-of-Shift Projection
- **Source:** US-15
- **Status:** ⚠️ Partial
- **Description:** Display accumulated variance over shift or day and project end-of-shift outcome to anticipate plan compliance.
- **Notes:** Projected contribution metrics are partially mocked in `DCDaySummary.jsx` and projection components but lack comprehensive coverage across all zones.

---

### a-locations-view-that-lists-locations-sorted-by-ac

**User Story:** As a warehouse manager, I want a locations view that lists locations sorted by accumulated exceptions (pick denials, empty locations) for the day or shift so that I can identify likely inventory or slotting issues.

#### Related Specifications

**[[FS-304]]: Exception Locations View with Problem Sorting**

Exception Locations View with Problem Sorting
- **Source:** US-16
- **Status:** ✅ Implemented
- **Description:** Locations view listing locations sorted by accumulated exceptions (pick denials, empty locations) for the day or shift.
- **Notes:** Implemented in `ExceptionPatterns.jsx` Locations tab with sorting by exception count.

---

### to-see-for-each-problem-location-the-picker-routes

**User Story:** As a warehouse manager, I want to see, for each problem location, the picker routes that were supposed to stop there but reported pick denial or empty location so that I can understand operational context.

#### Related Specifications

**[[FS-305]]: Picker Routes for Problem Locations**

Picker Routes for Problem Locations
- **Source:** US-17
- **Status:** ⚠️ Partial
- **Description:** For each problem location, show picker routes that reported pick denial or empty location and related operational context.
- **Notes:** Routes shown in `ExceptionPatterns.jsx` Locations tab but with limited WES context integration.

**[[FS-1310]]: Visual KPI Gauge Display**

Visual KPI Gauge Display
- **Source:** US-90
- **Status:** ⚠️ Partial
- **Description:** KPI cards in handover report support visual formats like gauges with red/yellow/green ranges.
- **Notes:** OTIF has custom SVG gauge; remaining KPI cards (Absenteeism, Labor Planned, Labor Executed) use plain numeric display without gauge visuals.


## Gap Analysis

### Fully Missing (❌) – 8 items

1. **FS-104 – Automatic Photo Capture and Item Detail Extraction (US-4)**
   - Impact: Yard container scanning lacks AI-powered item detail capture
   - Effort: High (requires image processing, AI integration, item database)

2. **FS-207 – Maintenance Schedule Consideration (US-12)**
   - Impact: Labor reassignment suggestions do not account for equipment downtime
   - Effort: Medium (requires maintenance data integration in mock data and recommendation logic)

3. **FS-301 – Dedicated Planned vs Executed Tab (US-13)**
   - Impact: Plan vs Execution screen lacks primary summary view; insights scattered across sub-tabs
   - Effort: High (requires consolidating bar chart data model and variance decomposition logic)

4. **FS-404 – Entity Reference Autocomplete (US-37)**
   - Impact: Natural language queries lack @-prefix autocomplete for entity references
   - Effort: Low (UI enhancement with entity parsing)

5. **FS-503 – MFA Simulation Tab (US-40)**
   - Impact: MFA lacks dedicated simulation space; separate Simulation screen exists but not integrated
   - Effort: Medium (requires refactoring Simulation screen as MFA sub-tab)

6. **FS-809 – Historical Order Grid for SKU Pairs (US-60)**
   - Impact: Product Pair analysis lacks order-level historical context grid
   - Effort: Medium (requires adding grid data model to detail panel)

### Partially Implemented (⚠️) – 15 items

**High Priority (blocks other features or creates user confusion):**

- **FS-101 – Container Recommendation Logic (US-1)**: Recommendation algorithm is mock-data-driven without live PO/workload analysis; per-criterion highlighting missing
- **FS-301–303 – Plan vs Execution Summary (US-13–15)**: Core "Planned vs Executed" bar chart view missing; variance and projection incomplete
- **FS-305, FS-312 – WES Context Integration (US-17, US-24)**: Exception pattern routes lack deep WES integration (conveyor speeds, micro-stoppages)

**Medium Priority (improves polish or completeness):**

- **FS-103 – Per-Criterion Highlighting (US-3)**: UI shows combined recommendation but not individual criterion winners
- **FS-105 – Real-Time Re-estimation (US-5)**: Single trigger instead of continuous update mechanism
- **FS-306 – Suggested Actions Interactivity (US-18)**: Action buttons present but not fully integrated with backend

**Lower Priority (minor gaps or aspirational features):**

- **FS-309, FS-314, FS-321 – Projected Metrics (US-21, US-26)**: Future-looking metrics partially mocked
- **FS-1305 – Markdown Rendering (US-85)**: Textarea supports writing but does not render markdown preview
- **FS-1307, FS-1310 – Handover Report Visuals (US-87, US-90)**: Extra card removal UI implicit; only OTIF gauge implemented


## Implementation Roadmap Suggestions

### Phase 1 – Critical User Experience (Highest Impact)
1. **FS-301–303**: Implement dedicated "Planned vs Executed" summary tab with horizontal bar charts and variance decomposition
2. **FS-101**: Enhance container recommendation with live PO attributes and per-criterion winner highlighting
3. **FS-207**: Add maintenance schedule data and integrate into reassignment logic

### Phase 2 – Feature Completion (Medium Complexity)
1. **FS-404**: Add @-prefix autocomplete to Natural Language Query
2. **FS-503**: Refactor Simulation screen as MFA sub-tab
3. **FS-809**: Add historical order grid to Product Pair detail
4. **FS-305, FS-312**: Deepen WES context integration in Exception Patterns

### Phase 3 – Polish and Refinement (Quality)
1. **FS-105**: Convert single-trigger re-estimation to continuous update mechanism
2. **FS-1305, FS-1310**: Add markdown rendering preview and expanded gauge display for all KPIs
3. **FS-306**: Make suggested actions fully interactive and backend-integrated
4. **FS-103**: Implement per-criterion recommendation highlighting

### Phase 4 – Advanced Features (Future Investment)
1. **FS-104**: Automatic photo capture and item detail extraction (requires AI/ML integration)


## References

- User Stories: `docs/user_stories.md`
- Component Architecture: `src/components/` (component-per-feature structure)
- Mock Data: `src/mockData.js` (data store for all screens)
- Memory Records: See `/Users/admin/.claude/projects/-Users-admin-git-burl-demo/memory/MEMORY.md` for implementation patterns and zone nomenclature

---

### the-system-to-suggest-follow-up-actions-for-proble

**User Story:** As a warehouse manager, I want the system to suggest follow‑up actions for problematic locations (trigger cycle count, audit location, re‑slot SKU, ignore/fixed) so that I can respond appropriately.

#### Related Specifications

**[[FS-306]]: Suggested Follow-up Actions for Problematic Locations**

Suggested Follow-up Actions for Problematic Locations
- **Source:** US-18
- **Status:** ⚠️ Partial
- **Description:** System suggests follow-up actions for problematic locations (cycle count, audit, re-slot SKU, ignore/fixed).
- **Notes:** Action buttons present in UI but not fully interactive or integrated with backend systems.

**[[FS-1310]]: Visual KPI Gauge Display**

Visual KPI Gauge Display
- **Source:** US-90
- **Status:** ⚠️ Partial
- **Description:** KPI cards in handover report support visual formats like gauges with red/yellow/green ranges.
- **Notes:** OTIF has custom SVG gauge; remaining KPI cards (Absenteeism, Labor Planned, Labor Executed) use plain numeric display without gauge visuals.


## Gap Analysis

### Fully Missing (❌) – 8 items

1. **FS-104 – Automatic Photo Capture and Item Detail Extraction (US-4)**
   - Impact: Yard container scanning lacks AI-powered item detail capture
   - Effort: High (requires image processing, AI integration, item database)

2. **FS-207 – Maintenance Schedule Consideration (US-12)**
   - Impact: Labor reassignment suggestions do not account for equipment downtime
   - Effort: Medium (requires maintenance data integration in mock data and recommendation logic)

3. **FS-301 – Dedicated Planned vs Executed Tab (US-13)**
   - Impact: Plan vs Execution screen lacks primary summary view; insights scattered across sub-tabs
   - Effort: High (requires consolidating bar chart data model and variance decomposition logic)

4. **FS-404 – Entity Reference Autocomplete (US-37)**
   - Impact: Natural language queries lack @-prefix autocomplete for entity references
   - Effort: Low (UI enhancement with entity parsing)

5. **FS-503 – MFA Simulation Tab (US-40)**
   - Impact: MFA lacks dedicated simulation space; separate Simulation screen exists but not integrated
   - Effort: Medium (requires refactoring Simulation screen as MFA sub-tab)

6. **FS-809 – Historical Order Grid for SKU Pairs (US-60)**
   - Impact: Product Pair analysis lacks order-level historical context grid
   - Effort: Medium (requires adding grid data model to detail panel)

### Partially Implemented (⚠️) – 15 items

**High Priority (blocks other features or creates user confusion):**

- **FS-101 – Container Recommendation Logic (US-1)**: Recommendation algorithm is mock-data-driven without live PO/workload analysis; per-criterion highlighting missing
- **FS-301–303 – Plan vs Execution Summary (US-13–15)**: Core "Planned vs Executed" bar chart view missing; variance and projection incomplete
- **FS-305, FS-312 – WES Context Integration (US-17, US-24)**: Exception pattern routes lack deep WES integration (conveyor speeds, micro-stoppages)

**Medium Priority (improves polish or completeness):**

- **FS-103 – Per-Criterion Highlighting (US-3)**: UI shows combined recommendation but not individual criterion winners
- **FS-105 – Real-Time Re-estimation (US-5)**: Single trigger instead of continuous update mechanism
- **FS-306 – Suggested Actions Interactivity (US-18)**: Action buttons present but not fully integrated with backend

**Lower Priority (minor gaps or aspirational features):**

- **FS-309, FS-314, FS-321 – Projected Metrics (US-21, US-26)**: Future-looking metrics partially mocked
- **FS-1305 – Markdown Rendering (US-85)**: Textarea supports writing but does not render markdown preview
- **FS-1307, FS-1310 – Handover Report Visuals (US-87, US-90)**: Extra card removal UI implicit; only OTIF gauge implemented


## Implementation Roadmap Suggestions

### Phase 1 – Critical User Experience (Highest Impact)
1. **FS-301–303**: Implement dedicated "Planned vs Executed" summary tab with horizontal bar charts and variance decomposition
2. **FS-101**: Enhance container recommendation with live PO attributes and per-criterion winner highlighting
3. **FS-207**: Add maintenance schedule data and integrate into reassignment logic

### Phase 2 – Feature Completion (Medium Complexity)
1. **FS-404**: Add @-prefix autocomplete to Natural Language Query
2. **FS-503**: Refactor Simulation screen as MFA sub-tab
3. **FS-809**: Add historical order grid to Product Pair detail
4. **FS-305, FS-312**: Deepen WES context integration in Exception Patterns

### Phase 3 – Polish and Refinement (Quality)
1. **FS-105**: Convert single-trigger re-estimation to continuous update mechanism
2. **FS-1305, FS-1310**: Add markdown rendering preview and expanded gauge display for all KPIs
3. **FS-306**: Make suggested actions fully interactive and backend-integrated
4. **FS-103**: Implement per-criterion recommendation highlighting

### Phase 4 – Advanced Features (Future Investment)
1. **FS-104**: Automatic photo capture and item detail extraction (requires AI/ML integration)


## References

- User Stories: `docs/user_stories.md`
- Component Architecture: `src/components/` (component-per-feature structure)
- Mock Data: `src/mockData.js` (data store for all screens)
- Memory Records: See `/Users/admin/.claude/projects/-Users-admin-git-burl-demo/memory/MEMORY.md` for implementation patterns and zone nomenclature

---

### to-select-multiple-locations-and-apply-the-same-ac

**User Story:** As a warehouse manager, I want to select multiple locations and apply the same action in bulk so that I can manage recurring issues efficiently.

#### Related Specifications

**[[FS-307]]: Bulk Action Selection for Multiple Locations**

Bulk Action Selection for Multiple Locations
- **Source:** US-19
- **Status:** ✅ Implemented
- **Description:** Select multiple locations and apply the same action in bulk to manage recurring issues efficiently.
- **Notes:** Implemented in `ExceptionPatterns.jsx` with checkbox selection and bulk action buttons.

---

### issues-marked-as-ignore-fixed-to-be-removed-from-t

**User Story:** As a warehouse manager, I want issues marked as ignore/fixed to be removed from the exception list and excluded from future pattern detection so that the screen stays focused on active problems.

#### Related Specifications

**[[FS-308]]: Automatic Issue Removal and Exclusion from Future Patterns**

Automatic Issue Removal and Exclusion from Future Patterns
- **Source:** US-20
- **Status:** ✅ Implemented
- **Description:** Issues marked as ignore/fixed are removed from exception list and excluded from future pattern detection.
- **Notes:** Implemented with localStorage-backed ignore list in `ExceptionPatterns.jsx`.

---

### the-system-to-show-the-current-and-projected-contr

**User Story:** As a warehouse manager, I want the system to show the current and projected contribution of each location’s issues to total exceptions for the shift or day so that I can prioritize remediation.

#### Related Specifications

**[[FS-309]]: Current and Projected Contribution Metrics for Location Issues**

Current and Projected Contribution Metrics for Location Issues
- **Source:** US-21
- **Status:** ⚠️ Partial
- **Description:** Show current and projected contribution of location issues to total exceptions for prioritization.
- **Notes:** Partially mocked; future-looking metrics lack full projection algorithm.

**[[FS-1310]]: Visual KPI Gauge Display**

Visual KPI Gauge Display
- **Source:** US-90
- **Status:** ⚠️ Partial
- **Description:** KPI cards in handover report support visual formats like gauges with red/yellow/green ranges.
- **Notes:** OTIF has custom SVG gauge; remaining KPI cards (Absenteeism, Labor Planned, Labor Executed) use plain numeric display without gauge visuals.


## Gap Analysis

### Fully Missing (❌) – 8 items

1. **FS-104 – Automatic Photo Capture and Item Detail Extraction (US-4)**
   - Impact: Yard container scanning lacks AI-powered item detail capture
   - Effort: High (requires image processing, AI integration, item database)

2. **FS-207 – Maintenance Schedule Consideration (US-12)**
   - Impact: Labor reassignment suggestions do not account for equipment downtime
   - Effort: Medium (requires maintenance data integration in mock data and recommendation logic)

3. **FS-301 – Dedicated Planned vs Executed Tab (US-13)**
   - Impact: Plan vs Execution screen lacks primary summary view; insights scattered across sub-tabs
   - Effort: High (requires consolidating bar chart data model and variance decomposition logic)

4. **FS-404 – Entity Reference Autocomplete (US-37)**
   - Impact: Natural language queries lack @-prefix autocomplete for entity references
   - Effort: Low (UI enhancement with entity parsing)

5. **FS-503 – MFA Simulation Tab (US-40)**
   - Impact: MFA lacks dedicated simulation space; separate Simulation screen exists but not integrated
   - Effort: Medium (requires refactoring Simulation screen as MFA sub-tab)

6. **FS-809 – Historical Order Grid for SKU Pairs (US-60)**
   - Impact: Product Pair analysis lacks order-level historical context grid
   - Effort: Medium (requires adding grid data model to detail panel)

### Partially Implemented (⚠️) – 15 items

**High Priority (blocks other features or creates user confusion):**

- **FS-101 – Container Recommendation Logic (US-1)**: Recommendation algorithm is mock-data-driven without live PO/workload analysis; per-criterion highlighting missing
- **FS-301–303 – Plan vs Execution Summary (US-13–15)**: Core "Planned vs Executed" bar chart view missing; variance and projection incomplete
- **FS-305, FS-312 – WES Context Integration (US-17, US-24)**: Exception pattern routes lack deep WES integration (conveyor speeds, micro-stoppages)

**Medium Priority (improves polish or completeness):**

- **FS-103 – Per-Criterion Highlighting (US-3)**: UI shows combined recommendation but not individual criterion winners
- **FS-105 – Real-Time Re-estimation (US-5)**: Single trigger instead of continuous update mechanism
- **FS-306 – Suggested Actions Interactivity (US-18)**: Action buttons present but not fully integrated with backend

**Lower Priority (minor gaps or aspirational features):**

- **FS-309, FS-314, FS-321 – Projected Metrics (US-21, US-26)**: Future-looking metrics partially mocked
- **FS-1305 – Markdown Rendering (US-85)**: Textarea supports writing but does not render markdown preview
- **FS-1307, FS-1310 – Handover Report Visuals (US-87, US-90)**: Extra card removal UI implicit; only OTIF gauge implemented


## Implementation Roadmap Suggestions

### Phase 1 – Critical User Experience (Highest Impact)
1. **FS-301–303**: Implement dedicated "Planned vs Executed" summary tab with horizontal bar charts and variance decomposition
2. **FS-101**: Enhance container recommendation with live PO attributes and per-criterion winner highlighting
3. **FS-207**: Add maintenance schedule data and integrate into reassignment logic

### Phase 2 – Feature Completion (Medium Complexity)
1. **FS-404**: Add @-prefix autocomplete to Natural Language Query
2. **FS-503**: Refactor Simulation screen as MFA sub-tab
3. **FS-809**: Add historical order grid to Product Pair detail
4. **FS-305, FS-312**: Deepen WES context integration in Exception Patterns

### Phase 3 – Polish and Refinement (Quality)
1. **FS-105**: Convert single-trigger re-estimation to continuous update mechanism
2. **FS-1305, FS-1310**: Add markdown rendering preview and expanded gauge display for all KPIs
3. **FS-306**: Make suggested actions fully interactive and backend-integrated
4. **FS-103**: Implement per-criterion recommendation highlighting

### Phase 4 – Advanced Features (Future Investment)
1. **FS-104**: Automatic photo capture and item detail extraction (requires AI/ML integration)


## References

- User Stories: `docs/user_stories.md`
- Component Architecture: `src/components/` (component-per-feature structure)
- Mock Data: `src/mockData.js` (data store for all screens)
- Memory Records: See `/Users/admin/.claude/projects/-Users-admin-git-burl-demo/memory/MEMORY.md` for implementation patterns and zone nomenclature

---

### an-equipment-zone-view-that-lists-equipment-and-zo

**User Story:** As a warehouse manager, I want an equipment/zone view that lists equipment and zones sorted by accumulated delays or total delay time so that I can identify problematic areas like specific mezzanines, put‑walls, or conveyors.

#### Related Specifications

**[[FS-310]]: Equipment/Zone View with Delay Sorting**

Equipment/Zone View with Delay Sorting
- **Source:** US-22
- **Status:** ✅ Implemented
- **Description:** Equipment and zones view listing zones sorted by accumulated delays or total delay time.
- **Notes:** Implemented in `ExceptionPatterns.jsx` Equipment tab with delay-based sorting.

---

### equipment-or-zone-delays-to-be-filtered-to-those-e

**User Story:** As a warehouse manager, I want equipment or zone delays to be filtered to those exceeding a defined threshold (for example, more than 30% over expected time) so that I focus on impactful exceptions.

#### Related Specifications

**[[FS-311]]: Delay Threshold Filtering**

Delay Threshold Filtering
- **Source:** US-23
- **Status:** ✅ Implemented
- **Description:** Filter equipment/zone delays to those exceeding a defined threshold (e.g., >30% over expected time).
- **Notes:** Implemented with threshold filtering in `ExceptionPatterns.jsx` Equipment tab.

---

### to-view-picker-routes-associated-with-delayed-equi

**User Story:** As a warehouse manager, I want to view picker routes associated with delayed equipment/zones and see contextual information from the WES (for example, reduced conveyor speed, micro‑stoppages) so that I can understand root causes.

#### Related Specifications

**[[FS-312]]: Picker Routes for Delayed Equipment/Zones with WES Context**

Picker Routes for Delayed Equipment/Zones with WES Context
- **Source:** US-24
- **Status:** ⚠️ Partial
- **Description:** View picker routes for delayed equipment/zones with contextual WES information (e.g., conveyor speed, micro-stoppages).
- **Notes:** Routes visible but WES context integration minimal; conveyors and WES data not fully surfaced.

**[[FS-1310]]: Visual KPI Gauge Display**

Visual KPI Gauge Display
- **Source:** US-90
- **Status:** ⚠️ Partial
- **Description:** KPI cards in handover report support visual formats like gauges with red/yellow/green ranges.
- **Notes:** OTIF has custom SVG gauge; remaining KPI cards (Absenteeism, Labor Planned, Labor Executed) use plain numeric display without gauge visuals.


## Gap Analysis

### Fully Missing (❌) – 8 items

1. **FS-104 – Automatic Photo Capture and Item Detail Extraction (US-4)**
   - Impact: Yard container scanning lacks AI-powered item detail capture
   - Effort: High (requires image processing, AI integration, item database)

2. **FS-207 – Maintenance Schedule Consideration (US-12)**
   - Impact: Labor reassignment suggestions do not account for equipment downtime
   - Effort: Medium (requires maintenance data integration in mock data and recommendation logic)

3. **FS-301 – Dedicated Planned vs Executed Tab (US-13)**
   - Impact: Plan vs Execution screen lacks primary summary view; insights scattered across sub-tabs
   - Effort: High (requires consolidating bar chart data model and variance decomposition logic)

4. **FS-404 – Entity Reference Autocomplete (US-37)**
   - Impact: Natural language queries lack @-prefix autocomplete for entity references
   - Effort: Low (UI enhancement with entity parsing)

5. **FS-503 – MFA Simulation Tab (US-40)**
   - Impact: MFA lacks dedicated simulation space; separate Simulation screen exists but not integrated
   - Effort: Medium (requires refactoring Simulation screen as MFA sub-tab)

6. **FS-809 – Historical Order Grid for SKU Pairs (US-60)**
   - Impact: Product Pair analysis lacks order-level historical context grid
   - Effort: Medium (requires adding grid data model to detail panel)

### Partially Implemented (⚠️) – 15 items

**High Priority (blocks other features or creates user confusion):**

- **FS-101 – Container Recommendation Logic (US-1)**: Recommendation algorithm is mock-data-driven without live PO/workload analysis; per-criterion highlighting missing
- **FS-301–303 – Plan vs Execution Summary (US-13–15)**: Core "Planned vs Executed" bar chart view missing; variance and projection incomplete
- **FS-305, FS-312 – WES Context Integration (US-17, US-24)**: Exception pattern routes lack deep WES integration (conveyor speeds, micro-stoppages)

**Medium Priority (improves polish or completeness):**

- **FS-103 – Per-Criterion Highlighting (US-3)**: UI shows combined recommendation but not individual criterion winners
- **FS-105 – Real-Time Re-estimation (US-5)**: Single trigger instead of continuous update mechanism
- **FS-306 – Suggested Actions Interactivity (US-18)**: Action buttons present but not fully integrated with backend

**Lower Priority (minor gaps or aspirational features):**

- **FS-309, FS-314, FS-321 – Projected Metrics (US-21, US-26)**: Future-looking metrics partially mocked
- **FS-1305 – Markdown Rendering (US-85)**: Textarea supports writing but does not render markdown preview
- **FS-1307, FS-1310 – Handover Report Visuals (US-87, US-90)**: Extra card removal UI implicit; only OTIF gauge implemented


## Implementation Roadmap Suggestions

### Phase 1 – Critical User Experience (Highest Impact)
1. **FS-301–303**: Implement dedicated "Planned vs Executed" summary tab with horizontal bar charts and variance decomposition
2. **FS-101**: Enhance container recommendation with live PO attributes and per-criterion winner highlighting
3. **FS-207**: Add maintenance schedule data and integrate into reassignment logic

### Phase 2 – Feature Completion (Medium Complexity)
1. **FS-404**: Add @-prefix autocomplete to Natural Language Query
2. **FS-503**: Refactor Simulation screen as MFA sub-tab
3. **FS-809**: Add historical order grid to Product Pair detail
4. **FS-305, FS-312**: Deepen WES context integration in Exception Patterns

### Phase 3 – Polish and Refinement (Quality)
1. **FS-105**: Convert single-trigger re-estimation to continuous update mechanism
2. **FS-1305, FS-1310**: Add markdown rendering preview and expanded gauge display for all KPIs
3. **FS-306**: Make suggested actions fully interactive and backend-integrated
4. **FS-103**: Implement per-criterion recommendation highlighting

### Phase 4 – Advanced Features (Future Investment)
1. **FS-104**: Automatic photo capture and item detail extraction (requires AI/ML integration)


## References

- User Stories: `docs/user_stories.md`
- Component Architecture: `src/components/` (component-per-feature structure)
- Mock Data: `src/mockData.js` (data store for all screens)
- Memory Records: See `/Users/admin/.claude/projects/-Users-admin-git-burl-demo/memory/MEMORY.md` for implementation patterns and zone nomenclature

---

### to-mark-equipment-zone-delay-patterns-as-ignore-fi

**User Story:** As a warehouse manager, I want to mark equipment/zone delay patterns as ignore/fixed in bulk so that resolved issues no longer clutter the exception view.

#### Related Specifications

**[[FS-313]]: Bulk Ignore/Fixed for Equipment/Zone Delays**

Bulk Ignore/Fixed for Equipment/Zone Delays
- **Source:** US-25
- **Status:** ✅ Implemented
- **Description:** Mark equipment/zone delay patterns as ignore/fixed in bulk to resolve issues.
- **Notes:** Implemented in `ExceptionPatterns.jsx` Equipment tab with bulk action support.

---

### to-see-the-accumulated-and-projected-impact-of-equ

**User Story:** As a warehouse manager, I want to see the accumulated and projected impact of equipment/zone delays over the shift or day so that I can assess operational risk.

#### Related Specifications

**[[FS-314]]: Accumulated and Projected Impact of Equipment/Zone Delays**

Accumulated and Projected Impact of Equipment/Zone Delays
- **Source:** US-26
- **Status:** ⚠️ Partial
- **Description:** Show accumulated and projected impact of equipment/zone delays over shift or day to assess operational risk.
- **Notes:** Partially mocked; future-looking impact assessment not fully realized.

**[[FS-1310]]: Visual KPI Gauge Display**

Visual KPI Gauge Display
- **Source:** US-90
- **Status:** ⚠️ Partial
- **Description:** KPI cards in handover report support visual formats like gauges with red/yellow/green ranges.
- **Notes:** OTIF has custom SVG gauge; remaining KPI cards (Absenteeism, Labor Planned, Labor Executed) use plain numeric display without gauge visuals.


## Gap Analysis

### Fully Missing (❌) – 8 items

1. **FS-104 – Automatic Photo Capture and Item Detail Extraction (US-4)**
   - Impact: Yard container scanning lacks AI-powered item detail capture
   - Effort: High (requires image processing, AI integration, item database)

2. **FS-207 – Maintenance Schedule Consideration (US-12)**
   - Impact: Labor reassignment suggestions do not account for equipment downtime
   - Effort: Medium (requires maintenance data integration in mock data and recommendation logic)

3. **FS-301 – Dedicated Planned vs Executed Tab (US-13)**
   - Impact: Plan vs Execution screen lacks primary summary view; insights scattered across sub-tabs
   - Effort: High (requires consolidating bar chart data model and variance decomposition logic)

4. **FS-404 – Entity Reference Autocomplete (US-37)**
   - Impact: Natural language queries lack @-prefix autocomplete for entity references
   - Effort: Low (UI enhancement with entity parsing)

5. **FS-503 – MFA Simulation Tab (US-40)**
   - Impact: MFA lacks dedicated simulation space; separate Simulation screen exists but not integrated
   - Effort: Medium (requires refactoring Simulation screen as MFA sub-tab)

6. **FS-809 – Historical Order Grid for SKU Pairs (US-60)**
   - Impact: Product Pair analysis lacks order-level historical context grid
   - Effort: Medium (requires adding grid data model to detail panel)

### Partially Implemented (⚠️) – 15 items

**High Priority (blocks other features or creates user confusion):**

- **FS-101 – Container Recommendation Logic (US-1)**: Recommendation algorithm is mock-data-driven without live PO/workload analysis; per-criterion highlighting missing
- **FS-301–303 – Plan vs Execution Summary (US-13–15)**: Core "Planned vs Executed" bar chart view missing; variance and projection incomplete
- **FS-305, FS-312 – WES Context Integration (US-17, US-24)**: Exception pattern routes lack deep WES integration (conveyor speeds, micro-stoppages)

**Medium Priority (improves polish or completeness):**

- **FS-103 – Per-Criterion Highlighting (US-3)**: UI shows combined recommendation but not individual criterion winners
- **FS-105 – Real-Time Re-estimation (US-5)**: Single trigger instead of continuous update mechanism
- **FS-306 – Suggested Actions Interactivity (US-18)**: Action buttons present but not fully integrated with backend

**Lower Priority (minor gaps or aspirational features):**

- **FS-309, FS-314, FS-321 – Projected Metrics (US-21, US-26)**: Future-looking metrics partially mocked
- **FS-1305 – Markdown Rendering (US-85)**: Textarea supports writing but does not render markdown preview
- **FS-1307, FS-1310 – Handover Report Visuals (US-87, US-90)**: Extra card removal UI implicit; only OTIF gauge implemented


## Implementation Roadmap Suggestions

### Phase 1 – Critical User Experience (Highest Impact)
1. **FS-301–303**: Implement dedicated "Planned vs Executed" summary tab with horizontal bar charts and variance decomposition
2. **FS-101**: Enhance container recommendation with live PO attributes and per-criterion winner highlighting
3. **FS-207**: Add maintenance schedule data and integrate into reassignment logic

### Phase 2 – Feature Completion (Medium Complexity)
1. **FS-404**: Add @-prefix autocomplete to Natural Language Query
2. **FS-503**: Refactor Simulation screen as MFA sub-tab
3. **FS-809**: Add historical order grid to Product Pair detail
4. **FS-305, FS-312**: Deepen WES context integration in Exception Patterns

### Phase 3 – Polish and Refinement (Quality)
1. **FS-105**: Convert single-trigger re-estimation to continuous update mechanism
2. **FS-1305, FS-1310**: Add markdown rendering preview and expanded gauge display for all KPIs
3. **FS-306**: Make suggested actions fully interactive and backend-integrated
4. **FS-103**: Implement per-criterion recommendation highlighting

### Phase 4 – Advanced Features (Future Investment)
1. **FS-104**: Automatic photo capture and item detail extraction (requires AI/ML integration)


## References

- User Stories: `docs/user_stories.md`
- Component Architecture: `src/components/` (component-per-feature structure)
- Mock Data: `src/mockData.js` (data store for all screens)
- Memory Records: See `/Users/admin/.claude/projects/-Users-admin-git-burl-demo/memory/MEMORY.md` for implementation patterns and zone nomenclature

---

### an-order-type-view-showing-order-types-sorted-by-a

**User Story:** As a warehouse manager, I want an order‑type view showing order types sorted by accumulated delays so that I can identify problematic profiles (for example, multi‑line or bulky orders)..

#### Related Specifications

**[[FS-315]]: Order Type View with Delay Sorting**

Order Type View with Delay Sorting
- **Source:** US-27
- **Status:** ✅ Implemented
- **Description:** Order-type view showing order types sorted by accumulated delays to identify problematic profiles.
- **Notes:** Implemented in `ExceptionPatterns.jsx` Order Types tab.

---

### to-select-a-historical-time-range-recent-current-s

**User Story:** As a warehouse manager, I want to select a historical time range (recent, current shift, today) and see workload units (waves or orders) with their associated WMS tasks and WES traces so that I can investigate issues end‑to‑end.

#### Related Specifications

**[[FS-316]]: Historical Time Range Selection and Task-Level Traceability**

Historical Time Range Selection and Task-Level Traceability
- **Source:** US-28
- **Status:** ✅ Implemented
- **Description:** Select historical time range and view workload units (waves/orders) with associated WMS tasks and WES traces.
- **Notes:** Implemented in `HistoricalTrace.jsx` with time range selector and full task detail view.

---

### wms-tasks-to-display-sku-location-quantity-and-pla

**User Story:** As a warehouse manager, I want WMS tasks to display SKU, location, quantity, and planned time window so that I can see how work was planned.

#### Related Specifications

**[[FS-317]]: WMS Task Detail Display**

WMS Task Detail Display
- **Source:** US-29
- **Status:** ✅ Implemented
- **Description:** WMS tasks display SKU, location, quantity, and planned time window.
- **Notes:** Implemented in `HistoricalTrace.jsx` task rows with full WMS attributes.

---

### wes-tasks-to-show-who-picked-which-station-actual-

**User Story:** As a warehouse manager, I want WES tasks to show who picked, which station, actual timestamps, travel time, and dwell time so that I can evaluate actual execution behavior.

#### Related Specifications

**[[FS-318]]: WES Task Execution Detail**

WES Task Execution Detail
- **Source:** US-30
- **Status:** ✅ Implemented
- **Description:** WES tasks show who picked, station, actual timestamps, travel time, and dwell time.
- **Notes:** Implemented in `HistoricalTrace.jsx` with execution-level detail.

---

### rows-with-normal-behavior-to-appear-neutral-and-mi

**User Story:** As a warehouse manager, I want rows with normal behavior to appear neutral and mismatches (no scan, wrong location, over/under quantity, excessive duration) to be highlighted in amber or red so that exceptions are easy to find..

#### Related Specifications

**[[FS-319]]: Mismatch Highlighting in Historical Trace**

Mismatch Highlighting in Historical Trace
- **Source:** US-31
- **Status:** ✅ Implemented
- **Description:** Rows with normal behavior appear neutral; mismatches (no scan, wrong location, over/under quantity, excessive duration) highlighted in amber or red.
- **Notes:** Implemented with color-coded row highlighting in `HistoricalTrace.jsx`.

---

### to-subscribe-to-specific-types-of-alerts-such-as-p

**User Story:** As a warehouse manager, I want to subscribe to specific types of alerts (such as potential misplacements, sustained delays above benchmarks, or emerging undesired trends) so that I am proactively notified of issues.

#### Related Specifications

**[[FS-320]]: Alert Subscription Configuration**

Alert Subscription Configuration
- **Source:** US-32
- **Status:** ✅ Implemented
- **Description:** Subscribe to specific alert types (potential misplacements, sustained delays, emerging trends).
- **Notes:** Implemented in `AlertSubscriptions.jsx` with 4 preconfigured subscriptions and enable/disable toggles.

---

### to-filter-alerts-by-area-or-shift

**User Story:** As a warehouse manager, I want to filter alerts by area or shift so that notifications remain relevant to my scope of responsibility..

#### Related Specifications

**[[FS-321]]: Alert Filtering by Area and Shift**

Alert Filtering by Area and Shift
- **Source:** US-33
- **Status:** ✅ Implemented
- **Description:** Filter alerts by area or shift to keep notifications relevant to scope of responsibility.
- **Notes:** Implemented in `AlertSubscriptions.jsx` with area and shift filter controls.


## 4. Natural Language Queries

---


## Natural Language Queries
**Epic Tag:** #epic-nlq

### to-ask-natural-language-questions-about-the-state-

**User Story:** As a warehouse manager, I want to ask natural language questions about the state of the warehouse via a chat interface so that I can quickly retrieve operational information without navigating multiple screens.

#### Related Specifications

**[[FS-401]]: Natural Language Chat Interface**

Natural Language Chat Interface
- **Source:** US-34
- **Status:** ✅ Implemented
- **Description:** Ask natural language questions about warehouse state via chat interface to quickly retrieve operational information.
- **Notes:** Implemented in `NLQuery.jsx` with chat-style message history and input box.

---

### to-retrieve-information-such-as-who-is-working-on-

**User Story:** As a warehouse manager, I want to retrieve information such as who is working on a specific dock and shift, which containers are in the yard, how long they have been there, and who the suppliers are so that I can respond to time‑sensitive questions.

#### Related Specifications

**[[FS-402]]: Operational Information Retrieval**

Operational Information Retrieval
- **Source:** US-35
- **Status:** ✅ Implemented
- **Description:** Retrieve information such as workers on specific docks, containers in yard, container age, and suppliers via natural language.
- **Notes:** Implemented with mock responses in `NLQuery.jsx` to common operational queries.

---

### a-curated-menu-of-common-questions-organized-by-ca

**User Story:** As a user, I want a curated menu of common questions organized by categories (yard management, labor management, workload distribution, etc.) so that I can quickly select or adapt prebuilt queries.

#### Related Specifications

**[[FS-403]]: Curated Question Menu by Category**

Curated Question Menu by Category
- **Source:** US-36
- **Status:** ✅ Implemented
- **Description:** Curated menu of common questions organized by categories (yard management, labor management, workload distribution) for quick selection.
- **Notes:** Implemented in `NLQuery.jsx` with expandable question categories.

---

### the-system-to-suggest-autocomplete-options-when-i-

**User Story:** As a user, I want the system to suggest autocomplete options when I type an @‑prefix (for example, @wave, @order, @dock) so that I can reference specific entities easily in my questions..

#### Related Specifications

**[[FS-404]]: Entity Reference Autocomplete (@-prefix)**

Entity Reference Autocomplete (@-prefix)
- **Source:** US-37
- **Status:** ❌ Missing
- **Description:** Autocomplete suggestions when typing @-prefix (e.g., @wave, @order, @dock) to reference specific entities.
- **Notes:** Not implemented in current codebase.


## 5. MFA Navigation

**[[FS-1310]]: Visual KPI Gauge Display**

Visual KPI Gauge Display
- **Source:** US-90
- **Status:** ⚠️ Partial
- **Description:** KPI cards in handover report support visual formats like gauges with red/yellow/green ranges.
- **Notes:** OTIF has custom SVG gauge; remaining KPI cards (Absenteeism, Labor Planned, Labor Executed) use plain numeric display without gauge visuals.


## Gap Analysis

### Fully Missing (❌) – 8 items

1. **FS-104 – Automatic Photo Capture and Item Detail Extraction (US-4)**
   - Impact: Yard container scanning lacks AI-powered item detail capture
   - Effort: High (requires image processing, AI integration, item database)

2. **FS-207 – Maintenance Schedule Consideration (US-12)**
   - Impact: Labor reassignment suggestions do not account for equipment downtime
   - Effort: Medium (requires maintenance data integration in mock data and recommendation logic)

3. **FS-301 – Dedicated Planned vs Executed Tab (US-13)**
   - Impact: Plan vs Execution screen lacks primary summary view; insights scattered across sub-tabs
   - Effort: High (requires consolidating bar chart data model and variance decomposition logic)

4. **FS-404 – Entity Reference Autocomplete (US-37)**
   - Impact: Natural language queries lack @-prefix autocomplete for entity references
   - Effort: Low (UI enhancement with entity parsing)

5. **FS-503 – MFA Simulation Tab (US-40)**
   - Impact: MFA lacks dedicated simulation space; separate Simulation screen exists but not integrated
   - Effort: Medium (requires refactoring Simulation screen as MFA sub-tab)

6. **FS-809 – Historical Order Grid for SKU Pairs (US-60)**
   - Impact: Product Pair analysis lacks order-level historical context grid
   - Effort: Medium (requires adding grid data model to detail panel)

### Partially Implemented (⚠️) – 15 items

**High Priority (blocks other features or creates user confusion):**

- **FS-101 – Container Recommendation Logic (US-1)**: Recommendation algorithm is mock-data-driven without live PO/workload analysis; per-criterion highlighting missing
- **FS-301–303 – Plan vs Execution Summary (US-13–15)**: Core "Planned vs Executed" bar chart view missing; variance and projection incomplete
- **FS-305, FS-312 – WES Context Integration (US-17, US-24)**: Exception pattern routes lack deep WES integration (conveyor speeds, micro-stoppages)

**Medium Priority (improves polish or completeness):**

- **FS-103 – Per-Criterion Highlighting (US-3)**: UI shows combined recommendation but not individual criterion winners
- **FS-105 – Real-Time Re-estimation (US-5)**: Single trigger instead of continuous update mechanism
- **FS-306 – Suggested Actions Interactivity (US-18)**: Action buttons present but not fully integrated with backend

**Lower Priority (minor gaps or aspirational features):**

- **FS-309, FS-314, FS-321 – Projected Metrics (US-21, US-26)**: Future-looking metrics partially mocked
- **FS-1305 – Markdown Rendering (US-85)**: Textarea supports writing but does not render markdown preview
- **FS-1307, FS-1310 – Handover Report Visuals (US-87, US-90)**: Extra card removal UI implicit; only OTIF gauge implemented


## Implementation Roadmap Suggestions

### Phase 1 – Critical User Experience (Highest Impact)
1. **FS-301–303**: Implement dedicated "Planned vs Executed" summary tab with horizontal bar charts and variance decomposition
2. **FS-101**: Enhance container recommendation with live PO attributes and per-criterion winner highlighting
3. **FS-207**: Add maintenance schedule data and integrate into reassignment logic

### Phase 2 – Feature Completion (Medium Complexity)
1. **FS-404**: Add @-prefix autocomplete to Natural Language Query
2. **FS-503**: Refactor Simulation screen as MFA sub-tab
3. **FS-809**: Add historical order grid to Product Pair detail
4. **FS-305, FS-312**: Deepen WES context integration in Exception Patterns

### Phase 3 – Polish and Refinement (Quality)
1. **FS-105**: Convert single-trigger re-estimation to continuous update mechanism
2. **FS-1305, FS-1310**: Add markdown rendering preview and expanded gauge display for all KPIs
3. **FS-306**: Make suggested actions fully interactive and backend-integrated
4. **FS-103**: Implement per-criterion recommendation highlighting

### Phase 4 – Advanced Features (Future Investment)
1. **FS-104**: Automatic photo capture and item detail extraction (requires AI/ML integration)


## References

- User Stories: `docs/user_stories.md`
- Component Architecture: `src/components/` (component-per-feature structure)
- Mock Data: `src/mockData.js` (data store for all screens)
- Memory Records: See `/Users/admin/.claude/projects/-Users-admin-git-burl-demo/memory/MEMORY.md` for implementation patterns and zone nomenclature

---


## MFA Navigation & Core
**Epic Tag:** #epic-mfa-nav

### a-new-mfa-option-in-the-main-navigation-that-opens

**User Story:** As a user, I want a new “MFA” option in the main navigation that opens over the queries screen so that I can access material flow analysis capabilities from the same application.

#### Related Specifications

**[[FS-501]]: MFA Option in Main Navigation**

MFA Option in Main Navigation
- **Source:** US-38
- **Status:** ✅ Implemented
- **Description:** New "MFA" option in main navigation that opens material flow analysis capabilities.
- **Notes:** Implemented in `Navbar.jsx` with MFA navigation link.

---

### an-mfa-overview-tab-that-shows-key-kpi-boxes-even-

**User Story:** As a user, I want an MFA Overview tab that shows key KPI boxes even if most of the screen is initially empty so that I have a high‑level summary of material flow performance.

#### Related Specifications

**[[FS-502]]: MFA Overview Tab with KPI Cards**

MFA Overview Tab with KPI Cards
- **Source:** US-39
- **Status:** ✅ Implemented
- **Description:** MFA Overview tab showing key KPI boxes for high-level material flow performance summary.
- **Notes:** Implemented in `MFA.jsx` Overview tab with KPI card display.

---

### an-mfa-simulation-tab-even-if-initially-empty

**User Story:** As a warehouse analyst, I want an MFA Simulation tab (even if initially empty) so that future what‑if analyses can be hosted in a dedicated space..

#### Related Specifications

**[[FS-503]]: MFA Simulation Tab**

MFA Simulation Tab
- **Source:** US-40
- **Status:** ❌ Missing
- **Description:** Dedicated MFA Simulation tab for future what-if analyses.
- **Notes:** A separate top-level Simulation screen exists, but not as an MFA sub-tab; MFA lacks its own simulation tab.


## 6. MFA Time Period Selector

**[[FS-1310]]: Visual KPI Gauge Display**

Visual KPI Gauge Display
- **Source:** US-90
- **Status:** ⚠️ Partial
- **Description:** KPI cards in handover report support visual formats like gauges with red/yellow/green ranges.
- **Notes:** OTIF has custom SVG gauge; remaining KPI cards (Absenteeism, Labor Planned, Labor Executed) use plain numeric display without gauge visuals.


## Gap Analysis

### Fully Missing (❌) – 8 items

1. **FS-104 – Automatic Photo Capture and Item Detail Extraction (US-4)**
   - Impact: Yard container scanning lacks AI-powered item detail capture
   - Effort: High (requires image processing, AI integration, item database)

2. **FS-207 – Maintenance Schedule Consideration (US-12)**
   - Impact: Labor reassignment suggestions do not account for equipment downtime
   - Effort: Medium (requires maintenance data integration in mock data and recommendation logic)

3. **FS-301 – Dedicated Planned vs Executed Tab (US-13)**
   - Impact: Plan vs Execution screen lacks primary summary view; insights scattered across sub-tabs
   - Effort: High (requires consolidating bar chart data model and variance decomposition logic)

4. **FS-404 – Entity Reference Autocomplete (US-37)**
   - Impact: Natural language queries lack @-prefix autocomplete for entity references
   - Effort: Low (UI enhancement with entity parsing)

5. **FS-503 – MFA Simulation Tab (US-40)**
   - Impact: MFA lacks dedicated simulation space; separate Simulation screen exists but not integrated
   - Effort: Medium (requires refactoring Simulation screen as MFA sub-tab)

6. **FS-809 – Historical Order Grid for SKU Pairs (US-60)**
   - Impact: Product Pair analysis lacks order-level historical context grid
   - Effort: Medium (requires adding grid data model to detail panel)

### Partially Implemented (⚠️) – 15 items

**High Priority (blocks other features or creates user confusion):**

- **FS-101 – Container Recommendation Logic (US-1)**: Recommendation algorithm is mock-data-driven without live PO/workload analysis; per-criterion highlighting missing
- **FS-301–303 – Plan vs Execution Summary (US-13–15)**: Core "Planned vs Executed" bar chart view missing; variance and projection incomplete
- **FS-305, FS-312 – WES Context Integration (US-17, US-24)**: Exception pattern routes lack deep WES integration (conveyor speeds, micro-stoppages)

**Medium Priority (improves polish or completeness):**

- **FS-103 – Per-Criterion Highlighting (US-3)**: UI shows combined recommendation but not individual criterion winners
- **FS-105 – Real-Time Re-estimation (US-5)**: Single trigger instead of continuous update mechanism
- **FS-306 – Suggested Actions Interactivity (US-18)**: Action buttons present but not fully integrated with backend

**Lower Priority (minor gaps or aspirational features):**

- **FS-309, FS-314, FS-321 – Projected Metrics (US-21, US-26)**: Future-looking metrics partially mocked
- **FS-1305 – Markdown Rendering (US-85)**: Textarea supports writing but does not render markdown preview
- **FS-1307, FS-1310 – Handover Report Visuals (US-87, US-90)**: Extra card removal UI implicit; only OTIF gauge implemented


## Implementation Roadmap Suggestions

### Phase 1 – Critical User Experience (Highest Impact)
1. **FS-301–303**: Implement dedicated "Planned vs Executed" summary tab with horizontal bar charts and variance decomposition
2. **FS-101**: Enhance container recommendation with live PO attributes and per-criterion winner highlighting
3. **FS-207**: Add maintenance schedule data and integrate into reassignment logic

### Phase 2 – Feature Completion (Medium Complexity)
1. **FS-404**: Add @-prefix autocomplete to Natural Language Query
2. **FS-503**: Refactor Simulation screen as MFA sub-tab
3. **FS-809**: Add historical order grid to Product Pair detail
4. **FS-305, FS-312**: Deepen WES context integration in Exception Patterns

### Phase 3 – Polish and Refinement (Quality)
1. **FS-105**: Convert single-trigger re-estimation to continuous update mechanism
2. **FS-1305, FS-1310**: Add markdown rendering preview and expanded gauge display for all KPIs
3. **FS-306**: Make suggested actions fully interactive and backend-integrated
4. **FS-103**: Implement per-criterion recommendation highlighting

### Phase 4 – Advanced Features (Future Investment)
1. **FS-104**: Automatic photo capture and item detail extraction (requires AI/ML integration)


## References

- User Stories: `docs/user_stories.md`
- Component Architecture: `src/components/` (component-per-feature structure)
- Mock Data: `src/mockData.js` (data store for all screens)
- Memory Records: See `/Users/admin/.claude/projects/-Users-admin-git-burl-demo/memory/MEMORY.md` for implementation patterns and zone nomenclature

---


## MFA Single Product Reslotting
**Epic Tag:** #epic-mfa-single-product

### a-single-products-tab-that-lists-high-demand-skus-

**User Story:** As a warehouse analyst, I want a Single Products tab that lists high‑demand SKUs currently far from staging so that I can evaluate reslotting opportunities for individual items.

#### Related Specifications

**[[FS-701]]: High-Demand SKU Reslotting Opportunities**

High-Demand SKU Reslotting Opportunities
- **Source:** US-42
- **Status:** ✅ Implemented
- **Description:** Single Products tab listing high-demand SKUs currently far from staging for reslotting evaluation.
- **Notes:** Implemented in `MFA.jsx` Single Products tab with opportunity list.

---

### the-master-panel-to-display-for-each-opportunity-t

**User Story:** As a warehouse analyst, I want the master panel to display for each opportunity the current location, suggested prime location, displaced SKU, and net time savings per day so that I can prioritize the opportunities that save the most time.

#### Related Specifications

**[[FS-702]]: Master Panel SKU Details and Time Savings**

Master Panel SKU Details and Time Savings
- **Source:** US-43
- **Status:** ✅ Implemented
- **Description:** Master panel displays current location, suggested location, displaced SKU, and net time savings per day.
- **Notes:** Implemented in Single Products master panel with all required metadata.

---

### reslotting-opportunities-for-single-products-to-be

**User Story:** As a warehouse analyst, I want reslotting opportunities for single products to be displayed as green‑tinted cards sorted by net time savings so that I can quickly identify the most impactful changes.

#### Related Specifications

**[[FS-703]]: Green-Tinted Card Display and Sorting**

Green-Tinted Card Display and Sorting
- **Source:** US-44
- **Status:** ✅ Implemented
- **Description:** Reslotting opportunities displayed as green-tinted cards sorted by net time savings.
- **Notes:** Implemented with green styling and sorting in Single Products tab.

---

### to-accept-bulk-accept-ignore-or-bulk-ignore-single

**User Story:** As a user, I want to accept, bulk‑accept, ignore, or bulk‑ignore single‑product reslotting opportunities so that I can manage the pipeline of changes at scale.

#### Related Specifications

**[[FS-704]]: Accept/Ignore Single-Product Opportunities**

Accept/Ignore Single-Product Opportunities
- **Source:** US-45
- **Status:** ✅ Implemented
- **Description:** Accept, bulk-accept, ignore, or bulk-ignore single-product reslotting opportunities.
- **Notes:** Implemented with action buttons in Single Products master panel.

---

### the-master-panel-to-support-vertical-scrolling-whi

**User Story:** As a user, I want the master panel to support vertical scrolling while remaining readable on a single screen height so that I can navigate many opportunities without losing context.

#### Related Specifications

**[[FS-705]]: Scrollable Master Panel**

Scrollable Master Panel
- **Source:** US-46
- **Status:** ✅ Implemented
- **Description:** Master panel supports vertical scrolling while remaining readable on single screen height.
- **Notes:** Implemented with overflow-y auto on master panel.

---

### a-detail-panel-for-a-selected-single-sku-opportuni

**User Story:** As a warehouse analyst, I want a detail panel for a selected single‑SKU opportunity showing current slot, demand level, and a combobox of alternative locations (each with its current SKU) so that I can explore different slotting scenarios.

#### Related Specifications

**[[FS-706]]: Single-SKU Detail Panel with Location Combobox**

Single-SKU Detail Panel with Location Combobox
- **Source:** US-47
- **Status:** ✅ Implemented
- **Description:** Detail panel for selected SKU shows current slot, demand level, and combobox of alternative locations with resident SKUs.
- **Notes:** Implemented in Single Products detail panel with location selection dropdown.

---

### a-table-of-historical-trips-for-the-selected-sku-s

**User Story:** As a warehouse analyst, I want a table of historical trips for the selected SKU showing current route duration and recalculated duration “if at new location” plus time saved per trip so that I can quantify the benefit of moving the SKU.

#### Related Specifications

**[[FS-707]]: Historical Trip Analysis for Selected SKU**

Historical Trip Analysis for Selected SKU
- **Source:** US-48
- **Status:** ✅ Implemented
- **Description:** Table of historical trips for selected SKU showing current and recalculated duration "if at new location" with time saved per trip.
- **Notes:** Implemented in Single Products detail with trip-level time savings table.

---

### a-second-table-of-historical-trips-for-the-displac

**User Story:** As a warehouse analyst, I want a second table of historical trips for the displaced SKU showing current and recalculated route times as if it moved to the original slot so that I can quantify the cost imposed on that item.

#### Related Specifications

**[[FS-708]]: Displaced SKU Trip Analysis**

Displaced SKU Trip Analysis
- **Source:** US-49
- **Status:** ✅ Implemented
- **Description:** Table of historical trips for displaced SKU showing current and recalculated times at original slot with cost impact.
- **Notes:** Implemented in Single Products detail with displaced SKU trip analysis.

---

### an-impact-summary-that-aggregates-total-savings-av

**User Story:** As a warehouse analyst, I want an impact summary that aggregates total savings, average per trip, average per day, and number of trips for both SKUs and displays net time savings per day so that I can judge whether the move is beneficial overall.

#### Related Specifications

**[[FS-709]]: Impact Summary Aggregation**

Impact Summary Aggregation
- **Source:** US-50
- **Status:** ✅ Implemented
- **Description:** Impact summary aggregating total savings, average per trip, average per day, number of trips, and net time savings.
- **Notes:** Implemented in Single Products detail impact summary section.

---

### all-tables-and-impact-metrics-in-the-single-produc

**User Story:** As a warehouse analyst, I want all tables and impact metrics in the single‑product detail to update dynamically when I select a different alternative location so that I can compare options before committing..

#### Related Specifications

**[[FS-710]]: Dynamic Table and Metric Updates on Location Selection**

Dynamic Table and Metric Updates on Location Selection
- **Source:** US-51
- **Status:** ✅ Implemented
- **Description:** All tables and impact metrics update dynamically when selecting different alternative locations.
- **Notes:** Implemented with real-time recalculation on location combobox change.


## 8. Product Pair Reslotting

---


## MFA Product Pair Reslotting
**Epic Tag:** #epic-mfa-product-pair

### a-product-pairs-tab-that-highlights-pairs-of-skus-

**User Story:** As a warehouse analyst, I want a Product Pairs tab that highlights pairs of SKUs frequently ordered together so that I can co‑locate them and reduce route travel time.

#### Related Specifications

**[[FS-801]]: Product Pair Identification**

Product Pair Identification
- **Source:** US-52
- **Status:** ✅ Implemented
- **Description:** Product Pairs tab highlighting SKU pairs frequently ordered together for co-location to reduce route travel.
- **Notes:** Implemented in `MFA.jsx` Product Pairs tab.

---

### the-master-panel-to-show-for-each-pair-the-skus-th

**User Story:** As a warehouse analyst, I want the master panel to show for each pair the SKUs, their current locations, suggested new locations, displaced SKU(s), and net time savings per day so that I can quickly assess opportunities.

#### Related Specifications

**[[FS-802]]: Product Pair Master Panel Details**

Product Pair Master Panel Details
- **Source:** US-53
- **Status:** ✅ Implemented
- **Description:** Master panel shows SKUs, current locations, suggested locations, displaced SKU(s), and net time savings per day.
- **Notes:** Implemented in Product Pairs master panel with comprehensive pair metadata.

---

### to-accept-bulk-accept-ignore-or-bulk-ignore-produc

**User Story:** As a warehouse analyst, I want to accept, bulk‑accept, ignore, or bulk‑ignore product‑pair reslotting opportunities so that I can manage changes efficiently.

#### Related Specifications

**[[FS-803]]: Accept/Ignore Product Pair Opportunities**

Accept/Ignore Product Pair Opportunities
- **Source:** US-54
- **Status:** ✅ Implemented
- **Description:** Accept, bulk-accept, ignore, or bulk-ignore product-pair reslotting opportunities.
- **Notes:** Implemented with action buttons in Product Pairs master panel.

---

### the-detail-panel-for-a-selected-sku-pair-to-show-n

**User Story:** As a warehouse analyst, I want the detail panel for a selected SKU pair to show number of joint orders in the selected time period, demand rates for each SKU, their current slots, and distance between them so that I understand the operational significance of co‑location.

#### Related Specifications

**[[FS-804]]: Product Pair Detail Panel with Operational Context**

Product Pair Detail Panel with Operational Context
- **Source:** US-55
- **Status:** ✅ Implemented
- **Description:** Detail panel shows joint order count, demand rates, current slots, and distance between SKUs.
- **Notes:** Implemented in Product Pairs detail panel with full operational context.

---

### a-combobox-of-alternative-locations-each-including

**User Story:** As a warehouse analyst, I want a combobox of alternative locations (each including the resident SKU C at slot C and its demand) and the resulting distance between A and B if selected so that I can evaluate different reallocation patterns.

#### Related Specifications

**[[FS-805]]: Alternative Location Combobox with Distance Calculation**

Alternative Location Combobox with Distance Calculation
- **Source:** US-56
- **Status:** ✅ Implemented
- **Description:** Combobox of alternative locations with resident SKU and resulting distance if selected.
- **Notes:** Implemented with dynamic distance calculation in Product Pairs detail.

---

### a-table-that-shows-historical-trips-for-skus-a-and

**User Story:** As a warehouse analyst, I want a table that shows historical trips for SKUs A and B with recalculated route times and differences (for example, picking A and B instead of A alone) so that I can measure the impact of making them co‑located.

#### Related Specifications

**[[FS-806]]: Historical Trip Comparison for SKU Pairs**

Historical Trip Comparison for SKU Pairs
- **Source:** US-57
- **Status:** ✅ Implemented
- **Description:** Table showing historical trips for SKUs A and B with recalculated route times and differences if co-located.
- **Notes:** Implemented in Product Pairs detail with comparative trip analysis.

---

### a-second-table-showing-historical-trips-for-the-di

**User Story:** As a warehouse analyst, I want a second table showing historical trips for the displaced SKU C with recalculated times at its new slot so that I can measure the cost to C.

#### Related Specifications

**[[FS-807]]: Displaced SKU Trip Analysis for Product Pairs**

Displaced SKU Trip Analysis for Product Pairs
- **Source:** US-58
- **Status:** ✅ Implemented
- **Description:** Table showing historical trips for displaced SKU C with recalculated times at new slot.
- **Notes:** Implemented in Product Pairs detail.

---

### an-impact-summary-that-aggregates-savings-from-a-b

**User Story:** As a warehouse analyst, I want an impact summary that aggregates savings from A/B trips, costs for C, and net time savings per day so that I can decide whether to implement the reslot.

#### Related Specifications

**[[FS-808]]: Product Pair Impact Summary**

Product Pair Impact Summary
- **Source:** US-59
- **Status:** ✅ Implemented
- **Description:** Impact summary aggregating savings from A/B trips, costs for C, and net time savings per day.
- **Notes:** Implemented in Product Pairs detail impact summary.

---

### a-grid-showing-an-outer-join-of-historical-orders-

**User Story:** As a warehouse analyst, I want a grid showing an outer join of historical orders for SKUs A and B in the selected period (all A, all B, intersection once) indicating if they were on the same route and estimated time savings if the suggestion had been implemented so that I can understand order‑level effects..

#### Related Specifications

**[[FS-809]]: Historical Order Grid for SKU Pair Analysis**

Historical Order Grid for SKU Pair Analysis
- **Source:** US-60
- **Status:** ❌ Missing
- **Description:** Grid showing outer join of historical orders for SKUs A and B (all A, all B, intersection) with co-location timing and time savings estimates.
- **Notes:** Not implemented in current Product Pairs detail view.


## 9. Product Triplet Reslotting

**[[FS-1310]]: Visual KPI Gauge Display**

Visual KPI Gauge Display
- **Source:** US-90
- **Status:** ⚠️ Partial
- **Description:** KPI cards in handover report support visual formats like gauges with red/yellow/green ranges.
- **Notes:** OTIF has custom SVG gauge; remaining KPI cards (Absenteeism, Labor Planned, Labor Executed) use plain numeric display without gauge visuals.


## Gap Analysis

### Fully Missing (❌) – 8 items

1. **FS-104 – Automatic Photo Capture and Item Detail Extraction (US-4)**
   - Impact: Yard container scanning lacks AI-powered item detail capture
   - Effort: High (requires image processing, AI integration, item database)

2. **FS-207 – Maintenance Schedule Consideration (US-12)**
   - Impact: Labor reassignment suggestions do not account for equipment downtime
   - Effort: Medium (requires maintenance data integration in mock data and recommendation logic)

3. **FS-301 – Dedicated Planned vs Executed Tab (US-13)**
   - Impact: Plan vs Execution screen lacks primary summary view; insights scattered across sub-tabs
   - Effort: High (requires consolidating bar chart data model and variance decomposition logic)

4. **FS-404 – Entity Reference Autocomplete (US-37)**
   - Impact: Natural language queries lack @-prefix autocomplete for entity references
   - Effort: Low (UI enhancement with entity parsing)

5. **FS-503 – MFA Simulation Tab (US-40)**
   - Impact: MFA lacks dedicated simulation space; separate Simulation screen exists but not integrated
   - Effort: Medium (requires refactoring Simulation screen as MFA sub-tab)

6. **FS-809 – Historical Order Grid for SKU Pairs (US-60)**
   - Impact: Product Pair analysis lacks order-level historical context grid
   - Effort: Medium (requires adding grid data model to detail panel)

### Partially Implemented (⚠️) – 15 items

**High Priority (blocks other features or creates user confusion):**

- **FS-101 – Container Recommendation Logic (US-1)**: Recommendation algorithm is mock-data-driven without live PO/workload analysis; per-criterion highlighting missing
- **FS-301–303 – Plan vs Execution Summary (US-13–15)**: Core "Planned vs Executed" bar chart view missing; variance and projection incomplete
- **FS-305, FS-312 – WES Context Integration (US-17, US-24)**: Exception pattern routes lack deep WES integration (conveyor speeds, micro-stoppages)

**Medium Priority (improves polish or completeness):**

- **FS-103 – Per-Criterion Highlighting (US-3)**: UI shows combined recommendation but not individual criterion winners
- **FS-105 – Real-Time Re-estimation (US-5)**: Single trigger instead of continuous update mechanism
- **FS-306 – Suggested Actions Interactivity (US-18)**: Action buttons present but not fully integrated with backend

**Lower Priority (minor gaps or aspirational features):**

- **FS-309, FS-314, FS-321 – Projected Metrics (US-21, US-26)**: Future-looking metrics partially mocked
- **FS-1305 – Markdown Rendering (US-85)**: Textarea supports writing but does not render markdown preview
- **FS-1307, FS-1310 – Handover Report Visuals (US-87, US-90)**: Extra card removal UI implicit; only OTIF gauge implemented


## Implementation Roadmap Suggestions

### Phase 1 – Critical User Experience (Highest Impact)
1. **FS-301–303**: Implement dedicated "Planned vs Executed" summary tab with horizontal bar charts and variance decomposition
2. **FS-101**: Enhance container recommendation with live PO attributes and per-criterion winner highlighting
3. **FS-207**: Add maintenance schedule data and integrate into reassignment logic

### Phase 2 – Feature Completion (Medium Complexity)
1. **FS-404**: Add @-prefix autocomplete to Natural Language Query
2. **FS-503**: Refactor Simulation screen as MFA sub-tab
3. **FS-809**: Add historical order grid to Product Pair detail
4. **FS-305, FS-312**: Deepen WES context integration in Exception Patterns

### Phase 3 – Polish and Refinement (Quality)
1. **FS-105**: Convert single-trigger re-estimation to continuous update mechanism
2. **FS-1305, FS-1310**: Add markdown rendering preview and expanded gauge display for all KPIs
3. **FS-306**: Make suggested actions fully interactive and backend-integrated
4. **FS-103**: Implement per-criterion recommendation highlighting

### Phase 4 – Advanced Features (Future Investment)
1. **FS-104**: Automatic photo capture and item detail extraction (requires AI/ML integration)


## References

- User Stories: `docs/user_stories.md`
- Component Architecture: `src/components/` (component-per-feature structure)
- Mock Data: `src/mockData.js` (data store for all screens)
- Memory Records: See `/Users/admin/.claude/projects/-Users-admin-git-burl-demo/memory/MEMORY.md` for implementation patterns and zone nomenclature

---


## MFA Product Triplet Reslotting
**Epic Tag:** #epic-mfa-product-triplet

### a-product-triplets-tab-that-applies-the-same-co-lo

**User Story:** As a warehouse analyst, I want a Product Triplets tab that applies the same co‑location logic to three SKUs so that I can optimize more complex order bundles.

#### Related Specifications

**[[FS-901]]: Product Triplet Tab**

Product Triplet Tab
- **Source:** US-61
- **Status:** ✅ Implemented
- **Description:** Product Triplets tab applying co-location logic to three SKUs for complex order bundle optimization.
- **Notes:** Implemented in `MFA.jsx` Product Triplets tab.

---

### the-master-and-detail-behavior-for-product-triplet

**User Story:** As a warehouse analyst, I want the master and detail behavior for product triplets to mirror that of product pairs (including net time savings and alternative slot simulations) so that the experience is consistent..

#### Related Specifications

**[[FS-902]]: Product Triplet Behavior Consistency**

Product Triplet Behavior Consistency
- **Source:** US-62
- **Status:** ⚠️ Partial
- **Description:** Master and detail behavior for product triplets mirrors product pairs experience (net time savings, alternative slot simulations).
- **Notes:** Master panel implemented; detail panel may be less feature-complete than product pairs.


## 10. MFA Terminology and Consistency

---


## MFA Terminology & Consistency
**Epic Tag:** #epic-mfa-terminology

### the-mfa-pick-load-box-to-be-renamed-unit-sorter

**User Story:** As a user, I want the MFA “pick & load” box to be renamed “Unit Sorter” so that the terminology matches the process it represents.

#### Related Specifications

**[[FS-1001]]: Unit Sorter Rename**

Unit Sorter Rename
- **Source:** US-63
- **Status:** ✅ Implemented
- **Description:** MFA "pick & load" box renamed to "Unit Sorter" for terminology consistency.
- **Notes:** Implemented in `WarehouseProcessMap.jsx` node labels.

---

### the-throughput-status-in-the-unit-sorter-box-to-us

**User Story:** As a user, I want the throughput status in the “Unit Sorter” box to use the same red‑status styling as the Receiving/Unloading box when performance is poor so that critical issues stand out consistently.

#### Related Specifications

**[[FS-1002]]: Consistent Throughput Status Styling**

Consistent Throughput Status Styling
- **Source:** US-64
- **Status:** ✅ Implemented
- **Description:** Unit Sorter throughput status uses same red-status styling as Receiving/Unloading when performance is poor.
- **Notes:** Implemented with consistent status color logic in Warehouse Process Map nodes.

---

### tooltips-for-the-unit-sorter-box-to-include-key-au

**User Story:** As a user, I want tooltips for the “Unit Sorter” box to include key automation utilization insights such as “Automation Utilization Analysis – Nearing Threshold” and “Current Utilization vs. Threshold” so that I can understand how close the system is to its limits.

#### Related Specifications

**[[FS-1003]]: Unit Sorter Automation Utilization Insights**

Unit Sorter Automation Utilization Insights
- **Source:** US-65
- **Status:** ✅ Implemented
- **Description:** Unit Sorter tooltips include key automation utilization insights (e.g., "Automation Utilization Analysis – Nearing Threshold").
- **Notes:** Implemented in `WarehouseProcessMap.jsx` Unit Sorter node tooltip with automation metrics.

---

### the-labor-management-screen-to-use-process-based-l

**User Story:** As a user, I want the Labor Management screen to use process‑based labels (PTL Order Picking, Cart Pick, Pallet Pick, Shuttle/XDK, Unit sorter) instead of generic zones (A, B, Crossdock, etc.) so that labor views and MFA views use consistent terminology.

#### Related Specifications

**[[FS-1004]]: Labor Management Process-Based Labels**

Labor Management Process-Based Labels
- **Source:** US-66
- **Status:** ✅ Implemented
- **Description:** Labor Management screen uses process-based labels (PTL Order Picking, Cart Pick, Pallet Pick, Shuttle/XDK, Unit Sorter) instead of generic zones.
- **Notes:** Implemented in `LaborManagement.jsx` with updated zone display labels.


## 11. MFA Dialog and LMS Actions

---


## MFA Dialog & LMS Integration
**Epic Tag:** #epic-mfa-dialog-lms

### the-horizontal-bars-for-shuttle-xdk-labor-insights

**User Story:** As a user, I want the horizontal bars for Shuttle/XDK labor insights currently shown on the labor screen to be moved into the bottom of the corresponding MFA tooltip so that AI‑provided Shuttle/XDK insights are available in context with MFA..

---

### a-dialog-box-at-the-bottom-of-the-mfa-screen-simil

**User Story:** As a user, I want a dialog box at the bottom of the MFA screen similar to the one in the Query screen so that I can interact with an agent from within MFA.

#### Related Specifications

**[[FS-1101]]: MFA Dialog Box**

MFA Dialog Box
- **Source:** US-68
- **Status:** ✅ Implemented
- **Description:** Dialog box at bottom of MFA screen similar to Query screen for agent interaction.
- **Notes:** Implemented in `MFA.jsx` with input field and send button.

---

### clicking-on-the-reassign-priya-nair-suggestion-in-

**User Story:** As a user, I want clicking on the “Reassign Priya Nair…” suggestion in the Shuttle/XDK box to auto‑populate the MFA dialog with a standardized text such as “Reassign Priya Nair … and monitor throughput and backlog for the next 1h” so that I can quickly confirm or edit the action.

#### Related Specifications

**[[FS-1102]]: Auto-populated Reassignment Suggestion**

Auto-populated Reassignment Suggestion
- **Source:** US-69
- **Status:** ✅ Implemented
- **Description:** Clicking "Reassign Priya Nair…" suggestion auto-populates MFA dialog with standardized text including worker name and monitoring duration.
- **Notes:** Implemented in Shuttle/XDK tooltip with click-to-fill dialog action.

---

### to-edit-the-generated-statement-in-the-mfa-dialog-

**User Story:** As a user, I want to edit the generated statement in the MFA dialog (for example, change monitoring from 1h to 3h) and send it so that I can adjust recommendations before they are applied to the LMS.

#### Related Specifications

**[[FS-1103]]: Editable Dialog Statement**

Editable Dialog Statement
- **Source:** US-70
- **Status:** ✅ Implemented
- **Description:** Edit generated statement in MFA dialog (e.g., change monitoring from 1h to 3h) and send for LMS processing.
- **Notes:** Implemented with textarea input allowing user modifications before send.

---

### the-agent-to-request-confirmation-before-submittin

**User Story:** As a user, I want the agent to request confirmation before submitting any MFA‑initiated action to the LMS so that I retain final control over automated changes.

#### Related Specifications

**[[FS-1104]]: Confirmation Before LMS Submission**

Confirmation Before LMS Submission
- **Source:** US-71
- **Status:** ✅ Implemented
- **Description:** Agent requests confirmation before submitting MFA-initiated action to LMS to retain final control.
- **Notes:** Implemented with 3-state dialog flow (edit → processing → confirmation).

---

### the-mfa-dialog-textbox-at-the-bottom-to-share-the-

**User Story:** As a user, I want the MFA dialog textbox at the bottom to share the same format and styling as the one in the Query screen so that the interaction model feels consistent.

#### Related Specifications

**[[FS-1105]]: Consistent Dialog Styling**

Consistent Dialog Styling
- **Source:** US-72
- **Status:** ✅ Implemented
- **Description:** MFA dialog textbox shares same format and styling as Query screen dialog.
- **Notes:** Implemented with consistent Tailwind styling across both dialogs.

---

### the-send-button-in-the-mfa-dialog-to-use-a-paper-p

**User Story:** As a user, I want the send button in the MFA dialog to use a paper‑plane icon without text, like the Query screen, so that visual language is standardized.

#### Related Specifications

**[[FS-1106]]: Paper-Plane Send Button Icon**

Paper-Plane Send Button Icon
- **Source:** US-73
- **Status:** ✅ Implemented
- **Description:** Send button uses paper-plane icon without text for visual consistency with Query screen.
- **Notes:** Implemented with paper-plane icon in send button.

---

### a-short-artificial-delay-about-1-second-between-se

**User Story:** As a user, I want a short artificial delay (about 1 second) between sending a request and seeing the response so that the interaction feels realistic for an LLM‑backed workflow.

#### Related Specifications

**[[FS-1107]]: Artificial Response Delay**

Artificial Response Delay
- **Source:** US-74
- **Status:** ✅ Implemented
- **Description:** Short artificial delay (approx. 1 second) between sending request and showing response for realistic LLM workflow feel.
- **Notes:** Implemented with setTimeout delay in dialog processing state.

---

### the-llm-to-rephrase-the-user-s-free-text-request-i

**User Story:** As a system designer, I want the LLM to rephrase the user’s free‑text request into a standardized action representation suitable for MCP tool calls so that downstream systems can consume structured commands reliably..

#### Related Specifications

**[[FS-1108]]: LLM Rephrasing to Standardized Action Format**

LLM Rephrasing to Standardized Action Format
- **Source:** US-75
- **Status:** ✅ Implemented
- **Description:** LLM rephrase user's free-text request into standardized action representation for MCP tool calls.
- **Notes:** Implemented with `buildStandardizedAction()` function parsing natural language into structured action object.


## 12. MFA Warehouse Process Flow Tooltip

---


## MFA Process Flow Visualization
**Epic Tag:** #epic-mfa-process-flow

### clicking-the-unit-sorter-node-in-the-warehouse-pro

**User Story:** As a user, I want clicking the Unit Sorter node in the Warehouse Process Flow diagram to open a tooltip showing backlog (units and hours), throughput versus target, and key metrics (trips/day, average load, transit time, on‑time rate) so that I can understand node performance quickly.

#### Related Specifications

**[[FS-1201]]: Unit Sorter Node Tooltip with Performance Metrics**

Unit Sorter Node Tooltip with Performance Metrics
- **Source:** US-76
- **Status:** ✅ Implemented
- **Description:** Clicking Unit Sorter node opens tooltip showing backlog (units/hours), throughput vs target, and key metrics (trips/day, average load, transit time, on-time rate).
- **Notes:** Implemented in `WarehouseProcessMap.jsx` Unit Sorter node tooltip with metric display.

---

### a-labor-staffing-analysis-section-in-the-unit-sort

**User Story:** As a user, I want a Labor Staffing Analysis section in the Unit Sorter tooltip that shows staffing level, workload vs. capacity (including deficits), and a color‑coded criticality indicator so that I can assess whether staffing is adequate.

#### Related Specifications

**[[FS-1202]]: Labor Staffing Analysis Section**

Labor Staffing Analysis Section
- **Source:** US-77
- **Status:** ✅ Implemented
- **Description:** Labor Staffing Analysis section in Unit Sorter tooltip shows staffing level, workload vs capacity (deficits), and color-coded criticality.
- **Notes:** Implemented in Shuttle/XDK tooltip with staffing bar and capacity/workload visualization.

---

### a-recommendation-card-for-example-rec-001-that-sug

**User Story:** As a user, I want a recommendation card (for example, REC‑001) that suggests specific labor reassignments (such as reassigning a worker from PTL Order Picking to Shuttle/XDK) and expected impact on the deficit so that I have concrete, actionable advice..

#### Related Specifications

**[[FS-1203]]: Labor Reassignment Recommendation Card**

Labor Reassignment Recommendation Card
- **Source:** US-78
- **Status:** ✅ Implemented
- **Description:** Recommendation card (e.g., REC-001) suggests specific labor reassignments and expected impact on deficit.
- **Notes:** Implemented with REC-001 suggestion button and editable reassignment proposals in dialog.


## 13. Handover Report

---


## MFA Handover Report
**Epic Tag:** #epic-mfa-handover

### an-mfa-handover-report-tab-that-lets-me-review-pre

**User Story:** As a shift supervisor, I want an MFA Handover Report tab that lets me review previous reports and create a new one so that I can support orderly shift handovers.

#### Related Specifications

**[[FS-1301]]: Master-Detail Handover Report Layout**

Master-Detail Handover Report Layout
- **Source:** US-79
- **Status:** ✅ Implemented
- **Description:** MFA Handover Report tab with master-detail layout showing past reports on left, selected/new report on right.
- **Notes:** Implemented in `HandoverReport.jsx` with two-panel layout.

---

### a-master-detail-layout-with-a-list-of-past-reports

**User Story:** As a user, I want a master‑detail layout with a list of past reports on the left and the selected or new report on the right so that I can browse and inspect handovers efficiently.

#### Related Specifications

**[[FS-1302]]: Master List with Historical Report Metadata**

Master List with Historical Report Metadata
- **Source:** US-80 & US-81
- **Status:** ✅ Implemented
- **Description:** Master list entries show date, day of week, shift, supervisor name, and key KPIs (OTIF, absenteeism, plan vs executed workload, machine downtime).
- **Notes:** Implemented in HandoverReport master list with sortable columns.

---

### master-list-entries-to-show-date-day-of-week-shift

**User Story:** As a user, I want master list entries to show date, day of week, shift, supervisor name, and key KPIs (OTIF, absenteeism, plan vs executed workload in hours, machine downtime) so that I can quickly scan historical performance.

#### Related Specifications

**[[FS-1302]]: Master List with Historical Report Metadata**

Master List with Historical Report Metadata
- **Source:** US-80 & US-81
- **Status:** ✅ Implemented
- **Description:** Master list entries show date, day of week, shift, supervisor name, and key KPIs (OTIF, absenteeism, plan vs executed workload, machine downtime).
- **Notes:** Implemented in HandoverReport master list with sortable columns.

---

### a-settings-gearbox-control-to-configure-which-fiel

**User Story:** As a user, I want a settings (gearbox) control to configure which fields appear in the master list so that I can tailor the overview to my needs.

#### Related Specifications

**[[FS-1303]]: Master List Field Configuration**

Master List Field Configuration
- **Source:** US-82
- **Status:** ✅ Implemented
- **Description:** Settings (gearbox) control to configure which fields appear in master list.
- **Notes:** Implemented with settings gear icon and column selector.

---

### a-reading-mode-in-the-detail-panel-that-shows-the-

**User Story:** As a supervisor, I want a reading mode in the detail panel that shows the report text (for example, two paragraphs) plus KPI cards so that I can consume previous handovers at a glance.

#### Related Specifications

**[[FS-1304]]: Reading Mode with KPI Cards**

Reading Mode with KPI Cards
- **Source:** US-83 & US-84
- **Status:** ✅ Implemented
- **Description:** Reading mode in detail panel shows report text plus KPI cards matching master list metrics.
- **Notes:** Implemented in HandoverReport detail panel with report text and card display.

---

### standard-kpi-cards-matching-those-in-the-master-al

**User Story:** As a supervisor, I want standard KPI cards (matching those in the master) along with optional shift‑specific cards so that both core and contextual information are visible.

#### Related Specifications

**[[FS-1304]]: Reading Mode with KPI Cards**

Reading Mode with KPI Cards
- **Source:** US-83 & US-84
- **Status:** ✅ Implemented
- **Description:** Reading mode in detail panel shows report text plus KPI cards matching master list metrics.
- **Notes:** Implemented in HandoverReport detail panel with report text and card display.

---

### a-writing-mode-in-the-detail-panel-that-resembles-

**User Story:** As a supervisor, I want a writing mode in the detail panel that resembles an email editor with markdown support so that I can compose nuanced handover narratives.

#### Related Specifications

**[[FS-1305]]: Writing Mode with Markdown Support**

Writing Mode with Markdown Support
- **Source:** US-85
- **Status:** ⚠️ Partial
- **Description:** Writing mode resembles email editor with markdown support for composing handover narratives.
- **Notes:** Writing mode textarea implemented but markdown rendering/preview not yet shown.

**[[FS-1310]]: Visual KPI Gauge Display**

Visual KPI Gauge Display
- **Source:** US-90
- **Status:** ⚠️ Partial
- **Description:** KPI cards in handover report support visual formats like gauges with red/yellow/green ranges.
- **Notes:** OTIF has custom SVG gauge; remaining KPI cards (Absenteeism, Labor Planned, Labor Executed) use plain numeric display without gauge visuals.


## Gap Analysis

### Fully Missing (❌) – 8 items

1. **FS-104 – Automatic Photo Capture and Item Detail Extraction (US-4)**
   - Impact: Yard container scanning lacks AI-powered item detail capture
   - Effort: High (requires image processing, AI integration, item database)

2. **FS-207 – Maintenance Schedule Consideration (US-12)**
   - Impact: Labor reassignment suggestions do not account for equipment downtime
   - Effort: Medium (requires maintenance data integration in mock data and recommendation logic)

3. **FS-301 – Dedicated Planned vs Executed Tab (US-13)**
   - Impact: Plan vs Execution screen lacks primary summary view; insights scattered across sub-tabs
   - Effort: High (requires consolidating bar chart data model and variance decomposition logic)

4. **FS-404 – Entity Reference Autocomplete (US-37)**
   - Impact: Natural language queries lack @-prefix autocomplete for entity references
   - Effort: Low (UI enhancement with entity parsing)

5. **FS-503 – MFA Simulation Tab (US-40)**
   - Impact: MFA lacks dedicated simulation space; separate Simulation screen exists but not integrated
   - Effort: Medium (requires refactoring Simulation screen as MFA sub-tab)

6. **FS-809 – Historical Order Grid for SKU Pairs (US-60)**
   - Impact: Product Pair analysis lacks order-level historical context grid
   - Effort: Medium (requires adding grid data model to detail panel)

### Partially Implemented (⚠️) – 15 items

**High Priority (blocks other features or creates user confusion):**

- **FS-101 – Container Recommendation Logic (US-1)**: Recommendation algorithm is mock-data-driven without live PO/workload analysis; per-criterion highlighting missing
- **FS-301–303 – Plan vs Execution Summary (US-13–15)**: Core "Planned vs Executed" bar chart view missing; variance and projection incomplete
- **FS-305, FS-312 – WES Context Integration (US-17, US-24)**: Exception pattern routes lack deep WES integration (conveyor speeds, micro-stoppages)

**Medium Priority (improves polish or completeness):**

- **FS-103 – Per-Criterion Highlighting (US-3)**: UI shows combined recommendation but not individual criterion winners
- **FS-105 – Real-Time Re-estimation (US-5)**: Single trigger instead of continuous update mechanism
- **FS-306 – Suggested Actions Interactivity (US-18)**: Action buttons present but not fully integrated with backend

**Lower Priority (minor gaps or aspirational features):**

- **FS-309, FS-314, FS-321 – Projected Metrics (US-21, US-26)**: Future-looking metrics partially mocked
- **FS-1305 – Markdown Rendering (US-85)**: Textarea supports writing but does not render markdown preview
- **FS-1307, FS-1310 – Handover Report Visuals (US-87, US-90)**: Extra card removal UI implicit; only OTIF gauge implemented


## Implementation Roadmap Suggestions

### Phase 1 – Critical User Experience (Highest Impact)
1. **FS-301–303**: Implement dedicated "Planned vs Executed" summary tab with horizontal bar charts and variance decomposition
2. **FS-101**: Enhance container recommendation with live PO attributes and per-criterion winner highlighting
3. **FS-207**: Add maintenance schedule data and integrate into reassignment logic

### Phase 2 – Feature Completion (Medium Complexity)
1. **FS-404**: Add @-prefix autocomplete to Natural Language Query
2. **FS-503**: Refactor Simulation screen as MFA sub-tab
3. **FS-809**: Add historical order grid to Product Pair detail
4. **FS-305, FS-312**: Deepen WES context integration in Exception Patterns

### Phase 3 – Polish and Refinement (Quality)
1. **FS-105**: Convert single-trigger re-estimation to continuous update mechanism
2. **FS-1305, FS-1310**: Add markdown rendering preview and expanded gauge display for all KPIs
3. **FS-306**: Make suggested actions fully interactive and backend-integrated
4. **FS-103**: Implement per-criterion recommendation highlighting

### Phase 4 – Advanced Features (Future Investment)
1. **FS-104**: Automatic photo capture and item detail extraction (requires AI/ML integration)


## References

- User Stories: `docs/user_stories.md`
- Component Architecture: `src/components/` (component-per-feature structure)
- Mock Data: `src/mockData.js` (data store for all screens)
- Memory Records: See `/Users/admin/.claude/projects/-Users-admin-git-burl-demo/memory/MEMORY.md` for implementation patterns and zone nomenclature

---

### a-palette-of-preconfigured-cards-such-as-unit-sort

**User Story:** As a supervisor, I want a palette of preconfigured cards (such as unit sorting machines under maintenance, expected return to service, planned labor hours that did not show up) that I can drag and drop into the report so that I can structure key points consistently.

#### Related Specifications

**[[FS-1306]]: Drag-and-Drop Card Palette**

Drag-and-Drop Card Palette
- **Source:** US-86
- **Status:** ✅ Implemented
- **Description:** Palette of preconfigured cards (maintenance schedules, expected return to service, planned labor) draggable into report.
- **Notes:** Implemented in HandoverReport with draggable card bank.

---

### standard-kpi-cards-in-writing-mode-to-be-non-remov

**User Story:** As a supervisor, I want standard KPI cards in writing mode to be non‑removable while allowing additional cards to be added or removed so that key metrics are always present.

#### Related Specifications

**[[FS-1307]]: Non-Removable Standard KPI Cards**

Non-Removable Standard KPI Cards
- **Source:** US-87
- **Status:** ⚠️ Partial
- **Description:** Standard KPI cards non-removable in writing mode while additional cards can be added/removed.
- **Notes:** Standard cards fixed; extra cards removable per design but explicit "remove" UI not clearly surfaced.

**[[FS-1310]]: Visual KPI Gauge Display**

Visual KPI Gauge Display
- **Source:** US-90
- **Status:** ⚠️ Partial
- **Description:** KPI cards in handover report support visual formats like gauges with red/yellow/green ranges.
- **Notes:** OTIF has custom SVG gauge; remaining KPI cards (Absenteeism, Labor Planned, Labor Executed) use plain numeric display without gauge visuals.


## Gap Analysis

### Fully Missing (❌) – 8 items

1. **FS-104 – Automatic Photo Capture and Item Detail Extraction (US-4)**
   - Impact: Yard container scanning lacks AI-powered item detail capture
   - Effort: High (requires image processing, AI integration, item database)

2. **FS-207 – Maintenance Schedule Consideration (US-12)**
   - Impact: Labor reassignment suggestions do not account for equipment downtime
   - Effort: Medium (requires maintenance data integration in mock data and recommendation logic)

3. **FS-301 – Dedicated Planned vs Executed Tab (US-13)**
   - Impact: Plan vs Execution screen lacks primary summary view; insights scattered across sub-tabs
   - Effort: High (requires consolidating bar chart data model and variance decomposition logic)

4. **FS-404 – Entity Reference Autocomplete (US-37)**
   - Impact: Natural language queries lack @-prefix autocomplete for entity references
   - Effort: Low (UI enhancement with entity parsing)

5. **FS-503 – MFA Simulation Tab (US-40)**
   - Impact: MFA lacks dedicated simulation space; separate Simulation screen exists but not integrated
   - Effort: Medium (requires refactoring Simulation screen as MFA sub-tab)

6. **FS-809 – Historical Order Grid for SKU Pairs (US-60)**
   - Impact: Product Pair analysis lacks order-level historical context grid
   - Effort: Medium (requires adding grid data model to detail panel)

### Partially Implemented (⚠️) – 15 items

**High Priority (blocks other features or creates user confusion):**

- **FS-101 – Container Recommendation Logic (US-1)**: Recommendation algorithm is mock-data-driven without live PO/workload analysis; per-criterion highlighting missing
- **FS-301–303 – Plan vs Execution Summary (US-13–15)**: Core "Planned vs Executed" bar chart view missing; variance and projection incomplete
- **FS-305, FS-312 – WES Context Integration (US-17, US-24)**: Exception pattern routes lack deep WES integration (conveyor speeds, micro-stoppages)

**Medium Priority (improves polish or completeness):**

- **FS-103 – Per-Criterion Highlighting (US-3)**: UI shows combined recommendation but not individual criterion winners
- **FS-105 – Real-Time Re-estimation (US-5)**: Single trigger instead of continuous update mechanism
- **FS-306 – Suggested Actions Interactivity (US-18)**: Action buttons present but not fully integrated with backend

**Lower Priority (minor gaps or aspirational features):**

- **FS-309, FS-314, FS-321 – Projected Metrics (US-21, US-26)**: Future-looking metrics partially mocked
- **FS-1305 – Markdown Rendering (US-85)**: Textarea supports writing but does not render markdown preview
- **FS-1307, FS-1310 – Handover Report Visuals (US-87, US-90)**: Extra card removal UI implicit; only OTIF gauge implemented


## Implementation Roadmap Suggestions

### Phase 1 – Critical User Experience (Highest Impact)
1. **FS-301–303**: Implement dedicated "Planned vs Executed" summary tab with horizontal bar charts and variance decomposition
2. **FS-101**: Enhance container recommendation with live PO attributes and per-criterion winner highlighting
3. **FS-207**: Add maintenance schedule data and integrate into reassignment logic

### Phase 2 – Feature Completion (Medium Complexity)
1. **FS-404**: Add @-prefix autocomplete to Natural Language Query
2. **FS-503**: Refactor Simulation screen as MFA sub-tab
3. **FS-809**: Add historical order grid to Product Pair detail
4. **FS-305, FS-312**: Deepen WES context integration in Exception Patterns

### Phase 3 – Polish and Refinement (Quality)
1. **FS-105**: Convert single-trigger re-estimation to continuous update mechanism
2. **FS-1305, FS-1310**: Add markdown rendering preview and expanded gauge display for all KPIs
3. **FS-306**: Make suggested actions fully interactive and backend-integrated
4. **FS-103**: Implement per-criterion recommendation highlighting

### Phase 4 – Advanced Features (Future Investment)
1. **FS-104**: Automatic photo capture and item detail extraction (requires AI/ML integration)


## References

- User Stories: `docs/user_stories.md`
- Component Architecture: `src/components/` (component-per-feature structure)
- Mock Data: `src/mockData.js` (data store for all screens)
- Memory Records: See `/Users/admin/.claude/projects/-Users-admin-git-burl-demo/memory/MEMORY.md` for implementation patterns and zone nomenclature

---

### to-be-able-to-submit-a-handover-report-but-still-e

**User Story:** As a supervisor, I want to be able to submit a handover report but still edit it until a lock time (for example, 1 hour after the next shift’s end) so that I can refine it after the shift closes.

#### Related Specifications

**[[FS-1308]]: Editable Report Until Lock Time**

Editable Report Until Lock Time
- **Source:** US-88
- **Status:** ✅ Implemented
- **Description:** Submit handover report but still edit until lock time (e.g., 1 hour after next shift's end).
- **Notes:** Implemented with submit button and editable-until-lock logic.

---

### example-text-such-as-accomplished-the-shift-s-plan

**User Story:** As a user, I want example text such as “accomplished the shift’s plan” or “the 12:30 truck to Atlanta departed late due to unit sorter downtime” to be easy to express and stored as part of the report so that context behind KPIs is preserved.

#### Related Specifications

**[[FS-1309]]: Example Text and Context Preservation**

Example Text and Context Preservation
- **Source:** US-89
- **Status:** ✅ Implemented
- **Description:** Example text (e.g., "accomplished the shift's plan", "12:30 truck to Atlanta departed late due to downtime") easily expressed and stored.
- **Notes:** Implemented with report text textarea preserving narrative context.

---

### kpi-cards-in-the-handover-report-for-example-otif-

**User Story:** As a user, I want KPI cards in the handover report (for example, OTIF) to support visual formats like gauges with red/yellow/green ranges so that I can quickly assess performance..

#### Related Specifications

**[[FS-1310]]: Visual KPI Gauge Display**

Visual KPI Gauge Display
- **Source:** US-90
- **Status:** ⚠️ Partial
- **Description:** KPI cards in handover report support visual formats like gauges with red/yellow/green ranges.
- **Notes:** OTIF has custom SVG gauge; remaining KPI cards (Absenteeism, Labor Planned, Labor Executed) use plain numeric display without gauge visuals.


## Gap Analysis

### Fully Missing (❌) – 8 items

1. **FS-104 – Automatic Photo Capture and Item Detail Extraction (US-4)**
   - Impact: Yard container scanning lacks AI-powered item detail capture
   - Effort: High (requires image processing, AI integration, item database)

2. **FS-207 – Maintenance Schedule Consideration (US-12)**
   - Impact: Labor reassignment suggestions do not account for equipment downtime
   - Effort: Medium (requires maintenance data integration in mock data and recommendation logic)

3. **FS-301 – Dedicated Planned vs Executed Tab (US-13)**
   - Impact: Plan vs Execution screen lacks primary summary view; insights scattered across sub-tabs
   - Effort: High (requires consolidating bar chart data model and variance decomposition logic)

4. **FS-404 – Entity Reference Autocomplete (US-37)**
   - Impact: Natural language queries lack @-prefix autocomplete for entity references
   - Effort: Low (UI enhancement with entity parsing)

5. **FS-503 – MFA Simulation Tab (US-40)**
   - Impact: MFA lacks dedicated simulation space; separate Simulation screen exists but not integrated
   - Effort: Medium (requires refactoring Simulation screen as MFA sub-tab)

6. **FS-809 – Historical Order Grid for SKU Pairs (US-60)**
   - Impact: Product Pair analysis lacks order-level historical context grid
   - Effort: Medium (requires adding grid data model to detail panel)

### Partially Implemented (⚠️) – 15 items

**High Priority (blocks other features or creates user confusion):**

- **FS-101 – Container Recommendation Logic (US-1)**: Recommendation algorithm is mock-data-driven without live PO/workload analysis; per-criterion highlighting missing
- **FS-301–303 – Plan vs Execution Summary (US-13–15)**: Core "Planned vs Executed" bar chart view missing; variance and projection incomplete
- **FS-305, FS-312 – WES Context Integration (US-17, US-24)**: Exception pattern routes lack deep WES integration (conveyor speeds, micro-stoppages)

**Medium Priority (improves polish or completeness):**

- **FS-103 – Per-Criterion Highlighting (US-3)**: UI shows combined recommendation but not individual criterion winners
- **FS-105 – Real-Time Re-estimation (US-5)**: Single trigger instead of continuous update mechanism
- **FS-306 – Suggested Actions Interactivity (US-18)**: Action buttons present but not fully integrated with backend

**Lower Priority (minor gaps or aspirational features):**

- **FS-309, FS-314, FS-321 – Projected Metrics (US-21, US-26)**: Future-looking metrics partially mocked
- **FS-1305 – Markdown Rendering (US-85)**: Textarea supports writing but does not render markdown preview
- **FS-1307, FS-1310 – Handover Report Visuals (US-87, US-90)**: Extra card removal UI implicit; only OTIF gauge implemented


## Implementation Roadmap Suggestions

### Phase 1 – Critical User Experience (Highest Impact)
1. **FS-301–303**: Implement dedicated "Planned vs Executed" summary tab with horizontal bar charts and variance decomposition
2. **FS-101**: Enhance container recommendation with live PO attributes and per-criterion winner highlighting
3. **FS-207**: Add maintenance schedule data and integrate into reassignment logic

### Phase 2 – Feature Completion (Medium Complexity)
1. **FS-404**: Add @-prefix autocomplete to Natural Language Query
2. **FS-503**: Refactor Simulation screen as MFA sub-tab
3. **FS-809**: Add historical order grid to Product Pair detail
4. **FS-305, FS-312**: Deepen WES context integration in Exception Patterns

### Phase 3 – Polish and Refinement (Quality)
1. **FS-105**: Convert single-trigger re-estimation to continuous update mechanism
2. **FS-1305, FS-1310**: Add markdown rendering preview and expanded gauge display for all KPIs
3. **FS-306**: Make suggested actions fully interactive and backend-integrated
4. **FS-103**: Implement per-criterion recommendation highlighting

### Phase 4 – Advanced Features (Future Investment)
1. **FS-104**: Automatic photo capture and item detail extraction (requires AI/ML integration)


## References

- User Stories: `docs/user_stories.md`
- Component Architecture: `src/components/` (component-per-feature structure)
- Mock Data: `src/mockData.js` (data store for all screens)
- Memory Records: See `/Users/admin/.claude/projects/-Users-admin-git-burl-demo/memory/MEMORY.md` for implementation patterns and zone nomenclature

---

## Summary

- **Total User Stories:** 90
- **Total Functional Specs:** 87
- **Total Epics:** 12

**Implementation Status:**
- ✅ Done: 65 specs
- ⚠️ In Progress: 15 specs
- ❌ Todo: 8 specs
