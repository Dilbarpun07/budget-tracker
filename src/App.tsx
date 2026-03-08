import { useEffect, useState } from 'react'
import './App.css'

type Expense = {
  id: number
  date: string;
  amount: string;
  category: string;
  note: string;
};

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

function parseLocalDate(dateString: string) {
  const [year, month, day] = dateString.split('-').map(Number)
  return new Date(year, month - 1, day)
}

// Pay Cycle day function - Wednesday to Tuesday

function getPayCycle(dateString: string) {
  const date = parseLocalDate(dateString)
  const day = date.getDay();
  const daysSinceWednesday = (day + 4) % 7;

  const start = new Date(date);
  start.setDate(date.getDate() - daysSinceWednesday);
  start.setHours(0, 0, 0, 0)

  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  end.setHours(23, 59, 59, 999)

  return { start, end };
}


//Main Function

function App() {
  const [income, setIncome] = useState(() => localStorage.getItem('income') || '');
  const [date, setDate] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Food');
  const [note, setNote] = useState('');
  const [savings, setSavings] = useState(() => localStorage.getItem('savings') || '');
  const [expenses, setExpenses] = useState<Expense[]>(() => {
  const savedExpenses = localStorage.getItem('expenses');
  return savedExpenses ? JSON.parse(savedExpenses) : [];
});

  useEffect(() => {
    localStorage.setItem('income', income);
  }, [income]);

  useEffect(() => {
    localStorage.setItem('savings', savings);
  }, [savings]);

  useEffect(() => {
    localStorage.setItem('expenses', JSON.stringify(expenses));
  }, [expenses]);
  
  //get current pay cycle
  const today = new Date()
  const todayString = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`
  const cycle = getPayCycle(todayString)


   // Filter only current pay cycle expenses
  const currentCycleExpenses = expenses.filter((expense) => {
    const expenseDate = parseLocalDate(expense.date)
    return expenseDate >= cycle.start && expenseDate <= cycle.end
  })

  //store expenses in state
  const totalSpent = expenses.reduce((total, expense) => {
    return total + Number(expense.amount);
}, 0);

  const categoryTotals = currentCycleExpenses.reduce((totals, expense) => {
  const category = expense.category
  const amount = Number(expense.amount)

  if (!totals[category]) {
    totals[category] = 0
  }

  totals[category] += amount

  return totals
}, {} as Record<string, number>)


// calculate remaining amount after savings
  const incomeNumber = Number(income || 0);
  const savingsNumber = Number(savings || 0);
  const availableToSpend = incomeNumber - savingsNumber;
  const remaining = availableToSpend - totalSpent;

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!date || !amount || !category) return

    const newExpense: Expense = {
      id: Date.now(),
      date,
      amount,
      category,
      note,
    }

   setExpenses([...expenses, newExpense]);

    setDate("");
    setAmount("");
    setCategory("Food");
    setNote("");
  };

   const handleDeleteExpense = (id: number) => {
    setExpenses(expenses.filter((expense) => expense.id !== id))
  }

  return (

    
  <main>
    <h1>Come ON!! PUJA AND DILBAR YOU CAN DO IT!!!</h1>

    {/* Current Pay Cycle */}

    <div className="dashboard-grid">
      <section className="card">
        <h2>Current Pay Cycle</h2>
        <p>Start: {cycle.start.toDateString()}</p>
        <p>End: {cycle.end.toDateString()}</p>
      </section>

      {/* Weekly Income */}

      <section className="card">
        <h2>Weekly Income</h2>
        <input
          type="number"
          placeholder="Enter weekly income"
          value={income}
          onChange={(event) => setIncome(event.target.value)}
        />
      </section>


      {/* Savings This Period */}

      <section className="card">
        <h2>Savings This Period</h2>
        <input
          type="number"
          placeholder="Enter savings amount"
          value={savings}
          onChange={(event) => setSavings(event.target.value)}
        />
      </section>

      {/* Add Expense */}

      <section className="card card-wide">
        <h2>Add Expense</h2>

        <form onSubmit={handleSubmit}>
          <div>
            <label>Date</label>
            <br />
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          <br />

          <div>
            <label>Amount</label>
            <br />
            <input
              type="number"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>

          <br />

          <div>
            <label>Category</label>
            <br />
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
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
              onChange={(e) => setNote(e.target.value)}
            />
          </div>

          <br />

          <button type="submit">Add Expense</button>
        </form>
      </section>

      {/* Summary */}

      <section className="card">
        <h2>Summary</h2>
        <p>Income: ${incomeNumber.toFixed(2)}</p>
        <p>Savings: ${savingsNumber.toFixed(2)}</p>
        <p>Total Spent This Cycle: ${totalSpent.toFixed(2)}</p>
        <p>Remaining: ${remaining.toFixed(2)}</p>
      </section>

      <section className="card card-full">
        <h2>Category Spending</h2>

        {Object.keys(categoryTotals).length === 0 && <p>No spending yet.</p>}

        <div className="category-grid">
          {Object.entries(categoryTotals).map(([category, total]) => (
            <div className="category-card" key={category}>
              <h3>{category}</h3>
              <p>${total.toFixed(2)}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Expenses This Pay Cycle */}

      <section className="card card-full">
        <h2>Expenses This Pay Cycle</h2>

        {currentCycleExpenses.length === 0 && <p>No expenses in this cycle yet.</p>}

        <ul>
          {currentCycleExpenses.map((expense) => (
            <li key={expense.id}>
              <div className="expense-info">
                <strong>{expense.category}</strong> - ${Number(expense.amount).toFixed(2)} | {expense.date} | {expense.note || 'No note'}
              </div>
              <button
                className="delete-btn"
                onClick={() => handleDeleteExpense(expense.id)}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </section>
    </div>
  </main>
)
  
}

export default App;
