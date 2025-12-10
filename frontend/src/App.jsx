import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import { CssBaseline } from '@mui/material'
import { useSelector } from 'react-redux'
import { useEffect } from 'react'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Settings from './pages/Settings'
import { setAuthToken } from './api/client'

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#1E88E5' },
    secondary: { main: '#546E7A' }
  }
})

export default function App() {
  const token = useSelector((state) => state.auth.token)
  const isAuthenticated = !!token

  useEffect(() => {
    setAuthToken(token)
  }, [token])

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={isAuthenticated ? <Dashboard /> : <Login />} />
        <Route path="/settings" element={isAuthenticated ? <Settings /> : <Login />} />
        <Route path="*" element={isAuthenticated ? <Dashboard /> : <Login />} />
      </Routes>
    </ThemeProvider>
  )
}