import api from './api.service';
import { Emojis } from '@/enums/emojis.enum';


export default {
  /**
   * Fetch all conversations for the logged-in user.
   */
  async fetchAllPosts() {
    const response = await api.get('/posts');
    console.log(response.data);
    return response.data;
  },

  /**
   * Fetch a single post by its ID.
   *
   * @param {string} postId The ID of the post to fetch.
   */

  async fetchOnePostById(postId) {
    const response = await api.get(`/posts/${postId}`);
    return response.data;
  },

  /**
   * Create a new post.
   *
   * @param {object} postData The data for the new post.
   */

  async createOnePost(postData) {
    const response = await api.post('/posts', postData);
    return response.data;
  },

  /**
   * Update an existing post.
   *
   * @param {string} postId The ID of the post to update.
   * @param {object} postData The new data for the post.
   */
  async updateOnePost(postId, postData) {
    const response = await api.patch(`/posts/${postId}`, postData);
    return response.data;
  },

  /**
   * Delete an existing post.
   *
   * @param {string} postId The ID of the post to delete.
   */
  async deleteOnePost(postId) {
    const response = await api.delete(`/posts/${postId}`);
    return response.data;
  },

  /**
   * Add a tag to a post.
   *
   * @param {string} postId The ID of the post to add the tag to.
   * @param {string} tagId The ID of the tag to add to the post.
   */

  async addTagToPost(postId, tagId) {
    const response = await api.post(`/posts/${postId}/tags/${tagId}`);
    return response.data;
  },

  /**
   * Remove a tag from a post.
   *
   * @param {string} postId The ID of the post to remove the tag from.
   * @param {string} tagId The ID of the tag to remove from the post.
   */
  async removeTagFromPost(postId, tagId) {
    const response = await api.delete(`/posts/${postId}/tags/${tagId}`);
    return response.data;
  },

  /**
   * Add a trigger to a post.
   * @param postId The ID of the post to add the trigger to.
   * @param triggerId The ID of the trigger to add to the post.
   */
  async addTriggerToPost(postId, triggerId) {
    const response = await api.post(`/posts/${postId}/triggers/${triggerId}`);
    return response.data;
  },

  /**
   * Remove a trigger from a post.
   * @param postId The ID of the post to remove the trigger from.
   * @param triggerId The ID of the trigger to remove from the post.
   */

  async removeTriggerFromPost(postId, triggerId) {
    const response = await api.delete(`/posts/${postId}/triggers/${triggerId}`);
    return response.data;
  },

  async getEmojis() {
    return Object.values(Emojis);
  }
}
