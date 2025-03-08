import api from './api.service';

export default {
  async createOneFriendship(friendshipData) {
    return await api.post('/friendships', friendshipData);
  },

  async deleteOneFriendship(friendshipId) {
    const response = await api.delete(`/friendships/${friendshipId}`);
    return response.data;
  },

}
