import { defineStore } from 'pinia';
import AuthService from '@/services/auth.service';
import WebSocketService from '@/services/websocket.service';
import { useToastStore } from '@/stores/toast';

export const useAccountStore = defineStore('account', {
  state: () => ({
    user: null,
    isAuthenticated: false,
  }),
  actions: {
    async register(user) {
      const toastStore = useToastStore();
      try {
        const response = await AuthService.register(user);
        if (response) {
          if (response.status === 409) {
            toastStore.showToast('Échec de l\'inscription, l\'utilisateur existe déjà', 'danger');
            return;
          } else if (response.status === 201) {
            toastStore.showToast('Inscription réussie, veuillez confirmer votre email', 'primary');
          }
        }
      } catch (error) {
        toastStore.showToast('Une erreur est survenue, veuillez réessayez.', 'danger');
        console.error('Registration failed:', error);
      }
    },

    async login(user: { email: string, password: string }) {
      const toastStore = useToastStore();
      try {
        const response = await AuthService.login(user);
        this.isAuthenticated = true;
        this.user = response.data;
        if (response) {
          if (response.status === 200 || response.status === 201) {
            toastStore.showToast('Connexion réussie', 'primary');
          } else if (response.status === 401) {
            toastStore.showToast('Échec de la connexion, vérifiez vos identifiants ou confirmez votre email', 'danger');
          }
        }
      } catch (error) {
        toastStore.showToast('Une erreur est survenue, veuillez réessayez.', 'danger');
        console.error('Login failed:', error);
      }
    },

    async checkAuth() {
      try {
        const response = await AuthService.checkAuth();
        this.user = response.data;
        this.isAuthenticated = true;
      } catch (error) {
        console.error('Failed to fetch user data:', error);
        await this.logout();
      }
    },

    async logout() {
      const toastStore = useToastStore();
      await AuthService.logout();
      toastStore.showToast('Déconnexion réussie', 'primary');
      this.isAuthenticated = false;
      this.user = null;
      WebSocketService.disconnect(); // Disconnect WebSocket on logout
    },

    async refreshToken() {
      try {
        const response = await AuthService.refreshToken();
      } catch (error) {
        console.error('Failed to refresh token:', error);
        await this.logout();
      }
    },

    async validateAccessCode(code: string) {
      try {
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
        return response;
      } catch (error) {
        console.error('Failed to set access code:', error);
      }
    },

    async requestPasswordReset(email: string) {
      const toastStore = useToastStore();
      try {
        const response = await AuthService.requestPasswordReset(email);
        if (response) {
          if (response.status === 200 || response.status === 201) {
            toastStore.showToast('Email de réinitialisation de mot de passe envoyé. Veuillez vérifier votre email.', 'primary');
          } else if (response.data.status === 404) {
            toastStore.showToast('Aucun utilisateur trouvé avec cet email.', 'danger');
          } else if (response.data.status === 400) {
            toastStore.showToast('Échec de la demande de réinitialisation de mot de passe.', 'danger');
          }
        }
      } catch (error) {
        toastStore.showToast('Une erreur est survenue, veuillez réessayez.', 'danger');
        console.error('Failed to request password reset:', error);
      }
    },
    async resetPassword(token: string, newPassword: string) {
      const toastStore = useToastStore();
      try {
        const response = await AuthService.resetPassword(token, newPassword);
        if (response) {
          if (response.data.status === 200 || response.data.status === 201) {
            toastStore.showToast('Mot de passe réinitialisé avec succès.', 'primary');
          } else if (response.data.status === 400) {
            toastStore.showToast('Échec de la réinitialisation du mot de passe.', 'danger');
          }
        }
      } catch (error) {
        toastStore.showToast('Une erreur est survenue, veuillez réessayez.', 'danger');
        console.error('Failed to reset password:', error);
      }
    },

    async findOneById(id: string) {
      try {
        const response = await AuthService.findOneById(id);
        console.log('User data:', response.data);
        return response;
      } catch (error) {
        console.error('Failed to fetch user data:', error);
      }
    },

    async refreshCurrentUser() {
      try {
        this.user = await AuthService.findOneById(this.user.id);
      } catch (error) {
        console.error('Failed to fetch user data:', error);
      }
    },

    async updateUser(updatedUser) {
      const toastStore = useToastStore();
      try {
        this.user = await AuthService.updateUser(this.user.id, updatedUser);
        toastStore.showToast('Profil mis à jour avec succès', 'primary');
      } catch (error) {
        toastStore.showToast('Échec de la mise à jour du profil', 'danger');
        console.error('Failed to update user:', error);
      }
    }
  }
});