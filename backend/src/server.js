import express from 'express'
import helmet from 'helmet'
import cors from 'cors'
import compression from 'compression'
import morgan from 'morgan'
import dotenv from 'dotenv'
import createError from 'http-errors'
import authRoutes from './routes/auth.js'
import companyRoutes from './routes/company.js'
import debugRoutes from './routes/debug.js'
import { pool } from './services/db.js'


dotenv.config()

const app = express()
const PORT = process.env.PORT || 4000

app.use(helmet())
app.use(cors({ origin: 'http://localhost:5173', credentials: true }))
app.use(compression())
app.use(express.json({ limit: '5mb' }))
app.use(morgan('dev'))

app.get('/api/health', (req, res) => res.json({ ok: true }))
app.use('/api/auth', authRoutes)
app.use('/api/company', companyRoutes)
app.use('/api/debug', debugRoutes)

app.use((req, res, next) => {
  next(createError(404, 'Not Found'))
})

app.use((err, req, res, next) => {
  const status = err.status || 500
  res.status(status).json({ success: false, message: err.message || 'Server Error' })
})

pool.connect()
  .then(() => {
    console.log('Connected to PostgreSQL');
    app.listen(PORT, () => {
      console.log(`API server listening on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Database connection failed:', err);
    process.exit(1);
  });
