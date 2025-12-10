import { Pool } from 'pg'
import { config } from '../config/index.js'

export const pool = new Pool({ connectionString: config.db.connectionString })

export const query = (text, params) => pool.query(text, params)