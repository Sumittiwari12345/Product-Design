type DroneFeedProps = {
  droneId: string
  title: string
  status: string
  active: boolean
}

const DroneFeed = ({ droneId, title, status, active }: DroneFeedProps) => {
  return (
    <div className={`drone-feed ${active ? 'active' : 'standby'}`}>
      <div className="feed-head">
        <div className="feed-title">
          <span className="feed-id">Drone {droneId}</span>
          <span className={`feed-badge ${active ? 'live' : 'standby'}`}>
            <span className="feed-dot" />
            {active ? 'LIVE' : 'STANDBY'}
          </span>
        </div>
        <span className="feed-status">{active ? status : 'Standby'}</span>
      </div>
      <div className="feed-body">
        <div className="feed-focus" />
        <div className="feed-grid" />
        <div className="feed-scan" />
        <div className="feed-glow" />
        <span className="feed-label">{active ? 'AUTO TRACK' : 'IDLE'}</span>
      </div>
      <div className="feed-footer">
        <span>{title}</span>
        <span className="feed-channel">Optical</span>
      </div>
    </div>
  )
}

export default DroneFeed
