import { createScenarioStart, formatTimestamp } from '../utils/time'
import { EVIDENCE_PULSES, MOVEMENT_PREDICTIONS, RESPONSE_ACTIONS } from './incidentData'
import type { EvidenceSeed, IncidentState } from './incidentTypes'

// Keep the operator decision fast by reaching high confidence in the first 10 seconds.
const ALERT_CONFIDENCE_TARGET = 92

function addEvidence(state: IncidentState, seed: EvidenceSeed): IncidentState {
  const entry = {
    ...seed,
    timestamp: formatTimestamp(state.incidentStart, state.elapsedSeconds),
  }
  return {
    ...state,
    evidenceLog: [...state.evidenceLog, entry],
  }
}

function applyEvidencePulse(state: IncidentState, updateSummary: boolean): IncidentState {
  if (state.falseAlarm) {
    return state
  }

  const phaseAge = state.elapsedSeconds - state.phaseStartedAt
  if (phaseAge <= 0 || phaseAge % 12 !== 0) {
    return state
  }

  const nextIndex = (state.evidencePulseIndex + 1) % EVIDENCE_PULSES.length
  const pulse = EVIDENCE_PULSES[nextIndex]
  const next: IncidentState = {
    ...state,
    evidencePulseIndex: nextIndex,
    aiSummary: updateSummary
      ? 'Evidence capture active. AI tagging legally relevant frames.'
      : state.aiSummary,
  }

  return addEvidence(next, pulse)
}

export function createInitialState(): IncidentState {
  const incidentStart = createScenarioStart()
  return {
    phase: 'ALERT',
    threatScore: 24,
    intrudersDetected: 0,
    dronesActive: 0,
    aiSummary:
      'Motion detected in showroom. AI validating unauthorized movement.',
    evidenceLog: [
      {
        timestamp: formatTimestamp(incidentStart, 0),
        message: 'Motion + CCTV trigger received. AI validating intrusion.',
        tag: 'SYSTEM',
      },
    ],
    autonomyHold: false,
    elapsedSeconds: 0,
    incidentStart,
    phaseStartedAt: 0,
    suggestedActions: [],
    approvedActions: {},
    movementPrediction: MOVEMENT_PREDICTIONS[0],
    predictionIndex: 0,
    evidencePulseIndex: 0,
    falseAlarm: false,
    evidenceExported: false,
  }
}

export function applyTick(state: IncidentState): IncidentState {
  const next = {
    ...state,
    elapsedSeconds: state.elapsedSeconds + 1,
  }

  if (next.phase === 'ALERT') {
    return updateAlert(next)
  }

  if (next.phase === 'RESPONSE') {
    return updateResponse(next)
  }

  return updateEvidence(next)
}

function updateAlert(state: IncidentState): IncidentState {
  const phaseAge = state.elapsedSeconds - state.phaseStartedAt
  let next = { ...state }

  if (next.threatScore < ALERT_CONFIDENCE_TARGET) {
    const ramp = phaseAge < 6 ? 6 : 4
    next.threatScore = Math.min(ALERT_CONFIDENCE_TARGET, next.threatScore + ramp)
  }

  if (phaseAge === 2) {
    next = addEvidence(
      {
        ...next,
        aiSummary:
          'CCTV stabilized. Two silhouettes near high-value section detected.',
      },
      {
        message:
          'AI validated two individuals moving toward high-value inventory.',
        tag: 'AI',
      },
    )
  }

  if (phaseAge === 5) {
    next = addEvidence(
      {
        ...next,
        intrudersDetected: 2,
        dronesActive: 1,
        threatScore: Math.max(next.threatScore, 65),
        aiSummary:
          'Unauthorized movement confirmed. Drone A1 launched from rooftop dock.',
      },
      {
        message:
          'Rooftop dock opened. Drone A1 auto-launched; 2 intruders confirmed.',
        tag: 'AI',
        droneId: 'A1',
        confidence: 0.62,
      },
    )
  }

  if (phaseAge === 9) {
    next = addEvidence(
      {
        ...next,
        threatScore: Math.max(next.threatScore, ALERT_CONFIDENCE_TARGET),
        aiSummary:
          'High confidence intrusion (92%). Recommend escalation or override.',
      },
      {
        message:
          'AI confidence reached 92%. Operator confirmation required to proceed.',
        tag: 'AI',
        confidence: 0.92,
      },
    )
  }

  if (phaseAge === 15) {
    next = {
      ...next,
      aiSummary: 'Awaiting operator decision to escalate or dismiss threat.',
    }
  }

  return next
}

function updateResponse(state: IncidentState): IncidentState {
  const phaseAge = state.elapsedSeconds - state.phaseStartedAt
  let next = { ...state }

  if (phaseAge > 0 && phaseAge % 8 === 0) {
    const nextIndex = (state.predictionIndex + 1) % MOVEMENT_PREDICTIONS.length
    const prediction = MOVEMENT_PREDICTIONS[nextIndex]
    next = addEvidence(
      {
        ...next,
        predictionIndex: nextIndex,
        movementPrediction: prediction,
        aiSummary: `Prediction: ${prediction.summary}`,
      },
      {
        message: `AI prediction update: ${prediction.label}.`,
        tag: 'AI',
        droneId: prediction.droneId,
        confidence: prediction.confidence,
      },
    )
  }

  return applyEvidencePulse(next, false)
}

function updateEvidence(state: IncidentState): IncidentState {
  return applyEvidencePulse(state, true)
}

export function confirmIntrusion(state: IncidentState): IncidentState {
  if (state.phase !== 'ALERT') {
    return state
  }

  const next: IncidentState = {
    ...state,
    phase: 'RESPONSE',
    phaseStartedAt: state.elapsedSeconds,
    threatScore: Math.max(state.threatScore, 93),
    intrudersDetected: Math.max(state.intrudersDetected, 2),
    dronesActive: Math.max(state.dronesActive, 1),
    aiSummary: 'Intrusion confirmed. Suggested actions ready for approval.',
    suggestedActions: RESPONSE_ACTIONS,
    approvedActions: {},
    movementPrediction: MOVEMENT_PREDICTIONS[0],
    predictionIndex: 0,
    falseAlarm: false,
  }

  return addEvidence(
    addEvidence(
      addEvidence(next, {
        message: 'Operator confirmed intrusion. Escalating response.',
        tag: 'OPERATOR',
      }),
      {
        message: 'Evidence capture started automatically.',
        tag: 'SYSTEM',
      },
    ),
    {
      message: 'Chain of custody initiated with GPS and flight path logging.',
      tag: 'SYSTEM',
    },
  )
}

export function markFalseAlarm(state: IncidentState): IncidentState {
  if (state.phase !== 'ALERT') {
    return state
  }

  const next: IncidentState = {
    ...state,
    phase: 'EVIDENCE',
    phaseStartedAt: state.elapsedSeconds,
    threatScore: 3,
    intrudersDetected: 0,
    dronesActive: 0,
    aiSummary: 'False alarm logged. Drones returning to base.',
    suggestedActions: [],
    approvedActions: {},
    falseAlarm: true,
  }

  return addEvidence(next, {
    message: 'Operator marked false alarm. Autonomous response halted.',
    tag: 'OPERATOR',
  })
}

export function approveAction(state: IncidentState, actionId: string): IncidentState {
  if (
    state.phase !== 'RESPONSE' ||
    state.autonomyHold ||
    state.approvedActions[actionId]
  ) {
    return state
  }

  const action = state.suggestedActions.find((item) => item.id === actionId)
  if (!action) {
    return state
  }

  let next: IncidentState = {
    ...state,
    approvedActions: {
      ...state.approvedActions,
      [actionId]: true,
    },
    aiSummary: `Action approved: ${action.title}.`,
  }

  next = addEvidence(next, {
    message: `Operator approved: ${action.title}.`,
    tag: 'OPERATOR',
  })

  if (actionId === 'perimeter-drone') {
    next = addEvidence(
      {
        ...next,
        dronesActive: state.dronesActive + 1,
      },
      {
        message: 'Perimeter drone P2 launched from dock. Exits under scan.',
        tag: 'AI',
        droneId: 'P2',
        confidence: 0.8,
      },
    )
  }

  if (actionId === 'notify-security') {
    next = addEvidence(next, {
      message: 'Security team notified with live intel. ETA 90 seconds.',
      tag: 'SYSTEM',
    })
  }

  if (actionId === 'police-feed') {
    next = addEvidence(next, {
      message: 'Police live feed prepared with GPS coordinates.',
      tag: 'SYSTEM',
    })
  }

  const allApproved =
    next.suggestedActions.length > 0 &&
    next.suggestedActions.every((item) => next.approvedActions[item.id])

  if (allApproved) {
    next = {
      ...next,
      aiSummary: 'Containment actions approved. Evidence review recommended.',
    }
  }

  return next
}

export function toggleAutonomyHold(state: IncidentState): IncidentState {
  const nextHold = !state.autonomyHold
  const summary = nextHold
    ? 'Autonomy paused by operator. AI standing by.'
    : 'Autonomy resumed. AI suggestions live.'

  const next: IncidentState = {
    ...state,
    autonomyHold: nextHold,
    aiSummary: summary,
  }

  return addEvidence(next, {
    message: nextHold
      ? 'Operator engaged autonomy hold. AI actions paused.'
      : 'Operator resumed autonomy. AI actions re-enabled.',
    tag: 'OPERATOR',
  })
}

export function moveToEvidence(state: IncidentState): IncidentState {
  if (state.phase !== 'RESPONSE') {
    return state
  }

  const next: IncidentState = {
    ...state,
    phase: 'EVIDENCE',
    phaseStartedAt: state.elapsedSeconds,
    aiSummary: 'Evidence capture active. Reviewing timeline.',
  }

  return addEvidence(next, {
    message: 'Operator shifted focus to evidence timeline.',
    tag: 'OPERATOR',
  })
}

export function addOperatorNote(state: IncidentState, message: string): IncidentState {
  return addEvidence(state, {
    message,
    tag: 'OPERATOR',
  })
}

export function exportEvidence(state: IncidentState): IncidentState {
  if (state.evidenceExported) {
    return state
  }

  const next = {
    ...state,
    evidenceExported: true,
    aiSummary: 'Evidence package compiled and ready to export.',
  }

  return addEvidence(next, {
    message: 'Operator requested export of evidence package.',
    tag: 'OPERATOR',
  })
}
