import { useState } from 'react'
import { BarChart3, AlertTriangle, Clock, Bell, X, Eye, EyeOff } from 'lucide-react'
import OverviewDashboard from './OverviewDashboard.jsx'
import ExceptionPatterns from './ExceptionPatterns.jsx'
import HistoricalTrace from './HistoricalTrace.jsx'
import AlertSubscriptions from './AlertSubscriptions.jsx'
import { ALERT_SUBSCRIPTIONS } from '../../mockData.js'

// ─── Tab Button ─────────────────────────────────────────────────────────────
function TabButton({ activeTab, setActiveTab, id, label, icon: Icon }) {
  return (
    <button
      onClick={() => setActiveTab(id)}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
        activeTab === id
          ? 'bg-blue-500 text-white'
          : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
      }`}
    >
      <Icon size={16} />
      {label}
    </button>
  )
}

// ─── Unified Plan vs Execution Component ───────────────────────────────────────
export default function PlanVsExecution() {
  const [activeTab, setActiveTab] = useState('overview')
  const [showAlertPanel, setShowAlertPanel] = useState(false)
  const [subscriptions, setSubscriptions] = useState(ALERT_SUBSCRIPTIONS)

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'exceptions', label: 'Exception Patterns', icon: AlertTriangle },
    { id: 'trace', label: 'Historical Trace', icon: Clock },
  ]

  const handleToggleSubscription = (id) => {
    setSubscriptions(prev => prev.map(sub => {
      if (sub.id === id) {
        return { ...sub, enabled: !sub.enabled }
      }
      return sub
    }))
  }

  const handleAddSubscription = (subscription) => {
    setSubscriptions(prev => [...prev, subscription])
  }

  const handleEditSubscription = (subscription) => {
    setSubscriptions(prev => prev.map(sub => {
      if (sub.id === subscription.id) {
        return subscription
      }
      return sub
    }))
  }

  const handleDeleteSubscription = (id) => {
    setSubscriptions(prev => prev.filter(sub => sub.id !== id))
  }

  return (
    <div className="flex flex-col flex-1 overflow-hidden bg-white">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-200">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-slate-800">Plan vs Execution</h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Compare planned operations with actual execution
            </p>
          </div>
          <button
            onClick={() => setShowAlertPanel(!showAlertPanel)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
              showAlertPanel
                ? 'bg-blue-500 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Bell size={16} />
            Alerts
            {subscriptions.filter(s => s.enabled).length > 0 && (
              <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                {subscriptions.filter(s => s.enabled).length}
              </span>
            )}
          </button>
        </div>

        {/* Tab navigation */}
        <div className="mt-4 flex gap-2">
          {tabs.map(tab => (
            <TabButton
              key={tab.id}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              id={tab.id}
              label={tab.label}
              icon={tab.icon}
            />
          ))}
        </div>
      </div>

      {/* Main content with alert panel */}
      <div className="flex flex-1 overflow-hidden">
        {/* Tab content */}
        <div className="flex-1 overflow-hidden">
          {activeTab === 'overview' && <OverviewDashboard />}
          {activeTab === 'exceptions' && <ExceptionPatterns />}
          {activeTab === 'trace' && <HistoricalTrace />}
        </div>

        {/* Alert Panel (slide-in) */}
        {showAlertPanel && (
          <div className="w-96 border-l border-slate-200 bg-slate-50 overflow-y-auto">
            <AlertSubscriptions
              subscriptions={subscriptions}
              onUpdate={setSubscriptions}
              onToggle={handleToggleSubscription}
              onAdd={handleAddSubscription}
              onEdit={handleEditSubscription}
              onDelete={handleDeleteSubscription}
            />
          </div>
        )}
      </div>
    </div>
  )
}
