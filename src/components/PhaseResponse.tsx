import ActionCard from './ActionCard'
import DroneFeed from './DroneFeed'
import PredictionPanel from './PredictionPanel'
import { useIncident } from '../state/incidentStore'

const PhaseResponse = () => {
  const { state, actions } = useIncident()
  const pendingCount = state.suggestedActions.filter(
    (action) => !state.approvedActions[action.id],
  ).length
  const hasActions = state.suggestedActions.length > 0
  const allApproved = hasActions && pendingCount === 0

  const statusLabel = state.autonomyHold
    ? 'Autonomy hold active'
    : allApproved
      ? 'Autonomy aligned'
      : `${pendingCount} approvals pending`

  const briefStatus = state.autonomyHold ? 'Brief on hold' : 'Brief sent live'
  const briefLines = [
    `Location focus: ${state.movementPrediction.label}`,
    `Intruders: ${state.intrudersDetected} near high-value bay`,
    `Likely exit in ${state.movementPrediction.etaSeconds}s`,
    `Route: ${state.movementPrediction.summary}`,
  ]

  const droneFeeds = [
    {
      droneId: 'A1',
      title: 'Showroom sweep',
      status: 'Auto-track on intruders',
      active: state.dronesActive >= 1,
    },
    {
      droneId: 'B2',
      title: 'Service corridor',
      status: 'Thermal sweep',
      active: state.dronesActive >= 2,
    },
    {
      droneId: 'P2',
      title: 'Perimeter lock',
      status: 'Exit containment',
      active: state.dronesActive >= 3,
    },
  ]

  // Keep approvals together so the operator stays in control of execution.
  return (
    <section className="phase phase-response">
      <div className="response-left">
        <div className="panel response-summary">
          <div className="summary-header">
            <div>
              <h2>Response coordination</h2>
              <p>
                AI is orchestrating drones, security, and police intel to
                protect the high-value inventory. Approve the next steps
                instead of piloting.
              </p>
            </div>
            <span
              className={`status-pill ${
                state.autonomyHold ? 'hold' : allApproved ? 'ready' : 'pending'
              }`}
            >
              {statusLabel}
            </span>
          </div>
          <div className="status-grid">
            <div className="status-card">
              <span>Intruders tracked</span>
              <strong>{state.intrudersDetected}</strong>
            </div>
            <div className="status-card">
              <span>Drones active</span>
              <strong>{state.dronesActive}</strong>
            </div>
            <div className="status-card">
              <span>Threat confidence</span>
              <strong>{state.threatScore}%</strong>
            </div>
          </div>
          <div className="summary-footer">
            <button className="btn ghost" onClick={actions.moveToEvidence}>
              Review Evidence
            </button>
            <span className="hint">
              {state.autonomyHold
                ? 'Autonomy paused. Resume to execute approvals.'
                : 'Evidence capture is running in parallel.'}
            </span>
          </div>
        </div>

        <div className="panel action-panel">
          <div className="panel-header">
            <h2>AI suggested actions</h2>
            <span className="subtle">Approve to execute</span>
          </div>
          <div className="action-list">
            {hasActions ? (
              state.suggestedActions.map((action) => (
                <ActionCard
                  key={action.id}
                  action={action}
                  approved={!!state.approvedActions[action.id]}
                  disabled={state.autonomyHold}
                  onApprove={() => actions.approveAction(action.id)}
                />
              ))
            ) : (
              <p className="muted">AI compiling the next best actions.</p>
            )}
          </div>
        </div>
      </div>

      <div className="response-right">
        <div className="drone-wall">
          {droneFeeds.map((feed) => (
            <DroneFeed key={feed.droneId} {...feed} />
          ))}
        </div>
        <PredictionPanel prediction={state.movementPrediction} />
        <div className="panel team-brief">
          <div className="panel-header">
            <h3>Security brief</h3>
            <span className={`brief-status ${state.autonomyHold ? 'hold' : ''}`}>
              {briefStatus}
            </span>
          </div>
          <ul className="brief-list">
            {briefLines.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
          <div className="brief-footer">
            <span className="chip">Auto-updating</span>
            <span className="chip">Audio route ready</span>
          </div>
        </div>
      </div>
    </section>
  )
}

export default PhaseResponse
