<template>
  <ion-card>
    <ion-card-header>
      <ion-card-title>{{ post ? 'Edit Post' : 'New Post' }}</ion-card-title>
    </ion-card-header>
    <ion-card-content>
      <ion-item>
        <ion-label position="floating">Content</ion-label>
        <ion-textarea v-model="content" placeholder="What's on your mind?"></ion-textarea>
      </ion-item>
      <ion-item>
        <ion-label position="floating">Emotion</ion-label>
        <ion-input v-model="emotion" placeholder="Emotion"></ion-input>
      </ion-item>
      <ion-button expand="full" @click="openSettingsModal">
        <ion-icon name="settings-outline"></ion-icon>
      </ion-button>
      <ion-button expand="full" @click="submitPost">{{ post ? 'Update' : 'Post' }}</ion-button>

    </ion-card-content>
  </ion-card>
  <post-settings-modal v-if="isSettingsModalOpen" @close="closeSettingsModal" @update:selectedTags="updateSelectedTags" @update:selectedTriggers="updateSelectedTriggers" :selectedTags="selectedTags" :selectedTriggers="selectedTriggers"></post-settings-modal>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue';
import { IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonItem, IonLabel, IonTextarea, IonInput, IonButton, IonIcon } from '@ionic/vue';
import postService from '@/services/post.service';
import PostSettingsModal from '@/components/Feed/PostSettingsModal.vue';

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
    PostSettingsModal
  },
  props: {
    post: Object
  },
  emits: ['post-updated'],
  data() {
    return {
      content: '',
      originalLanguage: 'en',
      emotion: '',
      isSettingsModalOpen: false,
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
    }
  },
});
</script>