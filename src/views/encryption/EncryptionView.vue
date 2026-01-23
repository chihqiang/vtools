<template>
  <div class="bg-white rounded-lg shadow-md p-6 h-full">
    <!-- 输入区域 -->
    <div>
      <div class="flex items-center justify-between mb-3">
        <h3 class="font-semibold text-gray-700">文本区域</h3>
        <div class="flex space-x-2">
          <button
            @click="toggleCase"
            class="px-3 py-2 bg-yellow-500 text-white rounded text-sm shadow-sm hover:shadow transition-all duration-150"
          >
            大小写切换
          </button>
          <button
            @click="pasteInput"
            class="px-3 py-2 bg-blue-500 text-white rounded text-sm shadow-sm hover:shadow transition-all duration-150"
          >
            粘贴
          </button>
          <button
            @click="copyOutput"
            class="px-3 py-2 bg-green-500 text-white rounded text-sm shadow-sm hover:shadow transition-all duration-150"
          >
            复制
          </button>
          <button
            @click="clearInput"
            class="px-3 py-2 bg-gray-600 text-white rounded text-sm shadow-sm hover:shadow transition-all duration-150"
          >
            清空
          </button>
        </div>
      </div>

      <div class="border border-gray-300 rounded-lg overflow-hidden">
        <textarea
          v-model="inputText"
          placeholder="请输入要加密 / 解密的文本..."
          class="w-full min-h-[100px] p-4 font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
        ></textarea>
      </div>
    </div>

    <!-- 操作区域 -->
    <div class="mt-6 space-y-6">
      <!-- 编码/解码 -->
      <div class="border border-gray-300 rounded-lg p-4">
        <h4 class="text-sm font-medium text-gray-700 mb-3">编码/解码</h4>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-2">
          <button
            @click="encryptBase64"
            class="px-3 py-2 bg-blue-500 text-white rounded text-sm shadow-sm hover:shadow transition-all duration-150"
          >
            Base64 加密
          </button>
          <button
            @click="decryptBase64"
            class="px-3 py-2 bg-green-500 text-white rounded text-sm shadow-sm hover:shadow transition-all duration-150"
          >
            Base64 解密
          </button>
          <button
            @click="encodeUrl"
            class="px-3 py-2 bg-blue-500 text-white rounded text-sm shadow-sm hover:shadow transition-all duration-150"
          >
            URL 编码
          </button>
          <button
            @click="decodeUrl"
            class="px-3 py-2 bg-green-500 text-white rounded text-sm shadow-sm hover:shadow transition-all duration-150"
          >
            URL 解码
          </button>
        </div>
      </div>

      <!-- MD5哈希 -->
      <div class="border border-gray-300 rounded-lg p-4">
        <h4 class="text-sm font-medium text-gray-700 mb-3">MD5哈希</h4>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-2">
          <button
            @click="md5_32_lower"
            class="px-3 py-2 bg-purple-500 text-white rounded text-sm shadow-sm hover:shadow transition-all duration-150"
          >
            MD5 32位
          </button>
          <button
            @click="md5_16_lower"
            class="px-3 py-2 bg-purple-500 text-white rounded text-sm shadow-sm hover:shadow transition-all duration-150"
          >
            MD5 16位
          </button>
        </div>
      </div>

      <!-- SHA系列 -->
      <div class="border border-gray-300 rounded-lg p-4">
        <h4 class="text-sm font-medium text-gray-700 mb-3">SHA系列</h4>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-2">
          <button
            @click="sha1Hash"
            class="px-3 py-2 bg-indigo-500 text-white rounded text-sm shadow-sm hover:shadow transition-all duration-150"
          >
            SHA1
          </button>
          <button
            @click="sha224Hash"
            class="px-3 py-2 bg-indigo-500 text-white rounded text-sm shadow-sm hover:shadow transition-all duration-150"
          >
            SHA224
          </button>
          <button
            @click="sha256Hash"
            class="px-3 py-2 bg-indigo-500 text-white rounded text-sm shadow-sm hover:shadow transition-all duration-150"
          >
            SHA256
          </button>
          <button
            @click="sha384Hash"
            class="px-3 py-2 bg-indigo-500 text-white rounded text-sm shadow-sm hover:shadow transition-all duration-150"
          >
            SHA384
          </button>
          <button
            @click="sha512Hash"
            class="px-3 py-2 bg-indigo-500 text-white rounded text-sm shadow-sm hover:shadow transition-all duration-150"
          >
            SHA512
          </button>
        </div>
      </div>

      <!-- 其他哈希算法 -->
      <div class="border border-gray-300 rounded-lg p-4">
        <h4 class="text-sm font-medium text-gray-700 mb-3">其他哈希算法</h4>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-2">
          <button
            @click="sha3Hash"
            class="px-3 py-2 bg-emerald-500 text-white rounded text-sm shadow-sm hover:shadow transition-all duration-150"
          >
            SHA3
          </button>
          <button
            @click="ripemd160Hash"
            class="px-3 py-2 bg-emerald-500 text-white rounded text-sm shadow-sm hover:shadow transition-all duration-150"
          >
            RIPEMD160
          </button>
        </div>
      </div>

      <!-- HMAC系列 -->
      <div class="border border-gray-300 rounded-lg p-4">
        <h4 class="text-sm font-medium text-gray-700 mb-3">HMAC系列（使用默认密钥）</h4>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-2">
          <button
            @click="hmacMd5Hash"
            class="px-3 py-2 bg-orange-500 text-white rounded text-sm shadow-sm hover:shadow transition-all duration-150"
          >
            HMAC-MD5
          </button>
          <button
            @click="hmacSha1Hash"
            class="px-3 py-2 bg-orange-500 text-white rounded text-sm shadow-sm hover:shadow transition-all duration-150"
          >
            HMAC-SHA1
          </button>
          <button
            @click="hmacSha256Hash"
            class="px-3 py-2 bg-orange-500 text-white rounded text-sm shadow-sm hover:shadow transition-all duration-150"
          >
            HMAC-SHA256
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useToast } from '@/composables/useToast'
import { base64, url, md5Hash, sha, ripemd, hmac } from '@/utils/encryption'
import { toastCopy } from '@/utils/clipboard'

const toast = useToast()
const inputText = ref('')

/* ---------- 工具 ---------- */

const ensureInput = () => {
  if (!inputText.value.trim()) {
    toast.warning('请先输入文本')
    return false
  }
  return true
}

/* ---------- 剪贴板 ---------- */

const pasteInput = async () => {
  try {
    inputText.value = await navigator.clipboard.readText()
    toast.success('已粘贴')
  } catch {
    toast.error('粘贴失败')
  }
}

const copyOutput = async () => {
  if (!ensureInput()) return
  toastCopy(inputText.value)
}

const clearInput = () => {
  inputText.value = ''
  toast.success('已清空')
}

/* ---------- 大小写转换 ---------- */

const toggleCase = () => {
  if (!ensureInput()) return

  // 检查当前文本的大小写状态
  const hasLowerCase = /[a-z]/.test(inputText.value)
  const hasUpperCase = /[A-Z]/.test(inputText.value)

  let newText = ''
  let message = ''

  if (hasUpperCase && !hasLowerCase) {
    // 全大写 -> 转小写
    newText = inputText.value.toLowerCase()
    message = '已转换为小写'
  } else {
    // 包含小写或混合大小写 -> 转大写
    newText = inputText.value.toUpperCase()
    message = '已转换为大写'
  }

  inputText.value = newText
  toast.success(message)
}

/* ---------- Base64 ---------- */

const encryptBase64 = () => {
  if (!ensureInput()) return
  try {
    inputText.value = base64.encrypt(inputText.value)
    toast.success('Base64 加密成功')
  } catch {
    toast.error('Base64 加密失败')
  }
}

const decryptBase64 = () => {
  if (!ensureInput()) return
  try {
    inputText.value = base64.decrypt(inputText.value)
    toast.success('Base64 解密成功')
  } catch {
    toast.error('Base64 解密失败，请确认输入内容')
  }
}

/* ---------- URL ---------- */

const encodeUrl = () => {
  if (!ensureInput()) return
  try {
    inputText.value = url.encode(inputText.value)
    toast.success('URL 编码成功')
  } catch {
    toast.error('URL 编码失败')
  }
}

const decodeUrl = () => {
  if (!ensureInput()) return
  try {
    inputText.value = url.decode(inputText.value)
    toast.success('URL 解码成功')
  } catch {
    toast.error('URL 解码失败，请确认格式')
  }
}

/* ---------- MD5 ---------- */

const md5_32_lower = () => {
  if (!ensureInput()) return
  inputText.value = md5Hash[32](inputText.value)
  toast.success('MD5 32位生成成功')
}

const md5_16_lower = () => {
  if (!ensureInput()) return
  inputText.value = md5Hash[16](inputText.value)
  toast.success('MD5 16位生成成功')
}

/* ---------- SHA系列 ---------- */

const sha1Hash = () => {
  if (!ensureInput()) return
  inputText.value = sha.sha1(inputText.value)
  toast.success('SHA1生成成功')
}

const sha256Hash = () => {
  if (!ensureInput()) return
  inputText.value = sha.sha256(inputText.value)
  toast.success('SHA256生成成功')
}

const sha512Hash = () => {
  if (!ensureInput()) return
  inputText.value = sha.sha512(inputText.value)
  toast.success('SHA512生成成功')
}

/* ---------- 其他哈希算法 ---------- */

const sha3Hash = () => {
  if (!ensureInput()) return
  inputText.value = sha.sha3(inputText.value)
  toast.success('SHA3生成成功')
}

const ripemd160Hash = () => {
  if (!ensureInput()) return
  inputText.value = ripemd.ripemd160(inputText.value)
  toast.success('RIPEMD160生成成功')
}

/* ---------- 更多SHA算法 ---------- */

const sha224Hash = () => {
  if (!ensureInput()) return
  inputText.value = sha.sha224(inputText.value)
  toast.success('SHA224生成成功')
}

const sha384Hash = () => {
  if (!ensureInput()) return
  inputText.value = sha.sha384(inputText.value)
  toast.success('SHA384生成成功')
}

/* ---------- HMAC系列 ---------- */

const hmacMd5Hash = () => {
  if (!ensureInput()) return
  inputText.value = hmac.md5(inputText.value)
  toast.success('HMAC-MD5生成成功')
}

const hmacSha1Hash = () => {
  if (!ensureInput()) return
  inputText.value = hmac.sha1(inputText.value)
  toast.success('HMAC-SHA1生成成功')
}

const hmacSha256Hash = () => {
  if (!ensureInput()) return
  inputText.value = hmac.sha256(inputText.value)
  toast.success('HMAC-SHA256生成成功')
}
</script>

<style scoped></style>
