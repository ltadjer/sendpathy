import api from './api.service';

export default {

  /*
    * Create a new comment to a post.
    *
    * @param {string} postId The ID of the post to add the comment to.
    * @param {object} formData The data for the new comment.
   */
  async addCommentToPost(postId, formData) {
    return api.post(`/comments/post/${postId}`, formData);
  },

 /*
    * Delete a comment from a post.
    *
    * @param {string} postId The ID of the post to delete the comment from.
    * @param {string} commentId The ID of the comment to delete.
  */
  async deleteCommentFromPost(postId, commentId) {
    return api.delete(`/comments/post/${postId}/${commentId}`);
  },

  /*
      * Create a new comment to a comment.
      *
      * @param {string} parentCommentId The ID of the comment to add the comment to.
      * @param {object} formData The data for the new comment.
    */
  async addCommentToComment(parentCommentId, formData) {
    return api.post(`/comments/comment/${parentCommentId}/replies`, formData);
  },

  /*
    * Delete a comment from a comment.
    *
    * @param {string} parentCommentId The ID of the comment to delete the comment from.
    * @param {string} commentId The ID of the comment to delete.
  */
  async deleteCommentFromComment(parentCommentId, commentId) {
    return api.delete(`/comments/comment/${parentCommentId}/replies/${commentId}`);
  }

}