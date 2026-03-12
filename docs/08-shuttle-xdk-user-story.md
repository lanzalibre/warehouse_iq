# Shuttle/XDK Labor Crisis — User Story & Implementation Guide

## Overview

The Shuttle/XDK zone represents a critical bottleneck in warehouse operations. During peak workload periods, the zone experiences severe understaffing, creating OTIF (On-Time In-Full) risk and requiring immediate labor rebalancing actions. This document describes the user story, issues, recommendations, actions, and monitoring system.

---

## User Story

**As a** Warehouse Manager (Jordan Chen - Inbound Manager)
**I want to** identify labor imbalances across zones and quickly reassign workers to prevent shipping delays
**So that** I can maintain service levels and protect OTIF targets under volatile workload conditions.

### Scenario
A container arrives with significant cold-chain items (frozen products) that must be processed in the Shuttle/XDK crossdock bay immediately. The initial estimate predicted 14 hours of work, but the zone only has 1 worker checked in (out of 22 assigned), representing a -6.2 hour **deficit** (capacity 7.8h − workload 14h).

---

## Issues Identified

### 1. Critical Labor Deficit
- **Zone**: Shuttle/XDK (Zone D)
- **Staffing**: 1 / 22 workers checked in (5%)
- **Shift Workload**: 14 hours estimated
- **Shift Capacity**: 7.8 hours available
- **Deficit**: -6.2 hours (understaffed by 44%)
- **Impact**: Cannot complete cold-chain processing in shift; OTIF at risk

### 2. Uneven Zone Staffing
- **Surplus Zones**: PTL Order Picking has +8.4 hours surplus capacity
- **Root Cause**: Workload distribution from inbound unloading creates uneven demand
- **Visibility Gap**: Planners don't see real-time surplus/deficit until action triggers

### 3. Throughput Impact
- **Target Throughput**: 16 trips/hour
- **Current Throughput**: 12 trips/hour
- **Gap**: -20% below target (4 trips/hour shortfall)
- **Cause**: Fewer workers → fewer shuttle cycles → backlog builds

---

## Issues Display in MFA

### Warehouse Process Flow (Node Tooltip)
When users click the **Shuttle/XDK node** in the Warehouse Process Flow diagram:

1. **Node Tooltip** shows:
   - Backlog: 42 units (1.5h)
   - Throughput: 12 trips/h (target: 16)
   - Key metrics: trips/day, avg load, transit time, on-time rate

2. **Labor Staffing Analysis** section displays:
   - Staffing: 1 / 22 workers · 5%
   - **Workload vs. Capacity**:
     - Workload: 0 h done / 14 h est.
     - Capacity: 7.8 h available · **-6.2 h deficit** (red badge)
   - Color indicator: **CRITICAL** (red)

3. **Recommendation Card (REC-001)**:
   - Suggests reassigning **Priya Nair** (8 months experience)
   - From: PTL Order Picking (surplus zone)
   - To: Shuttle/XDK (deficit zone)
   - Expected impact: Closes most of the Shuttle/XDK deficit

---

## Recommendations (REC-001)

### Primary Recommendation: Worker Reassignment

**REC-001: Reassign Priya Nair**
- **Worker**: Priya Nair (ID: W007)
- **Experience**: 8 months (Competent level)
- **From Zone**: PTL Order Picking
- **To Zone**: Shuttle/XDK
- **Reason**: PTL has +8.4h surplus; Shuttle/XDK has -6.2h deficit
- **Expected Impact**: Adds ~7.8h capacity per shift, reduces deficit to near-zero
- **Risk**: Low (Competent-level worker; not taking from critical zone)
- **Urgency**: CRITICAL

### Decision Flow
Users click **REC-001 button** → LMS dialog opens → Can edit/confirm → Submit to LMS → Action tracked in Action History with KPI monitoring

---

## Actions Available

### 1. Immediate: Worker Reassignment (Recommended)
- **Action**: Reassign Priya Nair from PTL Order Picking to Shuttle/XDK
- **Duration**: 1 hour (current shift)
- **Metrics Tracked**: throughput_per_hour, backlog_units
- **Status**: Queued for LMS processing
- **Trigger**: REC-001 button click → LMS dialog submission

### 2. Mitigation Option: Overtime Approval
- **Action**: Approve overtime for Shuttle/XDK team
- **Service Impact**: +0.8% OTIF recovery (protected)
- **Cost**: +$12K labor cost
- **Risk**: Low
- **Recommendation**: Recommended (vs. other options)

### 3. Mitigation Option: Pull Forward
- **Action**: Accelerate lower-priority work to following day
- **Service Impact**: Short-term throughput lift today
- **Cost**: +$5K handling cost
- **Risk**: Downstream supply chain impact in 48–72 hours
- **Recommendation**: Caution (higher risk)

---

## Monitoring System

### KPI Monitor — Reassignment Tracking

After submitting an action to the LMS, the **KPI Monitor** tracks two key metrics over a 1-hour monitoring window:

#### Chart Structure
- **Title**: "KPI Monitor — Reassignment Tracking" with **● Live** indicator badge
- **Time Window**: Current shift + 1 hour (e.g., 18:56 → 19:56)
- **Data Granularity**: 5-minute intervals
- **Total Data Points**: 12 points for 1-hour window

#### Partial Data Visualization (Live Monitoring Effect)
- **Data Region**: First 1/3 of time axis (~20 minutes) shows actual values
- **Empty Region**: Remaining 2/3 (~40 minutes) left empty (null values)
- **Purpose**: Visually communicates that monitoring is ongoing; more data will arrive
- **User Perception**: "System is actively tracking; results coming in real-time"

#### Two Tracked Metrics

**1. Throughput (units/h) — Left Y-Axis**
- **Line Color**: Blue
- **Target**: 21 trips/hour (green dashed line)
- **Starting Point**: 14 trips/hour
- **Expected Trend**: Ramps upward toward 21/h as reassigned worker settles in
- **Data**: `throughput: null` after first third; line stops plotting

**2. Backlog (units) — Right Y-Axis**
- **Line Color**: Orange
- **Target**: 1500 units (orange dashed line)
- **Starting Point**: ~6200 units
- **Expected Trend**: Drops downward toward 1500u as throughput increases
- **Data**: `backlog: null` after first third; line stops plotting

#### Implementation Details

**Data Generation** (`generateMonitoringChartData` function):
```js
const hours = 1  // monitoring window duration
const intervalMin = 5  // 5-minute intervals
const points = 12  // total time slots (60 min / 5 = 12)
const filledPoints = Math.ceil(12 / 3) = 4  // only first 4 points filled

// Loop through 12 time slots:
// Slots 0-3: populate with actual values
// Slots 4-11: return { throughput: null, backlog: null }
```

**Chart Rendering** (Recharts):
- Null values create gaps in line (default `connectNulls: false`)
- X-axis shows all 12 time labels (full 1-hour span)
- Lines stop after slot 3, leaving right 2/3 visually empty
- Reference lines (targets) span full chart for context

#### Live Badge
- **Style**: Green pill badge (#dcfce7 background, #16a34a text)
- **Icon**: Animated green dot (6×6px)
- **Position**: Next to chart title, right-aligned
- **Purpose**: Reinforce that monitoring is active
- **Appearance**: `● Live`

---

## View in Action History

### Navigation
1. Submit REC-001 action to LMS
2. Confirmation message shows: "Action submitted to LMS"
3. Click "View KPI metrics in Action History"
4. **Action History tab** opens showing:
   - Timeline entry: "Reassign Priya Nair from PTL Order Picking to Shuttle/XDK" (18:56)
   - KPI Monitor chart with partial data
   - Other action history entries (overtime approvals, reroutes, etc.)

### Chart Interaction
- **Hover**: Tooltip shows exact values at each 5-minute interval
- **Legend**: Click legend items to show/hide lines
- **Mobile Responsive**: Chart scales to 100% width

---

## Data Flow

### 1. User Interaction
```
Worker clicks Shuttle/XDK node
  → Node tooltip appears with REC-001
  → Clicks "REC-001: Reassign Priya Nair"
  → LMS dialog opens (edit mode)
  → Sends action text
  → Dialog shows confirmation
  → Clicks "Confirm & Submit to LMS"
  → Action queued, KPI monitoring initiated
```

### 2. Data Updates
```
generateMonitoringChartData(duration='1h')
  → Creates 12 time slots (5-min intervals)
  → Fills first 4 slots with calculated values
  → Sets remaining 8 slots to null
  → Returns array to KPIMonitoringChart

KPIMonitoringChart renders:
  → Reads chart data
  → Draws lines up to slot 3
  → Shows empty space for slots 4-11
  → Displays target reference lines (full span)
  → Renders "● Live" badge
```

### 3. Display
```
Action History tab
  → Shows timeline of submitted actions
  → Displays KPI chart for each action
  → Chart shows first 20 min of data
  → User perceives "live, in-progress monitoring"
```

---

## Mock Data Structure

### DC_MANAGER_DATA (MFA Overview)

```javascript
{
  contributorDetail: {
    shuttleXDKLabor: {
      checkedIn: 1,              // Workers currently on shift
      totalAssigned: 22,         // Total roster size
      shiftEstimated: 14,        // Hours of work estimated
      shiftDone: 0,              // Hours completed
      shiftCapacity: 7.8,        // Available capacity
      // deficit = 7.8 - 14 = -6.2
      rec001Worker: 'Priya Nair',
      rec001ExperienceMonths: 8,
      surplusZone: 'PTL Order Picking',
      surplusHours: 8.4,
    }
  },
  actionHistory: [
    {
      id: 'action-001',
      action: 'Reassign Priya Nair from PTL Order Picking to Shuttle/XDK',
      system: 'LMS',
      timestamp: '18:56',
      kpiMetrics: {
        duration: '1h',
        chartData: [/* 12 data points, first 4 filled, rest null */]
      }
    }
  ]
}
```

---

## Testing Checklist

When testing or extending this feature:

- [ ] **Node Click**: Shuttle/XDK node tooltip shows -6.2h deficit badge
- [ ] **REC-001 Display**: Button text shows "Reassign Priya Nair" with experience level
- [ ] **LMS Dialog**: Opens with pre-filled text, can edit, shows confirmation
- [ ] **Action Submission**: Success message shows worker and zones
- [ ] **Action History Navigation**: Link navigates to Action History tab
- [ ] **KPI Chart Title**: Shows "● Live" badge next to title
- [ ] **Chart Data**: First 1/3 shows lines, remaining 2/3 empty
- [ ] **Target Lines**: Reference lines (21/h, 1500u) span full chart
- [ ] **Legend**: Shows both Throughput and Backlog metrics
- [ ] **Responsive**: Chart scales to container width
- [ ] **Multiple Actions**: History shows multiple action entries, each with own chart

---

## Future Enhancements

1. **Real API Integration**: Replace mock data with actual LMS API calls
2. **Auto-Reassignment**: Automatically execute low-risk recommendations
3. **Predictive Modeling**: Use ML to forecast zone deficits before workload arrives
4. **Multi-Worker Recommendations**: REC-002, REC-003 for larger deficits
5. **Skill-Based Routing**: Match worker experience to zone complexity
6. **Alert Escalation**: Notify managers if deficit cannot be covered
7. **Historical Tracking**: Store completed actions with actual outcomes vs. forecast

---

## Related Documentation

- **Features Reference**: [05-features.md](./05-features.md) — Multi-Faceted Analytics overview
- **User Flows**: [07-user-flows.md](./07-user-flows.md) — MFA interaction patterns
- **Components**: [02-components.md](./02-components.md) — WarehouseProcessMap, MFA component details
- **Quick Reference**: [06-quick-reference.md](./06-quick-reference.md) — Zone names, abbreviations
