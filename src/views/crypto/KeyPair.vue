<template>
  <div class="bg-gray-50 rounded-xl border border-gray-200 p-6 flex flex-col h-full">
    <!-- Header -->
    <div class="flex items-center justify-between mb-6 border-b border-gray-200 pb-4">
      <h3 class="font-semibold text-gray-800">RSA 密钥生成 & 加解密工具</h3>
    </div>

    <!-- 左右布局 -->
    <div class="flex flex-col lg:flex-row gap-6 flex-1 overflow-hidden">
      <!-- 左列：生成参数 -->
      <div class="w-full lg:w-1/3 bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
        <h4 class="font-medium text-gray-800 mb-4">生成参数</h4>
        <div class="space-y-4">
          <!-- 算法 -->
          <div>
            <label class="block text-sm text-gray-700 mb-2">算法</label>
            <select
              v-model="config.algorithm"
              class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-indigo-500"
            >
              <option v-for="option in ALGORITHM_OPTIONS" :key="option.value" :value="option.value">
                {{ option.label }}
              </option>
            </select>
            <p class="text-xs text-gray-500 mt-1">
              RSA 支持 OAEP / PKCS#1 v1.5 加密方式，ED25519 仅支持签名/验证
            </p>
          </div>

          <!-- 密钥长度 -->
          <div v-if="config.algorithm === 'RSA'">
            <label class="block text-sm text-gray-700 mb-2">密钥长度</label>
            <select
              v-model="config.keySize"
              class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-indigo-500"
            >
              <option v-for="option in KEY_SIZE_OPTIONS" :key="option.value" :value="option.value">
                {{ option.label }}
              </option>
            </select>
            <p class="text-xs text-gray-500 mt-1">更大的密钥长度更安全，但生成速度更慢</p>
          </div>

          <!-- 公钥指数 -->
          <div v-if="config.algorithm === 'RSA'">
            <label class="block text-sm text-gray-700 mb-2">公钥指数 (e)</label>
            <select
              v-model="config.publicExponent"
              class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-indigo-500"
            >
              <option
                v-for="option in PUBLIC_EXPONENT_OPTIONS"
                :key="option.value"
                :value="option.value"
              >
                {{ option.label }}
              </option>
            </select>
            <p class="text-xs text-gray-500 mt-1">65537 是更安全的默认值</p>
          </div>

          <!-- 格式 -->
          <div>
            <label class="block text-sm text-gray-700 mb-2">格式</label>
            <select
              v-model="config.format"
              class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-indigo-500"
            >
              <option v-for="option in FORMAT_OPTIONS" :key="option.value" :value="option.value">
                {{ option.label }}
              </option>
            </select>
            <div class="mt-1 text-xs text-gray-500">
              <div>PEM: 文本格式，包含 -----BEGIN/END----- 标记</div>
              <div>DER: 二进制格式，使用 Base64 编码显示</div>
            </div>
          </div>

          <!-- SSH 私钥加密 -->
          <div v-if="config.algorithm === 'RSA'">
            <label class="block text-sm text-gray-700 mb-2">SSH 私钥加密</label>
            <div class="flex gap-2">
              <input
                v-model="sshPassphrase"
                type="password"
                placeholder="输入密码（可选）"
                class="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <p class="text-xs text-gray-500 mt-1">设置密码将生成加密的 SSH 格式私钥</p>
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

      <!-- 右列：密钥对 -->
      <div class="w-full lg:w-2/3 flex flex-col gap-6">
        <!-- 私钥 -->
        <div
          class="bg-white border border-gray-200 rounded-lg p-5 shadow-sm flex-1 overflow-hidden flex flex-col"
        >
          <div class="flex items-center justify-between mb-3">
            <h4 class="font-medium text-gray-800">私钥</h4>
            <button
              @click="copyPrivateKey"
              :disabled="!privateKey"
              class="px-3 py-1 bg-gray-100 text-gray-700 rounded-md text-xs hover:bg-gray-200 transition disabled:opacity-50"
            >
              复制
            </button>
          </div>
          <textarea
            v-model="privateKey"
            readonly
            class="w-full flex-1 border border-gray-300 rounded-md p-3 text-sm font-mono break-all resize-none"
            placeholder="私钥将显示在这里"
          ></textarea>
        </div>

        <!-- 公钥 -->
        <div
          class="bg-white border border-gray-200 rounded-lg p-5 shadow-sm flex-1 overflow-hidden flex flex-col"
        >
          <div class="flex items-center justify-between mb-3">
            <h4 class="font-medium text-gray-800">公钥</h4>
            <button
              @click="copyPublicKey"
              :disabled="!publicKey"
              class="px-3 py-1 bg-gray-100 text-gray-700 rounded-md text-xs hover:bg-gray-200 transition disabled:opacity-50"
            >
              复制
            </button>
          </div>
          <textarea
            v-model="publicKey"
            readonly
            class="w-full flex-1 border border-gray-300 rounded-md p-3 text-sm font-mono break-all resize-none"
            placeholder="公钥将显示在这里"
          ></textarea>
        </div>

        <!-- 加密解密 -->
        <div class="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
          <h4 class="font-medium text-gray-800 mb-4">加密/解密</h4>
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <!-- 加密 -->
            <div>
              <h5 class="font-medium text-gray-700 mb-2">加密</h5>
              <div class="space-y-3">
                <textarea
                  v-model="plainText"
                  placeholder="输入要加密的文本"
                  class="w-full h-28 border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-500"
                ></textarea>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label class="block text-xs text-gray-700 mb-1">加密方案</label>
                    <select
                      v-model="cryptoConfig.encryptionScheme"
                      class="w-full px-2 py-1 border border-gray-300 rounded-md text-xs focus:ring-2 focus:ring-blue-500"
                    >
                      <option
                        v-for="option in ENCRYPTION_SCHEME_OPTIONS"
                        :key="option.value"
                        :value="option.value"
                      >
                        {{ option.label }}
                      </option>
                    </select>
                  </div>
                  <div>
                    <label class="block text-xs text-gray-700 mb-1">哈希算法</label>
                    <select
                      v-model="cryptoConfig.hashAlgorithm"
                      class="w-full px-2 py-1 border border-gray-300 rounded-md text-xs focus:ring-2 focus:ring-blue-500"
                    >
                      <option
                        v-for="option in HASH_ALGORITHM_OPTIONS"
                        :key="option.value"
                        :value="option.value"
                      >
                        {{ option.label }}
                      </option>
                    </select>
                  </div>
                </div>
                <div class="flex gap-3">
                  <button
                    @click="encrypt"
                    :disabled="!plainText || !publicKey"
                    class="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 transition disabled:opacity-50"
                  >
                    加密
                  </button>
                  <button
                    @click="clearEncrypt"
                    class="px-4 py-2 bg-gray-200 text-gray-700 rounded-md text-sm hover:bg-gray-300 transition"
                  >
                    清空
                  </button>
                </div>
              </div>
            </div>

            <!-- 解密 -->
            <div>
              <h5 class="font-medium text-gray-700 mb-2">解密</h5>
              <div class="space-y-3">
                <textarea
                  v-model="cipherText"
                  placeholder="输入要解密的文本"
                  class="w-full h-28 border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-green-500"
                ></textarea>
                <div class="flex gap-3">
                  <button
                    @click="decrypt"
                    :disabled="!cipherText || !privateKey"
                    class="flex-1 px-4 py-2 bg-green-600 text-white rounded-md text-sm hover:bg-green-700 transition disabled:opacity-50"
                  >
                    解密
                  </button>
                  <button
                    @click="clearDecrypt"
                    class="px-4 py-2 bg-gray-200 text-gray-700 rounded-md text-sm hover:bg-gray-300 transition"
                  >
                    清空
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- 解密结果 -->
          <div v-if="decryptedText" class="mt-4">
            <h5 class="font-medium text-gray-700 mb-2">解密结果</h5>
            <textarea
              v-model="decryptedText"
              readonly
              class="w-full h-28 border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-green-500"
              placeholder="解密后的内容"
            ></textarea>
          </div>
        </div>
      </div>
    </div>

    <!-- 说明文档 -->
    <div class="mt-8 pt-6 border-t border-gray-200">
      <div class="flex flex-col mb-4 pb-2">
        <h3 class="font-semibold text-gray-800">OpenSSL 密钥生成说明</h3>
        <p class="text-sm text-gray-500 mt-1">使用 OpenSSL 命令行工具生成各种类型的加密密钥</p>
      </div>

      <div class="flex flex-col gap-4">
        <!-- 常见场景生成方式 -->
        <div class="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
          <h5 class="font-medium text-gray-700 mb-3 flex items-center">常见场景生成方式</h5>
          <div class="space-y-4">
            <div>
              <h6 class="text-xs font-medium text-gray-600 mb-2">Web 服务器 HTTPS 证书密钥</h6>
              <pre
                class="break-all text-xs font-mono p-2 bg-gray-50 border border-gray-200 rounded"
              >
# 生成 2048 位 RSA 私钥
openssl genrsa -out server.key 2048

# 生成证书签名请求 (CSR)
openssl req -new -key server.key -out server.csr

# 生成自签名证书
openssl x509 -req -days 365 -in server.csr -signkey server.key -out server.crt</pre
              >
            </div>

            <div>
              <h6 class="text-xs font-medium text-gray-600 mb-2">SSH 登录密钥</h6>
              <pre
                class="break-all text-xs font-mono p-2 bg-gray-50 border border-gray-200 rounded"
              >
# 生成 RSA SSH 密钥对
ssh-keygen -t rsa -b 2048 -f ~/.ssh/id_rsa

# 生成 ED25519 SSH 密钥对 (推荐)
ssh-keygen -t ed25519 -f ~/.ssh/id_ed25519</pre
              >
            </div>

            <div>
              <h6 class="text-xs font-medium text-gray-600 mb-2">通用加密密钥</h6>
              <pre
                class="break-all text-xs font-mono p-2 bg-gray-50 border border-gray-200 rounded"
              >
# 生成 2048 位 RSA 密钥对
openssl genrsa -out private_key.pem 2048
openssl rsa -in private_key.pem -pubout -out public_key.pem

# 生成 ED25519 密钥对
openssl genpkey -algorithm ED25519 -out private_ed25519.pem
openssl pkey -in private_ed25519.pem -pubout -out public_ed25519.pem</pre
              >
            </div>
          </div>
        </div>

        <!-- 其他常用命令 -->
        <div class="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
          <h5 class="font-medium text-gray-700 mb-3 flex items-center">其他常用命令</h5>
          <div class="space-y-3">
            <div>
              <p class="text-xs text-gray-500 mb-1">生成 RSA 私钥：</p>
              <pre
                class="break-all text-xs font-mono p-2 bg-gray-50 border border-gray-200 rounded"
              >
openssl genrsa -out private_2048.pem 2048</pre
              >
            </div>

            <div>
              <p class="text-xs text-gray-500 mb-1">提取 RSA 公钥：</p>
              <pre
                class="break-all text-xs font-mono p-2 bg-gray-50 border border-gray-200 rounded"
              >
openssl rsa -in private_2048.pem -pubout -out public_2048.pem</pre
              >
            </div>

            <div>
              <p class="text-xs text-gray-500 mb-1">生成 ED25519 私钥：</p>
              <pre
                class="break-all text-xs font-mono p-2 bg-gray-50 border border-gray-200 rounded"
              >
openssl genpkey -algorithm ED25519 -out private_ed25519.pem</pre
              >
            </div>

            <div>
              <p class="text-xs text-gray-500 mb-1">提取 ED25519 公钥：</p>
              <pre
                class="break-all text-xs font-mono p-2 bg-gray-50 border border-gray-200 rounded"
              >
openssl pkey -in private_ed25519.pem -pubout -out public_ed25519.pem</pre
              >
            </div>

            <div>
              <p class="text-xs text-gray-500 mb-1">查看 RSA 私钥：</p>
              <pre
                class="break-all text-xs font-mono p-2 bg-gray-50 border border-gray-200 rounded"
              >
openssl rsa -in private_2048.pem -text -noout</pre
              >
            </div>

            <div>
              <p class="text-xs text-gray-500 mb-1">查看 RSA 公钥：</p>
              <pre
                class="break-all text-xs font-mono p-2 bg-gray-50 border border-gray-200 rounded"
              >
openssl rsa -in public_2048.pem -pubin -text -noout</pre
              >
            </div>

            <div>
              <p class="text-xs text-gray-500 mb-1">查看 ED25519 私钥：</p>
              <pre
                class="break-all text-xs font-mono p-2 bg-gray-50 border border-gray-200 rounded"
              >
openssl pkey -in private_ed25519.pem -text -noout</pre
              >
            </div>

            <div>
              <p class="text-xs text-gray-500 mb-1">查看 ED25519 公钥：</p>
              <pre
                class="break-all text-xs font-mono p-2 bg-gray-50 border border-gray-200 rounded"
              >
openssl pkey -in public_ed25519.pem -pubin -text -noout</pre
              >
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useToast } from '@/composables/useToast'
import {
  rsa,
  EncryptionScheme,
  HashAlgorithm,
  Algorithm,
  KeySize,
  PublicExponent,
  Format,
  type RsaEncryptOptions,
  type RsaDecryptOptions,
} from '@/utils/rsa'

// 算法选项
const ALGORITHM_OPTIONS = [
  { value: Algorithm.RSA, label: 'RSA' },
  { value: Algorithm.ED25519, label: 'ED25519（椭圆曲线）' },
]

// 密钥长度选项
const KEY_SIZE_OPTIONS = [
  { value: KeySize.SIZE_1024, label: '1024 位' },
  { value: KeySize.SIZE_2048, label: '2048 位（推荐）' },
  { value: KeySize.SIZE_4096, label: '4096 位' },
]

// 公钥指数选项
const PUBLIC_EXPONENT_OPTIONS = [
  { value: PublicExponent.F4, label: '65537 (0x10001)' },
  { value: PublicExponent.F0, label: '3' },
]

// 格式选项
const FORMAT_OPTIONS = [
  { value: Format.PEM, label: 'PEM' },
  { value: Format.DER, label: 'DER (Base64)' },
]

// 加密方案选项
const ENCRYPTION_SCHEME_OPTIONS = [
  { value: EncryptionScheme.OAEP, label: 'OAEP' },
  { value: EncryptionScheme.PKCS1v15, label: 'PKCS#1 v1.5' },
]

// 哈希算法选项
const HASH_ALGORITHM_OPTIONS = [
  { value: HashAlgorithm.SHA1, label: 'SHA1' },
  { value: HashAlgorithm.SHA256, label: 'SHA256' },
  { value: HashAlgorithm.SHA512, label: 'SHA512' },
]

const toast = useToast()

// 状态
const loading = ref(false)
const publicKey = ref('')
const privateKey = ref('')
const plainText = ref('')
const cipherText = ref('')
const decryptedText = ref('')
const sshPassphrase = ref('')

// 加密配置
const cryptoConfig = ref({
  encryptionScheme: EncryptionScheme.OAEP,
  hashAlgorithm: HashAlgorithm.SHA256,
})

// 配置
const config = ref({
  algorithm: Algorithm.RSA,
  keySize: KeySize.SIZE_2048,
  publicExponent: PublicExponent.F4,
  format: Format.PEM,
})

// 生成密钥对
const generateKeyPair = async () => {
  try {
    loading.value = true

    // 使用统一的 RSA 密钥生成方法
    const { privateKey: generatedPrivateKey, publicKey: generatedPublicKey } =
      await rsa.generateKeyPair({
        algorithm: config.value.algorithm as Algorithm,
        keySize: config.value.keySize as KeySize,
        publicExponent: config.value.publicExponent as PublicExponent,
        format: config.value.format as Format,
        passphrase: sshPassphrase.value || undefined,
      })

    privateKey.value = generatedPrivateKey
    publicKey.value = generatedPublicKey

    if (config.value.algorithm === 'ED25519') {
      toast.warning('ED25519 密钥生成功能暂未完全实现')
    }

    toast.success('密钥对生成成功')
  } catch (error) {
    console.error('生成密钥对失败:', error)
    toast.error('生成密钥对失败，请重试')
  } finally {
    loading.value = false
  }
}

// 加密
const encrypt = () => {
  try {
    if (!publicKey.value || !plainText.value) {
      toast.warning('请先生成公钥并输入要加密的文本')
      return
    }

    // 检查是否为 RSA 算法
    if (config.value.algorithm !== 'RSA') {
      toast.error('只有 RSA 密钥支持加密功能，ED25519 仅支持签名/验证')
      return
    }

    // 使用统一的 RSA 加密方法
    const options: RsaEncryptOptions = {
      encryptionScheme: cryptoConfig.value.encryptionScheme,
      hashAlgorithm: cryptoConfig.value.hashAlgorithm,
    }

    cipherText.value = rsa.encrypt(plainText.value, publicKey.value, options)
    toast.success('加密成功')
  } catch (error) {
    console.error('加密失败:', error)
    toast.error('加密失败，请重试')
  }
}

// 解密
const decrypt = () => {
  try {
    if (!privateKey.value || !cipherText.value) {
      toast.warning('请先生成私钥并输入要解密的文本')
      return
    }

    // 检查是否为 RSA 算法
    if (config.value.algorithm !== 'RSA') {
      toast.error('只有 RSA 密钥支持解密功能，ED25519 仅支持签名/验证')
      return
    }

    // 使用统一的 RSA 解密方法
    const options: RsaDecryptOptions = {
      encryptionScheme: cryptoConfig.value.encryptionScheme,
      hashAlgorithm: cryptoConfig.value.hashAlgorithm,
    }

    decryptedText.value = rsa.decrypt(cipherText.value, privateKey.value, options)
    toast.success('解密成功')
  } catch (error) {
    console.error('解密失败:', error)
    toast.error('解密失败，请重试')
  }
}

// 复制私钥
const copyPrivateKey = () => {
  if (!privateKey.value) return

  navigator.clipboard
    .writeText(privateKey.value)
    .then(() => {
      toast.success('私钥已复制到剪贴板')
    })
    .catch(() => {
      toast.error('复制失败')
    })
}

// 复制公钥
const copyPublicKey = () => {
  if (!publicKey.value) return

  navigator.clipboard
    .writeText(publicKey.value)
    .then(() => {
      toast.success('公钥已复制到剪贴板')
    })
    .catch(() => {
      toast.error('复制失败')
    })
}

// 清空所有
const clearAll = () => {
  privateKey.value = ''
  publicKey.value = ''
  plainText.value = ''
  cipherText.value = ''
  decryptedText.value = ''
  sshPassphrase.value = ''
  toast.success('已清空所有内容')
}

// 清空加密
const clearEncrypt = () => {
  plainText.value = ''
  cipherText.value = ''
}

// 清空解密
const clearDecrypt = () => {
  decryptedText.value = ''
}
</script>
