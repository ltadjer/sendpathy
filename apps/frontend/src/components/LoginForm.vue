<template>
    <div>
      <h2>Login</h2>
      <form @submit.prevent="login">
        <div>
          <label>Email:</label>
          <input type="email" v-model="email" required />
        </div>
        <div>
          <label>Password:</label>
          <input type="password" v-model="password" required />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  </template>
  
  <script>
  import AuthService from '../services/auth.service';
  
  export default {
    data() {
      return {
        email: '',
        password: ''
      };
    },
    methods: {
      async login() {
        try {
          const user = {
            email: this.email,
            password: this.password
          };
          const response = await AuthService.login(user);
          console.log('Login successful:', response);
        } catch (error) {
          console.error('Login failed:', error);
        }
      }
    }
  };
  </script>