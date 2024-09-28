<template>
    <div>
      <h2>Register</h2>
      <form @submit.prevent="register">
        <div>
          <label>Email:</label>
          <input type="email" v-model="email" required />
        </div>
        <div>
          <label>Password:</label>
          <input type="password" v-model="password" required />
        </div>
        <button type="submit">Register</button>
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
      async register() {
        try {
          const user = {
            email: this.email,
            password: this.password
          };
          const response = await AuthService.register(user);
          console.log('Registration successful:', response);
        } catch (error) {
          console.error('Registration failed:', error);
        }
      }
    }
  };
  </script>