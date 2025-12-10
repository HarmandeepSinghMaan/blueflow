import { query } from '../services/db.js'

export const createCompany = async (owner_id, data) => {
  const sql = `INSERT INTO company_profile (owner_id, company_name, address, city, state, country, postal_code, website, logo_url, banner_url, industry, founded_date, description, social_links)
               VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) RETURNING id`
  const params = [
    owner_id,
    data.company_name,
    data.address,
    data.city,
    data.state,
    data.country,
    data.postal_code,
    data.website || null,
    data.logo_url || null,
    data.banner_url || null,
    data.industry,
    data.founded_date || null,
    data.description || null,
    data.social_links || null
  ]
  const { rows } = await query(sql, params)
  return rows[0]
}

export const getCompanyByOwner = async (owner_id) => {
  const { rows } = await query('SELECT * FROM company_profile WHERE owner_id=$1', [owner_id])
  return rows[0]
}

export const updateCompanyByOwner = async (owner_id, data) => {
  const sql = `UPDATE company_profile SET company_name=$2, address=$3, city=$4, state=$5, country=$6, postal_code=$7, website=$8, logo_url=$9, banner_url=$10, industry=$11, founded_date=$12, description=$13, social_links=$14, updated_at=NOW() WHERE owner_id=$1`
  const params = [
    owner_id,
    data.company_name,
    data.address,
    data.city,
    data.state,
    data.country,
    data.postal_code,
    data.website || null,
    data.logo_url || null,
    data.banner_url || null,
    data.industry,
    data.founded_date || null,
    data.description || null,
    data.social_links || null
  ]
  await query(sql, params)
}