import type { Expense } from '../types/expense'

const categories = [
  'Food',
  'Fuel',
  'Rent',
  'Bills',
  'Shopping',
  'Entertainment',
  'Transport',
  'Health',
  'Other',
]

type ExpenseFormProps = {
  date: string
  amount: string
  category: string
  note: string
  onDateChange: (value: string) => void
  onAmountChange: (value: string) => void
  onCategoryChange: (value: string) => void
  onNoteChange: (value: string) => void
  onAddExpense: (expense: Expense) => void
}

export function ExpenseForm({
  date,
  amount,
  category,
  note,
  onDateChange,
  onAmountChange,
  onCategoryChange,
  onNoteChange,
  onAddExpense,
}: ExpenseFormProps) {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!date || !amount || !category) return

    const newExpense: Expense = {
      id: Date.now(),
      date,
      amount,
      category,
      note,
    }

    onAddExpense(newExpense)
  }

  return (
    <section className="card card-wide">
      <h2>Add Expense</h2>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Date</label>
          <br />
          <input type="date" value={date} onChange={(e) => onDateChange(e.target.value)} />
        </div>

        <br />

        <div>
          <label>Amount</label>
          <br />
          <input
            type="number"
            placeholder="Enter amount"
            value={amount}
            onChange={(e) => onAmountChange(e.target.value)}
          />
        </div>

        <br />

        <div>
          <label>Category</label>
          <br />
          <select value={category} onChange={(e) => onCategoryChange(e.target.value)}>
            {categories.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>

        <br />

        <div>
          <label>Note</label>
          <br />
          <input
            type="text"
            placeholder="Optional"
            value={note}
            onChange={(e) => onNoteChange(e.target.value)}
          />
        </div>

        <br />

        <button type="submit">Add Expense</button>
      </form>
    </section>
  )
}

