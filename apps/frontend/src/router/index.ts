import { createRouter, createWebHistory } from '@ionic/vue-router';
import HomeView from '../views/HomeView.vue';
import RegisterForm from '../components/RegisterForm.vue';
import LoginForm from '../components/LoginForm.vue';
import RequestPasswordResetForm from '../components/RequestResetPasswordForm.vue';
import ResetPasswordForm from '../components/ResetPasswordForm.vue';
import MessageView from "@/views/MessageView.vue";
import ConversationView from "@/views/ConversationView.vue";
import FeedView from '@/views/FeedView.vue';
import LifeMomentView from "@/views/LifeMomentView.vue";
import MainHeader from '@/components/Commun/MainHeader.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/feed',
  },
  {
    path: '/',
    component: MainHeader,
    children: [
      { path: '/', name: 'home', component: HomeView },
      { path: '/inscription', component: RegisterForm },
      { path: '/connexion', component: LoginForm },
      { path: '/request-password-reset', component: RequestPasswordResetForm },
      { path: '/reset-password', component: ResetPasswordForm },
      { path: '/conversations', component: ConversationView },
      { path: '/conversations/:id', component: MessageView },
      { path: '/feed', component: FeedView },
      { path: '/life-moments', component: LifeMomentView },
    ],
  },
];


const router = createRouter({
  // Use: createWebHistory(process.env.BASE_URL) in your app
  history: createWebHistory(),
  routes,
});

// Garde de navigation globale
router.beforeEach((to, from, next) => {
  const isAuthenticated = !!localStorage.getItem('refresh_token');
  const accessCode = localStorage.getItem('access_code');

  if (!isAuthenticated && to.path !== '/connexion' && to.path !== '/inscription') {
    next('/connexion'); // Redirige vers la page de connexion si non authentifié
  } else {
    next(); // Continue la navigation
  }
});


export default router;