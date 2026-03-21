import { Router, Request, Response } from 'express'
import pool from '../db/client'

const router = Router()

// PostgreSQL returns DATE columns as JS Date objects.
// This formats them back to "YYYY-MM-DD" strings so the frontend gets consistent data.
function formatRow(row: Record<string, unknown>) {
  return {
    ...row,
    date: row.date instanceof Date
      ? row.date.toISOString().slice(0, 10)
      : String(row.date).slice(0, 10),
    amount: String(row.amount),
  }
}

// GET /expenses?start=YYYY-MM-DD&end=YYYY-MM-DD
// Returns all expenses, optionally filtered by a date range (for pay cycle filtering).
router.get('/', async (req: Request, res: Response) => {
  const { start, end } = req.query

  try {
    let result

    if (start && end) {
      result = await pool.query(
        'SELECT * FROM expenses WHERE date BETWEEN $1 AND $2 ORDER BY date DESC',
        [start, end]
      )
    } else {
      result = await pool.query('SELECT * FROM expenses ORDER BY date DESC')
    }

    res.json(result.rows.map(formatRow))
  } catch (err) {
    console.error('GET /expenses error:', err)
    res.status(500).json({ error: 'Failed to fetch expenses' })
  }
})

// POST /expenses
// Body: { date, amount, category, note }
// Creates a new expense and returns the created row.
router.post('/', async (req: Request, res: Response) => {
  const { date, amount, category, note } = req.body

  if (!date || !amount || !category) {
    res.status(400).json({ error: 'date, amount, and category are required' })
    return
  }

  try {
    const result = await pool.query(
      'INSERT INTO expenses (date, amount, category, note) VALUES ($1, $2, $3, $4) RETURNING *',
      [date, amount, category, note ?? '']
    )
    res.status(201).json(formatRow(result.rows[0]))
  } catch (err) {
    console.error('POST /expenses error:', err)
    res.status(500).json({ error: 'Failed to create expense' })
  }
})

// DELETE /expenses/:id
// Deletes an expense by its ID.
router.delete('/:id', async (req: Request, res: Response) => {
  const { id } = req.params

  try {
    const result = await pool.query(
      'DELETE FROM expenses WHERE id = $1 RETURNING id',
      [id]
    )

    if (result.rowCount === 0) {
      res.status(404).json({ error: 'Expense not found' })
      return
    }

    res.json({ deleted: true, id: Number(id) })
  } catch (err) {
    console.error('DELETE /expenses/:id error:', err)
    res.status(500).json({ error: 'Failed to delete expense' })
  }
})

export default router
