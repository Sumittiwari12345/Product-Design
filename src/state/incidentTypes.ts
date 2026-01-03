export type Phase = 'ALERT' | 'RESPONSE' | 'EVIDENCE'

export type EvidenceEntry = {
  timestamp: string
  message: string
  tag?: 'AI' | 'OPERATOR' | 'SYSTEM'
  droneId?: string
  confidence?: number
}

export type EvidenceSeed = {
  message: string
  tag?: EvidenceEntry['tag']
  droneId?: string
  confidence?: number
}

export type SuggestedAction = {
  id: string
  title: string
  rationale: string
  impact: string
}

export type MovementPrediction = {
  id: string
  label: string
  summary: string
  etaSeconds: number
  path: string
  confidence: number
  droneId: string
  start: {
    x: number
    y: number
  }
  end: {
    x: number
    y: number
  }
}

export type IncidentState = {
  phase: Phase
  threatScore: number
  intrudersDetected: number
  dronesActive: number
  aiSummary: string
  evidenceLog: EvidenceEntry[]
  autonomyHold: boolean
  elapsedSeconds: number
  incidentStart: number
  phaseStartedAt: number
  suggestedActions: SuggestedAction[]
  approvedActions: Record<string, boolean>
  movementPrediction: MovementPrediction
  predictionIndex: number
  evidencePulseIndex: number
  falseAlarm: boolean
  evidenceExported: boolean
}
