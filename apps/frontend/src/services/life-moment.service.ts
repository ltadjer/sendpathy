import api from './api.service';
import { Emojis } from '@/enums/emojis.enum';

export default {
  /**
   * Fetch all life moments for the logged-in user.
   */
  async fetchAllLifeMoments() {
    const response = await api.get('/life-moments');
    return response.data;
  },

  /**
   * Fetch a single lifeMoment by its ID.
   *
   * @param {string} lifeMomentId The ID of the lifeMoment to fetch.
   */

  async fetchOneLifeMomentById(lifeMomentId) {
    const response = await api.get(`/life-moments/${lifeMomentId}`);
    return response.data;
  },

  /**
   * Create a new lifeMoment.
   *
   * @param {object} lifeMomentData The data for the new lifeMoment.
   */

  async createOneLifeMoment(lifeMomentData) {
    const response = await api.post('/life-moments', lifeMomentData);
    return response.data;
  },

  /**
   * Update an existing lifeMoment.
   *
   * @param {string} lifeMomentId The ID of the lifeMoment to update.
   * @param {object} lifeMomentData The new data for the lifeMoment.
   */
  async updateOneLifeMoment(lifeMomentId, lifeMomentData) {
    const response = await api.patch(`/life-moments/${lifeMomentId}`, lifeMomentData);
    return response.data;
  },

  /**
   * Delete an existing lifeMoment.
   * @param {string} lifeMomentId The ID of the lifeMoment to delete.
   */
  async deleteOneLifeMoment(lifeMomentId) {
    const response = await api.delete(`/life-moments/${lifeMomentId}`);
    return response.data;
  },

  async getEmojis() {
    return Object.values(Emojis);
  },

  async deleteOneContent(contentId) {
    try {
      const response = await api.delete(`/contents/content/${contentId}`);
      return response.data;
    } catch (error) {
      console.error('Error while deleting content', error);
      throw error;
    }
  }
}
