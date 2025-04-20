import api from './api'

export const login = (email: string, password: string) =>
  api.post('/auth/login', { email, password })

export const getProfile = () =>
  api.get('/auth/me')

export const logout = () =>
  api.post('/auth/logout')

export const updateProfile = (id: string, data: any) =>
  api.patch(`/users/${id}`, data)
