<template>
  <ion-modal :is-open="isOpen" @did-dismiss="closeModal">
    <ion-header>
      <ion-toolbar>
        <ion-title>{{ hasAccessCode ? 'Enter Access Code' : 'Set Access Code' }}</ion-title>
        <ion-buttons slot="end">
          <ion-button @click="closeModal">Close</ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <ion-item>
        <ion-label position="floating">Access Code</ion-label>
        <ion-input v-model="accessCode" type="password"></ion-input>
      </ion-item>
      <ion-button expand="full" @click="handleAccessCode">{{ hasAccessCode ? 'Enter' : 'Set' }} Access Code</ion-button>
    </ion-content>
  </ion-modal>
</template>

<script>
import { IonModal, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonContent, IonItem, IonLabel, IonInput } from '@ionic/vue';
import authService from '@/services/auth.service.ts'

export default {
  name: 'AccessCodeModal',
  components: {
    IonModal,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonButton,
    IonContent,
    IonItem,
    IonLabel,
    IonInput
  },
  props: {
    isOpen: {
      type: Boolean,
      required: true
    },
    token: {
      type: String,
      required: true
    },
    hasAccessCode: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      accessCode: ''
    };
  },
  methods: {
    async handleAccessCode() {
      try {
        if (this.hasAccessCode) {
          const isValid = await authService.validateAccessCode(this.token, this.accessCode);
          if (isValid) {
            this.$emit('access-code-validated');
            this.closeModal();
          } else {
            console.error('Invalid access code');
          }
        } else {
          await authService.updateAccessCode(this.token, this.accessCode);
          localStorage.setItem('access_code', this.accessCode);
          this.$emit('access-code-set');
          this.closeModal();
        }
      } catch (error) {
        console.error('Error handling access code:', error);
      }
    },
    closeModal() {
      this.$emit('update:isOpen', false);
    }
  }
};
</script>

<style scoped>
/* Add your styles here */
</style>