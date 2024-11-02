import api from '@/services/api.service'

export default  {
  /**
   * Enregistre un nouvel utilisateur.
   * @param user - Les informations de l'utilisateur à enregistrer.
   * @returns Les données de la réponse de l'API.
   */
  async register(user: any) {
    try {
      const response = await api.post('/auth/register', user)
      return response.data
    } catch (error) {
      throw error
    }
  },
  /**
   * Connecte un utilisateur.
   * @param user - Les informations de l'utilisateur pour la connexion.
   * @returns les nouvelles données de l'utilisateur comme réponse API, y compris les tokens
   */
  async login(user: any) {
    try {
      const response = await api.post('/auth/login', user)
      return response.data
    } catch (error) {
      throw error
    }
  },
  /**
   * Demande une réinitialisation de mot de passe pour un utilisateur.
   * @param email - L'email de l'utilisateur pour la réinitialisation du mot de passe.
   * @returns les nouvelles données de l'utilisateur comme réponse API
   */
  async requestPasswordReset(email: string) {
    try {
      const response = await api.post('/auth/request-password-reset', { email })
      return response.data
    } catch (error) {
      throw error
    }
  },
  /**
   * Réinitialise le mot de passe d'un utilisateur.
   * @param token - Le token de réinitialisation de mot de passe.
   * @param newPassword - Le nouveau mot de passe.
   * @returns les nouvelles données de l'utilisateur comme réponse API
   */
  async resetPassword(token: string, newPassword: string) {
    try {
      const response = await api.post('/auth/reset-password', { token, newPassword })
      return response.data
    } catch (error) {
      throw error
    }
  }
}

