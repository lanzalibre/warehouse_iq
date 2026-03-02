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
│   │   ├── PlanVsExecution.jsx    # WES/WMS comparison (legacy)
│   │   ├── PlanVsExecution/       # Plan vs Execution module
│   │   │   ├── index.jsx          # Main component with tab navigation
│   │   │   ├── OverviewDashboard.jsx
│   │   │   ├── ExceptionPatterns.jsx
│   │   │   ├── AlertSubscriptions.jsx
│   │   │   ├── HistoricalTrace.jsx
│   │   │   ├── HorizontalBarChart.jsx
│   │   │   ├── ProjectionPanel.jsx
│   │   │   └── ExceptionPatterns/ # Exception pattern tabs
│   │   │       ├── SlottingTab.jsx
│   │   │       ├── LocationsTab.jsx
│   │   │       ├── OrderTypesTab.jsx
│   │   │       └── EquipmentTab.jsx
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
| `Header.jsx` | Top header bar with logo, breadcrumb, clock, user info |
| `Navbar.jsx` | Right-side vertical navigation with screen buttons |
| `ContainerSelection.jsx` | Yard view for selecting containers to unload |
| `UnloadingBay.jsx` | Active unloading operations with SKU scanning |
| `LaborManagement.jsx` | Worker allocation, zone management, rebalancing |
| `PlanVsExecution/index.jsx` | Main Plan vs Execution with sub-tabs |
| `MFA.jsx` | Multi-Faceted Analytics — Overview, Reslotting, and Simulation tabs |
| `WarehouseProcessMap.jsx` | Interactive React Flow diagram of warehouse operations; used in MFA Overview |
| `NLQuery.jsx` | Natural language query interface |

### Plan vs Execution Sub-components

| Component | Description |
|-----------|-------------|
| `OverviewDashboard.jsx` | High-level KPIs and exception summary |
| `ExceptionPatterns.jsx` | Exception pattern analysis with sub-tabs |
| `SlottingTab.jsx` | Slotting-related exceptions |
| `LocationsTab.jsx` | Location-based exceptions |
| `OrderTypesTab.jsx` | Order type exceptions |
| `EquipmentTab.jsx` | Equipment-related exceptions |
| `AlertSubscriptions.jsx` | Alert configuration management |
| `HistoricalTrace.jsx` | Historical data trace viewer |
| `ProjectionPanel.jsx` | Future projections based on data |
| `HorizontalBarChart.jsx` | Reusable horizontal bar chart component |

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
