import api from './api.service';

export default {
  /**
   * Fetch all conversations for the logged-in user.
   */
  async fetchAllNotifications() {
    const response = await api.get('/notifications');
    return response.data;
  },

  async markAsRead(notificationId) {
    await api.patch(`/notifications/${notificationId}/read`);
  },

  async updateNotificationMessage(notificationId, message) {
    await api.patch(`/notifications/${notificationId}`, { message });
  }
}