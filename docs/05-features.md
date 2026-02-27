# Features Reference

## 1. Yard Management

### Overview
The Yard Management module handles container processing from arrival through unloading completion.

### Container Selection View
**Purpose**: Display and select containers for unloading

**Features**:
- Site stats bar showing throughput, dock utilization, pending containers, SLA risk
- Priority-sorted container list (URGENT > HIGH > NORMAL > LOW)
- Processing method chips per container (CR, FBD, PTL, XDK, NonCon, PR)
- SKU labels (Fragile, Hazard)
- Age in yard display
- Previously processed containers section

**Detail Panel**:
- Container information (PO number, age, truck, dock)
- PO contents table with SKU, Division, Qty, Forecast hours, Method
- Workload distribution by zone visualization
- "Accept & Start Unloading" action button

### Unloading Bay View
**Purpose**: Active unloading operations with SKU scanning

**Features**:
- Overall progress bar with percentage
- Zone-by-zone breakdown with individual progress
- Animated SKU scanner with scan line effect
- Recent scans list with timestamps
- Switch container functionality

**Workflow**:
1. Select container from Container Selection
2. Click "Accept & Start Unloading"
3. View transitions to Unloading Bay
4. Progress updates as SKUs are "scanned"
5. Click "Back" to return to container selection

---

## 2. Labor Management

### Overview
Worker allocation dashboard for managing warehouse staff across zones.

### Zone Summary Panel (Left)
**Features**:
- Shift roster with check-in count
- Workers grouped by zone
- Double-click to expand zone details
- Visual indicators for zone status (critical if no workers checked in)
- Progress bar showing check-in percentage

### Main Panel (Center)
**Features**:
- All workers view or single zone detail
- Worker cards with:
  - Name and ID
  - Zone assignment
  - Experience level (1-5 dots)
  - Check-in status and time
  - Performance metrics (productivity, accuracy)
  - Today's picks count

### Detail Panel (Right)
**Features**:
- Selected worker details
- Performance charts
- Rebalancing recommendations
- Zone surplus/deficit indicators

### Experience Level System
| Months | Dots | Label | Color |
|--------|------|-------|-------|
| 0-2 | 1 | New | Gray |
| 3-5 | 2 | Learning | Amber |
| 6-11 | 3 | Competent | Blue |
| 12-23 | 4 | Experienced | Green |
| 24+ | 5 | Expert | Purple |

---

## 3. Plan vs Execution

### Overview
Comparison of Warehouse Management System (WMS) plans vs Warehouse Execution System (WES) actuals.

### Sub-Tabs

#### Overview Dashboard
- KPI cards showing exception counts
- Exception rate by category
- Volume trends chart
- Summary statistics

#### Exception Patterns
**Slotting Tab**:
- Slotting-related exceptions
- Misplaced items analysis
- Location optimization suggestions

**Locations Tab**:
- Location-based exception patterns
- High-exception locations identified
- Zone hotspots

**Order Types Tab**:
- Exceptions by order type
- Order complexity analysis
- Priority order performance

**Equipment Tab**:
- Equipment-related exceptions
- Scanner issues
- Equipment utilization

#### Alert Subscriptions
- Configure alert rules
- Set thresholds
- Notification preferences

#### Historical Trace
- Trace specific orders/tasks
- View historical performance
- Audit trail

---

## 4. Multi-Faceted Analytics (MFA)

### Overview
Warehouse optimization analytics focused on reslotting opportunities.

### Sub-Tabs
1. **Single Products** - Individual SKU reslotting
2. **Product Pairs** - Co-location for frequently paired SKUs
3. **Product Triplets** - Co-location for three related SKUs

### Master Panel (Left)
**Two-Grid Layout**:

**Savings Grid** (11 items):
- High-demand SKUs currently far from staging
- Moving them closer would save time
- Green-tinted cards
- Time savings per order displayed

**Costs Grid** (4 items):
- Low-demand SKUs in prime locations (Zone A)
- Should be moved further from staging
- Red/amber-tinted cards
- Time cost per order displayed

### Detail Panel (Right)

**Opportunity Details Section**:
- Current location and SKU
- Demand level badge
- Alternative locations combobox (shows location + SKU at that location)

**Time Period Selector**:
- 7 Days / 30 Days / 90 Days buttons
- Affects all calculations in panel

**Impact Summary**:
- Savings section: "{SKU} at {new location} instead of {current location}"
  - Total savings
  - Average per trip
  - Number of trips
- Costs section: "{alt SKU} at {current location} instead of {alt location}"
  - Total cost
  - Average per trip
  - Number of affected trips
- Net Impact with positive/negative indicator

**Recent Trips Table**:
- Title: "Time of historical routes for {SKU} if assigned to location {selected}"
- Shows same trips with recalculated savings
- Columns: Employee, Date, Order ID, Picks, Current, If at {location}, Saved
- Time period indicator in header

**Delays Grid**:
- Title: "Time of historical routes for {alt SKU} if assigned to location {current}"
- Shows different trips for SKU at alternative location
- Columns: Employee, Date, Order ID, Picks, Current (at alt), If at {current}, Added

### Dynamic Calculations
- All values update when alternative location is selected
- Savings recalculate based on new location's time savings
- Delays grid shows different SKU and trips entirely

---

## 5. Natural Language Queries

### Overview
Query interface for warehouse data using natural language.

### Features
- Text input for queries
- Predefined query suggestions
- Query results display
- Query history

### Example Queries
- "Show containers waiting more than 7 days"
- "Which zones have the most exceptions?"
- "What is today's throughput?"

---

## Common UI Patterns

### Master-Detail Navigation
1. Click item in master list
2. Detail panel shows selected item info
3. Actions available in detail panel

### Tab Navigation
1. Horizontal tab buttons at top
2. Click tab to switch content
3. Active tab highlighted

### Selection State
- Selected items have colored border (blue/green/red)
- Background color changes to light tint
- Checkmark or indicator shown

### Action Buttons
- Primary: Blue background, white text
- Secondary: Slate background, dark text
- Destructive: Red background, white text

### Loading States
- Skeleton loaders for async content
- Spinner for operations
- Progress bars for multi-step

---

## Data Flow

### Application State
```
App.jsx
├── activeScreen (string)
├── yardView ('selection' | 'unloading')
├── acceptedContainerId (string | null)
└── switchToContainerId (string | null)
```

### Component State
- Each component manages its own detail selection state
- Tab state managed within components
- No global state management library

### Data Source
- All data imported from `mockData.js`
- No API calls
- Static data with some generated content
