/**
 * 获取当前时间，格式为年月日时分秒
 * @returns {string} 格式化后的当前时间字符串，如 "20231231235959"
 * @example
 * getCurrentDateTime() // "20231231235959"
 */
export const getCurrentDateTime = (): string => {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  const hour = String(now.getHours()).padStart(2, '0')
  const minute = String(now.getMinutes()).padStart(2, '0')
  const second = String(now.getSeconds()).padStart(2, '0')
  return `${year}${month}${day}${hour}${minute}${second}`
}

/**
 * 将秒数格式化为可读的持续时间字符串
 * @param {number} seconds - 秒数
 * @returns {string} 格式化后的持续时间字符串，如 "1天 2小时 3分钟 4秒"
 * @example
 * formatDuration(86400) // "1天"
 * formatDuration(3661)  // "1小时 1分钟 1秒"
 * formatDuration(60)    // "1分钟"
 * formatDuration(0)     // "0秒"
 */
export const formatDuration = (seconds: number) => {
  const days = Math.floor(seconds / 86400)
  const hours = Math.floor((seconds % 86400) / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60

  const parts = []
  if (days > 0) parts.push(`${days}天`)
  if (hours > 0) parts.push(`${hours}小时`)
  if (minutes > 0) parts.push(`${minutes}分钟`)
  if (secs > 0 || parts.length === 0) parts.push(`${secs}秒`)

  return parts.join(' ')
}

/**
 * 将时间戳格式化为可读的日期时间字符串
 * @param {number} timestamp - Unix时间戳（秒）
 * @returns {string} 格式化后的日期时间字符串，如 "2023-12-31 23:59:59"
 * @example
 * formatTimestamp(1704067199) // "2023-12-31 23:59:59"
 * formatTimestamp(0)           // "1970-01-01 08:00:00" (UTC+8时区)
 */
export const formatTimestamp = (timestamp: number) => {
  const date = new Date(timestamp * 1000)
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  })
}

// ==================== 农历转换模块 ====================
// 农历数据 1900-2100年
// 每个元素是16进制数：前4位表示闰月月份(0无闰月)，后12位每位表示农历月份的大小月(0小月29天，1大月30天)
export const lunarInfo = [
  0x04bd8, 0x04ae0, 0x0a570, 0x054d5, 0x0d260, 0x0d950, 0x16554, 0x056a0, 0x09ad0, 0x055d2, 0x04ae0,
  0x0a5b6, 0x0a4d0, 0x0d250, 0x1d255, 0x0b540, 0x0d6a0, 0x0ada2, 0x095b0, 0x14977, 0x04970, 0x0a4b0,
  0x0b4b5, 0x06a50, 0x06d40, 0x1ab54, 0x02b60, 0x09570, 0x052f2, 0x04970, 0x06566, 0x0d4a0, 0x0ea50,
  0x06e95, 0x05ad0, 0x02b60, 0x186e3, 0x092e0, 0x1c8d7, 0x0c950, 0x0d4a0, 0x1d8a6, 0x0b550, 0x056a0,
  0x1a5b4, 0x025d0, 0x092d0, 0x0d2b2, 0x0a950, 0x0b557, 0x06ca0, 0x0b550, 0x15355, 0x04da0, 0x0a5b0,
  0x14573, 0x052b0, 0x0a9a8, 0x0e950, 0x06aa0, 0x0aea6, 0x0ab50, 0x04b60, 0x0aae4, 0x0a570, 0x05260,
  0x0f263, 0x0d950, 0x05b57, 0x056a0, 0x096d0, 0x04dd5, 0x04ad0, 0x0a4d0, 0x0d4d4, 0x0d250, 0x0d558,
  0x0b540, 0x0b6a0, 0x195a6, 0x095b0, 0x049b0, 0x0a974, 0x0a4b0, 0x0b27a, 0x06a50, 0x06d40, 0x0af46,
  0x0ab60, 0x09570, 0x04af5, 0x04970, 0x064b0, 0x074a3, 0x0ea50, 0x06b58, 0x05ac0, 0x0ab60, 0x096d5,
  0x092e0, 0x0c960, 0x0d954, 0x0d4a0, 0x0da50, 0x07552, 0x056a0, 0x0abb7, 0x025d0, 0x092d0, 0x0cab5,
  0x0a950, 0x0b4a0, 0x0baa4, 0x0ad50, 0x055d9, 0x04ba0, 0x0a5b0, 0x15176, 0x052b0, 0x0a930, 0x07954,
  0x06aa0, 0x0ad50, 0x05b52, 0x04b60, 0x0a6e6, 0x0a4e0, 0x0d260, 0x0ea65, 0x0d530, 0x05aa0, 0x076a3,
  0x096d0, 0x04afb, 0x04ad0, 0x0a4d0, 0x1d0b6, 0x0d250, 0x0d520, 0x0dd45, 0x0b5a0, 0x056d0, 0x055b2,
  0x049b0, 0x0a577, 0x0a4b0, 0x0aa50, 0x1b255, 0x06d20, 0x0ada0, 0x14b63, 0x09370, 0x049f8, 0x04970,
  0x064b0, 0x168a6, 0x0ea50, 0x06b20, 0x1a6c4, 0x0aae0, 0x0a2e0, 0x0d2e3, 0x0c960, 0x0d557, 0x0d4a0,
  0x0da50, 0x05d55, 0x056a0, 0x0a6d0, 0x055d4, 0x052d0, 0x0a9b8, 0x0a950, 0x0b4a0, 0x0b6a6, 0x0ad50,
  0x055a0, 0x0aba4, 0x0a5b0, 0x052b0, 0x0b273, 0x06930, 0x07337, 0x06aa0, 0x0ad50, 0x14b55, 0x04b60,
  0x0a570, 0x054e4, 0x0d160, 0x0e968, 0x0d520, 0x0daa0, 0x16aa6, 0x056d0, 0x04ae0, 0x0a9d4, 0x0a2d0,
  0x0d150, 0x0f252, 0x0d520,
]

// 农历天干
export const Gan = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸']
// 农历地支
export const Zhi = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥']
// 农历生肖
export const Animals = ['鼠', '牛', '虎', '兔', '龙', '蛇', '马', '羊', '猴', '鸡', '狗', '猪']
// 农历月份
export const LunarMonth = ['正', '二', '三', '四', '五', '六', '七', '八', '九', '十', '冬', '腊']
// 农历日期
export const LunarDay = [
  '初一',
  '初二',
  '初三',
  '初四',
  '初五',
  '初六',
  '初七',
  '初八',
  '初九',
  '初十',
  '十一',
  '十二',
  '十三',
  '十四',
  '十五',
  '十六',
  '十七',
  '十八',
  '十九',
  '二十',
  '廿一',
  '廿二',
  '廿三',
  '廿四',
  '廿五',
  '廿六',
  '廿七',
  '廿八',
  '廿九',
  '三十',
]

/**
 * 获取农历年份的天数
 * @param {number} y - 农历年份
 * @returns {number} 农历年份的总天数
 */
export function lunarYearDays(y: number): number {
  let i: number,
    sum = 348
  const lunarData = lunarInfo[y - 1900] || 0
  for (i = 0x8000; i > 0x8; i >>= 1) {
    sum += lunarData & i ? 1 : 0
  }
  return sum + leapDays(y)
}

/**
 * 获取农历闰月的天数
 * @param {number} y - 农历年份
 * @returns {number} 农历闰月的天数（29或30）
 */
export function leapDays(y: number): number {
  if (leapMonth(y)) {
    const lunarData = lunarInfo[y - 1900] || 0
    return lunarData & 0x10000 ? 30 : 29
  } else {
    return 0
  }
}

/**
 * 获取农历闰月月份
 * @param {number} y - 农历年份
 * @returns {number} 农历闰月月份（0表示无闰月）
 */
export function leapMonth(y: number): number {
  const lunarData = lunarInfo[y - 1900] || 0
  return lunarData & 0xf
}

/**
 * 获取农历月份的天数
 * @param {number} y - 农历年份
 * @param {number} m - 农历月份
 * @returns {number} 农历月份的天数（29或30）
 */
export function monthDays(y: number, m: number): number {
  const lunarData = lunarInfo[y - 1900] || 0
  return lunarData & (0x10000 >> m) ? 30 : 29
}

/**
 * 农历结果接口
 * @interface LunarResult
 * @property {number} lYear - 农历年份
 * @property {number} lMonth - 农历月份
 * @property {number} lDay - 农历日期
 * @property {boolean} isLeap - 是否为闰月
 * @property {string} shengxiao - 生肖
 * @property {string} ganZhiYear - 年天干地支
 * @property {string} lunarMonthStr - 农历月份字符串（如：正月、闰二月等）
 * @property {string} lunarDayStr - 农历日期字符串（如：初一、初二等）
 */
export interface LunarResult {
  lYear: number
  lMonth: number
  lDay: number
  isLeap: boolean
  shengxiao: string
  ganZhiYear: string
  lunarMonthStr: string
  lunarDayStr: string
}

/**
 * 公历转农历函数
 * @param {number} y - 公历年
 * @param {number} m - 公历月
 * @param {number} d - 公历日
 * @returns {LunarResult} 农历信息
 * @description 该函数通过计算公历日期与1900年1月31日的天数差，
 * 然后根据农历数据（lunarInfo）推算出对应的农历日期、月份、年份等信息。
 */
export function solar2lunar(y: number, m: number, d: number): LunarResult {
  let i: number,
    leap = 0,
    temp = 0
  // 计算目标日期与1900年1月31日的天数差
  let offset = (Date.UTC(y, m - 1, d) - Date.UTC(1900, 0, 31)) / 86400000

  // 计算农历年份
  for (i = 1900; i < 2101 && offset > 0; i++) {
    temp = lunarYearDays(i) // 获取当年农历总天数
    offset -= temp // 减去当年天数
  }

  // 调整年份和剩余天数
  if (offset < 0) {
    offset += temp
    i--
  }

  const year = i
  leap = leapMonth(i) // 获取当年闰月信息
  let isLeap = false

  // 计算农历月份
  for (i = 1; i < 13 && offset > 0; i++) {
    // 处理闰月
    if (leap > 0 && i == leap + 1 && isLeap == false) {
      --i
      isLeap = true
      temp = leapDays(year) // 获取闰月天数
    } else {
      temp = monthDays(year, i) // 获取普通月份天数
    }

    // 结束闰月处理
    if (isLeap == true && i == leap + 1) isLeap = false

    offset -= temp // 减去当月天数
  }

  // 调整月份和剩余天数（处理边界情况）
  if (offset == 0 && leap > 0 && i == leap + 1) {
    if (isLeap) {
      isLeap = false
    } else {
      isLeap = true
      --i
    }
  }

  // 调整月份和剩余天数
  if (offset < 0) {
    offset += temp
    --i
  }

  const month = i
  const day = offset + 1 // 计算农历日期

  // 计算生肖和天干地支
  const shengxiaoIndex = (year - 4) % 12 // 生肖索引（以1900年为基准）
  const shengxiao = Animals[shengxiaoIndex] || '' // 获取生肖
  const ganIndex = (year - 4) % 10 // 年干索引
  const zhiIndex = (year - 4) % 12 // 年支索引
  const ganZhiYear = (Gan[ganIndex] || '') + (Zhi[zhiIndex] || '') // 年天干地支
  const lunarMonthStr = (isLeap ? '闰' : '') + (LunarMonth[month - 1] || '') + '月' // 农历月份字符串
  const lunarDayStr = LunarDay[day - 1] || '' // 农历日期字符串

  return {
    lYear: year,
    lMonth: month,
    lDay: day,
    isLeap: isLeap,
    shengxiao: shengxiao,
    ganZhiYear: ganZhiYear,
    lunarMonthStr: lunarMonthStr,
    lunarDayStr: lunarDayStr,
  }
}

/**
 * 获取天干地支年月日字符串
 * @param {Date} date - 日期对象
 * @returns {string} 天干地支年月日字符串
 * @description 该函数计算并返回指定日期的年、月、日天干地支组合
 */
export function getGanZhiString(date: Date): string {
  const lunar = solar2lunar(date.getFullYear(), date.getMonth() + 1, date.getDate())

  // 计算月干（根据年干推算）
  const yearGanIdx = (lunar.lYear - 4) % 10 // 年干索引
  // 月干基数表：甲己之年丙作首，乙庚之岁戊为头，丙辛必定寻庚起，丁壬壬位顺行流，戊癸何方发，甲寅之上好追求
  const monthGanBase = [2, 4, 6, 8, 0, 2, 4, 6, 8, 0] // 甲己之年丙作首
  const monthGanBaseValue = monthGanBase[yearGanIdx] || 0
  const monthGanIdx = (monthGanBaseValue + lunar.lMonth - 1) % 10 // 月干索引

  // 计算日干（基于公历日期的偏移）
  const baseDate = new Date(1900, 0, 31) // 1900年1月31日为甲戌日
  const dayOffset = Math.floor((date.getTime() - baseDate.getTime()) / 86400000) // 天数偏移
  const dayGanIdx = (dayOffset + 6) % 10 // 甲=0，从甲戌日开始

  // 月支：寅月为正月
  const monthZhiIdx = (lunar.lMonth + 1) % 12 // 寅月为正月

  // 日支：从甲戌日开始计算
  const dayZhiIdx = (dayOffset + 10) % 12 // 戌=10

  const ganZhiYear = lunar.ganZhiYear // 年天干地支
  const ganZhiMonth = (Gan[monthGanIdx] || '') + (Zhi[monthZhiIdx] || '') // 月天干地支
  const ganZhiDay = (Gan[dayGanIdx] || '') + (Zhi[dayZhiIdx] || '') // 日天干地支

  return ganZhiYear + ' ' + ganZhiMonth + ' ' + ganZhiDay
}

// ==================== 黄历宜忌模块 ====================
// 黄历宜忌数据
/**
 * 黄历宜事项数组
 * 包含各种适宜的活动，如嫁娶、祭祀、祈福等
 */
export const almanacYi = [
  '嫁娶',
  '祭祀',
  '祈福',
  '求嗣',
  '动土',
  '移徙',
  '纳财',
  '开市',
  '交易',
  '立券',
  '纳采',
  '问名',
  '纳吉',
  '纳征',
  '请期',
  '出行',
  '修造',
  '开渠',
  '掘井',
  '作灶',
  '扫舍',
  '破土',
  '安葬',
  '修坟',
  '立券',
  '交易',
  '纳财',
  '开市',
  '动土',
  '祈福',
  '订盟',
  '纳采',
  '嫁娶',
  '出行',
  '移徙',
  '纳财',
  '开市',
  '交易',
  '立券',
  '修造',
  '动土',
  '祈福',
  '安床',
  '作灶',
  '祭祀',
  '沐浴',
  '扫舍',
  '修坟',
  '安葬',
  '破土',
  '入宅',
  '安香',
  '安门',
  '修造',
  '动土',
  '祈福',
  '求嗣',
  '纳财',
  '开市',
  '交易',
  '订盟',
  '纳采',
  '嫁娶',
  '祭祀',
  '出行',
  '移徙',
  '纳财',
  '开市',
  '交易',
  '立券',
  '修造',
  '动土',
  '祈福',
  '安床',
  '作灶',
  '扫舍',
  '破土',
  '安葬',
  '修坟',
  '祭祀',
]

/**
 * 黄历忌事项数组
 * 包含各种不宜的活动，如破土、安葬、开渠等
 */
export const almanacJi = [
  '破土',
  '安葬',
  '开渠',
  '掘井',
  '作灶',
  '伐木',
  '作梁',
  '安门',
  '安床',
  '祭祀',
  '出行',
  '移徙',
  '修造',
  '动土',
  '开市',
  '交易',
  '立券',
  '纳财',
  '嫁娶',
  '纳采',
  '祈福',
  '求嗣',
  '订盟',
  '纳吉',
  '请期',
  '扫舍',
  '修坟',
  '祭祀',
  '纳财',
  '开市',
  '交易',
  '立券',
  '动土',
  '修造',
  '安床',
  '作灶',
  '出行',
  '移徙',
  '嫁娶',
  '订盟',
  '祭祀',
  '祈福',
  '求嗣',
  '纳采',
  '问名',
  '纳吉',
  '纳征',
  '请期',
  '破土',
  '安葬',
  '开市',
  '交易',
  '立券',
  '纳财',
  '动土',
  '修造',
  '开渠',
  '掘井',
  '作灶',
  '伐木',
  '出行',
  '移徙',
  '安门',
  '安香',
  '入宅',
  '修坟',
  '扫舍',
  '祭祀',
  '纳采',
  '嫁娶',
  '订盟',
  '问名',
  '纳吉',
  '纳征',
  '请期',
  '开市',
  '交易',
  '立券',
  '动土',
  '修造',
]

// 五行宜忌
/**
 * 五行宜事项映射
 * 不同五行对应的适宜活动
 */
export const wuxingYi: Record<string, string[]> = {
  金: ['祭祀', '沐浴', '修饰', '整容', '纳财', '开市', '交易', '立券', '纳采', '问名'],
  木: ['嫁娶', '纳采', '订盟', '问名', '纳吉', '纳征', '请期', '嫁娶', '开市', '交易'],
  水: ['出行', '移徙', '修造', '动土', '祈福', '求嗣', '纳财', '开市', '交易', '立券'],
  火: ['动土', '祈福', '求嗣', '纳财', '开市', '交易', '立券', '修造', '作灶', '安床'],
  土: ['破土', '安葬', '修坟', '祭祀', '扫舍', '平治道涂', '修造', '动土', '开渠', '掘井'],
}

/**
 * 五行忌事项映射
 * 不同五行对应的不宜活动
 */
export const wuxingJi: Record<string, string[]> = {
  金: ['动土', '修造', '伐木', '作梁', '开渠', '掘井', '破土', '安葬', '修坟', '出行'],
  木: ['破土', '安葬', '开渠', '掘井', '作灶', '伐木', '修造', '动土', '祭祀', '出行'],
  水: ['嫁娶', '订盟', '纳采', '问名', '纳吉', '纳征', '请期', '祭祀', '祈福', '求嗣'],
  火: ['出行', '移徙', '嫁娶', '订盟', '纳采', '问名', '开市', '交易', '立券', '纳财'],
  土: ['出行', '移徙', '嫁娶', '订盟', '纳采', '问名', '开市', '交易', '立券', '祭祀'],
}

/**
 * 根据日期计算五行
 * @param {number} year - 年份
 * @param {number} month - 月份
 * @param {number} day - 日期
 * @returns {string} 五行属性（金、木、水、火、土）
 */
export function getDayWuxing(year: number, month: number, day: number): string {
  const wuxing = ['金', '木', '水', '火', '土']
  const idx = (year + month + day) % 5 // 根据年月日计算五行索引
  return wuxing[idx] || '金' // 返回五行属性，默认金
}

/**
 * 获取黄历宜忌
 * @param {Date} date - 日期对象
 * @returns {Object} 包含宜和忌事项的对象
 * @description 该函数根据日期计算黄历宜和忌事项，
 * 结合农历日期和五行属性来确定适宜和不宜的活动。
 */
export function getAlmanac(date: Date): { yi: string; ji: string } {
  const lunar = solar2lunar(date.getFullYear(), date.getMonth() + 1, date.getDate())
  const dayIndex = (lunar.lMonth * lunar.lDay) % almanacYi.length // 计算日期索引
  const wuxing = getDayWuxing(lunar.lYear, lunar.lMonth, lunar.lDay) // 获取五行属性

  // 从宜忌数组中选取事项
  const yiItems: string[] = []
  const jiItems: string[] = []

  // 基于日期的宜忌：选取当前日期及后续两天的宜事项
  yiItems.push(almanacYi[dayIndex] || '')
  yiItems.push(almanacYi[(dayIndex + 1) % almanacYi.length] || '')
  yiItems.push(almanacYi[(dayIndex + 2) % almanacYi.length] || '')

  // 基于日期的宜忌：选取当前日期及后续两天的忌事项
  jiItems.push(almanacJi[dayIndex] || '')
  jiItems.push(almanacJi[(dayIndex + 1) % almanacJi.length] || '')
  jiItems.push(almanacJi[(dayIndex + 2) % almanacJi.length] || '')

  // 基于五行的宜忌：选取对应五行的宜事项
  const wuxingYiList = wuxingYi[wuxing] || []
  const wuxingJiList = wuxingJi[wuxing] || []

  yiItems.push(wuxingYiList[0] || '') // 添加五行宜事项
  jiItems.push(wuxingJiList[0] || '') // 添加五行忌事项

  // 去重并限制数量，过滤空字符串
  const uniqueYiItems = [...new Set(yiItems.filter((item) => item))].slice(0, 5) // 去重，最多保留5项
  const uniqueJiItems = [...new Set(jiItems.filter((item) => item))].slice(0, 5) // 去重，最多保留5项

  return {
    yi: uniqueYiItems.join('、'), // 宜事项，用顿号分隔
    ji: uniqueJiItems.join('、'), // 忌事项，用顿号分隔
  }
}

export const timezeros = [
  { value: 'local', label: '本地时区', shortLabel: '本地时区' },
  {
    value: 'Etc/GMT+12',
    label: 'Etc/GMT+12 (UTC-12:00) 国际日期变更线西',
    shortLabel: 'UTC-12:00',
  },
  { value: 'Etc/GMT+11', label: 'Etc/GMT+11 (UTC-11:00) 协调世界时-11', shortLabel: 'UTC-11:00' },
  {
    value: 'Pacific/Honolulu',
    label: 'Pacific/Honolulu (UTC-10:00) 夏威夷',
    shortLabel: 'UTC-10:00 夏威夷',
  },
  {
    value: 'Pacific/Gambier',
    label: 'Pacific/Gambier (UTC-09:00) 法属波利尼西亚甘比尔群岛',
    shortLabel: 'UTC-09:00',
  },
  {
    value: 'America/Santa_Isabel',
    label: 'America/Santa_Isabel (UTC-08:00) 下加利福尼亚州',
    shortLabel: 'UTC-08:00',
  },
  {
    value: 'America/Los_Angeles',
    label: 'America/Los_Angeles (UTC-08:00) 太平洋时间（美国和加拿大）',
    shortLabel: 'UTC-08:00 洛杉矶',
  },
  {
    value: 'America/Phoenix',
    label: 'America/Phoenix (UTC-07:00) 亚利桑那',
    shortLabel: 'UTC-07:00 亚利桑那',
  },
  {
    value: 'America/Denver',
    label: 'America/Denver (UTC-07:00) 山地时间（美国和加拿大）',
    shortLabel: 'UTC-07:00 丹佛',
  },
  {
    value: 'America/Guatemala',
    label: 'America/Guatemala (UTC-06:00) 中美洲',
    shortLabel: 'UTC-06:00 中美洲',
  },
  {
    value: 'America/Chicago',
    label: 'America/Chicago (UTC-06:00) 中部时间（美国和加拿大）',
    shortLabel: 'UTC-06:00 芝加哥',
  },
  {
    value: 'America/Regina',
    label: 'America/Regina (UTC-06:00) 萨斯喀彻温',
    shortLabel: 'UTC-06:00',
  },
  {
    value: 'America/Mexico_City',
    label: 'America/Mexico_City (UTC-06:00) 瓜达拉哈拉,墨西哥城,蒙特雷',
    shortLabel: 'UTC-06:00 墨西哥城',
  },
  {
    value: 'America/Bogota',
    label: 'America/Bogota (UTC-05:00) 波哥大,利马,基多',
    shortLabel: 'UTC-05:00 波哥大',
  },
  {
    value: 'America/Indiana/Indianapolis',
    label: 'America/Indiana/Indianapolis (UTC-05:00) 印地安那州（东部）',
    shortLabel: 'UTC-05:00 印第安纳',
  },
  {
    value: 'America/New_York',
    label: 'America/New_York (UTC-05:00) 东部时间（美国和加拿大）',
    shortLabel: 'UTC-05:00 纽约',
  },
  {
    value: 'America/Halifax',
    label: 'America/Halifax (UTC-04:00) 大西洋时间（加拿大）',
    shortLabel: 'UTC-04:00 哈利法克斯',
  },
  {
    value: 'America/Asuncion',
    label: 'America/Asuncion (UTC-04:00) 亚松森',
    shortLabel: 'UTC-04:00 亚松森',
  },
  {
    value: 'America/La_Paz',
    label: 'America/La_Paz (UTC-04:00) 乔治敦,拉巴斯,马瑙斯,圣胡安',
    shortLabel: 'UTC-04:00',
  },
  { value: 'America/Cuiaba', label: 'America/Cuiaba (UTC-04:00) 库亚巴', shortLabel: 'UTC-04:00' },
  {
    value: 'America/St_Johns',
    label: 'America/St_Johns (UTC-03:30) 纽芬兰',
    shortLabel: 'UTC-03:30 纽芬兰',
  },
  {
    value: 'America/Sao_Paulo',
    label: 'America/Sao_Paulo (UTC-03:00) 巴西利亚',
    shortLabel: 'UTC-03:00 圣保罗',
  },
  {
    value: 'America/Godthab',
    label: 'America/Godthab (UTC-03:00) 格陵兰',
    shortLabel: 'UTC-03:00 格陵兰',
  },
  {
    value: 'America/Cayenne',
    label: 'America/Cayenne (UTC-03:00) 卡宴,福塔雷萨',
    shortLabel: 'UTC-03:00',
  },
  {
    value: 'America/Argentina/Buenos_Aires',
    label: 'America/Argentina/Buenos_Aires (UTC-03:00) 布宜诺斯艾利斯',
    shortLabel: 'UTC-03:00 布宜诺斯艾利斯',
  },
  {
    value: 'America/Montevideo',
    label: 'America/Montevideo (UTC-03:00) 蒙得维的亚',
    shortLabel: 'UTC-03:00 蒙得维的亚',
  },
  { value: 'Etc/GMT+2', label: 'Etc/GMT+2 (UTC-02:00) 协调世界时-2', shortLabel: 'UTC-02:00' },
  {
    value: 'Atlantic/Azores',
    label: 'Atlantic/Azores (UTC-01:00) 亚速尔群岛',
    shortLabel: 'UTC-01:00 亚速尔',
  },
  {
    value: 'Africa/Casablanca',
    label: 'Africa/Casablanca (UTC+00:00) 卡萨布兰卡',
    shortLabel: 'UTC+00:00 卡萨布兰卡',
  },
  {
    value: 'Atlantic/Reykjavik',
    label: 'Atlantic/Reykjavik (UTC+00:00) 蒙罗维亚,雷克雅未克',
    shortLabel: 'UTC+00:00 雷克雅未克',
  },
  { value: 'Etc/GMT', label: 'Etc/GMT (UTC+00:00) 协调世界时', shortLabel: 'UTC+00:00 协调世界时' },
  {
    value: 'Europe/Berlin',
    label: 'Europe/Berlin (UTC+01:00) 阿姆斯特丹，柏林，伯尔尼，罗马，斯德哥尔摩，维也纳',
    shortLabel: 'UTC+01:00 柏林',
  },
  {
    value: 'Europe/Paris',
    label: 'Europe/Paris (UTC+01:00) 布鲁塞尔，哥本哈根，马德里，巴黎',
    shortLabel: 'UTC+01:00 巴黎',
  },
  {
    value: 'Africa/Lagos',
    label: 'Africa/Lagos (UTC+01:00) 中非西部',
    shortLabel: 'UTC+01:00 拉各斯',
  },
  {
    value: 'Europe/Budapest',
    label: 'Europe/Budapest (UTC+01:00) 贝尔格莱德，布拉迪斯拉发，布达佩斯，卢布尔雅那，布拉格',
    shortLabel: 'UTC+01:00 布达佩斯',
  },
  {
    value: 'Europe/Warsaw',
    label: 'Europe/Warsaw (UTC+01:00) 萨拉热窝，斯科普里，华沙，萨格勒布',
    shortLabel: 'UTC+01:00 华沙',
  },
  {
    value: 'Europe/Istanbul',
    label: 'Europe/Istanbul (UTC+02:00) 雅典，布加勒斯特，伊斯坦布尔',
    shortLabel: 'UTC+02:00 伊斯坦布尔',
  },
  { value: 'Africa/Cairo', label: 'Africa/Cairo (UTC+02:00) 开罗', shortLabel: 'UTC+02:00 开罗' },
  {
    value: 'Asia/Damascus',
    label: 'Asia/Damascus (UTC+02:00) 大马士革',
    shortLabel: 'UTC+02:00 大马士革',
  },
  { value: 'Asia/Amman', label: 'Asia/Amman (UTC+02:00) 安曼', shortLabel: 'UTC+02:00 安曼' },
  {
    value: 'Africa/Johannesburg',
    label: 'Africa/Johannesburg (UTC+02:00) 哈拉雷，比勒陀利亚',
    shortLabel: 'UTC+02:00 约翰内斯堡',
  },
  {
    value: 'Asia/Jerusalem',
    label: 'Asia/Jerusalem (UTC+02:00) 耶路撒冷',
    shortLabel: 'UTC+02:00 耶路撒冷',
  },
  { value: 'Asia/Beirut', label: 'Asia/Beirut (UTC+02:00) 贝鲁特', shortLabel: 'UTC+02:00 贝鲁特' },
  {
    value: 'Asia/Baghdad',
    label: 'Asia/Baghdad (UTC+03:00) 巴格达',
    shortLabel: 'UTC+03:00 巴格达',
  },
  {
    value: 'Europe/Minsk',
    label: 'Europe/Minsk (UTC+03:00) 明斯克',
    shortLabel: 'UTC+03:00 明斯克',
  },
  { value: 'Asia/Riyadh', label: 'Asia/Riyadh (UTC+03:00) 利雅得', shortLabel: 'UTC+03:00 利雅得' },
  {
    value: 'Africa/Nairobi',
    label: 'Africa/Nairobi (UTC+03:00) 内罗毕',
    shortLabel: 'UTC+03:00 内罗毕',
  },
  { value: 'Asia/Tehran', label: 'Asia/Tehran (UTC+03:30) 德黑兰', shortLabel: 'UTC+03:30 德黑兰' },
  {
    value: 'Europe/Moscow',
    label: 'Europe/Moscow (UTC+04:00) 莫斯科，圣彼得堡，伏尔加格勒',
    shortLabel: 'UTC+04:00 莫斯科',
  },
  {
    value: 'Asia/Tbilisi',
    label: 'Asia/Tbilisi (UTC+04:00) 第比利斯',
    shortLabel: 'UTC+04:00 第比利斯',
  },
  {
    value: 'Asia/Yerevan',
    label: 'Asia/Yerevan (UTC+04:00) 埃里温',
    shortLabel: 'UTC+04:00 埃里温',
  },
  {
    value: 'Asia/Dubai',
    label: 'Asia/Dubai (UTC+04:00) 阿布扎比，马斯喀特',
    shortLabel: 'UTC+04:00 迪拜',
  },
  { value: 'Asia/Baku', label: 'Asia/Baku (UTC+04:00) 巴库', shortLabel: 'UTC+04:00 巴库' },
  {
    value: 'Indian/Mauritius',
    label: 'Indian/Mauritius (UTC+04:00) 路易港',
    shortLabel: 'UTC+04:00 路易港',
  },
  { value: 'Asia/Kabul', label: 'Asia/Kabul (UTC+04:30) 喀布尔', shortLabel: 'UTC+04:30 喀布尔' },
  {
    value: 'Asia/Karachi',
    label: 'Asia/Karachi (UTC+05:00) 伊斯兰堡，卡拉奇',
    shortLabel: 'UTC+05:00 卡拉奇',
  },
  {
    value: 'Asia/Colombo',
    label: 'Asia/Colombo (UTC+05:30) 斯里加亚渥登普拉',
    shortLabel: 'UTC+05:30 科伦坡',
  },
  {
    value: 'Asia/Kolkata',
    label: 'Asia/Kolkata (UTC+05:30) 钦奈，加尔各答，新德里',
    shortLabel: 'UTC+05:30 新德里',
  },
  {
    value: 'Asia/Almaty',
    label: 'Asia/Almaty (UTC+06:00) 阿斯塔纳',
    shortLabel: 'UTC+06:00 阿拉木图',
  },
  { value: 'Asia/Dhaka', label: 'Asia/Dhaka (UTC+06:00) 达卡', shortLabel: 'UTC+06:00 达卡' },
  {
    value: 'Asia/Bangkok',
    label: 'Asia/Bangkok (UTC+07:00) 曼谷，河内，雅加达',
    shortLabel: 'UTC+07:00 曼谷',
  },
  {
    value: 'Asia/Novosibirsk',
    label: 'Asia/Novosibirsk (UTC+07:00) 新西伯利亚',
    shortLabel: 'UTC+07:00 新西伯利亚',
  },
  {
    value: 'Asia/Shanghai',
    label: 'Asia/Shanghai (UTC+08:00) 北京，重庆，中国香港，乌鲁木齐',
    shortLabel: 'UTC+08:00 上海',
  },
  {
    value: 'Australia/Perth',
    label: 'Australia/Perth (UTC+08:00) 佩思',
    shortLabel: 'UTC+08:00 珀斯',
  },
  { value: 'Asia/Taipei', label: 'Asia/Taipei (UTC+08:00) 台北', shortLabel: 'UTC+08:00 台北' },
  { value: 'Asia/Seoul', label: 'Asia/Seoul (UTC+09:00) 首尔', shortLabel: 'UTC+09:00 首尔' },
  {
    value: 'Asia/Tokyo',
    label: 'Asia/Tokyo (UTC+09:00) 大阪，札幌，东京',
    shortLabel: 'UTC+09:00 东京',
  },
  {
    value: 'Australia/Darwin',
    label: 'Australia/Darwin (UTC+09:30) 达尔文',
    shortLabel: 'UTC+09:30 达尔文',
  },
  {
    value: 'Australia/Adelaide',
    label: 'Australia/Adelaide (UTC+09:30) 阿德莱德',
    shortLabel: 'UTC+09:30 阿德莱德',
  },
  {
    value: 'Australia/Brisbane',
    label: 'Australia/Brisbane (UTC+10:00) 布里斯班',
    shortLabel: 'UTC+10:00 布里斯班',
  },
  {
    value: 'Pacific/Port_Moresby',
    label: 'Pacific/Port_Moresby (UTC+10:00) 关岛，莫尔兹比港',
    shortLabel: 'UTC+10:00 莫尔兹比港',
  },
  {
    value: 'Australia/Sydney',
    label: 'Australia/Sydney (UTC+10:00) 堪培拉，墨尔本，悉尼',
    shortLabel: 'UTC+10:00 悉尼',
  },
  {
    value: 'Pacific/Guadalcanal',
    label: 'Pacific/Guadalcanal (UTC+11:00) 所罗门群岛，新喀里多尼亚',
    shortLabel: 'UTC+11:00',
  },
  { value: 'Etc/GMT-12', label: 'Etc/GMT-12 (UTC+12:00) 协调世界时+12', shortLabel: 'UTC+12:00' },
  {
    value: 'Pacific/Fiji',
    label: 'Pacific/Fiji (UTC+12:00) 斐济，马绍尔群岛',
    shortLabel: 'UTC+12:00 斐济',
  },
  {
    value: 'Pacific/Auckland',
    label: 'Pacific/Auckland (UTC+12:00) 奥克兰，惠灵顿',
    shortLabel: 'UTC+12:00 奥克兰',
  },
  {
    value: 'Pacific/Tongatapu',
    label: 'Pacific/Tongatapu (UTC+13:00) 努库阿洛法',
    shortLabel: 'UTC+13:00 努库阿洛法',
  },
]
