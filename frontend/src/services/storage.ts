import type { Expense } from '../types/expense'

const INCOME_KEY = 'income'
const SAVINGS_KEY = 'savings'
const EXPENSES_KEY = 'expenses'

export function loadIncome(): string {
  if (typeof window === 'undefined') return ''
  return window.localStorage.getItem(INCOME_KEY) || ''
}

export function saveIncome(value: string): void {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(INCOME_KEY, value)
}

export function loadSavings(): string {
  if (typeof window === 'undefined') return ''
  return window.localStorage.getItem(SAVINGS_KEY) || ''
}

export function saveSavings(value: string): void {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(SAVINGS_KEY, value)
}

export function loadExpenses(): Expense[] {
  if (typeof window === 'undefined') return []
  const saved = window.localStorage.getItem(EXPENSES_KEY)
  return saved ? JSON.parse(saved) : []
}

export function saveExpenses(expenses: Expense[]): void {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(EXPENSES_KEY, JSON.stringify(expenses))
}

