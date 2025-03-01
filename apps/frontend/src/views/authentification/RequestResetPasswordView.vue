<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button :defaultHref="true" :icon="arrowBackOutline"/>
        </ion-buttons>
        <ion-title>Réinitialiser du mot de passe</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <ion-grid class="flex-center">
        <ion-row>
          <ion-col class="ion-text-center">
            <img alt="Logo" src="/img/logo-with-shadow.svg" width="140px"/>
            <form @submit.prevent="requestPasswordReset" class="ion-text-start form-container">
              <ion-input placeholder="Email" type="email" v-model="email" required></ion-input>
              <custom-button expand="block" color="primary" type="submit" text="Envoyer"></custom-button>
            </form>
          </ion-col>
        </ion-row>
      </ion-grid>
      <Toast-message />
    </ion-content>
  </ion-page>
  </template>
  
  <script>
  import { defineComponent } from 'vue';
  import { IonPage, IonContent, IonInput, IonButton, IonGrid, IonRow, IonCol, IonText, IonHeader, IonToolbar, IonTitle, IonBackButton, IonButtons  } from '@ionic/vue';
  import { arrowBackOutline } from 'ionicons/icons';
  import { useAccountStore } from '@/stores/account'
  import ToastMessage from '@/components/Commun/ToastMessage.vue'
  import CustomButton from '@/components/Commun/CustomButton.vue'
  
  export default defineComponent( {
    name: 'RequestResetPasswordView',
    data() {
      return {
        email: '',
        message: ''
      };
    },
    components: {
      CustomButton,
      ToastMessage,
      IonPage,
      IonContent,
      IonInput,
      IonButton,
      IonGrid,
      IonRow,
      IonCol,
      IonText,
      IonHeader,
      IonToolbar,
      IonTitle,
      IonBackButton,
      IonButtons
    },
    setup() {
      return { arrowBackOutline };
    },
    methods: {
      async requestPasswordReset() {
        await useAccountStore().requestPasswordReset(this.email);
      },
    }
  });
  </script>