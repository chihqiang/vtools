import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import TimestampTool from '@/views/tools/TimestampTool.vue'
import JsonFormatter from '@/views/tools/JsonFormatter.vue'
import JsonToTable from '@/views/tools/JsonToTable.vue'
import CaseConverter from '@/views/tools/CaseConverter.vue'
import EncryptionTool from '@/views/tools/EncryptionTool.vue'

// 定义路由元数据类型
type RouteMeta = {
  showOnHome?: boolean
  title?: string
  description?: string
  icon?: string
  color?: string
}

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
      meta: {
        showOnHome: true,
        title: '时间戳工具',
        description: '时间戳转换工具，支持秒级和毫秒级时间戳转换',
        icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
        color: 'blue'
      } as RouteMeta
    },
    {
      path: '/json',
      name: 'json',
      component: JsonFormatter,
      meta: {
        showOnHome: true,
        title: 'JSON 格式化',
        description: 'JSON 格式化工具，支持格式化、压缩、高亮显示等功能',
        icon: 'M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.964-5.964a1 1 0 00-.707-.293l-5.964 5.964A1 1 0 003 16V7a2 2 0 012-2z',
        color: 'green'
      } as RouteMeta
    },
    {
      path: '/json-to-table',
      name: 'json-to-table',
      component: JsonToTable,
      meta: {
        showOnHome: true,
        title: 'JSON 转表格',
        description: '将 JSON 数据转换为表格格式，并支持下载 CSV 文件',
        icon: 'M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z',
        color: 'purple'
      } as RouteMeta
    },
    {
      path: '/case-converter',
      name: 'case-converter',
      component: CaseConverter,
      meta: {
        showOnHome: true,
        title: '大小写转换',
        description: '英文字母大小写转换工具，支持多种转换方式',
        icon: 'M13 10V3L4 14h7v7l9-11h-7z',
        color: 'orange'
      } as RouteMeta
    },
    {
      path: '/encryption',
      name: 'encryption',
      component: EncryptionTool,
      meta: {
        showOnHome: true,
        title: '加密解密工具',
        description: '支持Base64、URL编码解码和MD5加密',
        icon: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z',
        color: 'red'
      } as RouteMeta
    },
  ],
})

export default router
