# Data Structures Reference

All mock data is exported from `src/mockData.js`. This file contains all data used by the application.

## Core Configuration Data

### ZONE_CONFIG
Warehouse zone configuration with colors and labels.

```javascript
export const ZONE_CONFIG = {
  'Zone A': {
    color: '#3b82f6',           // Hex color
    barClass: 'bg-blue-500',    // Tailwind class for bars
    textClass: 'text-blue-700', // Tailwind class for text
    lightClass: 'bg-blue-50 border-blue-200', // Light background
    dotClass: 'bg-blue-500',    // Dot indicator class
    label: 'Receiving & Prep',  // Display label
    currentLoadPct: 72,         // Current load percentage
    maxDailyHours: 18,          // Maximum daily hours
  },
  'Zone B': { /* ... */ },
  'Zone C': { /* ... */ },
  'Zone D': { /* ... */ },
  'Crossdock': { /* ... */ },
}
```

### SITE_STATS
Global site statistics displayed in header/stats bar.

```javascript
export const SITE_STATS = {
  todayThroughput: 1847,      // Units processed today
  dockUtilization: 68,        // Percentage
  activeTeams: 14,            // Number of active teams
  pendingContainers: 312,     // Containers waiting
  slaRiskCount: 2,            // SLA risk containers
  avgCycleTimeHours: 4.2,     // Average cycle time
}
```

### TOTAL_CONTAINERS_IN_YARD
```javascript
export const TOTAL_CONTAINERS_IN_YARD = 312
```

---

## Container Data

### CONTAINERS_ALL
Array of all containers in the yard (500+ generated).

```javascript
export const CONTAINERS_ALL = [
  {
    id: 'CONT-4201',
    poNumber: 'PO-6124',
    category: 'Sports & Outdoor',
    subcategory: 'Athletic Footwear',
    supplier: 'Nike',
    ageInYard: 7,              // Days in yard
    palletCount: 6,
    estimatedUnits: 840,
    truckId: 'TRK-887',
    dockAssigned: 'Dock 3',
    priority: 'URGENT',        // URGENT/HIGH/NORMAL/LOW
    status: 'pending',         // pending/processing/completed
    processingMethods: ['CR', 'FBD', 'PTL', 'XDK'],
    labels: ['Fragile', 'Hazard'],
    arrivalDate: '2026-02-19',
    estimatedUnloadHours: 4.5,
  },
  // ... more containers
]
```

### CONTAINER_PRODUCTS
Products/SKUs within each container.

```javascript
export const CONTAINER_PRODUCTS = [
  {
    containerId: 'CONT-4201',
    products: [
      {
        sku: 'SPOR-ATHLETIC-36-1',
        division: 'Lifestyle',
        quantity: 17,
        forecastHours: 3.4,
        processingMethod: 'PTL',
        labels: ['Fragile'],
      },
      // ... more products
    ],
  },
  // ... more containers
]
```

### HISTORICAL_PO_CONTAINERS
Historical data for previously processed POs.

```javascript
export const HISTORICAL_PO_CONTAINERS = [
  {
    poNumber: 'PO-6124',
    pastContainers: [
      {
        containerId: 'CONT-4001',
        processedDate: '2026-02-10',
        skus: [
          {
            sku: 'SPOR-ATHLETIC-36-1',
            actualQty: 17,
            actualMethod: 'PTL',
            labels: ['Fragile'],
          },
        ],
      },
    ],
  },
]
```

---

## Worker Data

### WORKERS
Array of warehouse workers.

```javascript
export const WORKERS = [
  {
    id: 'W001',
    name: 'Marcus Johnson',
    assignedZone: 'Zone A',
    role: 'Picker',
    checkedIn: true,
    clockInTime: '05:58',
    experienceMonths: 18,
    productivityScore: 94,
    accuracyRate: 98.2,
    todayPicks: 47,
    avgPickTime: 42,
  },
  // ... 100+ workers
]
```

### LABOR_PERIOD_DATA
Labor statistics by zone for different time periods.

```javascript
export const LABOR_PERIOD_DATA = {
  'Zone A': {
    morning:   { done: 210, estimated: 290, capacity: 350 },
    afternoon: { done: 180, estimated: 240, capacity: 280 },
    night:     { done: 90,  estimated: 120, capacity: 150 },
  },
  // ... other zones
}
```

### REBALANCING_RECS
Worker rebalancing recommendations.

```javascript
export const REBALANCING_RECS = [
  {
    id: 'REC-001',
    type: 'surplus',
    fromZone: 'Zone A',
    toZone: 'Zone D',
    workers: ['W012', 'W034'],
    reason: 'Zone D behind schedule',
    priority: 'high',
  },
]
```

---

## Pick Task Data

### PICK_TASKS_ALL
All pick tasks (500+ generated).

```javascript
export const PICK_TASKS_ALL = [
  {
    id: 'PICK-001',
    orderId: 'ORD-4521',
    sku: 'NIKE-AIRMAX-42',
    waveId: 'WAVE-001',
    description: 'Nike Air Max 270 - Size 42 - White/Black',
    wms: {
      location: 'Zone C-Aisle 12-Shelf B3',
      plannedQty: 3,
      plannedWindow: '09:00-09:15',
      plannedDurationSeconds: 240,
      priority: 'high',
    },
    wes: {
      picker: 'W008 - Kevin Liu',
      station: 'Pick Station C-4',
      actualQty: 3,
      scanTime: '09:08:23',
      completeTime: '09:11:42',
      travelTime: 185,
      dwellTime: 99,
    },
    status: 'normal',           // normal/exception
    exceptions: [],             // ['under-pick', 'excessive-duration', etc.]
    volume7Days: 245,
  },
]
```

---

## MFA (Multi-Faceted Analytics) Data

### ZONE_DISTANCE_FROM_STAGING
Distance of each zone from staging area.

```javascript
export const ZONE_DISTANCE_FROM_STAGING = {
  'A': 0,   // Staging area
  'B': 1,
  'C': 2,
  'D': 3,
}
```

### SKU_DEMAND_LEVELS
Demand classification for SKUs.

```javascript
export const SKU_DEMAND_LEVELS = {
  'SAUCONY-JAZZ-40': 'high',
  'ASICS-GEL-43': 'high',
  'REEBOK-CROSS-38': 'low',
  // ... more SKUs
}
```

### SKU_TRIP_FREQUENCY
Trip frequency by time window for SKUs.

```javascript
export const SKU_TRIP_FREQUENCY = {
  'SAUCONY-JAZZ-40': { days7: 42, days30: 178, days90: 534 },
  // ... more SKUs
}
```

### SINGLE_PRODUCT_OPPORTUNITIES
Reslotting opportunities for single products.

```javascript
export const SINGLE_PRODUCT_OPPORTUNITIES = [
  {
    id: 'SPO-007',
    currentSku: 'SAUCONY-JAZZ-40',
    currentLocation: { zone: 'B', rack: 16, level: 3 },
    suggestedLocation: { zone: 'A', rack: 8, level: 10 },
    timeSavingsMinutes: 4.5,
    demandLevel: 'high',
    tripFrequency: { days7: 42, days30: 178, days90: 534 },
    alternativeLocations: [
      { id: 'alt1', zone: 'A', rack: 5, level: 8, timeSavingsMinutes: 4.2 },
      { id: 'alt2', zone: 'A', rack: 3, level: 6, timeSavingsMinutes: 3.8 },
    ],
    status: 'pending',
  },
]
```

### PRODUCT_PAIRS_OPPORTUNITIES
Co-location opportunities for product pairs.

```javascript
export const PRODUCT_PAIRS_OPPORTUNITIES = [
  {
    id: 'PPO-001',
    skuA: 'NIKE-AIRMAX-42',
    skuB: 'NIKE-AIRMAX-43',
    locationA: { zone: 'C', rack: 12, level: 3 },
    locationB: { zone: 'D', rack: 8, level: 1 },
    suggestedLocationA: { zone: 'C', rack: 12, level: 5 },
    suggestedLocationB: { zone: 'C', rack: 12, level: 6 },
    timeSavingsMinutes: 2.3,
    coOccurrenceRate: 0.78,
    status: 'pending',
  },
]
```

### PRODUCT_TRIPLETS_OPPORTUNITIES
Co-location opportunities for product triplets.

```javascript
export const PRODUCT_TRIPLETS_OPPORTUNITIES = [
  {
    id: 'PTO-001',
    skuA: 'ADIDAS-ULTRA-40',
    skuB: 'ADIDAS-ULTRA-41',
    skuC: 'ADIDAS-ULTRA-42',
    // Similar structure to pairs...
    coOccurrenceRate: 0.65,
    status: 'pending',
  },
]
```

### TRIP_DATA
Historical trip data for opportunities.

```javascript
export const TRIP_DATA = {
  'SPO-007': [
    {
      employee: 'John Lee',
      date: '2026-02-25',
      orderId: 'ORD-6082',
      picksInRoute: 21,
      routeLength: '6m 50s',
      updatedRouteLength: '1.5m 20s',
      timeSaved: '+4.0m',
    },
    // ... more trips
  ],
}
```

### warehouseProcessMap.json

Stored in `src/data/warehouseProcessMap.json`. Drives the interactive process flow diagram in the MFA Overview tab.

```json
{
  "swimlanes": [
    { "id": "sl_inbound", "label": "INBOUND", "x": 0, "y": 0, "width": 800, "height": 200 }
  ],
  "nodes": [
    {
      "id": "receiving",
      "label": "Receiving",
      "nodeType": "bar",
      "x": 10, "y": 30, "width": 60, "height": 160,
      "metrics": {
        "Throughput": "210 pallets/hr",
        "Efficiency": "94%",
        "Dock doors": "12"
      },
      "metricBenchmarks": {
        "7":  { "Throughput": 195, "Efficiency": 91 },
        "30": { "Throughput": 185, "Efficiency": 89 },
        "90": { "Throughput": 175, "Efficiency": 87 }
      }
    }
  ],
  "edges": [
    { "id": "e1", "source": "receiving", "target": "rack_storage" }
  ]
}
```

**`metricBenchmarks` rules:**
- Only operational / KPI-type metrics get benchmark values (throughput, rates, pick counts, etc.)
- Static capacity fields (`Dock doors`, `Locations`, `Vendor count`) are excluded — no benchmark entry → no delta badge rendered
- Keys in `metricBenchmarks` must exactly match the corresponding key in `metrics`
- Benchmark values are raw numbers; the `parseNumeric()` helper strips units from the display string before computing the delta

### ALTERNATIVE_LOCATION_DATA
Data for SKUs at alternative locations.

```javascript
export const ALTERNATIVE_LOCATION_DATA = {
  'A-8-10': {
    currentSku: 'NIKE-AIR-MAX-42',
    frequency: { days7: 8, days30: 32, days90: 96 },
    avgImpactMinutes: 2.1,
    trips: [
      {
        employee: 'Mike Chen',
        date: '2026-02-25',
        orderId: 'ORD-7123',
        picksInRoute: 18,
        currentRouteLength: '4m 15s',
        alternativeRouteLength: '6m 25s',
        timeAdded: '2m 10s',
      },
    ],
  },
}
```

### KPI_BENCHMARKS

Defined as a local constant in `src/components/MFA.jsx` (not in `mockData.js`). Provides historical averages for the four Overview KPI cards.

```javascript
const KPI_BENCHMARKS = {
  '7':  { totalOpportunities: 29, pendingActions: 28, acceptedThisMonth: 1, timeSavingsHours: 72 },
  '30': { totalOpportunities: 27, pendingActions: 27, acceptedThisMonth: 1, timeSavingsHours: 69 },
  '90': { totalOpportunities: 25, pendingActions: 26, acceptedThisMonth: 1, timeSavingsHours: 64 },
}
```

Used with `calcDelta(current, benchmark)` to compute the ↑/↓ % shown on each `KPICard`.

---

## Delay and Exception Data

### DELAY_PATTERNS
Patterns of delays in warehouse operations.

```javascript
export const DELAY_PATTERNS = {
  byZone: { /* ... */ },
  byHour: { /* ... */ },
  byExceptionType: { /* ... */ },
}
```

### MISPLACED_LOCATIONS_ALL
Items in wrong locations.

```javascript
export const MISPLACED_LOCATIONS_ALL = [
  {
    id: 'MIS-001',
    sku: 'NIKE-AIRMAX-42',
    expectedLocation: 'Zone C-Aisle 12-Shelf B3',
    actualLocation: 'Zone C-Aisle 12-Shelf B5',
    misplacedDate: '2026-02-20',
    status: 'unresolved',
  },
]
```

---

## Helper Functions

### getPriorityConfig(container)
Returns priority configuration for sorting/display.

```javascript
function getPriorityConfig(container) {
  // Returns { score, color, label }
}
```

### getCategoryAbbr(category)
Returns abbreviation for category names.

```javascript
getCategoryAbbr('Sports & Outdoor') // Returns 'Sports'
```

### getExperienceLevel(months)
Returns experience level details.

```javascript
getExperienceLevel(18)
// Returns { dots: 4, label: 'Experienced', color: 'text-emerald-500' }
```

---

## DC Manager Data

### DC_MANAGER_DATA
All data for the DC General Manager (Jamie Thompson) persona.

```javascript
export const DC_MANAGER_DATA = {
  kpis: [
    { id, label, value, delta, color, icon }  // 4 exec KPI cards
  ],
  riskSignal: {
    headline: 'OTIF Risk Rising in 36 Hours',
    confidence: 87,                           // %
    financialImpact: -34000,                  // dollars
    contributors: [
      { id, label, level, confidence, impact } // level: 'high'|'medium'|'threshold'
    ],
  },
  mitigators: [
    {
      id,             // 'overtime' | 'reroute' | 'pullForward'
      title,          // Display title
      serviceImpact,  // e.g. 'Protect OTIF'
      costDelta,      // e.g. '+$12K'
      opRisk,         // e.g. 'Low'
      detail,         // Short description string
      hasSimulation,  // bool — shows "View Simulation →" link
      actionLabel,    // String added to Action History on confirm
      systems,        // Array of system IDs dispatched on confirm
                      // overtime: ['WMS','LMS'], reroute: ['TMS'], pullForward: ['WMS','WES','LMS']
    }
  ],
  actionHistory: [
    { action, acceptedAt, systems }  // Seeded history entries
  ],
  contributorDetail: {
    inboundVariability: {
      todayVariance,    // % (number)
      avgVariance,      // 3-day avg %
      trend,            // 'up'
      chartData: [      // 5-period window: 3 days ago → tomorrow
        { label, dayLabel, conveyor, pallet, flat,
          laborHours: { planned, actual } }  // actual: null for tomorrow
      ],
      impactPct,        // % of total OTIF risk
      impactDollars,    // dollar exposure
    },
    laborFatigue: {
      avgConsecutiveHours,
      zonesAffected,
      errorRateTrend,   // 'up'
      zoneData: [
        { zone, fatigueIndex, workers, avgHours }
      ],
      impactPct,
      impactDollars,
    },
    automationUtilization: {
      current,          // % (number)
      threshold,        // % (number)
      daysAbove85,      // days
      impactPct,
      impactDollars,
    },
  },
  mitigatorSimResults: {
    overtime:     { service, cost, risk, recommendation },
    pullForward:  { service, cost, risk, recommendation },
  },
  daySummary: {
    statusCards: [{ id, label, value, detail, color }],
    mitigated: [],    // string[]
    decisions: [],    // string[]
    outlook: [],      // string[]
  },
}
```

### SIMULATION_TEMPLATES
Pre-built scenario templates for the Simulation screen.

```javascript
export const SIMULATION_TEMPLATES = [
  {
    id,           // e.g. 'labor-shortage'
    name,         // Display name
    description,  // One-sentence summary
    params: {     // Template-specific parameter keys
      laborReduction, zones, volumeIncrease, ...
    },
  }
]
```
Templates available: `labor-shortage`, `automation-failure`, `high-volume`, `forklift-down`, `add-overtime`, `pull-forward`.
