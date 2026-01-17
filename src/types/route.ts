// 定义工具分组枚举
export enum HomeGroup {
  JSON_TOOLS = 'JSON 工具',
  STRING_TOOLS = '字符串工具',
  ENCRYPTION_TOOLS = '加密解密工具',
  IMAGE_TOOLS = '图片工具',
  DEVELOPMENT_TOOLS = '开发工具',
  NETWORK_TOOLS = '网络工具',
  UNGROUPED = '未分组',
}

// 定义工具分组顺序
export const GroupOrder: Record<HomeGroup, number> = {
  [HomeGroup.JSON_TOOLS]: 99,
  [HomeGroup.STRING_TOOLS]: 88,
  [HomeGroup.IMAGE_TOOLS]: 77,
  [HomeGroup.DEVELOPMENT_TOOLS]: 66,
  [HomeGroup.ENCRYPTION_TOOLS]: 55,
  [HomeGroup.NETWORK_TOOLS]: 44,
  [HomeGroup.UNGROUPED]: -1,
}

// 定义路由元数据类型
export type HomeRouteMeta = {
  showOnHome?: boolean
  title?: string
  description?: string
  icon?: string
  color?: string
  group?: HomeGroup
}
