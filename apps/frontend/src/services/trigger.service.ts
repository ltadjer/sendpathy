import api from './api.service';

export default {
  /**
   * Fetch all triggers.
   */
  async fetchAllTriggers() {
    const response = await api.get('/triggers');
    return response.data;
  },

}