import api from '@/services/api.service'

export default  {
  /**
   * Enregistre un nouvel utilisateur.
   * @param user - Les informations de l'utilisateur à enregistrer.
   * @returns Les données de la réponse de l'API.
   */
  async register(user: any) {
    return await api.post('/auth/register/user', user)
  },
  /**
   * Connecte un utilisateur.
   * @param user - Les informations de l'utilisateur pour la connexion.
   * @returns les nouvelles données de l'utilisateur comme réponse API, y compris les tokens
   */
  async login(user) {
    return await api.post('/auth/login', user);
  },

  /**
   * Déconnecte un utilisateur.
   */
  async logout() {
      await api.post('/auth/logout')
  },

  /**
   * Vérifie si un utilisateur est connecté.
   * @returns les nouvelles données de l'utilisateur comme réponse API
   */

  async checkAuth() {
    try {
      return await api.get('/auth/me'); // Une route pour retourner les infos utilisateur
    } catch (error) {
      throw error
    }
  },

  /**
   * Rafraîchit le token d'accès.
   * @returns les nouvelles données de l'utilisateur comme réponse API
   */

  async refreshToken() {
    try {
      const response = await api.post('/auth/refresh-token');
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  /**
   * Demande une réinitialisation de mot de passe pour un utilisateur.
   * @param email - L'email de l'utilisateur pour la réinitialisation du mot de passe.
   * @returns les nouvelles données de l'utilisateur comme réponse API
   */
  async requestPasswordReset(email: string) {
      return await api.post('/auth/request-password-reset', { email })
  },
  /**
   * Réinitialise le mot de passe d'un utilisateur.
   * @param token - Le token de réinitialisation de mot de passe.
   * @param newPassword - Le nouveau mot de passe.
   * @returns les nouvelles données de l'utilisateur comme réponse API
   */
  async resetPassword(token: string, newPassword: string) {
    console.log('resetPassword', token, newPassword);
      return await api.post('/auth/reset-password', {
        token: token,
        newPassword: newPassword
      })
  },

  async updateAccessCode(accessCode: string) {
    try {
      const response = await api.patch(`/users/access-code`, { accessCode: accessCode });
      console.log('updateAccessCode', response);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async validateAccessCode(accessCode: string) {
    try {
      const response = await api.post(`/users/validate-access-code`, { accessCode: accessCode });
      console.log('validateAccessCode', response);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async setAccessCode(accessCode: string) {
    try {
      const response = await api.post(`/users/access-code`, { accessCode: accessCode });
      console.log('setAccessCode', response);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Fetch all users with the role of therapist.
   */
  async fetchAllTherapists() {
    const response = await api.get('/users/therapists');
    console.log('fetchAllTherapists', response);
    return response.data;
  },

  async findOneById(id: string) {
    try {
      const response = await api.get(`/users/${id}`);
      console.log('findOneById', response);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async updateUser(userId: string, updatedUser: any) {
    try {
      const response = await api.patch(`/users/${userId}`, updatedUser);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}

