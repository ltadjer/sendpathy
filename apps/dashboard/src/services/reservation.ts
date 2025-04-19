import api from './api'

export const getReservations = () => api.get('/reservations')
export const getReservation = (id: string) => api.get(`/reservations/${id}`)
export const createReservation = (data: any) => api.post('/reservations', data)
export const updateReservationStatus = (id: string, data: { isCancelled: boolean }) =>
  api.patch(`/reservations/${id}/update-status`, data);
export const deleteReservation = (id: string) => api.delete(`/reservations/${id}`)
