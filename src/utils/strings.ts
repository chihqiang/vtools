/**
 * 字符串处理工具函数
 * 提供各种文本转换、处理和分析功能
 */

/**
 * 清除文本中的所有空格
 * @param text 输入文本
 * @returns 清除空格后的文本
 * @example
 * removeSpaces('  hello world  \n  test  ')
 * // 返回 'helloworld\ntest'
 */
export const removeSpaces = (text: string): string => {
  // 先清除整个字符串的前后空格，然后对每一行清除行内的空格
  return text
    .trim()
    .split('\n')
    .map((line) => line.replace(/[ ]+/g, ''))
    .join('\n')
}

/**
 * 压缩文本（移除所有空格和换行符）
 * @param text 输入文本
 * @returns 压缩后的文本
 * @example
 * compressText('  hello\n  world  ')
 * // 返回 'helloworld'
 */
export const compressText = (text: string): string => {
  return text.replace(/\s+/g, '')
}

/**
 * 去除文本中的重复行
 * @param text 输入文本
 * @returns 去除重复行后的文本
 * @example
 * removeDuplicateLines('line1\nline2\nline1\nline3')
 * // 返回 'line1\nline2\nline3'
 */
export const removeDuplicateLines = (text: string): string => {
  const lines = text.split('\n')
  const uniqueLines = [...new Set(lines)]
  return uniqueLines.join('\n')
}

/**
 * 文本大小写转换类型
 */
export type CaseType = 'upper' | 'lower' | 'firstUpper' | 'firstLower' | 'sentence' | 'title'

/**
 * 转换文本大小写
 * @param text 输入文本
 * @param type 转换类型
 * @returns 转换后的文本
 * @example
 * convertCase('hello world', 'upper')
 * // 返回 'HELLO WORLD'
 *
 * convertCase('HELLO WORLD', 'lower')
 * // 返回 'hello world'
 *
 * convertCase('hello world', 'title')
 * // 返回 'Hello World'
 */
export const convertCase = (text: string, type: CaseType): string => {
  switch (type) {
    case 'upper':
      return text.toUpperCase()
    case 'lower':
      return text.toLowerCase()
    case 'firstUpper':
      return text.charAt(0).toUpperCase() + text.slice(1)
    case 'firstLower':
      return text.charAt(0).toLowerCase() + text.slice(1)
    case 'sentence':
      return text.toLowerCase().replace(/(^|[.!?\n]\s*)([a-z])/g, (_, s, c) => s + c.toUpperCase())
    case 'title':
      const ignore = new Set([
        'a',
        'an',
        'the',
        'and',
        'but',
        'or',
        'for',
        'nor',
        'on',
        'at',
        'to',
        'from',
        'by',
        'in',
        'of',
        'with',
        'about',
        'as',
        'into',
        'like',
        'through',
        'after',
        'over',
        'between',
        'out',
        'against',
        'during',
        'before',
        'under',
        'around',
        'among',
      ])
      const words = text.toLowerCase().split(/\s+/)
      return words
        .map((w, i) =>
          i === 0 || i === words.length - 1 || !ignore.has(w)
            ? w.charAt(0).toUpperCase() + w.slice(1)
            : w,
        )
        .join(' ')
    default:
      return text
  }
}

/**
 * 从文本中提取单词
 * @param text 输入文本
 * @returns 提取的单词数组
 * @example
 * extractWords('Hello World! How are you?')
 * // 返回 ['hello', 'world', 'how', 'are', 'you']
 */
export const extractWords = (text: string): string[] => {
  return text
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter(Boolean)
}

/**
 * 命名法转换类型
 */
export type NamingType = 'camel' | 'snake' | 'kebab'

/**
 * 转换命名法
 * @param text 输入文本
 * @param type 命名法类型
 * @returns 转换后的文本
 * @example
 * convertNaming('Hello World', 'camel')
 * // 返回 'helloWorld'
 *
 * convertNaming('Hello World', 'snake')
 * // 返回 'hello_world'
 *
 * convertNaming('Hello World', 'kebab')
 * // 返回 'hello-world'
 */
export const convertNaming = (text: string, type: NamingType): string => {
  const words = extractWords(text)
  if (!words.length) return text

  switch (type) {
    case 'camel':
      return (
        words[0] +
        words
          .slice(1)
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
          .join('')
      )
    case 'snake':
      return words.join('_')
    case 'kebab':
      return words.join('-')
    default:
      return text
  }
}

/**
 * 文本统计结果接口
 */
export interface TextStats {
  charCount: number
  byteCount: number
  lineCount: number
  wordCount: number
  totalLengthNoNewline: number
  totalLengthNoNewlineNoWidth: number
  chineseCount: number
  letterCount: number
  numberCount: number
  spaceCount: number
  halfWidthCount: number
  fullWidthCount: number
  newlineCount: number
}

/**
 * 计算文本统计信息
 * @param text 输入文本
 * @returns 文本统计结果
 * @example
 * calculateTextStats('Hello World\n你好世界')
 * // 返回包含各种统计信息的对象
 */
export const calculateTextStats = (text: string): TextStats => {
  // 基本统计 - 只计算一次
  const charCount = text.length
  const byteCount = new Blob([text]).size
  const lines = text.split('\n')
  const lineCount = lines.length
  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0

  // 文本处理 - 只处理一次
  const textNoNewline = text.replace(/\n/g, '')
  const totalLengthNoNewline = textNoNewline.length
  const totalLengthNoNewlineNoWidth = totalLengthNoNewline // 复用结果

  // 正则匹配 - 只执行一次
  const chineseCount = (text.match(/[\u4e00-\u9fa5\u3000-\u303f]/g) || []).length
  const letterCount = (text.match(/[a-zA-Z]/g) || []).length
  const numberCount = (text.match(/[0-9]/g) || []).length
  const spaceCount = (text.match(/[ \u00A0]/g) || []).length
  const halfWidthCount = (text.match(/[\x00-\x7F]/g) || []).length
  const newlineCount = (text.match(/\n/g) || []).length

  // 推导计算 - 基于已有结果
  const fullWidthCount = charCount - halfWidthCount

  return {
    charCount,
    byteCount,
    lineCount,
    wordCount,
    totalLengthNoNewline,
    totalLengthNoNewlineNoWidth,
    chineseCount,
    letterCount,
    numberCount,
    spaceCount,
    halfWidthCount,
    fullWidthCount,
    newlineCount,
  }
}
