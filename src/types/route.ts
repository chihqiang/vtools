// 定义工具分组枚举
export enum HomeGroup {
  JSON_TOOLS = 'JSON 工具',
  TEXT_TOOLS = '文本工具',
  IMAGE_TOOLS = '图片工具',
  DEVELOPMENT_TOOLS = '开发工具',
  CRYPTO_TOOLS = '加密工具',
  NETWORK_TOOLS = '网络工具',
  MEDIA_TOOLS = '媒体工具',
  UNGROUPED = '未分组',
}

// 定义工具分组顺序
export const GroupOrder: Record<HomeGroup, number> = (() => {
  const order: Record<HomeGroup, number> = {} as Record<HomeGroup, number>
  const groupValues = Object.values(HomeGroup).filter((v): v is HomeGroup => typeof v === 'string')
  // 为每个分组分配排序值，从大到小
  groupValues.forEach((group, index) => {
    if (group === HomeGroup.UNGROUPED) {
      order[group] = -1
    } else {
      order[group] = groupValues.length - index - 1
    }
  })
  return order
})()

// 定义路由元数据类型
export type HomeRouteMeta = {
  showOnHome?: boolean
  title?: string
  description?: string
  icon?: string
  color?: string
  group?: HomeGroup
}
