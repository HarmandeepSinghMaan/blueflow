import { createSlice } from '@reduxjs/toolkit'

const getStoredUser = () => {
  try {
    const v = typeof window !== 'undefined' ? localStorage.getItem('user') : null
    return v ? JSON.parse(v) : null
  } catch {
    return null
  }
}

const initialState = {
  token: typeof window !== 'undefined' ? localStorage.getItem('token') : null,
  user: getStoredUser()
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.token = action.payload.token
      state.user = action.payload.user || null
      if (typeof window !== 'undefined') {
        localStorage.setItem('token', state.token)
        localStorage.setItem('user', JSON.stringify(state.user))
      }
    },
    logout: (state) => {
      state.token = null
      state.user = null
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
      }
    }
  }
})

export const { setCredentials, logout } = authSlice.actions
export default authSlice.reducer