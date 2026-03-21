import { Pool } from 'pg'

// Pool maintains a set of reusable connections to PostgreSQL.
// It reads DATABASE_URL from the environment, set in compose.yaml or .env.
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
})

export default pool
