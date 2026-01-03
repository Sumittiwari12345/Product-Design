import type {
  EvidenceSeed,
  MovementPrediction,
  SuggestedAction,
} from './incidentTypes'

export const RESPONSE_ACTIONS: SuggestedAction[] = [
  {
    id: 'perimeter-drone',
    title: 'Deploy perimeter drone',
    rationale: 'Scan perimeter exits to contain the high-value bay approach.',
    impact: 'Launches Drone P2 from rooftop dock for perimeter sweep.',
  },
  {
    id: 'track-intruders',
    title: 'Track intruders across showroom',
    rationale: 'Maintain continuous lock on the two intruders near high value.',
    impact: 'Keeps Drone A1 on auto-track with multi-angle capture.',
  },
  {
    id: 'notify-security',
    title: 'Notify security team',
    rationale: 'Brief ground team with live intel: count, location, exits.',
    impact: 'Security team dispatched. ETA 90 seconds with live feed.',
  },
  {
    id: 'police-feed',
    title: 'Prepare police live feed',
    rationale: 'Share verified stream with GPS coordinates for authorities.',
    impact: 'Creates a live evidence channel with location telemetry.',
  },
]

export const MOVEMENT_PREDICTIONS: MovementPrediction[] = [
  {
    id: 'service-bay',
    label: 'Service bay door',
    summary: 'Intruders moving toward the service bay exit in ~40s.',
    etaSeconds: 40,
    path: 'M20 120 L 140 30',
    confidence: 0.82,
    droneId: 'A1',
    start: { x: 20, y: 120 },
    end: { x: 140, y: 30 },
  },
  {
    id: 'rear-office',
    label: 'Rear office corridor',
    summary: 'Likely turn into rear office corridor in ~32s.',
    etaSeconds: 32,
    path: 'M160 120 L 60 60 L 140 40',
    confidence: 0.74,
    droneId: 'B2',
    start: { x: 160, y: 120 },
    end: { x: 140, y: 40 },
  },
  {
    id: 'east-exit',
    label: 'East glass exit',
    summary: 'Possible sprint to east glass exit in ~28s.',
    etaSeconds: 28,
    path: 'M30 30 L 180 90',
    confidence: 0.69,
    droneId: 'P2',
    start: { x: 30, y: 30 },
    end: { x: 180, y: 90 },
  },
]

export const EVIDENCE_PULSES: EvidenceSeed[] = [
  {
    message: 'AI tag: masked face captured at showroom entry.',
    tag: 'AI',
    droneId: 'A1',
    confidence: 0.88,
  },
  {
    message: 'AI tag: crowbar visible near display row.',
    tag: 'AI',
    droneId: 'A1',
    confidence: 0.82,
  },
  {
    message: 'AI tag: intruder crossing service bay threshold.',
    tag: 'AI',
    droneId: 'B2',
    confidence: 0.77,
  },
  {
    message: 'AI tag: vehicle keys lifted from counter.',
    tag: 'AI',
    droneId: 'P2',
    confidence: 0.71,
  },
  {
    message: 'GPS lock recorded: 18.5492, 73.9078 (Showroom Bay).',
    tag: 'SYSTEM',
    droneId: 'A1',
  },
  {
    message: 'Flight path hashed and appended to chain of custody.',
    tag: 'SYSTEM',
  },
]
