<template>
  <ion-card>
    <ion-card-content>
      <form @submit.prevent="submitLifeMoment">
        <div v-if="contents.length" :class="`media-grid media-count-${contents.length}`">
          <div v-for="(content, index) in contents" :key="index" class="media-item">
            <div v-if="content.type.startsWith('image/')">
              <img :src="getImageUrl(content)" alt="Image" class="media-content" />
              <ion-buttons class="delete-icon">
                <custom-button @button-click="deleteOneContent(content, index)" :icon="closeOutline"></custom-button>
              </ion-buttons>
            </div>
            <div v-else-if="content.type.startsWith('video/')">
              <video :src="`https://api.sendpathy.aaa${content.fileUrl}`" controls class="media-content"></video>
              <ion-icon name="close-circle" class="delete-icon" @click="deleteOneContent(index)"></ion-icon>
            </div>
            <div v-else-if="content.type.startsWith('audio/')">
              <audio :src="`https://api.sendpathy.aaa${content.fileUrl}`" controls class="media-content"></audio>
              <ion-icon name="close-circle" class="delete-icon" @click="deleteOneContent(index)"></ion-icon>
            </div>
          </div>
        </div>
        <ion-item class="ion-no-shadow" lines="none">
          <ion-textarea v-model="content" placeholder="Comment te sens-tu aujourd'hui?" class="custom-textarea" rows="5"></ion-textarea>
        </ion-item>
        <ion-grid>
          <ion-row>
            <ion-col size="8">
              <custom-button :icon="happyOutline" @click="openEmojiModal"></custom-button>
              <custom-button :icon="imageOutline" @click="triggerFileInput"></custom-button>
              <input type="file" ref="fileInput" @change="onFileChange" accept="image/*,video/*" style="display: none;" />
              <custom-button :icon="isRecording ? stopOutline : micOutline" @click="toggleRecording"></custom-button>
            </ion-col>
            <ion-col size="4" class="ion-text-end">
              <custom-button text="Partager" type="submit"></custom-button>
            </ion-col>
          </ion-row>
        </ion-grid>
      </form>
    </ion-card-content>
  </ion-card>
  <emotions-modal :isOpen="isEmojiModalOpen" @update:isOpen="isEmojiModalOpen = $event" @emoji-selected="updateEmotion" :selected-emoji="emotion"></emotions-modal>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { IonCard, IonCardContent, IonItem, IonTextarea, IonGrid, IonRow, IonCol, IonIcon } from '@ionic/vue';
import { happyOutline, imageOutline, micOutline, stopOutline, closeOutline } from 'ionicons/icons';
import CustomButton from '@/components/Commun/CustomButton.vue';
import EmotionsModal from '@/components/Commun/EmotionsModal.vue';
import { useLifeMomentStore } from '@/stores/life-moment';

export default defineComponent({
  name: 'LifeMomentForm',
  components: {
    IonCol,
    CustomButton,
    IonCard,
    IonCardContent,
    IonItem,
    IonTextarea,
    EmotionsModal,
    IonGrid,
    IonRow,
    IonIcon
  },
  props: {
    lifeMoment: Object
  },
  data() {
    return {
      content: '',
      emotion: '',
      file: null,
      base64Image: '',
      isRecording: false,
      audioBlob: null,
      mediaRecorder: null,
      isEmojiModalOpen: false,
      contents: [],
      isFileInputTriggered: false,
    };
  },
  watch: {
    lifeMoment: {
      immediate: true,
      handler(newVal) {
        if(newVal) {
          this.content = newVal.content;
          this.emotion = newVal.emotion;
          this.contents = newVal.contents || [];
        } else {
          this.resetForm();
        }
      },
    },
  },
  setup() {
    return { happyOutline, imageOutline, micOutline, stopOutline, closeOutline };
  },
  emits: ['close', 'button-click'],
  methods: {
    triggerFileInput() {
      if (!this.isFileInputTriggered && this.$refs.fileInput) {
        this.isFileInputTriggered = true;
        this.$refs.fileInput.click();
      }
    },
    onFileChange(event) {
      this.isFileInputTriggered = false;
      const file = event.target.files[0];
      if (this.validateFile(file)) {
        this.file = file;
        this.getFileBase64(this.file).then(base64 => {
          this.base64Image = base64;
          this.contents.push({
            type: file.type,
            content: '',
            base64Content: base64,
            originalName: file.name,
            size: file.size,
            order: this.contents.length + 1
          });
        });
      }
    },
    validateFile(file) {
      const allowedTypes = ['image/png', 'image/jpeg', 'video/mp4', 'audio/mpeg'];
      const maxSize = 10 * 1024 * 1024; // 10 MB

      if (!allowedTypes.includes(file.type)) {
        alert('Invalid file type');
        return false;
      }

      if (file.size > maxSize) {
        alert('File size exceeds the maximum limit of 10 MB');
        return false;
      }

      return true;
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
    getImageUrl(content) {
      if (content.fileUrl && content.fileUrl.startsWith('/uploads')) {
        return `https://api.sendpathy.aaa${content.fileUrl}`;
      }
      return `data:${content.type};base64,${content.base64Content}`;
    },
    toggleRecording() {
      if (this.isRecording) {
        this.stopRecording();
      } else {
        this.startRecording();
      }
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
      this.emotion = emoji;
    },
    openEmojiModal() {
      this.isEmojiModalOpen = true;
    },
    async deleteOneContent(content, index) {
      if (content.id) {
        await useLifeMomentStore().deleteOneContent(content.id);
        const updatedLifeMoment = await useLifeMomentStore().fetchOneLifeMomentById(this.lifeMoment.id);
        this.contents = updatedLifeMoment.contents;
      } else {
        this.contents.splice(index, 1);
      }
    },
    async submitLifeMoment() {
      const formData = {
        content: this.content,
        emotion: this.emotion ? this.emotion : '',
        contents: this.contents ? this.contents : [],
      };

      if (this.lifeMoment && this.lifeMoment.id) {
        await useLifeMomentStore().updateOneLifeMoment(this.lifeMoment.id, formData);
      } else {
        await useLifeMomentStore().createOneLifeMoment(formData);
      }

      this.resetForm();
      this.$emit('close');
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
  padding: 1rem;
}

.media-grid {
  display: grid;
  gap: 8px;
  width: 100%;
}
.media-count-1 {
  grid-template-columns: 1fr;
}

.media-count-2, .media-count-3, .media-count-4, .media-count-5,
.media-count-6, .media-count-7, .media-count-8, .media-count-9, .media-count-10 {
  grid-template-columns: repeat(2, 1fr);
}

.media-count-3 {
  grid-template-rows: auto auto;
}

.media-count-4, .media-count-5 {
  grid-template-rows: 1fr 1fr;
}

.media-item {
  position: relative;
}
.media-content {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 1rem;
  box-shadow: var(--neumorphism-out-shadow);
  padding: 6px;
}

.media-content img {
  border-radius: 1rem;
}

.delete-icon {
  position: absolute;
  top: 1rem;
  right: 1rem;
}
</style>