import { createRouter, createWebHistory } from 'vue-router'
import Budget from '../pages/Budget.vue'
import Analytics from '../pages/Analytics.vue'
import Add from '../pages/Add.vue'
import Expenses from '../pages/Expenses.vue'
import Settings from '../pages/Settings.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
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
      path: '/add',
      name: 'Add',
      component: Add,
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

export default router
