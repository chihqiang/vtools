<template>
  <div class="bg-gray-50 rounded-xl border border-gray-200 p-6 flex flex-col h-full">
    <!-- Header -->
    <div class="flex items-center justify-between mb-6 border-b border-gray-200 pb-4">
      <h3 class="font-semibold text-gray-800">RSA 密钥生成 & 加解密工具</h3>
    </div>

    <!-- 三列布局 -->
    <div class="flex flex-col lg:flex-row gap-6 flex-1 overflow-hidden">
      <!-- 左列：生成参数 -->
      <div class="w-full lg:w-1/4 bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
        <h4 class="font-medium text-gray-800 mb-4">生成参数</h4>
        <div class="space-y-4">
          <!-- 算法 -->
          <div>
            <label class="block text-sm text-gray-700 mb-2">算法</label>
            <select
              v-model="config.algorithm"
              class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-indigo-500"
            >
              <option value="RSA">RSA（OAEP / PKCS1 通用）</option>
            </select>
            <p class="text-xs text-gray-500 mt-1">注：OAEP 是加密方式，密钥本身相同</p>
          </div>

          <!-- 密钥长度 -->
          <div>
            <label class="block text-sm text-gray-700 mb-2">密钥长度</label>
            <select
              v-model="config.keySize"
              class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-indigo-500"
            >
              <option value="1024">1024 位</option>
              <option value="2048">2048 位（推荐）</option>
              <option value="4096">4096 位</option>
            </select>
          </div>

          <!-- 格式 -->
          <div>
            <label class="block text-sm text-gray-700 mb-2">格式</label>
            <select
              v-model="config.format"
              class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-indigo-500"
            >
              <option value="PEM">PEM</option>
              <option value="DER">DER（Base64 展示）</option>
            </select>
          </div>
        </div>

        <!-- 按钮 -->
        <div class="flex gap-3 mt-6">
          <button
            @click="generateKeyPair"
            :disabled="loading"
            class="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-md text-sm hover:bg-indigo-700 transition disabled:opacity-50"
          >
            {{ loading ? '生成中…' : '生成密钥对' }}
          </button>
          <button
            @click="clearAll"
            class="px-4 py-2 bg-gray-200 text-gray-700 rounded-md text-sm hover:bg-gray-300 transition"
          >
            清空
          </button>
        </div>
      </div>

      <!-- 中列：密钥对（私钥在上，公钥在下） -->
      <div class="w-full lg:w-2/4 flex flex-col gap-6 overflow-hidden">
        <!-- 私钥 -->
        <div
          class="flex-1 bg-white border border-gray-200 rounded-lg p-5 shadow-sm overflow-hidden"
        >
          <div class="flex items-center justify-between mb-3">
            <h4 class="font-medium text-gray-800">私钥</h4>
            <div class="flex gap-2" v-if="privateKey">
              <button
                @click="copyToClipboard(privateKey)"
                class="px-3 py-1.5 bg-orange-100 text-orange-700 rounded-md text-xs hover:bg-orange-200 transition"
              >
                复制
              </button>
              <button
                @click="downloadKey('private')"
                class="px-3 py-1.5 bg-indigo-100 text-indigo-700 rounded-md text-xs hover:bg-indigo-200 transition"
              >
                下载
              </button>
            </div>
          </div>

          <div class="mb-3 text-xs text-red-600 bg-red-50 border border-red-200 rounded p-2">
            ⚠ 私钥请妥善保存，泄露将导致安全风险
          </div>

          <textarea
            v-model="privateKey"
            class="w-full h-32 border border-gray-300 rounded-md p-2 text-xs font-mono"
            placeholder="请生成或粘贴私钥（PEM / Base64 DER）"
          />

          <!-- OpenSSL 命令示例 -->
          <div
            v-if="privateKey"
            class="mt-2 p-2 bg-gray-50 border border-gray-200 rounded text-xs text-gray-700"
          >
            <p>OpenSSL 生成对应私钥命令示例：</p>
            <pre class="break-all mt-1">
openssl genrsa -out private_{{ config.keySize }}.pem {{ config.keySize }}
            </pre>
          </div>
        </div>

        <!-- 公钥 -->
        <div
          class="flex-1 bg-white border border-gray-200 rounded-lg p-5 shadow-sm overflow-hidden"
        >
          <div class="flex items-center justify-between mb-3">
            <h4 class="font-medium text-gray-800">公钥</h4>
            <div class="flex gap-2" v-if="publicKey">
              <button
                @click="copyToClipboard(publicKey)"
                class="px-3 py-1.5 bg-green-100 text-green-700 rounded-md text-xs hover:bg-green-200 transition"
              >
                复制
              </button>
              <button
                @click="downloadKey('public')"
                class="px-3 py-1.5 bg-indigo-100 text-indigo-700 rounded-md text-xs hover:bg-indigo-200 transition"
              >
                下载
              </button>
            </div>
          </div>

          <textarea
            v-model="publicKey"
            class="w-full h-32 border border-gray-300 rounded-md p-2 text-xs font-mono mb-1"
            placeholder="请生成或粘贴公钥（PEM / Base64 DER）"
          />

          <!-- OpenSSL 命令示例 -->
          <div
            v-if="publicKey"
            class="mt-2 p-2 bg-gray-50 border border-gray-200 rounded text-xs text-gray-700"
          >
            <p>OpenSSL 生成对应公钥命令示例：</p>
            <pre class="break-all mt-1">
openssl rsa -in private_{{ config.keySize }}.pem -pubout -out public_{{ config.keySize }}.pem
            </pre>
          </div>
        </div>
      </div>

      <!-- 右列：加密 / 解密 -->
      <div
        class="w-full lg:w-1/4 bg-white border border-gray-200 rounded-lg p-5 shadow-sm flex flex-col"
      >
        <h4 class="font-medium text-gray-800 mb-4">加密 / 解密</h4>

        <!-- 明文 -->
        <label class="text-sm text-gray-700 mb-1">明文</label>
        <textarea
          v-model="plainText"
          class="w-full h-24 border border-gray-300 rounded-md p-2 text-sm mb-3"
          placeholder="输入要加密的内容"
        />

        <button
          @click="encrypt"
          class="mb-3 px-4 py-2 bg-indigo-600 text-white rounded-md text-sm hover:bg-indigo-700 transition"
          :disabled="!publicKey"
        >
          加密 →
        </button>

        <!-- 密文 -->
        <label class="text-sm text-gray-700 mb-1">密文（Base64）</label>
        <textarea
          v-model="cipherText"
          class="w-full h-24 border border-gray-300 rounded-md p-2 text-sm mb-3"
          placeholder="加密结果"
        />

        <button
          @click="decrypt"
          class="mb-3 px-4 py-2 bg-green-600 text-white rounded-md text-sm hover:bg-green-700 transition"
          :disabled="!privateKey"
        >
          解密 →
        </button>

        <!-- 解密结果 -->
        <label class="text-sm text-gray-700 mb-1">解密结果</label>
        <textarea
          v-model="decryptedText"
          class="w-full h-24 border border-gray-300 rounded-md p-2 text-sm"
          placeholder="解密后的内容"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import * as forge from 'node-forge'
import { useToast } from '@/composables/useToast'

const toast = useToast()

// 状态
const loading = ref(false)
const publicKey = ref('')
const privateKey = ref('')
const plainText = ref('')
const cipherText = ref('')
const decryptedText = ref('')

// 配置
const config = ref({
  algorithm: 'RSA',
  keySize: '2048',
  format: 'PEM',
})

// 工具：ASN1 → DER Base64
const toDerBase64 = (asn1: forge.asn1.Asn1) =>
  forge.util.encode64(forge.asn1.toDer(asn1).getBytes())

// 生成密钥
const generateKeyPair = () => {
  loading.value = true
  const bits = parseInt(config.value.keySize, 10)

  forge.pki.rsa.generateKeyPair({ bits, workers: -1 }, (err, keypair) => {
    loading.value = false
    if (err || !keypair) {
      console.error(err)
      toast.error('密钥生成失败')
      return
    }

    if (config.value.format === 'PEM') {
      publicKey.value = forge.pki.publicKeyToPem(keypair.publicKey)
      privateKey.value = forge.pki.privateKeyToPem(keypair.privateKey)
    } else {
      publicKey.value = toDerBase64(forge.pki.publicKeyToAsn1(keypair.publicKey))
      privateKey.value = toDerBase64(forge.pki.privateKeyToAsn1(keypair.privateKey))
    }

    toast.success('密钥对生成成功')
  })
}

// 清空
const clearAll = () => {
  publicKey.value = ''
  privateKey.value = ''
  plainText.value = ''
  cipherText.value = ''
  decryptedText.value = ''
  toast.success('已清空')
}

// 复制
const copyToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text)
    toast.success('已复制到剪贴板')
  } catch {
    toast.error('复制失败')
  }
}

// 下载
const downloadKey = (type: 'public' | 'private') => {
  const content = type === 'public' ? publicKey.value : privateKey.value
  if (!content) return

  const bits = config.value.keySize
  const ext = config.value.format === 'PEM' ? 'pem' : 'der'
  const filename = `rsa_${bits}_${type}.${ext}`

  let blob: Blob
  if (config.value.format === 'PEM') {
    blob = new Blob([content], { type: 'application/x-pem-file' })
  } else {
    const binary = forge.util.decode64(content)
    const bytes = new Uint8Array(binary.length)
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i)
    blob = new Blob([bytes], { type: 'application/octet-stream' })
  }

  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)

  toast.success('文件已下载')
}

// 加密（RSA-OAEP + SHA-256）
const encrypt = () => {
  try {
    const pub = forge.pki.publicKeyFromPem(publicKey.value)
    const encrypted = pub.encrypt(plainText.value, 'RSA-OAEP', {
      md: forge.md.sha256.create(),
    })
    cipherText.value = forge.util.encode64(encrypted)
  } catch {
    toast.error('加密失败，请检查公钥格式')
  }
}

// 解密
const decrypt = () => {
  try {
    const pri = forge.pki.privateKeyFromPem(privateKey.value)
    const decoded = forge.util.decode64(cipherText.value)
    decryptedText.value = pri.decrypt(decoded, 'RSA-OAEP', {
      md: forge.md.sha256.create(),
    })
  } catch {
    toast.error('解密失败，请检查私钥格式')
  }
}
</script>
