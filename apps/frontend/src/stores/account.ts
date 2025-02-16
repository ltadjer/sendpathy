import { defineStore } from 'pinia';
import AuthService from '@/services/auth.service';
import WebSocketService from '@/services/websocket.service';

export const useAccountStore = defineStore('account', {
  state: () => ({
    user: null,
    isAuthenticated: false,
  }),
  actions: {
    async login(user: { email: string, password: string }) {
      try {
        const response = await AuthService.login(user);
        this.isAuthenticated = true;
        this.user = response.data;
        console.log('Login successful:', response);
      } catch (error) {
        console.error('Login failed:', error);
      }
    },
    async checkAuth() {
      try {
        const response = await AuthService.checkAuth();
        this.user = response.data;
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
    },

    async validateAccessCode(code: string) {
      try {
        console.log('Validating access code:', code);
        const response = await AuthService.validateAccessCode(code);
        this.user.accessCode = response;
        return response;
      } catch (error) {
        console.error('Failed to validate access code:', error);
      }
    },

    async setAccessCode(code: string) {
      try {
        const response = await AuthService.setAccessCode(code);
        this.user.accessCode = response;
        console.log('Access code set:', response);
        return response;
      } catch (error) {
        console.error('Failed to set access code:', error);
      }
    },
  },
});