import type { PayCycle } from '../utils/payCycle'

type PayCycleBannerProps = {
  cycle: PayCycle
}

export function PayCycleBanner({ cycle }: PayCycleBannerProps) {
  return (
    <section className="card">
      <h2>Current Pay Cycle</h2>
      <p>Start: {cycle.start.toDateString()}</p>
      <p>End: {cycle.end.toDateString()}</p>
    </section>
  )
}

