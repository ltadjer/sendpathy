import { defineStore } from 'pinia';
import AuthService from '@/services/auth.service';
import api from '@/services/api.service';
import WebSocketService from '@/services/websocket.service';

export const useAccountStore = defineStore('account', {
  state: () => ({
    email: null,
    user: null,
    isAuthenticated: false,
  }),
  actions: {
    async login(user: { email: string, password: string }) {
      try {
        const response = await AuthService.login(user);
        this.isAuthenticated = true;
        this.email = response.email;
        this.user = response;
        console.log('Login successful:', response);
      } catch (error) {
        console.error('Login failed:', error);
      }
    },
    async checkAuth() {
      try {
        const response = await AuthService.checkAuth();
        this.user = response;
        this.email = response.email;
        this.isAuthenticated = true;
        console.log('User data:', response);
      } catch (error) {
        console.error('Failed to fetch user data:', error);
        await this.logout();
      }
    },
    async logout() {
      await AuthService.logout();
      this.isAuthenticated = false;
      this.email = null;
      this.user = null;
      WebSocketService.disconnect(); // Disconnect WebSocket on logout
    },

    async refreshToken() {
      try {
        const response = await AuthService.refreshToken();
        console.log('Token refreshed:', response);
      } catch (error) {
        console.error('Failed to refresh token:', error);
        await this.logout();
      }
    }
  },
});