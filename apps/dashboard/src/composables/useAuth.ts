import { ref } from 'vue'
import { login, logout, getProfile } from '../services/auth'
import { useUserStore } from '../stores/user-store'

export const useAuth = () => {
  const userStore = useUserStore()

  const loginUser = async (email: string, password: string) => {
    await login(email, password)
    await fetchUser()
  }

  const fetchUser = async () => {
    try {
      const { data } = await getProfile()
      userStore.setUser(data)
    } catch {
      userStore.setUser(null)
    }
  }

  const logoutUser = async () => {
    await logout()
    userStore.setUser(null)
  }

  return {
    user: userStore.user,
    loginUser,
    logoutUser,
    fetchUser,
  }
}
