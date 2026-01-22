import { type RouteRecordRaw } from 'vue-router'
import { HomeGroup, type HomeRouteMeta } from '@/types/route'

const stringsRoutes: RouteRecordRaw[] = [
  {
    path: '/string-converter',
    name: 'string-converter',
    component: () => import('@/views/strings/ConverterView.vue'),
    meta: {
      showOnHome: true,
      title: '字符串转换',
      description: '字符串转换工具，支持多种转换方式',
      icon: 'M13 10V3L4 14h7v7l9-11h-7z',
      color: 'orange',
      group: HomeGroup.STRING_TOOLS,
    } as HomeRouteMeta,
  },
  {
    path: '/string-random',
    name: 'string-random',
    component: () => import('@/views/strings/RandomGenView.vue'),
    meta: {
      showOnHome: true,
      title: '随机字符串生成器',
      description: '生成安全的随机字符串，支持自定义长度和字符类型',
      icon: 'M15 7a2 2 0 012 2m2 0a2 2 0 01-2-2m2 0a2 2 0 01-2-2m2 0a2 2 0 01-2-2m2 0a2 2 0 01-2-2m2 0a2 2 0 01-2-2M9 7a2 2 0 012 2m2 0a2 2 0 01-2-2m2 0a2 2 0 01-2-2m2 0a2 2 0 01-2-2',
      color: 'blue',
      group: HomeGroup.STRING_TOOLS,
    } as HomeRouteMeta,
  },
  {
    path: '/string-diff',
    name: 'string-diff',
    component: () => import('@/views/strings/DiffView.vue'),
    meta: {
      showOnHome: true,
      title: '字符串对比',
      description: '比较两个字符串的差异，高亮显示不同的部分',
      icon: 'M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2-2v-2a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 012 2h2a2 2 0 012 2v2a2 2 0 012-2h-2a2 2 0 00-2-2V7a2 2 0 00-2 2zm0 5a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 01-1 1H9a1 1 0 01-1-1v-2a1 1 0 00-1-1H6a1 1 0 00-1 1v2a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 00-1-1H6a1 1 0 00-1 1v2a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 00-1-1H6a1 1 0 00-1 1v2a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 00-1-1H6a1 1 0 00-1 1v2a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 00-1-1H6a1 1 0 00-1 1v2a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 00-1-1H6a1 1 0 00-1 1v2a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 00-1-1H6a1 1 0 00-1 1v2a1 1 0 001 1z',
      color: 'cyan',
      group: HomeGroup.STRING_TOOLS,
    } as HomeRouteMeta,
  },
  {
    path: '/strings-regex',
    name: 'strings-regex',
    component: () => import('@/views/strings/RegexView.vue'),
    meta: {
      showOnHome: true,
      title: '正则表达式工具',
      description: '测试、验证和生成正则表达式',
      icon: 'M12 15a3 3 0 100-6 3 3 0 000 6z',
      color: 'purple',
      group: HomeGroup.STRING_TOOLS,
    } as HomeRouteMeta,
  },
]

export default stringsRoutes
