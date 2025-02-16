<template>
  <ion-modal
    :is-open="isOpen"
    @did-dismiss="closeModal"
    :initial-breakpoint="isMobile ? 0.75 : undefined"
    :breakpoints="isMobile ?[0, 0.5, 0.75] : undefined"
    handle-behavior="cycle"
  >
    <ion-header v-if="isDesktop">
      <ion-toolbar>
        <ion-title class="ion-text-center gradient-text">Choisir une émotion</ion-title>
        <ion-buttons slot="end">
          <ion-button @click="closeModal">
            <ion-icon :icon="closeOutline"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <ion-grid class="emoji-picker">
        <ion-row>
          <ion-col v-for="(emoji, index) in emojiList" :key="index" size="3">
            <ion-item
              :class="['emoji-item', { 'selected': selectedEmoji === emoji }]"
              @click="selectEmoji(emoji)"
              lines="none"
            >
              <ion-label>{{ emoji }}</ion-label>
            </ion-item>
          </ion-col>
        </ion-row>
      </ion-grid>
    </ion-content>
  </ion-modal>
</template>

<script>
import postService from '@/services/post.service.ts';
import {
  IonModal,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonContent,
  IonGrid,
  IonRow,
  IonCol,
  IonItem,
  IonLabel,
  IonIcon,
} from '@ionic/vue';
import { closeOutline } from 'ionicons/icons';

export default {
  name: 'EmotionsModal',
  components: {
    IonModal,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonButton,
    IonContent,
    IonGrid,
    IonRow,
    IonCol,
    IonItem,
    IonLabel,
    IonIcon,
  },
  props: {
    isOpen: {
      type: Boolean,
      required: true,
    },
    selectedEmoji: {
      type: String,
      default: ''
    }
  },
  setup() {
    return { closeOutline };
  },
  computed: {
    isDesktop() {
      return window.innerWidth >= 768;
    },
    isMobile() {
      return window.innerWidth < 768;
    }
  },
  data() {
    return {
      emojiList: [],
    };
  },
  async mounted() {
    try {
      this.emojiList = await postService.getEmojis();
    } catch (error) {
      console.error('Error fetching emojis:', error);
    }
  },
  methods: {
    selectEmoji(emoji) {
      this.$emit('emoji-selected', emoji);
      this.closeModal();
    },
    closeModal() {
      this.$emit('update:isOpen', false);
    },
  },
};
</script>

<style scoped>
ion-item.emoji-item {
  box-shadow: none !important;
  text-align: center;
  padding: 1rem 0.6rem;
  cursor: pointer;
  font-size: 2rem;
  border-radius: 1rem;
  --background: transparent;
}

ion-item.emoji-item.selected,
ion-item.emoji-item:hover {
  box-shadow: var(--neumorphism-in-shadow) !important;
}

</style>
