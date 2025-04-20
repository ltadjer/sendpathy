export const filterRoutesByRole = (routes: INavigationRoute[], userRole: string): INavigationRoute[] => {
  return routes
    .filter(route => {
      if (!route.meta?.roles) {
        return true
      }
      return route.meta.roles.includes(userRole)
    })
    .map(route => {
      if (route.children) {
        return {
          ...route,
          children: filterRoutesByRole(route.children, userRole),
        }
      }
      return route
    })
}

export interface INavigationRoute {
  name: string
  displayName: string
  meta: { icon: string; roles?: string[] }
  children?: INavigationRoute[]
}

export default {
  root: {
    name: '/',
    displayName: 'navigationRoutes.home',
  },
  routes: [
    {
      name: 'dashboard',
      displayName: 'menu.dashboard',
      meta: {
        icon: 'vuestic-iconset-dashboard',
        roles: ['ADMIN', 'THERAPIST'], // Accessible by ADMIN and THERAPIST
      },
    },
    {
      name: 'reservations',
      displayName: 'Consultations',
      meta: {
        icon: 'event_note',
        roles: ['THERAPIST'], // Accessible by THERAPIST only
      },
    },
    {
      name: 'slots',
      displayName: 'Disponibilités',
      meta: {
        icon: 'calendar_today',
        roles: ['THERAPIST'], // Accessible by THERAPIST only
      },
    },
    {
      name: 'users',
      displayName: 'menu.users',
      meta: {
        icon: 'group',
        roles: ['ADMIN'], // Accessible by ADMIN only
      },
    },
    {
      name: 'projects',
      displayName: 'menu.projects',
      meta: {
        icon: 'folder_shared',
        roles: ['ADMIN'], // Accessible by ADMIN only
      },
    },
    {
      name: 'payments',
      displayName: 'menu.payments',
      meta: {
        icon: 'credit_card',
        roles: ['ADMIN'], // Accessible by ADMIN only
      },
      children: [
        {
          name: 'payment-methods',
          displayName: 'menu.payment-methods',
          meta: {
            roles: ['ADMIN'], // Accessible by ADMIN only
          },
        },
        {
          name: 'pricing-plans',
          displayName: 'menu.pricing-plans',
          meta: {
            roles: ['ADMIN'], // Accessible by ADMIN only
          },
        },
        {
          name: 'billing',
          displayName: 'menu.billing',
          meta: {
            roles: ['ADMIN'], // Accessible by ADMIN only
          },
        },
      ],
    },
    {
      name: 'faq',
      displayName: 'menu.faq',
      meta: {
        icon: 'quiz',
        roles: ['THERAPIST', 'ADMIN'], // Accessible by ADMIN and THERAPIST
      },
    },
    {
      name: 'preferences',
      displayName: 'menu.preferences',
      meta: {
        icon: 'manage_accounts',
        roles: ['THERAPIST', 'ADMIN'], // Accessible by ADMIN and THERAPIST
      },
    },
    {
      name: 'settings',
      displayName: 'menu.settings',
      meta: {
        icon: 'settings',
        roles: ['THERAPIST', 'ADMIN'], // Accessible by ADMIN and THERAPIST
      },
    },
  ] as INavigationRoute[],
}
