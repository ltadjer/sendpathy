import { ref } from 'vue'
import { login, logout, getProfile, requestPasswordReset as apiRequestPasswordReset, resetPassword as apiResetPassword } from '../services/auth'
import { useUserStore } from '../stores/user-store'
import { useRouter } from 'vue-router'

export const useAuth = () => {
  const userStore = useUserStore()
  const router = useRouter()

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
    router.push({ name: 'login' })
  }

  const requestPasswordReset = async (email: string) => {
    try {
      await apiRequestPasswordReset(email)
      return true
    } catch (error) {
      console.error('Error requesting password reset:', error)
      return false
    }
  }

  const resetPassword = async (token: string, newPassword: string) => {
    try {
      await apiResetPassword(token, newPassword)
      return true
    } catch (error) {
      console.error('Error resetting password:', error)
      return false
    }
  }

  return {
    user: userStore.user,
    loginUser,
    logoutUser,
    fetchUser,
    requestPasswordReset,
    resetPassword,
  }
}
