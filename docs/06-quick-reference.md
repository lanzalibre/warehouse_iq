# Quick Reference - Rebuild Guide

This guide provides the essential information needed to rebuild the SpinnakerSCA Warehouse IQ application from scratch.

## Step 1: Project Setup

```bash
# Create project with Vite
npm create vite@latest warehouse-iq -- --template react

# Navigate to project
cd warehouse-iq

# Install dependencies
npm install lucide-react

# Install dev dependencies
npm install -D tailwindcss postcss autoprefixer

# Initialize Tailwind
npx tailwindcss init -p
```

## Step 2: Configuration Files

### tailwind.config.js
```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      keyframes: {
        scanLine: {
          '0%':   { top: '0%' },
          '50%':  { top: 'calc(100% - 2px)' },
          '100%': { top: '0%' },
        },
        fadeIn: {
          from: { opacity: '0', transform: 'translateY(6px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          from: { opacity: '0', transform: 'translateY(-8px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'scan-line': 'scanLine 1.8s linear infinite',
        'fade-in':   'fadeIn 0.35s ease-out',
        'slide-down': 'slideDown 0.4s ease-out',
      },
    },
  },
  plugins: [],
}
```

### src/index.css
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Inter', sans-serif;
  -webkit-font-smoothing: antialiased;
}

::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
::-webkit-scrollbar-track {
  background: #f1f5f9;
}
::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}
::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
```

## Step 3: Directory Structure

```
src/
├── components/
│   ├── Header.jsx
│   ├── Navbar.jsx
│   ├── ContainerSelection.jsx
│   ├── UnloadingBay.jsx
│   ├── LaborManagement.jsx
│   ├── PlanVsExecution/
│   │   ├── index.jsx
│   │   ├── OverviewDashboard.jsx
│   │   ├── ExceptionPatterns.jsx
│   │   ├── AlertSubscriptions.jsx
│   │   ├── HistoricalTrace.jsx
│   │   ├── ProjectionPanel.jsx
│   │   ├── HorizontalBarChart.jsx
│   │   └── ExceptionPatterns/
│   │       ├── SlottingTab.jsx
│   │       ├── LocationsTab.jsx
│   │       ├── OrderTypesTab.jsx
│   │       └── EquipmentTab.jsx
│   ├── MFA.jsx
│   └── NLQuery.jsx
├── App.jsx
├── main.jsx
├── index.css
└── mockData.js
```

## Step 4: Core App Structure

### App.jsx Pattern
```jsx
import { useState } from 'react'
import Header from './components/Header.jsx'
import Navbar from './components/Navbar.jsx'
import ContainerSelection from './components/ContainerSelection.jsx'
// ... other imports

export default function App() {
  const [activeScreen, setActiveScreen] = useState('yard')
  const [yardView, setYardView] = useState('selection')
  const [acceptedContainerId, setAcceptedContainerId] = useState(null)

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Header
        view={yardView}
        activeScreen={activeScreen}
        onBack={() => { setYardView('selection') }}
        acceptedContainerId={acceptedContainerId}
      />
      <div className="flex flex-1 overflow-hidden">
        <div className="flex flex-col flex-1 overflow-hidden">
          {/* Screen content based on activeScreen */}
        </div>
        <Navbar activeScreen={activeScreen} onNavigate={setActiveScreen} />
      </div>
    </div>
  )
}
```

### Navbar.jsx Pattern
```jsx
import { Boxes, Users2, GitCompare, LayoutGrid, MessageSquare } from 'lucide-react'

const NAV_ITEMS = [
  { id: 'yard',      icon: Boxes,       shortLabel: 'Yard',  fullLabel: 'Yard Management' },
  { id: 'labor',     icon: Users2,      shortLabel: 'Labor', fullLabel: 'Labor Management' },
  { id: 'plan-exec', icon: GitCompare,  shortLabel: 'Plan',  fullLabel: 'Plan vs Execution' },
  { id: 'mfa',       icon: LayoutGrid,  shortLabel: 'MFA',   fullLabel: 'Multi-Faceted Analytics' },
  { id: 'nl-query',  icon: MessageSquare, shortLabel: 'Query', fullLabel: 'Natural Language Queries' },
]

export default function Navbar({ activeScreen, onNavigate }) {
  return (
    <nav className="w-[56px] bg-slate-900 border-l border-slate-700 flex flex-col items-center pt-4 pb-4 gap-1 flex-shrink-0">
      {NAV_ITEMS.map(({ id, icon: Icon, shortLabel, fullLabel }) => {
        const isActive = activeScreen === id
        return (
          <button
            key={id}
            onClick={() => onNavigate(id)}
            className={`group relative w-10 h-12 rounded-xl flex flex-col items-center justify-center gap-0.5 transition-all ${
              isActive ? 'bg-blue-600 text-white' : 'text-slate-500 hover:bg-slate-800 hover:text-slate-200'
            }`}
          >
            <Icon size={18} />
            <span className="text-[9px] font-semibold">{shortLabel}</span>
          </button>
        )
      })}
    </nav>
  )
}
```

## Step 5: Mock Data Pattern

### mockData.js Structure
```javascript
// Zone configuration
export const ZONE_CONFIG = { /* ... */ }

// Site statistics
export const SITE_STATS = { /* ... */ }

// Containers
export const CONTAINERS_ALL = [ /* ... */ ]

// Workers
export const WORKERS = [ /* ... */ ]

// Helper functions
export function getPriorityConfig(container) { /* ... */ }
export function getExperienceLevel(months) { /* ... */ }
```

## Step 6: Component Patterns

### Master-Detail Component
```jsx
export default function MasterDetail() {
  const [selectedId, setSelectedId] = useState(null)

  return (
    <div className="flex flex-1 overflow-hidden">
      {/* Master list */}
      <div className="w-80 flex-shrink-0 bg-slate-50 border-r border-slate-200 overflow-y-auto">
        {items.map(item => (
          <div
            key={item.id}
            onClick={() => setSelectedId(item.id)}
            className={`p-3 cursor-pointer ${selectedId === item.id ? 'bg-blue-50 border-l-2 border-blue-500' : ''}`}
          >
            {/* Item content */}
          </div>
        ))}
      </div>

      {/* Detail panel */}
      <div className="flex-1 overflow-y-auto p-6">
        {selectedId ? (
          <DetailPanel item={items.find(i => i.id === selectedId)} />
        ) : (
          <EmptyState />
        )}
      </div>
    </div>
  )
}
```

### Tab Navigation Component
```jsx
export default function TabbedView() {
  const [activeTab, setActiveTab] = useState('tab1')

  const tabs = [
    { id: 'tab1', label: 'Tab 1' },
    { id: 'tab2', label: 'Tab 2' },
  ]

  return (
    <div className="flex flex-col h-full">
      <div className="flex gap-2 px-6 py-3 bg-white border-b border-slate-200 flex-shrink-0">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === tab.id ? 'bg-blue-500 text-white' : 'bg-transparent text-slate-600 hover:bg-slate-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="flex-1 overflow-y-auto p-6">
        {activeTab === 'tab1' && <Tab1Content />}
        {activeTab === 'tab2' && <Tab2Content />}
      </div>
    </div>
  )
}
```

## Step 7: Common UI Elements

### Badge/Chip
```jsx
<span className="text-xs font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
  {label}
</span>
```

### Progress Bar
```jsx
<div className="h-2 bg-slate-200 rounded-full overflow-hidden">
  <div className="h-full bg-blue-500 rounded-full" style={{ width: `${pct}%` }} />
</div>
```

### Card
```jsx
<div className="bg-white rounded-xl border border-slate-200 p-4 hover:border-slate-300 cursor-pointer transition-all">
  {/* Card content */}
</div>
```

### KPI Card
```jsx
<div className="bg-white rounded-xl border border-slate-200 p-4">
  <div className="flex items-start justify-between mb-3">
    <div className="flex items-center gap-3">
      <div className="p-2.5 rounded-full bg-blue-100">
        <Icon size={18} className="text-blue-600" />
      </div>
      <div>
        <div className="text-xs text-slate-400 mb-1">{label}</div>
        <div className="text-2xl font-bold text-slate-800">{value}</div>
      </div>
    </div>
  </div>
  {subtext && <div className="text-xs text-slate-500">{subtext}</div>}
</div>
```

## Key Implementation Notes

1. **No routing library** - Navigation managed via React state
2. **No state management library** - useState/useEffect only
3. **All data is mock** - No API calls, data from mockData.js
4. **Tailwind CSS only** - No custom CSS except scrollbar
5. **Lucide icons** - Import only what you need
6. **Responsive not priority** - Designed for desktop 1440px+
7. **Zone colors consistent** - Blue (A), Emerald (B), Violet (C), Orange (D), Yellow (Crossdock)

## Files to Create in Order

1. `tailwind.config.js` - Tailwind configuration
2. `src/index.css` - Global styles
3. `src/mockData.js` - All mock data
4. `src/components/Header.jsx` - Global header
5. `src/components/Navbar.jsx` - Navigation
6. `src/App.jsx` - Root component
7. `src/components/ContainerSelection.jsx` - Yard selection
8. `src/components/UnloadingBay.jsx` - Unloading view
9. `src/components/LaborManagement.jsx` - Labor dashboard
10. `src/components/PlanVsExecution/index.jsx` - Plan vs Exec
11. `src/components/MFA.jsx` - Multi-Faceted Analytics
12. `src/components/NLQuery.jsx` - Natural Language Queries
