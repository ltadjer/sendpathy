<template>
  <ion-page>
    <ion-content class="ion-padding">
      <ion-grid class="flex-center">
        <ion-row>
          <ion-col class="ion-text-center">
            <img alt="Logo" src="/img/logo-with-shadow.svg" width="140px"/>
            <form @submit.prevent="login" class="ion-text-start form-container">
              <div v-if="message" class="alert alert-success">{{ message }}</div>
              <ion-input class="ion-input-spacing" placeholder="Email" type="email" v-model="email" required></ion-input>
              <ion-input
                class="ion-input-spacing"
                placeholder="Mot de passe"
                type="password"
                v-model="password"
                required>
                <ion-input-password-toggle slot="end"></ion-input-password-toggle>
              </ion-input>
              <custom-button expand="block" color="primary" type="submit" text="Se connecter"></custom-button>
            </form>
          </ion-col>
        </ion-row>
        <ion-row>
          <ion-col class="ion-text-center ion-margin-top">
            <ion-text>
              <span @click="navigateToForgotPassword">Mot de passe oublié ?</span>
              <p>Vous n’avez pas de compte? <strong @click="navigateToRegister">S’inscrire</strong></p>
            </ion-text>
          </ion-col>
        </ion-row>
      </ion-grid>
      <ToastMessage/>
    </ion-content>
  </ion-page>
</template>

<script>
import { useAccountStore } from '@/stores/account.ts';
import { IonPage, IonContent, IonGrid, IonRow, IonCol, IonText, IonInput, IonInputPasswordToggle } from '@ionic/vue';
import CustomButton from '@/components/Commun/CustomButton.vue';
import { defineComponent } from 'vue';
import ToastMessage from '@/components/Commun/ToastMessage.vue';

export default defineComponent({
  name: 'LoginView',
  data() {
    return {
      email: '',
      password: '',
      message: ''
    };
  },
  components: {
    ToastMessage,
    IonPage,
    IonContent,
    IonGrid,
    IonRow,
    IonCol,
    IonText,
    IonInput,
    CustomButton,
    IonInputPasswordToggle
  },
  created() {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('message')) {
      this.message = urlParams.get('message') === 'email_confirmed' ? 'Votre compte a bien été confirmé.' : '';
    }
  },
  methods: {
    async login() {
      try {
        const user = {
          email: this.email,
          password: this.password
        };
        await useAccountStore().login(user);
        this.$router.push('/feed');
      } catch (error) {
        console.error('Login failed:', error);
      }
    },
    navigateToForgotPassword() {
      this.$router.push('/request-password-reset');
    },
    navigateToRegister() {
      this.$router.push('/inscription');
    }
  }
});
</script>