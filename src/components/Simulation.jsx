import { useState, useRef, useEffect } from 'react'
import { Send, FlaskConical, ChevronDown, Play, BarChart3, ArrowLeft, X } from 'lucide-react'
import { SIMULATION_TEMPLATES } from '../mockData.js'
import SimulationDetail from './SimulationDetail.jsx'

// ─── Pre-built conversation for a scenario ───────────────────────────────────
function buildConversation(template) {
  if (!template) return []
  return [
    { role: 'user', text: `Run scenario: ${template.name}` },
    {
      role: 'system',
      text: `Loading template "${template.name}"... Parameters configured:\n${template.description}\n\nScenario is ready to run.`,
    },
  ]
}

// ─── Post-run mock results ────────────────────────────────────────────────────
const RUN_RESULTS = {
  otifDelta: '+0.8%',
  costDelta: '+$12K',
  slaBreaks: 1,
  laborUtilization: '81%',
}

// ─── Chat message ─────────────────────────────────────────────────────────────
function Message({ msg }) {
  const isUser = msg.role === 'user'
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-3`}>
      <div className={`max-w-[80%] rounded-xl px-4 py-2.5 text-sm whitespace-pre-line ${
        isUser
          ? 'bg-blue-600 text-white'
          : 'bg-slate-100 text-slate-800'
      }`}>
        {msg.text}
      </div>
    </div>
  )
}

export default function Simulation({ preloadedTemplateId }) {
  const [messages, setMessages] = useState(() => {
    if (preloadedTemplateId) {
      const t = SIMULATION_TEMPLATES.find(t => t.id === preloadedTemplateId)
      return buildConversation(t)
    }
    return []
  })
  const [input, setInput] = useState('')
  const [activeTemplate, setActiveTemplate] = useState(() =>
    preloadedTemplateId ? SIMULATION_TEMPLATES.find(t => t.id === preloadedTemplateId) : null
  )
  const [showTemplates, setShowTemplates] = useState(false)
  const [scenarioName, setScenarioName] = useState(
    preloadedTemplateId
      ? SIMULATION_TEMPLATES.find(t => t.id === preloadedTemplateId)?.name || 'Untitled Scenario'
      : 'Untitled Scenario'
  )
  const [hasRun, setHasRun] = useState(false)
  const [showDetail, setShowDetail] = useState(false)
  const chatEndRef = useRef(null)

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  function sendMessage(text) {
    if (!text.trim()) return
    const userMsg = { role: 'user', text: text.trim() }
    const systemReply = {
      role: 'system',
      text: `Understood. I'll incorporate "${text.trim()}" into the scenario configuration. The scenario parameters have been updated.`,
    }
    setMessages(prev => [...prev, userMsg, systemReply])
    setInput('')
  }

  function loadTemplate(template) {
    setActiveTemplate(template)
    setScenarioName(template.name)
    setMessages(buildConversation(template))
    setShowTemplates(false)
    setHasRun(false)
  }

  function runSimulation() {
    const runMsg = { role: 'system', text: '⏱ Running simulation... complete.\n\nResults are ready in the panel on the right.' }
    setMessages(prev => [...prev, runMsg])
    setHasRun(true)
  }

  if (showDetail) {
    return (
      <div className="flex flex-col flex-1 overflow-hidden bg-white">
        <SimulationDetail
          scenario={{ name: scenarioName }}
          onBack={() => setShowDetail(false)}
        />
      </div>
    )
  }

  return (
    <div className="flex flex-col flex-1 overflow-hidden bg-white">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-200 flex-shrink-0">
        <div className="flex items-center gap-2">
          <FlaskConical size={18} className="text-violet-600" />
          <h1 className="text-lg font-bold text-slate-800">Simulation</h1>
        </div>
        <p className="text-xs text-slate-500 mt-0.5">Model scenarios and predict operational outcomes before committing</p>
      </div>

      {/* Two-panel layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left — Conversation */}
        <div className="flex flex-col w-1/2 border-r border-slate-200">
          {/* Chat thread */}
          <div className="flex-1 overflow-y-auto p-4">
            {messages.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center text-center">
                <FlaskConical size={32} className="text-slate-300 mb-3" />
                <p className="text-slate-400 text-sm">Start by loading a template or describing your scenario.</p>
              </div>
            )}
            {messages.map((msg, i) => <Message key={i} msg={msg} />)}
            <div ref={chatEndRef} />
          </div>

          {/* Example prompts */}
          <div className="px-4 py-2 border-t border-slate-100 flex flex-wrap gap-1.5">
            {['Add labor until SLA breaks < 2%', 'Simulate automation failure in Zone B', 'Model peak volume +30%'].map(p => (
              <button
                key={p}
                onClick={() => sendMessage(p)}
                className="text-xs px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"
              >
                {p}
              </button>
            ))}
          </div>

          {/* Input */}
          <div className="px-4 pb-4 pt-2 flex gap-2">
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage(input)}
              placeholder="Describe your scenario or goal..."
              className="flex-1 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={() => sendMessage(input)}
              disabled={!input.trim()}
              className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-40 transition-colors"
            >
              <Send size={16} />
            </button>
          </div>
        </div>

        {/* Right — Config / Results */}
        <div className="flex flex-col w-1/2 p-5 overflow-y-auto space-y-4">
          {/* Scenario name */}
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide block mb-1">Scenario Name</label>
            <input
              value={scenarioName}
              onChange={e => setScenarioName(e.target.value)}
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Template loader */}
          <div className="relative">
            <button
              onClick={() => setShowTemplates(v => !v)}
              className="flex items-center gap-2 text-sm text-slate-600 border border-slate-200 rounded-lg px-3 py-2 hover:bg-slate-50 transition-colors w-full"
            >
              <FlaskConical size={14} className="text-violet-500" />
              Load Template
              <ChevronDown size={14} className="ml-auto" />
            </button>
            {showTemplates && (
              <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-slate-200 rounded-xl shadow-lg z-10 overflow-hidden">
                {SIMULATION_TEMPLATES.map(t => (
                  <button
                    key={t.id}
                    onClick={() => loadTemplate(t)}
                    className="w-full text-left px-4 py-3 hover:bg-slate-50 transition-colors border-b border-slate-100 last:border-0"
                  >
                    <div className="text-sm font-semibold text-slate-800">{t.name}</div>
                    <div className="text-xs text-slate-400 mt-0.5">{t.description}</div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Scenario description */}
          {activeTemplate && (
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Scenario Description</div>
              <p className="text-sm text-slate-700">{activeTemplate.description}</p>
              <div className="mt-3 space-y-1">
                {Object.entries(activeTemplate.params).map(([k, v]) => (
                  <div key={k} className="flex gap-2 text-xs">
                    <span className="text-slate-400 capitalize">{k.replace(/([A-Z])/g, ' $1')}:</span>
                    <span className="text-slate-700 font-medium">{typeof v === 'object' ? JSON.stringify(v) : String(v)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Estimated run time + Run button */}
          {!hasRun && (
            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-400 bg-slate-100 rounded-full px-3 py-1">~2 min estimated</span>
              <button
                onClick={runSimulation}
                disabled={messages.length === 0}
                className="flex items-center gap-2 px-4 py-2 bg-violet-600 text-white rounded-lg text-sm font-semibold hover:bg-violet-700 disabled:opacity-40 transition-colors ml-auto"
              >
                <Play size={14} />
                Run Simulation
              </button>
            </div>
          )}

          {/* Post-run results */}
          {hasRun && (
            <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div className="text-sm font-bold text-slate-800">Simulation Results</div>
                <button
                  onClick={() => setHasRun(false)}
                  className="text-xs text-slate-400 hover:text-slate-600"
                >
                  <X size={14} />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3">
                  <div className="text-xs text-emerald-600 font-semibold mb-0.5">OTIF Delta</div>
                  <div className="text-xl font-bold text-emerald-700">{RUN_RESULTS.otifDelta}</div>
                </div>
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                  <div className="text-xs text-amber-600 font-semibold mb-0.5">Cost Delta</div>
                  <div className="text-xl font-bold text-amber-700">{RUN_RESULTS.costDelta}</div>
                </div>
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
                  <div className="text-xs text-slate-500 font-semibold mb-0.5">SLA Breaks</div>
                  <div className="text-xl font-bold text-slate-700">{RUN_RESULTS.slaBreaks}</div>
                </div>
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
                  <div className="text-xs text-slate-500 font-semibold mb-0.5">Labor Util.</div>
                  <div className="text-xl font-bold text-slate-700">{RUN_RESULTS.laborUtilization}</div>
                </div>
              </div>

              <button
                onClick={() => setShowDetail(true)}
                className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium underline underline-offset-2"
              >
                <BarChart3 size={14} />
                View Detailed Outputs →
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
