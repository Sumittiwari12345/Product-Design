export function createScenarioStart(): number {
  const now = new Date()
  const scenario = new Date(now)
  scenario.setHours(2, 34, 0, 0)
  return scenario.getTime()
}

export function formatTimestamp(startMs: number, elapsedSeconds: number): string {
  const time = new Date(startMs + elapsedSeconds * 1000)
  const hours = String(time.getHours()).padStart(2, '0')
  const minutes = String(time.getMinutes()).padStart(2, '0')
  const seconds = String(time.getSeconds()).padStart(2, '0')
  return `${hours}:${minutes}:${seconds}`
}

export function formatClock(startMs: number, elapsedSeconds: number): string {
  const time = new Date(startMs + elapsedSeconds * 1000)
  const hours = time.getHours()
  const minutes = String(time.getMinutes()).padStart(2, '0')
  const period = hours >= 12 ? 'PM' : 'AM'
  const hours12 = hours % 12 === 0 ? 12 : hours % 12
  return `${hours12}:${minutes} ${period}`
}
