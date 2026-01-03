import { useIncident } from '../state/incidentStore'

const AiBanner = () => {
  const { state, actions } = useIncident()

  const signals =
    state.phase === 'ALERT'
      ? [
          { label: 'Threat confidence', value: `${state.threatScore}%` },
          { label: 'Drones airborne', value: `${state.dronesActive}` },
        ]
      : [
          { label: 'Threat confidence', value: `${state.threatScore}%` },
          { label: 'Intruders', value: `${state.intrudersDetected}` },
          { label: 'Drones active', value: `${state.dronesActive}` },
        ]

  const rationale =
    state.phase === 'ALERT'
      ? ['After-hours', 'No badges detected', 'High-value zone', 'Motion + CCTV']
      : state.phase === 'RESPONSE'
        ? ['Perimeter risk', 'Multi-angle capture', 'Security brief live']
        : ['Chain of custody', 'GPS locked', 'AI tagging frames']

  return (
    <section className="ai-banner">
      <div className="ai-summary">
        <span className="ai-label">AI Command</span>
        <p>{state.aiSummary}</p>
        <div className="ai-rationale">
          {rationale.map((item) => (
            <span key={item} className="ai-chip">
              {item}
            </span>
          ))}
        </div>
      </div>
      <div className="ai-signals">
        {signals.map((signal) => (
          <div key={signal.label} className="signal">
            <span>{signal.label}</span>
            <strong>{signal.value}</strong>
          </div>
        ))}
      </div>
      <div className="ai-control">
        <span
          className={`autonomy-pill ${state.autonomyHold ? 'hold' : 'live'}`}
        >
          Autonomy {state.autonomyHold ? 'Held' : 'Live'}
        </span>
        <button className="btn ghost small" onClick={actions.toggleAutonomyHold}>
          {state.autonomyHold ? 'Resume Autonomy' : 'Hold Autonomy'}
        </button>
      </div>
    </section>
  )
}

export default AiBanner
