import createError from 'http-errors'
import { createCompany, getCompanyByOwner, updateCompanyByOwner } from '../models/companyModel.js'

export const registerCompany = async (req, res, next) => {
  try {
    const ownerId = req.user?.sub
    if (!ownerId) return next(createError(401, 'Unauthorized'))
    const created = await createCompany(ownerId, req.body || {})
    return res.status(200).json({ success: true, message: 'Company profile created', data: { id: created.id } })
  } catch (err) {
    next(createError(400, err.message))
  }
}

export const getProfile = async (req, res, next) => {
  try {
    const ownerId = req.user?.sub
    if (!ownerId) return next(createError(401, 'Unauthorized'))
    const profile = await getCompanyByOwner(ownerId)
    if (!profile) return next(createError(404, 'Company profile not found'))
    return res.json({ success: true, data: profile })
  } catch (err) {
    next(createError(404, err.message))
  }
}

export const updateProfile = async (req, res, next) => {
  try {
    const ownerId = req.user?.sub
    if (!ownerId) return next(createError(401, 'Unauthorized'))
    await updateCompanyByOwner(ownerId, req.body || {})
    return res.json({ success: true, message: 'Company profile updated' })
  } catch (err) {
    next(createError(400, err.message))
  }
}

export const uploadLogo = async (req, res, next) => {
  try {
    // Integrate Cloudinary and persist logo_url via updateCompanyByOwner when ready
    return res.json({ success: true, message: 'Logo upload endpoint stubbed' })
  } catch (err) {
    next(createError(400, err.message))
  }
}

export const uploadBanner = async (req, res, next) => {
  try {
    // Integrate Cloudinary and persist banner_url via updateCompanyByOwner when ready
    return res.json({ success: true, message: 'Banner upload endpoint stubbed' })
  } catch (err) {
    next(createError(400, err.message))
  }
}