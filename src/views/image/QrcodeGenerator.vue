<template>
  <div class="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-cyan-50 p-4 md:p-6">
    <div class="max-w-7xl mx-auto">
      <!-- Header -->
      <div class="bg-white/90 backdrop-blur-sm rounded-xl shadow-sm p-4 md:p-6 mb-6">
        <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div class="flex items-center gap-3">
            <svg
              class="w-8 h-8 text-blue-600"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <path stroke-linecap="round" stroke-linejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <h1 class="text-xl md:text-2xl font-bold text-gray-900">二维码生成器</h1>
          </div>
        </div>
      </div>

      <!-- 主要内容区域 -->
      <div class="flex flex-col lg:flex-row gap-6">
        <!-- 左侧：二维码设置 -->
        <div class="flex-1 bg-white rounded-xl shadow-sm p-4 md:p-6">
          <h2 class="text-lg font-semibold text-gray-900 mb-6">二维码设置</h2>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <!-- 左侧：二维码类型列表 -->
            <div class="md:col-span-1">
              <div class="border border-gray-200 rounded-lg overflow-hidden">
                <button
                  v-for="type in qrTypes"
                  :key="type.value"
                  @click="
                    () => {
                      qrType = type.value
                      initQrData(type.value)
                    }
                  "
                  class="w-full px-4 py-3 text-left hover:bg-blue-50 transition-colors flex items-center justify-between"
                  :class="{ 'bg-blue-50 border-r-4 border-blue-500': qrType === type.value }"
                >
                  <span class="text-gray-700">{{ type.label }}</span>
                  <svg
                    v-if="qrType === type.value"
                    class="w-4 h-4 text-blue-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M5 13l4 4L19 7"
                    ></path>
                  </svg>
                </button>
              </div>
            </div>

            <!-- 右侧：参数输入表单 -->
            <div class="md:col-span-2">
              <div class="space-y-6">
                <!-- 文本输入 -->
                <div v-if="qrType === 'text'">
                  <label class="block text-sm font-medium text-gray-700 mb-2">输入内容</label>
                  <textarea
                    v-model="inputText"
                    placeholder="请输入要生成二维码的内容"
                    rows="4"
                    class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white resize-y"
                  ></textarea>
                </div>

                <!-- URL输入 -->
                <div v-if="qrType === 'url'">
                  <label class="block text-sm font-medium text-gray-700 mb-2">网址链接</label>
                  <input
                    v-model="urlData"
                    type="url"
                    placeholder="https://example.com"
                    class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                  />
                </div>

                <!-- 联系人输入 -->
                <div v-if="qrType === 'contact'" class="space-y-4">
                  <div class="grid grid-cols-2 gap-3">
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">姓名</label>
                      <input
                        v-model="contactData.name"
                        type="text"
                        placeholder="张三"
                        class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                      />
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">公司</label>
                      <input
                        v-model="contactData.company"
                        type="text"
                        placeholder="XX公司"
                        class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                      />
                    </div>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">职位</label>
                    <input
                      v-model="contactData.title"
                      type="text"
                      placeholder="产品经理"
                      class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                    />
                  </div>
                  <div class="grid grid-cols-2 gap-3">
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">电话</label>
                      <input
                        v-model="contactData.phone"
                        type="tel"
                        placeholder="13800138000"
                        class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                      />
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">邮箱</label>
                      <input
                        v-model="contactData.email"
                        type="email"
                        placeholder="zhangsan@example.com"
                        class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                      />
                    </div>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">地址</label>
                    <input
                      v-model="contactData.address"
                      type="text"
                      placeholder="北京市朝阳区"
                      class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">网站</label>
                    <input
                      v-model="contactData.url"
                      type="url"
                      placeholder="https://example.com"
                      class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                    />
                  </div>
                </div>

                <!-- 电话输入 -->
                <div v-if="qrType === 'phone'">
                  <label class="block text-sm font-medium text-gray-700 mb-2">电话号码</label>
                  <input
                    v-model="phoneData"
                    type="tel"
                    placeholder="13800138000"
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <!-- 短信输入 -->
                <div v-if="qrType === 'sms'" class="space-y-3">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">电话号码</label>
                    <input
                      v-model="smsData.phone"
                      type="tel"
                      placeholder="13800138000"
                      class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">短信内容</label>
                    <textarea
                      v-model="smsData.content"
                      placeholder="请输入短信内容"
                      rows="3"
                      class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-y"
                    ></textarea>
                  </div>
                </div>

                <!-- 邮件输入 -->
                <div v-if="qrType === 'email'" class="space-y-3">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">邮箱地址</label>
                    <input
                      v-model="emailData.address"
                      type="email"
                      placeholder="zhangsan@example.com"
                      class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">邮件主题</label>
                    <input
                      v-model="emailData.subject"
                      type="text"
                      placeholder="邮件主题"
                      class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">邮件内容</label>
                    <textarea
                      v-model="emailData.body"
                      placeholder="请输入邮件内容"
                      rows="3"
                      class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-y"
                    ></textarea>
                  </div>
                </div>

                <!-- Wi-Fi输入 -->
                <div v-if="qrType === 'wifi'" class="space-y-3">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1"
                      >SSID (无线网络名称)</label
                    >
                    <input
                      v-model="wifiData.ssid"
                      type="text"
                      placeholder="MyWiFi"
                      class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">加密类型</label>
                    <select
                      v-model="wifiData.encryption"
                      class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="WPA">WPA/WPA2</option>
                      <option value="WEP">WEP</option>
                      <option value="">无加密</option>
                    </select>
                  </div>
                  <div v-if="wifiData.encryption">
                    <label class="block text-sm font-medium text-gray-700 mb-1.5">密码</label>
                    <input
                      v-model="wifiData.password"
                      type="password"
                      placeholder="请输入Wi-Fi密码"
                      class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm hover:border-gray-300 transition-all"
                    />
                  </div>
                  <div class="flex items-center">
                    <input
                      v-model="wifiData.hidden"
                      type="checkbox"
                      class="w-4 h-4 text-blue-600"
                    />
                    <label class="ml-2 text-sm text-gray-700">隐藏网络 (SSID不可见)</label>
                  </div>
                </div>

                <!-- 生成按钮 -->
                <div>
                  <button
                    @click="generateQrCode"
                    :disabled="generating"
                    class="w-full px-6 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-medium shadow-lg hover:shadow-xl hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center"
                  >
                    <svg
                      v-if="!generating"
                      class="w-4 h-4 inline mr-2"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                    <svg
                      v-else
                      class="w-4 h-4 inline mr-2 animate-spin"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9"
                      />
                    </svg>
                    {{ generating ? '生成中...' : '生成二维码' }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 右侧：二维码预览 -->
        <div class="bg-white rounded-xl shadow-sm p-4 md:p-6 min-w-[300px] max-w-md">
          <h2 class="text-lg font-semibold text-gray-900 mb-6">二维码预览</h2>

          <div class="space-y-6">
            <!-- 二维码预览区域 -->
            <div class="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
              <div class="flex justify-center">
                <!-- 默认显示模糊的假二维码 -->
                <div v-if="!generatedQrCode" class="relative">
                  <div class="w-64 h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                    <!-- 生成一个简单的假二维码图案 -->
                    <div class="grid grid-cols-8 gap-1 w-48 h-48">
                      <!-- 左上角定位图案 -->
                      <div class="col-span-3 row-span-3 bg-gray-300 rounded-sm"></div>
                      <div class="col-span-1 row-span-1 bg-gray-200 rounded-sm"></div>
                      <div class="col-span-1 row-span-1 bg-gray-300 rounded-sm"></div>
                      <div class="col-span-1 row-span-1 bg-gray-200 rounded-sm"></div>
                      <div class="col-span-1 row-span-1 bg-gray-300 rounded-sm"></div>
                      <div class="col-span-1 row-span-1 bg-gray-200 rounded-sm"></div>
                      <!-- 第一行其他部分 -->
                      <div class="col-span-1 row-span-1 bg-gray-300 rounded-sm"></div>
                      <div class="col-span-1 row-span-1 bg-gray-200 rounded-sm"></div>
                      <div class="col-span-1 row-span-1 bg-gray-300 rounded-sm"></div>
                      <div class="col-span-1 row-span-1 bg-gray-200 rounded-sm"></div>
                      <div class="col-span-1 row-span-1 bg-gray-300 rounded-sm"></div>
                      <div class="col-span-1 row-span-1 bg-gray-200 rounded-sm"></div>
                      <!-- 左上角定位图案周围 -->
                      <div class="col-span-1 row-span-1 bg-gray-200 rounded-sm"></div>
                      <div class="col-span-1 row-span-1 bg-gray-300 rounded-sm"></div>
                      <div class="col-span-1 row-span-1 bg-gray-200 rounded-sm"></div>
                      <div class="col-span-1 row-span-1 bg-gray-300 rounded-sm"></div>
                      <!-- 右上角定位图案 -->
                      <div
                        class="col-span-3 row-span-3 bg-gray-300 rounded-sm col-end-9 row-start-1"
                      ></div>
                      <!-- 第二行其他部分 -->
                      <div class="col-span-1 row-span-1 bg-gray-200 rounded-sm"></div>
                      <div class="col-span-1 row-span-1 bg-gray-300 rounded-sm"></div>
                      <div class="col-span-1 row-span-1 bg-gray-200 rounded-sm"></div>
                      <div class="col-span-1 row-span-1 bg-gray-300 rounded-sm"></div>
                      <!-- 左下角定位图案 -->
                      <div class="col-span-3 row-span-3 bg-gray-300 rounded-sm row-end-9"></div>
                      <!-- 右下角区域 -->
                      <div
                        class="col-span-1 row-span-1 bg-gray-300 rounded-sm col-end-9 row-end-9"
                      ></div>
                      <div
                        class="col-span-1 row-span-1 bg-gray-200 rounded-sm col-end-8 row-end-9"
                      ></div>
                      <div
                        class="col-span-1 row-span-1 bg-gray-300 rounded-sm col-end-7 row-end-9"
                      ></div>
                      <div
                        class="col-span-1 row-span-1 bg-gray-200 rounded-sm col-end-6 row-end-9"
                      ></div>
                      <!-- 中间区域随机填充 -->
                      <div class="col-span-1 row-span-1 bg-gray-200 rounded-sm"></div>
                      <div class="col-span-1 row-span-1 bg-gray-300 rounded-sm"></div>
                      <div class="col-span-1 row-span-1 bg-gray-200 rounded-sm"></div>
                      <div class="col-span-1 row-span-1 bg-gray-300 rounded-sm"></div>
                      <div class="col-span-1 row-span-1 bg-gray-200 rounded-sm"></div>
                      <div class="col-span-1 row-span-1 bg-gray-300 rounded-sm"></div>
                      <div class="col-span-1 row-span-1 bg-gray-200 rounded-sm"></div>
                      <div class="col-span-1 row-span-1 bg-gray-300 rounded-sm"></div>
                      <div class="col-span-1 row-span-1 bg-gray-200 rounded-sm"></div>
                      <div class="col-span-1 row-span-1 bg-gray-300 rounded-sm"></div>
                      <div class="col-span-1 row-span-1 bg-gray-200 rounded-sm"></div>
                      <div class="col-span-1 row-span-1 bg-gray-300 rounded-sm"></div>
                    </div>
                  </div>
                  <!-- 模糊效果 -->
                  <div
                    class="absolute inset-0 bg-white/30 backdrop-blur-xs pointer-events-none"
                  ></div>
                </div>

                <!-- 生成的真实二维码 -->
                <img v-else :src="generatedQrCode" alt="生成的二维码" class="max-w-full max-h-96" />
              </div>
            </div>

            <!-- 操作按钮 -->
            <div class="flex flex-col sm:flex-row gap-3">
              <button
                @click="downloadQrCode"
                class="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                :disabled="!generatedQrCode"
              >
                <svg
                  class="w-4 h-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                  />
                </svg>
                下载
              </button>
              <button
                @click="copyQrCode"
                class="flex-1 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors flex items-center justify-center gap-2"
                :disabled="!generatedQrCode"
              >
                <svg
                  class="w-4 h-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
                复制图片
              </button>
            </div>

            <!-- Logo上传 - 独立显示 -->
            <div class="mt-4">
              <h3 class="text-sm font-medium text-gray-700 mb-4">Logo上传</h3>
              <div
                @dragover.prevent
                @drop.prevent="handleLogoDrop"
                class="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-500 transition-colors"
              >
                <input
                  ref="logoInput"
                  type="file"
                  accept="image/*"
                  @change="handleLogoUpload"
                  class="hidden"
                />
                <button
                  @click="triggerLogoInput"
                  class="mb-2 px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
                >
                  选择Logo
                </button>
                <p class="text-xs text-gray-500">支持 JPG, PNG 等格式</p>
                <p class="text-xs text-gray-400 mt-1">或直接拖放图片到此处</p>

                <div v-if="logoPreview" class="mt-3">
                  <img
                    :src="logoPreview"
                    alt="Logo预览"
                    class="max-w-full max-h-24 mx-auto object-contain border border-gray-200 rounded"
                  />
                  <p class="text-xs text-gray-500 mt-2">{{ logoFile?.name }}</p>
                </div>
              </div>
            </div>

            <!-- 参数调整按钮 -->
            <div class="mt-4">
              <button
                @click="showParams = !showParams"
                class="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
              >
                <svg
                  class="w-4 h-4 transition-transform"
                  :class="{ 'rotate-180': showParams }"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
                参数调整
              </button>
            </div>

            <!-- 参数设置区域 - 默认隐藏 -->
            <div v-show="showParams" class="mt-4">
              <!-- 参数设置 -->
              <div>
                <h3 class="text-sm font-medium text-gray-700 mb-4">参数设置</h3>
                <div class="grid grid-cols-2 gap-4">
                  <!-- 尺寸 -->
                  <div>
                    <label class="block text-xs text-gray-500 mb-1.5">尺寸</label>
                    <select
                      v-model="qrSize"
                      class="w-full px-4 py-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                    >
                      <option value="128">128x128</option>
                      <option value="256">256x256</option>
                      <option value="384">384x384</option>
                      <option value="512">512x512</option>
                    </select>
                  </div>

                  <!-- 纠错级别 -->
                  <div>
                    <label class="block text-xs text-gray-500 mb-1.5">纠错级别</label>
                    <select
                      v-model="errorCorrection"
                      class="w-full px-4 py-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                    >
                      <option value="L">L (7%)</option>
                      <option value="M">M (15%)</option>
                      <option value="Q">Q (25%)</option>
                      <option value="H">H (30%)</option>
                    </select>
                  </div>

                  <!-- 边距 -->
                  <div>
                    <label class="block text-xs text-gray-500 mb-1.5">边距</label>
                    <input
                      v-model.number="margin"
                      type="number"
                      min="0"
                      max="20"
                      class="w-full px-4 py-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                    />
                  </div>

                  <!-- 前景色 -->
                  <div>
                    <label class="block text-xs text-gray-500 mb-1.5">前景色</label>
                    <div class="flex items-center gap-2">
                      <input
                        v-model="foregroundColor"
                        type="color"
                        class="w-8 h-8 rounded border border-gray-300 cursor-pointer"
                      />
                      <input
                        v-model="foregroundColor"
                        type="text"
                        placeholder="#000000"
                        class="flex-1 px-3 py-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                      />
                    </div>
                  </div>

                  <!-- 背景色 -->
                  <div>
                    <label class="block text-xs text-gray-500 mb-1.5">背景色</label>
                    <div class="flex items-center gap-2">
                      <input
                        v-model="backgroundColor"
                        type="color"
                        class="w-8 h-8 rounded border border-gray-300 cursor-pointer"
                      />
                      <input
                        v-model="backgroundColor"
                        type="text"
                        placeholder="#FFFFFF"
                        class="flex-1 px-3 py-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import QRCode from 'qrcode'
import { useToast } from '@/composables/useToast'

const toast = useToast()

// 定义二维码类型枚举
enum QRCodeType {
  TEXT = 'text',
  URL = 'url',
  CONTACT = 'contact',
  PHONE = 'phone',
  SMS = 'sms',
  EMAIL = 'email',
  WIFI = 'wifi',
}

// 生成二维码相关
const qrType = ref(QRCodeType.TEXT) // 二维码类型：text, url, contact, phone, sms, email, wifi
const qrTypes = [
  { value: QRCodeType.TEXT, label: '普通文本' },
  { value: QRCodeType.URL, label: 'URL链接' },
  { value: QRCodeType.CONTACT, label: '联系人（名片）' },
  { value: QRCodeType.PHONE, label: '电话号码' },
  { value: QRCodeType.SMS, label: '短信' },
  { value: QRCodeType.EMAIL, label: '电子邮件' },
  { value: QRCodeType.WIFI, label: 'Wi-Fi配置' },
]
const inputText = ref('')
const urlData = ref('')
const contactData = ref({
  name: '',
  company: '',
  title: '',
  phone: '',
  email: '',
  address: '',
  url: '',
})
const phoneData = ref('')
const smsData = ref({
  phone: '',
  content: '',
})
const emailData = ref({
  address: '',
  subject: '',
  body: '',
})
const wifiData = ref({
  ssid: '',
  encryption: 'WPA',
  password: '',
  hidden: false,
})
const qrSize = ref(256)
const errorCorrection = ref<'L' | 'M' | 'Q' | 'H'>('M')
const margin = ref(4)
const foregroundColor = ref('#000000')
const backgroundColor = ref('#FFFFFF')
const generating = ref(false)
const generatedQrCode = ref<string | null>(null)

// Logo上传相关
const logoFile = ref<File | null>(null)
const logoPreview = ref<string | null>(null)
const logoInput = ref<HTMLInputElement | null>(null)

// 参数调整区域显示控制
const showParams = ref(false)

// 初始化当前类型的二维码数据
const initQrData = (type: QRCodeType) => {
  // 重置当前类型的输入数据
  switch (type) {
    case QRCodeType.TEXT:
      inputText.value = ''
      break
    case QRCodeType.URL:
      urlData.value = ''
      break
    case QRCodeType.CONTACT:
      contactData.value = {
        name: '',
        company: '',
        title: '',
        phone: '',
        email: '',
        address: '',
        url: '',
      }
      break
    case QRCodeType.PHONE:
      phoneData.value = ''
      break
    case QRCodeType.SMS:
      smsData.value = {
        phone: '',
        content: '',
      }
      break
    case QRCodeType.EMAIL:
      emailData.value = {
        address: '',
        subject: '',
        body: '',
      }
      break
    case QRCodeType.WIFI:
      wifiData.value = {
        ssid: '',
        encryption: 'WPA',
        password: '',
        hidden: false,
      }
      break
  }

  // 重置生成的二维码
  generatedQrCode.value = null

  // 重置二维码参数为默认值
  qrSize.value = 256
  errorCorrection.value = 'M'
  margin.value = 4
  foregroundColor.value = '#000000'
  backgroundColor.value = '#FFFFFF'

  // 重置logo相关
  logoFile.value = null
  logoPreview.value = null
  if (logoInput.value) {
    logoInput.value.value = ''
  }
}

// 生成二维码
const generateQrCode = async () => {
  let qrContent = ''

  // 根据二维码类型生成相应的内容
  switch (qrType.value) {
    case QRCodeType.TEXT:
      if (!inputText.value) {
        toast.warning('请输入要生成二维码的内容')
        return
      }
      qrContent = inputText.value
      break

    case QRCodeType.URL:
      if (!urlData.value) {
        toast.warning('请输入网址链接')
        return
      }
      // 确保URL包含协议
      if (!urlData.value.startsWith('http://') && !urlData.value.startsWith('https://')) {
        qrContent = `https://${urlData.value}`
      } else {
        qrContent = urlData.value
      }
      break

    case QRCodeType.CONTACT:
      if (!contactData.value.name) {
        toast.warning('请输入联系人姓名')
        return
      }
      // 使用vCard格式
      qrContent = `BEGIN:VCARD\nVERSION:3.0\n`
      qrContent += `FN:${contactData.value.name}\n`
      if (contactData.value.company) qrContent += `ORG:${contactData.value.company}\n`
      if (contactData.value.title) qrContent += `TITLE:${contactData.value.title}\n`
      if (contactData.value.phone) qrContent += `TEL:${contactData.value.phone}\n`
      if (contactData.value.email) qrContent += `EMAIL:${contactData.value.email}\n`
      if (contactData.value.address) qrContent += `ADR:${contactData.value.address}\n`
      if (contactData.value.url) qrContent += `URL:${contactData.value.url}\n`
      qrContent += `END:VCARD`
      break

    case QRCodeType.PHONE:
      if (!phoneData.value) {
        toast.warning('请输入电话号码')
        return
      }
      qrContent = `tel:${phoneData.value}`
      break

    case QRCodeType.SMS:
      if (!smsData.value.phone) {
        toast.warning('请输入电话号码')
        return
      }
      if (smsData.value.content) {
        qrContent = `smsto:${smsData.value.phone}:${smsData.value.content}`
      } else {
        qrContent = `smsto:${smsData.value.phone}`
      }
      break

    case QRCodeType.EMAIL:
      if (!emailData.value.address) {
        toast.warning('请输入邮箱地址')
        return
      }
      qrContent = `mailto:${emailData.value.address}`
      if (emailData.value.subject || emailData.value.body) {
        qrContent += '?'
        if (emailData.value.subject)
          qrContent += `subject=${encodeURIComponent(emailData.value.subject)}`
        if (emailData.value.body) {
          if (emailData.value.subject) qrContent += '&'
          qrContent += `body=${encodeURIComponent(emailData.value.body)}`
        }
      }
      break

    case QRCodeType.WIFI:
      if (!wifiData.value.ssid) {
        toast.warning('请输入Wi-Fi名称')
        return
      }
      qrContent = `WIFI:`
      qrContent += `S:${wifiData.value.ssid};`
      qrContent += `T:${wifiData.value.encryption};`
      if (wifiData.value.encryption && wifiData.value.password) {
        qrContent += `P:${wifiData.value.password};`
      }
      qrContent += `H:${wifiData.value.hidden ? 'true' : 'false'};`
      break

    default:
      toast.warning('请选择二维码类型')
      return
  }

  generating.value = true

  try {
    const qrOptions = {
      width: parseInt(qrSize.value.toString()),
      margin: margin.value,
      color: {
        dark: foregroundColor.value,
        light: backgroundColor.value,
      },
      errorCorrectionLevel: errorCorrection.value as 'L' | 'M' | 'Q' | 'H',
    }

    const qrDataUrl = await QRCode.toDataURL(qrContent, qrOptions)

    // 如果有Logo，将Logo叠加到二维码上
    if (logoPreview.value) {
      const combinedDataUrl = await addLogoToQrCode(qrDataUrl, logoPreview.value, qrSize.value)
      generatedQrCode.value = combinedDataUrl
    } else {
      generatedQrCode.value = qrDataUrl as string
    }

    toast.success('二维码生成成功')
  } catch (error) {
    console.error('生成二维码失败:', error)
    toast.error('二维码生成失败')
  } finally {
    generating.value = false
  }
}

// 将Logo添加到二维码上的函数
const addLogoToQrCode = async (
  qrDataUrl: string,
  logoDataUrl: string,
  qrSize: number,
): Promise<string> => {
  return new Promise((resolve, reject) => {
    // 创建Canvas元素
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    if (!ctx) {
      reject(new Error('Canvas context not available'))
      return
    }

    // 设置Canvas尺寸
    canvas.width = qrSize
    canvas.height = qrSize

    // 创建QR码和Logo的Image对象
    const qrImage = new Image()
    const logoImage = new Image()

    let qrLoaded = false
    let logoLoaded = false

    // QR码加载完成处理
    qrImage.onload = () => {
      qrLoaded = true
      if (qrLoaded && logoLoaded) {
        drawCombinedImage()
      }
    }

    // Logo加载完成处理
    logoImage.onload = () => {
      logoLoaded = true
      if (qrLoaded && logoLoaded) {
        drawCombinedImage()
      }
    }

    // 加载失败处理
    qrImage.onerror = (error) => reject(error)
    logoImage.onerror = (error) => reject(error)

    // 开始加载图片
    qrImage.src = qrDataUrl
    logoImage.src = logoDataUrl

    // 绘制组合图像的函数
    const drawCombinedImage = () => {
      // 绘制QR码
      ctx.drawImage(qrImage, 0, 0, qrSize, qrSize)

      // 计算Logo的尺寸和位置（Logo大小为QR码的1/4，居中显示）
      const logoSize = qrSize / 4
      const logoX = (qrSize - logoSize) / 2
      const logoY = (qrSize - logoSize) / 2

      // 绘制Logo
      ctx.save()
      ctx.beginPath()
      ctx.arc(logoX + logoSize / 2, logoY + logoSize / 2, logoSize / 2, 0, Math.PI * 2)
      ctx.closePath()
      ctx.clip()
      ctx.drawImage(logoImage, logoX, logoY, logoSize, logoSize)
      ctx.restore()

      // 绘制Logo边框（可选，增加视觉效果）
      ctx.strokeStyle = '#FFFFFF'
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.arc(logoX + logoSize / 2, logoY + logoSize / 2, logoSize / 2, 0, Math.PI * 2)
      ctx.closePath()
      ctx.stroke()

      // 返回组合后的图像数据URL
      resolve(canvas.toDataURL('image/png'))
    }
  })
}

// 下载二维码
const downloadQrCode = () => {
  if (!generatedQrCode.value) return

  const link = document.createElement('a')
  link.href = generatedQrCode.value
  link.download = `qrcode_${Date.now()}.png`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  toast.success('二维码下载成功')
}

// 复制二维码图片
const copyQrCode = async () => {
  if (!generatedQrCode.value) return

  try {
    const response = await fetch(generatedQrCode.value)
    const blob = await response.blob()
    await navigator.clipboard.write([
      new ClipboardItem({
        [blob.type]: blob,
      }),
    ])
    toast.success('二维码已复制到剪贴板')
  } catch (error) {
    console.error('复制二维码失败:', error)
    toast.error('复制二维码失败')
  }
}

// Logo上传方法
const triggerLogoInput = () => {
  logoInput.value?.click()
}

const handleLogoUpload = (event: Event) => {
  const input = event.target as HTMLInputElement
  if (input.files && input.files.length > 0 && input.files[0]) {
    processLogoFile(input.files[0])
  }
}

const handleLogoDrop = (event: DragEvent) => {
  if (event.dataTransfer && event.dataTransfer.files.length > 0 && event.dataTransfer.files[0]) {
    processLogoFile(event.dataTransfer.files[0])
  }
}

const processLogoFile = (file: File) => {
  // 检查文件类型
  if (!file.type.startsWith('image/')) {
    toast.warning('请选择图片文件')
    return
  }

  // 检查文件大小（限制1MB）
  if (file.size > 1 * 1024 * 1024) {
    toast.warning('图片大小不能超过1MB')
    return
  }

  // 保存文件引用
  logoFile.value = file

  // 创建预览URL
  const reader = new FileReader()
  reader.onload = (e) => {
    if (e.target) {
      logoPreview.value = e.target.result as string
    }
  }
  reader.readAsDataURL(file)
}

// 监听Logo变化，自动重新生成二维码
watch(
  () => logoPreview.value,
  (newLogoPreview) => {
    if (generatedQrCode.value && !generating.value && newLogoPreview) {
      generateQrCode()
    }
  },
)

// 添加参数自动更新功能
let updateTimer: number | null = null

// 使用watch代替watchEffect，只监听特定的参数变化，避免与Logo变化形成循环
watch(
  // 只监听会影响二维码内容或样式的参数
  [
    () => qrType.value,
    () => inputText.value,
    () => urlData.value,
    () => contactData.value,
    () => phoneData.value,
    () => smsData.value,
    () => emailData.value,
    () => wifiData.value,
    () => qrSize.value,
    () => errorCorrection.value,
    () => margin.value,
    () => foregroundColor.value,
    () => backgroundColor.value,
  ],
  () => {
    // 只有在已经生成过二维码且没有正在生成的情况下才自动更新
    if (generatedQrCode.value && !generating.value) {
      // 检查是否有有效的输入内容
      let hasValidContent = false
      switch (qrType.value) {
        case QRCodeType.TEXT:
          hasValidContent = !!inputText.value
          break
        case QRCodeType.URL:
          hasValidContent = !!urlData.value
          break
        case QRCodeType.CONTACT:
          hasValidContent = !!contactData.value.name
          break
        case QRCodeType.PHONE:
          hasValidContent = !!phoneData.value
          break
        case QRCodeType.SMS:
          hasValidContent = !!smsData.value.phone
          break
        case QRCodeType.EMAIL:
          hasValidContent = !!emailData.value.address
          break
        case QRCodeType.WIFI:
          hasValidContent = !!wifiData.value.ssid
          break
      }

      if (hasValidContent) {
        // 改进防抖处理，清除之前的定时器
        if (updateTimer) {
          clearTimeout(updateTimer)
        }

        updateTimer = window.setTimeout(() => {
          generateQrCode()
          updateTimer = null
        }, 500) // 增加防抖时间到500ms，减少抖动
      }
    }
  },
  { deep: true }, // 监听对象内部的变化
)

// 暴露变量和方法
defineExpose({
  qrType,
  inputText,
  urlData,
  contactData,
  phoneData,
  smsData,
  emailData,
  wifiData,
  qrSize,
  errorCorrection,
  margin,
  foregroundColor,
  backgroundColor,
  generating,
  generatedQrCode,
  logoFile,
  logoPreview,
  logoInput,
  generateQrCode,
  downloadQrCode,
  copyQrCode,
  triggerLogoInput,
  handleLogoUpload,
  handleLogoDrop,
})
</script>
