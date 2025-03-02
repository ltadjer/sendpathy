import { createRouter, createWebHistory } from '@ionic/vue-router';
import RegisterView from '../views/authentification/RegisterView.vue';
import LoginView from '../views/authentification/LoginView.vue';
import RequestPasswordResetView from '../views/authentification/RequestResetPasswordView.vue';
import ResetPasswordView from '../views/authentification/ResetPasswordView.vue';
import MessageView from '@/views/MessageView.vue';
import ConversationView from '@/views/ConversationView.vue';
import FeedView from '@/views/FeedView.vue';
import LifeMomentView from '@/views/LifeMomentView.vue';
import MainHeader from '@/components/Commun/MainHeader.vue';
import ReservationView from '@/views/reservation/ReservationView.vue';
import NewReservationView from '@/views/reservation/NewReservationView.vue';
import ReservationSummaryView from '@/views/reservation/ReservationSummaryView.vue';
import { useAccountStore } from '@/stores/account';
import ProfileView from '@/views/ProfileView.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/feed',
  },
  {
    path: '/',
    component: MainHeader,
    children: [
      { path: '/conversations', component: ConversationView },
      { path: '/feed', component: FeedView },
      { path: '/journal', component: LifeMomentView },
      { path: '/reservations', component: ReservationView },
      { path: '/reservations/nouvelle-reservation', component: NewReservationView },
      { path: '/reservations/summary', component: ReservationSummaryView },
      { path: '/profil', component: ProfileView}
    ],
    meta: { requiresAuth: true }
  },
  { path: '/conversations/:id', component: MessageView, meta: { requiresAuth: true }},

  { path: '/connexion', component: LoginView, meta: { requiresGuest: true } },
  { path: '/inscription', component: RegisterView, meta: { requiresGuest: true } },
  { path: '/request-password-reset', component: RequestPasswordResetView, meta: { requiresGuest: true } },
  { path: '/reset-password', component: ResetPasswordView, meta: { requiresGuest: true } },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to, from, next) => {
  const accountStore = useAccountStore();

  try {
    await accountStore.checkAuth();
  } catch (error) {
    console.error('Failed to check authentication:', error);
  }

  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const requiresGuest = to.matched.some(record => record.meta.requiresGuest);

  if (requiresAuth && !accountStore.isAuthenticated) {
    next('/connexion');
  } else if (requiresGuest && accountStore.isAuthenticated) {
    next('/');
  } else {
    next();
  }
});

export default router;