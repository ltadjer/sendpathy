import { defineStore } from 'pinia';
import AuthService from '@/services/auth.service';

export const useAccountStore = defineStore('account', {
  state: () => ({
    email: null,
    accessToken: null,
    refreshToken: null
  }),
  actions: {
    async login(user: { email: string, password: string }) {
      try {
        const response = await AuthService.login(user);
        console.log('Login successful:', response);
        localStorage.setItem('access_token', response.access_token);
        localStorage.setItem('refresh_token', response.refresh_token);
        localStorage.setItem('access_code', response.accessCode);
        this.accessToken = response.access_token;
        this.refreshToken = response.refresh_token;
        // set email of the store
        this.email = response.email;
        console.log('Logged in as:', this.email);
      } catch (error) {
        console.error('Login failed:', error);
      }
    }
  }
});