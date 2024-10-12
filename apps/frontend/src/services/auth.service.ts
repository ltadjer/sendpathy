import axios from 'axios'

// Crée une instance Axios avec une configuration de base
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Intercepteur de requête pour ajouter le jeton d'accès aux en-têtes des requêtes
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Intercepteur de réponse pour gérer les réponses 401 Unauthorized
apiClient.interceptors.response.use(
  (response) => {
    // Retourne la réponse directement si elle est réussie
    return response
  },
  async (error) => {
    // Sauvegarde la requête originale qui a échoué
    const originalRequest = error.config
    // Vérifie si l'erreur est une 401 Unauthorized et que la requête n'a pas encore été réessayée
    if (error.response.status === 401 && !originalRequest._retry) {
      // Marque la requête originale comme réessayée
      originalRequest._retry = true
      try {
        // Récupère le refresh token depuis le stockage local
        const refreshToken = localStorage.getItem('refresh_token')
        // Envoie une requête pour obtenir un nouveau jeton d'accès en utilisant le refresh token
        const response = await axios.post(`${import.meta.env.VITE_API_URL}/auth/refresh-token`, {
          refreshToken
        })
        // Récupère le nouveau jeton d'accès de la réponse
        const { access_token } = response.data
        // Stocke le nouveau jeton d'accès dans le stockage local
        localStorage.setItem('access_token', access_token)
        // Ajoute le nouveau jeton d'accès aux en-têtes de la requête originale
        originalRequest.headers.Authorization = `Bearer ${access_token}`
        // Réessaie la requête originale avec le nouveau jeton d'accès
        return apiClient(originalRequest)
      } catch (refreshError) {
        // Affiche une erreur si le rafraîchissement du token échoue
        console.error('Refresh token failed:', refreshError)
        // Redirige l'utilisateur vers la page de connexion
        window.location.href = '/connexion'
      }
    }
    // Rejette la promesse avec l'erreur si la réponse n'est pas une 401 ou si le rafraîchissement du token échoue
    return Promise.reject(error)
  }
)

class AuthService {
  /**
   * Enregistre un nouvel utilisateur.
   * @param user - Les informations de l'utilisateur à enregistrer.
   * @returns Les données de la réponse de l'API.
   */
  async register(user: any) {
    try {
      const response = await apiClient.post('/auth/register', user)
      return response.data
    } catch (error) {
      throw error
    }
  }
  /**
   * Connecte un utilisateur.
   * @param user - Les informations de l'utilisateur pour la connexion.
   * @returns les nouvelles données de l'utilisateur comme réponse API, y compris les tokens
   */
  async login(user: any) {
    try {
      const response = await apiClient.post('/auth/login', user)
      return response.data
    } catch (error) {
      throw error
    }
  }
  /**
   * Demande une réinitialisation de mot de passe pour un utilisateur.
   * @param email - L'email de l'utilisateur pour la réinitialisation du mot de passe.
   * @returns les nouvelles données de l'utilisateur comme réponse API
   */
  async requestPasswordReset(email: string) {
    try {
      const response = await apiClient.post('/auth/request-password-reset', { email })
      return response.data
    } catch (error) {
      throw error
    }
  }
  /**
   * Réinitialise le mot de passe d'un utilisateur.
   * @param token - Le token de réinitialisation de mot de passe.
   * @param newPassword - Le nouveau mot de passe.
   * @returns les nouvelles données de l'utilisateur comme réponse API
   */
  async resetPassword(token: string, newPassword: string) {
    try {
      const response = await apiClient.post('/auth/reset-password', { token, newPassword })
      return response.data
    } catch (error) {
      throw error
    }
  }
}

export default new AuthService()
