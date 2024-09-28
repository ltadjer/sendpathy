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

  async login(user: ant) {
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/auth/login`, user);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}

export default new AuthService();