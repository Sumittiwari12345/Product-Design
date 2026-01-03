import { useIncident } from '../state/incidentStore'

const PhaseAlert = () => {
  const { state, actions } = useIncident()

  // Keep the assessment view sparse so the operator can decide in seconds.
  return (
    <section className="phase phase-alert">
      <div className="panel alert-panel">
        <h2>Assessment window</h2>
        <p>
          Motion and CCTV confirm two individuals moving toward the high-value
          section. Drone A1 launched from the rooftop dock and awaits your
          escalation.
        </p>
        <div className="chip-row">
          <span className="chip">CCTV verified</span>
          <span className="chip">2 intruders</span>
          <span className="chip">Threat {state.threatScore}%</span>
          <span className="chip">Dock active</span>
        </div>
      </div>
      <div className="panel alert-actions">
        <button className="btn primary" onClick={actions.confirmIntrusion}>
          Confirm Intrusion
        </button>
        <button className="btn ghost" onClick={actions.markFalseAlarm}>
          Mark False Alarm
        </button>
        <span className={`hint ${state.autonomyHold ? 'warning' : ''}`}>
          {state.autonomyHold
            ? 'Autonomy hold active. Resume to allow AI execution.'
            : 'AI will not escalate without your confirmation.'}
        </span>
      </div>
    </section>
  )
}

export default PhaseAlert
