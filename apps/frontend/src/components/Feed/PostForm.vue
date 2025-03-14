<template>
  <ion-card class="ion-no-padding">
    <ion-card-content>
      <form @submit.prevent="submitPost">
        <ion-item class="ion-no-shadow ion-align-items-start" lines="none">
          <div class="avatar-container">
            <ion-avatar slot="start">
              <img alt="User Avatar" :src="currentUser?.avatar" class="avatar-option" />
            </ion-avatar>
          </div>
          <ion-textarea
            v-model="content"
            placeholder="Qu'est-ce qui te tracasse ?"
            class="custom-textarea"
            rows="5"
          ></ion-textarea>
        </ion-item>
        <ion-grid>
          <ion-row>
            <ion-col size="8">
              <custom-button :icon="happyOutline" @click="openEmojiModal"></custom-button>
              <custom-button :icon="optionsOutline" @click="openSettingsModal"></custom-button>
            </ion-col>
            <ion-col size="4" class="ion-text-right">
              <custom-button text="Publier" type="submit"></custom-button>
            </ion-col>
          </ion-row>
        </ion-grid>
      </form>
    </ion-card-content>
  </ion-card>

  <post-settings-modal
    :isOpen="isSettingsModalOpen"
    @update:isOpen="isSettingsModalOpen = $event"
    @update:selectedTags="updateSelectedTags"
    @update:selectedTriggers="updateSelectedTriggers"
    :selectedTags="selectedTags"
    :selectedTriggers="selectedTriggers"
    :post-id="post?.id || ''"
  ></post-settings-modal>

  <emotions-modal
    :isOpen="isEmojiModalOpen"
    @update:isOpen="isEmojiModalOpen = $event"
    @emoji-selected="updateEmotion"
    :selected-emoji="emotion"
  ></emotions-modal>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue';
import { IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonItem, IonLabel, IonTextarea, IonInput, IonButton, IonIcon, IonGrid, IonCol, IonRow, IonAvatar } from '@ionic/vue';
import CustomButton from '@/components/Commun/CustomButton.vue';
import PostSettingsModal from '@/components/Feed/PostSettingsModal.vue';
import EmotionsModal from '@/components/Commun/EmotionsModal.vue';
import { happyOutline, optionsOutline, paperPlaneOutline } from 'ionicons/icons';
import { usePostStore } from '@/stores/post';

export default defineComponent({
  name: 'PostForm',
  components: {
    IonAvatar,
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
    EmotionsModal,
    CustomButton
  },
  props: {
    post: {
      type: Object,
      required: true
    },
    currentUser: {
      type: Object,
      required: true
    }
  },
  setup() {
    return { happyOutline, optionsOutline, paperPlaneOutline };
  },
  emits: ['post-updated', 'close'],
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
        await usePostStore().updateOnePost(this.post.id, formData);
        postId = this.post.id;
      } else {
        const newPost = await usePostStore().createOnePost(formData);
        await Promise.all([
          ...this.selectedTags.map(tagId => usePostStore().addTagToPost(newPost.id, tagId)),
          ...this.selectedTriggers.map(triggerId => usePostStore().addTriggerToPost(newPost.id, triggerId))
        ]);
        await usePostStore().fetchAllPosts();
      }
      this.resetForm();
      this.$emit('close');
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
      this.emotion = emoji;
    },
    openEmojiModal() {
      this.isEmojiModalOpen = true;
    }
  },
});
</script>

<style scoped>
ion-item {
  --padding-start: 0px;
  --inner-padding-end: 0px;
}

.custom-textarea {
  background-image: url('/img/fond-sendpathy.svg');
  background-size: cover;
  background-position: center;
  height: 300px;
  resize: none;
}

.custom-textarea textarea {
  padding: 1rem;
}

.avatar-option {
  width: 48px;
  height: 48px;
}
</style>
