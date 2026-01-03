import './App.css'
import AiBanner from './components/AiBanner'
import PhaseAlert from './components/PhaseAlert'
import PhaseEvidence from './components/PhaseEvidence'
import PhaseResponse from './components/PhaseResponse'
import { useIncident } from './state/incidentStore'
import { formatClock } from './utils/time'

function App() {
  const { state } = useIncident()
  const clock = formatClock(state.incidentStart, state.elapsedSeconds)
  const incidentId = `LM-${String(state.incidentStart).slice(-4)}`
  const dockStatus =
    state.phase === 'ALERT'
      ? 'Arming'
      : state.phase === 'RESPONSE'
        ? 'Active'
        : 'Recovering'
  const phaseSteps = [
    { id: 'ALERT', label: 'Alert', time: '0-60s' },
    { id: 'RESPONSE', label: 'Response', time: '1-5 min' },
    { id: 'EVIDENCE', label: 'Evidence', time: 'Always' },
  ] as const
  const activeIndex = phaseSteps.findIndex((step) => step.id === state.phase)

  return (
    <div className="app" data-phase={state.phase}>
      <header className="app-header">
        <div className="header-left">
          <span className="brand">FlytBase Operator</span>
          <span className="divider">/</span>
          <span className="site">Luxora Motors</span>
        </div>
        <div className="header-center">
          <span className="clock">{clock}</span>
          <span className="location">Showroom floor</span>
        </div>
        <span className="phase-pill">{state.phase}</span>
      </header>

      <section className="incident-strip">
        <div className="strip-block">
          <span className="strip-label">Incident</span>
          <strong>{incidentId}</strong>
        </div>
        <div className="strip-block">
          <span className="strip-label">Inventory at risk</span>
          <strong>$8M</strong>
        </div>
        <div className="strip-block">
          <span className="strip-label">Dock status</span>
          <strong>{dockStatus}</strong>
        </div>
        <div className="strip-block">
          <span className="strip-label">Elapsed</span>
          <strong>T+{state.elapsedSeconds}s</strong>
        </div>
      </section>

      <AiBanner />

      <section className="phase-rail">
        {phaseSteps.map((step, index) => (
          <div
            key={step.id}
            className={`phase-step ${
              state.phase === step.id
                ? 'active'
                : index < activeIndex
                  ? 'complete'
                  : ''
            }`}
          >
            <span className="phase-dot" />
            <div>
              <span className="phase-name">{step.label}</span>
              <span className="phase-time">{step.time}</span>
            </div>
          </div>
        ))}
      </section>

      <main className="main-stage">
        {state.phase === 'ALERT' && <PhaseAlert />}
        {state.phase === 'RESPONSE' && <PhaseResponse />}
        {state.phase === 'EVIDENCE' && <PhaseEvidence />}
      </main>

      <footer className="app-footer">
        <span className="footer-text">
          AI proposes. Human approves. Every decision logged.
        </span>
      </footer>
    </div>
  )
}

export default App
