import { defineStore } from 'pinia';
import PostService from '@/services/post.service';
import commentService from '@/services/comment.service'
import likeService from '@/services/like.service'
import { useToastStore } from './toast';

export const usePostStore = defineStore('post', {
  state: () => ({
    posts: [] as Array<any>,
  }),
  actions: {
    async fetchAllPosts() {
      try {
        this.posts = await PostService.fetchAllPosts();
      } catch (error) {
        console.error('Failed to fetch posts:', error);
      }
    },
    async fetchOnePostById(postId: string) {
      try {
        await PostService.fetchOnePostById(postId);
        const index = this.posts.findIndex((l) => l.id === postId);
        this.posts[index] = response.data;
      } catch (error) {
        console.error('Failed to fetch post:', error);
      }
    },
    async createOnePost(post: any) {
      const toastStore = useToastStore();
      try {
        const response = await PostService.createOnePost(post);
        if(response && response.status === 201) {
          this.posts.push(response.data);
          toastStore.showToast('Post créé avec succès', 'primary');
          return response.data;
        } else {
          toastStore.showToast('Échec de la création du post', 'danger');
        }
      } catch (error) {
        toastStore.showToast('Une error est survenue, veuillez réessayer', 'danger');
        console.error('Failed to add post:', error);
      }
    },
    async updateOnePost(id: string, post: any) {
      const toastStore = useToastStore();
      try {
        const response = await PostService.updateOnePost(id, post);
        if(response && response.status === 200) {
          const index = this.posts.findIndex((l) => l.id === id);
          this.posts[index] = response.data;
          toastStore.showToast('Post mis à jour avec succès', 'primary');
        } else {
          toastStore.showToast('Échec de la mise à jour du post', 'danger');
        }
      } catch (error) {
        toastStore.showToast('Une error est survenue, veuillez réessayer', 'danger');
        console.error('Failed to update post:', error);
      }
    },
    async deleteOnePost(id: string) {
      try {
        await PostService.deleteOnePost(id);
        this.posts = this.posts.filter((l) => l.id !== id);
      } catch (error) {
        console.error('Failed to delete post:', error);
      }
    },
    async addTagToPost(postId: string, tagId: string) {
      try {
        return await PostService.addTagToPost(postId, tagId);
      } catch (error) {
        console.error('Failed to add tag to post:', error);
      }
    },
    async removeTagFromPost(postId: string, tagId: string) {
      try {
        return await PostService.removeTagFromPost(postId, tagId);
      } catch (error) {
        console.error('Failed to remove tag from post:', error);
      }
    },
    async addTriggerToPost(postId: string, triggerId: string) {
      try {
        return await PostService.addTriggerToPost(postId, triggerId);
      } catch (error) {
        console.error('Failed to add trigger to post:', error);
      }
    },
    async removeTriggerFromPost(postId: string, triggerId: string) {
      try {
        return await PostService.removeTriggerFromPost(postId, triggerId);
      } catch (error) {
        console.error('Failed to remove trigger from post:', error);
      }
    },
    async getEmojis() {
      try {
        return await PostService.getEmojis();
      } catch (error) {
        console.error('Failed to get emojis:', error);
      }
    },
    async addCommentToPost(postId: string, formData: any) {
      try {
        const response = await commentService.addCommentToPost(postId, formData);
        this.posts = this.posts.map(post => {
          if (post.id === postId) {
            post.comments.push(response.data);
          }
          return post;
        });
      } catch (error) {
        console.error('Failed to add comment to post:', error);
      }
    },
    async deleteCommentFromPost(postId: string, commentId: string) {
      try {
        await commentService.deleteCommentFromPost(postId, commentId);
        this.posts = this.posts.map(post => {
          if (post.id === postId) {
            post.comments = post.comments.filter(comment => comment.id !== commentId);
          }
          return post;
        });
      } catch (error) {
        console.error('Failed to delete comment from post:', error);
      }
    },
    async addCommentToComment(parentCommentId: string, formData: any) {
      try {
        const response = await commentService.addCommentToComment(parentCommentId, formData);
        this.posts = this.posts.map(post => {
          post.comments = this.addCommentRecursive(post.comments, parentCommentId, response.data);
          return post;
        });
      } catch (error) {
        console.error('Failed to add comment to comment:', error);
      }
    },

    addCommentRecursive(comments: any[], parentCommentId: string, newComment: any): any[] {
      return comments.map(comment => {
        if (comment.id === parentCommentId) {
          comment.replies = [...(comment.replies || []), newComment];
        } else if (comment.replies && comment.replies.length > 0) {
          comment.replies = this.addCommentRecursive(comment.replies, parentCommentId, newComment);
        }
        return comment;
      });
    },
    async deleteCommentFromComment(parentCommentId: string, commentId: string) {
      try {
        await commentService.deleteCommentFromComment(parentCommentId, commentId);
        this.posts.forEach(post => {
          post.comments = this.removeCommentRecursive(post.comments, commentId);
        });
      } catch (error) {
        console.error('Failed to delete comment from comment:', error);
      }
    },

    removeCommentRecursive(comments: any[], commentId: string): any[] {
      return comments.map(comment => {
        if (comment.id === commentId) {
          return null;
        }
        if (comment.replies && comment.replies.length > 0) {
          comment.replies = this.removeCommentRecursive(comment.replies, commentId);
        }
        return comment;
      }).filter(comment => comment !== null);
    },

    async likePost(postId: string) {
      try {
        const response = await likeService.likePost(postId);
        this.posts.map(post => {
          if (post.id === postId) {
            post.likes.push(response.data);
          }
        });
      } catch (error) {
        console.error('Failed to like post:', error);
      }
    },
    async unlikePost(postId: string) {
      try {
        await likeService.unlikePost(postId);
        this.posts.map(post => {
          if (post.id === postId) {
            post.likes = post.likes.filter(like => like.postId !== postId);
          }
        });
      } catch (error) {
        console.error('Failed to unlike post:', error);
      }
    },
    async likeComment(commentId: string) {
      try {
        const response = await likeService.likeComment(commentId);
        this.posts.map(post => {
          post.comments.map(comment => {
            if (comment.id === commentId) {
              comment.likes.push(response.data);
            }
          });
        })
      } catch (error) {
        console.error('Failed to like comment:', error);
      }
    },
    async unlikeComment(commentId: string) {
      try {
        await likeService.unlikeComment(commentId);
        this.posts.map(post => {
          post.comments.map(comment => {
            if (comment.id === commentId) {
              comment.likes = comment.likes.filter(like => like.commentId !== commentId);
            }
          });
        });
      } catch (error) {
        console.error('Failed to unlike comment:', error);
      }
    }
  },
});