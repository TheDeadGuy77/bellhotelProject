import { createRouter, createWebHistory } from 'vue-router'
import Disconnected from '../views/Disconnected.vue'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'disconnected',
      component: Disconnected
    },
    {
      path: '/home',
      name: 'home',
      component: () => import('../views/Home.vue')
    }
  ]
})

export default router
