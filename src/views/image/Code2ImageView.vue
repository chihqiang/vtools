<template>
  <div class="max-w-7xl mx-auto px-4 py-6">
    <div class="bg-white rounded-lg shadow-md p-6">
      <div class="mb-6 text-center">
        <h1 class="text-2xl font-bold text-gray-800 mb-2">代码图片生成器</h1>
        <p class="text-gray-600">将代码转换为精美图片，支持多语言和主题切换</p>
      </div>

      <div class="grid grid-cols-1 gap-6">
        <div class="border border-gray-300 rounded-lg p-6">
          <div class="flex items-center justify-between mb-4 flex-wrap gap-4">
            <div class="flex flex-wrap items-center gap-3">
              <div class="flex items-center gap-2">
                <label class="text-sm text-gray-600">语言:</label>
                <select
                  v-model="selectedLanguage"
                  class="px-3 py-1.5 text-sm border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option v-for="lang in languages" :key="lang.value" :value="lang.value">
                    {{ lang.label }}
                  </option>
                </select>
              </div>
              <div class="flex items-center gap-2">
                <label class="text-sm text-gray-600">主题:</label>
                <select
                  v-model="selectedTheme"
                  class="px-3 py-1.5 text-sm border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option v-for="theme in themes" :key="theme.value" :value="theme.value">
                    {{ theme.label }}
                  </option>
                </select>
              </div>
              <div class="flex items-center gap-2">
                <label class="text-sm text-gray-600">行号:</label>
                <label class="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    v-model="config.lineNumbers"
                    :true-value="'on'"
                    :false-value="'off'"
                    class="sr-only peer"
                  />
                  <div
                    class="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"
                  ></div>
                </label>
              </div>
              <button
                @click="showConfig = !showConfig"
                class="p-2 text-gray-600 hover:text-gray-900 transition-colors"
                title="编辑器配置"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                  />
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </button>
            </div>
            <div class="flex gap-2">
              <button
                @click="debouncedCopyAsImage"
                class="px-4 py-2 bg-blue-500 text-white rounded text-sm shadow-sm hover:shadow transition-all duration-150 flex items-center gap-2"
                :disabled="loading"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
                复制图片
              </button>
              <button
                @click="debouncedDownloadAsImage"
                class="px-4 py-2 bg-green-500 text-white rounded text-sm shadow-sm hover:shadow transition-all duration-150 flex items-center gap-2"
                :disabled="loading"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                  />
                </svg>
                下载图片
              </button>
            </div>
          </div>

          <div
            v-if="showConfig"
            class="mb-6 bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden"
          >
            <div class="bg-gray-50 px-4 py-3 border-b border-gray-200">
              <h3 class="font-semibold text-gray-800">编辑器配置</h3>
            </div>
            <div class="p-4 space-y-4">
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div class="space-y-2">
                  <label class="block text-sm font-medium text-gray-700">字体大小</label>
                  <input
                    v-model.number="config.fontSize"
                    type="number"
                    min="10"
                    max="30"
                    class="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  />
                </div>

                <div class="space-y-2">
                  <label class="block text-sm font-medium text-gray-700">自动换行</label>
                  <div
                    class="flex items-center justify-between p-2 bg-gray-50 rounded-lg border border-gray-200"
                  >
                    <span class="text-sm text-gray-600">开关</span>
                    <label class="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        v-model="config.wordWrap"
                        :true-value="'on'"
                        :false-value="'off'"
                        class="sr-only peer"
                      />
                      <div
                        class="w-12 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"
                      ></div>
                    </label>
                  </div>
                </div>

                <div class="space-y-2">
                  <label class="block text-sm font-medium text-gray-700">行高</label>
                  <input
                    v-model.number="config.lineHeight"
                    type="number"
                    min="16"
                    max="40"
                    class="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  />
                </div>

                <div class="space-y-2">
                  <label class="block text-sm font-medium text-gray-700">字间距</label>
                  <input
                    v-model.number="config.letterSpacing"
                    type="number"
                    min="0"
                    max="5"
                    step="0.1"
                    class="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  />
                </div>

                <div class="space-y-2">
                  <label class="block text-sm font-medium text-gray-700">字体粗细</label>
                  <select
                    v-model="config.fontWeight"
                    class="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  >
                    <option value="normal">正常</option>
                    <option value="bold">粗体</option>
                    <option value="600">半粗体</option>
                    <option value="700">粗体</option>
                  </select>
                </div>

                <div class="space-y-2">
                  <label class="block text-sm font-medium text-gray-700">括号着色</label>
                  <div
                    class="flex items-center justify-between p-2 bg-gray-50 rounded-lg border border-gray-200"
                  >
                    <span class="text-sm text-gray-600">开关</span>
                    <label class="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        v-model="config.bracketPairColorization.enabled"
                        class="sr-only peer"
                      />
                      <div
                        class="w-12 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"
                      ></div>
                    </label>
                  </div>
                </div>

                <div class="space-y-2">
                  <label class="block text-sm font-medium text-gray-700">平滑滚动</label>
                  <div
                    class="flex items-center justify-between p-2 bg-gray-50 rounded-lg border border-gray-200"
                  >
                    <span class="text-sm text-gray-600">开关</span>
                    <label class="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        v-model="config.smoothScrolling"
                        class="sr-only peer"
                      />
                      <div
                        class="w-12 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"
                      ></div>
                    </label>
                  </div>
                </div>

                <div class="space-y-2">
                  <label class="block text-sm font-medium text-gray-700">粘贴格式化</label>
                  <div
                    class="flex items-center justify-between p-2 bg-gray-50 rounded-lg border border-gray-200"
                  >
                    <span class="text-sm text-gray-600">开关</span>
                    <label class="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" v-model="config.formatOnPaste" class="sr-only peer" />
                      <div
                        class="w-12 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"
                      ></div>
                    </label>
                  </div>
                </div>

                <div class="space-y-2">
                  <label class="block text-sm font-medium text-gray-700">输入格式化</label>
                  <div
                    class="flex items-center justify-between p-2 bg-gray-50 rounded-lg border border-gray-200"
                  >
                    <span class="text-sm text-gray-600">开关</span>
                    <label class="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" v-model="config.formatOnType" class="sr-only peer" />
                      <div
                        class="w-12 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"
                      ></div>
                    </label>
                  </div>
                </div>

                <div class="space-y-2">
                  <label class="block text-sm font-medium text-gray-700">空白字符显示</label>
                  <select
                    v-model="config.renderWhitespace"
                    class="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  >
                    <option value="none">无</option>
                    <option value="boundary">边界</option>
                    <option value="selection">选区</option>
                    <option value="trailing">尾随</option>
                    <option value="all">全部</option>
                  </select>
                </div>

                <div class="space-y-2">
                  <label class="block text-sm font-medium text-gray-700">光标闪烁</label>
                  <select
                    v-model="config.cursorBlinking"
                    class="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  >
                    <option value="blink">闪烁</option>
                    <option value="smooth">平滑</option>
                    <option value="phase">相位</option>
                    <option value="expand">扩展</option>
                    <option value="solid">固定</option>
                  </select>
                </div>

                <div class="space-y-2">
                  <label class="block text-sm font-medium text-gray-700">光标平滑动画</label>
                  <select
                    v-model="config.cursorSmoothCaretAnimation"
                    class="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  >
                    <option value="on">开启</option>
                    <option value="off">关闭</option>
                    <option value="explicit">显式</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div class="border border-gray-300 rounded-lg overflow-hidden shadow-inner">
            <div ref="editorContainer" class="w-full"></div>
          </div>
        </div>
      </div>
    </div>

    <LoadingSpinner v-if="loading" :loading="loading" :message="loadingMessage" :overlay="true" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import * as monaco from 'monaco-editor'
import { toPng } from 'html-to-image'
import { useToast } from '@/composables/useToast'
import { getCurrentDateTime } from '@/utils/times'
import { debounce } from '@/utils/debounce'
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue'

const toast = useToast()
const editorContainer = ref<HTMLElement | null>(null)
const loading = ref(false)
const loadingMessage = ref('')

let editorInstance: monaco.editor.IStandaloneCodeEditor | null = null

/**
 * 支持的编程语言列表
 * 用于语言选择下拉框
 */
const languages = [
  { label: 'JavaScript', value: 'javascript' },
  { label: 'TypeScript', value: 'typescript' },
  { label: 'HTML', value: 'html' },
  { label: 'CSS', value: 'css' },
  { label: 'JSON', value: 'json' },
  { label: 'Python', value: 'python' },
  { label: 'Java', value: 'java' },
  { label: 'C++', value: 'cpp' },
  { label: 'C#', value: 'csharp' },
  { label: 'Go', value: 'go' },
  { label: 'Rust', value: 'rust' },
  { label: 'PHP', value: 'php' },
  { label: 'Ruby', value: 'ruby' },
  { label: 'SQL', value: 'sql' },
  { label: 'YAML', value: 'yaml' },
  { label: 'Markdown', value: 'markdown' },
  { label: 'Shell', value: 'shell' },
  { label: 'XML', value: 'xml' },
  { label: 'Lua', value: 'lua' },
  { label: 'Swift', value: 'swift' },
  { label: 'Kotlin', value: 'kotlin' },
]

/**
 * 支持的编辑器主题列表
 * 用于主题选择下拉框
 */
const themes = [
  { label: 'VS Code Light', value: 'vs' },
  { label: 'VS Code Dark', value: 'vs-dark' },
  { label: 'High Contrast Light', value: 'hc-light' },
  { label: 'High Contrast Dark', value: 'hc-black' },
]

/**
 * 当前选中的编程语言
 */
const selectedLanguage = ref('javascript')

/**
 * 当前选中的编辑器主题
 */
const selectedTheme = ref('vs-dark')

/**
 * 是否显示编辑器配置面板
 */
const showConfig = ref(false)

/**
 * 编辑器配置选项
 * 包含字体、显示、行为等多种配置
 */
const config = ref({
  fontSize: 14, // 字体大小
  // 字体家族
  fontFamily:
    "'Monaco', 'Menlo', 'Ubuntu Mono', 'Consolas', 'source-code-pro', 'Fira Code', 'Droid Sans Mono', monospace",
  wordWrap: 'on' as 'on' | 'off' | 'bounded' | 'wordWrapColumn', // 自动换行
  lineNumbers: 'on' as 'on' | 'off' | 'relative' | 'interval', // 行号显示
  renderWhitespace: 'selection' as 'none' | 'boundary' | 'selection' | 'trailing' | 'all', // 空白字符显示
  bracketPairColorization: { enabled: true }, // 括号对颜色化
  smoothScrolling: true, // 平滑滚动
  cursorBlinking: 'smooth' as 'blink' | 'smooth' | 'phase' | 'expand' | 'solid', // 光标闪烁
  cursorSmoothCaretAnimation: 'on' as 'on' | 'off' | 'explicit', // 光标平滑动画
  formatOnPaste: true, // 粘贴时格式化
  formatOnType: true, // 输入时格式化
  lineHeight: 24, // 行高
  letterSpacing: 0, // 字间距
  fontWeight: 'normal' as 'normal' | 'bold' | '600' | '700', // 字体粗细
})

/**
 * 默认代码示例
 * 编辑器初始化时显示的内容
 */
const defaultCode = `function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

console.log(fibonacci(10));
`

/**
 * 初始化 Monaco 编辑器
 * 创建编辑器实例并设置初始配置
 */
const initEditor = () => {
  if (!editorContainer.value) return

  // 创建编辑器实例
  editorInstance = monaco.editor.create(editorContainer.value, {
    value: defaultCode, // 初始代码
    language: selectedLanguage.value, // 初始语言
    theme: selectedTheme.value, // 初始主题
    automaticLayout: true, // 自动布局
    minimap: { enabled: false }, // 禁用小地图
    scrollBeyondLastLine: false, // 禁用超出最后一行的滚动
    padding: { top: 20, bottom: 16 }, // 上下内边距
    ...config.value, // 应用其他配置
  })

  // 更新编辑器高度以适应内容
  updateEditorHeight()

  // 监听内容变化，自动调整高度
  editorInstance.onDidChangeModelContent(() => {
    debouncedUpdateHeight()
  })
}

/**
 * 防抖处理的高度更新函数
 * 避免频繁更新导致性能问题
 */
const debouncedUpdateHeight = debounce(() => {
  updateEditorHeight()
}, 100)

/**
 * 更新编辑器高度以适应内容
 * 根据代码行数和内容高度计算合适的高度
 */
const updateEditorHeight = () => {
  if (!editorInstance || !editorContainer.value) return

  // 获取内容高度和行高
  const contentHeight = editorInstance.getContentHeight()
  const lineHeight = editorInstance.getOption(monaco.editor.EditorOption.lineHeight) as number
  const lineCount = editorInstance.getModel()?.getLineCount() || 0

  // 计算新高度，取最大值以确保完整显示
  const newHeight = Math.max(contentHeight, lineCount * lineHeight)
  editorContainer.value.style.height = `${newHeight}px`
}

/**
 * 计算最佳图片尺寸
 * 根据代码内容计算生成图片的理想宽度和高度
 * @returns 包含宽度和高度的对象
 */
const calculateOptimalSize = () => {
  if (!editorInstance || !editorContainer.value) return { width: 0, height: 0 }

  const model = editorInstance.getModel()
  if (!model) return { width: 0, height: 0 }

  // 计算高度：基于行高和行数
  const lineHeight = editorInstance.getOption(monaco.editor.EditorOption.lineHeight) as number
  const lineCount = model.getLineCount()
  const baseHeight = lineCount * lineHeight
  const height = baseHeight + 40 // 添加40px边距（上下各20px）

  // 计算宽度：找到最长行并估算宽度
  let maxLineLength = 0
  for (let i = 1; i <= lineCount; i++) {
    const lineContent = model.getLineContent(i)
    maxLineLength = Math.max(maxLineLength, lineContent.length)
  }

  // 根据字体大小估算字符宽度
  const fontSize = editorInstance.getOption(monaco.editor.EditorOption.fontSize) as number
  const estimatedCharWidth = fontSize * 0.6 // 每个字符的估算宽度
  const estimatedWidth = maxLineLength * estimatedCharWidth

  // 添加边距并设置最小宽度
  const padding = 40 // 左右边距
  const width = Math.max(estimatedWidth + padding, 400) // 最小宽度400px

  return { width, height }
}

/**
 * 应用最佳尺寸到编辑器容器
 * @param width 目标宽度
 * @param height 目标高度
 * @returns 原始尺寸对象，用于后续恢复
 */
const applyOptimalSize = (width: number, height: number) => {
  if (!editorContainer.value) return { width: '', height: '' }

  // 保存原始尺寸
  const originalStyle = {
    width: editorContainer.value.style.width || '',
    height: editorContainer.value.style.height || '',
  }

  // 应用新尺寸
  editorContainer.value.style.width = `${width}px`
  editorContainer.value.style.height = `${height}px`

  return originalStyle
}

/**
 * 恢复编辑器容器的原始尺寸
 * @param originalStyle 原始尺寸对象
 */
const restoreOriginalSize = (originalStyle: { width: string; height: string }) => {
  if (!editorContainer.value) return

  editorContainer.value.style.width = originalStyle.width
  editorContainer.value.style.height = originalStyle.height
}

/**
 * 更新编辑器配置
 * 当配置选项变化时调用
 */
const updateConfig = () => {
  if (editorInstance) {
    editorInstance.updateOptions(config.value)
  }
}

/**
 * 更新编辑器语言
 * 当选中语言变化时调用
 */
const updateLanguage = () => {
  if (editorInstance) {
    const model = editorInstance.getModel()
    if (model) {
      monaco.editor.setModelLanguage(model, selectedLanguage.value)
    }
  }
}

/**
 * 更新编辑器主题
 * 当选中主题变化时调用
 */
const updateTheme = () => {
  if (editorInstance) {
    monaco.editor.setTheme(selectedTheme.value)
  }
}

/**
 * 防抖处理的复制图片函数
 * 避免频繁点击导致性能问题
 */
const debouncedCopyAsImage = debounce(async () => {
  await copyAsImage()
}, 300)

/**
 * 复制编辑器内容为图片
 * 生成图片并复制到剪贴板
 */
const copyAsImage = async () => {
  if (!editorContainer.value) return

  loading.value = true
  loadingMessage.value = '生成图片中...'

  try {
    // 计算最佳尺寸
    const optimalSize = calculateOptimalSize()
    if (optimalSize.width === 0 || optimalSize.height === 0) {
      throw new Error('无法计算最佳尺寸')
    }

    // 应用最佳尺寸
    const originalStyle = applyOptimalSize(optimalSize.width, optimalSize.height)

    // 强制编辑器布局更新
    editorInstance?.layout()

    // 生成图片
    const dataUrl = await toPng(editorContainer.value, {
      quality: 0.8, // 图片质量
      pixelRatio: 1.5, // 像素比
      backgroundColor: selectedTheme.value === 'vs' ? '#ffffff' : '#1e1e1e', // 背景色
      cacheBust: true, // 禁用缓存
    })

    // 恢复原始尺寸
    if (originalStyle && (originalStyle.width || originalStyle.height)) {
      restoreOriginalSize(originalStyle)
      editorInstance?.layout()
    } else {
      // 如果没有原始尺寸，清除内联样式
      if (editorContainer.value) {
        editorContainer.value.style.width = ''
        editorContainer.value.style.height = ''
        editorInstance?.layout()
      }
    }

    // 检查剪贴板API支持
    if (!navigator.clipboard) {
      throw new Error('浏览器不支持剪贴板API')
    }

    // 转换为Blob并复制到剪贴板
    const response = await fetch(dataUrl)
    const blob = await response.blob()

    await navigator.clipboard.write([
      new ClipboardItem({
        [blob.type]: blob,
      }),
    ])

    toast.success('图片已复制到剪贴板')
  } catch (error) {
    console.error('复制图片失败:', error)
    toast.error('复制图片失败，请稍后重试')
  } finally {
    loading.value = false
    loadingMessage.value = ''
  }
}

/**
 * 防抖处理的下载图片函数
 * 避免频繁点击导致性能问题
 */
const debouncedDownloadAsImage = debounce(async () => {
  await downloadAsImage()
}, 300)

/**
 * 下载编辑器内容为图片
 * 生成图片并下载到本地
 */
const downloadAsImage = async () => {
  if (!editorContainer.value) return

  loading.value = true
  loadingMessage.value = '生成图片中...'

  try {
    // 计算最佳尺寸
    const optimalSize = calculateOptimalSize()
    if (optimalSize.width === 0 || optimalSize.height === 0) {
      throw new Error('无法计算最佳尺寸')
    }

    // 应用最佳尺寸
    const originalStyle = applyOptimalSize(optimalSize.width, optimalSize.height)

    // 强制编辑器布局更新
    editorInstance?.layout()

    // 生成图片
    const dataUrl = await toPng(editorContainer.value, {
      quality: 0.8, // 图片质量
      pixelRatio: 1.5, // 像素比
      backgroundColor: selectedTheme.value === 'vs' ? '#ffffff' : '#1e1e1e', // 背景色
      cacheBust: true, // 禁用缓存
    })

    // 恢复原始尺寸
    if (originalStyle && (originalStyle.width || originalStyle.height)) {
      restoreOriginalSize(originalStyle)
      editorInstance?.layout()
    } else {
      // 如果没有原始尺寸，清除内联样式
      if (editorContainer.value) {
        editorContainer.value.style.width = ''
        editorContainer.value.style.height = ''
        editorInstance?.layout()
      }
    }

    // 创建下载链接并触发下载
    const link = document.createElement('a')
    link.href = dataUrl
    link.download = `code-${getCurrentDateTime()}.png` // 文件名包含时间戳
    link.style.display = 'none'
    document.body.appendChild(link)

    // 使用setTimeout确保链接被正确添加到DOM
    setTimeout(() => {
      link.click()
      document.body.removeChild(link)
    }, 100)

    toast.success('图片下载成功')
  } catch (error) {
    console.error('下载图片失败:', error)
    toast.error('下载图片失败，请稍后重试')
  } finally {
    loading.value = false
    loadingMessage.value = ''
  }
}

// 监听语言变化，更新编辑器语言
watch(selectedLanguage, updateLanguage)

// 监听主题变化，更新编辑器主题
watch(selectedTheme, updateTheme)

// 监听配置变化，更新编辑器配置（深度监听）
watch(config, updateConfig, { deep: true })

// 组件挂载时初始化编辑器
onMounted(() => {
  initEditor()
})

// 组件卸载前清理编辑器实例
onBeforeUnmount(() => {
  if (editorInstance) {
    editorInstance.dispose()
  }
})
</script>

<style scoped>
:deep(.monaco-editor) {
  border-radius: 8px;
}
</style>
