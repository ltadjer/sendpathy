<template>
  <ion-modal :is-open="isOpen" @did-dismiss="closeModal">
    <ion-header>
      <ion-toolbar>
        <ion-title>Select Emoji</ion-title>
        <ion-buttons slot="end">
          <ion-button @click="closeModal">Close</ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <div class="emoji-picker">
        <div v-for="(emoji, index) in emojiList" :key="index" class="emoji-item" @click="selectEmoji(emoji)">
          {{ emoji }}
        </div>
      </div>
    </ion-content>
  </ion-modal>
</template>

<script>
import postService from '@/services/post.service';
import { IonModal, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonContent } from '@ionic/vue';

export default {
  name: 'PostEmotionsModal',
  components: {
    IonModal,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonButton,
    IonContent
  },
  props: {
    isOpen: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      emojiList: [],
    };
  },
  async mounted() {
    try {
      const response = await postService.getEmojis();
      this.emojiList = response;
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
    }
  },
};
</script>

<style scoped>
.emoji-picker {
  display: flex;
  flex-wrap: wrap;
}

.emoji-item {
  width: 33.33%;
  text-align: center;
  padding: 10px;
  cursor: pointer;
}
</style>