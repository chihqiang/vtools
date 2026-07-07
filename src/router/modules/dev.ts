import { type RouteRecordRaw } from 'vue-router'
import { HomeGroup, type HomeRouteMeta } from '@/types/route'

const devRoutes: RouteRecordRaw[] = [
  {
    path: '/dev-crontab',
    name: 'dev-crontab',
    component: () => import('@/views/dev/Crontab.vue'),
    meta: {
      showOnHome: true,
      title: 'Crontab 工具',
      description: 'Crontab 表达式解析、验证和执行时间生成工具',
      icon: 'M12 22c1.105 0 2-.895 2-2h-4c0 1.105.895 2 2 2zm6-6v-5c0-3.072-1.639-5.647-4.5-6.32V4c0-.828-.672-1.5-1.5-1.5s-1.5.672-1.5 1.5v.68C9.639 5.353 8 7.928 8 11v5l-2 2v1h16v-1l-2-2z',
      color: 'purple',
      group: HomeGroup.DEVELOPMENT_TOOLS,
    } as HomeRouteMeta,
  },
  {
    path: '/dev-chmod',
    name: 'dev-chmod',
    component: () => import('@/views/dev/Chmod.vue'),
    meta: {
      showOnHome: true,
      title: 'Chmod 权限计算器',
      description: 'Linux 文件权限计算工具，支持八进制和符号表示',
      icon: 'M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4',
      color: 'orange',
      group: HomeGroup.DEVELOPMENT_TOOLS,
    } as HomeRouteMeta,
  },
  {
    path: '/dev-sql-codegen',
    name: 'dev-sql-codegen',
    component: () => import('@/views/dev/SqlCodegen.vue'),
    meta: {
      showOnHome: true,
      title: 'SQL 转结构体',
      description: '将 SQL DDL 语句转换为 TypeScript / Go / GORM / XORM 结构体定义',
      icon: 'M4 7v10c0 2 1 3 3 3h10c2 0 3-1 3-3V7c0-2-1-3-3-3H7c-2 0-3 1-3 3zm2 3h12M7 12l2 2 4-4',
      color: 'indigo',
      group: HomeGroup.DEVELOPMENT_TOOLS,
    } as HomeRouteMeta,
  },
  {
    path: '/dev-timestamp',
    name: 'dev-timestamp',
    component: () => import('@/views/dev/Timestamp.vue'),
    meta: {
      showOnHome: true,
      title: '时间戳工具',
      description: '时间戳转换工具，支持秒级和毫秒级时间戳转换',
      icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
      color: 'blue',
      group: HomeGroup.DEVELOPMENT_TOOLS,
    } as HomeRouteMeta,
  },
]

export default devRoutes
