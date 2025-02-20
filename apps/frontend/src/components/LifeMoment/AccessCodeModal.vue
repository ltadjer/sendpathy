<template>
  <ion-modal :is-open="isOpen" :backdrop-dismiss="false">
      <ion-card class="ion-padding ion-no-shadow">
          <ion-label position="stacked">{{ hasAccessCode ? 'Entrer le code d\'accès' : 'Définir un code d\'accès' }}</ion-label>
          <ion-input v-model="accessCode" type="password"></ion-input>
          <div class="ion-text-end">
            <custom-button :text="hasAccessCode ? 'Entrer' : 'Définir'" @click="handleAccessCode"></custom-button>
          </div>
      </ion-card>
  </ion-modal>
</template>

<script>
import {
  IonModal,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButton,
  IonContent,
  IonItem,
  IonLabel,
  IonInput,
  IonCard,
} from '@ionic/vue';
import CustomButton from '@/components/Commun/CustomButton.vue'
import { useAccountStore } from '@/stores/account.ts'

export default {
  name: 'AccessCodeModal',
  components: {
    CustomButton,
    IonModal,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButton,
    IonContent,
    IonItem,
    IonLabel,
    IonInput,
    IonCard,
  },
  props: {
    isOpen: {
      type: Boolean,
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
          const isValid = await useAccountStore().validateAccessCode(this.accessCode);
          if (isValid) {
            this.$emit('access-code-validated');
            this.closeModal();
          } else {
            console.error('Invalid access code');
          }
        } else {
         this.accessCode =  await useAccountStore().setAccessCode(this.accessCode);
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
ion-modal {
  --width: fit-content;
  --height: fit-content;
  --min-width: 350px;
  --max-width: 350px;
  --border-radius: 1rem;
}
</style>
