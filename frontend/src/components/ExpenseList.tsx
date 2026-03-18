import type { Expense } from '../types/expense'

type ExpenseListProps = {
  expenses: Expense[]
  onDeleteExpense: (id: number) => void
}

export function ExpenseList({ expenses, onDeleteExpense }: ExpenseListProps) {
  return (
    <section className="card card-full">
      <h2>Expenses This Pay Cycle</h2>

      {expenses.length === 0 && <p>No expenses in this cycle yet.</p>}

      <ul>
        {expenses.map((expense) => (
          <li key={expense.id}>
            <div className="expense-info">
              <strong>{expense.category}</strong> - $
              {Number(expense.amount).toFixed(2)} | {expense.date} | {expense.note || 'No note'}
            </div>
            <button className="delete-btn" onClick={() => onDeleteExpense(expense.id)}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}

