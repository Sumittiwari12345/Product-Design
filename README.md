# FlytBase AI Operator Simulation

An AI-native operator experience for FlytBase's Product Design Assignment. This is a working
React + TypeScript app that simulates how humans collaborate with autonomous drones in a
high-stakes intrusion event.

## Scenario
2:34 AM. Luxury car dealership. $8M in inventory. Closed since 10 PM.
Motion detected. CCTV confirms two unauthorized people moving toward the high-value section.
In the old world, this takes 12-15 minutes to verify and respond. In the new world, it takes
90 seconds to five minutes with autonomous response.

## Old vs AI-native response timeline
Traditional response (12-15 minutes):
- 2:34 AM - Motion sensors trigger
- 2:37 AM - Alert reaches monitoring center (3 min delay)
- 2:43 AM - Guard reviews CCTV and assesses threat (9 min delay)
- 2:46 AM - Decision to dispatch field security (12 min delay)
- 2:49 AM - Team arrives, visual confirmation (15 min delay)
- 2:52 AM - Police called with incomplete information (18 min delay)

AI-native response (90 seconds to 5 minutes):
- 2:34:08 AM - Motion + CCTV trigger, AI validates 2 unauthorized individuals
- 2:34:25 AM - Autonomous drone auto-launches from rooftop dock
- 2:34:48 AM - Operator receives alert with initial assessment
- 2:35:15 AM - Live drone feed confirms active intrusion
- 2:35:45 AM - Operator approves additional drones for perimeter + evidence
- 2:36:20 AM - Security team dispatched with live intel and movement patterns
- 2:37:05 AM - Police notified with real-time video + GPS coordinates
- 2:38:00 AM - Activity documented with timestamps, multiple angles, AI-tagged evidence

## Who is involved
- Operator: monitors multiple sites, must assess threats fast and avoid false alarms.
- Security teams: ground personnel who need real-time intel (where, how many, exits).
- Autonomous systems: drones launched from rooftop docks (secure charging/launch bays)
  with thermal, HD cameras, lights, speakers, and pre-programmed routes.
- After the incident: dealership owner needs a summary; police and insurance need legally
  valid evidence with a clear chain of custody.

## Design principles (implemented)
- AI-native: AI speaks first, proposes actions, and predicts movement.
- Less is more: each phase surfaces only the essential decisions.
- Trust through clarity: the UI explains what the AI sees and why it recommends actions.
- Human override always: a global autonomy hold toggle lets the operator pause/resume
  AI execution at any time for airspace safety, with the decision logged.

## Phase-wise experience flow
1. ALERT (0-60s)
   - AI validates motion + CCTV and confirms two intruders near high value.
   - Drone A1 auto-launches from the dock.
   - Operator confirms intrusion or marks false alarm.
   - Design goal: reach confidence in 10-15 seconds with minimal context.
2. RESPONSE (60s-5 min)
   - AI proposes coordinated actions (perimeter scan, tracking, security, police feed).
   - Operator approves actions; no manual piloting.
   - Multiple drone feeds and movement prediction keep situational awareness.
   - Design goal: orchestrate drones + humans like a single intelligent system.
3. EVIDENCE (throughout + after)
   - Continuous recording from multiple angles with timestamps.
   - AI auto-tagging of critical moments.
   - GPS coordinates and flight path logging.
   - Chain of custody maintenance and evidence seals.
   - Operator annotations for context.
   - Evidence package prepared for police/insurance (mock).
   - Design goal: evidence capture stays active without interrupting response.

## Phase 3: Real-Time Evidence Capture (Throughout + After)
While responding to the active incident, the system must capture legally valid evidence.
What needs to happen:
- Continuous video recording from multiple angles with timestamps.
- AI auto-tagging of critical moments for fast review.
- GPS coordinates and flight path logging attached to every capture.
- Chain of custody maintenance with traceable evidence seals.
- Operator annotations for critical moments and context.
- Evidence package prepared for police and insurance (mock export).

## Human-in-the-loop decisions
- Confirm intrusion or mark false alarm.
- Approve AI-suggested actions.
- Hold or resume autonomous execution to maintain airspace safety.
- Add operator notes to the evidence chain.
- Export evidence package for authorities.

## Trust, autonomy, and evidence handling
- AI proposes actions and predictions while the operator stays accountable.
- A global autonomy hold toggle is always visible and logs overrides.
- Evidence capture runs in parallel to decision-making to avoid distraction.
- Confidence indicators help validate AI tags without deep inspection.

## Global incident state model
The entire UI is driven by a single incident state:
```
phase: "ALERT" | "RESPONSE" | "EVIDENCE"
threatScore: number
intrudersDetected: number
dronesActive: number
aiSummary: string
evidenceLog: Array<{ timestamp, message }>
```
Additional internal fields support simulation (timers, approvals, autonomy hold).

## Simulation approach
No real AI models or drone SDKs are used. AI behavior is simulated with timers and rule
based updates in `src/state/incidentEngine.ts`.

## Project structure
- `src/state/`: central incident state, simulation engine, and mock data
- `src/components/`: phase-based UI components and reusable UI blocks
- `src/utils/`: small helpers (time formatting)

## Getting started
```
npm install
npm run dev
```
