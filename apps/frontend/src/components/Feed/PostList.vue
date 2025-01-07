<template>
  <ion-page>
    <ion-header :translucent="true" class="ion-padding">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-button size="small" class="ion-no-shadow">
            <ion-avatar>
              <img alt="Silhouette of a person's head" src="https://ionicframework.com/docs/img/demos/avatar.svg" />
            </ion-avatar>
          </ion-button>
        </ion-buttons>
        <ion-title>Feed</ion-title>
        <ion-buttons slot="end">
          <ion-button size="small" class="ion-no-shadow">
            <img alt="Logo" src="@/assets/logo.png" width="70px" />
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <post-form-modal v-if="isPostFormModalOpen" @close="closePostFormModal" :post="selectedPost" />
      <ion-list class="ion-padding" style="background: none;">
        <ion-item class="ion-margin-bottom" lines="none" v-for="post in posts" :key="post.id" @click="editPost(post)">
          <ion-grid>
            <ion-row>
              <ion-col size="2">
                <ion-thumbnail>
                  <img alt="Silhouette of mountains" src="https://ionicframework.com/docs/img/demos/thumbnail.svg" />
                </ion-thumbnail>
              </ion-col>
              <ion-col size="8">
                <p>
                  {{ post.user.username }}
                  <span>{{ post.emotion }}</span>
                </p>
                <p>{{ post.content }}</p>
              </ion-col>
              <ion-col size="auto">
                <ion-button @click.stop="deletePost(post.id)" class="ion-no-shadow">
                  <ion-icon size="medium" :icon="trashOutline"></ion-icon>
                </ion-button>
              </ion-col>
            </ion-row>
            <ion-row>
              <ion-col size="auto">
                <ion-icon class="custom-icon" @click.stop="openCommentModal(post.id)" :icon="chatbubbleOutline"></ion-icon>
              </ion-col>
              <ion-col size="auto">
                <ion-icon class="custom-icon" @click.stop="toggleLike(post)" :icon="post.isLiked ? heart : heartOutline"></ion-icon>
                <span v-if="post.likes">{{ post.likes.length }}</span>
              </ion-col>
            </ion-row>
          </ion-grid>
          <post-comment-modal v-if="isCommentModalOpen" :comments="comments" @close="closeCommentModal" :post-id="selectedPostId"></post-comment-modal>
        </ion-item>
      </ion-list>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonButton, IonIcon, IonAvatar, IonButtons, IonThumbnail, IonGrid, IonCol, IonRow } from '@ionic/vue';
import PostFormModal from '@/components/Feed/PostFormModal.vue';
import PostCommentModal from '@/components/Feed/PostCommentModal.vue';
import { chatbubbleOutline, heart, heartOutline, trashOutline } from 'ionicons/icons';
import { usePostStore } from '@/stores/post';

export default defineComponent({
  name: 'PostList',
  components: {
    PostFormModal,
    IonThumbnail,
    IonPage,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonList,
    IonItem,
    IonButton,
    IonIcon,
    IonAvatar,
    IonButtons,
    IonGrid,
    IonCol,
    IonRow,
    PostCommentModal
  },
  setup() {
    return { chatbubbleOutline, heart, heartOutline, trashOutline };
  },
  data() {
    return {
      selectedPostId: null,
      isCommentModalOpen: false,
      isPostFormModalOpen: false
    };
  },
  props: {
    posts: Array,
  },
  computed: {
    selectedPost() {
      const postStore = usePostStore();
      return postStore.posts.find(post => post.id === this.selectedPostId);
    },
    comments() {
      return this.selectedPost ? this.selectedPost.comments : [];
    }
  },
  methods: {
    editPost(post) {
      this.selectedPostId = post.id;
      this.isPostFormModalOpen = true;
    },
    async deletePost(postId) {
      await usePostStore().deletePost(postId);
    },
    openCommentModal(postId) {
      this.selectedPostId = postId;
      this.isCommentModalOpen = true;
    },
    closeCommentModal() {
      this.isCommentModalOpen = false;
      this.selectedPostId = null;
    },
    async toggleLike(post) {
      if (post.isLiked) {
        await usePostStore().unlikePost(post.id);
        post.isLiked = false;
      } else {
        await usePostStore().likePost(post.id);
        post.isLiked = true;
      }
    },
    closePostFormModal() {
      this.isPostFormModalOpen = false;
      this.selectedPostId = null;
    }
  },
});
</script>