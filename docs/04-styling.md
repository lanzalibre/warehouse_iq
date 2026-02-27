# Styling Guide

## Tailwind CSS Configuration

The project uses Tailwind CSS v3.4.6 with custom extensions defined in `tailwind.config.js`.

### Custom Animations

```javascript
// tailwind.config.js
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
}
```

### Animation Usage
```jsx
// Scanning effect (used in UnloadingBay)
<div className="animate-scan-line" />

// Fade in on mount
<div className="animate-fade-in" />

// Slide down on appear
<div className="animate-slide-down" />
```

---

## Global Styles

Defined in `src/index.css`:

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

/* Custom scrollbar */
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

---

## Color Palette

The application uses Tailwind's default color palette with emphasis on:

### Primary Colors
| Color | Usage |
|-------|-------|
| `blue-500/600/700` | Primary actions, Zone A, active states |
| `emerald-500/600/700` | Success, savings, positive indicators |
| `red-500/600/700` | Errors, costs, urgent items |
| `amber-500/600/700` | Warnings, pending states |

### Zone Colors
| Zone | Color | Tailwind Classes |
|------|-------|-----------------|
| Zone A | Blue | `bg-blue-500`, `text-blue-700`, `bg-blue-50` |
| Zone B | Emerald | `bg-emerald-500`, `text-emerald-700` |
| Zone C | Violet | `bg-violet-500`, `text-violet-700` |
| Zone D | Orange | `bg-orange-500`, `text-orange-700` |
| Crossdock | Yellow | `bg-yellow-500`, `text-yellow-700` |

### Neutral Colors
| Color | Usage |
|-------|-------|
| `slate-50` | Page backgrounds |
| `slate-100` | Card backgrounds, hover states |
| `slate-200` | Borders, dividers |
| `slate-500` | Secondary text, icons |
| `slate-700` | Primary text |
| `slate-900` | Headers, navigation |

---

## Component Styling Patterns

### Cards
```jsx
// Standard card
<div className="bg-white rounded-xl border border-slate-200 p-4">

// Hoverable card
<div className="bg-white rounded-xl border border-slate-200 p-4 hover:border-slate-300 cursor-pointer transition-all">

// Selected/active card
<div className="bg-blue-50 rounded-xl border-2 border-blue-500 p-4">
```

### Buttons
```jsx
// Primary button
<button className="px-4 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors">

// Secondary button
<button className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg font-medium hover:bg-slate-200 transition-colors">

// Active state button
<button className="px-4 py-2 bg-blue-500 text-white rounded-lg font-medium">
```

### Badges/Chips
```jsx
// Status badge
<span className="text-xs font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">

// Priority badge (urgent)
<span className="text-xs font-bold px-2 py-1 rounded bg-red-100 text-red-700">URGENT</span>

// Processing method chip
<span className="text-xs font-medium px-1.5 py-0.5 rounded bg-blue-100 text-blue-700">CR</span>
```

### Progress Bars
```jsx
<div className="h-2 bg-slate-200 rounded-full overflow-hidden">
  <div
    className="h-full bg-blue-500 rounded-full transition-all"
    style={{ width: `${percentage}%` }}
  />
</div>
```

### Tables
```jsx
<div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
  <table className="w-full text-xs">
    <thead>
      <tr className="bg-slate-50 text-slate-600">
        <th className="text-left py-2 px-3 font-semibold">Header</th>
      </tr>
    </thead>
    <tbody>
      <tr className="border-b border-slate-100 last:border-0">
        <td className="py-2.5 px-3">Cell</td>
      </tr>
    </tbody>
  </table>
</div>
```

### Section Headers
```jsx
// With icon
<h3 className="text-sm font-semibold text-slate-800 flex items-center gap-2">
  <Icon size={16} className="text-slate-500" />
  Section Title
</h3>

// Simple
<h3 className="text-sm font-semibold text-slate-800 mb-3">Section Title</h3>
```

---

## Layout Patterns

### Master-Detail Layout
```jsx
<div className="flex flex-1 overflow-hidden">
  {/* Master panel - scrollable list */}
  <div className="w-80 flex-shrink-0 bg-slate-50 border-r border-slate-200 overflow-y-auto">
    {/* List items */}
  </div>

  {/* Detail panel - scrollable content */}
  <div className="flex-1 overflow-y-auto p-6">
    {/* Details */}
  </div>
</div>
```

### Three-Column Layout
```jsx
<div className="flex flex-1 overflow-hidden">
  {/* Left sidebar */}
  <div className="w-56 flex-shrink-0 bg-slate-50 border-r border-slate-200">
    {/* Zone summary */}
  </div>

  {/* Main content */}
  <div className="flex-1 overflow-y-auto">
    {/* Main panel */}
  </div>

  {/* Right detail panel */}
  <div className="w-80 flex-shrink-0 bg-white border-l border-slate-200">
    {/* Details */}
  </div>
</div>
```

### Fixed Header + Scrollable Content
```jsx
<div className="flex flex-col h-full">
  {/* Fixed header */}
  <div className="flex-shrink-0 bg-white border-b border-slate-200 px-6 py-4">
    {/* Header content */}
  </div>

  {/* Scrollable content */}
  <div className="flex-1 overflow-y-auto p-6">
    {/* Main content */}
  </div>
</div>
```

---

## Typography

### Font Sizes
| Size | Tailwind Class | Usage |
|------|---------------|-------|
| 9px | `text-[9px]` | Nav labels, tiny text |
| 10px | `text-[10px]` | Labels, metadata |
| 12px | `text-xs` | Table cells, badges |
| 14px | `text-sm` | Body text, labels |
| 16px | `text-base` | Default body |
| 18px | `text-lg` | Subheadings |
| 20px | `text-xl` | Headings |
| 24px | `text-2xl` | Large numbers, titles |

### Font Weights
| Weight | Tailwind Class | Usage |
|--------|---------------|-------|
| Normal | `font-normal` | Body text |
| Medium | `font-medium` | Emphasis |
| Semibold | `font-semibold` | Labels, headers |
| Bold | `font-bold` | Titles, numbers |
| Black | `font-black` | Large numbers |

---

## Spacing Conventions

### Padding
| Element | Padding |
|---------|---------|
| Page/container | `p-6` (24px) |
| Card | `p-4` (16px) |
| Button | `px-4 py-2` |
| Table cell | `py-2.5 px-3` |
| Section gap | `mb-4` or `mb-6` |

### Margins
| Use Case | Class |
|----------|-------|
| Between elements | `gap-2`, `gap-3`, `gap-4` |
| Section spacing | `mb-4`, `mb-6` |
| Icon + text | `gap-1.5`, `gap-2` |

---

## Responsive Considerations

The application is designed for desktop use with fixed-width panels. Key breakpoints are not heavily used, but layouts use:

- `flex-1` for flexible content areas
- `flex-shrink-0` for fixed-width sidebars
- `overflow-y-auto` for scrollable regions
- `min-h-screen` for full-height layouts
