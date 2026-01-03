import type { SuggestedAction } from '../state/incidentTypes'

type ActionCardProps = {
  action: SuggestedAction
  approved: boolean
  disabled?: boolean
  onApprove: () => void
}

const ActionCard = ({
  action,
  approved,
  disabled = false,
  onApprove,
}: ActionCardProps) => {
  const isDisabled = approved || disabled

  return (
    <div
      className={`action-card ${approved ? 'approved' : ''} ${
        isDisabled ? 'disabled' : ''
      }`}
    >
      <div>
        <h3>{action.title}</h3>
        <p>{action.rationale}</p>
        <span className="impact">{action.impact}</span>
      </div>
      <button
        className={`btn ${approved ? 'ghost' : 'primary'}`}
        onClick={onApprove}
        disabled={isDisabled}
      >
        {approved ? 'Approved' : 'Approve'}
      </button>
    </div>
  )
}

export default ActionCard
