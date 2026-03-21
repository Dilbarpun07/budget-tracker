import { Router, Request, Response } from 'express'
import pool from '../db/client'

const router = Router()

// GET /settings
// Returns the current income and savings values.
// There is always exactly one row (seeded by migration 001).
router.get('/', async (_req: Request, res: Response) => {
  try {
    const result = await pool.query('SELECT * FROM income_settings LIMIT 1')
    res.json(result.rows[0])
  } catch (err) {
    console.error('GET /settings error:', err)
    res.status(500).json({ error: 'Failed to fetch settings' })
  }
})

// PUT /settings
// Body: { income, savings }
// Updates the single settings row and returns the updated record.
router.put('/', async (req: Request, res: Response) => {
  const { income, savings } = req.body

  if (income === undefined || savings === undefined) {
    res.status(400).json({ error: 'income and savings are required' })
    return
  }

  try {
    const result = await pool.query(
      `UPDATE income_settings
       SET income = $1, savings = $2, updated_at = now()
       WHERE id = (SELECT id FROM income_settings LIMIT 1)
       RETURNING *`,
      [income, savings]
    )
    res.json(result.rows[0])
  } catch (err) {
    console.error('PUT /settings error:', err)
    res.status(500).json({ error: 'Failed to update settings' })
  }
})

export default router
