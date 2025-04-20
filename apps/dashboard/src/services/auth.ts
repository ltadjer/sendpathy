import api from './api'

export const login = (email: string, password: string) =>
  api.post('/auth/dashboard/login', { email, password })

export const getProfile = () =>
  api.get('/auth/me')

export const logout = () =>
  api.post('/auth/logout')

export const updateProfile = (id: string, data: any) =>
  api.patch(`/users/${id}`, data)

export const requestPasswordReset = (email: string) =>
  api.post('/auth/request-password-reset', { email })

export const resetPassword = (token: string, newPassword: string) =>
  api.post('/auth/reset-password', { token, newPassword })
