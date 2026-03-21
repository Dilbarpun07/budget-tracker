import express from 'express'
import cors from 'cors'
import { runMigrations } from './db/migrate'
import expensesRouter from './routes/expenses'
import settingsRouter from './routes/settings'

const app = express()
const PORT = process.env.PORT ?? 3001

// Allow the React frontend to call the API.
// Port 4173 = Docker preview build, port 5173 = Vite dev server.
const allowedOrigins = [
  process.env.CORS_ORIGIN ?? 'http://localhost:4173',
  'http://localhost:5173',
]
app.use(cors({
  origin: (origin, callback) => {
    // Allow Postman and curl (no origin header) plus the listed origins
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true)
    } else {
      callback(new Error(`CORS: origin ${origin} not allowed`))
    }
  },
}))

// Parse incoming JSON request bodies.
app.use(express.json())

// Health check — useful for Docker and Azure health probes.
app.get('/health', (_req, res) => {
  res.json({ status: 'ok' })
})

// Mount routes.
app.use('/expenses', expensesRouter)
app.use('/settings', settingsRouter)

// Run migrations then start listening.
runMigrations()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`API server running on http://localhost:${PORT}`)
    })
  })
  .catch(err => {
    console.error('Migration failed, server not started:', err)
    process.exit(1)
  })
