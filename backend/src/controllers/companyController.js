import createError from 'http-errors'
import { createCompany, getCompanyByOwner, updateCompanyByOwner } from '../models/companyModel.js'
import { uploadImage } from '../services/cloudinaryService.js'

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
    const ownerId = req.user?.sub
    if (!ownerId) return next(createError(401, 'Unauthorized'))
    const { fileBase64 } = req.body || {}
    if (!fileBase64) return next(createError(400, 'Missing file'))
    const url = await uploadImage(fileBase64, 'company/logos')
    await updateCompanyByOwner(ownerId, { logo_url: url })
    return res.json({ success: true, message: 'Logo uploaded', data: { logo_url: url } })
  } catch (err) {
    next(createError(400, err.message))
  }
}

export const uploadBanner = async (req, res, next) => {
  try {
    const ownerId = req.user?.sub
    if (!ownerId) return next(createError(401, 'Unauthorized'))
    const { fileBase64 } = req.body || {}
    if (!fileBase64) return next(createError(400, 'Missing file'))
    const url = await uploadImage(fileBase64, 'company/banners')
    await updateCompanyByOwner(ownerId, { banner_url: url })
    return res.json({ success: true, message: 'Banner uploaded', data: { banner_url: url } })
  } catch (err) {
    next(createError(400, err.message))
  }
}