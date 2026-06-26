import { solar2lunar } from '@/utils/lunar'

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

export const wuxingYi: Record<string, string[]> = {
  金: ['祭祀', '沐浴', '修饰', '整容', '纳财', '开市', '交易', '立券', '纳采', '问名'],
  木: ['嫁娶', '纳采', '订盟', '问名', '纳吉', '纳征', '请期', '嫁娶', '开市', '交易'],
  水: ['出行', '移徙', '修造', '动土', '祈福', '求嗣', '纳财', '开市', '交易', '立券'],
  火: ['动土', '祈福', '求嗣', '纳财', '开市', '交易', '立券', '修造', '作灶', '安床'],
  土: ['破土', '安葬', '修坟', '祭祀', '扫舍', '平治道涂', '修造', '动土', '开渠', '掘井'],
}

export const wuxingJi: Record<string, string[]> = {
  金: ['动土', '修造', '伐木', '作梁', '开渠', '掘井', '破土', '安葬', '修坟', '出行'],
  木: ['破土', '安葬', '开渠', '掘井', '作灶', '伐木', '修造', '动土', '祭祀', '出行'],
  水: ['嫁娶', '订盟', '纳采', '问名', '纳吉', '纳征', '请期', '祭祀', '祈福', '求嗣'],
  火: ['出行', '移徙', '嫁娶', '订盟', '纳采', '问名', '开市', '交易', '立券', '纳财'],
  土: ['出行', '移徙', '嫁娶', '订盟', '纳采', '问名', '开市', '交易', '立券', '祭祀'],
}

function getDayWuxing(year: number, month: number, day: number): string {
  const wuxing = ['金', '木', '水', '火', '土']
  const idx = (year + month + day) % 5
  return wuxing[idx] || '金'
}

export function getAlmanac(date: Date): { yi: string; ji: string } {
  const lunar = solar2lunar(date.getFullYear(), date.getMonth() + 1, date.getDate())
  const dayIndex = (lunar.lMonth * lunar.lDay) % almanacYi.length
  const wuxing = getDayWuxing(lunar.lYear, lunar.lMonth, lunar.lDay)

  const yiItems: string[] = []
  const jiItems: string[] = []

  yiItems.push(almanacYi[dayIndex] || '')
  yiItems.push(almanacYi[(dayIndex + 1) % almanacYi.length] || '')
  yiItems.push(almanacYi[(dayIndex + 2) % almanacYi.length] || '')

  jiItems.push(almanacJi[dayIndex] || '')
  jiItems.push(almanacJi[(dayIndex + 1) % almanacJi.length] || '')
  jiItems.push(almanacJi[(dayIndex + 2) % almanacJi.length] || '')

  const wuxingYiList = wuxingYi[wuxing] || []
  const wuxingJiList = wuxingJi[wuxing] || []

  yiItems.push(wuxingYiList[0] || '')
  jiItems.push(wuxingJiList[0] || '')

  const uniqueYiItems = [...new Set(yiItems.filter((item) => item))].slice(0, 5)
  const uniqueJiItems = [...new Set(jiItems.filter((item) => item))].slice(0, 5)

  return {
    yi: uniqueYiItems.join('、'),
    ji: uniqueJiItems.join('、'),
  }
}
