import {
  createContext,
  type Dispatch,
  type ReactNode,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from 'react'
import {
  addOperatorNote,
  applyTick,
  confirmIntrusion,
  createInitialState,
  exportEvidence,
  markFalseAlarm,
  moveToEvidence,
  approveAction,
  toggleAutonomyHold,
} from './incidentEngine'
import type { IncidentState } from './incidentTypes'

type IncidentAction =
  | { type: 'TICK' }
  | { type: 'CONFIRM_INTRUSION' }
  | { type: 'MARK_FALSE_ALARM' }
  | { type: 'APPROVE_ACTION'; actionId: string }
  | { type: 'MOVE_TO_EVIDENCE' }
  | { type: 'ADD_OPERATOR_NOTE'; message: string }
  | { type: 'EXPORT_EVIDENCE' }
  | { type: 'TOGGLE_AUTONOMY_HOLD' }

type IncidentContextValue = {
  state: IncidentState
  dispatch: Dispatch<IncidentAction>
}

const IncidentContext = createContext<IncidentContextValue | undefined>(undefined)

function incidentReducer(state: IncidentState, action: IncidentAction): IncidentState {
  switch (action.type) {
    case 'TICK':
      return applyTick(state)
    case 'CONFIRM_INTRUSION':
      return confirmIntrusion(state)
    case 'MARK_FALSE_ALARM':
      return markFalseAlarm(state)
    case 'APPROVE_ACTION':
      return approveAction(state, action.actionId)
    case 'MOVE_TO_EVIDENCE':
      return moveToEvidence(state)
    case 'ADD_OPERATOR_NOTE':
      return addOperatorNote(state, action.message)
    case 'EXPORT_EVIDENCE':
      return exportEvidence(state)
    case 'TOGGLE_AUTONOMY_HOLD':
      return toggleAutonomyHold(state)
    default:
      return state
  }
}

export function IncidentProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(
    incidentReducer,
    undefined,
    createInitialState,
  )

  useEffect(() => {
    // Keep the AI simulation moving even when the operator pauses.
    const timer = setInterval(() => dispatch({ type: 'TICK' }), 1000)
    return () => clearInterval(timer)
  }, [])

  return (
    <IncidentContext.Provider value={{ state, dispatch }}>
      {children}
    </IncidentContext.Provider>
  )
}

export function useIncident() {
  const context = useContext(IncidentContext)
  if (!context) {
    throw new Error('useIncident must be used within IncidentProvider')
  }

  const { state, dispatch } = context

  const actions = useMemo(
    () => ({
      confirmIntrusion: () => dispatch({ type: 'CONFIRM_INTRUSION' }),
      markFalseAlarm: () => dispatch({ type: 'MARK_FALSE_ALARM' }),
      approveAction: (actionId: string) =>
        dispatch({ type: 'APPROVE_ACTION', actionId }),
      moveToEvidence: () => dispatch({ type: 'MOVE_TO_EVIDENCE' }),
      addOperatorNote: (message: string) =>
        dispatch({ type: 'ADD_OPERATOR_NOTE', message }),
      exportEvidence: () => dispatch({ type: 'EXPORT_EVIDENCE' }),
      toggleAutonomyHold: () => dispatch({ type: 'TOGGLE_AUTONOMY_HOLD' }),
    }),
    [dispatch],
  )

  return { state, actions }
}
