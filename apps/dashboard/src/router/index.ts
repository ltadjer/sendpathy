import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

import AuthLayout from '../layouts/AuthLayout.vue'
import AppLayout from '../layouts/AppLayout.vue'

import RouteViewComponent from '../layouts/RouterBypass.vue'
import { useUserStore } from '../stores/user-store'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/:pathMatch(.*)*',
    redirect: { name: 'dashboard' },
  },
  {
    name: 'admin',
    path: '/',
    component: AppLayout,
    redirect: { name: 'dashboard' },
    children: [
      {
        name: 'dashboard',
        path: 'dashboard',
        component: () => import('../pages/admin/dashboard/Dashboard.vue'),
        meta: { requiresAuth: true, roles: ['ADMIN', 'THERAPIST'] },
      },
      {
        name: 'reservations',
        path: 'reservations',
        component: () => import('../pages/reservations/Reservations.vue'),
        meta: { requiresAuth: true, roles: ['THERAPIST'] },
      },
      {
        name: 'slots',
        path: 'slots',
        component: () => import('../pages/slots/Slots.vue'),
        meta: { requiresAuth: true, roles: ['THERAPIST'] },
      },
      {
        name: 'settings',
        path: 'settings',
        component: () => import('../pages/settings/Settings.vue'),
        meta: { requiresAuth: true, roles: ['THERAPIST', 'ADMIN'] },
      },
      {
        name: 'preferences',
        path: 'preferences',
        component: () => import('../pages/preferences/Preferences.vue'),
        meta: { requiresAuth: true, roles: ['THERAPIST', 'ADMIN'] },
      },
      {
        name: 'users',
        path: 'users',
        component: () => import('../pages/users/UsersPage.vue'),
        meta: { requiresAuth: true, roles: ['ADMIN'] },
      },
      {
        name: 'projects',
        path: 'projects',
        component: () => import('../pages/projects/ProjectsPage.vue'),
        meta: { requiresAuth: true, roles: ['ADMIN'] },
      },
      {
        name: 'payments',
        path: '/payments',
        component: RouteViewComponent,
        children: [
          {
            name: 'payment-methods',
            path: 'payment-methods',
            component: () => import('../pages/payments/PaymentsPage.vue'),
            meta: { requiresAuth: true, roles: ['ADMIN'] },
          },
          {
            name: 'billing',
            path: 'billing',
            component: () => import('../pages/billing/BillingPage.vue'),
            meta: { requiresAuth: true, roles: ['ADMIN'] },
          },
          {
            name: 'pricing-plans',
            path: 'pricing-plans',
            component: () => import('../pages/pricing-plans/PricingPlans.vue'),
            meta: { requiresAuth: true, roles: ['ADMIN'] },
          },
        ],
        meta: { requiresAuth: true, roles: ['ADMIN'] },
      },
      {
        name: 'faq',
        path: '/faq',
        component: () => import('../pages/faq/FaqPage.vue'),
        meta: { requiresAuth: true, roles: ['THERAPIST', 'ADMIN'] },
      },
    ],
  },
  {
    path: '/auth',
    component: AuthLayout,
    children: [
      {
        name: 'login',
        path: 'login',
        component: () => import('../pages/auth/Login.vue'),
      },
      {
        name: 'signup',
        path: 'signup',
        component: () => import('../pages/auth/Signup.vue'),
      },
      {
        name: 'recover-password',
        path: 'recover-password',
        component: () => import('../pages/auth/RecoverPassword.vue'),
      },
      {
        name: 'reset-password',
        path: '/auth/reset-password',
        component: () => import('../pages/auth/ResetPassword.vue'),
      },
      {
        name: 'recover-password-email',
        path: 'recover-password-email',
        component: () => import('../pages/auth/CheckTheEmail.vue'),
      },
      {
        path: '',
        redirect: { name: 'login' },
      },
    ],
  },
  {
    name: '404',
    path: '/404',
    component: () => import('../pages/404.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    }
    if (to.hash) {
      return { el: to.hash, behavior: 'smooth' }
    } else {
      window.scrollTo(0, 0)
    }
  },
  routes,
})

router.beforeEach(async (to, from, next) => {
  const userStore = useUserStore()

  // Fetch user if not already fetched
  if (!userStore.user) {
    await userStore.fetchUser()
  }

  const userRole = userStore.user?.role
  console.log('User role:', userRole)
  // Redirect to login if the route requires authentication and the user is not logged in
  if (to.meta.requiresAuth && !userStore.isLoggedIn()) {
    return next({ name: 'login' })
  }

  // Check if the user's role is allowed to access the route
  if (to.meta.roles && !to.meta.roles.includes(userRole)) {
    return next({ name: '404' }) // Redirect to a 404 page or another appropriate page
  }

  // Prevent logged-in users from accessing auth pages (e.g., login, signup)
  if ((to.name === 'login' || to.name === 'signup') && userStore.isLoggedIn()) {
    return next({ name: 'dashboard' }) // Redirect to a default page like the dashboard
  }

  next()
})

export default router
