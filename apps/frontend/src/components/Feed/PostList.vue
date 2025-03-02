<template>
    <ion-content>
      <post-form-modal v-if="isPostFormModalOpen" @close="closePostFormModal" :post="selectedPost" :current-user="currentUser" />
      <ion-list class="ion-padding">
        <post-filter-button v-if="$route.fullPath.includes('feed')" class="ion-margin-bottom ion-text-end" @update:selectedTags="updateSelectedTags" @update:selectedTriggers="updateSelectedTriggers"></post-filter-button>

        <ion-item
          class="ion-margin-bottom"
          lines="none"
          v-for="post in filteredPosts"
          :key="post.id"
          @click="editPost(post)"
        >
          <ion-grid>
            <ion-row>
              <ion-col size="10">
                <ion-list v-if="post.tags && post.tags.length > 0 || post.triggers && post.triggers.length > 0" class="ion-padding-bottom">
                  <ion-chip v-for="element in [...post.tags, ...post.triggers]" :key="element.id" class="ion-margin-top">
                    <span class="gradient-text">{{ element.name }}</span>
                  </ion-chip>
                </ion-list>
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
                    <ion-item class="ion-input-spacing" lines="none" :button="true" :detail="false" v-if="post.user.id === currentUser.id" @click="deleteOnePost(post.id)">Supprimer</ion-item>
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
      <ToastMessage />
    </ion-content>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { IonContent, IonList, IonItem, IonButton, IonIcon, IonAvatar, IonButtons, IonGrid, IonCol, IonRow, IonText, IonTextarea, IonPopover, IonChip, IonLabel } from '@ionic/vue';
import PostFormModal from '@/components/Feed/PostFormModal.vue';
import PostCommentModal from '@/components/Feed/PostCommentModal.vue';
import { chatbubbleOutline, heart, heartOutline, trashOutline, ellipsisVerticalOutline } from 'ionicons/icons';
import { usePostStore } from '@/stores/post';
import PostFilterButton from '@/components/Feed/PostFilterButton.vue';
import ToastMessage from '@/components/Commun/ToastMessage.vue'
import { timeSince } from '@/utils/date';

export default defineComponent({
  name: 'PostList',
  components: {
    ToastMessage,
    PostFormModal,
    PostFilterButton,
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
    IonChip,
    IonLabel,
    PostCommentModal
  },
  setup() {
    return { chatbubbleOutline, heart, heartOutline, trashOutline, ellipsisVerticalOutline };
  },
  data() {
    return {
      selectedPostId: null,
      isCommentModalOpen: false,
      isPostFormModalOpen: false,
      selectedTags: [],
      selectedTriggers: []
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
    },
    filteredPosts() {
      return this.posts.filter(post => {
        const hasSelectedTags = this.selectedTags.length === 0 || post.tags.some(tag => this.selectedTags.includes(tag.id));
        const hasSelectedTriggers = this.selectedTriggers.length === 0 || post.triggers.some(trigger => this.selectedTriggers.includes(trigger.id));
        return hasSelectedTags && hasSelectedTriggers;
      });
    }
  },
  methods: {
    timeSince,
    editPost(post) {
      this.selectedPostId = post.id;
      this.isPostFormModalOpen = true;
    },
    async deleteOnePost(postId) {
      await usePostStore().deleteOnePost(postId);
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
    },
    updateSelectedTags(tags) {
      this.selectedTags = tags;
    },
    updateSelectedTriggers(triggers) {
      this.selectedTriggers = triggers;
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