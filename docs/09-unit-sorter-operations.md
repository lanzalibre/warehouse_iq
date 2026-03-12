# Unit Sorter Operations — User Story & Implementation Guide

## Overview

The Unit Sorter represents the automated core of warehouse outbound operations. Managing sorter capacity, task allocation, and equipment maintenance directly impacts throughput and reduces manual rework. This document describes the user story, operational issues, task allocation strategies, maintenance workflows, and exception handling system.

---

## User Story

**As a** Warehouse Operations Manager (Jordan Chen - Inbound Manager, supporting outbound coordination)
**I want to** dynamically allocate sorting tasks to available sorters while managing equipment maintenance and handling exceptions
**So that** I can maximize throughput, minimize mis-sorts, and prevent equipment failures during peak volume periods.

### Scenario
During a peak shipping window, orders arrive from multiple picking zones (PTL Order Picking, Cart Pick, Pallet Pick) destined for different distribution channels. The Sorter must:
1. Accept incoming item streams from all pickers
2. Route items to correct output chutes based on order destination
3. Detect mis-sorts and reroute to manual staging
4. Schedule maintenance windows without causing bottlenecks
5. Rebalance load across multiple sorter units if available

---

## Issues Identified

### 1. Sorter Capacity vs. Demand Mismatch
- **Current Utilization**: 62% (moderate, but peak periods exceed 85%)
- **Throughput**: 18 pallets/h (target: 21 pallets/h)
- **Gap**: -14% below target (3 pallets/h shortfall)
- **Root Cause**: Uneven wave releases from picking zones create burst demand
- **Impact**: Backlog builds; orders miss shipping windows; automation underutilized

### 2. Task Allocation Complexity
- **Input Streams**: 3 picking zones (PTL, Cart Pick, Pallet Pick) → Unit Sorter
- **Output Destinations**: Distribution DCs, Retail Stores, Direct Customers
- **Rules**: Sort by order destination, then by carrier requirements
- **Challenge**: Manual wave planning doesn't account for real-time sorter state
- **Result**: Sorter stalls waiting for input; pickers starve waiting for space

### 3. Equipment Maintenance Pressure
- **Maintenance Need**: Daily visual inspections, lubrication, sensor checks
- **Current Approach**: Reactive (wait for fault alert)
- **Downtime Cost**: Each unplanned stop loses 18 pallets/h throughput
- **Visibility Gap**: No predictive alerts; maintenance delays are discovered too late

### 4. Exception Handling Gaps
- **Mis-sorts**: Items routed to wrong chute (~2-3% error rate)
- **Current Process**: Manual rework in staging; slow to identify root cause
- **Impact**:
  - +$200 per incident (rework labor)
  - Delayed shipments
  - Customer returns
- **Desired**: Automated detection with immediate reroute to manual staging

---

## Operational Issues Display in MFA

### Warehouse Process Flow (Node Tooltip)

When users click the **Unit Sorter node** in the Warehouse Process Flow diagram:

1. **Node Tooltip** shows:
   - Throughput: 18 pallets/h (target: 21)
   - Task Queue: 45 pending items (2.5h backlog)
   - Key metrics: Utilization (62%), error rate (2.3%), avg cycle time
   - Equipment Status: "Operational — maintenance due in 6 hours"

2. **Automation Utilization Analysis** section displays:
   - Current Utilization: 62%
   - Utilization Threshold: 85%
   - Days Above 85%: 2 (recent peak periods)
   - Impact: 21% throughput loss, $7000 in missed revenue
   - Color indicator: **YELLOW** (borderline; watch for peaks)

3. **Maintenance Status Card**:
   - Last Inspection: 3 hours ago
   - Next Preventive: 6 hours remaining
   - Outstanding Alerts: 1 (belt tension warning)
   - Color indicator: **AMBER** (maintenance window needed soon)

4. **Exception Summary Card**:
   - Recent Mis-sorts: 2 in last hour
   - Manual Rework Queue: 8 items
   - Root Cause: Chute mapping update lag (2-minute sync delay)
   - Recommended Action: Force full sync, validate chute assignments

---

## Task Allocation Strategy (REC-002)

### Primary Recommendation: Wave Optimization

**REC-002: Rebalance Wave Release Schedule**
- **Current State**: All zones release simultaneously → sorter peaks then starves
- **Proposed**: Stagger releases (PTL +0h, Cart Pick +5min, Pallet Pick +10min)
- **Expected Impact**: Smooths input stream; maintains 18→20 pallets/h
- **Implementation Duration**: 15 minutes to update WES scheduler
- **Risk**: Low (reversible; no equipment changes)
- **Urgency**: High

### Dynamic Task Allocation Flow

**When Order Wave Arrives**:
```
WES receives order batch
  ↓
Check sorter capacity (utilization < 85%)
  ↓
If available: Assign to primary sorter
  ↓
If primary overloaded: Route to secondary sorter (if present)
  ↓
If all full: Queue with estimated wait time (shown to picking manager)
  ↓
Begin sorting with chute mapping from order config
```

**Workload Balancing** (multi-sorter scenario):
- **Sorter A**: 62% utilization (18 pallets/h)
- **Sorter B**: 45% utilization (14 pallets/h)
- **Action**: Allocate new wave to Sorter B until balanced (~55% each)
- **Result**: Combined 32 pallets/h vs. sequential 18 pallets/h

### Exception Handling During Wave Processing

**Mis-sort Detection**:
```
Item scanned at output chute
  ↓
Chute ID doesn't match order destination → FLAG
  ↓
WES triggers exception alert (visual + message)
  ↓
Operator diverts item to manual rework staging
  ↓
Root cause logged: chute mapping lag, sensor misread, etc.
  ↓
Corrective action initiated (resync, sensor clean, training)
```

**Reroute Logic**:
- **Light Mis-sort**: 1-2 items → immediate manual rework queue
- **Persistent Pattern**: 3+ mis-sorts from same chute → pause that chute, alert maintenance
- **Unknown Item**: Can't decode barcode → reject to inbound staging, flag for manual decode

---

## Maintenance Workflow

### Daily Routine (REC-003: Scheduled Maintenance Window)

**REC-003: Schedule 30-Minute Maintenance Window**
- **When**: 18:00–18:30 (between major wave cycles)
- **What**:
  - Visual belt inspection (debris, fraying)
  - Lubrication check on drive chain
  - Sensor cleaning (photo-eye lenses)
  - Clear fault code log from WES
- **Expected Downtime**: 30 minutes (planned)
- **Lost Throughput**: 9 pallets (18 pallets/h × 0.5h)
- **Benefit**: Prevents emergency shutdown (−18 pallets/h unplanned)
- **ROI**: Trade 9 pallets for guaranteed uptime across peak evening window

### Preventive Maintenance Calendar

**WES Integration**:
- System tracks maintenance intervals (belt tension, bearing grease, sensor calibration)
- Alerts manager 6 hours before due date
- Suggests maintenance window options (low-utilization periods)
- Logs all actions: time, technician, parts replaced, downtime

**Alert Escalation**:
- **Info**: "Maintenance due in 6 hours" (yellow badge)
- **Warning**: "Maintenance overdue by 2 hours" (orange badge)
- **Critical**: "System fault detected; maintenance urgent" (red badge)

### Reactive Maintenance (Exception Handling)

**Fault Alert** (e.g., "Belt Tension Warning"):
```
WES detects fault code
  ↓
Alert sent to manager (high priority)
  ↓
Manager can:
  Option A: Schedule maintenance window now
  Option B: Continue (increased failure risk)
  Option C: Divert tasks to secondary sorter
  ↓
If fault escalates: Auto-divert tasks + halt sorter
```

---

## Task Allocation Monitoring

### KPI Monitor — Task Allocation & Utilization

After releasing a wave or rebalancing task allocation, the **KPI Monitor** tracks three key metrics over a 1-hour window:

#### Chart Structure
- **Title**: "Unit Sorter Monitoring — Wave Allocation Tracking" with **● Live** indicator badge
- **Time Window**: Current shift + 1 hour (e.g., 17:00 → 18:00)
- **Data Granularity**: 5-minute intervals
- **Total Data Points**: 12 points for 1-hour window

#### Partial Data Visualization (Live Monitoring Effect)
- **Data Region**: First 1/3 of time axis (~20 minutes) shows actual values
- **Empty Region**: Remaining 2/3 (~40 minutes) left empty (null values)
- **Purpose**: Shows live tracking; more metrics incoming

#### Three Tracked Metrics

**1. Sorter Throughput (pallets/h) — Left Y-Axis**
- **Line Color**: Blue
- **Target**: 21 pallets/hour (green dashed line)
- **Starting Point**: 18 pallets/hour
- **Expected Trend**: After wave rebalancing, ramps toward 20–21/h
- **Data**: `throughput: null` after first third

**2. Queue Depth (items pending) — Right Y-Axis (secondary)**
- **Line Color**: Orange
- **Target**: ≤ 30 items (acceptable queue size)
- **Starting Point**: 45 pending items
- **Expected Trend**: Drops as sorter processes backlog
- **Data**: `queueDepth: null` after first third

**3. Utilization % — Secondary (overlay as shaded region)**
- **Region Color**: Light amber (62%) → deeper amber if spike to 85%
- **Purpose**: Visual indicator of sorter stress
- **Target Zone**: 60–75% (optimal range)
- **Warning Zone**: >85% (overload imminent)

#### Implementation Details

**Data Generation** (`generateAllocationChartData` function):
```js
const hours = 1
const intervalMin = 5
const points = 12
const filledPoints = Math.ceil(12 / 3) = 4

// Loop through 12 time slots:
// Slots 0-3: populate with actual values based on wave data
// Slots 4-11: return { throughput: null, queueDepth: null }

// Throughput progresses: 18 → 19 → 20 → 20.5
// Queue depth decreases: 45 → 38 → 30 → 24
// Utilization: 62% → 59% → 56% → 54%
```

**Chart Rendering**:
- Recharts ComposedChart with two Y-axes (left: throughput, right: queue)
- Lines stop at slot 3; remaining slots appear empty
- Utilization rendered as semi-transparent shaded region (background)
- Reference lines span full chart

#### Live Badge
- **Style**: Green pill badge (#dcfce7 background, #16a34a text)
- **Icon**: Animated green dot
- **Appearance**: `● Live`

---

## View in Action History

### Navigation
1. Submit REC-002 (wave rebalancing) to WES
2. Confirmation message: "Wave rebalancing queued"
3. Click "Monitor Task Allocation in Action History"
4. **Action History tab** shows:
   - Timeline entry: "Rebalance wave release — stagger PTL/Cart/Pallet picks" (17:00)
   - KPI Monitor chart with partial data (first 1/3)
   - Other entries: maintenance window scheduled, mis-sort exception, etc.

### Exception Timeline
```
17:05 — Wave allocation updated (REC-002)
17:08 — Mis-sort detected (chute 4) → operator reroute
17:10 — KPI Monitor shows throughput +1 pallet/h (effect visible)
17:15 — Maintenance alert: "Belt inspection due in 3h"
17:20 — Queue depth drops below 30 items (target reached)
```

---

## Data Flow

### 1. User Interaction (Wave Release)

```
Manager opens Unit Sorter node detail
  → Sees queue depth, utilization, pending maintenance
  → Clicks REC-002 "Rebalance Wave Release"
  → WES dialog shows current release schedule
  → Manager adjusts timing (PTL +0m, Cart +5m, Pallet +10m)
  → Submits to WES
  → Confirmation: "Wave allocation updated"
  → Action queued, task allocation monitoring initiated
```

### 2. Sorter Processing Loop

```
Wave enters sorter system
  ↓
Each item scanned at input
  ↓
Chute assignment calculated (order dest. + carrier rules)
  ↓
Item routed to chute
  ↓
Chute sensor confirms output (success) or flags mis-sort
  ↓
Throughput counted; queue depth decremented
  ↓
If error: reroute to manual staging; log exception
  ↓
KPI Monitor updated (5-min intervals)
```

### 3. Data Generation

```
generateAllocationChartData(allocation='wave-001', duration='1h')
  → Creates 12 time slots
  → Fills first 4 with calculated throughput/queue
  → Sets remaining 8 to null
  → Returns array to KPIMonitoringChart
```

---

## Mock Data Structure

### Unit Sorter Node Data

```javascript
{
  id: 'pick_and_load',
  label: 'Unit Sorter',
  throughput: { value: 18, unit: 'pallets/h', target: 21 },
  queueDepth: { value: 45, unit: 'items', target: '≤30' },
  utilization: { value: 62, unit: '%', threshold: 85 },
  maintenanceStatus: {
    lastInspection: '3 hours ago',
    nextDue: 'in 6 hours',
    alerts: ['Belt tension warning'],
    urgency: 'high'
  },
  automationUtilization: {
    current: 62,
    threshold: 85,
    daysAbove85: 2,
    impactPct: 21,
    impactDollars: 7000
  }
}
```

### Wave Allocation Data

```javascript
{
  actionHistory: [
    {
      id: 'action-002',
      action: 'Rebalance wave release — stagger PTL/Cart/Pallet picks',
      system: 'WES',
      timestamp: '17:00',
      allocation: {
        ptlDelay: '0m',
        cartDelay: '5m',
        palletDelay: '10m',
      },
      kpiMetrics: {
        duration: '1h',
        chartData: [/* 12 data points, first 4 filled */]
      }
    }
  ]
}
```

---

## Exception Handling Examples

### Example 1: Mis-Sort Detection & Reroute

```
17:08:15 — Item ABC123 scanned at chute 4 (Distribution DC)
           Order routing says: should be chute 2 (Retail)
           ↓
           WES flags: "Mis-sort detected"
           ↓
           Operator sees alert: "Item ABC123 → Manual Staging"
           ↓
           Operator diverts item to manual rework bin
           ↓
           WES logs: Root cause TBD (chute mapping lag vs. barcode misread)
           ↓
           Action History shows exception + rework destination
```

### Example 2: Persistent Chute Fault

```
17:12:00 — Mis-sort #1 (chute 7)
17:13:30 — Mis-sort #2 (chute 7)
17:15:00 — Mis-sort #3 (chute 7) ← Pattern detected
           ↓
           WES escalates: "Chute 7 error rate >5%"
           ↓
           Alert to manager: "Pause chute 7 + inspect sensor"
           ↓
           Manager can: pause chute, divert wave, or call maintenance
           ↓
           Decision: Pause chute 7, re-route pending items to manual staging
           ↓
           Maintenance arrives, cleans photo-eye sensor
           ↓
           Chute 7 resumed; throughput continues
```

### Example 3: Maintenance Window Coordination

```
18:00 — Maintenance window begins (pre-scheduled REC-003)
        ↓
        WES pauses new wave releases
        ↓
        Current sorter wave completes (~5 min remaining)
        ↓
        Technician performs:
        - Belt visual inspection ✓
        - Lubrication check ✓
        - Sensor lens cleaning ✓
        - Fault log cleared ✓
        ↓
        Downtime: 28 minutes (planned)
        ↓
        18:28 — Sorter resumed; new waves queued
        ↓
        Evening peak period protected from unexpected shutdown
```

---

## Testing Checklist

When testing or extending this feature:

- [ ] **Node Click**: Unit Sorter tooltip shows utilization, queue, maintenance status
- [ ] **Automation Utilization**: Displays current %, threshold, days >85%, impact
- [ ] **Maintenance Card**: Shows last inspection time, next due, alert count
- [ ] **REC-002 Display**: Button shows "Rebalance wave release" option
- [ ] **WES Dialog**: Opens with current release schedule, allows adjustment
- [ ] **Wave Submission**: Confirmation shows allocation changes
- [ ] **Action History**: Navigation link works, shows action entry
- [ ] **KPI Chart Title**: Shows "● Live" badge
- [ ] **Chart Data**: First 1/3 shows throughput/queue lines, remaining 2/3 empty
- [ ] **Target Lines**: Reference lines (21 pallets/h, ≤30 items) visible
- [ ] **Exception Alert**: Mis-sort triggers visual alert + reroute option
- [ ] **Maintenance Alert**: 6-hour pre-alert shows yellow badge
- [ ] **Responsive**: Chart scales to container width
- [ ] **Multiple Waves**: History shows multiple allocation entries with own charts

---

## Future Enhancements

1. **Multi-Sorter Load Balancing**: Distribute waves across 2+ physical sorters
2. **Predictive Throughput**: ML model forecasts sorter output based on order mix
3. **Automated Reroute**: System auto-diverts mis-sorts without operator input
4. **Spare Parts Inventory**: Track belt, sensor, bearing stock; auto-reorder
5. **Energy Optimization**: Adjust sorter speed based on backlog (slower = less power)
6. **Chute Mapping Sync**: Real-time carrier + destination rules (currently batch)
7. **Quality Analytics**: Track mis-sort root causes (barcode, sensor, mapping lag)
8. **Mobile Alerts**: Push notifications for maintenance due, exception escalations
9. **Simulation Mode**: Test wave release schedules before executing

---

## Related Documentation

- **Features Reference**: [05-features.md](./05-features.md) — MFA overview
- **Shuttle/XDK User Story**: [08-shuttle-xdk-user-story.md](./08-shuttle-xdk-user-story.md) — Labor allocation pattern (similar approach)
- **User Flows**: [07-user-flows.md](./07-user-flows.md) — MFA interaction patterns
- **Components**: [02-components.md](./02-components.md) — Process map, node details
- **Quick Reference**: [06-quick-reference.md](./06-quick-reference.md) — System abbreviations (WES, WMS, TMS)
