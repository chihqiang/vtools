<template>
  <div class="h-screen p-6 flex flex-col bg-gray-50 border border-gray-200 rounded-xl">
    <div class="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm p-4 md:p-6 mb-6">
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div class="flex items-center gap-3">
          <svg class="w-8 h-8 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
          <h1 class="text-xl md:text-2xl font-bold text-gray-900">浏览器信息检测</h1>
        </div>
        <button
          @click="getBrowserInfo"
          :disabled="loading"
          class="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <svg
            v-if="!loading"
            class="w-4 h-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          <svg
            v-else
            class="w-4 h-4 animate-spin"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          {{ loading ? '检测中...' : '重新检测' }}
        </button>
      </div>
    </div>

    <div v-if="loading" class="bg-white rounded-xl shadow-sm p-12">
      <div class="flex flex-col items-center justify-center">
        <svg
          class="w-12 h-12 text-blue-600 animate-spin mb-4"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
          />
        </svg>
        <p class="text-gray-600">正在检测浏览器信息...</p>
      </div>
    </div>

    <div v-else-if="!browserInfo" class="bg-white rounded-xl shadow-sm p-12">
      <div class="flex flex-col items-center justify-center">
        <p class="text-gray-600 mb-4">无法获取浏览器信息</p>
        <button
          @click="getBrowserInfo"
          class="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          重新检测
        </button>
      </div>
    </div>

    <div v-else class="bg-white rounded-xl shadow-sm overflow-hidden">
      <div class="border-b border-gray-200 p-2 md:p-4 overflow-x-auto">
        <div class="flex gap-2 min-w-max">
          <button
            v-for="tab in ['basic', 'hardware', 'features', 'network', 'fingerprint']"
            :key="tab"
            @click="activeTab = tab"
            :class="[
              'flex-1 min-w-[120px] px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap',
              activeTab === tab ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100',
            ]"
          >
            {{
              {
                basic: '基本信息',
                hardware: '硬件信息',
                features: '浏览器功能',
                network: '网络信息',
                fingerprint: '浏览器指纹',
              }[tab]
            }}
          </button>
        </div>
      </div>

      <div class="p-4 md:p-6">
        <div v-if="activeTab === 'basic'" class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="border border-gray-200 rounded-lg overflow-hidden">
              <div class="flex items-center gap-2 p-4 bg-gray-50 border-b border-gray-200">
                <svg
                  class="w-5 h-5 text-blue-600"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                  />
                </svg>
                <h3 class="font-semibold text-gray-900">浏览器信息</h3>
              </div>
              <div class="p-4 space-y-3">
                <div class="flex justify-between items-center py-2 border-b border-gray-100">
                  <span class="text-sm text-gray-600 font-medium">浏览器</span>
                  <span class="text-sm text-gray-900 font-mono"
                    >{{ browserInfo.browser.name }} {{ browserInfo.browser.version }}</span
                  >
                </div>
                <div class="flex justify-between items-center py-2 border-b border-gray-100">
                  <span class="text-sm text-gray-600 font-medium">内核</span>
                  <span class="text-sm text-gray-900 font-mono">{{
                    browserInfo.browser.engine
                  }}</span>
                </div>
                <div class="flex justify-between items-start py-2">
                  <span class="text-sm text-gray-600 font-medium">User Agent</span>
                  <div class="flex items-center gap-2">
                    <span
                      class="text-sm text-gray-900 font-mono text-right max-w-[200px] break-all"
                      >{{ browserInfo.userAgent }}</span
                    >
                    <button
                      @click="copyToClipboard(browserInfo.userAgent, 'User Agent')"
                      class="p-1.5 bg-gray-100 rounded hover:bg-gray-200 transition-colors"
                    >
                      <svg
                        class="w-3.5 h-3.5 text-gray-600"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div class="border border-gray-200 rounded-lg overflow-hidden">
              <div class="flex items-center gap-2 p-4 bg-gray-50 border-b border-gray-200">
                <svg
                  class="w-5 h-5 text-blue-600"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                <h3 class="font-semibold text-gray-900">操作系统</h3>
              </div>
              <div class="p-4 space-y-3">
                <div class="flex justify-between items-center py-2 border-b border-gray-100">
                  <span class="text-sm text-gray-600 font-medium">系统</span>
                  <span class="text-sm text-gray-900 font-mono"
                    >{{ browserInfo.os.name }} {{ browserInfo.os.version }}</span
                  >
                </div>
                <div class="flex justify-between items-center py-2 border-b border-gray-100">
                  <span class="text-sm text-gray-600 font-medium">架构</span>
                  <span class="text-sm text-gray-900 font-mono">{{
                    browserInfo.os.architecture
                  }}</span>
                </div>
                <div class="flex justify-between items-center py-2">
                  <span class="text-sm text-gray-600 font-medium">平台</span>
                  <span class="text-sm text-gray-900 font-mono">{{
                    browserInfo.hardware.platform
                  }}</span>
                </div>
              </div>
            </div>

            <div class="border border-gray-200 rounded-lg overflow-hidden">
              <div class="flex items-center gap-2 p-4 bg-gray-50 border-b border-gray-200">
                <svg
                  class="w-5 h-5 text-blue-600"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                  />
                </svg>
                <h3 class="font-semibold text-gray-900">设备信息</h3>
              </div>
              <div class="p-4 space-y-3">
                <div class="flex justify-between items-center py-2 border-b border-gray-100">
                  <span class="text-sm text-gray-600 font-medium">设备类型</span>
                  <span class="text-sm text-gray-900 font-mono">{{ browserInfo.device.type }}</span>
                </div>
                <div class="flex justify-between items-center py-2 border-b border-gray-100">
                  <span class="text-sm text-gray-600 font-medium">厂商</span>
                  <span class="text-sm text-gray-900 font-mono">{{
                    browserInfo.device.vendor
                  }}</span>
                </div>
                <div class="flex justify-between items-center py-2">
                  <span class="text-sm text-gray-600 font-medium">触摸点</span>
                  <span class="text-sm text-gray-900 font-mono">{{
                    browserInfo.hardware.maxTouchPoints
                  }}</span>
                </div>
              </div>
            </div>

            <div class="border border-gray-200 rounded-lg overflow-hidden">
              <div class="flex items-center gap-2 p-4 bg-gray-50 border-b border-gray-200">
                <svg
                  class="w-5 h-5 text-blue-600"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <h3 class="font-semibold text-gray-900">语言和时区</h3>
              </div>
              <div class="p-4 space-y-3">
                <div class="flex justify-between items-center py-2 border-b border-gray-100">
                  <span class="text-sm text-gray-600 font-medium">语言</span>
                  <span class="text-sm text-gray-900 font-mono">{{
                    browserInfo.locale.language
                  }}</span>
                </div>
                <div class="flex justify-between items-center py-2 border-b border-gray-100">
                  <span class="text-sm text-gray-600 font-medium">时区</span>
                  <span class="text-sm text-gray-900 font-mono">{{
                    browserInfo.locale.timezone
                  }}</span>
                </div>
                <div class="flex justify-between items-center py-2 border-b border-gray-100">
                  <span class="text-sm text-gray-600 font-medium">时区偏移</span>
                  <span class="text-sm text-gray-900 font-mono"
                    >{{ browserInfo.locale.timezoneOffset }} 分钟</span
                  >
                </div>
                <div class="py-2">
                  <span class="text-sm text-gray-600 font-medium block mb-2">支持语言</span>
                  <div class="flex flex-wrap gap-2 justify-end">
                    <span
                      v-for="(lang, index) in browserInfo.locale.languages"
                      :key="index"
                      class="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs"
                    >
                      {{ lang }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-if="activeTab === 'hardware'" class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="border border-gray-200 rounded-lg overflow-hidden">
              <div class="flex items-center gap-2 p-4 bg-gray-50 border-b border-gray-200">
                <svg
                  class="w-5 h-5 text-blue-600"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"
                  />
                </svg>
                <h3 class="font-semibold text-gray-900">处理器信息</h3>
              </div>
              <div class="p-4 space-y-3">
                <div class="flex justify-between items-center py-2 border-b border-gray-100">
                  <span class="text-sm text-gray-600 font-medium">CPU 核心数</span>
                  <span class="text-sm text-gray-900 font-mono">{{
                    browserInfo.hardware.cpuCores
                  }}</span>
                </div>
                <div class="flex justify-between items-center py-2">
                  <span class="text-sm text-gray-600 font-medium">内存</span>
                  <span class="text-sm text-gray-900 font-mono">{{
                    browserInfo.hardware.memory ? `${browserInfo.hardware.memory} GB` : '未知'
                  }}</span>
                </div>
              </div>
            </div>

            <div class="border border-gray-200 rounded-lg overflow-hidden">
              <div class="flex items-center gap-2 p-4 bg-gray-50 border-b border-gray-200">
                <svg
                  class="w-5 h-5 text-blue-600"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                <h3 class="font-semibold text-gray-900">屏幕信息</h3>
              </div>
              <div class="p-4 space-y-3">
                <div class="flex justify-between items-center py-2 border-b border-gray-100">
                  <span class="text-sm text-gray-600 font-medium">屏幕分辨率</span>
                  <span class="text-sm text-gray-900 font-mono"
                    >{{ browserInfo.screen.width }} × {{ browserInfo.screen.height }}</span
                  >
                </div>
                <div class="flex justify-between items-center py-2 border-b border-gray-100">
                  <span class="text-sm text-gray-600 font-medium">可用分辨率</span>
                  <span class="text-sm text-gray-900 font-mono"
                    >{{ browserInfo.screen.availWidth }} ×
                    {{ browserInfo.screen.availHeight }}</span
                  >
                </div>
                <div class="flex justify-between items-center py-2 border-b border-gray-100">
                  <span class="text-sm text-gray-600 font-medium">颜色深度</span>
                  <span class="text-sm text-gray-900 font-mono"
                    >{{ browserInfo.screen.colorDepth }} 位</span
                  >
                </div>
                <div class="flex justify-between items-center py-2 border-b border-gray-100">
                  <span class="text-sm text-gray-600 font-medium">像素深度</span>
                  <span class="text-sm text-gray-900 font-mono"
                    >{{ browserInfo.screen.pixelDepth }} 位</span
                  >
                </div>
                <div class="flex justify-between items-center py-2">
                  <span class="text-sm text-gray-600 font-medium">设备像素比</span>
                  <span class="text-sm text-gray-900 font-mono">{{
                    browserInfo.screen.devicePixelRatio
                  }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-if="activeTab === 'features'" class="space-y-6">
          <div class="border border-gray-200 rounded-lg overflow-hidden max-w-3xl mx-auto">
            <div class="flex items-center gap-2 p-4 bg-gray-50 border-b border-gray-200">
              <svg
                class="w-5 h-5 text-blue-600"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
              <h3 class="font-semibold text-gray-900">浏览器功能支持</h3>
            </div>
            <div class="p-4">
              <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                <div
                  v-for="(supported, feature) in browserInfo.features"
                  :key="feature"
                  :class="[
                    'flex items-center gap-2 p-3 rounded-lg',
                    supported ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800',
                  ]"
                >
                  <svg
                    class="w-4 h-4 flex-shrink-0"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                  >
                    <path
                      v-if="supported"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M5 13l4 4L19 7"
                    />
                    <path
                      v-else
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                  <span class="text-sm font-medium">{{
                    {
                      cookies: 'Cookie',
                      localStorage: 'LocalStorage',
                      sessionStorage: 'SessionStorage',
                      indexedDB: 'IndexedDB',
                      webGL: 'WebGL',
                      canvas: 'Canvas',
                      webRTC: 'WebRTC',
                      geolocation: '地理位置',
                      notifications: '通知',
                      serviceWorker: 'Service Worker',
                      webSocket: 'WebSocket',
                      webWorker: 'Web Worker',
                      webAudio: 'Web Audio',
                      webSpeech: '语音识别',
                      battery: '电池API',
                      bluetooth: '蓝牙',
                      clipboard: '剪贴板',
                      fullscreen: '全屏',
                      payment: '支付',
                      webShare: '分享',
                      mediaDevices: '媒体设备',
                      gamepad: '游戏手柄',
                      vr: 'VR',
                      webUSB: 'USB',
                      webNFC: 'NFC',
                    }[feature]
                  }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-if="activeTab === 'network'" class="space-y-6">
          <div class="border border-gray-200 rounded-lg overflow-hidden max-w-3xl mx-auto">
            <div class="flex items-center gap-2 p-4 bg-gray-50 border-b border-gray-200">
              <svg
                class="w-5 h-5 text-blue-600"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0"
                />
              </svg>
              <h3 class="font-semibold text-gray-900">网络信息</h3>
            </div>
            <div class="p-4 space-y-3">
              <div class="flex justify-between items-center py-2 border-b border-gray-100">
                <span class="text-sm text-gray-600 font-medium">连接类型</span>
                <span class="text-sm text-gray-900 font-mono">{{
                  browserInfo.network.connection
                }}</span>
              </div>
              <div class="flex justify-between items-center py-2 border-b border-gray-100">
                <span class="text-sm text-gray-600 font-medium">有效类型</span>
                <span class="text-sm text-gray-900 font-mono">{{
                  browserInfo.network.effectiveType
                }}</span>
              </div>
              <div class="flex justify-between items-center py-2 border-b border-gray-100">
                <span class="text-sm text-gray-600 font-medium">下行速度</span>
                <span class="text-sm text-gray-900 font-mono">{{
                  browserInfo.network.downlink ? `${browserInfo.network.downlink} Mbps` : '未知'
                }}</span>
              </div>
              <div class="flex justify-between items-center py-2">
                <span class="text-sm text-gray-600 font-medium">往返时间</span>
                <span class="text-sm text-gray-900 font-mono">{{
                  browserInfo.network.rtt ? `${browserInfo.network.rtt} ms` : '未知'
                }}</span>
              </div>
            </div>
          </div>
        </div>

        <div v-if="activeTab === 'fingerprint'" class="space-y-6">
          <div class="p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <p class="text-sm text-amber-800 leading-relaxed">
              浏览器指纹是基于您的浏览器和设备特征生成的唯一标识符，可用于识别和跟踪用户。
            </p>
          </div>
          <div class="p-4 bg-gray-50 rounded-lg">
            <span class="text-sm text-gray-600 font-medium block mb-2">指纹哈希</span>
            <div class="flex items-start gap-2">
              <span class="text-xs text-gray-900 font-mono break-all flex-1">{{
                browserInfo.fingerprint
              }}</span>
              <button
                @click="copyToClipboard(browserInfo.fingerprint, '浏览器指纹')"
                class="p-1.5 bg-gray-200 rounded hover:bg-gray-300 transition-colors flex-shrink-0"
              >
                <svg
                  class="w-3.5 h-3.5 text-gray-600"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
              </button>
            </div>
          </div>
          <div class="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <span class="text-sm text-gray-600 font-medium block mb-2">生成的规则</span>
            <ul class="text-sm text-gray-700 space-y-2 list-disc list-inside">
              <li>User Agent 字符串：包含浏览器名称、版本和操作系统信息</li>
              <li>屏幕分辨率：屏幕的宽度和高度</li>
              <li>颜色深度：屏幕的颜色深度</li>
              <li>时区：用户所在的时区</li>
              <li>语言设置：浏览器的主要语言</li>
              <li>CPU 核心数：设备的处理器核心数</li>
              <li>浏览器功能：支持的 Web API 功能（如 WebGL、Canvas、LocalStorage 等）</li>
              <li>Canvas 指纹：基于 Canvas 渲染的唯一特征</li>
              <li>WebGL 指纹：GPU 厂商和渲染器信息</li>
              <li>平台信息：操作系统平台信息</li>
            </ul>
            <p class="text-sm text-gray-700 mt-3">
              以上信息通过 SHA-256
              哈希算法生成唯一的指纹标识符。相同的浏览器和设备环境会生成相同的指纹。
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useToast } from '@/composables/useToast'

interface BrowserInfo {
  userAgent: string
  browser: {
    name: string
    version: string
    engine: string
  }
  os: {
    name: string
    version: string
    architecture: string
  }
  device: {
    type: string
    vendor: string
    model: string
  }
  screen: {
    width: number
    height: number
    availWidth: number
    availHeight: number
    colorDepth: number
    pixelDepth: number
    devicePixelRatio: number
  }
  network: {
    connection?: string
    effectiveType?: string
    downlink?: number
    rtt?: number
  }
  hardware: {
    cpuCores: number
    memory?: number
    platform: string
    maxTouchPoints: number
  }
  features: {
    cookies: boolean
    localStorage: boolean
    sessionStorage: boolean
    indexedDB: boolean
    webGL: boolean
    canvas: boolean
    webRTC: boolean
    geolocation: boolean
    notifications: boolean
    serviceWorker: boolean
    webSocket: boolean
    webWorker: boolean
    webAudio: boolean
    webSpeech: boolean
    battery: boolean
    bluetooth: boolean
    clipboard: boolean
    fullscreen: boolean
    payment: boolean
    webShare: boolean
    mediaDevices: boolean
    gamepad: boolean
    vr: boolean
    webUSB: boolean
    webNFC: boolean
  }
  locale: {
    language: string
    languages: string[]
    timezone: string
    timezoneOffset: number
  }
  fingerprint: string
}

interface ExtendedNavigator extends Navigator {
  connection?: {
    type?: string
    effectiveType?: string
    downlink?: number
    rtt?: number
    saveData?: boolean
  }
  deviceMemory?: number
}

const toast = useToast()
const browserInfo = ref<BrowserInfo | null>(null)
const loading = ref(true)
const activeTab = ref('basic')

const parseUserAgent = (ua: string) => {
  const browser = { name: 'Unknown', version: 'Unknown', engine: 'Unknown' }
  const os = { name: 'Unknown', version: 'Unknown', architecture: 'Unknown' }
  const device = { type: 'Desktop', vendor: 'Unknown', model: 'Unknown' }

  if (ua.includes('Chrome') && !ua.includes('Edg')) {
    browser.name = 'Chrome'
    browser.engine = 'Blink'
    const match = ua.match(/Chrome\/([0-9.]+)/)
    if (match) browser.version = match[1] ?? 'Unknown'
  } else if (ua.includes('Firefox')) {
    browser.name = 'Firefox'
    browser.engine = 'Gecko'
    const match = ua.match(/Firefox\/([0-9.]+)/)
    if (match) browser.version = match[1] ?? 'Unknown'
  } else if (ua.includes('Safari') && !ua.includes('Chrome')) {
    browser.name = 'Safari'
    browser.engine = 'WebKit'
    const match = ua.match(/Version\/([0-9.]+)/)
    if (match) browser.version = match[1] ?? 'Unknown'
  } else if (ua.includes('Edg')) {
    browser.name = 'Edge'
    browser.engine = 'Blink'
    const match = ua.match(/Edg\/([0-9.]+)/)
    if (match) browser.version = match[1] ?? 'Unknown'
  }

  if (ua.includes('Windows NT')) {
    os.name = 'Windows'
    const match = ua.match(/Windows NT ([0-9.]+)/)
    if (match) {
      const version = match[1]
      switch (version) {
        case '10.0':
          os.version = '10/11'
          break
        case '6.3':
          os.version = '8.1'
          break
        case '6.2':
          os.version = '8'
          break
        case '6.1':
          os.version = '7'
          break
        default:
          os.version = version || 'Unknown'
      }
    } else {
      os.version = 'Unknown'
    }
    os.architecture = ua.includes('WOW64') || ua.includes('Win64') ? 'x64' : 'x86'
  } else if (ua.includes('Mac OS X')) {
    os.name = 'macOS'
    const match = ua.match(/Mac OS X ([0-9_]+)/)
    if (match) os.version = match[1]?.replace(/_/g, '.') ?? 'Unknown'
    os.architecture = 'x64'
  } else if (ua.includes('Linux')) {
    os.name = 'Linux'
    os.architecture = ua.includes('x86_64') ? 'x64' : 'x86'
  } else if (ua.includes('Android')) {
    os.name = 'Android'
    const match = ua.match(/Android ([0-9.]+)/)
    if (match) os.version = match[1] ?? 'Unknown'
    device.type = 'Mobile'
  } else if (ua.includes('iPhone') || ua.includes('iPad')) {
    os.name = 'iOS'
    const match = ua.match(/OS ([0-9_]+)/)
    if (match) os.version = match[1]?.replace(/_/g, '.') ?? 'Unknown'
    device.type = ua.includes('iPad') ? 'Tablet' : 'Mobile'
    device.vendor = 'Apple'
  }

  return { browser, os, device }
}

const detectFeatures = () => {
  return {
    cookies: navigator.cookieEnabled,
    localStorage: typeof Storage !== 'undefined',
    sessionStorage: typeof Storage !== 'undefined',
    indexedDB: 'indexedDB' in window,
    webGL: (() => {
      try {
        const canvas = document.createElement('canvas')
        return !!(canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
      } catch {
        return false
      }
    })(),
    canvas: (() => {
      try {
        const canvas = document.createElement('canvas')
        return !!(canvas.getContext && canvas.getContext('2d'))
      } catch {
        return false
      }
    })(),
    webRTC: 'RTCPeerConnection' in window,
    geolocation: 'geolocation' in navigator,
    notifications: 'Notification' in window,
    serviceWorker: 'serviceWorker' in navigator,
    webSocket: 'WebSocket' in window,
    webWorker: 'Worker' in window,
    webAudio: 'AudioContext' in window || 'webkitAudioContext' in window,
    webSpeech: 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window,
    battery: 'getBattery' in navigator,
    bluetooth: 'bluetooth' in navigator,
    clipboard: 'clipboard' in navigator,
    fullscreen: 'fullscreenEnabled' in document,
    payment: 'PaymentRequest' in window,
    webShare: 'share' in navigator,
    mediaDevices: 'mediaDevices' in navigator,
    gamepad: 'getGamepads' in navigator,
    vr: 'xr' in navigator || 'getVRDisplays' in navigator,
    webUSB: 'usb' in navigator,
    webNFC: 'NDEFReader' in window,
  }
}

const generateFingerprint = async (info: Partial<BrowserInfo>) => {
  const components: string[] = [
    info.userAgent || '',
    `${info.screen?.width}x${info.screen?.height}`,
    String(info.screen?.colorDepth),
    info.locale?.timezone || '',
    info.locale?.language || '',
    String(info.hardware?.cpuCores),
    JSON.stringify(info.features),
    navigator.platform,
  ]

  try {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    if (ctx) {
      ctx.textBaseline = 'top'
      ctx.font = '14px Arial'
      ctx.fillText('Browser fingerprint test 🔍', 2, 2)
      components.push(canvas.toDataURL())
    }
  } catch {}

  try {
    const canvas = document.createElement('canvas')
    const gl =
      canvas.getContext('webgl') ||
      (canvas.getContext('experimental-webgl') as WebGLRenderingContext | null)
    if (gl) {
      const debugInfo = gl.getExtension('WEBGL_debug_renderer_info')
      if (debugInfo) {
        components.push(gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL))
        components.push(gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL))
      }
    }
  } catch {}

  const text = components.join('|')
  const encoder = new TextEncoder()
  const data = encoder.encode(text)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')
}

const getBrowserInfo = async () => {
  loading.value = true

  try {
    const ua = navigator.userAgent
    const { browser, os, device } = parseUserAgent(ua)

    const connection = (navigator as ExtendedNavigator).connection
    const network = {
      connection: connection?.type || 'Unknown',
      effectiveType: connection?.effectiveType || 'Unknown',
      downlink: connection?.downlink,
      rtt: connection?.rtt,
    }

    const hardware = {
      cpuCores: navigator.hardwareConcurrency || 1,
      memory: (navigator as ExtendedNavigator).deviceMemory,
      platform: navigator.platform || 'Unknown',
      maxTouchPoints: navigator.maxTouchPoints || 0,
    }

    const screen = {
      width: window.screen.width,
      height: window.screen.height,
      availWidth: window.screen.availWidth,
      availHeight: window.screen.availHeight,
      colorDepth: window.screen.colorDepth,
      pixelDepth: window.screen.pixelDepth,
      devicePixelRatio: window.devicePixelRatio || 1,
    }

    const locale = {
      language: navigator.language || 'Unknown',
      languages: Array.from(navigator.languages),
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'Unknown',
      timezoneOffset: new Date().getTimezoneOffset(),
    }

    const features = detectFeatures()

    const info: Partial<BrowserInfo> = {
      userAgent: ua,
      browser,
      os,
      device,
      screen,
      network,
      hardware,
      features,
      locale,
    }

    const fingerprint = await generateFingerprint(info)

    browserInfo.value = {
      ...info,
      fingerprint,
    } as BrowserInfo
  } catch (error) {
    console.error('获取浏览器信息失败:', error)
    toast.error('获取浏览器信息失败')
  } finally {
    loading.value = false
  }
}

const copyToClipboard = (text: string, label: string) => {
  navigator.clipboard
    .writeText(text)
    .then(() => {
      toast.success(`${label}已复制到剪贴板`)
    })
    .catch(() => {
      toast.error('复制失败')
    })
}

onMounted(() => {
  getBrowserInfo()
})
</script>
