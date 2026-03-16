import { useState } from 'react'
import Header from './components/Header.jsx'
import Navbar from './components/Navbar.jsx'
import Login from './components/Login.jsx'
import ContainerSelection from './components/ContainerSelection.jsx'
import UnloadingBay from './components/UnloadingBay.jsx'
import LaborManagement from './components/LaborManagement.jsx'
import PlanVsExecution from './components/PlanVsExecution/index.jsx'
import NLQueryScreen from './components/NLQuery.jsx'
import MFAScreen from './components/MFA.jsx'
import DataSourcesScreen from './components/DataSources.jsx'
import SimulationScreen from './components/Simulation.jsx'
import HandoverReport from './components/HandoverReport.jsx'

export default function App() {
  const [persona, setPersona] = useState(null)
  const [activeScreen, setActiveScreen] = useState('mfa')
  const [simulationTemplateId, setSimulationTemplateId] = useState(null)
  const [laborInitialTab, setLaborInitialTab] = useState(null)
  const [laborReturnScreen, setLaborReturnScreen] = useState(null)

  // Yard sub-state
  const [yardView, setYardView] = useState('selection')
  const [acceptedContainerId, setAcceptedContainerId] = useState(null)
  const [switchToContainerId, setSwitchToContainerId] = useState(null)

  function handlePersonaSelect(selectedPersona) {
    setPersona(selectedPersona)
    setActiveScreen(selectedPersona.defaultScreen)
  }

  function handleSwitchUser() {
    setPersona(null)
    setActiveScreen('mfa')
    setYardView('selection')
    setAcceptedContainerId(null)
    setSwitchToContainerId(null)
  }

  function handleAccept(containerId) {
    setAcceptedContainerId(containerId)
    setSwitchToContainerId(null)
    setYardView('unloading')
  }

  function handleBackToSelection() {
    setYardView('selection')
    setAcceptedContainerId(null)
    setSwitchToContainerId(null)
  }

  function handleSwitchContainer(newContainerId) {
    setSwitchToContainerId(newContainerId)
    setYardView('selection')
  }

  function handleNavigate(screen, opts) {
    if (screen === 'labor' && opts?.tab) {
      setLaborInitialTab(opts.tab)
      setLaborReturnScreen(activeScreen)
    } else if (screen !== 'labor') {
      setLaborInitialTab(null)
      setLaborReturnScreen(null)
    }
    setActiveScreen(screen)
    if (screen === 'simulation' && opts?.templateId) {
      setSimulationTemplateId(opts.templateId)
    } else if (screen !== 'simulation') {
      setSimulationTemplateId(null)
    }
    if (screen !== 'yard') {
      setYardView('selection')
      setAcceptedContainerId(null)
      setSwitchToContainerId(null)
    }
  }

  if (!persona) {
    return <Login onSelect={handlePersonaSelect} />
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Header
        view={yardView}
        activeScreen={activeScreen}
        onBack={handleBackToSelection}
        acceptedContainerId={acceptedContainerId}
        persona={persona}
        onSwitchUser={handleSwitchUser}
      />
      <div className="flex flex-1 overflow-hidden">
        {/* Main content */}
        <div className="flex flex-col flex-1 overflow-hidden">
          {activeScreen === 'yard' && yardView === 'selection' && (
            <ContainerSelection
              onAccept={handleAccept}
              highlightContainerId={switchToContainerId}
            />
          )}
          {activeScreen === 'yard' && yardView === 'unloading' && (
            <UnloadingBay
              containerId={acceptedContainerId}
              onBack={handleBackToSelection}
              onSwitchContainer={handleSwitchContainer}
            />
          )}
          {activeScreen === 'labor' && (
            <LaborManagement
              initialTab={laborInitialTab}
              onBack={laborReturnScreen ? () => handleNavigate(laborReturnScreen) : null}
            />
          )}
          {activeScreen === 'plan-exec' && (
            <PlanVsExecution
              persona={persona?.id}
              onNavigate={handleNavigate}
            />
          )}
          {activeScreen === 'mfa' && <MFAScreen />}
          {activeScreen === 'simulation' && (
            <SimulationScreen
              key={simulationTemplateId}
              preloadedTemplateId={simulationTemplateId}
            />
          )}
          {activeScreen === 'nl-query' && <NLQueryScreen />}
          {activeScreen === 'connections' && <DataSourcesScreen />}
          {activeScreen === 'handover' && <HandoverReport />}
        </div>

        {/* Right-side navigation */}
        <Navbar activeScreen={activeScreen} onNavigate={handleNavigate} />
      </div>
    </div>
  )
}
