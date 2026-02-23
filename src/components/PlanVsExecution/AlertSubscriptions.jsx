import { useState } from 'react'
import {
  Bell, BellOff, Plus, X, Edit, Mail, MessageSquare,
  MapPin, Clock, TrendingUp, AlertTriangle, Filter,
  Eye, EyeOff, Check,
} from 'lucide-react'
import { ALERT_SUBSCRIPTIONS } from '../../mockData.js'

// ─── Alert Type Icon ───────────────────────────────────────────────────────────
function AlertTypeIcon({ type }) {
  const config = {
    'misplacement': { icon: MapPin, color: 'text-red-600', label: 'Misplacements' },
    'sustained-delay': { icon: Clock, color: 'text-amber-600', label: 'Sustained Delays' },
    'trend': { icon: TrendingUp, color: 'text-blue-600', label: 'Trends' },
    'sla-risk': { icon: AlertTriangle, color: 'text-purple-600', label: 'SLA Risk' },
  }

  const cfg = config[type] || config['misplacement']
  const Icon = cfg.icon

  return (
    <div className={`flex items-center gap-1.5 text-xs font-semibold ${cfg.color}`}>
      <Icon size={14} />
      {cfg.label}
    </div>
  )
}

// ─── Notification Method Badge ───────────────────────────────────────────────────
function NotificationMethodBadge({ method }) {
  const config = {
    'email': { icon: Mail, label: 'Email', color: 'text-slate-600' },
    'sms': { icon: MessageSquare, label: 'SMS', color: 'text-slate-600' },
    'slack': { icon: MessageSquare, label: 'Slack', color: 'text-purple-600' },
  }

  const cfg = config[method] || config['email']
  const Icon = cfg.icon

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-100 ${cfg.color}`}>
      <Icon size={8} />
      {cfg.label}
    </span>
  )
}

// ─── Subscription Card ──────────────────────────────────────────────────────────
function SubscriptionCard({ subscription, onToggle, onEdit, onDelete }) {
  return (
    <div className={`border-2 rounded-xl p-4 mb-3 transition-all ${
      subscription.enabled
        ? 'bg-white border-slate-200'
        : 'bg-slate-50 border-slate-200 opacity-60'
    }`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          {/* Type icon */}
          <div className={`p-2 rounded-full ${subscription.enabled ? 'bg-blue-50' : 'bg-slate-100'}`}>
            {subscription.enabled ? <Bell size={16} className="text-blue-600" /> : <BellOff size={16} className="text-slate-400" />}
          </div>

          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono text-slate-400">{subscription.id}</span>
              <AlertTypeIcon type={subscription.type} />
            </div>
            {/* Filters */}
            <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
              <Filter size={10} />
              <span>
                Zones: <span className="font-medium text-slate-700">{subscription.filters.zones.join(', ')}</span>
              </span>
              <span>|</span>
              <span>
                Shifts: <span className="font-medium text-slate-700">{subscription.filters.shifts.join(', ')}</span>
              </span>
              {subscription.filters.severityThreshold && (
                <>
                  <span>|</span>
                  <span>
                    Severity: <span className="font-medium text-slate-700">{subscription.filters.severityThreshold}</span>
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => onEdit(subscription)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            title="Edit subscription"
          >
            <Edit size={14} />
          </button>
          <button
            onClick={() => onDelete(subscription.id)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
            title="Delete subscription"
          >
            <X size={14} />
          </button>
        </div>
      </div>

      {/* Notification methods */}
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xs text-slate-500">Notifications:</span>
        <div className="flex flex-wrap gap-1">
          {subscription.notificationMethods.map(method => (
            <NotificationMethodBadge key={method} method={method} />
          ))}
        </div>
      </div>

      {/* Toggle and last triggered */}
      <div className="flex items-center justify-between">
        {/* Toggle switch */}
        <button
          onClick={() => onToggle(subscription.id)}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
            subscription.enabled
              ? 'bg-blue-500 text-white'
              : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
          }`}
        >
          {subscription.enabled ? <Check size={12} /> : <BellOff size={12} />}
          {subscription.enabled ? 'Enabled' : 'Disabled'}
        </button>

        {/* Last triggered */}
        <div className="text-xs text-slate-500">
          {subscription.lastTriggered ? (
            <span>Last triggered: <span className="font-mono">{subscription.lastTriggered}</span></span>
          ) : (
            <span>Never triggered</span>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Add/Edit Subscription Dialog ───────────────────────────────────────────────────
function SubscriptionDialog({ subscription, onSave, onCancel }) {
  const [formData, setFormData] = useState(
    subscription || {
      type: 'misplacement',
      enabled: true,
      filters: {
        zones: ['Zone A'],
        shifts: ['AM'],
        severityThreshold: 'medium'
      },
      notificationMethods: ['email']
    }
  )

  const alertTypes = [
    { id: 'misplacement', label: 'Misplacements', icon: MapPin },
    { id: 'sustained-delay', label: 'Sustained Delays', icon: Clock },
    { id: 'trend', label: 'Trends', icon: TrendingUp },
    { id: 'sla-risk', label: 'SLA Risk', icon: AlertTriangle },
  ]

  const zones = ['Zone A', 'Zone B', 'Zone C', 'Zone D', 'Crossdock', 'All']
  const shifts = ['AM', 'PM', 'Night', 'All']
  const severities = ['low', 'medium', 'high', 'critical']

  const handleSave = () => {
    onSave({
      ...formData,
      id: subscription?.id || `ALERT-SUB-${Date.now()}`,
      lastTriggered: subscription?.lastTriggered || null
    })
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-slate-800">
              {subscription ? 'Edit Subscription' : 'New Subscription'}
            </h2>
            <button
              onClick={onCancel}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
            >
              <X size={20} />
            </button>
          </div>

          {/* Alert Type */}
          <div className="mb-4">
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
              Alert Type
            </label>
            <div className="grid grid-cols-2 gap-2">
              {alertTypes.map(type => (
                <button
                  key={type.id}
                  onClick={() => setFormData({ ...formData, type: type.id })}
                  className={`flex items-center gap-2 p-3 rounded-lg border-2 text-sm font-medium transition-all ${
                    formData.type === type.id
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <type.icon size={16} />
                  {type.label}
                </button>
              ))}
            </div>
          </div>

          {/* Filters */}
          <div className="mb-4">
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
              Filters
            </label>

            {/* Zones */}
            <div className="mb-3">
              <span className="text-xs text-slate-600 block mb-1">Zones</span>
              <div className="flex flex-wrap gap-1">
                {zones.map(zone => (
                  <button
                    key={zone}
                    onClick={() => {
                      const newZones = formData.filters.zones.includes(zone)
                        ? formData.filters.zones.filter(z => z !== zone)
                        : [...formData.filters.zones, zone]
                      setFormData({
                        ...formData,
                        filters: { ...formData.filters, zones: newZones }
                      })
                    }}
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      formData.filters.zones.includes(zone)
                        ? 'bg-blue-500 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {zone}
                  </button>
                ))}
              </div>
            </div>

            {/* Shifts */}
            <div className="mb-3">
              <span className="text-xs text-slate-600 block mb-1">Shifts</span>
              <div className="flex flex-wrap gap-1">
                {shifts.map(shift => (
                  <button
                    key={shift}
                    onClick={() => {
                      const newShifts = formData.filters.shifts.includes(shift)
                        ? formData.filters.shifts.filter(s => s !== shift)
                        : [...formData.filters.shifts, shift]
                      setFormData({
                        ...formData,
                        filters: { ...formData.filters, shifts: newShifts }
                      })
                    }}
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      formData.filters.shifts.includes(shift)
                        ? 'bg-blue-500 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {shift}
                  </button>
                ))}
              </div>
            </div>

            {/* Severity */}
            <div>
              <span className="text-xs text-slate-600 block mb-1">Severity Threshold</span>
              <div className="flex flex-wrap gap-1">
                {severities.map(severity => (
                  <button
                    key={severity}
                    onClick={() => setFormData({
                      ...formData,
                      filters: { ...formData.filters, severityThreshold: severity }
                    })}
                    className={`px-2 py-1 rounded text-xs font-medium capitalize ${
                      formData.filters.severityThreshold === severity
                        ? 'bg-blue-500 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {severity}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Notification Methods */}
          <div className="mb-6">
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
              Notification Methods
            </label>
            <div className="flex flex-wrap gap-2">
              {[
                { id: 'email', label: 'Email', icon: Mail },
                { id: 'sms', label: 'SMS', icon: MessageSquare },
                { id: 'slack', label: 'Slack', icon: MessageSquare },
              ].map(method => (
                <button
                  key={method.id}
                  onClick={() => {
                    const newMethods = formData.notificationMethods.includes(method.id)
                      ? formData.notificationMethods.filter(m => m !== method.id)
                      : [...formData.notificationMethods, method.id]
                    setFormData({ ...formData, notificationMethods: newMethods })
                  }}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg border-2 text-sm font-medium transition-all ${
                    formData.notificationMethods.includes(method.id)
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <method.icon size={14} />
                  {method.label}
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleSave}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium bg-blue-500 text-white hover:bg-blue-600 transition-colors"
            >
              <Check size={16} />
              {subscription ? 'Save Changes' : 'Create Subscription'}
            </button>
            <button
              onClick={onCancel}
              className="flex-1 px-4 py-2.5 rounded-lg text-sm font-medium bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Main Alert Subscriptions Component ────────────────────────────────────────────
export default function AlertSubscriptions({ subscriptions, onUpdate, onToggle, onAdd, onEdit, onDelete }) {
  const [showDialog, setShowDialog] = useState(false)
  const [editingSubscription, setEditingSubscription] = useState(null)

  const activeCount = subscriptions.filter(s => s.enabled).length

  const handleToggle = (id) => {
    onToggle(id)
  }

  const handleEdit = (subscription) => {
    setEditingSubscription(subscription)
    setShowDialog(true)
  }

  const handleDelete = (id) => {
    onDelete(id)
  }

  const handleSave = (subscription) => {
    if (editingSubscription) {
      onEdit(subscription)
    } else {
      onAdd(subscription)
    }
    setShowDialog(false)
    setEditingSubscription(null)
  }

  const handleNewSubscription = () => {
    setEditingSubscription(null)
    setShowDialog(true)
  }

  return (
    <div className="flex flex-col bg-white rounded-xl border border-slate-200">
      {/* Header */}
      <div className="px-4 py-3 border-b border-slate-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell size={16} className="text-blue-600" />
            <h2 className="text-sm font-bold text-slate-800">Alert Subscriptions</h2>
            <span className="text-xs text-slate-500">({activeCount} active)</span>
          </div>
          <button
            onClick={handleNewSubscription}
            className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-xs font-medium bg-blue-500 text-white hover:bg-blue-600 transition-colors"
          >
            <Plus size={12} />
            New
          </button>
        </div>
      </div>

      {/* Subscription list */}
      <div className="p-3 max-h-80 overflow-y-auto">
        {subscriptions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-slate-400">
            <BellOff size={32} className="mb-2 opacity-50" />
            <p className="text-sm">No subscriptions configured</p>
          </div>
        ) : (
          subscriptions.map(subscription => (
            <SubscriptionCard
              key={subscription.id}
              subscription={subscription}
              onToggle={handleToggle}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))
        )}
      </div>

      {/* Add/Edit Dialog */}
      {showDialog && (
        <SubscriptionDialog
          subscription={editingSubscription}
          onSave={handleSave}
          onCancel={() => {
            setShowDialog(false)
            setEditingSubscription(null)
          }}
        />
      )}
    </div>
  )
}
