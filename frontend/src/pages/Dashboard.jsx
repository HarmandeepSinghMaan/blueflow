import React, { useEffect, useState } from 'react'
import { Container, Box, Typography, Button, Alert, Divider } from '@mui/material'
import { useSelector, useDispatch } from 'react-redux'
import { logout } from '../store/slices/authSlice'
import { api, setAuthToken } from '../api/client'

export default function Dashboard() {
  const user = useSelector((state) => state.auth.user)
  const token = useSelector((state) => state.auth.token)
  const dispatch = useDispatch()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState(null)

  const fetchProfile = async () => {
    setLoading(true)
    setErrorMsg(null)
    try {
      const res = await api.get('/api/company/profile')
      setProfile(res?.data?.data || null)
    } catch (err) {
      const status = err?.response?.status
      if (status === 404) {
        setProfile(null)
      } else if (status === 401) {
        setErrorMsg('Session expired. Please log in again.')
      } else {
        setErrorMsg(err?.response?.data?.message || 'Failed to load company profile')
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // Ensure auth header is set on mount and when token changes
    setAuthToken(token)
    fetchProfile()
  }, [token])

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 8 }}>
        <Typography variant="h4" gutterBottom>Dashboard</Typography>
        {errorMsg && <Alert severity="error" sx={{ mb: 2 }}>{errorMsg}</Alert>}
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 2 }}>
          <Typography variant="body1">Welcome{user?.email ? `, ${user.email}` : ''}.</Typography>
          <Button variant="outlined" size="small" onClick={fetchProfile} disabled={loading}>
            {loading ? 'Refreshing...' : 'Refresh Profile'}
          </Button>
          <Button variant="text" color="error" size="small" onClick={() => dispatch(logout())}>Logout</Button>
        </Box>
        <Divider sx={{ mb: 2 }} />
        {profile ? (
          <Box>
            <Typography variant="h6" gutterBottom>Company Profile</Typography>
            <Typography variant="body2">Company Name: {profile.company_name || '—'}</Typography>
            <Typography variant="body2">City: {profile.city || '—'}</Typography>
            <Typography variant="body2">State: {profile.state || '—'}</Typography>
            <Typography variant="body2">Country: {profile.country || '—'}</Typography>
            <Typography variant="body2">Industry: {profile.industry || '—'}</Typography>
          </Box>
        ) : (
          <Alert severity="info">No company profile yet. Use Settings to create or update your profile.</Alert>
        )}
      </Box>
    </Container>
  )
}