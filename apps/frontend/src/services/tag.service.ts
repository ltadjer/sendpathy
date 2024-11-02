import api from './api.service';

export default {
  /**
   * Fetch all tags.
   */
  async fetchAllTags() {
    const response = await api.get('/tags');
    return response.data;
  },

}