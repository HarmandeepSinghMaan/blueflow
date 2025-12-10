import createError from 'http-errors'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import { body, validationResult } from 'express-validator'
import { createUser, getUserByEmail, markEmailVerified, markMobileVerified } from '../models/userModel.js'
import { sendEmailVerificationLink, sendMobileOtp, verifyEmailLink, verifyMobileOtp } from '../services/firebaseService.js'

export const registerValidators = [
  body('email').isEmail(),
  body('password').isLength({ min: 8 }),
  body('full_name').isString().isLength({ min: 2 }),
  body('gender').isIn(['M', 'F', 'O', 'm', 'f', 'o', 'male', 'female', 'other']),
  body('mobile_no').isString().isLength({ min: 8 }),
  body('signup_type').equals('e')
]

const normalizeGender = (g) => {
  const s = (g || '').toString().trim().toLowerCase()
  if (['m', 'male'].includes(s)) return 'M'
  if (['f', 'female'].includes(s)) return 'F'
  if (['o', 'other'].includes(s)) return 'O'
  return null
}

export const register = async (req, res, next) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) return next(createError(400, 'Invalid input'))

    const { email, password, full_name, gender, mobile_no, signup_type } = req.body
    const existing = await getUserByEmail(email)
    if (existing) return next(createError(400, 'Email already registered'))

    const passwordHash = await bcrypt.hash(password, 10)
    const genderNorm = normalizeGender(gender)
    const user = await createUser({ email, passwordHash, full_name, gender: genderNorm, mobile_no, signup_type })

    await sendMobileOtp(mobile_no)
    await sendEmailVerificationLink(email)

    return res.status(200).json({ success: true, message: 'User registered successfully. Please verify mobile OTP.', data: { user_id: user.id } })
  } catch (err) {
    next(createError(400, err.message))
  }
}

export const loginValidators = [
  body('email').isEmail(),
  body('password').isString()
]

export const login = async (req, res, next) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) return next(createError(400, 'Invalid input'))

    const { email, password } = req.body
    const user = await getUserByEmail(email)
    if (!user) return next(createError(401, 'Invalid credentials'))

    const ok = await bcrypt.compare(password, user.password)
    if (!ok) return next(createError(401, 'Invalid credentials'))

    const token = jwt.sign({ sub: user.id, email }, process.env.JWT_SECRET || 'devsecret', { expiresIn: '90d' })
    return res.json({ success: true, message: 'Login successful', data: { token } })
  } catch (err) {
    next(createError(401, err.message))
  }
}

export const verifyEmail = async (req, res, next) => {
  try {
    // Example: ?token=...
    const { token, user_id } = req.query
    await verifyEmailLink(token)
    await markEmailVerified(user_id)
    return res.json({ success: true, message: 'Email verified' })
  } catch (err) {
    next(createError(400, err.message))
  }
}

export const verifyMobile = async (req, res, next) => {
  try {
    const { user_id, mobile_no, otp } = req.body
    const ok = await verifyMobileOtp(mobile_no, otp)
    if (!ok) return next(createError(400, 'Invalid OTP'))
    await markMobileVerified(user_id)
    return res.json({ success: true, message: 'Mobile verified' })
  } catch (err) {
    next(createError(400, err.message))
  }
}