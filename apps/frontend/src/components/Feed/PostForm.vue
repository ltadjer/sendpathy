<template>
  <ion-card class="neumorphic-card">
    <ion-card-header>
      <ion-card-title>{{ post ? 'Edit Post' : 'New Post' }}</ion-card-title>
    </ion-card-header>
    <ion-card-content>
      <ion-item class="neumorphic-item">
        <ion-label position="floating">Content</ion-label>
        <ion-textarea v-model="content" placeholder="What's on your mind?"></ion-textarea>
      </ion-item>
        <ion-button @click="openEmojiModal" class="neumorphic-button">
          <ion-icon :icon="happyOutline"></ion-icon>
        </ion-button>
      <ion-button @click="openSettingsModal" class="neumorphic-button">
        <ion-icon :icon="settingsOutline"></ion-icon>
      </ion-button>
      <ion-button expand="full" @click="submitPost" class="neumorphic-button">{{ post ? 'Update' : 'Post' }}</ion-button>
    </ion-card-content>
  </ion-card>
  <post-settings-modal v-if="isSettingsModalOpen" @close="closeSettingsModal" @update:selectedTags="updateSelectedTags" @update:selectedTriggers="updateSelectedTriggers" :selectedTags="selectedTags" :selectedTriggers="selectedTriggers"></post-settings-modal>
  <emotions-modal :isOpen="isEmojiModalOpen" @update:isOpen="isEmojiModalOpen = $event" @emoji-selected="updateEmotion"></emotions-modal>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue';
import { IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonItem, IonLabel, IonTextarea, IonInput, IonButton, IonIcon, IonGrid, IonCol, IonRow } from '@ionic/vue';
import postService from '@/services/post.service';
import PostSettingsModal from '@/components/Feed/PostSettingsModal.vue';
import EmotionsModal from '@/components/Commun/EmotionsModal.vue';
import { happyOutline, settingsOutline } from 'ionicons/icons';

export default defineComponent({
  name: 'PostForm',
  components: {
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonItem,
    IonLabel,
    IonTextarea,
    IonInput,
    IonButton,
    IonIcon,
    IonGrid,
    IonCol,
    IonRow,
    PostSettingsModal,
    EmotionsModal
  },
  props: {
    post: Object
  },
  setup() {
    return { happyOutline, settingsOutline };
  },
  emits: ['post-updated'],
  data() {
    return {
      content: '',
      originalLanguage: 'en',
      emotion: '',
      isSettingsModalOpen: false,
      isEmojiModalOpen: false,
      selectedTags: [],
      selectedTriggers: []
    };
  },
  watch: {
    post: {
      immediate: true,
      handler(newPost) {
        if (newPost) {
          this.content = newPost.content;
          this.originalLanguage = newPost.originalLanguage;
          this.emotion = newPost.emotion;
          this.selectedTags = newPost.tags || [];
          this.selectedTriggers = newPost.triggers || [];
        } else {
          this.resetForm();
        }
      }
    }
  },
  methods: {
    async submitPost() {
      const formData = {
        content: this.content,
        originalLanguage: this.originalLanguage,
        emotion: this.emotion,
      };

      let postId;
      if (this.post && this.post.id) {
        await postService.updateOnePost(this.post.id, formData);
        postId = this.post.id;
      } else {
        const response = await postService.createOnePost(formData);
        postId = response.id;
      }

      await Promise.all([
        ...this.selectedTags.map(tagId => postService.addTagToPost(postId, tagId)),
        ...this.selectedTriggers.map(triggerId => postService.addTriggerToPost(postId, triggerId))
      ]);

      this.resetForm();
      this.$emit('post-updated');
    },
    resetForm() {
      this.content = '';
      this.originalLanguage = 'en';
      this.emotion = '';
      this.slug = '';
      this.selectedTags = [];
      this.selectedTriggers = [];
    },
    openSettingsModal() {
      this.isSettingsModalOpen = true;
    },
    closeSettingsModal() {
      this.isSettingsModalOpen = false;
    },
    updateSelectedTags(tags) {
      this.selectedTags = tags;
    },
    updateSelectedTriggers(triggers) {
      this.selectedTriggers = triggers;
    },
    updateEmotion(emoji) {
      console.log('emoji:', emoji);
      this.emotion = emoji;
    },
    openEmojiModal() {
      this.isEmojiModalOpen = true;
    }
  },
});
</script>
<style scoped>
.neumorphic-card {
  border-radius: 20px;
  background: #e0e0e0;
  box-shadow: 20px 20px 60px #bebebe, -20px -20px 60px #ffffff;
}

.neumorphic-item {
  border-radius: 10px;
  background: #e0e0e0;
  box-shadow: inset 5px 5px 10px #bebebe, inset -5px -5px 10px #ffffff;
  margin-bottom: 20px;
}

.neumorphic-button {
  border-radius: 10px;
  background: #e0e0e0;
  box-shadow: 5px 5px 10px #bebebe, -5px -5px 10px #ffffff;
  margin: 10px 0;
}
</style>