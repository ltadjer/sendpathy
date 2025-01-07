<template>
  <ion-card class="ion-no-padding">
    <ion-card-content>
      <ion-item class="ion-no-shadow" lines="none">
        <ion-thumbnail slot="start">
          <img alt="Silhouette of mountains" src="https://ionicframework.com/docs/img/demos/thumbnail.svg" />
        </ion-thumbnail>
        <ion-textarea v-model="content" placeholder="Qu'est-ce qui te tracasse ?"></ion-textarea>
      </ion-item>
      <ion-grid>
        <ion-row class="ion-justify-content-center">
          <ion-col size="auto">
            <img alt="img" src="/img/fond-sendpathy.svg" class="image" />
          </ion-col>
        </ion-row>
        <ion-row>
          <ion-col size="10">
            <ion-button color="primary" @click="openEmojiModal">
              <ion-icon :icon="happyOutline" class="gradient-icon" color="secondary"></ion-icon>
            </ion-button>
            <ion-button @click="openSettingsModal">
              <ion-icon :icon="optionsOutline" class="gradient-icon"></ion-icon>
            </ion-button>
          </ion-col>
          <ion-col size="2" class="ion-text-right">
            <ion-button @click="submitPost">
              <ion-icon :icon="paperPlaneOutline"></ion-icon>
            </ion-button>
          </ion-col>
        </ion-row>
      </ion-grid>
    </ion-card-content>
  </ion-card>
  <post-settings-modal v-if="isSettingsModalOpen" @close="closeSettingsModal" @update:selectedTags="updateSelectedTags" @update:selectedTriggers="updateSelectedTriggers" :selectedTags="selectedTags" :selectedTriggers="selectedTriggers"></post-settings-modal>
  <emotions-modal :isOpen="isEmojiModalOpen" @update:isOpen="isEmojiModalOpen = $event" @emoji-selected="updateEmotion"></emotions-modal>
</template>
<script lang="ts">
import { defineComponent, ref, watch } from 'vue';
import { IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonItem, IonLabel, IonTextarea, IonInput, IonButton, IonIcon, IonGrid, IonCol, IonRow, IonThumbnail } from '@ionic/vue';
import PostSettingsModal from '@/components/Feed/PostSettingsModal.vue';
import EmotionsModal from '@/components/Commun/EmotionsModal.vue';
import { happyOutline, optionsOutline, paperPlaneOutline } from 'ionicons/icons';
import { usePostStore } from '@/stores/post';
export default defineComponent({
  name: 'PostForm',
  components: {
    IonThumbnail,
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
    return { happyOutline, optionsOutline, paperPlaneOutline };
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
        await usePostStore().updatePost(this.post.id, formData);
        postId = this.post.id;
      } else {
        const response = await usePostStore().addPost(formData);
        postId = response.id;
      }

      await Promise.all([
        ...this.selectedTags.map(tagId => usePostStore().addTagToPost(postId, tagId)),
        ...this.selectedTriggers.map(triggerId => usePostStore().addTriggerToPost(postId, triggerId))
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

</style>