<template>
  <ion-page>
    <ion-content class="ion-padding">
      <ion-grid class="flex-center">
        <ion-row class="">
          <ion-col class="ion-text-center">
            <img alt="Logo" src="/img/logo-with-shadow.svg" width="160px"/>
            <ion-text class="gradient-text">
              <h1>Content de te revoir !</h1>
            </ion-text>
            <form @submit.prevent="login">
              <div v-if="message" class="alert alert-success">{{ message }}</div>
              <ion-list class="ion-text-start">
                <ion-input class="ion-margin-bottom ion-padding-horizontal full-width" placeholder="Email" type="email" v-model="email" required></ion-input>
                <ion-input class="ion-margin-bottom ion-padding-horizontal full-width" placeholder="Mot de passe" type="password" v-model="password" required></ion-input>
              </ion-list>
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
    </ion-content>
  </ion-page>
</template>

<script>
import { useAccountStore } from '@/stores/account.ts';
import { IonPage, IonContent, IonList, IonItem, IonLabel, IonInput, IonButton, IonThumbnail, IonGrid, IonRow, IonCol, IonText } from '@ionic/vue';
import CustomButton from '@/components/Commun/CustomButton.vue';
import { defineComponent } from 'vue';

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
    IonPage,
    IonContent,
    IonList,
    IonItem,
    IonLabel,
    IonInput,
    IonButton,
    IonThumbnail,
    IonGrid,
    IonRow,
    IonCol,
    IonText,
    CustomButton
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

<style scoped>
.full-width {
  width: 100%;
}
</style>