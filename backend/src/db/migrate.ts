import fs from 'fs'
import path from 'path'
import pool from './client'

// Reads every .sql file in the migrations/ folder (in filename order)
// and runs them against the database on server startup.
// IF NOT EXISTS guards in the SQL make this safe to run every time.
export async function runMigrations(): Promise<void> {
  const migrationsDir = path.join(__dirname, '../../migrations')
  const files = fs.readdirSync(migrationsDir).filter(f => f.endsWith('.sql')).sort()

  for (const file of files) {
    const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf-8')
    console.log(`Running migration: ${file}`)
    await pool.query(sql)
  }

  console.log('All migrations complete.')
}
