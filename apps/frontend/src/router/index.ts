import { createRouter, createWebHistory } from '@ionic/vue-router';
import RegisterView from '../views/authentification/RegisterView.vue';
import LoginView from '../views/authentification/LoginView.vue';
import RequestPasswordResetView from '../views/authentification/RequestResetPasswordView.vue';
import ResetPasswordView from '../views/authentification/ResetPasswordView.vue';
import MessageView from "@/views/MessageView.vue";
import ConversationView from "@/views/ConversationView.vue";
import FeedView from '@/views/FeedView.vue';
import LifeMomentView from "@/views/LifeMomentView.vue";
import MainHeader from '@/components/Commun/MainHeader.vue';
import ReservationListView from '@/views/reservation/ReservationListView.vue';
import NewReservationView from '@/views/reservation/NewReservationView.vue';
import ReservationSummaryView from '@/views/reservation/ReservationSummaryView.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/feed',
  },
  {
    path: '/',
    component: MainHeader,
    children: [
      { path: '/request-password-reset', component: RequestPasswordResetView },
      { path: '/reset-password', component: ResetPasswordView },
      { path: '/conversations', component: ConversationView },
      { path: '/conversations/:id', component: MessageView },
      { path: '/feed', component: FeedView },
      { path: '/journal', component: LifeMomentView },
      { path: '/reservations', component: ReservationListView },
      { path: '/new-reservation', component: NewReservationView },
      { path: '/reservations/summary', component: ReservationSummaryView },
    ],
    meta: { requiresAuth: true }
  },
  { path: '/connexion', component: LoginView },
  { path: '/inscription', component: RegisterView },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const isAuthenticated = !!localStorage.getItem('refresh_token');

  if (to.matched.some(record => record.meta.requiresAuth) && !isAuthenticated) {
    next('/connexion');
  } else if (to.path === '/connexion' && isAuthenticated) {
    next('/feed');
  } else {
    next();
  }
});

export default router;