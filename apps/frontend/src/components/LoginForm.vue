<template>
  <div>
    <h2>Login</h2>
    <div v-if="message" class="alert alert-success">{{ message }}</div>
    <form @submit.prevent="login">
      <div>
        <label>Email :</label>
        <input type="email" v-model="email" required />
      </div>
      <div>
        <label>Mot de passe :</label>
        <input type="password" v-model="password" required />
      </div>
      <button type="submit">Se connecter</button>
    </form>
  </div>
</template>

<script>
import { useAccountStore } from '@/stores/account';
export default {
  data() {
    return {
      email: '',
      password: '',
      message: ''
    };
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
    }
  }
};
</script>