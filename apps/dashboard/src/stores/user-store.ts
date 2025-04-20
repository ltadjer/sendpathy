import { defineStore } from 'pinia'
import { getProfile, updateProfile } from '../services/auth'

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null,
  }),

  actions: {
    setUser(userData: any) {
      this.user = userData
    },

    isLoggedIn() {
      return !!this.user
    },

    async fetchUser() {
      try {
        const response = await getProfile()
        this.setUser(response.data)
      } catch (error) {
        this.user = null
      }
    },

    async updateUser(id: string, data: any) {
      try {
        console.log('updateUser', id, data)
        const response = await updateProfile(id, data)
        this.setUser(response.data)
      } catch (error) {
        console.error('Error updating user:', error)
        throw error
      }
    }
  },
})
