# User Flows by Screen

This document details all user interactions and flows that each screen should enable.

---

## 1. Yard Management - Container Selection

### User Flows

#### 1.1 View Container List
**Goal**: See all containers waiting to be processed

**Steps**:
1. User navigates to Yard Management (default screen)
2. System displays "Not Yet Processed" container list
3. Containers are sorted by priority score (URGENT first)
4. Each container shows: rank, supplier, container ID, priority badge, age in yard, processing methods, labels

**Visual Indicators**:
- Priority badges: URGENT (red), HIGH (amber), NORMAL (gray), LOW (slate)
- Processing method chips: CR, FBD, PTL, XDK, NonCon, PR
- SKU labels: Fragile (purple), Hazard (red)

#### 1.2 View Container Details
**Goal**: Get detailed information about a specific container

**Steps**:
1. User clicks on a container card in the list
2. System highlights the selected container (border color change)
3. Detail panel slides in from right
4. Panel shows:
   - Container info (PO number, age, truck ID, dock assignment)
   - PO contents table (SKU, Division, Qty, Forecast hours, Method)
   - Workload distribution by zone (bars with hours and units)
   - "Accept & Start Unloading" button

**State Changes**:
- Selected container gets colored border (green for savings, red for costs)
- Detail panel becomes visible

#### 1.3 Filter by Processing Method
**Goal**: Show/hide containers based on processing methods

**Steps**:
1. User sees filter buttons for each method (FBD, PTL, CR, PR, XDK, NonCon)
2. Click a method button to filter out containers with that method
3. Button becomes dimmed/strikethrough when filtered
4. Click again to restore those containers

**Visual Feedback**:
- Active filter: normal button appearance
- Inactive filter: muted/strikethrough appearance

#### 1.4 Sort Containers
**Goal**: Change the order of container display

**Steps**:
1. User interacts with "Prioritize by" dropdown
2. Select sorting option:
   - Default (Score) - priority score calculation
   - Age (Oldest First) - by days in yard
   - XDK Hours (Highest First) - by cross-dock hours
3. Container list reorders based on selection

#### 1.5 View Previously Processed Containers
**Goal**: See history of completed containers

**Steps**:
1. User scrolls down past "Not Yet Processed" section
2. "Previously Processed" section appears
3. Shows containers marked as "Done"
4. Each shows: container ID, processed date, methods used, labels

#### 1.6 Accept Container for Unloading
**Goal**: Begin unloading process for selected container

**Steps**:
1. User selects a container (click to view details)
2. User clicks "Accept & Start Unloading {CONTAINER_ID}" button
3. System transitions to Unloading Bay view
4. Accepted container ID is tracked in state

**State Changes**:
- `yardView` changes from 'selection' to 'unloading'
- `acceptedContainerId` set to selected container ID

---

## 2. Yard Management - Unloading Bay

### User Flows

#### 2.1 View Unloading Progress
**Goal**: Monitor real-time progress of container unloading

**Steps**:
1. User arrives at Unloading Bay after accepting container
2. Header shows breadcrumb: "Yard Management / Unloading Bay — {CONTAINER_ID}"
3. Back button appears in header
4. Main view shows:
   - Overall progress bar with percentage
   - Zone breakdown with individual progress bars
   - SKU scanner with animated scan line
   - Recent scans list

**Visual Elements**:
- Progress bars color-coded by zone
- Animated scan line effect
- Real-time updating numbers

#### 2.2 Scan SKU Items
**Goal**: Record items as they are unloaded

**Steps**:
1. Scanner shows animated scan line
2. Items appear in "Recent Scans" list as scanned
3. Each scan shows:
   - SKU ID
   - Description
   - Quantity
   - Timestamp
   - Zone assignment
4. Progress bars update accordingly

**Simulated Behavior** (mock data):
- Scans happen automatically in demo
- Progress increments over time

#### 2.3 Switch to Different Container
**Goal**: Change to unloading a different container mid-process

**Steps**:
1. User clicks "Switch Container" button (if available)
2. System returns to Container Selection view
3. New container is highlighted
4. User can select and accept new container

**State Changes**:
- `switchToContainerId` set to new container
- `yardView` changes to 'selection'
- User must re-accept to start unloading

#### 2.4 Return to Container Selection
**Goal**: Go back to container list

**Steps**:
1. User clicks "Back" button in header
2. System returns to Container Selection view
3. No container is selected
4. Previously accepted container state is cleared

**State Changes**:
- `yardView` changes to 'selection'
- `acceptedContainerId` set to null

---

## 3. Labor Management

### User Flows

#### 3.1 View Shift Roster
**Goal**: See all workers and their check-in status

**Steps**:
1. User navigates to Labor Management
2. Left panel shows "Shift Roster" summary
3. Shows check-in count: "{checkedIn} / {total}"
4. Progress bar shows check-in percentage
5. Workers grouped by zone

**Visual Indicators**:
- Zone cards with worker count
- Check-in status badges
- Experience level dots

#### 3.2 View Workers by Zone
**Goal**: See workers assigned to specific zones

**Steps**:
1. Left panel shows zone cards
2. Each card displays:
   - Zone name and label
   - Worker count (checked in / total)
   - Critical indicator if no workers checked in
3. Double-click zone card to expand details
4. Main panel shows workers for that zone

**State Changes**:
- `expandedZone` state tracks which zone is expanded

#### 3.3 View Worker Details
**Goal**: Get detailed information about a worker

**Steps**:
1. User clicks on a worker card in main panel
2. Right detail panel shows:
   - Worker name and ID
   - Zone assignment
   - Experience level (dots + label)
   - Clock-in time
   - Performance metrics (productivity score, accuracy rate)
   - Today's picks count
   - Average pick time

**Visual Elements**:
- Experience dots (1-5 filled circles)
- Performance score with color coding
- Metrics with trend indicators

#### 3.4 View Rebalancing Recommendations
**Goal**: See suggestions for worker reallocation

**Steps**:
1. System shows rebalancing alerts when zone imbalance detected
2. Recommendation cards show:
   - Source zone (surplus)
   - Target zone (deficit)
   - Workers to move
   - Reason for rebalancing
   - Priority level

**Actions Available**:
- Accept recommendation
- Dismiss recommendation
- View affected workers

#### 3.5 View All Workers
**Goal**: See complete list of workers across all zones

**Steps**:
1. User clicks "All" or clears zone selection
2. Main panel shows all workers
3. Sorted by zone, then by name
4. Filterable by check-in status

---

## 4. Plan vs Execution

### User Flows

#### 4.1 Navigate Between Sub-tabs
**Goal**: Access different analysis views

**Steps**:
1. User navigates to Plan vs Execution
2. Top bar shows sub-tabs: Overview, Exception Patterns, Alert Subscriptions, Historical Trace
3. Click tab to switch view
4. Active tab highlighted with blue background

**State Changes**:
- `activeTab` state tracks current view

#### 4.2 View Overview Dashboard
**Goal**: See high-level KPIs and exception summary

**Steps**:
1. User selects "Overview" tab (default)
2. KPI cards show:
   - Total exceptions count
   - Exception rate percentage
   - Orders with exceptions
   - Average delay time
3. Charts show trends over time
4. Exception breakdown by category

#### 4.3 Analyze Exception Patterns
**Goal**: Investigate specific exception types

**Steps**:
1. User selects "Exception Patterns" tab
2. Second row of sub-tabs appears: Slotting, Locations, Order Types, Equipment
3. Each tab shows exceptions relevant to that category
4. Tables list individual exceptions with details
5. Click exception to see details

**Sub-tab Content**:
- **Slotting**: Misplaced items, wrong slots
- **Locations**: Zone-based exceptions
- **Order Types**: Exceptions by order category
- **Equipment**: Scanner issues, equipment failures

#### 4.4 Manage Alert Subscriptions
**Goal**: Configure alert preferences

**Steps**:
1. User selects "Alert Subscriptions" tab
2. List of configurable alerts shown
3. Each alert has:
   - Alert name and description
   - Threshold setting
   - Enable/disable toggle
   - Notification method
4. Toggle alerts on/off
5. Adjust threshold values

#### 4.5 View Historical Trace
**Goal**: Investigate specific orders/tasks over time

**Steps**:
1. User selects "Historical Trace" tab
2. Search interface appears
3. Enter order ID, task ID, or SKU
4. System shows historical data:
   - Timeline of events
   - Exceptions encountered
   - Resolution status
   - Performance metrics

---

## 5. Multi-Faceted Analytics (MFA)

### User Flows

#### 5.1 Navigate Between MFA Tabs
**Goal**: Switch between Overview, Reslotting, and Simulation views

**Steps**:
1. User navigates to MFA screen — defaults to Overview tab
2. Top tab bar shows: Overview / Reslotting / Simulation
3. Click tab to switch view

**State Changes**:
- `activeTab` state tracks top-level tab ('overview' | 'reslotting' | 'simulation')

#### 5.2 View Overview Tab — Benchmark Selector
**Goal**: Change the benchmark comparison period for KPI cards and process map

**Steps**:
1. User sees violet pill buttons: **7d avg / 30d avg / 90d avg**
2. Click a button to select benchmark period
3. KPI card delta badges update immediately (↑/↓ %)
4. Process map node detail panel delta badges also update if a node is open

**State Changes**:
- `benchmarkPeriod` changes to '7', '30', or '90'

#### 5.3 Explore Warehouse Process Map
**Goal**: Inspect KPI metrics for a specific warehouse process node

**Steps**:
1. User views the interactive flow diagram on the Overview tab
2. Diagram shows 18 process nodes across 4 swimlanes (Inbound, Storage, Outbound, Customers)
3. User clicks any amber process node
4. A detail panel appears below the diagram showing:
   - Node name (header)
   - Metric grid: operational KPIs with delta badge vs selected benchmark period
   - Static capacity fields (dock doors, locations) shown without badge
5. Click a different node to switch; click the × or the same node again to close
6. Switch benchmark period (7d / 30d / 90d) → all delta badges update live

**State Changes**:
- `selectedNode` tracks clicked node (null when closed)

#### 5.4 Navigate Between Reslotting Analysis Types
**Goal**: Access different reslotting opportunity types

**Steps**:
1. User clicks **Reslotting** tab in the MFA top tab bar
2. Sub-tab bar appears: Single Products, Product Pairs, Product Triplets
3. KPI cards show summary metrics
4. Click sub-tab to switch analysis type

**State Changes**:
- `activeSubTab` state tracks current analysis type

#### 5.5 View Reslotting Opportunities
**Goal**: See available optimization opportunities

**Steps**:
1. Detail panel shows two grids:
   - **Savings** (top): High-demand SKUs to move closer
   - **Costs** (bottom): Low-demand SKUs in prime locations
2. Each opportunity card shows:
   - Location ID
   - SKU name
   - Priority badge (HIGH/MEDIUM/LOW)
   - Time savings/cost per order
3. Count badges show number of items in each grid

**Visual Indicators**:
- Savings cards: green-tinted
- Costs cards: red-tinted
- Priority badges color-coded

#### 5.6 View Opportunity Details
**Goal**: Analyze a specific reslotting opportunity

**Steps**:
1. User clicks on an opportunity card
2. Detail panel shows on right:
   - Opportunity Details section
   - Alternative Locations combobox
   - Time Period selector
   - Impact Summary
   - Recent Trips table
   - Delays Grid

**State Changes**:
- `selectedOpportunity` tracks selected item
- `selectedAlternative` reset to null on new selection

#### 5.7 Select Alternative Location
**Goal**: Compare impact of different location options

**Steps**:
1. In detail panel, find "Alternative Locations" combobox
2. Combobox shows options like:
   - "A-8-10 (NIKE-AIR-MAX-42) - +4.5m/trip [Suggested]"
   - "A-5-8 (ADIDAS-ULTRA-41) - +4.2m/trip"
   - "A-3-6 (PUMA-RS-X-40) - +3.8m/trip"
3. Each option shows: location, SKU at that location, time savings
4. Select an option
5. All calculations update based on selection

**State Changes**:
- `selectedAlternative` updated
- Impact Summary recalculates
- Both grids update

#### 5.8 Change Time Period
**Goal**: View impact over different time windows

**Steps**:
1. Find "Time Period" section with buttons: 7 Days, 30 Days, 90 Days
2. Click desired period
3. All calculations update:
   - Impact Summary totals change
   - Trip counts adjust
   - Grid summaries update

**State Changes**:
- `timePeriod` state updated ('7', '30', or '90')

#### 5.9 Review Impact Summary
**Goal**: Understand net impact of reslotting decision

**Steps**:
1. View Impact Summary section
2. See three subsections:

   **Savings Section**:
   - Label: "{current SKU} at {new location} instead of {current location}"
   - Total Savings
   - Average Per Trip
   - Number of Trips

   **Costs Section**:
   - Label: "{alt SKU} at {current location} instead of {alt location}"
   - Total Cost
   - Average Per Trip
   - Number of Affected Trips

   **Net Impact**:
   - Combined savings minus costs
   - Positive (green) or negative (red) indicator
   - Text summary

#### 5.10 Analyze Historical Trips
**Goal**: See how routes would change for current SKU

**Steps**:
1. Scroll to "Time of historical routes for {SKU} if assigned to location {selected}" table
2. Header shows time period (e.g., "Last 7 days")
3. Summary bar shows: Total Savings, Avg per trip, Trips count
4. Table shows individual trips:
   - Employee name
   - Date
   - Order ID
   - Picks count
   - Current route time
   - If at new location time
   - Time saved

**Updates on Alternative Change**:
- Title updates with new location
- Savings values recalculate
- Same trips, different calculations

#### 5.11 Review Delays Grid
**Goal**: Understand impact on SKU at alternative location

**Steps**:
1. Scroll to bottom grid
2. Title: "Time of historical routes for {alt SKU} if assigned to location {current}"
3. Shows DIFFERENT trips (for the SKU currently at the alternative location)
4. Summary shows: Total Cost, Avg per trip, Affected trips
5. Table shows:
   - Employee name
   - Date
   - Order ID
   - Picks count
   - Current route time (at alternative location)
   - If at current location time
   - Time added

**Updates on Alternative Change**:
- Title updates with new SKU and location
- Different trips loaded
- Different cost calculations

#### 5.12 Select Costs Opportunity
**Goal**: View low-demand SKU that should be moved

**Steps**:
1. Scroll to "Costs" grid (bottom of master panel)
2. These are low-demand SKUs in Zone A (prime locations)
3. Click on a costs opportunity
4. Detail panel shows with negative time savings (costs)
5. Impact Summary shows costs > savings
6. Net Impact likely negative (red)

**Difference from Savings**:
- Time values are negative (costs)
- Net Impact typically negative
- Recommendation is to move item further from staging

---

## 6. Natural Language Queries

### User Flows

#### 6.1 Enter Natural Language Query
**Goal**: Ask questions about warehouse data

**Steps**:
1. User navigates to NL Query screen
2. Text input field at top
3. Type query in natural language
4. Press Enter or click Search button
5. System interprets and displays results

**Example Queries**:
- "Show containers waiting more than 7 days"
- "Which zones have the most exceptions?"
- "What is today's throughput?"
- "List all urgent containers"

#### 6.2 Use Suggested Queries
**Goal**: Quickly run common queries

**Steps**:
1. Below input field, suggested queries appear
2. Click on a suggestion
3. Query auto-fills and executes
4. Results display

#### 6.3 View Query Results
**Goal**: See the answer to the query

**Steps**:
1. After query execution, results panel shows answer
2. Results may be:
   - Table of data
   - Summary statistics
   - Chart visualization
   - Text answer
3. Results include relevant data from mock data

#### 6.4 View Query History
**Goal**: Access previous queries

**Steps**:
1. Sidebar or section shows recent queries
2. Click on previous query to re-run
3. Query history persists during session

---

---

## 7. DC General Manager Flow (Jamie Thompson)

### 7.1 Login as DC Manager
1. App starts at Login screen
2. Click "Jamie Thompson — General Manager" card
3. System sets persona to `dc-manager` and navigates to `plan-exec`
4. Header shows "JT / Jamie Thompson / General Manager" + Switch User button

### 7.2 DC Overview Tab — Main View
1. Default view on Plan vs Execution for DC Manager
2. Four exec KPI cards (OTIF, Cost per Unit, Safety Index, Volume Forecast)
3. Hero risk signal card with OTIF Risk headline, confidence badge, financial exposure
4. Three contributor cards (Inbound Variability, Labor Fatigue, Automation Utilization)
5. Three mitigator cards (Add Overtime, Reroute Volume, Pull Inventory Forward)
6. Action History strip showing accepted mitigations

### 7.3 Contributor Drill-Down
1. Click "View Analysis →" on any contributor card
2. Full-page drill-down replaces the overview content
3. Shows contributor-specific KPIs, chart/bars, and OTIF impact card
4. Click "← Back to Overview" to return

### 7.4 Mitigator Drill-Down
1. Click "View Simulation →" on Overtime or Pull Forward card
2. Shows pre-run simulation results (service, cost, risk, recommendation badge)
3. Click "Open full simulation →" to navigate to the Simulation screen
4. Reroute Volume has no link (no simulation available)

### 7.5 DC Day Summary Tab
1. Click "Day Summary" tab
2. Three status cards: OTIF Risk, Cost Trajectory, Tomorrow's Outlook
3. Executive summary card with three sections: Risks Mitigated, Decisions Taken, Tomorrow's Outlook

### 7.6 Switch Back to Login
1. Click "Switch User" button in header
2. Returns to Login persona selector
3. All state is reset

---

## 8. Simulation Screen

### 8.1 Open from Navbar
1. Click "Sim" in right Navbar
2. Simulation screen opens with empty state
3. Left panel: chat input with example prompts
4. Right panel: Scenario Name input, Load Template button, Run Simulation (disabled)

### 8.2 Load a Template
1. Click "Load Template" button in right panel
2. Dropdown shows 6 templates (Labor Shortage, Automation Failure, High Volume, Forklift Down, Add Overtime, Pull Inventory Forward)
3. Click a template to load it
4. Conversation starts with user message + system confirmation
5. Scenario Name auto-fills with template name
6. Right panel shows scenario description and parameters
7. Run Simulation button becomes enabled

### 8.3 Converse to Refine Scenario
1. Type in the chat input or click an example prompt
2. System responds confirming parameter updates
3. Iterative refinement before running

### 8.4 Run Simulation
1. Click "Run Simulation" button
2. System message confirms run completion
3. Right panel transitions to Results view:
   - OTIF Delta, Cost Delta, SLA Breaks, Labor Utilization KPI cards
   - "View Detailed Outputs →" link
4. Edit button (X) resets to config view

### 8.5 View Simulation Detail
1. Click "View Detailed Outputs →"
2. Full-page SimulationDetail renders:
   - Full KPI breakdown table (baseline vs simulated vs delta)
   - Per-zone impact table (OTIF delta, labor util, SLA breaks, status)
   - Hourly load timeline bar chart
3. Click "← Back to Simulation" to return

### 8.6 Open from DC Manager Mitigator Screen
1. From DCMitigatorOvertime or DCMitigatorPullForward, click "Open full simulation →"
2. Navigates to Simulation screen (navigates via `onNavigate('simulation')` from App)
3. Simulation screen opens without a pre-loaded template in this flow

---

## Cross-Screen Flows

### Navigate Between Screens
1. Use right-side Navbar
2. Click icon for desired screen
3. Active screen highlighted with blue background
4. Tooltip shows full screen name on hover

### Global Header Interactions
1. View current time (updates every second)
2. View current date
3. View user info — persona-aware (Jordan Chen / Jamie Thompson)
4. View breadcrumb showing current location
5. Click "Switch User" to return to Login (all personas)

### Return to Yard Management
1. Click "Yard" in Navbar
2. Always returns to Container Selection view
3. Previous state (selected container, etc.) cleared
