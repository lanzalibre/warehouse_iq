import { useState } from 'react'
import Header from './components/Header.jsx'
import Navbar from './components/Navbar.jsx'
import ContainerSelection from './components/ContainerSelection.jsx'
import UnloadingBay from './components/UnloadingBay.jsx'
import LaborManagement from './components/LaborManagement.jsx'
import PlanVsExecution from './components/PlanVsExecution/index.jsx'
import NLQueryScreen from './components/NLQuery.jsx'
import MFAScreen from './components/MFA.jsx'
import DataSourcesScreen from './components/DataSources.jsx'

export default function App() {
  const [activeScreen, setActiveScreen] = useState('yard')

  // Yard sub-state
  const [yardView, setYardView] = useState('selection')
  const [acceptedContainerId, setAcceptedContainerId] = useState(null)
  const [switchToContainerId, setSwitchToContainerId] = useState(null)

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

  function handleNavigate(screen) {
    setActiveScreen(screen)
    // Reset yard to selection when leaving and returning
    if (screen !== 'yard') {
      setYardView('selection')
      setAcceptedContainerId(null)
      setSwitchToContainerId(null)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Header
        view={yardView}
        activeScreen={activeScreen}
        onBack={handleBackToSelection}
        acceptedContainerId={acceptedContainerId}
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
          {activeScreen === 'labor' && <LaborManagement />}
          {activeScreen === 'plan-exec' && <PlanVsExecution />}
          {activeScreen === 'mfa' && <MFAScreen />}
          {activeScreen === 'nl-query' && <NLQueryScreen />}
          {activeScreen === 'connections' && <DataSourcesScreen />}
        </div>

        {/* Right-side navigation */}
        <Navbar activeScreen={activeScreen} onNavigate={handleNavigate} />
      </div>
    </div>
  )
}
