import axios from 'axios';

const api = axios.create({
  baseURL: 'https://api.sendpathy.aaa/api',
  withCredentials: true, // Ensure cookies are sent with requests
});

api.interceptors.response.use(
  response => response,
  async (error) => {
    if (error.response.status === 401 && !error.config._retry) {
      error.config._retry = true;
      try {
        //await refreshToken();
        return api(error.config);
      } catch (refreshError) {
        console.error('Failed to refresh token:', refreshError);
      }
    }
    return Promise.reject(error);
  }
);

async function refreshToken() {
  try {
    const response = await api.post('/auth/refresh-token');
    return response.data;
  } catch (error) {
    console.error('Error refreshing token:', error);
    throw error;
  }
}

export default {
  async get(url, config = {}) {
    return api.get(url, config);
  },
  async post(url, data, config = {}) {
    return api.post(url, data, config);
  },
  async patch(url, data, config = {}) {
    return api.patch(url, data, config);
  },
  async delete(url, config = {}) {
    return api.delete(url, config);
  },
};