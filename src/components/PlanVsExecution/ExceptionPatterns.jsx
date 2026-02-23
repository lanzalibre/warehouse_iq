import { useState } from 'react'
import { MapPin, Cog, ShoppingCart } from 'lucide-react'
import LocationsTab from './ExceptionPatterns/LocationsTab.jsx'
import EquipmentTab from './ExceptionPatterns/EquipmentTab.jsx'
import OrderTypesTab from './ExceptionPatterns/OrderTypesTab.jsx'

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

// ─── Exception Patterns Container ───────────────────────────────────────────────
export default function ExceptionPatterns() {
  const [activeTab, setActiveTab] = useState('locations')

  return (
    <div className="flex flex-col flex-1 overflow-hidden bg-white">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-200">
        <div>
          <h1 className="text-lg font-bold text-slate-800">Exception Patterns</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Areas experiencing sustained exceptions or delays
          </p>
        </div>

        {/* Tab navigation */}
        <div className="mt-4 flex gap-2">
          <TabButton
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            id="locations"
            label="Locations"
            icon={MapPin}
          />
          <TabButton
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            id="equipment"
            label="Equipment & Zones"
            icon={Cog}
          />
          <TabButton
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            id="order-types"
            label="Order Types"
            icon={ShoppingCart}
          />
        </div>
      </div>

      {/* Tab content */}
      <div className="flex-1 overflow-hidden">
        {activeTab === 'locations' && <LocationsTab />}
        {activeTab === 'equipment' && <EquipmentTab />}
        {activeTab === 'order-types' && <OrderTypesTab />}
      </div>
    </div>
  )
}
