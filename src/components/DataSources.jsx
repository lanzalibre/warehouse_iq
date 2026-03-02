import { useState } from 'react'
import {
  LayoutGrid, Building2, Warehouse, Cpu, Database, FolderOpen,
  ChevronDown, ChevronUp, CheckCircle2, XCircle, Loader2, Cable,
} from 'lucide-react'

const CATEGORIES = [
  { id: 'all',       label: 'All',                   icon: LayoutGrid },
  { id: 'erp',       label: 'ERP Systems',            icon: Building2  },
  { id: 'wms',       label: 'WMS Platforms',          icon: Warehouse  },
  { id: 'wes',       label: 'Execution Systems',      icon: Cpu        },
  { id: 'analytics', label: 'Analytics & Databases',  icon: Database   },
  { id: 'storage',   label: 'File Storage',           icon: FolderOpen },
]

const CONNECTIONS_DATA = [
  { id: 'sap',        category: 'erp',       name: 'SAP S/4HANA',              desc: 'ERP — purchase orders, inventory master, vendor data',          connected: true,  host: 'sap.corp.internal',             clientId: 'WH_CLIENT_01' },
  { id: 'oracle',     category: 'erp',       name: 'Oracle ERP Cloud',         desc: 'ERP — financial transactions, procurement, planning',           connected: false, host: '',                              clientId: '' },
  { id: 'manhattan',  category: 'wms',       name: 'Manhattan Associates',     desc: 'WMS — slotting, wave management, order fulfillment',            connected: true,  host: 'mwms.corp.internal',            clientId: 'SSCA_INT' },
  { id: 'blueyonder', category: 'wms',       name: 'Blue Yonder',              desc: 'WMS — demand forecasting, replenishment, labor mgmt',           connected: false, host: '',                              clientId: '' },
  { id: 'wes',        category: 'wes',       name: 'Warehouse Execution System', desc: 'WES — real-time task dispatch, pick-to-light, conveyor',      connected: true,  host: 'wes-prod.corp.internal',        clientId: 'SSCA_WES' },
  { id: 'snowflake',  category: 'analytics', name: 'Snowflake',                desc: 'Data warehouse — historical KPIs, trend analytics',             connected: true,  host: 'xy12345.snowflakecomputing.com', clientId: 'SSCA_WH' },
  { id: 'databricks', category: 'analytics', name: 'Databricks',               desc: 'Lakehouse — ML models, demand forecasts, reslotting',           connected: false, host: '',                              clientId: '' },
  { id: 's3',         category: 'storage',   name: 'AWS S3',                   desc: 'Object storage — container manifests, PO attachments',          connected: true,  host: 's3://ssca-demfcast',            clientId: 'ASIA...' },
  { id: 'excel',      category: 'storage',   name: 'Excel / CSV Folders',      desc: 'Local file sync — manual uploads, legacy data feeds',           connected: false, host: '',                              clientId: '' },
]

const CATEGORY_COLORS = {
  erp:       'bg-blue-100 text-blue-600',
  wms:       'bg-violet-100 text-violet-600',
  wes:       'bg-amber-100 text-amber-600',
  analytics: 'bg-emerald-100 text-emerald-600',
  storage:   'bg-orange-100 text-orange-600',
}

function getCategoryIcon(categoryId) {
  return CATEGORIES.find(c => c.id === categoryId)?.icon ?? Cable
}

export default function DataSourcesScreen() {
  const [activeCategory, setActiveCategory] = useState('all')
  const [expandedId, setExpandedId] = useState(null)
  const [statuses, setStatuses] = useState(
    () => Object.fromEntries(CONNECTIONS_DATA.map(c => [c.id, c.connected]))
  )
  const [testResult, setTestResult] = useState({})
  const [testLoading, setTestLoading] = useState({})
  const [formValues, setFormValues] = useState(
    () => Object.fromEntries(
      CONNECTIONS_DATA.map(c => [c.id, { host: c.host, clientId: c.clientId, secret: c.connected ? '••••••••' : '' }])
    )
  )

  const filtered = activeCategory === 'all'
    ? CONNECTIONS_DATA
    : CONNECTIONS_DATA.filter(c => c.category === activeCategory)

  function toggleExpand(id) {
    setExpandedId(prev => (prev === id ? null : id))
    setTestResult(prev => ({ ...prev, [id]: null }))
  }

  function handleFormChange(id, field, value) {
    setFormValues(prev => ({ ...prev, [id]: { ...prev[id], [field]: value } }))
  }

  function handleTest(id) {
    setTestLoading(prev => ({ ...prev, [id]: true }))
    setTestResult(prev => ({ ...prev, [id]: null }))
    setTimeout(() => {
      setTestLoading(prev => ({ ...prev, [id]: false }))
      setTestResult(prev => ({ ...prev, [id]: 'ok' }))
    }, 800)
  }

  function handleToggleConnect(id) {
    setStatuses(prev => {
      const next = !prev[id]
      if (next) setTestResult(pr => ({ ...pr, [id]: null }))
      return { ...prev, [id]: next }
    })
  }

  const connectedCount = Object.values(statuses).filter(Boolean).length

  return (
    <div className="flex flex-col h-full bg-slate-50 overflow-hidden">
      {/* Page header */}
      <div className="px-8 pt-6 pb-4 border-b border-slate-200 bg-white flex-shrink-0">
        <div className="flex items-center gap-3 mb-1">
          <Cable size={22} className="text-slate-500" />
          <h1 className="text-xl font-semibold text-slate-800">Data Connections</h1>
        </div>
        <p className="text-sm text-slate-500 ml-9">
          Configure MCP connections to ERPs, WMS platforms, execution systems, and analytics databases.
          &nbsp;<span className="text-emerald-600 font-medium">{connectedCount} of {CONNECTIONS_DATA.length} connected</span>
        </p>
      </div>

      {/* Body */}
      <div className="flex flex-1 overflow-hidden">
        {/* Category sidebar */}
        <aside className="w-52 flex-shrink-0 bg-white border-r border-slate-200 pt-4 px-3 overflow-y-auto">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 px-2 mb-2">Categories</p>
          {CATEGORIES.map(({ id, label, icon: Icon }) => {
            const isActive = activeCategory === id
            return (
              <button
                key={id}
                onClick={() => setActiveCategory(id)}
                className={`w-full flex items-center gap-2.5 px-2 py-2 rounded-lg text-sm font-medium transition-colors mb-0.5 ${
                  isActive
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-800'
                }`}
              >
                <Icon size={15} className={isActive ? 'text-blue-600' : 'text-slate-400'} />
                {label}
              </button>
            )
          })}
        </aside>

        {/* Cards grid */}
        <main className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-2 gap-4 max-w-5xl">
            {filtered.map(conn => {
              const isExpanded = expandedId === conn.id
              const isConnected = statuses[conn.id]
              const CategoryIcon = getCategoryIcon(conn.category)
              const colorClass = CATEGORY_COLORS[conn.category] ?? 'bg-slate-100 text-slate-500'
              const form = formValues[conn.id]
              const result = testResult[conn.id]
              const loading = testLoading[conn.id]

              return (
                <div
                  key={conn.id}
                  className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col"
                >
                  {/* Card header */}
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <span className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${colorClass}`}>
                          <CategoryIcon size={17} />
                        </span>
                        <div>
                          <p className="text-sm font-semibold text-slate-800 leading-snug">{conn.name}</p>
                          {/* Status badge */}
                          <span className={`inline-flex items-center gap-1 text-xs font-medium mt-0.5 ${
                            isConnected ? 'text-emerald-600' : 'text-slate-400'
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${isConnected ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                            {isConnected ? 'Connected' : 'Disconnected'}
                          </span>
                        </div>
                      </div>
                    </div>
                    <p className="text-xs text-slate-500 mt-2 leading-relaxed">{conn.desc}</p>
                  </div>

                  {/* Configure toggle */}
                  <div className="border-t border-slate-100">
                    <button
                      onClick={() => toggleExpand(conn.id)}
                      className="w-full flex items-center justify-between px-4 py-2.5 text-xs font-medium text-slate-500 hover:bg-slate-50 transition-colors"
                    >
                      <span>Configure</span>
                      {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    </button>
                  </div>

                  {/* Expanded config */}
                  {isExpanded && (
                    <div className="border-t border-slate-200 p-4 bg-slate-50 flex flex-col gap-3">
                      {/* Host */}
                      <label className="flex flex-col gap-1">
                        <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Host / Endpoint</span>
                        <input
                          type="text"
                          value={form.host}
                          onChange={e => handleFormChange(conn.id, 'host', e.target.value)}
                          placeholder="e.g. erp.corp.internal"
                          className="w-full text-sm border border-slate-300 rounded-lg px-3 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                      </label>

                      {/* Client ID */}
                      <label className="flex flex-col gap-1">
                        <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Client ID</span>
                        <input
                          type="text"
                          value={form.clientId}
                          onChange={e => handleFormChange(conn.id, 'clientId', e.target.value)}
                          placeholder="e.g. SSCA_CLIENT_01"
                          className="w-full text-sm border border-slate-300 rounded-lg px-3 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                      </label>

                      {/* Secret */}
                      <label className="flex flex-col gap-1">
                        <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Secret / Token</span>
                        <input
                          type="password"
                          value={form.secret}
                          onChange={e => handleFormChange(conn.id, 'secret', e.target.value)}
                          placeholder="••••••••"
                          className="w-full text-sm border border-slate-300 rounded-lg px-3 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                      </label>

                      {/* Actions row */}
                      <div className="flex items-center gap-2 pt-1">
                        <button
                          onClick={() => handleTest(conn.id)}
                          disabled={loading}
                          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-300 bg-white hover:bg-slate-100 transition-colors disabled:opacity-60"
                        >
                          {loading
                            ? <Loader2 size={12} className="animate-spin" />
                            : null
                          }
                          Test Connection
                        </button>

                        <button
                          onClick={() => handleToggleConnect(conn.id)}
                          className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                            isConnected
                              ? 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                              : 'bg-blue-600 text-white hover:bg-blue-700'
                          }`}
                        >
                          {isConnected ? 'Disconnect' : 'Connect'}
                        </button>
                      </div>

                      {/* Test result */}
                      {result === 'ok' && (
                        <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-medium">
                          <CheckCircle2 size={13} />
                          Connection successful
                        </div>
                      )}
                      {result === 'fail' && (
                        <div className="flex items-center gap-1.5 text-xs text-red-500 font-medium">
                          <XCircle size={13} />
                          Connection failed — check credentials
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </main>
      </div>
    </div>
  )
}
