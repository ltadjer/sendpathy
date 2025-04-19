import api from './api'

export const getAvailableSlots = () => api.get('/available-slots')

export const createSlots = async (slots) => {
  console.log('slots', slots)
  return await api.post('/available-slots', slots);
};
export const updateSlot = (id, slot) => api.patch(`/available-slots/${id}`, slot)

export const deleteSlot = (id) => api.delete(`/available-slots/${id}`)
