import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import TimestampTool from '@/views/tools/TimestampTool.vue'
import JsonFormatter from '@/views/tools/JsonFormatter.vue'
import JsonToTable from '@/views/tools/JsonToTable.vue'

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
    {
      path: '/json-to-table',
      name: 'json-to-table',
      component: JsonToTable,
    },
  ],
})

export default router
