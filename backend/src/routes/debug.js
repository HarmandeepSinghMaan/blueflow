import { Router } from 'express'
import { query } from '../services/db.js'

const router = Router()

router.get('/users-constraints', async (req, res) => {
  try {
    const sql = `SELECT conname, pg_get_constraintdef(oid) AS def
                 FROM pg_constraint
                 WHERE conrelid = 'users'::regclass;`
    const { rows } = await query(sql)
    return res.json({ success: true, data: rows })
  } catch (err) {
    return res.status(400).json({ success: false, message: err.message })
  }
})

router.get('/users-gender-values', async (req, res) => {
  try {
    const { rows } = await query('SELECT DISTINCT gender FROM users')
    return res.json({ success: true, data: rows })
  } catch (err) {
    return res.status(400).json({ success: false, message: err.message })
  }
})

export default router