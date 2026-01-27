<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
    <div class="max-w-7xl mx-auto bg-white rounded-xl shadow-xl overflow-hidden min-h-screen">
      <header
        class="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-6 px-8 text-center shadow-md"
      >
        <h1 class="text-2xl md:text-3xl font-bold flex items-center justify-center gap-4">
          <i class="fas fa-book-reader text-xl md:text-2xl"></i>
          TXT在线阅读器
        </h1>
        <p class="mt-2 opacity-90 text-sm md:text-base">
          智能编码检测，解决中文乱码问题 | 文字转语音与自动滚动阅读
        </p>
      </header>

      <!-- 主内容区域 - 响应式布局 -->
      <div class="flex flex-1 overflow-hidden">
        <!-- 左侧边栏 - 响应式宽度 -->
        <div
          class="w-64 md:w-72 bg-gray-50 border-r border-gray-200 p-4 md:p-6 overflow-y-auto transition-all duration-300 ease-in-out"
        >
          <!-- 文件上传区域 -->
          <div class="mb-8">
            <div class="flex items-center gap-3 mb-4">
              <i class="fas fa-file-import text-blue-500 w-5 text-center"></i>
              <h2 class="text-lg font-semibold text-gray-700">导入TXT文件</h2>
            </div>

            <!-- 文件上传拖拽区域 -->
            <div
              class="border-2 border-dashed border-gray-300 rounded-lg p-5 md:p-6 text-center cursor-pointer transition-all duration-300 hover:border-blue-500 hover:bg-blue-50 hover:shadow-sm mb-4 group"
              id="fileInputArea"
              @click="fileInput?.click()"
              @dragover.prevent="handleDragOver"
              @dragleave.prevent="handleDragLeave"
              @drop.prevent="handleDrop"
            >
              <i
                class="fas fa-file-alt text-4xl text-gray-400 mb-4 group-hover:text-blue-500 transition-colors duration-300"
              ></i>
              <h3 class="text-lg font-medium text-gray-700 mb-2">点击或拖拽TXT文件到此处</h3>
              <p class="text-sm text-gray-500">支持任何纯文本格式文件(.txt, .md, .json等)</p>
              <input
                type="file"
                ref="fileInput"
                id="fileInput"
                accept=".txt,.md,.json,.html,.css,.js,.xml,.csv"
                class="hidden"
                @change="handleFileChange"
              />
            </div>

            <!-- 当前文件信息 -->
            <div class="bg-white rounded-lg p-4 shadow-sm mb-4 border border-gray-100">
              <h4 class="font-medium text-gray-700 mb-2 flex items-center gap-2">
                <i class="fas fa-file-alt text-sm text-gray-500"></i>
                当前文件:
              </h4>
              <p id="currentFileName" class="text-sm text-gray-600 truncate">
                {{ currentFileName }}
              </p>
              <p id="fileInfo" class="text-sm text-gray-500 mt-1">{{ fileInfo }}</p>
            </div>
          </div>

          <!-- 编码设置区域 -->
          <div class="mb-8">
            <div class="flex items-center gap-3 mb-4">
              <i class="fas fa-file-code text-blue-500 w-5 text-center"></i>
              <h2 class="text-lg font-semibold text-gray-700">编码设置</h2>
            </div>
            <div class="bg-white rounded-lg p-4 shadow-sm mb-4 border border-gray-100">
              <h4 class="font-medium text-gray-700 mb-3">
                当前编码:
                <span id="currentEncoding" class="text-blue-600">{{ currentEncoding }}</span>
              </h4>
              <div class="space-y-3">
                <div class="flex items-center gap-2">
                  <input
                    type="radio"
                    id="autoEncode"
                    name="encoding"
                    value="auto"
                    v-model="selectedEncoding"
                    @change="handleEncodingChange"
                    class="text-blue-600 focus:ring-blue-500"
                  />
                  <label for="autoEncode" class="text-sm text-gray-700 cursor-pointer"
                    >自动检测编码</label
                  >
                </div>
                <div class="flex items-center gap-2">
                  <input
                    type="radio"
                    id="utf8Encode"
                    name="encoding"
                    value="UTF-8"
                    v-model="selectedEncoding"
                    @change="handleEncodingChange"
                    class="text-blue-600 focus:ring-blue-500"
                  />
                  <label for="utf8Encode" class="text-sm text-gray-700 cursor-pointer"
                    >UTF-8 (推荐)</label
                  >
                </div>
                <div class="flex items-center gap-2">
                  <input
                    type="radio"
                    id="gbkEncode"
                    name="encoding"
                    value="GBK"
                    v-model="selectedEncoding"
                    @change="handleEncodingChange"
                    class="text-blue-600 focus:ring-blue-500"
                  />
                  <label for="gbkEncode" class="text-sm text-gray-700 cursor-pointer"
                    >GBK / GB2312 (简体中文)</label
                  >
                </div>
                <div class="flex items-center gap-2">
                  <input
                    type="radio"
                    id="big5Encode"
                    name="encoding"
                    value="Big5"
                    v-model="selectedEncoding"
                    @change="handleEncodingChange"
                    class="text-blue-600 focus:ring-blue-500"
                  />
                  <label for="big5Encode" class="text-sm text-gray-700 cursor-pointer"
                    >Big5 (繁体中文)</label
                  >
                </div>
                <div class="flex items-center gap-2">
                  <input
                    type="radio"
                    id="isoEncode"
                    name="encoding"
                    value="ISO-8859-1"
                    v-model="selectedEncoding"
                    @change="handleEncodingChange"
                    class="text-blue-600 focus:ring-blue-500"
                  />
                  <label for="isoEncode" class="text-sm text-gray-700 cursor-pointer"
                    >ISO-8859-1 (西欧)</label
                  >
                </div>
              </div>
              <button
                id="reloadBtn"
                class="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-lg mt-4 transition-all duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed shadow-sm hover:shadow disabled:shadow-none"
                :disabled="!currentFile"
                @click="reloadFile"
              >
                <i class="fas fa-sync-alt mr-2"></i>
                使用新编码重新加载
              </button>
              <p
                id="encodingStatus"
                class="mt-3 text-xs text-gray-500 italic"
                :style="{ color: encodingStatusColor }"
              >
                {{ encodingStatus }}
              </p>
            </div>
          </div>

          <!-- 使用说明区域 -->
          <div>
            <div class="flex items-center gap-3 mb-4">
              <i class="fas fa-info-circle text-blue-500 w-5 text-center"></i>
              <h2 class="text-lg font-semibold text-gray-700">使用说明</h2>
            </div>
            <div class="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
              <p class="font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <i class="fas fa-exclamation-circle text-yellow-500 text-sm"></i>
                解决乱码问题:
              </p>
              <p class="text-sm text-gray-600 mb-1 pl-7">
                1. 如果文本显示乱码，尝试在左侧选择不同的编码
              </p>
              <p class="text-sm text-gray-600 mb-1 pl-7">2. 中文文件通常使用UTF-8或GBK编码</p>
              <p class="text-sm text-gray-600 mb-1 pl-7">3. 点击"使用新编码重新加载"按钮应用设置</p>
              <p class="font-semibold text-gray-700 mt-3 mb-2 flex items-center gap-2">
                <i class="fas fa-volume-up text-blue-500 text-sm"></i>
                朗读功能:
              </p>
              <p class="text-sm text-gray-600 mb-1 pl-7">4. 正确显示文本后，点击"开始朗读"按钮</p>
              <p class="text-sm text-gray-600 pl-7">5. 播放时页面会自动滚动并高亮当前朗读内容</p>
            </div>
          </div>
        </div>

        <!-- 中间阅读区域 -->
        <div class="flex-1 p-4 md:p-6 overflow-hidden flex flex-col">
          <!-- 控制区域 -->
          <div class="mb-4 md:mb-6 pb-4 border-b border-gray-200">
            <!-- 播放控制按钮 -->
            <div class="flex flex-wrap items-center gap-3 mb-4">
              <button
                id="playBtn"
                class="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-full flex items-center gap-2 transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-1 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:shadow-none disabled:translate-y-0"
                :disabled="!currentFile"
                @click="startReading"
              >
                <i class="fas fa-play"></i>
                <span class="hidden sm:inline">开始朗读</span>
              </button>

              <button
                id="stopBtn"
                class="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-full flex items-center gap-2 transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-1 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:shadow-none disabled:translate-y-0"
                :disabled="!isPlaying"
                @click="stopReading"
              >
                <i class="fas fa-stop"></i>
                <span class="hidden sm:inline">停止</span>
              </button>
              <button
                id="saveBtn"
                class="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-full flex items-center gap-2 transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-1 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:shadow-none disabled:translate-y-0"
                :disabled="!currentFile"
                @click="saveState"
              >
                <i class="fas fa-save"></i>
                <span class="hidden sm:inline">存档</span>
              </button>
              <button
                id="loadBtn"
                class="bg-purple-500 hover:bg-purple-600 text-white font-semibold py-2 px-4 rounded-full flex items-center gap-2 transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-1 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:shadow-none disabled:translate-y-0"
                :disabled="!currentFile"
                @click="loadState"
              >
                <i class="fas fa-upload"></i>
                <span class="hidden sm:inline">读档</span>
              </button>
            </div>

            <!-- 语音和语速设置 -->
            <div class="flex flex-wrap items-center gap-3">
              <div
                class="bg-gray-50 px-4 py-2 rounded-full flex items-center gap-3 border border-gray-200 shadow-sm"
              >
                <label for="voiceSelect" class="text-sm font-medium text-gray-700">语音:</label>
                <select
                  id="voiceSelect"
                  class="border border-gray-300 rounded-lg px-3 py-1.5 bg-white text-gray-700 text-sm font-medium min-w-[120px] max-w-[200px] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  v-model="selectedVoice"
                  @change="saveVoiceSelection"
                >
                  <optgroup
                    v-for="(group, groupName) in voiceGroups"
                    :key="groupName"
                    :label="groupName"
                  >
                    <option v-for="voice in group" :key="voice.voiceURI" :value="voice.voiceURI">
                      {{ voice.name }} ({{ voice.lang }})
                    </option>
                  </optgroup>
                </select>
              </div>

              <div
                class="bg-gray-50 px-4 py-2 rounded-full flex items-center gap-3 border border-gray-200 shadow-sm"
              >
                <label for="speedSelect" class="text-sm font-medium text-gray-700">语速:</label>
                <select
                  id="speedSelect"
                  class="border border-gray-300 rounded-lg px-3 py-1.5 bg-white text-gray-700 text-sm font-medium min-w-[80px] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  v-model="speechSpeed"
                >
                  <option value="0.5">0.5x</option>
                  <option value="0.8">0.8x</option>
                  <option value="1">正常</option>
                  <option value="1.2">1.2x</option>
                  <option value="1.5">1.5x</option>
                  <option value="2">2x</option>
                  <option value="2.5">2.5x</option>
                  <option value="3">3x</option>
                </select>
              </div>
            </div>
          </div>

          <!-- 文本阅读区域 -->
          <div
            class="flex-1 bg-gray-50 rounded-xl p-5 md:p-6 overflow-y-auto border border-gray-200 shadow-sm"
          >
            <div
              v-if="!currentFileContent"
              class="text-center py-16 flex flex-col items-center justify-center"
            >
              <div class="bg-blue-50 rounded-full p-6 mb-6">
                <i class="fas fa-book-open text-5xl text-blue-300"></i>
              </div>
              <h3 class="text-xl font-semibold text-gray-600 mb-3">尚未加载文件</h3>
              <p class="text-gray-500 mb-6 max-w-md">请从左侧导入TXT文件开始阅读</p>
              <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4 max-w-md">
                <p class="text-sm text-gray-600">
                  <i class="fas fa-lightbulb text-yellow-500 mr-2"></i>
                  如果文本显示乱码，请尝试在左侧选择不同的编码格式重新加载
                </p>
              </div>
            </div>
            <div v-else class="space-y-4">
              <p
                v-for="(sentence, index) in sentences"
                :key="index"
                class="cursor-pointer py-3 px-4 rounded-lg transition-all duration-300 hover:bg-blue-50 hover:border-l-4 hover:border-blue-500 hover:pl-5 text-gray-700 leading-relaxed"
                :class="{
                  'bg-blue-100 border-l-4 border-blue-600 pl-5 shadow-sm':
                    index === currentSentenceIndex,
                }"
                @click="selectSentence(index)"
              >
                {{ sentence }}
              </p>
            </div>
          </div>

          <!-- 朗读状态指示器 -->
          <div
            class="mt-4 bg-blue-600 text-white py-3 px-4 rounded-lg text-center font-medium shadow-md animate-fadeIn"
            v-if="isPlaying"
          >
            <i class="fas fa-volume-up mr-2 animate-pulse"></i>
            正在朗读:
            <span id="currentPosText" class="font-semibold"
              >第 {{ currentSentenceIndex + 1 }} 句 / 共 {{ sentences.length }} 句</span
            >
          </div>
        </div>

        <!-- 右侧章节列表 -->
        <div
          class="w-56 md:w-64 bg-gray-50 border-l border-gray-200 p-4 md:p-6 overflow-y-auto transition-all duration-300 ease-in-out"
        >
          <div class="mb-4">
            <div class="flex items-center gap-3 mb-4">
              <i class="fas fa-list text-blue-500 w-5 text-center"></i>
              <h2 class="text-lg font-semibold text-gray-700">章节列表</h2>
            </div>
            <div class="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
              <div
                v-if="chapters.length === 0"
                class="text-center py-8 flex flex-col items-center justify-center"
              >
                <div class="bg-gray-50 rounded-full p-3 mb-3">
                  <i class="fas fa-bookmark text-2xl text-gray-300"></i>
                </div>
                <p class="text-gray-500">未检测到章节</p>
              </div>
              <div
                v-for="(chapter, index) in chapters"
                :key="index"
                class="p-3 border-b border-gray-100 cursor-pointer transition-all duration-300 hover:bg-gray-50 hover:pl-4"
                :class="{
                  'bg-blue-600 text-white hover:bg-blue-700 hover:pl-4':
                    selectedChapterIndex === index,
                }"
                @click="selectChapter(index)"
              >
                <div class="font-medium text-sm truncate">{{ chapter.title }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

// 全局变量
const currentFileContent = ref('')
const sentences = ref<string[]>([])
const currentSentenceIndex = ref(0)
const speechSynthesis = window.speechSynthesis
const utterance = ref<SpeechSynthesisUtterance | null>(null)
const isPlaying = ref(false)
const voices = ref<SpeechSynthesisVoice[]>([])
const voiceGroups = ref<Record<string, SpeechSynthesisVoice[]>>({})
const currentFile = ref<File | null>(null)
const currentEncoding = ref('auto')
const selectedEncoding = ref('auto')
const userSelectedPosition = ref(false)
const chapters = ref<{ title: string; startIndex: number; endIndex: number }[]>([])
const selectedChapterIndex = ref(-1)

// DOM元素
const fileInput = ref<HTMLInputElement>()

// 状态变量
const currentFileName = ref('尚未选择文件')
const fileInfo = ref('文件大小: 0 KB | 字符数: 0')
const encodingStatus = ref('')
const encodingStatusColor = ref('#718096')
const selectedVoice = ref('')
const speechSpeed = ref('1')

// 初始化语音列表
function loadVoices() {
  voices.value = speechSynthesis.getVoices()

  // 过滤中文和英文语音
  const chineseVoices = voices.value.filter((voice) => voice.lang.startsWith('zh'))
  const englishVoices = voices.value.filter((voice) => voice.lang.startsWith('en'))
  const otherVoices = voices.value.filter(
    (voice) => !voice.lang.startsWith('zh') && !voice.lang.startsWith('en'),
  )

  // 分组语音
  voiceGroups.value = {
    中文语音: chineseVoices,
    英语语音: englishVoices,
    其他语音: otherVoices,
  }

  // 尝试恢复之前选择的语音
  const savedVoice = localStorage.getItem('selectedVoice')
  if (savedVoice && voices.value.some((voice) => voice.voiceURI === savedVoice)) {
    selectedVoice.value = savedVoice
  } else {
    // 默认选择 Microsoft Xiaoxiao Online (Natural) - Chinese (Mainland) (zh-CN)
    const xiaoxiaoVoice = voices.value.find(
      (voice) =>
        voice.name.includes('Microsoft Xiaoxiao Online') ||
        voice.name.includes('Xiaoxiao') ||
        voice.voiceURI.includes('Microsoft Xiaoxiao Online'),
    )

    if (xiaoxiaoVoice) {
      selectedVoice.value = xiaoxiaoVoice.voiceURI
    } else if (chineseVoices.length > 0) {
      // 如果没有找到Xiaoxiao，选择第一个中文语音
      selectedVoice.value = chineseVoices[0]?.voiceURI || ''
    } else if (voices.value.length > 0) {
      selectedVoice.value = voices.value[0]?.voiceURI || ''
    }
  }
}

// 保存语音选择
function saveVoiceSelection() {
  localStorage.setItem('selectedVoice', selectedVoice.value)
}

// 处理文件拖放
function handleDragOver(e: DragEvent) {
  const target = e.target as HTMLElement
  if (target.id === 'fileInputArea') {
    target.classList.add('border-blue-500', 'bg-blue-50')
    target.classList.remove('border-gray-300', 'bg-white')
  }
}

function handleDragLeave(e: DragEvent) {
  const target = e.target as HTMLElement
  if (target.id === 'fileInputArea') {
    target.classList.remove('border-blue-500', 'bg-blue-50')
    target.classList.add('border-gray-300', 'bg-white')
  }
}

function handleDrop(e: DragEvent) {
  const target = e.target as HTMLElement
  if (target.id === 'fileInputArea') {
    target.classList.remove('border-blue-500', 'bg-blue-50')
    target.classList.add('border-gray-300', 'bg-white')

    if (e.dataTransfer?.files.length) {
      const file = e.dataTransfer.files[0]
      if (
        file &&
        (file.type === 'text/plain' ||
          file.name.endsWith('.txt') ||
          file.name.endsWith('.md') ||
          file.name.endsWith('.json'))
      ) {
        readFile(file)
      } else {
        alert('请选择TXT文件或其他文本文件')
      }
    }
  }
}

// 处理文件选择
function handleFileChange(e: Event) {
  const target = e.target as HTMLInputElement
  if (target.files?.length && target.files[0]) {
    readFile(target.files[0])
  }
}

// 读取文件内容
function readFile(file: File, encoding: string = 'auto') {
  try {
    // 检查文件大小
    if (file.size > 10 * 1024 * 1024) {
      // 10MB限制
      alert('文件过大，请选择小于10MB的文件')
      encodingStatus.value = '文件过大，请选择小于10MB的文件'
      encodingStatusColor.value = '#f56565'
      return
    }

    currentFile.value = file
    currentFileName.value = file.name

    const reader = new FileReader()

    reader.onload = function (e) {
      try {
        let content = e.target?.result

        if (!content) {
          throw new Error('文件内容为空')
        }

        // 尝试检测编码
        if (encoding === 'auto') {
          const detectedEncoding = detectEncoding(content as ArrayBuffer, file)
          currentEncoding.value = detectedEncoding
          selectedEncoding.value = detectedEncoding.toLowerCase()

          // 如果检测到的编码不是UTF-8，尝试转换
          if (detectedEncoding !== 'UTF-8' && detectedEncoding !== '自动检测') {
            content = convertEncoding(content as ArrayBuffer, detectedEncoding)
          }
        } else {
          // 使用指定的编码
          currentEncoding.value = encoding
          selectedEncoding.value = encoding.toLowerCase()

          if (encoding !== 'UTF-8') {
            content = convertEncoding(content as ArrayBuffer, encoding)
          }
        }

        currentFileContent.value = content as string
        fileInfo.value = `文件大小: ${(file.size / 1024).toFixed(2)} KB | 字符数: ${currentFileContent.value.length} | 编码: ${currentEncoding.value}`

        // 处理文本内容
        processTextContent(currentFileContent.value)

        // 更新编码状态
        encodingStatus.value = `使用 ${currentEncoding.value} 编码加载成功`
        encodingStatusColor.value = '#48bb78'
      } catch (error) {
        console.error('处理文件内容失败:', error)
        encodingStatus.value = '处理文件内容失败: ' + (error as Error).message
        encodingStatusColor.value = '#f56565'
      }
    }

    reader.onerror = function () {
      encodingStatus.value = '文件读取失败，请尝试其他编码'
      encodingStatusColor.value = '#f56565'
    }

    // 读取文件为二进制数组，以便后续编码检测
    reader.readAsArrayBuffer(file)
  } catch (error) {
    console.error('读取文件失败:', error)
    encodingStatus.value = '读取文件失败: ' + (error as Error).message
    encodingStatusColor.value = '#f56565'
  }
}

// 改进的编码检测函数
function detectEncoding(buffer: ArrayBuffer, file: File): string {
  // 将ArrayBuffer转换为Uint8Array
  const uint8Array = new Uint8Array(buffer)

  // 检测UTF-8 BOM (EF BB BF)
  if (
    uint8Array.length >= 3 &&
    uint8Array[0] === 0xef &&
    uint8Array[1] === 0xbb &&
    uint8Array[2] === 0xbf
  ) {
    return 'UTF-8'
  }

  // 检测UTF-16 LE BOM (FF FE)
  if (uint8Array.length >= 2 && uint8Array[0] === 0xff && uint8Array[1] === 0xfe) {
    return 'UTF-16LE'
  }

  // 检测UTF-16 BE BOM (FE FF)
  if (uint8Array.length >= 2 && uint8Array[0] === 0xfe && uint8Array[1] === 0xff) {
    return 'UTF-16BE'
  }

  // 尝试使用TextDecoder检测
  try {
    // 尝试UTF-8解码
    const utf8Decoder = new TextDecoder('utf-8')
    const utf8Text = utf8Decoder.decode(uint8Array)

    // 检查是否有乱码字符（常见的乱码字符）
    const garbagePattern = /[â€œâ€�â„¢â€"�â€¦Â®Ã©Ã¨Ã Ã´ÃªÃ®Ã»Ã§Ã¯Ã¼Ã¶Ã¤ÃŸ]/
    if (!garbagePattern.test(utf8Text)) {
      // 检查是否包含有效的文本内容
      if (utf8Text.trim().length > 0) {
        return 'UTF-8'
      }
    }
  } catch {
    // UTF-8解码失败
  }

  // 基于文件内容特征检测中文编码
  // 检查是否包含常见的GBK/Big5编码特征
  let hasChineseChars = false
  let hasHighBytes = 0

  for (let i = 0; i < uint8Array.length; i++) {
    const byte = uint8Array[i]
    // 统计高字节数量（可能是中文编码）
    if (byte !== undefined && byte >= 0x80) {
      hasHighBytes++
      // 检查是否符合GBK/Big5编码模式
      if (i + 1 < uint8Array.length) {
        const nextByte = uint8Array[i + 1]
        if (nextByte !== undefined && nextByte >= 0x40 && nextByte <= 0xfe) {
          hasChineseChars = true
          i++ // 跳过下一个字节
        }
      }
    }
  }

  // 如果检测到可能的中文字符，优先尝试GBK
  if (hasChineseChars || hasHighBytes > uint8Array.length * 0.1) {
    // 基于文件名和常见中文编码猜测
    const fileName = file.name.toLowerCase()

    // 如果是繁体中文文件
    if (
      fileName.includes('big5') ||
      fileName.includes('tw') ||
      fileName.includes('hk') ||
      fileName.includes('traditional')
    ) {
      return 'Big5'
    }

    // 默认使用GBK
    return 'GBK'
  }

  // 尝试其他常见编码
  try {
    // 尝试ISO-8859-1解码
    const isoDecoder = new TextDecoder('iso-8859-1')
    const isoText = isoDecoder.decode(uint8Array)
    if (isoText.trim().length > 0) {
      return 'ISO-8859-1'
    }
  } catch {
    // ISO-8859-1解码失败
  }

  // 默认返回UTF-8
  return 'UTF-8'
}

// 编码转换函数
function convertEncoding(buffer: ArrayBuffer, fromEncoding: string): string {
  try {
    const uint8Array = new Uint8Array(buffer)

    // 创建TextDecoder
    let decoder: TextDecoder
    const decoderOptions: TextDecoderOptions = { fatal: false, ignoreBOM: true }

    switch (fromEncoding) {
      case 'GBK':
        // 尝试使用gbk解码，如果浏览器不支持则使用gb18030
        try {
          decoder = new TextDecoder('gbk', decoderOptions)
        } catch {
          try {
            decoder = new TextDecoder('gb18030', decoderOptions)
          } catch {
            // 如果都不支持，使用utf-8作为后备
            decoder = new TextDecoder('utf-8', decoderOptions)
          }
        }
        break
      case 'Big5':
        try {
          decoder = new TextDecoder('big5', decoderOptions)
        } catch {
          decoder = new TextDecoder('utf-8', decoderOptions)
        }
        break
      case 'ISO-8859-1':
        decoder = new TextDecoder('iso-8859-1', decoderOptions)
        break
      case 'UTF-16LE':
        decoder = new TextDecoder('utf-16le', decoderOptions)
        break
      case 'UTF-16BE':
        decoder = new TextDecoder('utf-16be', decoderOptions)
        break
      default:
        // 默认使用UTF-8
        decoder = new TextDecoder('utf-8', decoderOptions)
    }

    const result = decoder.decode(uint8Array)

    // 检查解码结果是否有效
    if (result.trim().length === 0 && uint8Array.length > 0) {
      throw new Error('解码结果为空')
    }

    return result
  } catch (error) {
    console.error('编码转换失败:', error)
    encodingStatus.value = `编码转换失败: ${(error as Error).message || '未知错误'}`
    encodingStatusColor.value = '#f56565'

    // 尝试使用纯JavaScript的编码转换（基于TextDecoder的后备方案）
    try {
      const uint8Array = new Uint8Array(buffer)
      // 使用utf-8作为最终后备
      const fallbackDecoder = new TextDecoder('utf-8', { fatal: false, ignoreBOM: true })
      const fallbackResult = fallbackDecoder.decode(uint8Array)

      if (fallbackResult.trim().length > 0) {
        encodingStatus.value = `使用UTF-8后备解码: ${fromEncoding}编码转换失败`
        encodingStatusColor.value = '#ed8936' // 警告颜色
        return fallbackResult
      }
    } catch (fallbackError) {
      console.error('后备解码也失败:', fallbackError)
    }

    return '编码转换失败，请尝试其他编码格式'
  }
}

// 重新加载文件使用新编码
function reloadFile() {
  if (!currentFile.value) return

  // 获取选中的编码
  const selectedEncodingValue =
    selectedEncoding.value === 'auto' ? 'auto' : selectedEncoding.value.toUpperCase()

  encodingStatus.value = `正在使用 ${selectedEncodingValue} 编码重新加载...`
  encodingStatusColor.value = '#4299e1'

  // 重新读取文件
  readFile(currentFile.value, selectedEncodingValue)
}

// 处理编码变化
function handleEncodingChange() {
  // 编码变化时的处理逻辑
}

// 处理文本内容,分割成句子和章节
function processTextContent(text: string) {
  // 统一使用段落分割方式
  const paragraphs = text.split(/\n\s*\n/)

  // 过滤空段落
  sentences.value = paragraphs.filter((s) => s.trim().length > 0)

  // 如果只有一个段落或没有段落,按换行符分割
  if (sentences.value.length <= 1) {
    sentences.value = text.split(/\n+/).filter((s) => s.trim().length > 0)
  }

  // 如果还是太少,尝试按标点符号分割
  if (sentences.value.length <= 1) {
    sentences.value = text.split(/(?<=[。！？；.!?;])\s*/)
    sentences.value = sentences.value.filter((s) => s.trim().length > 0)
  }

  // 检测章节
  detectChapters(text)

  console.log(`文本已分割为 ${sentences.value.length} 个段落/句子`)
}

// 检测章节
function detectChapters(text: string) {
  const chapterRegex = /^第[一二三四五六七八九十零〇百千万\d\s]{1,10}[章节卷集部篇回].+$/gm
  chapters.value = []
  let match

  // 重置正则表达式的lastIndex
  chapterRegex.lastIndex = 0

  while ((match = chapterRegex.exec(text)) !== null) {
    const chapterTitle = match[0].trim()
    const startIndex = match.index
    const endIndex = chapterRegex.lastIndex

    chapters.value.push({
      title: chapterTitle,
      startIndex: startIndex,
      endIndex: endIndex,
    })
  }
}

// 选择章节
function selectChapter(index: number) {
  selectedChapterIndex.value = index
  // 跳转到章节位置的逻辑
  // 这里可以根据章节的startIndex找到对应的句子索引
}

// 选择句子
function selectSentence(index: number) {
  currentSentenceIndex.value = index
  userSelectedPosition.value = true

  // 如果正在朗读，先停止
  if (isPlaying.value) {
    stopReading()
  }
}

// 开始朗读
function startReading() {
  try {
    if (!currentFileContent.value || sentences.value.length === 0) {
      alert('请先加载文件再开始朗读')
      return
    }

    // 检查浏览器是否支持语音合成
    if (!('speechSynthesis' in window)) {
      alert('您的浏览器不支持语音合成功能')
      return
    }

    // 停止之前的朗读
    speechSynthesis.cancel()

    // 创建新的语音实例
    utterance.value = new SpeechSynthesisUtterance()
    utterance.value.text = sentences.value[currentSentenceIndex.value] || ''
    utterance.value.rate = parseFloat(speechSpeed.value)

    // 设置语音
    const selectedVoiceObj = voices.value.find((voice) => voice.voiceURI === selectedVoice.value)
    if (selectedVoiceObj) {
      utterance.value.voice = selectedVoiceObj
    } else if (voices.value.length > 0 && voices.value[0]) {
      // 如果没有选择语音，使用第一个可用语音
      utterance.value.voice = voices.value[0]
    }

    // 语音结束事件
    utterance.value.onend = function () {
      try {
        currentSentenceIndex.value++

        if (currentSentenceIndex.value < sentences.value.length) {
          // 继续朗读下一句
          utterance.value!.text = sentences.value[currentSentenceIndex.value] || ''
          speechSynthesis.speak(utterance.value!)
        } else {
          // 朗读结束
          isPlaying.value = false
          currentSentenceIndex.value = 0
        }
      } catch (error) {
        console.error('朗读过程出错:', error)
        isPlaying.value = false
      }
    }

    // 语音错误事件
    utterance.value.onerror = function (event) {
      console.error('语音合成错误:', event)
      isPlaying.value = false
      alert('语音合成失败: ' + event.error)
    }

    // 开始朗读
    speechSynthesis.speak(utterance.value)
    isPlaying.value = true
  } catch (error) {
    console.error('开始朗读失败:', error)
    isPlaying.value = false
    alert('开始朗读失败: ' + (error as Error).message)
  }
}

// 停止朗读
function stopReading() {
  try {
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel()
    }
    isPlaying.value = false
  } catch (error) {
    console.error('停止朗读失败:', error)
    isPlaying.value = false
  }
}

// 存档
function saveState() {
  try {
    if (!currentFile.value) {
      alert('请先加载文件再存档')
      return
    }

    const state = {
      currentFileName: currentFileName.value,
      currentSentenceIndex: currentSentenceIndex.value,
      currentEncoding: currentEncoding.value,
      selectedVoice: selectedVoice.value,
      speechSpeed: speechSpeed.value,
      saveTime: new Date().toISOString(),
    }

    // 检查localStorage容量
    const stateString = JSON.stringify(state)
    if (stateString.length > 4 * 1024 * 1024) {
      // 4MB限制
      alert('存档失败：数据过大，请尝试减小文件大小')
      return
    }

    localStorage.setItem('txtReaderState', stateString)
    alert('存档成功')
  } catch (error) {
    console.error('存档失败:', error)
    alert('存档失败：' + (error as Error).message)
  }
}

// 读档
function loadState() {
  try {
    const savedState = localStorage.getItem('txtReaderState')
    if (savedState) {
      const state = JSON.parse(savedState)
      currentSentenceIndex.value = state.currentSentenceIndex || 0
      selectedEncoding.value = state.currentEncoding?.toLowerCase() || 'auto'
      selectedVoice.value = state.selectedVoice || ''
      speechSpeed.value = state.speechSpeed || '1'

      // 显示存档信息
      const saveTime = state.saveTime ? new Date(state.saveTime).toLocaleString() : '未知时间'
      alert(`读档成功\n存档时间: ${saveTime}\n文件名: ${state.currentFileName || '未知'}`)
    } else {
      alert('没有找到存档')
    }
  } catch (error) {
    console.error('读档失败:', error)
    alert('读档失败：' + (error as Error).message)
  }
}

// 生命周期钩子
onMounted(() => {
  // 初始化语音列表
  loadVoices()

  // 监听语音列表加载
  if (speechSynthesis.onvoiceschanged !== undefined) {
    speechSynthesis.onvoiceschanged = loadVoices
  }

  // 尝试加载之前的状态
  try {
    const savedState = localStorage.getItem('txtReaderState')
    if (savedState) {
      const state = JSON.parse(savedState)
      selectedEncoding.value = state.currentEncoding?.toLowerCase() || 'auto'
      selectedVoice.value = state.selectedVoice || ''
      speechSpeed.value = state.speechSpeed || '1'
    }
  } catch (error) {
    console.error('加载初始状态失败:', error)
    // 清除损坏的存档
    try {
      localStorage.removeItem('txtReaderState')
    } catch {
      // 忽略清除失败
    }
  }
})
</script>
