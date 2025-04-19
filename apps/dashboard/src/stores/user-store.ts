import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => {
    return {
      user: null,
    }
  },

  actions: {
    setUser(userData: any) {
      this.user = userData
    },

    isLoggedIn() {
      return !!this.user
    },
  },
})
