import { useState, useEffect } from 'react'
import { ArrowLeft, Clock, Building2 } from 'lucide-react'
import spinnakerLogo from '/Spinnaker_SCA_Logo.png'

export default function Header({ view, activeScreen, onBack, acceptedContainerId, persona, onSwitchUser }) {
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  const timeStr = time.toLocaleTimeString('en-US', {
    hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false,
  })
  const dateStr = time.toLocaleDateString('en-US', {
    weekday: 'short', month: 'short', day: 'numeric',
  })

  const showBack = activeScreen === 'yard' && view === 'unloading'
  const isDCManager = persona?.id === 'dc-manager'

  function Breadcrumb() {
    if (activeScreen === 'labor') {
      return <span className="text-slate-300">Labor Management</span>
    }
    if (activeScreen === 'plan-exec') {
      return <span className="text-slate-300">Plan vs. Execution</span>
    }
    if (activeScreen === 'nl-query') {
      return <span className="text-slate-300">Natural Language Queries</span>
    }
    if (activeScreen === 'mfa') {
      return <span className="text-slate-300">Multi-Faceted Analytics</span>
    }
    if (activeScreen === 'simulation') {
      return <span className="text-slate-300">Simulation</span>
    }
    if (activeScreen === 'misplaced') {
      return <span className="text-slate-300">Misplaced / Not Found</span>
    }
    if (activeScreen === 'delays') {
      return <span className="text-slate-300">&gt;30% Delay Patterns</span>
    }
    if (view === 'unloading') {
      return (
        <>
          <span className="text-slate-500">Yard Management</span>
          <span className="text-slate-600 mx-1">/</span>
          <span className="text-slate-300">Unloading Bay — {acceptedContainerId}</span>
        </>
      )
    }
    return <span className="text-slate-300">Yard Management</span>
  }

  return (
    <header className="bg-slate-900 text-white flex-shrink-0">
      <div className="flex items-center justify-between px-6 py-3">
        {/* Left: Logo + nav */}
        <div className="flex items-center gap-4">
          {showBack && (
            <button
              onClick={onBack}
              className="flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors text-sm mr-2"
            >
              <ArrowLeft size={15} />
              <span>Back</span>
            </button>
          )}
          <div className="flex items-center gap-3">
            <img
              src={spinnakerLogo}
              alt="Spinnaker SCA"
              className="h-10 w-auto flex-shrink-0 brightness-0 invert"
            />
            <div>
              <span className="font-bold text-lg tracking-tight">SpinnakerSCA</span>
              <span className="text-slate-400 text-xs ml-2 font-normal">Warehouse IQ</span>
            </div>
          </div>

          {/* Breadcrumb */}
          <div className="flex items-center gap-1.5 text-slate-400 text-sm ml-4 pl-4 border-l border-slate-700">
            <Building2 size={13} />
            <span>Site MID-05</span>
            <span className="text-slate-600 mx-1">·</span>
            <Breadcrumb />
          </div>
        </div>

        {/* Right: User + clock */}
        <div className="flex items-center gap-5 text-sm">
          <div className="flex items-center gap-1.5 text-slate-400">
            <Clock size={13} />
            <span className="font-mono text-slate-300">{timeStr}</span>
            <span className="text-slate-500 ml-1">{dateStr}</span>
          </div>
          <div className="flex items-center gap-2 pl-5 border-l border-slate-700">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${isDCManager ? 'bg-violet-600' : 'bg-blue-600'}`}>
              {isDCManager ? 'JT' : 'JC'}
            </div>
            <div className="leading-tight">
              <div className="text-white text-sm font-medium">{isDCManager ? 'Jamie Thompson' : 'Jordan Chen'}</div>
              <div className="text-slate-500 text-xs">{isDCManager ? 'General Manager' : 'Inbound Manager'}</div>
            </div>
          </div>
          {onSwitchUser && (
            <button
              onClick={onSwitchUser}
              className="text-xs text-slate-400 hover:text-slate-200 transition-colors border border-slate-700 rounded px-2 py-1"
            >
              Switch User
            </button>
          )}
        </div>
      </div>
    </header>
  )
}
