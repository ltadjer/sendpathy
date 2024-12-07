import axios from 'axios'

// Crée une instance Axios avec une configuration de base
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Intercepteur de requête pour ajouter le jeton d'accès aux en-têtes des requêtes
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    console.error('Request error:', error)
    return Promise.reject(error)
  }
)

// Intercepteur de réponse pour gérer les réponses 401 Unauthorized
api.interceptors.response.use(
  (response) => {
    // Retourne la réponse directement si elle est réussie
    return response
  },
  async (error) => {
    console.error('Response error:', error)
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
        return api(originalRequest)
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

api.interceptors.request.use((config) => {
  const accessCode = localStorage.getItem('access_code');
  if (accessCode) {
    config.headers['x-access-code'] = accessCode;
  }
  return config;
});

export default {
  async get(url: string, config = {}) {
    return api.get(url, config);
  },
  async post(url: string, data: any, config = {}) {
    return api.post(url, data, config);
  },
  async patch(url: string, data: any, config = {}) {
    return api.patch(url, data, config);
  },
  async delete(url: string, config = {}) {
    return api.delete(url, config);
  },
};