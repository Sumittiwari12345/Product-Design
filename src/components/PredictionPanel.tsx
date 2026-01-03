import type { MovementPrediction } from '../state/incidentTypes'

type PredictionPanelProps = {
  prediction: MovementPrediction
}

const PredictionPanel = ({ prediction }: PredictionPanelProps) => {
  return (
    <div className="panel prediction-panel">
      <div className="prediction-header">
        <h2>AI movement prediction</h2>
        <span className="confidence">
          {Math.round(prediction.confidence * 100)}% confidence
        </span>
      </div>
      <p>{prediction.summary}</p>
      <div className="prediction-map">
        <svg viewBox="0 0 200 140" role="img" aria-label="Predicted route">
          <path
            d={prediction.path}
            fill="none"
            stroke="var(--accent)"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <circle
            cx={prediction.start.x}
            cy={prediction.start.y}
            r="5"
            fill="var(--accent)"
          />
          <circle
            cx={prediction.end.x}
            cy={prediction.end.y}
            r="5"
            fill="#fef08a"
          />
        </svg>
        <span className="eta">ETA {prediction.etaSeconds}s</span>
        <span className="route-label">{prediction.label}</span>
      </div>
    </div>
  )
}

export default PredictionPanel
