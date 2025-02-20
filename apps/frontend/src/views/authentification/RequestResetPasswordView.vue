<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Request Password Reset</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <h2>Request Password Reset</h2>
      <form @submit.prevent="requestPasswordReset">
        <ion-item>
          <ion-label>Email:</ion-label>
          <ion-input type="email" v-model="email" required></ion-input>
        </ion-item>
        <ion-button type="submit">Request Password Reset</ion-button>
      </form>
      <ion-alert v-if="message" isOpen="true" message="Password reset email sent. Please check your inbox." />
    </ion-content>
  </ion-page>
  </template>
  
  <script>
  import { defineComponent } from 'vue';
  import AuthService from '../../services/auth.service.ts';
  import { IonPage, IonContent, IonHeader, IonToolbar, IonTitle, IonItem, IonLabel, IonInput, IonButton, IonAlert } from '@ionic/vue';
  
  export default defineComponent( {
    name: 'RequestResetPasswordView',
    data() {
      return {
        email: '',
        message: ''
      };
    },
    components: {
      IonPage,
      IonContent,
      IonHeader,
      IonToolbar,
      IonTitle,
      IonItem,
      IonLabel,
      IonInput,
      IonButton,
      IonAlert
    },
    methods: {
      async requestPasswordReset() {
        try {
          const response = await AuthService.requestPasswordReset(this.email);
          this.message = 'Password reset email sent. Please check your inbox.';
        } catch (error) {
          console.error('Request password reset failed:', error);
        }
      }
    }
  });
  </script>