# SpinnakerSCA Warehouse IQ - Project Overview

## Project Summary

SpinnakerSCA Warehouse IQ is a warehouse management dashboard application built with React. It provides a comprehensive interface for managing container unloading, labor allocation, plan vs execution analysis, and multi-faceted analytics for warehouse operations.

## Technology Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| React | 18.3.1 | UI framework |
| Vite | 5.3.5 | Build tool and dev server |
| Tailwind CSS | 3.4.6 | Styling framework |
| Lucide React | 0.400.0 | Icon library |
| @xyflow/react | latest | Interactive flow diagram (Warehouse Process Map) |
| PostCSS | 8.4.40 | CSS processing |
| Autoprefixer | 10.4.19 | CSS vendor prefixes |

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Development Server
- Default port: 5173
- Hot Module Replacement (HMR) enabled
- Access at: http://localhost:5173

## Application Architecture

### Core Concept
The application is a single-page application (SPA) with client-side routing managed through React state. There is no backend - all data is served from mock data files.

### Persona System

The app starts with a **Login / Persona Selector** screen. Two personas are available:

| Persona | Name | Default Screen | Description |
|---------|------|---------------|-------------|
| `inbound-manager` | Jordan Chen | Yard Management | Ops view — containers, labor, exception analysis |
| `dc-manager` | Jamie Thompson | Plan vs Execution | Executive view — OTIF risk, cost KPIs, simulation |

Selecting a persona sets app state and routes to the default screen. **Switch User** resets to Login.

### Main Screens
1. **Yard Management** - Container selection and unloading operations
2. **Labor Management** - Worker allocation and zone management
3. **Plan vs Execution** - Persona-aware: ops tabs for Jordan; DC Manager tabs (Overview, Day Summary) for Jamie
4. **Multi-Faceted Analytics (MFA)** - Reslotting opportunities and optimization
5. **Simulation** - Two-panel scenario modeler with chat input and results
6. **Natural Language Queries** - Query interface for warehouse data
7. **Data Connections** - MCP data source configuration

### Component Hierarchy

```
App
├── Login (persona selector — shown when persona is null)
├── Header (global header, persona-aware avatar/name/role, Switch User)
├── Main Content Area (switches based on activeScreen)
│   ├── ContainerSelection (yard - selection view)
│   ├── UnloadingBay (yard - unloading view)
│   ├── LaborManagement
│   ├── PlanVsExecution (persona prop)
│   │   ├── [inbound-manager] OverviewDashboard, ExceptionPatterns, HistoricalTrace
│   │   └── [dc-manager] DCOverview, DCDaySummary
│   │       ├── DCOverview (KPIs, risk signal, contributors, mitigators, action history)
│   │       │   ├── DCContributorInboundVariability (drill-down)
│   │       │   ├── DCContributorLaborFatigue (drill-down)
│   │       │   ├── DCContributorAutomation (drill-down)
│   │       │   ├── DCMitigatorOvertime (drill-down → Simulation)
│   │       │   └── DCMitigatorPullForward (drill-down → Simulation)
│   │       └── DCDaySummary (status cards + executive summary)
│   ├── Simulation (two-panel: chat left, config/results right)
│   │   └── SimulationDetail (full KPI table, per-zone, hourly timeline)
│   ├── MFAScreen
│   ├── NLQueryScreen
│   └── DataSourcesScreen
└── Navbar (right-side vertical navigation)
```

## Deployment

The app is deployed as a static site on **AWS S3 + CloudFront**.

| Resource | Value |
|----------|-------|
| S3 bucket | `ssca-demfcast/warehouse-iq/` (us-east-1) |
| CloudFront domain | `https://d9p3fj3jgp9b9.cloudfront.net` |

To deploy: add temporary STS credentials to `.env`, then run `make deploy`.
See `DEPLOY.md` for full instructions and troubleshooting.

---

## Design Principles

1. **Component-based Architecture** - Reusable UI components
2. **State Management** - React useState/useEffect hooks (no external state library)
3. **Mock Data Driven** - All data comes from `src/mockData.js`
4. **Tailwind CSS** - Utility-first styling with custom animations
5. **Responsive Layout** - Fixed navigation with scrollable content areas

## File Naming Conventions

- React components: PascalCase (e.g., `Header.jsx`, `LaborManagement.jsx`)
- Utility files: camelCase
- Documentation: lowercase with hyphens (e.g., `00-overview.md`)

## Key Dependencies

### lucide-react
Provides all icons used throughout the application. Icons are imported individually:

```jsx
import { Boxes, Users2, Clock, AlertTriangle } from 'lucide-react'
```

### Tailwind CSS
Styling is applied via utility classes. Custom animations defined in `tailwind.config.js`:

- `scan-line` - Scanning animation effect
- `fade-in` - Fade in with slight upward motion
- `slide-down` - Slide down from above
