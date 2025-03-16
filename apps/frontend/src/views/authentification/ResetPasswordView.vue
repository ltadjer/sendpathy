<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button :defaultHref="true" :icon="arrowBackOutline" @click="navigateToLogin" />
        </ion-buttons>
        <ion-title>Réinitialiser du mot de passe</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <ion-grid class="flex-center">
        <ion-row>
          <ion-col class="ion-text-center">
            <img alt="Logo" src="/img/logo-with-shadow.svg" width="140px"/>
            <form @submit.prevent="resetPassword" class="ion-text-start form-container">
              <ion-input placeholder="Mot de passe" type="password" v-model="newPassword" required></ion-input>
              <custom-button expand="block" color="primary" type="submit" text="Envoyer"></custom-button>
            </form>
          </ion-col>
        </ion-row>
      </ion-grid>
      <ToastMessage />
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { IonPage, IonContent, IonGrid, IonRow, IonCol, IonInput, IonButton, IonIcon, IonHeader, IonToolbar, IonTitle, IonBackButton, IonButtons } from '@ionic/vue';
import { arrowBackOutline } from 'ionicons/icons';
import { useAccountStore } from '@/stores/account';
import ToastMessage from '@/components/Commun/ToastMessage.vue';
import CustomButton from '@/components/Commun/CustomButton.vue';

export default defineComponent({
  name: 'ResetPasswordView',
  data() {
    return {
      newPassword: '',
      message: '',
      token: ''
    };
  },
  components: {
    CustomButton,
    ToastMessage,
    IonPage,
    IonContent,
    IonGrid,
    IonRow,
    IonCol,
    IonInput,
    IonButton,
    IonIcon,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonBackButton,
    IonButtons
  },
  setup() {
    return { arrowBackOutline };
  },
  created() {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('token')) {
      this.token = urlParams.get('token');
    }
  },
  methods: {
    async resetPassword() {
      await useAccountStore().resetPassword(this.token, this.newPassword);
    },
    navigateToLogin() {
      this.$router.push('/connexion');
    }
  }
});
</script>