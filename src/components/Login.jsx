import spinnakerLogo from '/Spinnaker_SCA_Logo.png'
import { Warehouse, BarChart3 } from 'lucide-react'

const PERSONAS = [
  {
    id: 'inbound-manager',
    name: 'Jordan Chen',
    role: 'Inbound Manager',
    initials: 'JC',
    defaultScreen: 'mfa',
    avatarColor: 'bg-blue-600',
    description: 'Yard operations, labor allocation, container tracking',
    icon: Warehouse,
  },
  {
    id: 'dc-manager',
    name: 'Jamie Thompson',
    role: 'General Manager',
    initials: 'JT',
    defaultScreen: 'mfa',
    avatarColor: 'bg-violet-600',
    description: 'Executive oversight, OTIF risk, cost & service KPIs',
    icon: BarChart3,
  },
]

export default function Login({ onSelect }) {
  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-8">
      {/* Logo */}
      <div className="flex items-center gap-4 mb-2">
        <img src={spinnakerLogo} alt="Spinnaker SCA" className="h-12 w-auto" />
        <div>
          <div className="text-white text-2xl font-bold tracking-tight">SpinnakerSCA</div>
          <div className="text-slate-400 text-sm font-normal">Warehouse IQ</div>
        </div>
      </div>

      <p className="text-slate-500 text-sm mb-10">Select your role to begin the demo</p>

      {/* Persona cards */}
      <div className="flex gap-6">
        {PERSONAS.map(persona => {
          const Icon = persona.icon
          return (
            <button
              key={persona.id}
              onClick={() => onSelect(persona)}
              className="w-64 bg-slate-800 border border-slate-700 rounded-2xl p-6 text-left hover:border-blue-500 hover:bg-slate-750 transition-all group focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-12 h-12 rounded-full ${persona.avatarColor} flex items-center justify-center text-white text-lg font-bold`}>
                  {persona.initials}
                </div>
                <div>
                  <div className="text-white font-semibold text-base leading-tight">{persona.name}</div>
                  <div className="text-slate-400 text-xs">{persona.role}</div>
                </div>
              </div>

              <div className="flex items-start gap-2 mb-4">
                <Icon size={15} className="text-slate-500 mt-0.5 flex-shrink-0" />
                <p className="text-slate-400 text-xs leading-relaxed">{persona.description}</p>
              </div>

              <div className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-blue-400 group-hover:text-blue-300 transition-colors">
                Enter as {persona.name.split(' ')[0]} →
              </div>
            </button>
          )
        })}
      </div>

      <p className="text-slate-600 text-xs mt-10">Demo mode — no authentication required</p>
    </div>
  )
}
