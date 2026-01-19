<template>
  <div class="h-full p-6 flex flex-col bg-gray-50 border border-gray-200 rounded-xl">
    <div class="flex items-center gap-3 mb-6">
      <svg class="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
      </svg>
      <h1 class="text-2xl font-semibold text-gray-900">Mock数据生成器</h1>
    </div>

    <!-- 左右布局 -->
    <div class="grid grid-cols-1 lg:grid-cols-5 gap-6">
      <!-- 左侧：KV输入区域 -->
      <div class="border border-gray-200 rounded-lg p-4 bg-white lg:col-span-3 flex flex-col">
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-1.5">字段配置</label>
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th
                    class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-2/10"
                  >
                    字段名
                  </th>
                  <th
                    class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-3/10"
                  >
                    字段类型
                  </th>
                  <th
                    class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-6/10"
                  >
                    值
                  </th>
                  <th
                    class="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-12"
                  ></th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr
                  v-for="(item, index) in fields"
                  :key="index"
                  class="hover:bg-gray-50 transition-colors"
                >
                  <td class="px-3 py-2">
                    <input
                      v-model="item.key"
                      type="text"
                      placeholder="如: name"
                      class="w-full px-3 py-1.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    />
                  </td>
                  <td class="px-3 py-2">
                    <select
                      v-model="item.type"
                      class="w-full px-3 py-1.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                      @change="handleTypeChange(item)"
                    >
                      <option v-for="(label, type) in valueTypeLabels" :key="type" :value="type">
                        {{ label }}
                      </option>
                    </select>
                  </td>
                  <td class="px-3 py-2">
                    <div class="relative">
                      <input
                        v-model="item.value"
                        type="text"
                        :placeholder="
                          item.type === ValueType.FAKER
                            ? '如: faker.person.fullName()'
                            : '直接输入值'
                        "
                        class="w-full px-3 py-1.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                      />

                      <!-- Faker函数选择器 - 点击选择按钮时弹出模态框 -->
                    </div>
                  </td>
                  <td class="px-3 py-2 text-right w-24">
                    <div class="flex justify-end items-center space-x-1">
                      <button
                        v-if="item.type === ValueType.FAKER"
                        @click="handleInputFocus(item, index)"
                        class="text-blue-500 hover:text-blue-600 hover:bg-blue-50 transition-colors p-1.5 rounded-md flex items-center justify-center"
                        title="选择Faker函数"
                      >
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M13 10V3L4 14h7v7l9-11h-7z"
                          />
                        </svg>
                      </button>
                      <button
                        @click="removeItem(index)"
                        class="text-red-500 hover:text-red-600 hover:bg-red-50 transition-colors p-1.5 rounded-md flex items-center justify-center"
                        :disabled="fields.length <= 1"
                        title="删除字段"
                      >
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <button
            @click="addField"
            class="mt-3 w-full py-2 text-sm text-indigo-600 font-medium border border-indigo-200 rounded-md hover:bg-indigo-50 transition-colors flex items-center justify-center gap-1"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 4v16m8-8H4"
              />
            </svg>
            添加字段
          </button>
        </div>

        <!-- 生成配置区域 -->
        <div class="space-y-4 mb-4">
          <div class="flex items-center gap-4">
            <div class="flex-1">
              <label class="block text-sm font-medium text-gray-700 mb-1.5">生成数量</label>
              <input
                v-model.number="generateCount"
                type="number"
                min="1"
                max="100"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              />
            </div>
            <div class="w-40">
              <label class="block text-sm font-medium text-gray-700 mb-1.5">语言</label>
              <select
                v-model="selectedLanguage"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              >
                <option
                  v-for="(label, language) in languageLabels"
                  :key="language"
                  :value="language"
                >
                  {{ label }}
                </option>
              </select>
            </div>

            <button
              @click="generateMockData"
              class="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors whitespace-nowrap"
              :disabled="loading || fields.length === 0 || fields.every((item) => !item.key.trim())"
            >
              {{ loading ? '生成中...' : '生成模拟数据' }}
            </button>

            <button
              @click="resetToDefault"
              class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors whitespace-nowrap"
              :disabled="fields.length === 0"
            >
              恢复默认
            </button>
          </div>

          <!-- 预设模板选择 -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">预设模板</label>
            <div class="flex flex-wrap gap-2">
              <button
                v-for="template in templates"
                :key="template.key"
                @click="loadTemplate(template)"
                class="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-md text-xs font-medium hover:bg-blue-200 transition-colors"
              >
                {{ template.name }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- 右侧：结果区域 -->
      <div class="border border-gray-200 rounded-lg p-4 bg-white lg:col-span-2">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-sm font-medium text-gray-700">生成结果</h2>
          <div class="flex items-center gap-2">
            <button
              @click="downloadResult"
              class="text-sm text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1"
              :disabled="!mockResult"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                />
              </svg>
              下载
            </button>
            <button
              @click="copyResult"
              class="text-sm text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1"
              :disabled="!mockResult"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
                />
              </svg>
              复制
            </button>
          </div>
        </div>

        <div
          class="border border-gray-200 rounded-lg p-3 min-h-[500px] max-h-[550px] overflow-y-auto bg-gray-50"
        >
          <pre
            v-if="mockResult"
            class="font-mono text-sm text-gray-900 whitespace-pre-wrap leading-relaxed"
            >{{ mockResult }}</pre
          >
          <div v-else class="flex items-center justify-center h-40 text-gray-500">
            点击"生成数据"按钮生成mock数据
          </div>
        </div>

        <div v-if="mockResult" class="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
          <p class="text-sm text-green-700">
            <svg
              class="inline-block w-4 h-4 mr-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
            已生成 {{ generateCount }} 条数据
          </p>
        </div>
      </div>

      <!-- Faker函数选择器模态框 -->
      <div
        v-if="showFakerSelector"
        class="fixed inset-0 z-50 flex items-center justify-center bg-opacity-20 p-4"
        @click="handleModalOutsideClick"
      >
        <div
          class="bg-white rounded-lg shadow-xl max-w-lg w-full max-h-[80vh] overflow-y-auto"
          @click.stop
        >
          <div class="px-6 py-4 border-b border-gray-200">
            <h3 class="text-lg font-medium text-gray-900">选择Faker函数</h3>
            <p class="text-sm text-gray-500 mt-1">点击下方标签选择需要的Faker函数</p>
          </div>
          <div class="p-4">
            <!-- 搜索框 -->
            <div class="mb-4">
              <input
                v-model="fakerSearchQuery"
                type="text"
                placeholder="搜索Faker函数..."
                class="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                @focus="handleSearchFocus"
              />
            </div>
            <!-- 函数标签列表 -->
            <div class="flex flex-wrap gap-2">
              <button
                v-for="(func, alias) in filteredFakerFunctions"
                :key="alias"
                @click="selectFakerFunction(func, selectedItemIndex)"
                :class="[
                  'px-3 py-1.5 rounded-full text-xs font-medium transition-colors whitespace-nowrap',
                  selectedFieldValue === func
                    ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                    : 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200',
                ]"
              >
                {{ alias }}
              </button>
            </div>
            <!-- 无搜索结果提示 -->
            <div
              v-if="fakerSearchQuery && Object.keys(filteredFakerFunctions).length === 0"
              class="text-center py-8 text-gray-500"
            >
              未找到匹配的Faker函数
            </div>
          </div>
          <div class="px-6 py-4 border-t border-gray-200 flex justify-end">
            <button
              @click="showFakerSelector = false"
              class="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
            >
              关闭
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useToast } from '@/composables/useToast'
import { Faker, en, zh_CN } from '@faker-js/faker'

const toast = useToast()

// 定义语言类型枚举
enum Language {
  ENGLISH = 'en',
  CHINESE = 'zh_CN',
}

// 语言枚举值和显示名称的映射
const languageLabels: Record<Language, string> = {
  [Language.ENGLISH]: '英文',
  [Language.CHINESE]: '中文',
}
// 选中的语言
const selectedLanguage = ref(Language.ENGLISH)

// 定义KV项类型枚举
enum ValueType {
  STRING = 'string',
  NUMBER = 'number',
  BOOLEAN = 'boolean',
  OBJECT = 'object',
  ARRAY = 'array',
  FAKER = 'faker',
}

// 枚举值和显示名称的映射
const valueTypeLabels: Record<ValueType, string> = {
  [ValueType.STRING]: '字符串',
  [ValueType.NUMBER]: '数字',
  [ValueType.BOOLEAN]: '布尔值',
  [ValueType.OBJECT]: '对象',
  [ValueType.ARRAY]: '数组',
  [ValueType.FAKER]: 'Faker函数',
}

const fields = ref<MockField[]>([
  { key: 'id', type: ValueType.FAKER, value: 'faker.string.uuid()' },
])

// 定义字段类型
interface MockField {
  key: string
  type: ValueType
  value: string
}

// 模板接口
interface MockTemplate {
  key: string
  name: string
  items: MockField[]
}

const generateCount = ref(1)
const mockResult = ref('')
const loading = ref(false)

// 选中的输入框索引
const selectedItemIndex = ref<number | null>(null)

// 是否显示Faker函数选择器
const showFakerSelector = ref(false)

// 预设模板配置
const templates: MockTemplate[] = [
  {
    key: 'user',
    name: '用户信息',
    items: [
      { key: 'id', type: ValueType.FAKER, value: 'faker.string.uuid()' },
      { key: 'name', type: ValueType.FAKER, value: 'faker.person.fullName()' },
      { key: 'email', type: ValueType.FAKER, value: 'faker.internet.email()' },
      { key: 'age', type: ValueType.FAKER, value: 'faker.number.int({ min: 18, max: 80 })' },
      { key: 'gender', type: ValueType.FAKER, value: 'faker.person.gender()' },
      { key: 'address', type: ValueType.FAKER, value: 'faker.location.streetAddress()' },
      { key: 'city', type: ValueType.FAKER, value: 'faker.location.city()' },
      { key: 'phone', type: ValueType.FAKER, value: 'faker.phone.number()' },
      { key: 'avatar', type: ValueType.FAKER, value: 'faker.image.avatar()' },
      { key: 'createdAt', type: ValueType.FAKER, value: 'faker.date.past()' },
      { key: 'isActive', type: ValueType.FAKER, value: 'faker.datatype.boolean()' },
    ],
  },
  {
    key: 'company',
    name: '公司信息',
    items: [
      { key: 'id', type: ValueType.FAKER, value: 'faker.string.uuid()' },
      { key: 'name', type: ValueType.FAKER, value: 'faker.company.name()' },
      { key: 'domain', type: ValueType.FAKER, value: 'faker.internet.domainName()' },
      { key: 'industry', type: ValueType.FAKER, value: 'faker.commerce.department()' },
      { key: 'address', type: ValueType.FAKER, value: 'faker.location.streetAddress()' },
      { key: 'city', type: ValueType.FAKER, value: 'faker.location.city()' },
      { key: 'country', type: ValueType.FAKER, value: 'faker.location.country()' },
      { key: 'phone', type: ValueType.FAKER, value: 'faker.phone.number()' },
      {
        key: 'employeeCount',
        type: ValueType.FAKER,
        value: 'faker.number.int({ min: 1, max: 10000 })',
      },
      {
        key: 'foundedYear',
        type: ValueType.FAKER,
        value: 'faker.number.int({ min: 1900, max: 2025 })',
      },
      { key: 'description', type: ValueType.FAKER, value: 'faker.company.catchPhrase()' },
    ],
  },
  {
    key: 'product',
    name: '产品信息',
    items: [
      { key: 'id', type: ValueType.FAKER, value: 'faker.string.uuid()' },
      { key: 'name', type: ValueType.FAKER, value: 'faker.commerce.productName()' },
      { key: 'category', type: ValueType.FAKER, value: 'faker.commerce.department()' },
      {
        key: 'price',
        type: ValueType.FAKER,
        value: 'faker.commerce.price({ min: 10, max: 1000 })',
      },
      { key: 'currency', type: ValueType.STRING, value: 'USD' },
      { key: 'stock', type: ValueType.FAKER, value: 'faker.number.int({ min: 0, max: 1000 })' },
      { key: 'sku', type: ValueType.FAKER, value: 'faker.string.alphanumeric(10)' },
      { key: 'description', type: ValueType.FAKER, value: 'faker.lorem.paragraph()' },
      { key: 'image', type: ValueType.FAKER, value: 'faker.image.imageUrl()' },
      {
        key: 'rating',
        type: ValueType.FAKER,
        value: 'faker.number.float({ min: 1, max: 5, precision: 0.1 })',
      },
      { key: 'isInStock', type: ValueType.FAKER, value: 'faker.datatype.boolean()' },
    ],
  },
  {
    key: 'order',
    name: '订单信息',
    items: [
      { key: 'id', type: ValueType.FAKER, value: 'faker.string.uuid()' },
      { key: 'orderNumber', type: ValueType.FAKER, value: 'faker.string.alphanumeric(12)' },
      { key: 'customerId', type: ValueType.FAKER, value: 'faker.string.uuid()' },
      { key: 'customerName', type: ValueType.FAKER, value: 'faker.person.fullName()' },
      {
        key: 'totalAmount',
        type: ValueType.FAKER,
        value: 'faker.commerce.price({ min: 10, max: 10000 })',
      },
      { key: 'currency', type: ValueType.STRING, value: 'USD' },
      {
        key: 'status',
        type: ValueType.FAKER,
        value:
          'faker.helpers.arrayElement(["pending", "processing", "shipped", "delivered", "cancelled"])',
      },
      {
        key: 'paymentMethod',
        type: ValueType.FAKER,
        value: 'faker.helpers.arrayElement(["credit_card", "paypal", "bank_transfer", "cash"])',
      },
      { key: 'itemsCount', type: ValueType.FAKER, value: 'faker.number.int({ min: 1, max: 20 })' },
      { key: 'createdAt', type: ValueType.FAKER, value: 'faker.date.past()' },
      { key: 'shippedAt', type: ValueType.FAKER, value: 'faker.date.future()' },
    ],
  },
  {
    key: 'post',
    name: '博客文章',
    items: [
      { key: 'id', type: ValueType.FAKER, value: 'faker.string.uuid()' },
      { key: 'title', type: ValueType.FAKER, value: 'faker.lorem.sentence()' },
      { key: 'slug', type: ValueType.FAKER, value: 'faker.lorem.slug()' },
      { key: 'content', type: ValueType.FAKER, value: 'faker.lorem.paragraphs(3)' },
      { key: 'author', type: ValueType.FAKER, value: 'faker.person.fullName()' },
      { key: 'authorId', type: ValueType.FAKER, value: 'faker.string.uuid()' },
      { key: 'category', type: ValueType.FAKER, value: 'faker.lorem.word()' },
      {
        key: 'tags',
        type: ValueType.FAKER,
        value: 'faker.helpers.arrayElements(faker.lorem.words(10).split(" "), { min: 2, max: 5 })',
      },
      { key: 'publishedAt', type: ValueType.FAKER, value: 'faker.date.past()' },
      { key: 'readTime', type: ValueType.FAKER, value: 'faker.number.int({ min: 1, max: 15 })' },
      { key: 'views', type: ValueType.FAKER, value: 'faker.number.int({ min: 0, max: 10000 })' },
      { key: 'isFeatured', type: ValueType.FAKER, value: 'faker.datatype.boolean()' },
    ],
  },
  {
    key: 'comment',
    name: '评论信息',
    items: [
      { key: 'id', type: ValueType.FAKER, value: 'faker.string.uuid()' },
      { key: 'postId', type: ValueType.FAKER, value: 'faker.string.uuid()' },
      { key: 'userId', type: ValueType.FAKER, value: 'faker.string.uuid()' },
      { key: 'userName', type: ValueType.FAKER, value: 'faker.person.fullName()' },
      { key: 'content', type: ValueType.FAKER, value: 'faker.lorem.paragraph()' },
      { key: 'rating', type: ValueType.FAKER, value: 'faker.number.int({ min: 1, max: 5 })' },
      { key: 'createdAt', type: ValueType.FAKER, value: 'faker.date.recent()' },
      { key: 'isApproved', type: ValueType.FAKER, value: 'faker.datatype.boolean()' },
      { key: 'likes', type: ValueType.FAKER, value: 'faker.number.int({ min: 0, max: 100 })' },
      { key: 'replies', type: ValueType.FAKER, value: 'faker.number.int({ min: 0, max: 20 })' },
    ],
  },
  {
    key: 'product_variant',
    name: '电商商品变体',
    items: [
      { key: 'id', type: ValueType.FAKER, value: 'faker.string.uuid()' },
      { key: 'productId', type: ValueType.FAKER, value: 'faker.string.uuid()' },
      { key: 'sku', type: ValueType.FAKER, value: 'faker.string.alphanumeric(10)' },
      { key: 'color', type: ValueType.FAKER, value: 'faker.color.human()' },
      {
        key: 'size',
        type: ValueType.FAKER,
        value: 'faker.helpers.arrayElement(["S", "M", "L", "XL", "XXL"])',
      },
      { key: 'price', type: ValueType.FAKER, value: 'faker.commerce.price({ min: 10, max: 500 })' },
      {
        key: 'originalPrice',
        type: ValueType.FAKER,
        value: 'faker.commerce.price({ min: 15, max: 600 })',
      },
      { key: 'stock', type: ValueType.FAKER, value: 'faker.number.int({ min: 0, max: 500 })' },
      {
        key: 'weight',
        type: ValueType.FAKER,
        value: 'faker.number.float({ min: 0.1, max: 5, precision: 0.1 })',
      },
      {
        key: 'dimensions',
        type: ValueType.FAKER,
        value:
          '{ "length": faker.number.float({ min: 5, max: 50, precision: 0.1 }), "width": faker.number.float({ min: 5, max: 50, precision: 0.1 }), "height": faker.number.float({ min: 2, max: 30, precision: 0.1 }) }',
      },
      { key: 'isActive', type: ValueType.FAKER, value: 'faker.datatype.boolean()' },
    ],
  },
  {
    key: 'social_post',
    name: '社交媒体帖子',
    items: [
      { key: 'id', type: ValueType.FAKER, value: 'faker.string.uuid()' },
      { key: 'userId', type: ValueType.FAKER, value: 'faker.string.uuid()' },
      { key: 'userName', type: ValueType.FAKER, value: 'faker.person.fullName()' },
      { key: 'content', type: ValueType.FAKER, value: 'faker.lorem.paragraph()' },
      { key: 'imageUrl', type: ValueType.FAKER, value: 'faker.image.url()' },
      { key: 'createdAt', type: ValueType.FAKER, value: 'faker.date.recent()' },
      { key: 'likes', type: ValueType.FAKER, value: 'faker.number.int({ min: 0, max: 1000 })' },
      { key: 'comments', type: ValueType.FAKER, value: 'faker.number.int({ min: 0, max: 200 })' },
      { key: 'shares', type: ValueType.FAKER, value: 'faker.number.int({ min: 0, max: 100 })' },
      {
        key: 'hashtags',
        type: ValueType.FAKER,
        value:
          'faker.helpers.arrayElements(faker.lorem.words(10).split(" "), { min: 1, max: 5 }).map(tag => `#${tag}`)',
      },
      { key: 'isPinned', type: ValueType.FAKER, value: 'faker.datatype.boolean()' },
    ],
  },
  {
    key: 'api_response',
    name: 'API响应结构',
    items: [
      { key: 'code', type: ValueType.NUMBER, value: '200' },
      { key: 'message', type: ValueType.FAKER, value: 'faker.lorem.word()' },
      { key: 'success', type: ValueType.BOOLEAN, value: 'true' },
      { key: 'timestamp', type: ValueType.FAKER, value: 'new Date().getTime()' },
      { key: 'requestId', type: ValueType.FAKER, value: 'faker.string.uuid()' },
      {
        key: 'pagination.page',
        type: ValueType.FAKER,
        value: 'faker.number.int({ min: 1, max: 10 })',
      },
      {
        key: 'pagination.pageSize',
        type: ValueType.FAKER,
        value: 'faker.number.int({ min: 10, max: 100 })',
      },
      {
        key: 'pagination.total',
        type: ValueType.FAKER,
        value: 'faker.number.int({ min: 100, max: 1000 })',
      },
      {
        key: 'pagination.totalPages',
        type: ValueType.FAKER,
        value: 'faker.number.int({ min: 1, max: 100 })',
      },
      {
        key: 'data',
        type: ValueType.FAKER,
        value:
          'faker.helpers.arrayElements([faker.person.fullName(), faker.internet.email()], { min: 1, max: 5 })',
      },
    ],
  },
  {
    key: 'location',
    name: '地理位置信息',
    items: [
      { key: 'id', type: ValueType.FAKER, value: 'faker.string.uuid()' },
      { key: 'name', type: ValueType.FAKER, value: 'faker.location.streetAddress()' },
      { key: 'latitude', type: ValueType.FAKER, value: 'faker.location.latitude()' },
      { key: 'longitude', type: ValueType.FAKER, value: 'faker.location.longitude()' },
      { key: 'street', type: ValueType.FAKER, value: 'faker.location.street()' },
      { key: 'city', type: ValueType.FAKER, value: 'faker.location.city()' },
      { key: 'state', type: ValueType.FAKER, value: 'faker.location.state()' },
      { key: 'country', type: ValueType.FAKER, value: 'faker.location.country()' },
      { key: 'zipCode', type: ValueType.FAKER, value: 'faker.location.zipCode()' },
      { key: 'region', type: ValueType.FAKER, value: 'faker.location.countryCode()' },
      { key: 'timezone', type: ValueType.FAKER, value: 'faker.location.timeZone()' },
    ],
  },
]

// Faker函数搜索关键词
const fakerSearchQuery = ref('')

// 根据选择的语言创建Faker实例
const fakerInstance = computed(() => {
  const locale = selectedLanguage.value === Language.CHINESE ? zh_CN : en
  return new Faker({ locale })
})
const fakerFunctionAliases = {
  /* ================= Airline ================= */
  航空_航空公司名称: 'faker.airline.airline()',
  航空_航班号: 'faker.airline.flight()',

  /* ================= Animal ================= */
  动物_类型: 'faker.animal.type()',
  动物_猫: 'faker.animal.cat()',
  动物_狗: 'faker.animal.dog()',

  /* ================= Book ================= */
  书_书名: 'faker.book.title()',
  书_作者: 'faker.book.author()',
  书_出版社: 'faker.book.publisher()',

  /* ================= Color ================= */
  颜色_名称: 'faker.color.human()',
  颜色_HEX: 'faker.color.rgb({ format: "hex" })',
  颜色_RGB: 'faker.color.rgb()',

  /* ================= Commerce ================= */
  商业_产品名称: 'faker.commerce.productName()',
  商业_产品描述: 'faker.commerce.productDescription()',
  商业_产品价格: 'faker.commerce.price()',
  商业_部门: 'faker.commerce.department()',
  商业_产品材质: 'faker.commerce.productMaterial()',
  商业_产品类型: 'faker.commerce.productAdjective()',

  /* ================= Company ================= */
  公司_公司名称: 'faker.company.name()',
  公司_口号: 'faker.company.catchPhrase()',
  公司_标语: 'faker.company.buzzPhrase()',

  /* ================= Database ================= */
  数据库_列名: 'faker.database.column()',
  数据库_表类型: 'faker.database.type()',
  数据库_引擎: 'faker.database.engine()',

  /* ================= Datatype ================= */
  数据类型_随机整数: 'faker.number.int()',
  数据类型_随机小数: 'faker.number.float()',
  数据类型_布尔值: 'faker.datatype.boolean()',

  /* ================= Date ================= */
  日期_当前时间: 'new Date()',
  日期_过去时间: 'faker.date.past()',
  日期_未来时间: 'faker.date.future()',
  日期_最近时间: 'faker.date.recent()',
  日期_即将发生: 'faker.date.soon()',
  日期_月份: 'faker.date.month()',
  日期_星期: 'faker.date.weekday()',
  日期_时区: 'faker.location.timeZone()',

  /* ================= Finance ================= */
  金融_银行账号: 'faker.finance.accountNumber()',
  金融_交易金额: 'faker.finance.amount()',
  金融_货币名称: 'faker.finance.currencyName()',
  金融_货币代码: 'faker.finance.currencyCode()',
  金融_信用卡号: 'faker.finance.creditCardNumber()',
  金融_IBAN: 'faker.finance.iban()',

  /* ================= Food ================= */
  食物_成分: 'faker.food.ingredient()',
  食物_菜名: 'faker.food.dish()',
  食物_水果: 'faker.food.fruit()',
  食物_蔬菜: 'faker.food.vegetable()',
  食物_香料: 'faker.food.spice()',

  /* ================= Git ================= */
  Git_分支名: 'faker.git.branch()',
  Git_提交哈希: 'faker.git.commitSha()',

  /* ================= Hacker ================= */
  黑客_名词: 'faker.hacker.noun()',
  黑客_动词: 'faker.hacker.verb()',
  黑客_形容词: 'faker.hacker.adjective()',
  黑客_短语: 'faker.hacker.phrase()',

  /* ================= Helpers ================= */
  辅助_随机数组元素: 'faker.helpers.arrayElement(["A","B","C","D"])',
  辅助_随机数组多元素: 'faker.helpers.arrayElements(["A","B","C","D"], { min: 1, max: 3 })',
  辅助_随机对象键: 'faker.helpers.objectKey({ a: 1, b: 2 })',

  /* ================= Image ================= */
  图片_头像: 'faker.image.avatar()',
  图片_人像照片: 'faker.image.urlPicsumPhotos({ width: 128, height: 128 })',
  图片_随机图片: 'faker.image.urlLoremFlickr()',
  图片_占位图片: 'faker.image.url()',

  /* ================= Internet ================= */
  网络_邮箱: 'faker.internet.email()',
  网络_用户名: 'faker.internet.userName()',
  网络_密码: 'faker.internet.password({ length: 12 })',
  网络_网址: 'faker.internet.url()',
  网络_域名: 'faker.internet.domainName()',
  网络_IP地址: 'faker.internet.ip()',
  网络_IPv4: 'faker.internet.ipv4()',
  网络_IPv6: 'faker.internet.ipv6()',
  网络_MAC地址: 'faker.internet.mac()',
  网络_用户代理: 'faker.internet.userAgent()',
  网络_端口号: 'faker.internet.port()',

  /* ================= Location ================= */
  地址_街道: 'faker.location.streetAddress()',
  地址_楼号: 'faker.location.buildingNumber()',
  地址_城市: 'faker.location.city()',
  地址_省份: 'faker.location.state()',
  地址_国家: 'faker.location.country()',
  地址_国家代码: 'faker.location.countryCode()',
  地址_邮政编码: 'faker.location.zipCode()',
  地址_纬度: 'faker.location.latitude()',
  地址_经度: 'faker.location.longitude()',

  /* ================= Lorem ================= */
  文本_随机单词: 'faker.lorem.word()',
  文本_多个单词: 'faker.lorem.words(3)',
  文本_随机句子: 'faker.lorem.sentence()',
  文本_多个句子: 'faker.lorem.sentences(2)',
  文本_随机段落: 'faker.lorem.paragraph()',
  文本_多段文本: 'faker.lorem.paragraphs(2)',
  文本_随机标签: 'faker.lorem.slug()',

  /* ================= Music ================= */
  音乐_歌曲名: 'faker.music.songName()',
  音乐_专辑名: 'faker.music.album()',
  音乐_艺术家: 'faker.music.artist()',
  音乐_流派: 'faker.music.genre()',

  /* ================= Number ================= */
  数字_随机数: 'faker.number.int()',
  数字_随机浮点数: 'faker.number.float()',

  /* ================= Person ================= */
  人_全名: 'faker.person.fullName()',
  人_名字: 'faker.person.firstName()',
  人_姓氏: 'faker.person.lastName()',
  人_性别: 'faker.person.gender()',
  人_生日: 'faker.date.birthdate()',

  /* ================= Phone ================= */
  电话_电话号码: 'faker.phone.number()',

  /* ================= Science ================= */
  科学_单位: 'faker.science.unit()',
  科学_元素符号: 'faker.science.element()',
  科学_化学名称: 'faker.science.chemical()',

  /* ================= String ================= */
  字符串_随机字符串: 'faker.string.alphanumeric(10)',
  字符串_字母: 'faker.string.alpha(5)',
  字符串_数字: 'faker.string.numeric(5)',
  字符串_UUID: 'faker.string.uuid()',
  字符串_NanoID: 'faker.string.nanoid()',
  字符串_ULID: 'faker.string.ulid()',

  /* ================= System ================= */
  系统_文件名: 'faker.system.fileName()',
  系统_文件类型: 'faker.system.fileType()',
  系统_MIME类型: 'faker.system.mimeType()',
  系统_语义版本号: 'faker.system.semver()',

  /* ================= Vehicle ================= */
  车辆_型号: 'faker.vehicle.model()',
  车辆_制造商: 'faker.vehicle.manufacturer()',
  车辆_VIN: 'faker.vehicle.vin()',
  车辆_类型: 'faker.vehicle.type()',

  /* ================= Word ================= */
  词_名词: 'faker.word.noun()',
  词_动词: 'faker.word.verb()',
  词_形容词: 'faker.word.adjective()',
}

// 处理Faker函数选择按钮点击事件
const handleInputFocus = (item: MockField, index: number) => {
  if (item.type === ValueType.FAKER) {
    selectedItemIndex.value = index
    showFakerSelector.value = true
  }
}

// 处理搜索框聚焦事件
const handleSearchFocus = () => {
  // 阻止失焦事件触发关闭
}

// 处理模态框外部点击关闭
const handleModalOutsideClick = () => {
  showFakerSelector.value = false
  fakerSearchQuery.value = ''
}

// 过滤Faker函数
const filteredFakerFunctions = computed(() => {
  const query = fakerSearchQuery.value.toLowerCase()
  if (!query) {
    return fakerFunctionAliases
  }

  const filtered: Record<string, string> = {}
  for (const [alias, func] of Object.entries(fakerFunctionAliases)) {
    if (alias.toLowerCase().includes(query) || func.toLowerCase().includes(query)) {
      filtered[alias] = func
    }
  }
  return filtered
})

// 当前选中的字段
const selectedField = computed(() => {
  if (selectedItemIndex.value === null) return null
  return fields.value[selectedItemIndex.value]
})

// 当前选中字段的Faker函数值
const selectedFieldValue = computed(() => {
  return selectedField.value?.value || null
})

// 处理ESC键关闭模态框
const handleKeyDown = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && showFakerSelector.value) {
    showFakerSelector.value = false
    fakerSearchQuery.value = ''
    event.stopPropagation()
  }
}

// 添加和移除键盘事件监听器
onMounted(() => {
  window.addEventListener('keydown', handleKeyDown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown)
})

// 处理类型变更事件
const handleTypeChange = (item: MockField) => {
  if (item.type === ValueType.FAKER && !item.value) {
    // 如果类型变为faker但值为空，则设置一个默认值
    item.value = 'faker.person.fullName()'
  }
}

// 选择Faker函数
const selectFakerFunction = (func: string, index: number | null) => {
  if (index !== null && fields.value[index]) {
    fields.value[index].value = func
  }
  toast.success('已插入Faker函数')
  showFakerSelector.value = false
}

// 添加新字段
const addField = () => {
  fields.value.push({ key: '', type: ValueType.STRING, value: '' })
}

// 恢复默认配置
const resetToDefault = () => {
  if (confirm('确定要恢复默认配置吗？')) {
    fields.value = [{ key: 'id', type: ValueType.FAKER, value: 'faker.string.uuid()' }]
    mockResult.value = ''
    selectedItemIndex.value = null
    toast.success('已恢复默认配置')
  }
}

// 加载预设模板
const loadTemplate = (template: MockTemplate) => {
  fields.value = template.items
  mockResult.value = ''
  toast.success(`已加载${template.name}模板`)
}

// 移除字段
const removeItem = (index: number) => {
  if (fields.value.length > 1) {
    fields.value.splice(index, 1)
  }
}

// 执行faker函数
const executeFakerFunction = (funcString: string): unknown => {
  try {
    // 确保在eval中可以访问faker对象
    const result = (() => {
      // 使用Function构造函数替代eval，更安全
      return new Function('faker', `return ${funcString}`)(fakerInstance.value)
    })()
    return result
  } catch (error) {
    console.error('Faker函数执行错误:', error)
    toast.error(`Faker函数执行错误: ${funcString}`)
    return funcString // 如果执行失败，返回原始字符串
  }
}

// 将字段转换为JSON对象
const fieldsToJson = () => {
  const result: Record<string, unknown> = {}

  fields.value.forEach((item) => {
    if (!item.key.trim()) return

    let value: unknown

    switch (item.type) {
      case ValueType.STRING:
        value = item.value
        break
      case ValueType.NUMBER:
        value = Number(item.value) || 0
        break
      case ValueType.BOOLEAN:
        value = item.value.toLowerCase() === 'true'
        break
      case ValueType.OBJECT:
        try {
          value = JSON.parse(item.value) || {}
        } catch {
          value = {}
        }
        break
      case ValueType.ARRAY:
        try {
          value = JSON.parse(item.value) || []
        } catch {
          value = []
        }
        break
      case ValueType.FAKER:
        value = executeFakerFunction(item.value)
        break
    }

    // 处理嵌套字段名，如user.name
    const keys = item.key.split('.')
    let current: Record<string, unknown> = result

    for (let i = 0; i < keys.length; i++) {
      const key = keys[i]
      if (key) {
        if (i === keys.length - 1) {
          current[key] = value
        } else {
          if (!current[key] || typeof current[key] !== 'object' || current[key] === null) {
            current[key] = {}
          }
          current = current[key] as Record<string, unknown>
        }
      }
    }
  })

  return result
}

// 生成模拟数据
const generateMockData = () => {
  if (fields.value.every((item: MockField) => !item.key.trim())) {
    toast.error('请至少输入一个有效的字段名')
    return
  }

  loading.value = true

  try {
    // 生成指定数量的mock数据
    const result = []
    for (let i = 0; i < generateCount.value; i++) {
      // 将字段转换为JSON对象
      const data = fieldsToJson()
      result.push(data)
    }

    // 将结果格式化为JSON字符串
    mockResult.value = JSON.stringify(result, null, 2)
    toast.success('Mock数据生成成功')
  } catch (error) {
    toast.error(`生成失败: ${error instanceof Error ? error.message : '未知错误'}`)
    mockResult.value = ''
  } finally {
    loading.value = false
  }
}

// 复制结果到剪贴板
const copyResult = () => {
  if (!mockResult.value) return

  navigator.clipboard
    .writeText(mockResult.value)
    .then(() => {
      toast.success('已复制到剪贴板')
    })
    .catch(() => {
      toast.error('复制失败，请手动复制')
    })
}

// 下载结果为JSON文件
const downloadResult = () => {
  if (!mockResult.value) return

  try {
    const blob = new Blob([mockResult.value], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `mock-data-${Date.now()}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
    toast.success('下载成功')
  } catch {
    toast.error('下载失败，请手动复制')
  }
}
</script>
