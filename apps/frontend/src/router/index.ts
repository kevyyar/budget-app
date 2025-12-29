import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import Budget from '../pages/Budget.vue'
import Analytics from '../pages/Analytics.vue'
import Expenses from '../pages/Expenses.vue'
import Settings from '../pages/Settings.vue'
import Login from '../pages/Login.vue'
import Signup from '../pages/Signup.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: Login,
      meta: { public: true },
    },
    {
      path: '/signup',
      name: 'Signup',
      component: Signup,
      meta: { public: true },
    },
    {
      path: '/budget',
      name: 'Budget',
      component: Budget,
    },
    {
      path: '/analytics',
      name: 'Analytics',
      component: Analytics,
    },
    {
      path: '/expenses',
      name: 'Expenses',
      component: Expenses,
    },
    {
      path: '/settings',
      name: 'Settings',
      component: Settings,
    },
    {
      path: '/',
      redirect: '/budget',
    },
  ],
})

router.beforeEach(async (to) => {
  const auth = useAuthStore()

  if (!auth.initialized) {
    await auth.init()
  }

  if (!to.meta.public && !auth.isAuthenticated) {
    return '/login'
  }

  if (to.meta.public && auth.isAuthenticated) {
    return '/budget'
  }
})

export default router
