const apiBaseUrl = import.meta.env.VITE_API_BASE_URL

import axios from 'axios'

const api = axios.create({
  baseURL: 'https://api.sendpathy.aaa/api',
  withCredentials: true,
});
export default {
  allUsers: () => `${apiBaseUrl}/users`,
  user: (id: string) => `${apiBaseUrl}/users/${id}`,
  users: ({ page, pageSize }: { page: number; pageSize: number }) =>
    `${apiBaseUrl}/users/?page=${page}&pageSize=${pageSize}`,
  allProjects: () => `${apiBaseUrl}/projects`,
  project: (id: string) => `${apiBaseUrl}/projects/${id}`,
  projects: ({ page, pageSize }: { page: number; pageSize: number }) =>
    `${apiBaseUrl}/projects/?page=${page}&pageSize=${pageSize}`,
  avatars: () => `${apiBaseUrl}/avatars`,
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
}



