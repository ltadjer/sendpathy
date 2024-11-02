import api from './api.service';

export default {

  async likePost(postId) {
    return api.post(`/likes/like/post/${postId}`);
  },

  async unlikePost(postId) {
    return api.delete(`/likes/unlike/post/${postId}`);
  },

  async countPostLikes(postId) {
    const response = await api.get(`/likes/count/post/${postId}`);
    console.log(response.data);
    return response.data;
  },

  async likeComment(commentId) {
    return api.post(`/likes/like/comment/${commentId}`);
  },

  async unlikeComment(commentId) {
    return api.delete(`/likes/unlike/comment/${commentId}`);
  },

  async countCommentLikes(commentId) {
    const response = await api.get(`/likes/count/comment/${commentId}`);
    return response.data;
  }
}