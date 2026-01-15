import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import TimestampTool from '@/views/tools/TimestampTool.vue'
import JsonFormatter from '@/views/tools/JsonFormatter.vue'

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
    {
      path: '/json',
      name: 'json',
      component: JsonFormatter,
    },
  ],
})

export default router
