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
            </div>
            <div class="flex gap-2">
              <button
                @click="copyAsImage"
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
                @click="downloadAsImage"
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

          <div v-if="showConfig" class="mb-4 border border-gray-300 rounded-lg p-4">
            <h3 class="font-semibold text-gray-700 mb-3">编辑器配置</h3>
            <div class="grid grid-cols-3 gap-4">
              <div class="flex flex-col gap-1">
                <label class="text-xs text-gray-600">字体大小</label>
                <input
                  v-model.number="config.fontSize"
                  type="number"
                  min="10"
                  max="30"
                  class="px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div class="flex flex-col gap-1">
                <label class="text-xs text-gray-600">行号</label>
                <select
                  v-model="config.lineNumbers"
                  class="px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="on">开启</option>
                  <option value="off">关闭</option>
                  <option value="relative">相对</option>
                  <option value="interval">间隔</option>
                </select>
              </div>
              <div class="flex flex-col gap-1">
                <label class="text-xs text-gray-600">自动换行</label>
                <select
                  v-model="config.wordWrap"
                  class="px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="on">开启</option>
                  <option value="off">关闭</option>
                  <option value="bounded">边界</option>
                  <option value="wordWrapColumn">列宽</option>
                </select>
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
  { label: 'High Contrast', value: 'hc-black' },
]

const selectedLanguage = ref('javascript')
const selectedTheme = ref('vs-dark')
const showConfig = ref(false)

const config = ref({
  fontSize: 14,
  fontFamily:
    "'Monaco', 'Menlo', 'Ubuntu Mono', 'Consolas', 'source-code-pro', 'Fira Code', 'Droid Sans Mono', monospace",
  minimap: { enabled: false },
  scrollBeyondLastLine: false,
  wordWrap: 'on' as 'on' | 'off' | 'bounded' | 'wordWrapColumn',
  lineNumbers: 'on' as 'on' | 'off' | 'relative' | 'interval',
  renderWhitespace: 'selection' as 'none' | 'boundary' | 'selection' | 'trailing' | 'all',
  bracketPairColorization: { enabled: true },
  smoothScrolling: true,
  cursorBlinking: 'smooth' as 'blink' | 'smooth' | 'phase' | 'expand' | 'solid',
  cursorSmoothCaretAnimation: 'on' as 'on' | 'off' | 'explicit',
  formatOnPaste: true,
  formatOnType: true,
  padding: { top: 16, bottom: 16 },
  lineHeight: 24,
  letterSpacing: 0,
  fontWeight: 'normal' as 'normal' | 'bold' | '600' | '700',
})

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

  updateEditorHeight()
  editorInstance.onDidChangeModelContent(() => {
    debouncedUpdateHeight()
  })
}

const debouncedUpdateHeight = debounce(() => {
  updateEditorHeight()
}, 100)

const updateEditorHeight = () => {
  if (!editorInstance || !editorContainer.value) return

  const contentHeight = editorInstance.getContentHeight()
  const lineHeight = editorInstance.getOption(monaco.editor.EditorOption.lineHeight) as number
  const lineCount = editorInstance.getModel()?.getLineCount() || 0

  const newHeight = Math.max(contentHeight, lineCount * lineHeight)
  editorContainer.value.style.height = `${newHeight}px`
}

const updateConfig = () => {
  if (editorInstance) {
    editorInstance.updateOptions(config.value)
  }
}

const updateLanguage = () => {
  if (editorInstance) {
    const model = editorInstance.getModel()
    if (model) {
      monaco.editor.setModelLanguage(model, selectedLanguage.value)
    }
  }
}

const updateTheme = () => {
  if (editorInstance) {
    monaco.editor.setTheme(selectedTheme.value)
  }
}

const copyAsImage = async () => {
  if (!editorContainer.value) return

  loading.value = true
  loadingMessage.value = '生成图片中...'

  try {
    const dataUrl = await toPng(editorContainer.value, {
      quality: 0.8,
      pixelRatio: 1.5,
      backgroundColor: selectedTheme.value === 'vs' ? '#ffffff' : '#1e1e1e',
      cacheBust: true,
    })

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
    toast.error('复制图片失败')
  } finally {
    loading.value = false
    loadingMessage.value = ''
  }
}

const downloadAsImage = async () => {
  if (!editorContainer.value) return

  loading.value = true
  loadingMessage.value = '生成图片中...'

  try {
    const dataUrl = await toPng(editorContainer.value, {
      quality: 0.8,
      pixelRatio: 1.5,
      backgroundColor: selectedTheme.value === 'vs' ? '#ffffff' : '#1e1e1e',
      cacheBust: true,
    })

    const link = document.createElement('a')
    link.href = dataUrl
    link.download = `code-${getCurrentDateTime()}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    toast.success('图片下载成功')
  } catch (error) {
    console.error('下载图片失败:', error)
    toast.error('下载图片失败')
  } finally {
    loading.value = false
    loadingMessage.value = ''
  }
}

watch(selectedLanguage, updateLanguage)
watch(selectedTheme, updateTheme)
watch(config, updateConfig, { deep: true })

onMounted(() => {
  initEditor()
})

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
