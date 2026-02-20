import { Boxes, Users2, GitCompare, MapPinOff, Clock } from 'lucide-react'

const NAV_ITEMS = [
  { id: 'yard',          icon: Boxes,       shortLabel: 'Yard',    fullLabel: 'Yard Management'      },
  { id: 'labor',         icon: Users2,      shortLabel: 'Labor',   fullLabel: 'Labor Management'     },
  { id: 'plan-exec',     icon: GitCompare,   shortLabel: 'Plan',    fullLabel: 'Plan vs Execution'    },
  { id: 'misplaced',     icon: MapPinOff,    shortLabel: 'Lost',    fullLabel: 'Misplaced / Not Found' },
  { id: 'delays',        icon: Clock,        shortLabel: 'Delays',  fullLabel: 'Delay Patterns'       },
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
            title={fullLabel}
            className={`group relative w-10 h-12 rounded-xl flex flex-col items-center justify-center gap-0.5 transition-all ${
              isActive
                ? 'bg-blue-600 text-white'
                : 'text-slate-500 hover:bg-slate-800 hover:text-slate-200'
            }`}
          >
            <Icon size={18} />
            <span className="text-[9px] font-semibold leading-none tracking-wide">
              {shortLabel}
            </span>
            {/* Active indicator bar on left edge */}
            {isActive && (
              <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-6 bg-blue-400 rounded-r-full" />
            )}
            {/* Tooltip */}
            <span className="pointer-events-none absolute right-full mr-2 top-1/2 -translate-y-1/2 whitespace-nowrap bg-slate-800 text-white text-xs font-medium px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity border border-slate-700">
              {fullLabel}
            </span>
          </button>
        )
      })}
    </nav>
  )
}
