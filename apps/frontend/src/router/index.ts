import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import RegisterForm from '../components/RegisterForm.vue'
import LoginForm from '../components/LoginForm.vue'
import RequestPasswordResetForm from '../components/RequestResetPasswordForm.vue'
import ResetPasswordForm from '../components/ResetPasswordForm.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    { path: '/inscription', component: RegisterForm },
    { path: '/connexion', component: LoginForm },
    { path: '/request-password-reset', component: RequestPasswordResetForm },
  { path: '/reset-password', component: ResetPasswordForm },

  ]
})

export default router
