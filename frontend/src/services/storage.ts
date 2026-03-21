import type { Expense } from '../types/expense'

// Base URL comes from the .env file (VITE_ prefix makes it available to the browser).
// Falls back to localhost:3001 for safety.
const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3001'

export type Settings = {
  income: string
  savings: string
}

// --- Settings ---

export async function fetchSettings(): Promise<Settings> {
  const res = await fetch(`${API_URL}/settings`)
  if (!res.ok) throw new Error('Failed to fetch settings')
  const data = await res.json()
  // Convert numbers from DB back to strings to match existing app state shape
  return { income: String(data.income), savings: String(data.savings) }
}

export async function updateSettings(income: string, savings: string): Promise<void> {
  const res = await fetch(`${API_URL}/settings`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      income: Number(income) || 0,
      savings: Number(savings) || 0,
    }),
  })
  if (!res.ok) throw new Error('Failed to update settings')
}

// --- Expenses ---

export async function fetchExpenses(start?: string, end?: string): Promise<Expense[]> {
  const url = start && end
    ? `${API_URL}/expenses?start=${start}&end=${end}`
    : `${API_URL}/expenses`
  const res = await fetch(url)
  if (!res.ok) throw new Error('Failed to fetch expenses')
  return res.json()
}

export async function createExpense(expense: Omit<Expense, 'id'>): Promise<Expense> {
  const res = await fetch(`${API_URL}/expenses`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(expense),
  })
  if (!res.ok) throw new Error('Failed to create expense')
  return res.json()
}

export async function deleteExpense(id: number): Promise<void> {
  const res = await fetch(`${API_URL}/expenses/${id}`, { method: 'DELETE' })
  if (!res.ok) throw new Error('Failed to delete expense')
}
