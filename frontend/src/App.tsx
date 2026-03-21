import { useState, useEffect } from 'react'
import './App.css'
import type { Expense } from './types/expense'
import type { BudgetSummary } from './types/budget'
import { fetchSettings, updateSettings, fetchExpenses, createExpense, deleteExpense } from './services/storage'
import { getPayCycle } from './utils/payCycle'
import { parseLocalDate, formatDateToLocalString } from './utils/date'
import { calculateCategoryTotals, calculateTotalSpent } from './utils/totals'
import { toNumberAmount } from './utils/money'
import { PayCycleBanner } from './components/PayCycleBanner'
import { ExpenseForm } from './components/ExpenseForm'
import { ExpenseList } from './components/ExpenseList'
import { SummaryCards } from './components/SummaryCards'

function App() {
  const [income, setIncome] = useState('')
  const [savings, setSavings] = useState('')
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Load settings and all expenses from the API once on mount.
  useEffect(() => {
    async function loadData() {
      try {
        const [settings, allExpenses] = await Promise.all([
          fetchSettings(),
          fetchExpenses(),
        ])
        setIncome(settings.income)
        setSavings(settings.savings)
        setExpenses(allExpenses)
      } catch (err) {
        setError('Could not connect to the API. Is the backend running?')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  // Save income and savings to the API when the user leaves the input field (onBlur).
  // This avoids an API call on every keystroke.
  const handleSettingsBlur = async () => {
    try {
      await updateSettings(income, savings)
    } catch (err) {
      console.error('Failed to save settings:', err)
    }
  }

  const todayString = formatDateToLocalString(new Date())
  const cycle = getPayCycle(todayString)

  const currentCycleExpenses = expenses.filter((expense) => {
    const expenseDate = parseLocalDate(expense.date)
    return expenseDate >= cycle.start && expenseDate <= cycle.end
  })

  const totalSpent = calculateTotalSpent(currentCycleExpenses)
  const categoryTotals = calculateCategoryTotals(currentCycleExpenses)

  const incomeNumber = toNumberAmount(income)
  const savingsNumber = toNumberAmount(savings)
  const availableToSpend = incomeNumber - savingsNumber
  const remaining = availableToSpend - totalSpent

  const summary: BudgetSummary = {
    income: incomeNumber,
    savings: savingsNumber,
    totalSpent,
    availableToSpend,
    remaining,
  }

  // Send the new expense to the API, which returns the full record with the DB-generated id.
  const handleAddExpense = async (newExpense: Omit<Expense, 'id'>) => {
    try {
      const saved = await createExpense(newExpense)
      setExpenses(prev => [...prev, saved])
    } catch (err) {
      console.error('Failed to add expense:', err)
    }
  }

  // Delete from the API, then remove from local state.
  const handleDeleteExpense = async (id: Expense['id']) => {
    try {
      await deleteExpense(id)
      setExpenses(prev => prev.filter(e => e.id !== id))
    } catch (err) {
      console.error('Failed to delete expense:', err)
    }
  }

  if (loading) {
    return <main><p>Loading...</p></main>
  }

  if (error) {
    return <main><p style={{ color: 'red' }}>{error}</p></main>
  }

  return (
    <main>
      <h1>Budget Tracker</h1>
      <p>Track your income, savings, and expenses for each pay cycle.</p>

      <div className="dashboard-grid">
        <PayCycleBanner cycle={cycle} />

        <section className="card">
          <h2>Weekly Income</h2>
          <input
            type="number"
            placeholder="Enter weekly income"
            value={income}
            onChange={(event) => setIncome(event.target.value)}
            onBlur={handleSettingsBlur}
          />
        </section>

        <section className="card">
          <h2>Savings This Period</h2>
          <input
            type="number"
            placeholder="Enter savings amount"
            value={savings}
            onChange={(event) => setSavings(event.target.value)}
            onBlur={handleSettingsBlur}
          />
        </section>

        <ExpenseForm onAddExpense={handleAddExpense} />

        <SummaryCards summary={summary} categoryTotals={categoryTotals} />

        <ExpenseList expenses={currentCycleExpenses} onDeleteExpense={handleDeleteExpense} />
      </div>
    </main>
  )
}

export default App
