import React, { useEffect, useState } from 'react'
import { Container, Box, Typography, Tabs, Tab, Grid, TextField, Button, Paper, Alert } from '@mui/material'
import { api, setAuthToken } from '../api/client'
import { useSelector } from 'react-redux'

const toBase64 = (file) => new Promise((resolve, reject) => {
  const reader = new FileReader()
  reader.onload = () => resolve(reader.result)
  reader.onerror = reject
  reader.readAsDataURL(file)
})

export default function Settings() {
  const token = useSelector((state) => state.auth.token)
  const [tab, setTab] = useState(0)
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState(null)
  const [successMsg, setSuccessMsg] = useState(null)
  const [profile, setProfile] = useState({
    company_name: '',
    description: '',
    logo_url: '',
    banner_url: '',
    address: '', city: '', state: '', country: '', postal_code: '',
    website: '', industry: '', founded_date: '', social_links: ''
  })

  const fetchProfile = async () => {
    setLoading(true)
    setErrorMsg(null)
    try {
      const res = await api.get('/api/company/profile')
      setProfile((p) => ({ ...p, ...(res?.data || {}).data }))
    } catch (err) {
      const status = err?.response?.status
      if (status === 401) {
        setErrorMsg('Session expired. Please log in again.')
      } else if (status !== 404) {
        setErrorMsg(err?.response?.data?.message || 'Failed to load profile')
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // Ensure Authorization header is set before fetching
    setAuthToken(token)
    if (token) fetchProfile()
    else setErrorMsg('Unauthorized')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token])

  const onFileSelect = async (e, type) => {
    try {
      const file = e.target.files?.[0]
      if (!file) return
      if (file.size > 5 * 1024 * 1024) {
        setErrorMsg('Max file size is 5MB')
        return
      }
      setErrorMsg(null)
      setLoading(true)
      const base64 = await toBase64(file)
      const endpoint = type === 'logo' ? '/api/company/upload-logo' : '/api/company/upload-banner'
      const res = await api.post(endpoint, { fileBase64: base64 })
      const url = res?.data?.data?.url || res?.data?.data?.logo_url || res?.data?.data?.banner_url
      setProfile((p) => ({ ...p, [`${type}_url`]: url }))
      setSuccessMsg(`${type === 'logo' ? 'Logo' : 'Banner'} uploaded`)
    } catch (err) {
      setErrorMsg(err?.response?.data?.message || 'Upload failed')
    } finally {
      setLoading(false)
    }
  }

  const onSave = async () => {
    setLoading(true)
    setErrorMsg(null)
    setSuccessMsg(null)
    try {
      const payload = { ...profile }
      if (!profile?.id) {
        const res = await api.post('/api/company/register', payload)
        setSuccessMsg(res?.data?.message || 'Company created')
      } else {
        const res = await api.put('/api/company/profile', payload)
        setSuccessMsg(res?.data?.message || 'Company updated')
      }
    } catch (err) {
      setErrorMsg(err?.response?.data?.message || 'Save failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 6 }}>
        <Typography variant="h5" gutterBottom>Company Settings</Typography>
        {errorMsg && <Alert severity="error" sx={{ mb: 2 }}>{errorMsg}</Alert>}
        {successMsg && <Alert severity="success" sx={{ mb: 2 }}>{successMsg}</Alert>}

        <Tabs value={tab} onChange={(e, v) => setTab(v)} sx={{ mb: 2 }}>
          <Tab label="Company Info" />
          <Tab label="Founding Info" />
          <Tab label="Social Media Profile" />
          <Tab label="Contact" />
        </Tabs>

        {tab === 0 && (
          <Paper sx={{ p: 3 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>Upload Logo</Typography>
                <Box sx={{ border: '1px dashed', borderColor: 'divider', borderRadius: 2, p: 2, textAlign: 'center' }}>
                  <input type="file" accept="image/*" onChange={(e) => onFileSelect(e, 'logo')} />
                  {profile.logo_url && <Box sx={{ mt: 2 }}><img src={profile.logo_url} alt="logo" style={{ maxWidth: '100%', maxHeight: 120 }} /></Box>}
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>Banner Image</Typography>
                <Box sx={{ border: '1px dashed', borderColor: 'divider', borderRadius: 2, p: 2, textAlign: 'center' }}>
                  <input type="file" accept="image/*" onChange={(e) => onFileSelect(e, 'banner')} />
                  {profile.banner_url && <Box sx={{ mt: 2 }}><img src={profile.banner_url} alt="banner" style={{ maxWidth: '100%', maxHeight: 120 }} /></Box>}
                </Box>
              </Grid>

              <Grid item xs={12}>
                <TextField label="Company name" fullWidth value={profile.company_name || ''} onChange={(e) => setProfile({ ...profile, company_name: e.target.value })} />
              </Grid>
              <Grid item xs={12}>
                <TextField label="About Us" multiline minRows={4} fullWidth value={profile.description || ''} onChange={(e) => setProfile({ ...profile, description: e.target.value })} />
              </Grid>
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Button variant="contained" onClick={onSave} disabled={loading}>{loading ? 'Saving...' : 'Save'}</Button>
                  <Button variant="outlined" onClick={fetchProfile} disabled={loading}>Refresh</Button>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        )}

        {tab === 1 && (
          <Paper sx={{ p: 3 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField label="Founded Date" type="date" fullWidth InputLabelProps={{ shrink: true }} value={profile.founded_date || ''} onChange={(e) => setProfile({ ...profile, founded_date: e.target.value })} />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField label="Industry" fullWidth value={profile.industry || ''} onChange={(e) => setProfile({ ...profile, industry: e.target.value })} />
              </Grid>
              <Grid item xs={12}>
                <TextField label="Website" fullWidth value={profile.website || ''} onChange={(e) => setProfile({ ...profile, website: e.target.value })} />
              </Grid>
              <Grid item xs={12}>
                <Button variant="contained" onClick={onSave} disabled={loading}>{loading ? 'Saving...' : 'Save'}</Button>
              </Grid>
            </Grid>
          </Paper>
        )}

        {tab === 2 && (
          <Paper sx={{ p: 3 }}>
            <TextField label="Social Links (JSON or comma separated)" fullWidth value={profile.social_links || ''} onChange={(e) => setProfile({ ...profile, social_links: e.target.value })} />
            <Box sx={{ mt: 2 }}>
              <Button variant="contained" onClick={onSave} disabled={loading}>{loading ? 'Saving...' : 'Save'}</Button>
            </Box>
          </Paper>
        )}

        {tab === 3 && (
          <Paper sx={{ p: 3 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField label="Address" fullWidth value={profile.address || ''} onChange={(e) => setProfile({ ...profile, address: e.target.value })} />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField label="City" fullWidth value={profile.city || ''} onChange={(e) => setProfile({ ...profile, city: e.target.value })} />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField label="State" fullWidth value={profile.state || ''} onChange={(e) => setProfile({ ...profile, state: e.target.value })} />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField label="Country" fullWidth value={profile.country || ''} onChange={(e) => setProfile({ ...profile, country: e.target.value })} />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField label="Postal Code" fullWidth value={profile.postal_code || ''} onChange={(e) => setProfile({ ...profile, postal_code: e.target.value })} />
              </Grid>
              <Grid item xs={12}>
                <Button variant="contained" onClick={onSave} disabled={loading}>{loading ? 'Saving...' : 'Save'}</Button>
              </Grid>
            </Grid>
          </Paper>
        )}
      </Box>
    </Container>
  )
}