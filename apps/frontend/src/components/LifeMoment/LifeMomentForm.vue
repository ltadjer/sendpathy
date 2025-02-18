<template>
  <ion-card>
    <ion-card-content>
      <form @submit.prevent="submitLifeMoment">
        <div v-if="contents.length">
          <div v-for="(content, index) in contents" :key="index">
            <div v-if="content.type.startsWith('image/')">
              <img :src="`https://api.sendpathy.aaa${content.fileUrl}`" alt="Image" />
            </div>
            <div v-else-if="content.type.startsWith('video/')">
              <video :src="`https://api.sendpathy.aaa${content.fileUrl}`" controls></video>
            </div>
            <div v-else-if="content.type.startsWith('audio/')">
              <audio :src="`https://api.sendpathy.aaa${content.fileUrl}`" controls></audio>
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
import { IonCard, IonCardContent, IonItem, IonTextarea, IonGrid, IonRow, IonCol } from '@ionic/vue';
import { happyOutline, imageOutline, micOutline, stopOutline } from 'ionicons/icons';
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
    IonRow
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
          console.log('this.contents:', this.contents);
        } else {
          this.resetForm();
        }
      },
    },
  },
  setup() {
    return { happyOutline, imageOutline, micOutline, stopOutline };
  },
  methods: {
    triggerFileInput() {
      this.$refs.fileInput.click();
    },
    onFileChange(event) {
      const file = event.target.files[0];
      if (this.validateFile(file)) {
        this.file = file;
        this.getFileBase64(this.file).then(base64 => {
          this.base64Image = base64;
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
      console.log('emoji:', emoji);
      this.emotion = emoji;
    },
    openEmojiModal() {
      this.isEmojiModalOpen = true;
    },
    async submitLifeMoment() {
      let base64Content = null;
      if (this.file) {
        base64Content = await this.getFileBase64(this.file);
      }

      const newContent = {
        base64Content: base64Content,
        type: this.file ? this.file.type : null,
        content: '', // TODO: remove it from the bdd
        originalName: this.file ? this.file.name : null,
        size: this.file ? this.file.size : null,
        order: this.contents.length + 1
      };

      const formData = {
        content: this.content,
        emotion: this.emotion ? this.emotion : '',
        contents: this.contents ? this.contents : [],
      };
      if(base64Content) {
        formData.contents = [...this.contents, newContent];
      }

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
</style>