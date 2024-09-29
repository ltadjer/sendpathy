import axios from 'axios';

class AuthService {
  async register(user: any) {
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/auth/register`, user);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async login(user: any) {
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/auth/login`, user);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  async requestPasswordReset(email: string) {
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/auth/request-password-reset`, { email });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async resetPassword(token: string, newPassword: string) {
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/auth/reset-password`, { token, newPassword });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}

export default new AuthService();