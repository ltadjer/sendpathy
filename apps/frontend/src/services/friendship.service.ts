import api from './api.service';

export default {
  async fetchAllFriendships() {
    const response = await api.get('/friendships');
    return response.data;
  },
  async createOneFriendship(friendshipData) {
    return await api.post('/friendships', friendshipData);
  },

  async deleteOneFriendship(friendshipId) {
    const response = await api.delete(`/friendships/${friendshipId}`);
    return response.data;
  },

  async acceptFriendship(friendshipId) {
    const response = await api.patch(`/friendships/${friendshipId}/accept`);
    return response.data;
  }

}
