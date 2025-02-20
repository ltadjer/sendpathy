<template>
  <ion-page>
    <ion-content>
      <ion-grid>
        <ion-row>
          <ion-col>
            <ion-text>
              <h2>Reset Password</h2>
            </ion-text>
            <form @submit.prevent="resetPassword">
              <ion-list>
                <ion-item>
                  <ion-label position="floating">New Password</ion-label>
                  <ion-input type="password" v-model="newPassword" required></ion-input>
                </ion-item>
              </ion-list>
              <ion-button type="submit" expand="block">Reset Password</ion-button>
            </form>
            <ion-text v-if="message" class="alert alert-success">{{ message }}</ion-text>
          </ion-col>
        </ion-row>
      </ion-grid>
    </ion-content>
  </ion-page>
  </template>
  
  <script lang="ts">
  import { defineComponent } from 'vue';
  import AuthService from '../../services/auth.service.ts';
  import { IonPage, IonContent, IonGrid, IonRow, IonCol, IonText, IonList, IonItem, IonLabel, IonInput, IonButton } from '@ionic/vue';
  
  export default defineComponent( {
    name: 'ResetPasswordView',
    data() {
      return {
        newPassword: '',
        message: '',
        token: ''
      };
    },
    components: {
      IonPage,
      IonContent,
      IonGrid,
      IonRow,
      IonCol,
      IonText,
      IonList,
      IonItem,
      IonLabel,
      IonInput,
      IonButton
    },
    created() {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.has('token')) {
        this.token = urlParams.get('token');
      }
    },
    methods: {
      async resetPassword() {
        try {
          const response = await AuthService.resetPassword(this.token, this.newPassword);
          this.message = 'Password reset successful. You can now log in with your new password.';
        } catch (error) {
          console.error('Reset password failed:', error);
        }
      }
    }
  });
  </script>