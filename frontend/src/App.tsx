import { useState } from 'react'
import './App.css'
import type { Expense } from './types/expense'
import type { BudgetSummary } from './types/budget'
import { useLocalStorageString } from './hooks/useLocalStorage'
import { loadExpenses, saveExpenses } from './services/storage'
import { getPayCycle } from './utils/payCycle'
import { parseLocalDate } from './utils/date'
import { formatDateToLocalString } from './utils/date'
import { calculateCategoryTotals, calculateTotalSpent } from './utils/totals'
import { toNumberAmount } from './utils/money'
import { PayCycleBanner } from './components/PayCycleBanner'
import { ExpenseForm } from './components/ExpenseForm'
import { ExpenseList } from './components/ExpenseList'
import { SummaryCards } from './components/SummaryCards'

function App() {
  const [income, setIncome] = useLocalStorageString('income', '')
  const [savings, setSavings] = useLocalStorageString('savings', '')
  const [expenses, setExpenses] = useState<Expense[]>(() => loadExpenses())

  
  
  // Moved to expenseform.tsx
  // const [date, setDate] = useState('')
  // const [amount, setAmount] = useState('')
  // const [category, setCategory] = useState('Food')
  // const [note, setNote] = useState('')

  


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

  const handleAddExpense = (newExpense: Expense) => {
    const nextExpenses = [...expenses, newExpense]
    setExpenses(nextExpenses)
    saveExpenses(nextExpenses)
  }

  //Moved to expenseform.tsx
  //   setDate('')
  //   setAmount('')
  //   setCategory('Food')
  //   setNote('')
  // }

  const handleDeleteExpense = (id: Expense['id']) => {
    const nextExpenses = expenses.filter((expense) => expense.id !== id)
    setExpenses(nextExpenses)
    saveExpenses(nextExpenses)
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
          />
        </section>

        <section className="card">
          <h2>Savings This Period</h2>
          <input
            type="number"
            placeholder="Enter savings amount"
            value={savings}
            onChange={(event) => setSavings(event.target.value)}
          />
        </section>

 {/* Moved to expenseform.tsx */}
        {/* <ExpenseForm
          date={date}
          amount={amount}
          category={category}
          note={note}
          onDateChange={setDate}
          onAmountChange={setAmount}
          onCategoryChange={setCategory}
          onNoteChange={setNote}
          onAddExpense={handleAddExpense}
        /> */}

        <ExpenseForm onAddExpense={handleAddExpense} />

        <SummaryCards summary={summary} categoryTotals={categoryTotals} />

        <ExpenseList expenses={currentCycleExpenses} onDeleteExpense={handleDeleteExpense} />
      </div>
    </main>
  )
}

export default App
