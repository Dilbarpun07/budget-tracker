import type { BudgetSummary } from '../types/budget'

type SummaryCardsProps = {
  summary: BudgetSummary
  categoryTotals: Record<string, number>
}

export function SummaryCards({ summary, categoryTotals }: SummaryCardsProps) {
  const hasCategoryTotals = Object.keys(categoryTotals).length > 0

  return (
    <>
      <section className="card">
        <h2>Summary</h2>
        <p>Income: ${summary.income.toFixed(2)}</p>
        <p>Savings: ${summary.savings.toFixed(2)}</p>
        <p>Total Spent This Cycle: ${summary.totalSpent.toFixed(2)}</p>
        <p>Remaining: ${summary.remaining.toFixed(2)}</p>
      </section>

      <section className="card card-full">
        <h2>Category Spending</h2>

        {!hasCategoryTotals && <p>No spending yet.</p>}

        <div className="category-grid">
          {Object.entries(categoryTotals).map(([category, total]) => (
            <div className="category-card" key={category}>
              <h3>{category}</h3>
              <p>${total.toFixed(2)}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}

