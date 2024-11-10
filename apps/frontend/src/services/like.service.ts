import api from './api.service';

export default {

  async likePost(postId) {
    return await api.post(`/likes/like/post/${postId}`);
  },

  async unlikePost(postId) {
    return await api.delete(`/likes/unlike/post/${postId}`);
  },

  async likeComment(commentId) {
    return await api.post(`/likes/like/comment/${commentId}`);
  },

  async unlikeComment(commentId) {
    return await api.delete(`/likes/unlike/comment/${commentId}`);
  }
}