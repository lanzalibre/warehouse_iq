import { useState, useEffect } from 'react'
import { ArrowLeft, Package, Clock, Building2 } from 'lucide-react'

export default function Header({ view, activeScreen, onBack, acceptedContainerId }) {
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

  function Breadcrumb() {
    if (activeScreen === 'labor') {
      return <span className="text-slate-300">Labor Management</span>
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
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <Package size={18} className="text-white" />
            </div>
            <div>
              <span className="font-bold text-lg tracking-tight">InboundIQ</span>
              <span className="text-slate-400 text-xs ml-2 font-normal">Warehouse Intelligence Platform</span>
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
            <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-xs font-bold">
              JC
            </div>
            <div className="leading-tight">
              <div className="text-white text-sm font-medium">Jordan Chen</div>
              <div className="text-slate-500 text-xs">Inbound Manager</div>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
