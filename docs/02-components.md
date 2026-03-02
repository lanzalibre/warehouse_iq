# Components Reference

## App.jsx (Root Component)

The root component manages screen navigation and yard view state.

### State Management
```jsx
const [activeScreen, setActiveScreen] = useState('yard')
const [yardView, setYardView] = useState('selection')
const [acceptedContainerId, setAcceptedContainerId] = useState(null)
const [switchToContainerId, setSwitchToContainerId] = useState(null)
```

### Screen Routing
| activeScreen | Component Rendered |
|--------------|-------------------|
| `'yard'` + `yardView='selection'` | ContainerSelection |
| `'yard'` + `yardView='unloading'` | UnloadingBay |
| `'labor'` | LaborManagement |
| `'plan-exec'` | PlanVsExecution |
| `'mfa'` | MFAScreen |
| `'nl-query'` | NLQueryScreen |

### Key Functions
- `handleAccept(containerId)` - Accept container, switch to unloading view
- `handleBackToSelection()` - Return to container selection
- `handleSwitchContainer(newContainerId)` - Switch to different container
- `handleNavigate(screen)` - Navigate to different screen

---

## Header.jsx

Global header component with logo, breadcrumb navigation, clock, and user info.

### Props
| Prop | Type | Description |
|------|------|-------------|
| `view` | string | Current yard view ('selection' or 'unloading') |
| `activeScreen` | string | Current active screen ID |
| `onBack` | function | Callback for back button |
| `acceptedContainerId` | string | ID of accepted container |

### Features
- Real-time clock updating every second
- Dynamic breadcrumb based on active screen
- Back button shown only in unloading view
- User avatar with name and role

---

## Navbar.jsx

Vertical navigation bar on the right side of the screen.

### Props
| Prop | Type | Description |
|------|------|-------------|
| `activeScreen` | string | Current active screen ID |
| `onNavigate` | function | Callback when nav item clicked |

### Navigation Items
```jsx
const NAV_ITEMS = [
  { id: 'yard',      icon: Boxes,     shortLabel: 'Yard',  fullLabel: 'Yard Management' },
  { id: 'labor',     icon: Users2,    shortLabel: 'Labor', fullLabel: 'Labor Management' },
  { id: 'plan-exec', icon: GitCompare, shortLabel: 'Plan', fullLabel: 'Plan vs Execution' },
  { id: 'mfa',       icon: LayoutGrid, shortLabel: 'MFA',  fullLabel: 'Multi-Faceted Analytics' },
  { id: 'nl-query',  icon: MessageSquare, shortLabel: 'Query', fullLabel: 'Natural Language Queries' },
]
```

### Features
- Active state highlighting with blue background
- Left indicator bar for active item
- Hover tooltips showing full label

---

## ContainerSelection.jsx

Yard management container selection view with list of containers to process.

### Main Sections
1. **SiteStatsBar** - Top stats bar showing throughput, dock utilization, etc.
2. **ContainerList** - Two sections: "Not Yet Processed" and "Previously Processed"
3. **DetailPanel** - Right panel showing container details and PO contents

### Container Card Structure
Each container card displays:
- Priority rank number
- Supplier name and container ID
- Priority badge (URGENT/HIGH/NORMAL/LOW)
- Days in yard
- Processing method chips (CR, FBD, PTL, XDK, NonCon, PR)
- SKU labels (Fragile, Hazard)

### Container Sorting
Containers are sorted by priority score (from `getPriorityConfig()`)

### Detail Panel
Shows when container is selected:
- Container info (PO number, age, truck, dock)
- PO contents table (SKU, Division, Qty, Fcst. hours, Method)
- Workload distribution by zone
- "Accept & Start Unloading" button

---

## UnloadingBay.jsx

Active unloading operations view with SKU scanning interface.

### Main Sections
1. **Progress Overview** - Overall unloading progress bar
2. **Zone Breakdown** - Progress per zone (A, B, C, D, Crossdock)
3. **SKU Scanner** - Simulated barcode scanning with visual feedback
4. **Recent Scans** - List of recently scanned items

### Features
- Animated scan line effect
- Real-time progress updates
- Zone-based color coding
- Switch container functionality

---

## LaborManagement.jsx

Worker allocation and zone management dashboard.

### Main Sections
1. **ZoneSummaryPanel** (left) - Workers by zone with check-in status
2. **MainPanel** (center) - Selected zone details or all workers
3. **DetailPanel** (right) - Worker details and rebalancing

### Worker Card Display
- Worker name and ID
- Zone assignment
- Experience level (dots 1-5)
- Check-in status
- Performance metrics

### Experience Levels
| Months | Dots | Label | Color |
|--------|------|-------|-------|
| 0-2 | 1 | New | text-slate-400 |
| 3-5 | 2 | Learning | text-amber-500 |
| 6-11 | 3 | Competent | text-blue-500 |
| 12-23 | 4 | Experienced | text-emerald-500 |
| 24+ | 5 | Expert | text-purple-500 |

---

## PlanVsExecution/index.jsx

Main Plan vs Execution component with sub-tab navigation.

### Sub-Tabs
| Tab ID | Label | Component |
|--------|-------|-----------|
| `overview` | Overview | OverviewDashboard |
| `exceptions` | Exception Patterns | ExceptionPatterns |
| `alerts` | Alert Subscriptions | AlertSubscriptions |
| `trace` | Historical Trace | HistoricalTrace |

### Features
- Tab-based navigation
- KPI cards at top
- Scrollable content area

---

## MFA.jsx (Multi-Faceted Analytics)

Warehouse optimization analytics with three top-level tabs.

### Top-Level Tabs
| Tab | Content |
|-----|---------|
| `overview` | BenchmarkSelector + KPI cards + WarehouseProcessMap |
| `reslotting` | Single Products / Product Pairs / Product Triplets sub-tabs |
| `simulation` | Placeholder |

### State
```jsx
const [activeTab, setActiveTab] = useState('overview')       // top-level tab
const [benchmarkPeriod, setBenchmarkPeriod] = useState('30') // '7' | '30' | '90'
const [activeSubTab, setActiveSubTab] = useState('single')   // reslotting sub-tab
```

### Overview Tab Components
- **`BenchmarkSelector`** — violet pill buttons (7d avg / 30d avg / 90d avg) that set `benchmarkPeriod`
- **`KPICard`** — 4 cards: Total Opportunities, Pending Actions, Accepted This Month, Time Savings Hours. Each shows a delta badge vs the selected benchmark period
- **`WarehouseProcessMap`** — interactive process flow diagram (receives `benchmarkPeriod` prop)

### Reslotting Tab
- Sub-tabs: Single Products, Product Pairs, Product Triplets
- Master panel (left): Savings grid (green) + Costs grid (red)
- Detail panel (right): opportunity analysis, alternative locations, impact summary, trips table

### Key Helpers (local to MFA.jsx)
```jsx
calcDelta(current, benchmark)     // Returns % delta or null
// KPI benchmark values by period:
const KPI_BENCHMARKS = {
  '7':  { totalOpportunities: 29, pendingActions: 28, acceptedThisMonth: 1, timeSavingsHours: 72 },
  '30': { totalOpportunities: 27, pendingActions: 27, acceptedThisMonth: 1, timeSavingsHours: 69 },
  '90': { totalOpportunities: 25, pendingActions: 26, acceptedThisMonth: 1, timeSavingsHours: 64 },
}
// Reslotting helpers:
classifyOpportunity(opportunity)          // Returns 'savings' or 'costs'
calculateTimeSavings(opp, alt, period)    // Calculate time savings
formatTime(minutes)                       // Format minutes to "Xh Ym"
```

---

## WarehouseProcessMap.jsx

Interactive React Flow diagram showing the end-to-end warehouse process, used in the MFA Overview tab.

### Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `benchmarkPeriod` | string | `'30'` | Active benchmark period ('7', '30', or '90'); drives delta badges in detail panel |

### Node Types
| Type key | Component | Description |
|----------|-----------|-------------|
| `swimlane` | `SwimlaneNode` | Dashed-border group label (not selectable) |
| `processNode` | `ProcessNode` | Standard amber process box |
| `barNode` | `BarNode` | Tall vertical bar for Receiving / Loading |

### Behavior
- Clicking a `processNode` or `barNode` toggles an inline detail panel below the diagram
- Detail panel shows a metric grid; operational KPIs display a `DeltaBadge` (↑/↓ %) vs the selected benchmark period
- Static capacity fields (dock doors, locations, vendor counts) have no `metricBenchmarks` entry and show no badge
- Data sourced from `src/data/warehouseProcessMap.json`

### Local Helpers
```jsx
parseNumeric(str)                           // Strips non-numeric chars, returns float
DeltaBadge({ current, benchmarkVal })       // Inline ↑/↓ % badge; returns null if no benchmark
```

---

## NLQuery.jsx

Natural language query interface for warehouse data.

### Features
- Query input field
- Predefined query suggestions
- Results display area
- Query history

---

## Common Component Patterns

### Master-Detail Pattern
Used in ContainerSelection, LaborManagement, MFA:
- Left panel: List of items (master)
- Right panel: Selected item details (detail)

### Tab Navigation Pattern
Used in PlanVsExecution, ExceptionPatterns, MFA:
```jsx
const [activeTab, setActiveTab] = useState('default')
// Button group with active state styling
```

### Progress Bar Pattern
```jsx
<div className="h-2 bg-slate-200 rounded-full overflow-hidden">
  <div className="h-full bg-blue-500" style={{ width: `${pct}%` }} />
</div>
```

### Badge/Chip Pattern
```jsx
<span className="text-xs font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
  {label}
</span>
```
