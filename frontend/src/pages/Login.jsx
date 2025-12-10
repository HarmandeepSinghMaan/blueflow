import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import { setCredentials } from '../store/slices/authSlice'
import { TextField, Button, Container, Box, Typography, Alert } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { api, setAuthToken } from '../api/client'

export default function Login() {
  const { register, handleSubmit } = useForm()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState(null)

  const onSubmit = async (data) => {
    setLoading(true)
    setErrorMsg(null)
    try {
      const res = await api.post('/api/auth/login', { email: data.email, password: data.password })
      const token = res?.data?.data?.token
      if (!token) throw new Error('Missing token')
      // Ensure axios client has the auth header immediately to avoid race conditions
      setAuthToken(token)
      dispatch(setCredentials({ token, user: { email: data.email } }))
      navigate('/dashboard')
    } catch (err) {
      setErrorMsg(err?.response?.data?.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', color: 'text.primary', display: 'flex', alignItems: 'center' }}>
      <Container maxWidth="sm">
        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" gutterBottom>Login</Typography>
          {errorMsg && (
            <Alert severity="error" sx={{ mb: 2 }}>{errorMsg}</Alert>
          )}
          <form onSubmit={handleSubmit(onSubmit)}>
            <TextField label="Email" type="email" fullWidth sx={{ my: 1 }} {...register('email', { required: true })} />
            <TextField label="Password" type="password" fullWidth sx={{ my: 1 }} {...register('password', { required: true })} />
            <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }} disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </Button>
          </form>
        </Box>
      </Container>
    </Box>
  )
}