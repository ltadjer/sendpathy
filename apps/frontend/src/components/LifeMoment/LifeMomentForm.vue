<template>
  <ion-card class="neumorphic-card">
    <ion-card-header>
      <ion-card-title>{{ lifeMoment ? 'Edit LifeMoment' : 'New LifeMoment' }}</ion-card-title>
    </ion-card-header>
    <ion-card-content>
      <ion-item class="neumorphic-item">
        <ion-label position="static">Content</ion-label>
        <ion-textarea v-model="content" placeholder="What's on your mind?"></ion-textarea>
      </ion-item>
      <ion-item class="neumorphic-item">
        <ion-label position="static">Image/Video</ion-label>
        <input type="file" @change="onFileChange" accept="image/*,video/*" />
      </ion-item>
      <ion-item class="neumorphic-item">
        <ion-label position="floating">Audio</ion-label>
        <ion-button @click="startRecording" :disabled="isRecording">Start Recording</ion-button>
        <ion-button @click="stopRecording" :disabled="!isRecording">Stop Recording</ion-button>
      </ion-item>
      <ion-button color="primary" @click="openEmojiModal" class="neumorphic-button">
        <ion-icon :icon="happyOutline"></ion-icon>
      </ion-button>
      <ion-button expand="full" @click="submitLifeMoment" class="neumorphic-button">{{ lifeMoment ? 'Update' : 'LifeMoment' }}</ion-button>
    </ion-card-content>
  </ion-card>
  <emotions-modal :isOpen="isEmojiModalOpen" @update:isOpen="isEmojiModalOpen = $event" @emoji-selected="updateEmotion"></emotions-modal>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { IonIcon, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonItem, IonLabel, IonTextarea, IonButton } from '@ionic/vue';
import { useLifeMomentStore } from '@/stores/lifeMoment';
import EmotionsModal from '@/components/Commun/EmotionsModal.vue';
import { happyOutline } from 'ionicons/icons';

export default defineComponent({
  name: 'LifeMomentForm',
  components: {
    IonIcon,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonItem,
    IonLabel,
    IonTextarea,
    IonButton,
    EmotionsModal
  },
  props: {
    lifeMoment: Object
  },
  data() {
    return {
      content: '',
      file: null,
      base64Image: '',
      isRecording: false,
      audioBlob: null,
      mediaRecorder: null,
      isEmojiModalOpen: false,
      contents: [],
    };
  },
  setup() {
    return { happyOutline };
  },
  watch: {
    lifeMoment: {
      immediate: true,
      handler(newLifeMoment) {
        if (newLifeMoment) {
          this.content = newLifeMoment.content;
          this.emotion = newLifeMoment.emotion;
          this.contents = newLifeMoment.contents;
        } else {
          this.resetForm();
        }
      }
    }
  },
  methods: {
    async submitLifeMoment() {
      let base64Content = null;
      if (this.file) {
        base64Content = await this.getFileBase64(this.file);
      }
      const formData = {
        content: this.content,
        emotion: this.emotion ? this.emotion : '',
        contents: [
          {
            base64Content: base64Content,
            type: this.file ? this.file.type : null,
            content: this.content ? this.content : null,
            originalName: this.file ? this.file.name : null,
            size: this.file ? this.file.size : null,
            order: 1
          }
        ]
      };
      if (this.lifeMoment && this.lifeMoment.id) {
        await useLifeMomentStore().updateLifeMoment(this.lifeMoment.id, formData);
      } else {
        await useLifeMomentStore().addLifeMoment(formData);
      }
    },
    onFileChange(event) {
      this.file = event.target.files[0];
      this.getFileBase64(this.file).then(base64 => {
        this.base64Image = base64;
      });
    },
    getFileBase64(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64Content = reader.result.split(',')[1]; // Get the base64 part of the result
          resolve(base64Content);
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    },
    startRecording() {
      navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
          this.mediaRecorder = new MediaRecorder(stream);
          this.mediaRecorder.start();
          this.isRecording = true;

          const audioChunks = [];
          this.mediaRecorder.addEventListener('dataavailable', event => {
            audioChunks.push(event.data);
          });

          this.mediaRecorder.addEventListener('stop', () => {
            this.audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
          });
        });
    },
    stopRecording() {
      this.mediaRecorder.stop();
      this.isRecording = false;
    },
    updateEmotion(emoji) {
      console.log('emoji:', emoji);
      this.emotion = emoji;
    },
    openEmojiModal() {
      this.isEmojiModalOpen = true;
    },
    resetForm() {
      this.content = '';
      this.file = null;
      this.base64Image = '';
      this.isRecording = false;
      this.audioBlob = null;
      this.mediaRecorder = null;
      this.emotion = '';
      this.contents = [];
    }
  },
});
</script>