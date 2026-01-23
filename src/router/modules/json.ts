import { type RouteRecordRaw } from 'vue-router'
import { HomeGroup, type HomeRouteMeta } from '@/types/route'

const jsonRoutes: RouteRecordRaw[] = [
  {
    path: '/json-formatter',
    name: 'json-formatter',
    component: () => import('@/views/json/FormatterView.vue'),
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
    path: '/json-table',
    name: 'json-table',
    component: () => import('@/views/json/TableView.vue'),
    meta: {
      showOnHome: true,
      title: 'JSON 转表格',
      description: '将 JSON 数据转换为表格格式，并支持下载 CSV 文件',
      icon: 'M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z',
      color: 'purple',
      group: HomeGroup.JSON_TOOLS,
    } as HomeRouteMeta,
  },
  {
    path: '/json-yml',
    name: 'json-yml',
    component: () => import('@/views/json/YmlView.vue'),
    meta: {
      showOnHome: true,
      title: 'JSON YAML 转换',
      description: 'JSON 和 YAML 格式之间的转换工具，支持双向转换',
      icon: 'M12 6v6m0 0v6m0-6h6m-6 0H6',
      color: 'yellow',
      group: HomeGroup.JSON_TOOLS,
    } as HomeRouteMeta,
  },
  {
    path: '/json-diff',
    name: 'json-diff',
    component: () => import('@/views/json/DiffView.vue'),
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
    path: '/json-faker',
    name: 'json-faker',
    component: () => import('@/views/json/FakerView.vue'),
    meta: {
      showOnHome: true,
      title: 'Mock数据生成器',
      description: '使用faker-js/faker生成mock数据，支持自定义JSON结构',
      icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
      color: 'green',
      group: HomeGroup.JSON_TOOLS,
    } as HomeRouteMeta,
  },
]

export default jsonRoutes
