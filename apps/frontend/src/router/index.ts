import { createRouter, createWebHistory } from '@ionic/vue-router';
import HomeView from '../views/HomeView.vue'
import RegisterForm from '../components/RegisterForm.vue'
import LoginForm from '../components/LoginForm.vue'
import RequestPasswordResetForm from '../components/RequestResetPasswordForm.vue'
import ResetPasswordForm from '../components/ResetPasswordForm.vue'
import MessageView from "@/views/MessageView.vue";
import ConversationView from "@/views/ConversationView.vue";
import FeedView from '@/views/FeedView.vue'
import LifeMomentView from "@/views/LifeMomentView.vue";


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
    { path: '/conversations', component: ConversationView },
    { path: '/conversations/:id', component: MessageView },
    { path: '/feed', component: FeedView },
    {path: '/life-moments', component: LifeMomentView}

  ]
})

export default router
