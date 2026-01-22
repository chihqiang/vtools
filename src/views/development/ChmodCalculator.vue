<template>
  <div class="min-h-screen bg-white py-10">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- 页面标题 -->
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-gray-800 mb-2">Chmod 权限计算器</h1>
        <p class="text-gray-600 max-w-2xl mx-auto">Linux 文件权限计算工具，支持八进制和符号表示</p>
      </div>

      <!-- 权限设置 -->
      <div class="border border-gray-200 rounded-lg p-6 mb-8">
        <h2 class="text-lg font-semibold text-gray-700 mb-4">权限设置</h2>

        <!-- 权限输入 -->
        <div class="mb-6">
          <h3 class="text-md font-medium text-gray-600 mb-2">输入权限</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-600 mb-1"
                >八进制表示 (例如: 755)</label
              >
              <div class="flex gap-2">
                <input
                  type="text"
                  v-model="permissionInput"
                  @input="parsePermissionInput"
                  placeholder="输入八进制权限，如 755"
                  class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  @click="clearPermissionInput"
                  class="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
                >
                  清除
                </button>
              </div>
              <p v-if="permissionError" class="mt-1 text-sm text-red-600">{{ permissionError }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-600 mb-1"
                >符号表示 (例如: rwxr-xr-x)</label
              >
              <div class="flex gap-2">
                <input
                  type="text"
                  v-model="symbolicInput"
                  @input="parseSymbolicInput"
                  placeholder="输入符号权限，如 rwxr-xr-x"
                  class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  @click="clearSymbolicInput"
                  class="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
                >
                  清除
                </button>
              </div>
              <p v-if="symbolicError" class="mt-1 text-sm text-red-600">{{ symbolicError }}</p>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <!-- 用户权限 -->
          <div class="border border-gray-200 rounded-lg p-4">
            <h3 class="font-medium text-center text-gray-700 mb-3">用户 (u)</h3>
            <div class="space-y-2">
              <label class="flex items-center gap-2">
                <input
                  type="checkbox"
                  v-model="permissions.user.read"
                  class="w-4 h-4 text-blue-600"
                />
                <span>读取 (r)</span>
              </label>
              <label class="flex items-center gap-2">
                <input
                  type="checkbox"
                  v-model="permissions.user.write"
                  class="w-4 h-4 text-blue-600"
                />
                <span>写入 (w)</span>
              </label>
              <label class="flex items-center gap-2">
                <input
                  type="checkbox"
                  v-model="permissions.user.execute"
                  class="w-4 h-4 text-blue-600"
                />
                <span>执行 (x)</span>
              </label>
            </div>
          </div>

          <!-- 组权限 -->
          <div class="border border-gray-200 rounded-lg p-4">
            <h3 class="font-medium text-center text-gray-700 mb-3">组 (g)</h3>
            <div class="space-y-2">
              <label class="flex items-center gap-2">
                <input
                  type="checkbox"
                  v-model="permissions.group.read"
                  class="w-4 h-4 text-green-600"
                />
                <span>读取 (r)</span>
              </label>
              <label class="flex items-center gap-2">
                <input
                  type="checkbox"
                  v-model="permissions.group.write"
                  class="w-4 h-4 text-green-600"
                />
                <span>写入 (w)</span>
              </label>
              <label class="flex items-center gap-2">
                <input
                  type="checkbox"
                  v-model="permissions.group.execute"
                  class="w-4 h-4 text-green-600"
                />
                <span>执行 (x)</span>
              </label>
            </div>
          </div>

          <!-- 其他权限 -->
          <div class="border border-gray-200 rounded-lg p-4">
            <h3 class="font-medium text-center text-gray-700 mb-3">其他 (o)</h3>
            <div class="space-y-2">
              <label class="flex items-center gap-2">
                <input
                  type="checkbox"
                  v-model="permissions.other.read"
                  class="w-4 h-4 text-purple-600"
                />
                <span>读取 (r)</span>
              </label>
              <label class="flex items-center gap-2">
                <input
                  type="checkbox"
                  v-model="permissions.other.write"
                  class="w-4 h-4 text-purple-600"
                />
                <span>写入 (w)</span>
              </label>
              <label class="flex items-center gap-2">
                <input
                  type="checkbox"
                  v-model="permissions.other.execute"
                  class="w-4 h-4 text-purple-600"
                />
                <span>执行 (x)</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      <!-- 权限预设 -->
      <div class="mb-8">
        <h2 class="text-lg font-semibold text-gray-700 mb-3">常见权限预设</h2>
        <div class="flex flex-wrap gap-2">
          <button
            v-for="preset in permissionPresets"
            :key="preset.value"
            @click="applyPreset(preset.value)"
            class="px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 font-medium rounded-md transition-colors"
          >
            {{ preset.label }} ({{ preset.value }})
          </button>
        </div>
      </div>

      <!-- 权限显示 -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <!-- 八进制表示 -->
        <div class="border border-gray-200 rounded-lg p-5">
          <h2 class="text-md font-medium text-gray-600 mb-3">八进制表示</h2>
          <div class="text-3xl font-mono font-bold text-center p-4 bg-gray-50 rounded">
            {{ octalPermission }}
          </div>
        </div>

        <!-- 符号表示 -->
        <div class="border border-gray-200 rounded-lg p-5">
          <h2 class="text-md font-medium text-gray-600 mb-3">符号表示</h2>
          <div class="text-3xl font-mono font-bold text-center p-4 bg-gray-50 rounded">
            {{ symbolicPermission }}
          </div>
        </div>
      </div>

      <!-- 命令生成 -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <!-- 文件命令 -->
        <div class="border border-gray-200 rounded-lg p-5">
          <h2 class="text-md font-medium text-gray-600 mb-3">文件命令</h2>
          <div class="flex flex-col gap-2">
            <code class="flex-1 p-3 bg-gray-50 rounded font-mono text-gray-700">
              chmod {{ octalPermission }} filename
            </code>
            <button
              @click="copyCommand('file')"
              class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              复制命令
            </button>
          </div>
        </div>

        <!-- 目录命令 -->
        <div class="border border-gray-200 rounded-lg p-5">
          <h2 class="text-md font-medium text-gray-600 mb-3">目录命令</h2>
          <div class="flex flex-col gap-2">
            <code class="flex-1 p-3 bg-gray-50 rounded font-mono text-gray-700">
              chmod -R {{ octalPermission }} directory
            </code>
            <button
              @click="copyCommand('dir')"
              class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              复制命令
            </button>
          </div>
        </div>
      </div>

      <!-- chmod 命令详解 -->
      <div class="border border-gray-200 rounded-lg p-6 mb-8">
        <h2 class="text-lg font-semibold text-gray-700 mb-4">chmod 命令详解</h2>
        <div class="space-y-4">
          <!-- 基本语法 -->
          <div>
            <h3 class="text-md font-medium text-gray-600 mb-2">基本语法</h3>
            <code class="block p-3 bg-gray-50 rounded font-mono text-gray-700">
              chmod [选项] 权限 文件/目录
            </code>
          </div>

          <!-- 八进制权限 -->
          <div>
            <h3 class="text-md font-medium text-gray-600 mb-2">八进制权限表示</h3>
            <ul class="list-disc pl-5 space-y-1 text-gray-600">
              <li><code>4</code> - 读权限 (r)</li>
              <li><code>2</code> - 写权限 (w)</li>
              <li><code>1</code> - 执行权限 (x)</li>
              <li>
                组合示例: <code>7</code> = 4+2+1 = rwx, <code>6</code> = 4+2 = rw-, <code>5</code> =
                4+1 = r-x
              </li>
            </ul>
          </div>

          <!-- 符号权限 -->
          <div>
            <h3 class="text-md font-medium text-gray-600 mb-2">符号权限表示</h3>
            <ul class="list-disc pl-5 space-y-1 text-gray-600">
              <li><code>u</code> - 用户（文件所有者）</li>
              <li><code>g</code> - 组（文件所属组）</li>
              <li><code>o</code> - 其他用户</li>
              <li><code>a</code> - 所有用户（u+g+o）</li>
              <li>
                <code>+</code> - 添加权限, <code>-</code> - 移除权限, <code>=</code> - 设置权限
              </li>
            </ul>
          </div>

          <!-- 常用选项 -->
          <div>
            <h3 class="text-md font-medium text-gray-600 mb-2">常用选项</h3>
            <ul class="list-disc pl-5 space-y-1 text-gray-600">
              <li><code>-R</code> - 递归应用权限到目录及其所有子内容</li>
              <li><code>-v</code> - 显示详细信息</li>
              <li><code>-c</code> - 只显示权限变更的文件</li>
            </ul>
          </div>

          <!-- 示例 -->
          <div>
            <h3 class="text-md font-medium text-gray-600 mb-2">示例</h3>
            <ul class="list-disc pl-5 space-y-1 text-gray-600">
              <li><code>chmod 755 file</code> - 设置文件权限为 rwxr-xr-x</li>
              <li><code>chmod -R 755 dir</code> - 递归设置目录权限为 rwxr-xr-x</li>
              <li><code>chmod u+x file</code> - 为文件所有者添加执行权限</li>
              <li><code>chmod go-w file</code> - 移除组和其他用户的写权限</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

// 权限接口
interface Permission {
  read: boolean
  write: boolean
  execute: boolean
}

interface Permissions {
  user: Permission
  group: Permission
  other: Permission
}

// 权限预设接口
interface PermissionPreset {
  label: string
  value: string
}

// 权限状态
const permissions = ref<Permissions>({
  user: { read: true, write: true, execute: true },
  group: { read: true, write: false, execute: true },
  other: { read: true, write: false, execute: true },
})

// 权限预设
const permissionPresets = ref<PermissionPreset[]>([
  { label: '文件默认', value: '644' },
  { label: '目录默认', value: '755' },
  { label: '可执行文件', value: '755' },
  { label: '完全权限', value: '777' },
  { label: '只读', value: '444' },
  { label: '用户完全控制', value: '700' },
  { label: '用户读写', value: '600' },
])

// 计算单个权限组的八进制值
const calculatePermissionValue = (perm: Permission): number => {
  let value = 0
  if (perm.read) value += 4
  if (perm.write) value += 2
  if (perm.execute) value += 1
  return value
}

// 计算完整的八进制权限
const octalPermission = computed(() => {
  const userValue = calculatePermissionValue(permissions.value.user)
  const groupValue = calculatePermissionValue(permissions.value.group)
  const otherValue = calculatePermissionValue(permissions.value.other)
  return `${userValue}${groupValue}${otherValue}`
})

// 计算符号表示
const symbolicPermission = computed(() => {
  const getUserSymbol = (perm: Permission) => {
    return (perm.read ? 'r' : '-') + (perm.write ? 'w' : '-') + (perm.execute ? 'x' : '-')
  }

  return (
    getUserSymbol(permissions.value.user) +
    getUserSymbol(permissions.value.group) +
    getUserSymbol(permissions.value.other)
  )
})

// 应用权限预设
const applyPreset = (presetValue: string) => {
  if (presetValue.length !== 3) return

  const values = presetValue.split('').map(Number)

  // 确保 values 数组元素不为 undefined
  const userValue = values[0] || 0
  const groupValue = values[1] || 0
  const otherValue = values[2] || 0

  // 应用用户权限
  permissions.value.user.read = (userValue & 4) === 4
  permissions.value.user.write = (userValue & 2) === 2
  permissions.value.user.execute = (userValue & 1) === 1

  // 应用组权限
  permissions.value.group.read = (groupValue & 4) === 4
  permissions.value.group.write = (groupValue & 2) === 2
  permissions.value.group.execute = (groupValue & 1) === 1

  // 应用其他权限
  permissions.value.other.read = (otherValue & 4) === 4
  permissions.value.other.write = (otherValue & 2) === 2
  permissions.value.other.execute = (otherValue & 1) === 1
}

// 权限输入处理
const permissionInput = ref('')
const symbolicInput = ref('')
const permissionError = ref('')
const symbolicError = ref('')

// 解析八进制权限输入
const parsePermissionInput = () => {
  const input = permissionInput.value.trim()
  if (!input) {
    permissionError.value = ''
    return
  }

  // 验证输入是否为有效的八进制权限
  if (!/^[0-7]{3,4}$/.test(input)) {
    permissionError.value = '请输入有效的八进制权限（3-4位数字，范围0-7）'
    return
  }

  permissionError.value = ''

  // 取最后三位作为权限值
  const values = input.slice(-3).split('').map(Number)

  // 确保 values 数组长度为 3
  const userValue = values[0] || 0
  const groupValue = values[1] || 0
  const otherValue = values[2] || 0

  // 应用权限
  permissions.value.user.read = (userValue & 4) === 4
  permissions.value.user.write = (userValue & 2) === 2
  permissions.value.user.execute = (userValue & 1) === 1

  permissions.value.group.read = (groupValue & 4) === 4
  permissions.value.group.write = (groupValue & 2) === 2
  permissions.value.group.execute = (groupValue & 1) === 1

  permissions.value.other.read = (otherValue & 4) === 4
  permissions.value.other.write = (otherValue & 2) === 2
  permissions.value.other.execute = (otherValue & 1) === 1

  // 清除符号输入，保持一致性
  symbolicInput.value = ''
  symbolicError.value = ''
}

// 解析符号权限输入
const parseSymbolicInput = () => {
  const input = symbolicInput.value.trim()
  if (!input) {
    symbolicError.value = ''
    return
  }

  // 处理包含文件类型标识的格式（如 -rw-------）
  let permString = input
  if (input.length === 10) {
    const firstChar = input[0]
    if (firstChar && ['-', 'd', 'l', 'c', 'b', 's', 'p'].includes(firstChar)) {
      permString = input.slice(1)
    }
  }

  // 验证输入是否为有效的符号权限
  if (!/^[rwx-]{3}[rwx-]{3}[rwx-]{3}$/.test(permString)) {
    symbolicError.value = '请输入有效的符号权限（例如：rwxr-xr-x 或 -rw-------）'
    return
  }

  symbolicError.value = ''

  // 解析权限
  const userPerms = permString.slice(0, 3)
  const groupPerms = permString.slice(3, 6)
  const otherPerms = permString.slice(6, 9)

  // 应用权限
  permissions.value.user.read = userPerms.includes('r')
  permissions.value.user.write = userPerms.includes('w')
  permissions.value.user.execute = userPerms.includes('x')

  permissions.value.group.read = groupPerms.includes('r')
  permissions.value.group.write = groupPerms.includes('w')
  permissions.value.group.execute = groupPerms.includes('x')

  permissions.value.other.read = otherPerms.includes('r')
  permissions.value.other.write = otherPerms.includes('w')
  permissions.value.other.execute = otherPerms.includes('x')

  // 清除八进制输入，保持一致性
  permissionInput.value = ''
  permissionError.value = ''
}

// 清除八进制输入
const clearPermissionInput = () => {
  permissionInput.value = ''
  permissionError.value = ''
}

// 清除符号输入
const clearSymbolicInput = () => {
  symbolicInput.value = ''
  symbolicError.value = ''
}

// 复制命令到剪贴板
const copyCommand = (type: 'file' | 'dir' = 'file') => {
  const command =
    type === 'file'
      ? `chmod ${octalPermission.value} filename`
      : `chmod -R ${octalPermission.value} directory`
  navigator.clipboard
    .writeText(command)
    .then(() => {
      alert('命令已复制到剪贴板！')
    })
    .catch((err) => {
      console.error('复制失败:', err)
    })
}
</script>

<style scoped>
/* 自定义样式 */
</style>
