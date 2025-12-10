import { v2 as cloudinary } from 'cloudinary'
import { config } from '../config/index.js'

cloudinary.config({
  cloud_name: config.cloudinary.cloud_name,
  api_key: config.cloudinary.api_key,
  api_secret: config.cloudinary.api_secret
})

export const uploadImage = async (fileBase64, folder = 'company') => {
  const res = await cloudinary.uploader.upload(fileBase64, { folder })
  return res.secure_url
}