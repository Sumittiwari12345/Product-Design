import { useState } from 'react'
import { useIncident } from '../state/incidentStore'

const PhaseEvidence = () => {
  const { state, actions } = useIncident()
  const [note, setNote] = useState('')
  const lastEntry = state.evidenceLog[state.evidenceLog.length - 1]
  const sealId = `LM-${String(state.incidentStart).slice(-4)}-${String(
    state.evidenceLog.length,
  ).padStart(3, '0')}`

  const handleAddNote = () => {
    const trimmed = note.trim()
    if (!trimmed) {
      return
    }
    actions.addOperatorNote(trimmed)
    setNote('')
  }

  const evidenceStatus = state.falseAlarm
    ? 'False alarm logged'
    : 'Evidence capture active'

  const headerMessage = state.falseAlarm
    ? 'The intrusion was dismissed. Evidence is archived for audit.'
    : 'AI is tagging legally relevant moments while you review the chain.'

  const evidenceCount = state.evidenceLog.length

  return (
    <section className="phase phase-evidence">
      <div className="panel evidence-header">
        <div>
          <h2>Evidence capture</h2>
          <p>{headerMessage}</p>
        </div>
        <div className="evidence-actions">
          <button
            className="btn primary"
            onClick={actions.exportEvidence}
            disabled={state.evidenceExported}
          >
            {state.evidenceExported
              ? 'Evidence Package Ready'
              : 'Export Evidence Package'}
          </button>
          <span className="chip">{evidenceStatus}</span>
        </div>
      </div>

      <div className="evidence-grid">
        <div className="panel timeline-panel">
          <div className="panel-header">
            <h3>Evidence timeline</h3>
            <span className="subtle">{evidenceCount} events</span>
          </div>
          <ol className="timeline">
            {state.evidenceLog.map((entry, index) => {
              const confidencePercent =
                typeof entry.confidence === 'number'
                  ? Math.round(entry.confidence * 100)
                  : null
              const confidenceLevel =
                confidencePercent === null
                  ? ''
                  : confidencePercent >= 85
                    ? 'high'
                    : confidencePercent >= 70
                      ? 'medium'
                      : 'low'

              return (
                <li key={`${entry.timestamp}-${index}`} className="timeline-item">
                  <span className="timeline-dot" />
                  <div className="timeline-content">
                    <div className="timeline-meta">
                      <span className="timestamp">{entry.timestamp}</span>
                      {entry.tag && (
                        <span className={`tag tag-${entry.tag.toLowerCase()}`}>
                          {entry.tag}
                        </span>
                      )}
                      {entry.droneId && (
                        <span className="tag tag-drone">
                          Drone {entry.droneId}
                        </span>
                      )}
                      {confidencePercent !== null && (
                        <span className={`confidence-pill ${confidenceLevel}`}>
                          {confidencePercent}% confidence
                        </span>
                      )}
                    </div>
                    <p>{entry.message}</p>
                  </div>
                </li>
              )
            })}
          </ol>
        </div>

        <div className="panel notes-panel">
          <h3>Operator annotations</h3>
          <p>
            Notes stay attached to the evidence chain for legal review. Keep
            them short and factual.
          </p>
          <div className="note-form">
            <textarea
              value={note}
              onChange={(event) => setNote(event.target.value)}
              placeholder="Add a note for investigators..."
              rows={4}
            />
            <button
              className="btn ghost"
              onClick={handleAddNote}
              disabled={!note.trim()}
            >
              Add Note
            </button>
          </div>
          <div className="note-guidance">
            <span className="chip">Auto-tagging active</span>
            <span className="chip">GPS + flight path logging</span>
            <span className="chip">Chain of custody intact</span>
          </div>
          <div className="evidence-seal">
            <span className="seal-label">Chain of custody seal</span>
            <span className="seal-code">{sealId}</span>
            <span className="seal-meta">
              Last capture {lastEntry?.timestamp ?? '--:--:--'}
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}

export default PhaseEvidence
