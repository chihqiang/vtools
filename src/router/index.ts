import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import TimestampTool from '@/views/TimestampTool.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/timestamp',
      name: 'timestamp',
      component: TimestampTool,
    },
  ],
})

export default router
