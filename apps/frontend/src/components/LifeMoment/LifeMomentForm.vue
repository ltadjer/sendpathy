<template>
  <ion-card class="neumorphic-card">
    <ion-card-header>
      <ion-card-title>{{ lifeMoment ? 'Edit LifeMoment' : 'New LifeMoment' }}</ion-card-title>
    </ion-card-header>
    <ion-card-content>
      <ion-item class="neumorphic-item">
        <ion-label position="floating">Content</ion-label>
        <ion-textarea v-model="content" placeholder="What's on your mind?"></ion-textarea>
      </ion-item>
      <ion-button @click="openEmojiModal" class="neumorphic-button">
        <ion-icon :icon="happyOutline"></ion-icon>
      </ion-button>
      <ion-button expand="full" @click="submitLifeMoment" class="neumorphic-button">{{ lifeMoment ? 'Update' : 'LifeMoment' }}</ion-button>
    </ion-card-content>
  </ion-card>
  <emotions-modal :isOpen="isEmojiModalOpen" @update:isOpen="isEmojiModalOpen = $event" @emoji-selected="updateEmotion"></emotions-modal>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue';
import { IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonItem, IonLabel, IonTextarea, IonButton, IonIcon } from '@ionic/vue';
import EmotionsModal from '@/components/Commun/EmotionsModal.vue';
import { happyOutline } from 'ionicons/icons';
import lifeMomentService from '@/services/lifeMoment.service';

export default defineComponent({
  name: 'LifeMomentForm',
  components: {
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonItem,
    IonLabel,
    IonTextarea,
    IonButton,
    IonIcon,
    EmotionsModal
  },
  props: {
    lifeMoment: Object
  },
  setup() {
    return { happyOutline };
  },
  emits: ['lifeMoment-updated'],
  data() {
    return {
      content: '',
      emotion: '',
      isEmojiModalOpen: false,
    };
  },
  watch: {
    lifeMoment: {
      immediate: true,
      handler(newLifeMoment) {
        if (newLifeMoment) {
          this.content = newLifeMoment.content;
          this.emotion = newLifeMoment.emotion;
        } else {
          this.resetForm();
        }
      }
    }
  },
  methods: {
    async submitLifeMoment() {
      const formData = {
        content: this.content,
        emotion: this.emotion,
      };

      if (this.lifeMoment && this.lifeMoment.id) {
        await lifeMomentService.updateOneLifeMoment(this.lifeMoment.id, formData);
      } else {
        await lifeMomentService.createOneLifeMoment(formData);
      }

      this.resetForm();
      this.$emit('lifeMoment-updated');
    },
    resetForm() {
      this.content = '';
      this.emotion = '';
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