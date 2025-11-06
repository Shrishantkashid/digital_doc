import { authAPI } from './apiService';

const authService = {
  // Register a new user
  register: async (username: string, password: string, email?: string) => {
    try {
      const response = await authAPI.register(username, password, email);
      return response.user;
    } catch (error) {
      throw error;
    }
  },

  // Login user
  login: async (username: string, password: string) => {
    try {
      const response = await authAPI.login(username, password);
      return response.user;
    } catch (error) {
      throw error;
    }
  }
};

export default authService;