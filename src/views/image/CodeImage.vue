<template>
  <div class="flex flex-col flex-1 min-h-0 bg-gray-100 overflow-hidden">
    <!-- Top bar -->
    <div
      class="flex-shrink-0 flex items-center justify-between px-4 py-2.5 bg-white border-b border-gray-200"
    >
      <h2 class="text-sm font-semibold text-gray-700">代码图片生成器</h2>
      <div class="flex items-center gap-2">
        <button
          @click="debouncedCopyAsImage"
          :disabled="loading"
          class="px-3 py-1.5 bg-blue-500 text-white rounded-lg text-xs font-medium shadow-sm hover:bg-blue-600 transition-colors disabled:opacity-50 flex items-center gap-1.5"
        >
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
          :disabled="loading"
          class="px-3 py-1.5 bg-green-500 text-white rounded-lg text-xs font-medium shadow-sm hover:bg-green-600 transition-colors disabled:opacity-50 flex items-center gap-1.5"
        >
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
            />
          </svg>
          下载图片
        </button>
        <button
          @click="showSettings = !showSettings"
          :class="[
            'p-1.5 rounded-lg transition-colors',
            showSettings
              ? 'bg-blue-50 text-blue-600'
              : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100',
          ]"
          title="设置"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
    </div>

    <!-- Main area -->
    <div class="flex-1 min-h-0 flex">
      <!-- Editor / Preview area -->
      <div
        class="flex-1 min-h-0 flex items-center justify-center p-6 overflow-auto"
        :style="{ background: previewBackground }"
      >
        <!-- Code card -->
        <div ref="cardRef" class="code-card flex flex-col" :style="cardStyle">
          <!-- Window controls -->
          <div v-if="showWindowControls" class="flex items-center gap-2 px-4 py-3 flex-shrink-0">
            <span class="w-3 h-3 rounded-full bg-red-400"></span>
            <span class="w-3 h-3 rounded-full bg-yellow-400"></span>
            <span class="w-3 h-3 rounded-full bg-green-400"></span>
          </div>
          <!-- Monaco editor -->
          <div ref="editorContainer" class="flex-1 min-h-0 w-full"></div>
        </div>
      </div>

      <!-- Settings panel -->
      <transition name="slide">
        <div
          v-if="showSettings"
          class="w-60 flex-shrink-0 bg-white border-l border-gray-200 overflow-y-auto"
        >
          <div class="p-4 space-y-5">
            <!-- 语言 -->
            <div>
              <label class="block text-xs font-medium text-gray-500 mb-1.5">语言</label>
              <select
                v-model="selectedLanguage"
                class="w-full text-sm border border-gray-200 rounded-lg px-2.5 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                <option v-for="lang in languages" :key="lang.value" :value="lang.value">
                  {{ lang.label }}
                </option>
              </select>
            </div>

            <!-- 主题 -->
            <div>
              <label class="block text-xs font-medium text-gray-500 mb-1.5">主题</label>
              <select
                v-model="selectedTheme"
                class="w-full text-sm border border-gray-200 rounded-lg px-2.5 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                <option v-for="theme in themes" :key="theme.value" :value="theme.value">
                  {{ theme.label }}
                </option>
              </select>
            </div>

            <!-- 字号 -->
            <div>
              <label class="block text-xs font-medium text-gray-500 mb-1.5">字号</label>
              <div class="flex items-center gap-2">
                <input
                  v-model.number="config.fontSize"
                  type="range"
                  min="10"
                  max="24"
                  class="flex-1 accent-blue-500"
                />
                <span class="text-sm text-gray-600 w-8 text-center">{{ config.fontSize }}</span>
              </div>
            </div>

            <!-- 行高 -->
            <div>
              <label class="block text-xs font-medium text-gray-500 mb-1.5">行高</label>
              <div class="flex items-center gap-2">
                <input
                  v-model.number="config.lineHeight"
                  type="range"
                  min="16"
                  max="36"
                  class="flex-1 accent-blue-500"
                />
                <span class="text-sm text-gray-600 w-8 text-center">{{ config.lineHeight }}</span>
              </div>
            </div>

            <!-- 开关选项 -->
            <div class="space-y-2.5">
              <label class="flex items-center justify-between cursor-pointer">
                <span class="text-sm text-gray-600">行号</span>
                <button
                  @click="showLineNumbers = !showLineNumbers"
                  :class="['toggle-btn', showLineNumbers ? 'bg-blue-500' : 'bg-gray-300']"
                >
                  <span
                    :class="['toggle-dot', showLineNumbers ? 'translate-x-5' : 'translate-x-0.5']"
                  ></span>
                </button>
              </label>
              <label class="flex items-center justify-between cursor-pointer">
                <span class="text-sm text-gray-600">窗口控制按钮</span>
                <button
                  @click="showWindowControls = !showWindowControls"
                  :class="['toggle-btn', showWindowControls ? 'bg-blue-500' : 'bg-gray-300']"
                >
                  <span
                    :class="[
                      'toggle-dot',
                      showWindowControls ? 'translate-x-5' : 'translate-x-0.5',
                    ]"
                  ></span>
                </button>
              </label>
              <label class="flex items-center justify-between cursor-pointer">
                <span class="text-sm text-gray-600">自动换行</span>
                <button
                  @click="config.wordWrap = config.wordWrap === 'on' ? 'off' : 'on'"
                  :class="['toggle-btn', config.wordWrap === 'on' ? 'bg-blue-500' : 'bg-gray-300']"
                >
                  <span
                    :class="[
                      'toggle-dot',
                      config.wordWrap === 'on' ? 'translate-x-5' : 'translate-x-0.5',
                    ]"
                  ></span>
                </button>
              </label>
            </div>

            <div class="border-t border-gray-100"></div>

            <!-- 背景 -->
            <div>
              <label class="block text-xs font-medium text-gray-500 mb-2">背景</label>
              <div class="grid grid-cols-4 gap-2">
                <button
                  v-for="bg in backgrounds"
                  :key="bg.value"
                  @click="selectedBackground = bg.value"
                  :class="[
                    'h-10 rounded-lg border-2 transition-all',
                    selectedBackground === bg.value
                      ? 'border-blue-500 ring-1 ring-blue-300'
                      : 'border-gray-200 hover:border-gray-300',
                  ]"
                  :style="{ background: bg.value === 'transparent' ? checkerBg : bg.value }"
                  :title="bg.label"
                />
              </div>
            </div>

            <!-- 自定义背景色 -->
            <div>
              <label class="block text-xs font-medium text-gray-500 mb-1.5">自定义纯色</label>
              <div class="flex items-center gap-2">
                <input
                  v-model="customBgColor"
                  type="color"
                  class="w-8 h-8 rounded border border-gray-200 cursor-pointer"
                />
                <button
                  @click="selectedBackground = customBgColor"
                  class="flex-1 text-xs px-2.5 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-gray-600"
                >
                  应用颜色
                </button>
              </div>
            </div>

            <!-- 内边距 -->
            <div>
              <label class="block text-xs font-medium text-gray-500 mb-1.5">内边距</label>
              <div class="grid grid-cols-4 gap-2">
                <button
                  v-for="p in paddings"
                  :key="p.value"
                  @click="exportPadding = p.value"
                  :class="[
                    'py-1.5 text-xs rounded-lg border-2 transition-all',
                    exportPadding === p.value
                      ? 'border-blue-500 text-blue-600 bg-blue-50'
                      : 'border-gray-200 text-gray-500 hover:border-gray-300',
                  ]"
                >
                  {{ p.label }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </transition>
    </div>

    <!-- Loading -->
    <LoadingSpinner v-if="loading" :loading="loading" :message="loadingMessage" :overlay="true" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'
import * as monaco from 'monaco-editor'
import { toPng } from 'html-to-image'
import { useToast } from '@/composables/useToast'
import { getCurrentDateTime } from '@/utils/date'
import { debounce } from '@/utils/debounce'
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue'

const toast = useToast()
const editorContainer = ref<HTMLElement | null>(null)
const cardRef = ref<HTMLElement | null>(null)
const loading = ref(false)
const loadingMessage = ref('')

let editorInstance: monaco.editor.IStandaloneCodeEditor | null = null

// ==================== 选项数据 ====================
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

const themes = [
  { label: 'VS Code Dark', value: 'vs-dark' },
  { label: 'VS Code Light', value: 'vs' },
  { label: 'High Contrast Dark', value: 'hc-black' },
  { label: 'High Contrast Light', value: 'hc-light' },
]

const backgrounds = [
  { label: '透明', value: 'transparent' },
  { label: '白色', value: '#ffffff' },
  { label: '深灰', value: '#1e1e1e' },
  { label: '夜空蓝', value: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)' },
  { label: '极光', value: 'linear-gradient(135deg, #00c6ff 0%, #0072ff 100%)' },
  { label: '日落', value: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' },
  { label: '森林', value: 'linear-gradient(135deg, #134e5e 0%, #71b280 100%)' },
  { label: '葡萄紫', value: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
]

const paddings = [
  { label: '小', value: 16 },
  { label: '中', value: 32 },
  { label: '大', value: 48 },
  { label: '超大', value: 64 },
]

// ==================== 状态 ====================
const showSettings = ref(true)
const selectedLanguage = ref('javascript')
const selectedTheme = ref('vs-dark')
const selectedBackground = ref('transparent')
const customBgColor = ref('#2d3748')
const exportPadding = ref(32)
const showLineNumbers = ref(true)
const showWindowControls = ref(true)

const config = ref({
  fontSize: 14,
  fontFamily:
    "'Monaco', 'Menlo', 'Ubuntu Mono', 'Consolas', 'source-code-pro', 'Fira Code', monospace",
  wordWrap: 'on' as 'on' | 'off' | 'bounded' | 'wordWrapColumn',
  lineNumbers: 'on' as 'on' | 'off' | 'relative' | 'interval',
  bracketPairColorization: { enabled: true },
  lineHeight: 24,
  minimap: { enabled: false },
  scrollBeyondLastLine: false,
  padding: { top: 12, bottom: 12 },
})

// ==================== 计算属性 ====================
const checkerBg = `
  linear-gradient(45deg, #d1d5db 25%, transparent 25%),
  linear-gradient(-45deg, #d1d5db 25%, transparent 25%),
  linear-gradient(45deg, transparent 75%, #d1d5db 75%),
  linear-gradient(-45deg, transparent 75%, #d1d5db 75%)
`

const cardStyle = computed(() => {
  const bg = selectedBackground.value
  const isTransparent = bg === 'transparent'
  return {
    background: isTransparent ? 'transparent' : bg,
    padding: `${exportPadding.value}px`,
    borderRadius: '12px',
    boxShadow: isTransparent ? '0 4px 24px rgba(0,0,0,0.08)' : '0 8px 32px rgba(0,0,0,0.12)',
    overflow: 'hidden',
    width: '680px',
    maxWidth: '100%',
    minHeight: '300px',
  }
})

const previewBackground = computed(() => {
  return selectedBackground.value === 'transparent' ? `${checkerBg}, #f3f4f6` : '#f3f4f6'
})

// ==================== Monaco 编辑器 ====================
const defaultCode = `function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

console.log(fibonacci(10));`

const initEditor = () => {
  if (!editorContainer.value) return

  editorInstance = monaco.editor.create(editorContainer.value, {
    value: defaultCode,
    language: selectedLanguage.value,
    theme: selectedTheme.value,
    automaticLayout: true,
    ...config.value,
  })
}

const updateConfig = () => {
  if (editorInstance) editorInstance.updateOptions(config.value)
}

const updateLanguage = () => {
  if (editorInstance) {
    const model = editorInstance.getModel()
    if (model) monaco.editor.setModelLanguage(model, selectedLanguage.value)
  }
}

const updateTheme = () => {
  if (editorInstance) monaco.editor.setTheme(selectedTheme.value)
}

// ==================== 图片生成 ====================
const getExportBackground = (): string | undefined => {
  if (selectedBackground.value === 'transparent') return undefined
  if (selectedBackground.value.startsWith('linear-gradient')) return undefined
  return selectedBackground.value
}

const generateImage = async (): Promise<string> => {
  if (!cardRef.value) throw new Error('卡片未初始化')

  return await toPng(cardRef.value, {
    quality: 0.95,
    pixelRatio: 2,
    backgroundColor: getExportBackground(),
    cacheBust: true,
  })
}

const copyAsImage = async () => {
  loading.value = true
  loadingMessage.value = '生成图片中...'
  try {
    const dataUrl = await generateImage()

    if (navigator.clipboard && window.isSecureContext && typeof ClipboardItem !== 'undefined') {
      const response = await fetch(dataUrl)
      const blob = await response.blob()
      await navigator.clipboard.write([new ClipboardItem({ [blob.type]: blob })])
      toast.success('图片已复制到剪贴板')
    } else {
      const win = window.open()
      if (win) {
        win.document.write(`<img src="${dataUrl}" style="max-width:100%;" />`)
        win.document.title = '右键图片另存为或复制'
        toast.info('浏览器不支持直接复制图片，已在新窗口打开')
      } else {
        throw new Error('无法打开新窗口')
      }
    }
  } catch (error) {
    console.error('复制图片失败:', error)
    toast.error('复制图片失败，请尝试下载')
  } finally {
    loading.value = false
    loadingMessage.value = ''
  }
}

const downloadAsImage = async () => {
  loading.value = true
  loadingMessage.value = '生成图片中...'
  try {
    const dataUrl = await generateImage()
    const link = document.createElement('a')
    link.href = dataUrl
    link.download = `code-${getCurrentDateTime()}.png`
    link.style.display = 'none'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    toast.success('图片下载成功')
  } catch (error) {
    console.error('下载图片失败:', error)
    toast.error('下载图片失败，请稍后重试')
  } finally {
    loading.value = false
    loadingMessage.value = ''
  }
}

const debouncedCopyAsImage = debounce(async () => {
  await copyAsImage()
}, 300)
const debouncedDownloadAsImage = debounce(async () => {
  await downloadAsImage()
}, 300)

// ==================== 监听 ====================
watch(showLineNumbers, (val) => {
  config.value.lineNumbers = val ? 'on' : 'off'
})

watch(selectedLanguage, updateLanguage)
watch(selectedTheme, updateTheme)
watch(config, updateConfig, { deep: true })

onMounted(() => {
  initEditor()
})

onBeforeUnmount(() => {
  if (editorInstance) editorInstance.dispose()
})
</script>

<style scoped>
.code-card {
  position: relative;
}

:deep(.monaco-editor) {
  border-radius: 0 0 8px 8px;
}

.toggle-btn {
  width: 2.5rem;
  height: 1.5rem;
  border-radius: 9999px;
  position: relative;
  transition: background-color 0.2s;
  flex-shrink: 0;
}

.toggle-dot {
  position: absolute;
  top: 0.125rem;
  width: 1.25rem;
  height: 1.25rem;
  border-radius: 9999px;
  background: white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
  transition: transform 0.2s;
}

.slide-enter-active,
.slide-leave-active {
  transition: all 0.2s ease;
}

.slide-enter-from,
.slide-leave-to {
  transform: translateX(100%);
  opacity: 0;
}
</style>
