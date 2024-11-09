<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Feed</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <post-form :post="selectedPost" @post-updated="fetchAllPosts"></post-form>
      <ion-list>
        <ion-item v-for="post in posts" :key="post.id" @click="editPost(post)">
          <p>{{ post.content }}</p>
          <ion-button slot="end" color="danger" @click.stop="deletePost(post.id)">Delete</ion-button>
          <ion-button slot="end" @click.stop="openCommentModal(post.id)" class="neumorphic-button">
            <ion-icon :icon="chatbubbleOutline"></ion-icon>
          </ion-button>
          <ion-button slot="end" @click.stop="toggleLike(post)">
            <ion-icon :icon="post.isLiked ? heart : heartOutline"></ion-icon>
            <span>{{ post.likeCount }}</span>
          </ion-button>
          <post-comment-modal v-if="isCommentModalOpen" :comments="comments" @close="closeCommentModal" @update-comments="fetchComments" :post-id="selectedPostId"></post-comment-modal>
        </ion-item>
      </ion-list>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonButton, IonIcon } from '@ionic/vue';
import postService from '@/services/post.service';
import commentService from '@/services/comment.service';
import likeService from '@/services/like.service';
import PostForm from '@/components/Feed/PostForm.vue';
import PostCommentModal from '@/components/Feed/PostCommentModal.vue';
import { chatbubbleOutline, heart, heartOutline } from 'ionicons/icons';

export default defineComponent({
  name: 'PostList',
  components: {
    IonPage,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonList,
    IonItem,
    IonButton,
    IonIcon,
    PostForm,
    PostCommentModal
  },
  setup() {
    return { chatbubbleOutline, heart, heartOutline };
  },
  data() {
    return {
      selectedPost: null,
      isCommentModalOpen: false,
      selectedPostId: null,
      comments: []
    };
  },
  props: {
    posts: Array,
    comments: Array
  },
  methods: {
    editPost(post) {
      this.selectedPost = post;
    },
    async deletePost(postId) {
      await postService.deleteOnePost(postId);
    },
    async openCommentModal(postId) {
      this.selectedPostId = postId;
      this.selectedPost = this.posts.find(post => post.id === postId);
      console.log('this.selectedPostId',this.selectedPostId);
      this.isCommentModalOpen = true;
      this.comments = this.selectedPost.comments;
    },
    closeCommentModal() {
      this.isCommentModalOpen = false;
      this.selectedPostId = null;
      this.comments = [];
    },
    async fetchComments() {
      const updatedPost = await postService.fetchOnePostById(this.selectedPostId);
      this.comments = updatedPost.comments;
    },
    async toggleLike(post) {
      if (post.isLiked) {
        await likeService.unlikePost(post.id);
        post.isLiked = false;
      } else {
        await likeService.likePost(post.id);
        post.isLiked = true;
      }
      this.likeCount = await likeService.countPostLikes(post.id);
    }
  },
});
</script>