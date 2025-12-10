import express from 'express'
import { register, login, verifyEmail, verifyMobile, registerValidators, loginValidators } from '../controllers/authController.js'

const router = express.Router()

router.post('/register', registerValidators, register)
router.post('/login', loginValidators, login)
router.get('/verify-email', verifyEmail)
router.post('/verify-mobile', verifyMobile)

export default router