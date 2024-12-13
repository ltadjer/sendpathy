import api from './api.service';

export default {
  async fetchAllAvailableSlots() {
    const response = await api.get('/available-slots');
    return response.data;
  },
};