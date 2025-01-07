<template>
    <div>
      <h2>Request Password Reset</h2>
      <form @submit.prevent="requestPasswordReset">
        <div>
          <label>Email:</label>
          <input type="email" v-model="email" required />
        </div>
        <button type="submit">Request Password Reset</button>
      </form>
      <div v-if="message" class="alert alert-success">{{ message }}</div>
    </div>
  </template>
  
  <script>
  import AuthService from '../../services/auth.service.ts';
  
  export default {
    name: 'RequestResetPasswordView',
    data() {
      return {
        email: '',
        message: ''
      };
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
  };
  </script>