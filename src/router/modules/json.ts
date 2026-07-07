import { type RouteRecordRaw } from 'vue-router'
import { HomeGroup, type HomeRouteMeta } from '@/types/route'

const jsonRoutes: RouteRecordRaw[] = [
  {
    path: '/json-formatter',
    name: 'json-formatter',
    component: () => import('@/views/json/Formatter.vue'),
    meta: {
      showOnHome: true,
      title: 'JSON 格式化',
      description: 'JSON 格式化工具，支持格式化、压缩、高亮显示等功能',
      icon: 'M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.964-5.964a1 1 0 00-.707-.293l-5.964 5.964A1 1 0 003 16V7a2 2 0 012-2z',
      color: 'green',
      group: HomeGroup.JSON_TOOLS,
    } as HomeRouteMeta,
  },
  {
    path: '/json-converter',
    name: 'json-converter',
    component: () => import('@/views/json/Converter.vue'),
    meta: {
      showOnHome: true,
      title: 'JSON 转换工具',
      description: 'JSON 转表格、YAML、XML，一站式转换工具',
      icon: 'M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4',
      color: 'purple',
      group: HomeGroup.JSON_TOOLS,
    } as HomeRouteMeta,
  },
  {
    path: '/json-diff',
    name: 'json-diff',
    component: () => import('@/views/json/Diff.vue'),
    meta: {
      showOnHome: true,
      title: 'JSON 对比',
      description: '比较两个 JSON 的差异，高亮显示不同的部分',
      icon: 'M12 20h9M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z',
      color: 'blue',
      group: HomeGroup.JSON_TOOLS,
    } as HomeRouteMeta,
  },
  {
    path: '/json-mock',
    name: 'json-mock',
    component: () => import('@/views/json/Mock.vue'),
    meta: {
      showOnHome: true,
      title: 'Mock数据生成器',
      description: '使用faker-js/faker生成mock数据，支持自定义JSON结构',
      icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
      color: 'green',
      group: HomeGroup.JSON_TOOLS,
    } as HomeRouteMeta,
  },
  {
    path: '/json-codegen',
    name: 'json-codegen',
    component: () => import('@/views/json/Codegen.vue'),
    meta: {
      showOnHome: true,
      title: 'JSON 转结构体',
      description: '将 JSON 数据转换为各种编程语言的结构体定义',
      icon: 'M19 14l-7 7m0 0l-7-7m7 7V3',
      color: 'orange',
      group: HomeGroup.JSON_TOOLS,
    } as HomeRouteMeta,
  },
]

export default jsonRoutes
