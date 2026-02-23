# SpinnakerSCA Warehouse IQ

A modern warehouse intelligence platform for managing inbound operations, labor allocation, and operational analytics.

## Features

### 🏗️ Yard Management
- Container prioritization with AI-powered recommendations
- Real-time workload estimation and zone capacity tracking
- Container scanning with special handling detection
- Visual progress tracking through unloading workflows

### 👥 Labor Management
- Shift roster with real-time check-in tracking
- Zone-based labor allocation and capacity monitoring
- Workload vs capacity visualization
- AI-powered worker rebalancing recommendations
- Experience tracking by zone

### 💬 Natural Language Queries
- Ask plain-English questions about warehouse state (containers, workers, waves, delays, performance)
- `@` mention system to scope queries to specific waves, orders, docks, containers, or pickers
- Keyboard-navigable autocomplete dropdown (Tab/Enter to select, ↑↓ to navigate)
- Pre-loaded question library with 4 collapsible categories and 13 common queries
- Structured, data-rich response cards: dock workers, container age, yard overview, suppliers, wave status, labor breakdown, delay patterns, throughput stats

### 📊 Plan vs Execution
- Compare WMS pick tasks with WES execution traces
- Real-time exception detection (no scan, wrong location, quantity mismatches)
- Travel and dwell time analysis
- Detailed task-level audit trails

### 🔍 Misplaced / Not Found
- Track locations with pick denials and empty location reports
- Identify inventory vs slotting issues
- Bulk action management (cycle counts, audits, re-slotting)
- Picker bypass history tracking

### ⏱️ Delay Patterns
- Identify delays >30% across zones, equipment, and order types
- WES context (conveyor issues, micro-stoppages)
- WMS context (fast-moving SKUs, SLA risk assessment)
- Critical service risk alerts

## Tech Stack

- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **Lucide React** - Icons

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

The application will be available at `http://localhost:5173`

## Project Structure

```
src/
├── components/
│   ├── Header.jsx          # Main header with branding and navigation
│   ├── Navbar.jsx          # Sidebar navigation
│   ├── ContainerSelection.jsx  # Container priority recommendations
│   ├── UnloadingBay.jsx        # Container unloading workflow
│   ├── LaborManagement.jsx     # Labor dashboard
│   ├── PlanVsExecution/        # Plan vs execution comparison
│   ├── NLQuery.jsx             # Natural language query interface
│   ├── MisplacedItems.jsx      # Misplaced location tracking
│   └── DelayPatterns.jsx       # Delay pattern analysis
├── App.jsx                 # Main application component
├── main.jsx                # Application entry point
└── mockData.js            # Mock data for demonstration
```

## Data Models

### Products
- **Shoes** - Nike, Adidas, New Balance, Timberland
- **Sports & Outdoor** - Nike, Under Armour, Puma, Reebok
- **General Clothing** - H&M, Mango, Gap, Zara

### Zones
- **Zone A** - Receiving & Prep
- **Zone B** - General Storage
- **Zone C** - Pick & Pack
- **Zone D** - Cold Storage / Climate Controlled
- **Crossdock** - Crossdock Bay

## Screens

| Screen | Description |
|---------|-------------|
| Yard Management | Container prioritization and unloading workflows |
| Labor Management | Shift roster, capacity tracking, worker recommendations |
| Plan vs Execution | WMS/WES task comparison and exception tracking |
| Natural Language Queries | Plain-English warehouse Q&A with `@` mention scoping |
| Misplaced / Not Found | Location issue tracking and resolution actions |
| Delay Patterns | >30% delay analysis by zone, equipment, order type |

