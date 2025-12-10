import { query } from '../services/db.js'

export const createUser = async ({ email, passwordHash, full_name, gender, mobile_no, signup_type }) => {
  const sql = `INSERT INTO users (email, password, full_name, gender, mobile_no, signup_type)
               VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`
  const params = [email, passwordHash, full_name, gender, mobile_no, signup_type]
  const { rows } = await query(sql, params)
  return rows[0]
}

export const getUserByEmail = async (email) => {
  const { rows } = await query('SELECT * FROM users WHERE email=$1', [email])
  return rows[0]
}

export const markEmailVerified = async (userId) => {
  await query('UPDATE users SET is_email_verified=true WHERE id=$1', [userId])
}

export const markMobileVerified = async (userId) => {
  await query('UPDATE users SET is_mobile_verified=true WHERE id=$1', [userId])
}