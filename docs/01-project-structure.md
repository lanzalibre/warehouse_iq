# Project Structure

## Directory Layout

```
burl_demo/
├── docs/                          # Documentation (this folder)
├── public/                        # Static assets
│   └── Spinnaker_SCA_Logo.png     # Company logo
├── src/
│   ├── components/                # React components
│   │   ├── Header.jsx             # Global header with breadcrumb
│   │   ├── Navbar.jsx             # Right-side vertical navigation
│   │   ├── ContainerSelection.jsx # Container list and selection
│   │   ├── UnloadingBay.jsx       # Unloading operations view
│   │   ├── LaborManagement.jsx    # Worker allocation dashboard
│   │   ├── Login.jsx              # Persona selector (Jordan Chen / Jamie Thompson)
│   │   ├── PlanVsExecution/       # Plan vs Execution module (persona-aware)
│   │   │   ├── index.jsx          # Main component — ops tabs or DC Manager tabs
│   │   │   ├── OverviewDashboard.jsx
│   │   │   ├── ExceptionPatterns.jsx
│   │   │   ├── AlertSubscriptions.jsx
│   │   │   ├── HistoricalTrace.jsx
│   │   │   ├── HorizontalBarChart.jsx
│   │   │   ├── ProjectionPanel.jsx
│   │   │   ├── DCOverview.jsx     # DC Manager Overview (KPIs, risk, contributors, mitigators)
│   │   │   ├── DCDaySummary.jsx   # DC Manager Day Summary
│   │   │   ├── DCContributorInboundVariability.jsx
│   │   │   ├── DCContributorLaborFatigue.jsx
│   │   │   ├── DCContributorAutomation.jsx
│   │   │   ├── DCMitigatorOvertime.jsx
│   │   │   ├── DCMitigatorPullForward.jsx
│   │   │   └── ExceptionPatterns/ # Exception pattern tabs
│   │   │       ├── SlottingTab.jsx
│   │   │       ├── LocationsTab.jsx
│   │   │       ├── OrderTypesTab.jsx
│   │   │       └── EquipmentTab.jsx
│   │   ├── Simulation.jsx         # Scenario modeler (two-panel chat + config)
│   │   ├── SimulationDetail.jsx   # Full simulation output (KPI table, zone impact, timeline)
│   │   ├── MFA.jsx                # Multi-Faceted Analytics (Overview, Reslotting, Simulation tabs)
│   │   ├── WarehouseProcessMap.jsx # Interactive React Flow process diagram (used in MFA Overview)
│   │   ├── NLQuery.jsx            # Natural Language Queries
│   │   ├── DelayPatterns.jsx      # Delay pattern analysis
│   │   └── MisplacedItems.jsx     # Misplaced items tracking
│   ├── data/
│   │   └── warehouseProcessMap.json # Node/edge/swimlane data for the process map
│   ├── App.jsx                    # Root component with screen routing
│   ├── main.jsx                   # React DOM entry point
│   ├── index.css                  # Global styles and Tailwind imports
│   └── mockData.js                # All mock data and data helpers
├── index.html                     # HTML entry point
├── package.json                   # Dependencies and scripts
├── vite.config.js                 # Vite configuration
├── tailwind.config.js             # Tailwind CSS configuration
├── postcss.config.js              # PostCSS configuration
├── Makefile                       # Deploy/build/sync/invalidate targets
├── DEPLOY.md                      # Deployment guide (S3 + CloudFront)
└── CLAUDE.md                      # Claude AI instructions
```

## File Descriptions

### Root Configuration Files

| File | Purpose |
|------|---------|
| `package.json` | NPM dependencies, scripts, project metadata |
| `vite.config.js` | Vite bundler configuration |
| `tailwind.config.js` | Tailwind CSS theme extensions and animations |
| `postcss.config.js` | PostCSS plugins configuration |
| `index.html` | HTML entry point with root div |
| `Makefile` | Deploy pipeline: `make deploy` runs build → S3 sync → CloudFront invalidation |
| `DEPLOY.md` | Deployment guide for AWS S3 + CloudFront |

### Core Application Files

| File | Purpose |
|------|---------|
| `src/main.jsx` | React DOM entry point, renders App component |
| `src/App.jsx` | Root component, manages screen routing and yard state |
| `src/index.css` | Global CSS, Tailwind imports, scrollbar styling |
| `src/mockData.js` | All mock data exports and helper functions |

### Component Files

| Component | Description |
|-----------|-------------|
| `Login.jsx` | Persona selector screen shown at app start |
| `Header.jsx` | Top header bar — persona-aware avatar, Switch User button |
| `Navbar.jsx` | Right-side vertical navigation (7 screens including Simulation) |
| `ContainerSelection.jsx` | Yard view for selecting containers to unload |
| `UnloadingBay.jsx` | Active unloading operations with SKU scanning |
| `LaborManagement.jsx` | Worker allocation, zone management, rebalancing |
| `PlanVsExecution/index.jsx` | Main Plan vs Execution — ops tabs or DC Manager tabs based on persona |
| `Simulation.jsx` | Two-panel scenario modeler: chat thread + scenario config/results |
| `SimulationDetail.jsx` | Full simulation output: KPI table, per-zone impact, hourly load timeline |
| `MFA.jsx` | Multi-Faceted Analytics — Overview, Reslotting, and Simulation tabs |
| `WarehouseProcessMap.jsx` | Interactive React Flow diagram of warehouse operations |
| `NLQuery.jsx` | Natural language query interface |

### Plan vs Execution Sub-components

| Component | Description |
|-----------|-------------|
| `OverviewDashboard.jsx` | High-level KPIs and exception summary (inbound-manager) |
| `ExceptionPatterns.jsx` | Exception pattern analysis with sub-tabs (inbound-manager) |
| `SlottingTab.jsx` | Slotting-related exceptions |
| `LocationsTab.jsx` | Location-based exceptions |
| `OrderTypesTab.jsx` | Order type exceptions |
| `EquipmentTab.jsx` | Equipment-related exceptions |
| `AlertSubscriptions.jsx` | Alert configuration management |
| `HistoricalTrace.jsx` | Historical data trace viewer |
| `ProjectionPanel.jsx` | Future projections based on data |
| `HorizontalBarChart.jsx` | Reusable horizontal bar chart component |
| `DCOverview.jsx` | DC Manager Overview: exec KPIs, OTIF risk signal, contributors, mitigators, action history |
| `DCDaySummary.jsx` | DC Manager Day Summary: status cards + executive summary sections |
| `DCContributorInboundVariability.jsx` | Drill-down: inbound variance analysis + OTIF impact |
| `DCContributorLaborFatigue.jsx` | Drill-down: zone fatigue index + OTIF impact |
| `DCContributorAutomation.jsx` | Drill-down: automation utilization bar + OTIF impact |
| `DCMitigatorOvertime.jsx` | Drill-down: pre-run simulation for Add Overtime scenario |
| `DCMitigatorPullForward.jsx` | Drill-down: pre-run simulation for Pull Inventory Forward scenario |

## Import Patterns

### Component Imports
```jsx
// External libraries
import { useState, useEffect } from 'react'
import { IconName, IconName2 } from 'lucide-react'
import { ReactFlow, Background, Controls, Handle, Position, MarkerType } from '@xyflow/react'

// Mock data
import { DATA_NAME, HELPER_FUNCTION } from '../mockData.js'

// JSON data files
import mapData from '../data/warehouseProcessMap.json'

// Child components (relative paths)
import ChildComponent from './ChildComponent.jsx'
```

### Mock Data Imports
Components import specific data they need:
```jsx
import {
  CONTAINERS_ALL,
  WORKERS,
  ZONE_CONFIG,
  SITE_STATS,
} from '../mockData.js'
```

## Build Output

Production builds output to `dist/`:
```
dist/
├── index.html
├── assets/
│   ├── index-[hash].js
│   └── index-[hash].css
└── [static assets]
```
