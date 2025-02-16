<template>
  <ion-page>
    <ion-header :translucent="true" class="ion-padding header-page">
      <ion-toolbar>
        <ion-item lines="none" class="ion-no-shadow ion-align-items-center">
          <div class="avatar-container">
            <ion-avatar slot="start">
              <img alt="User Avatar" :src="currentUser?.avatar" />
            </ion-avatar>
          </div>
          <ion-title>Feed</ion-title>
        </ion-item>
        <ion-buttons slot="end">
          <ion-button size="small" class="ion-no-shadow">
            <img alt="Logo" src="@/assets/logo.png" width="50px" />
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <post-form-modal v-if="isPostFormModalOpen" @close="closePostFormModal" :post="selectedPost" :current-user="currentUser" />
      <ion-list class="ion-padding" style="background: none;">
        <ion-item
          class="ion-margin-bottom"
          lines="none"
          v-for="post in posts"
          :key="post.id"
          @click="editPost(post)"
        >
          <ion-grid>
            <ion-row>
              <ion-col size="10">
                <ion-item lines="none" class="ion-no-shadow ion-align-items-start">
                  <div class="avatar-container">
                    <ion-avatar slot="start">
                      <img alt="User Avatar" :src="post.user.avatar" class="avatar-option" />
                    </ion-avatar>
                  </div>
                  <div>
                    <ion-text>
                      {{ post.user.username }}
                      <span>{{ post.emotion }}</span>
                    </ion-text>
                    <p>
                      <ion-textarea
                        class="ion-margin-top"
                        :auto-grow="true"
                        :value="post.content"
                      >
                      </ion-textarea>
                    </p>
                  </div>
                </ion-item>
              </ion-col>
              <ion-col size="2" class="ion-text-end">
                <ion-icon class="custom-icon"
                          :id="'popover-button-' + post.id"
                          @click.stop :icon="ellipsisVerticalOutline"></ion-icon>

                <ion-popover
                  :trigger="'popover-button-' + post.id"
                  :dismiss-on-select="true"
                  side="top"
                  alignment="end"
                >
                  <ion-list>
                    <ion-item class="ion-input-spacing" lines="none" :button="true" :detail="false" v-if="post.user.id === currentUser.id" @click="deletePost(post.id)">Supprimer</ion-item>
                    <ion-item lines="none" :button="true" :detail="false" @click="reportPost(post.id)">Signaler</ion-item>
                  </ion-list>
                </ion-popover>
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
              <ion-col class="ion-text-end">
                <ion-text>{{ timeSince(post.createdAt) }}</ion-text>
              </ion-col>
            </ion-row>
          </ion-grid>
        </ion-item>
        <post-comment-modal v-if="isCommentModalOpen" :comments="comments" @close="closeCommentModal" :post-id="selectedPostId" :current-user="currentUser"></post-comment-modal>
      </ion-list>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonButton, IonIcon, IonAvatar, IonButtons, IonGrid, IonCol, IonRow, IonText, IonTextarea, IonPopover } from '@ionic/vue';
import PostFormModal from '@/components/Feed/PostFormModal.vue';
import PostCommentModal from '@/components/Feed/PostCommentModal.vue';
import { chatbubbleOutline, heart, heartOutline, trashOutline, ellipsisVerticalOutline } from 'ionicons/icons';
import { usePostStore } from '@/stores/post';

export default defineComponent({
  name: 'PostList',
  components: {
    PostFormModal,
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
    IonText,
    IonTextarea,
    IonPopover,
    PostCommentModal
  },
  setup() {
    return { chatbubbleOutline, heart, heartOutline, trashOutline, ellipsisVerticalOutline };
  },
  data() {
    return {
      selectedPostId: null,
      isCommentModalOpen: false,
      isPostFormModalOpen: false
    };
  },
  props: {
    posts: {
      type: Array,
      required: true
    },
    currentUser: {
      type: Object,
      required: true
    }
  },
  computed: {
    selectedPost() {
      const postStore = usePostStore();
      return postStore.posts.find(post => post.id === this.selectedPostId);
    },
    comments() {
      return this.selectedPost ? this.selectedPost.comments.slice().sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()) : [];
    }
  },
  methods: {
    timeSince(date) {
      const now = new Date();
      const createdAt = new Date(date);
      const diffInSeconds = Math.floor((now - createdAt) / 1000);

      const minutes = Math.floor(diffInSeconds / 60);
      const hours = Math.floor(diffInSeconds / 3600);
      const days = Math.floor(diffInSeconds / 86400);

      if (days > 0) {
        return ` ${days} j`;
      } else if (hours > 0) {
        return `${hours} h`;
      } else {
        return `${minutes} min`;
      }
    },
    editPost(post) {
      this.selectedPostId = post.id;
      this.isPostFormModalOpen = true;
    },
    async deletePost(postId) {
      await usePostStore().deletePost(postId);
    },
    async reportPost(postId) {
      // Add your report post logic here
      console.log(`Reported post with id: ${postId}`);
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

<style scoped>
ion-grid {
  padding: 1rem;
}

ion-item:not(ion-popover ion-item) {
  --padding-start: 0px;
  --inner-padding-end: 0px;
}


ion-popover ion-list {
  padding: 4px !important;
  box-shadow: var(--neumorphism-out-shadow) !important;
}

ion-popover ion-item:hover {
  --box-shadow: var(--neumorphism-in-shadow) !important;
  color: var(--ion-color-secondary) !important;
  font-weight: bold;
}

</style>