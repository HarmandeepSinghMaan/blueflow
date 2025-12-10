import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Container, Box, Typography, TextField, Button, Alert, MenuItem } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { api } from '../api/client'

export default function Register() {
  const { register, handleSubmit, formState: { errors } } = useForm({ mode: 'onBlur' })
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState(null)
  const [successMsg, setSuccessMsg] = useState(null)

  const onSubmit = async (data) => {
    setLoading(true)
    setErrorMsg(null)
    setSuccessMsg(null)
    try {
      const payload = {
        email: data.email,
        password: data.password,
        full_name: data.full_name,
        gender: data.gender, // now sends 'male'|'female'|'other'
        mobile_no: data.mobile_no,
        signup_type: 'e'
      }
      const res = await api.post('/api/auth/register', payload)
      if (res?.data?.success) {
        setSuccessMsg('Registered successfully. Please login.')
        setTimeout(() => navigate('/login'), 800)
      } else {
        setErrorMsg(res?.data?.message || 'Registration failed')
      }
    } catch (err) {
      setErrorMsg(err?.response?.data?.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', color: 'text.primary', display: 'flex', alignItems: 'center' }}>
      <Container maxWidth="sm">
        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" gutterBottom>Register</Typography>
          {errorMsg && <Alert severity="error" sx={{ mb: 2 }}>{errorMsg}</Alert>}
          {successMsg && <Alert severity="success" sx={{ mb: 2 }}>{successMsg}</Alert>}
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <TextField
              label="Full Name"
              fullWidth
              sx={{ my: 1 }}
              {...register('full_name', { required: 'Full name is required' })}
              error={!!errors.full_name}
              helperText={errors.full_name?.message}
            />
            <TextField
              label="Email"
              type="email"
              fullWidth
              sx={{ my: 1 }}
              {...register('email', {
                required: 'Email is required',
                pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Enter a valid email' }
              })}
              error={!!errors.email}
              helperText={errors.email?.message}
            />
            <TextField
              label="Password"
              type="password"
              fullWidth
              sx={{ my: 1 }}
              {...register('password', { required: 'Password is required', minLength: { value: 8, message: 'At least 8 characters' } })}
              error={!!errors.password}
              helperText={errors.password?.message}
            />
            <TextField
              label="Mobile No"
              type="tel"
              fullWidth
              sx={{ my: 1 }}
              {...register('mobile_no', { required: 'Mobile number is required', pattern: { value: /^\d{10}$/, message: 'Enter 10 digits' } })}
              error={!!errors.mobile_no}
              helperText={errors.mobile_no?.message}
            />
            <TextField
              select
              label="Gender"
              fullWidth
              sx={{ my: 1 }}
              defaultValue="male"
              {...register('gender', { required: 'Please select gender' })}
              error={!!errors.gender}
              helperText={errors.gender?.message}
            >
              <MenuItem value="male">Male</MenuItem>
              <MenuItem value="female">Female</MenuItem>
              <MenuItem value="other">Other</MenuItem>
            </TextField>
            <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }} disabled={loading}>
              {loading ? 'Registering...' : 'Register'}
            </Button>
          </form>
        </Box>
      </Container>
    </Box>
  )
}