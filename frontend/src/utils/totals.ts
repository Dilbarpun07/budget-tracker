import type { Expense } from '../types/expense'
import { toNumberAmount } from './money'

export function calculateTotalSpent(expenses: Expense[]): number {
  return expenses.reduce((total, expense) => {
    return total + toNumberAmount(expense.amount)
  }, 0)
}

export function calculateCategoryTotals(expenses: Expense[]): Record<string, number> {
  return expenses.reduce((totals, expense) => {
    const category = expense.category
    const amount = toNumberAmount(expense.amount)

    if (!totals[category]) {
      totals[category] = 0
    }

    totals[category] += amount

    return totals
  }, {} as Record<string, number>)
}

