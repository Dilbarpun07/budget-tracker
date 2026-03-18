import { parseLocalDate } from './date'

export type PayCycle = {
  start: Date
  end: Date
}

// Wednesday to Tuesday pay cycle
export function getPayCycle(dateString: string): PayCycle {
  const date = parseLocalDate(dateString)
  const day = date.getDay()
  const daysSinceWednesday = (day + 4) % 7

  const start = new Date(date)
  start.setDate(date.getDate() - daysSinceWednesday)
  start.setHours(0, 0, 0, 0)

  const end = new Date(start)
  end.setDate(start.getDate() + 6)
  end.setHours(23, 59, 59, 999)

  return { start, end }
}

