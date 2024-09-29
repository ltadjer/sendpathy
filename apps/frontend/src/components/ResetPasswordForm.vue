<template>
    <div>
      <h2>Reset Password</h2>
      <form @submit.prevent="resetPassword">
        <div>
          <label>New Password:</label>
          <input type="password" v-model="newPassword" required />
        </div>
        <button type="submit">Reset Password</button>
      </form>
      <div v-if="message" class="alert alert-success">{{ message }}</div>
    </div>
  </template>
  
  <script>
  import AuthService from '../services/auth.service';
  
  export default {
    data() {
      return {
        newPassword: '',
        message: '',
        token: ''
      };
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
  };
  </script>