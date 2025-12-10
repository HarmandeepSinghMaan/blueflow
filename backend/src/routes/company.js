import { Router } from 'express'
import { registerCompany, getProfile, updateProfile, uploadLogo, uploadBanner } from '../controllers/companyController.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()

router.post('/register', requireAuth, registerCompany)
router.get('/profile', requireAuth, getProfile)
router.put('/profile', requireAuth, updateProfile)
router.post('/upload-logo', requireAuth, uploadLogo)
router.post('/upload-banner', requireAuth, uploadBanner)

export default router