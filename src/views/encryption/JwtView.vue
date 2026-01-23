<template>
  <div class="bg-gray-50 rounded-xl border border-gray-200 p-6 flex flex-col h-full">
    <!-- 第一行：标题栏 -->
    <div class="flex items-center justify-between mb-6 border-b border-gray-200 pb-4">
      <h3 class="font-semibold text-gray-800 flex items-center gap-2">
        <svg class="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M15 7a2 2 0 012 2h2a2 2 0 012 2v9a2 2 0 01-2 2H7a2 2 0 01-2-2V9a2 2 0 012-2h2m-2 0a2 2 0 012 2v2m0 0a2 2 0 012 2v2m0 0a2 2 0 012 2v2m0 0a2 2 0 012 2v2"
          ></path>
        </svg>
        JWT 在线解析工具
      </h3>
      <div class="flex space-x-2">
        <button
          @click="pasteInput"
          class="px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 transition shadow-sm flex items-center gap-2"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            ></path>
          </svg>
          粘贴
        </button>
        <button
          @click="clearInput"
          class="px-4 py-2 bg-gray-200 text-gray-700 rounded-md text-sm hover:bg-gray-300 transition flex items-center gap-2"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            ></path>
          </svg>
          清空
        </button>
      </div>
    </div>

    <!-- 第二行：左右布局 -->
    <div class="flex flex-col lg:flex-row gap-6 flex-1 overflow-hidden">
      <div class="flex-1 flex flex-col min-h-0">
        <div class="flex items-center justify-between mb-3">
          <h4 class="font-medium text-gray-700 flex items-center gap-2">
            <span class="w-2 h-2 rounded-full bg-blue-500"></span>
            输入 JWT Token
          </h4>
          <button
            @click="formatTokenDisplay = !formatTokenDisplay"
            class="px-3 py-1.5 bg-indigo-100 text-indigo-700 rounded-md text-xs hover:bg-indigo-200 transition"
          >
            {{ formatTokenDisplay ? '关闭格式化' : '格式化显示' }}
          </button>
        </div>
        <div
          class="border border-gray-300 rounded-lg overflow-hidden flex-1 flex flex-col bg-white shadow-sm"
        >
          <textarea
            v-model="inputToken"
            placeholder="请输入或粘贴 JWT Token..."
            class="w-full p-4 font-mono text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none flex-1 transition"
            spellcheck="false"
          ></textarea>
          <div
            v-if="formatTokenDisplay && inputToken"
            class="p-4 bg-gray-100 border-t border-gray-200"
          >
            <div class="text-xs font-mono break-all" v-html="getFormattedToken()"></div>
          </div>
        </div>
        <div class="flex gap-3 mt-4">
          <button
            @click="parseJWT"
            class="flex-1 px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition shadow-md hover:shadow-lg flex items-center justify-center gap-2"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              ></path>
            </svg>
            解析 JWT
          </button>
          <button
            @click="verifyJWT"
            class="flex-1 px-6 py-3 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition shadow-md hover:shadow-lg flex items-center justify-center gap-2"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
            验证 JWT
          </button>
        </div>

        <div
          v-if="tokenStatus"
          class="mt-4 p-4 rounded-lg"
          :class="
            tokenStatus.isExpired
              ? 'bg-red-50 border border-red-200'
              : tokenStatus.isExpiringSoon
                ? 'bg-yellow-50 border border-yellow-200'
                : 'bg-green-50 border border-green-200'
          "
        >
          <div class="flex items-start gap-3">
            <svg
              class="w-5 h-5 mt-0.5 flex-shrink-0"
              :class="
                tokenStatus.isExpired
                  ? 'text-red-500'
                  : tokenStatus.isExpiringSoon
                    ? 'text-yellow-500'
                    : 'text-green-500'
              "
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                v-if="tokenStatus.isExpired"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
              <path
                v-else-if="tokenStatus.isExpiringSoon"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              ></path>
              <path
                v-else
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
            <div class="flex-1">
              <p
                class="font-medium"
                :class="
                  tokenStatus.isExpired
                    ? 'text-red-700'
                    : tokenStatus.isExpiringSoon
                      ? 'text-yellow-700'
                      : 'text-green-700'
                "
              >
                {{
                  tokenStatus.isExpired
                    ? 'Token 已过期'
                    : tokenStatus.isExpiringSoon
                      ? 'Token 即将过期'
                      : 'Token 有效'
                }}
              </p>
              <div
                v-if="tokenStatus.expDate"
                class="text-sm mt-2 space-y-1"
                :class="
                  tokenStatus.isExpired
                    ? 'text-red-600'
                    : tokenStatus.isExpiringSoon
                      ? 'text-yellow-600'
                      : 'text-green-600'
                "
              >
                <p>
                  过期时间: {{ formatTimestamp(Math.floor(tokenStatus.expDate.getTime() / 1000)) }}
                </p>
                <p v-if="tokenStatus.expiresIn !== null">
                  剩余时间: {{ formatDuration(tokenStatus.expiresIn) }}
                </p>
                <p v-if="tokenStatus.expiredFor !== null">
                  已过期: {{ formatDuration(tokenStatus.expiredFor) }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div
          v-if="verifyResult"
          class="mt-4 p-4 rounded-lg"
          :class="
            verifyResult.valid
              ? 'bg-green-50 border border-green-200'
              : 'bg-red-50 border border-red-200'
          "
        >
          <div class="flex items-start gap-3">
            <svg
              class="w-5 h-5 mt-0.5 flex-shrink-0"
              :class="verifyResult.valid ? 'text-green-500' : 'text-red-500'"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                v-if="verifyResult.valid"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
              <path
                v-else
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
            <div>
              <p
                class="font-medium"
                :class="verifyResult.valid ? 'text-green-700' : 'text-red-700'"
              >
                {{ verifyResult.valid ? 'JWT 验证通过' : 'JWT 验证失败' }}
              </p>
              <p
                v-if="verifyResult.message"
                class="text-sm mt-1"
                :class="verifyResult.valid ? 'text-green-600' : 'text-red-600'"
              >
                {{ verifyResult.message }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div class="flex-1 flex flex-col min-h-0 overflow-auto">
        <div v-if="parsedData" class="space-y-4">
          <div class="border border-gray-300 rounded-lg bg-white shadow-sm overflow-hidden">
            <div class="flex border-b border-gray-200">
              <button
                @click="activeTab = 'header'"
                :class="
                  activeTab === 'header'
                    ? 'bg-indigo-50 text-indigo-700 border-b-2 border-indigo-600'
                    : 'text-gray-600 hover:bg-gray-50'
                "
                class="flex-1 px-4 py-3 text-sm font-medium transition-colors flex items-center justify-center gap-2"
              >
                <span class="w-2 h-2 rounded-full bg-purple-500"></span>
                Header (头部)
              </button>
              <button
                @click="activeTab = 'payload'"
                :class="
                  activeTab === 'payload'
                    ? 'bg-indigo-50 text-indigo-700 border-b-2 border-indigo-600'
                    : 'text-gray-600 hover:bg-gray-50'
                "
                class="flex-1 px-4 py-3 text-sm font-medium transition-colors flex items-center justify-center gap-2"
              >
                <span class="w-2 h-2 rounded-full bg-green-500"></span>
                Payload (载荷)
              </button>
              <button
                @click="activeTab = 'signature'"
                :class="
                  activeTab === 'signature'
                    ? 'bg-indigo-50 text-indigo-700 border-b-2 border-indigo-600'
                    : 'text-gray-600 hover:bg-gray-50'
                "
                class="flex-1 px-4 py-3 text-sm font-medium transition-colors flex items-center justify-center gap-2"
              >
                <span class="w-2 h-2 rounded-full bg-orange-500"></span>
                Signature (签名)
              </button>
            </div>

            <div class="p-4">
              <div v-if="activeTab === 'header'">
                <div class="flex items-center justify-between mb-3">
                  <h4 class="font-medium text-gray-700">Header 内容</h4>
                  <div class="flex gap-2">
                    <button
                      @click="showFormattedTime = !showFormattedTime"
                      class="px-3 py-1.5 bg-indigo-100 text-indigo-700 rounded-md text-xs hover:bg-indigo-200 transition"
                    >
                      {{ showFormattedTime ? '显示时间戳' : '显示时间' }}
                    </button>
                    <button
                      @click="copyToClipboard(parsedData.header)"
                      class="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-md text-xs hover:bg-gray-200 transition flex items-center gap-1"
                    >
                      <svg
                        class="w-3.5 h-3.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                        ></path>
                      </svg>
                      复制
                    </button>
                  </div>
                </div>
                <div
                  class="bg-gray-50 rounded-lg p-3 overflow-auto max-h-[300px] border border-gray-200"
                >
                  <table class="w-full text-sm">
                    <tbody>
                      <tr
                        v-for="(value, key) in parsedData.header"
                        :key="key"
                        class="border-b border-gray-200"
                      >
                        <td class="py-2 px-3 font-medium text-gray-700 bg-gray-100 w-1/3">
                          {{ jwt.formatFieldName(key) }}
                        </td>
                        <td class="py-2 px-3 text-gray-800 font-mono">
                          {{
                            showFormattedTime &&
                            jwt.isTimestampField(key) &&
                            typeof value === 'number'
                              ? formatTimestamp(value)
                              : formatValue(value)
                          }}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div class="mt-4">
                  <div class="flex items-center justify-between mb-2">
                    <h5 class="text-sm font-medium text-gray-600">JSON (只读)</h5>
                  </div>
                  <div
                    class="bg-gray-50 rounded-lg p-3 overflow-auto max-h-[150px] border border-gray-200"
                  >
                    <pre class="text-xs font-mono text-gray-800 leading-relaxed">{{
                      JSON.stringify(parsedData.header, null, 2)
                    }}</pre>
                  </div>
                </div>
              </div>

              <div v-if="activeTab === 'payload'">
                <div class="flex items-center justify-between mb-3">
                  <h4 class="font-medium text-gray-700">Payload 内容</h4>
                  <div class="flex gap-2">
                    <button
                      @click="showFormattedTime = !showFormattedTime"
                      class="px-3 py-1.5 bg-indigo-100 text-indigo-700 rounded-md text-xs hover:bg-indigo-200 transition"
                    >
                      {{ showFormattedTime ? '显示时间戳' : '显示时间' }}
                    </button>
                    <button
                      @click="copyToClipboard(parsedData.payload)"
                      class="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-md text-xs hover:bg-gray-200 transition flex items-center gap-1"
                    >
                      <svg
                        class="w-3.5 h-3.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                        ></path>
                      </svg>
                      复制
                    </button>
                  </div>
                </div>
                <div
                  class="bg-gray-50 rounded-lg p-3 overflow-auto max-h-[300px] border border-gray-200"
                >
                  <table class="w-full text-sm">
                    <tbody>
                      <tr
                        v-for="(value, key) in parsedData.payload"
                        :key="key"
                        class="border-b border-gray-200"
                      >
                        <td class="py-2 px-3 font-medium text-gray-700 bg-gray-100 w-1/3">
                          {{ jwt.formatFieldName(key) }}
                        </td>
                        <td class="py-2 px-3 text-gray-800 font-mono">
                          {{
                            showFormattedTime &&
                            jwt.isTimestampField(key) &&
                            typeof value === 'number'
                              ? formatTimestamp(value)
                              : formatValue(value)
                          }}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div class="mt-4">
                  <div class="flex items-center justify-between mb-2">
                    <h5 class="text-sm font-medium text-gray-600">JSON 编辑</h5>
                    <button
                      @click="applyPayloadEdit"
                      class="px-3 py-1.5 bg-indigo-100 text-indigo-700 rounded-md text-xs hover:bg-indigo-200 transition flex items-center gap-1"
                    >
                      应用修改
                    </button>
                  </div>
                  <textarea
                    v-model="editablePayload"
                    class="w-full h-[150px] p-3 font-mono text-xs bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                    spellcheck="false"
                    placeholder="编辑 Payload JSON..."
                  ></textarea>
                </div>
              </div>

              <div v-if="activeTab === 'signature'">
                <div class="flex items-center justify-between mb-3">
                  <h4 class="font-medium text-gray-700">Signature 内容</h4>
                  <button
                    @click="copyToClipboard(parsedData.signature)"
                    class="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-md text-xs hover:bg-gray-200 transition flex items-center gap-1"
                  >
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                      ></path>
                    </svg>
                    复制
                  </button>
                </div>
                <div
                  class="bg-gray-50 rounded-lg p-3 overflow-auto max-h-[300px] border border-gray-200"
                >
                  <pre class="text-xs font-mono text-gray-800 leading-relaxed break-all">{{
                    parsedData.signature
                  }}</pre>
                </div>
              </div>
            </div>
          </div>

          <div class="border border-indigo-300 rounded-lg p-4 bg-indigo-50 shadow-sm">
            <div class="flex items-center justify-between mb-3">
              <h4 class="font-medium text-gray-700 flex items-center gap-2">
                <span class="w-2 h-2 rounded-full bg-indigo-500"></span>
                重新生成 Token
              </h4>
            </div>
            <div class="space-y-3">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">签名算法</label>
                <select
                  v-model="generateConfig.algorithm"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <optgroup
                    v-for="group in algorithmGroups"
                    :key="group.label"
                    :label="group.label"
                  >
                    <option
                      v-for="option in group.options"
                      :key="option.value"
                      :value="option.value"
                    >
                      {{ option.label }}
                    </option>
                  </optgroup>
                </select>
              </div>
              <div v-if="isSymmetricAlgorithm">
                <label class="block text-sm font-medium text-gray-700 mb-1">签名密钥</label>
                <input
                  v-model="generateConfig.secret"
                  type="text"
                  placeholder="请输入签名密钥..."
                  class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div v-else>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1"
                    >私钥 (PEM 格式)</label
                  >
                  <textarea
                    v-model="generateConfig.privateKey"
                    placeholder="-----BEGIN PRIVATE KEY-----..."
                    class="w-full h-24 px-3 py-2 border border-gray-300 rounded-md text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none font-mono text-xs"
                    spellcheck="false"
                  ></textarea>
                </div>
                <div class="mt-3">
                  <label class="block text-sm font-medium text-gray-700 mb-1"
                    >公钥 (PEM 格式)</label
                  >
                  <textarea
                    v-model="generateConfig.publicKey"
                    placeholder="-----BEGIN PUBLIC KEY-----..."
                    class="w-full h-24 px-3 py-2 border border-gray-300 rounded-md text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none font-mono text-xs"
                    spellcheck="false"
                  ></textarea>
                </div>
              </div>
              <button
                @click="generateJWT"
                class="w-full px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition shadow-md hover:shadow-lg flex items-center justify-center gap-2"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  ></path>
                </svg>
                生成 JWT
              </button>
            </div>
          </div>

          <div
            v-if="generatedToken"
            class="border border-green-300 rounded-lg p-4 bg-green-50 shadow-sm"
          >
            <div class="flex items-center justify-between mb-3">
              <h4 class="font-medium text-gray-700 flex items-center gap-2">
                <span class="w-2 h-2 rounded-full bg-green-500"></span>
                生成的 Token
              </h4>
              <button
                @click="copyToClipboard(generatedToken)"
                class="px-3 py-1.5 bg-green-100 text-green-700 rounded-md text-xs hover:bg-green-200 transition flex items-center gap-1"
              >
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                  ></path>
                </svg>
                复制
              </button>
            </div>
            <div
              class="bg-white rounded-lg p-3 overflow-auto max-h-[150px] border border-green-200"
            >
              <pre class="text-xs font-mono text-gray-800 leading-relaxed break-all">{{
                generatedToken
              }}</pre>
            </div>
          </div>
        </div>

        <div v-if="error" class="p-4 bg-red-50 border border-red-200 rounded-lg">
          <div class="flex items-start gap-3">
            <svg
              class="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
            <p class="text-red-600 text-sm">{{ error }}</p>
          </div>
        </div>

        <div
          v-if="!parsedData && !error"
          class="flex flex-col items-center justify-center h-full text-gray-400"
        >
          <svg class="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1"
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            ></path>
          </svg>
          <p class="text-sm">请输入 JWT Token 并点击解析</p>
        </div>
      </div>
    </div>

    <!-- 第三行：JWT 参数说明 -->
    <div class="mt-8 border border-indigo-200 rounded-lg p-4 bg-indigo-50 shadow-sm">
      <div class="flex items-center justify-between mb-3">
        <h4 class="font-medium text-gray-700 flex items-center gap-2">
          <span class="w-2 h-2 rounded-full bg-indigo-500"></span>
          JWT 参数说明
        </h4>
      </div>
      <div class="space-y-4">
        <div>
          <h5 class="text-sm font-semibold text-gray-800 mb-2">Header (头部)</h5>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
            <div class="bg-white p-2 rounded border border-gray-200">
              <span class="font-medium text-indigo-700">alg</span>
              <span class="text-gray-600 ml-1">签名算法</span>
            </div>
            <div class="bg-white p-2 rounded border border-gray-200">
              <span class="font-medium text-indigo-700">typ</span>
              <span class="text-gray-600 ml-1">令牌类型</span>
            </div>
            <div class="bg-white p-2 rounded border border-gray-200">
              <span class="font-medium text-indigo-700">kid</span>
              <span class="text-gray-600 ml-1">密钥ID</span>
            </div>
            <div class="bg-white p-2 rounded border border-gray-200">
              <span class="font-medium text-indigo-700">cty</span>
              <span class="text-gray-600 ml-1">内容类型</span>
            </div>
          </div>
        </div>
        <div>
          <h5 class="text-sm font-semibold text-gray-800 mb-2">Payload (载荷) - 标准声明</h5>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
            <div class="bg-white p-2 rounded border border-gray-200">
              <span class="font-medium text-green-700">iss</span>
              <span class="text-gray-600 ml-1">签发者</span>
            </div>
            <div class="bg-white p-2 rounded border border-gray-200">
              <span class="font-medium text-green-700">sub</span>
              <span class="text-gray-600 ml-1">主题</span>
            </div>
            <div class="bg-white p-2 rounded border border-gray-200">
              <span class="font-medium text-green-700">aud</span>
              <span class="text-gray-600 ml-1">受众</span>
            </div>
            <div class="bg-white p-2 rounded border border-gray-200">
              <span class="font-medium text-green-700">exp</span>
              <span class="text-gray-600 ml-1">过期时间</span>
            </div>
            <div class="bg-white p-2 rounded border border-gray-200">
              <span class="font-medium text-green-700">iat</span>
              <span class="text-gray-600 ml-1">签发时间</span>
            </div>
            <div class="bg-white p-2 rounded border border-gray-200">
              <span class="font-medium text-green-700">nbf</span>
              <span class="text-gray-600 ml-1">生效时间</span>
            </div>
            <div class="bg-white p-2 rounded border border-gray-200">
              <span class="font-medium text-green-700">jti</span>
              <span class="text-gray-600 ml-1">JWT ID</span>
            </div>
            <div class="bg-white p-2 rounded border border-gray-200">
              <span class="font-medium text-green-700">azp</span>
              <span class="text-gray-600 ml-1">授权方</span>
            </div>
          </div>
        </div>
        <div>
          <h5 class="text-sm font-semibold text-gray-800 mb-2">时间戳说明</h5>
          <div class="bg-white p-3 rounded border border-gray-200 text-xs text-gray-700">
            <p class="mb-1">
              JWT 中的时间戳（exp、iat、nbf）使用的是
              <span class="font-mono bg-gray-100 px-1 rounded">Unix 时间戳（秒）</span>
            </p>
            <p class="mb-1">
              例如：2024-01-01 00:00:00 UTC 对应的 Unix 时间戳为
              <span class="font-mono bg-gray-100 px-1 rounded">1704067200</span>
            </p>
            <p>工具会自动将时间戳转换为可读格式显示</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onUnmounted } from 'vue'
import { useToast } from '@/composables/useToast'
import { jwt } from '@/utils/encryption'
import { toastCopy } from '@/utils/clipboard'
import { formatDuration, formatTimestamp } from '@/utils/times'

interface TokenStatus {
  isExpired: boolean
  isExpiringSoon: boolean
  expiresIn: number | null
  expiredFor: number | null
  expDate: Date | null
}

interface AlgorithmOption {
  value: string
  label: string
}

interface AlgorithmGroup {
  label: string
  options: AlgorithmOption[]
}

const toast = useToast()
const inputToken = ref('')
const parsedData = ref<{
  header: Record<string, unknown>
  payload: Record<string, unknown>
  signature: string
} | null>(null)
const error = ref('')
const verifyResult = ref<{ valid: boolean; message: string } | null>(null)
const generatedToken = ref('')
const activeTab = ref<'header' | 'payload' | 'signature'>('header')
const editablePayload = ref('')
const showFormattedTime = ref(false)
const tokenStatus = ref<TokenStatus | null>(null)
const formatTokenDisplay = ref(false)
let countdownTimer: number | null = null

const generateConfig = ref({
  algorithm: 'HS256',
  secret: 'your-secret-key',
  publicKey: '',
  privateKey: '',
})
const algorithmGroups: AlgorithmGroup[] = [
  {
    label: 'HMAC (对称加密)',
    options: [
      { value: 'HS256', label: 'HS256 (HMAC SHA256)' },
      { value: 'HS384', label: 'HS384 (HMAC SHA384)' },
      { value: 'HS512', label: 'HS512 (HMAC SHA512)' },
    ],
  },
  {
    label: 'RSA (非对称加密)',
    options: [
      { value: 'RS256', label: 'RS256 (RSA SHA256)' },
      { value: 'RS384', label: 'RS384 (RSA SHA384)' },
      { value: 'RS512', label: 'RS512 (RSA SHA512)' },
    ],
  },
  {
    label: 'ECDSA (椭圆曲线)',
    options: [
      { value: 'ES256', label: 'ES256 (ECDSA P-256 SHA256)' },
      { value: 'ES384', label: 'ES384 (ECDSA P-384 SHA384)' },
      { value: 'ES512', label: 'ES512 (ECDSA P-521 SHA512)' },
    ],
  },
  {
    label: 'EdDSA',
    options: [{ value: 'EdDSA', label: 'EdDSA (Ed25519)' }],
  },
  {
    label: '其他',
    options: [{ value: 'none', label: 'None (无签名)' }],
  },
]

const isSymmetricAlgorithm = computed(() => {
  return (
    generateConfig.value.algorithm.startsWith('HS') || generateConfig.value.algorithm === 'none'
  )
})

const ensureInput = () => {
  if (!inputToken.value.trim()) {
    toast.warning('请先输入 JWT Token')
    return false
  }
  return true
}

const pasteInput = async () => {
  try {
    inputToken.value = await navigator.clipboard.readText()
    toast.success('已粘贴')
  } catch {
    toast.error('粘贴失败')
  }
}

const clearInput = () => {
  inputToken.value = ''
  parsedData.value = null
  error.value = ''
  verifyResult.value = null
  generatedToken.value = ''
  tokenStatus.value = null
  stopCountdown()
  toast.success('已清空')
}

const parseJWT = () => {
  if (!ensureInput()) return

  error.value = ''
  verifyResult.value = null
  parsedData.value = null
  tokenStatus.value = null

  try {
    const result = jwt.parse(inputToken.value)
    parsedData.value = result

    editablePayload.value = JSON.stringify(result.payload, null, 2)

    calculateTokenStatus(result.payload)

    if (result.header.alg) {
      generateConfig.value.algorithm = result.header.alg as string
    }

    toast.success('JWT 解析成功')
  } catch (err) {
    error.value = err instanceof Error ? err.message : '解析失败，请检查 JWT Token 格式'
    toast.error('JWT 解析失败')
  }
}

const calculateTokenStatus = (payload: Record<string, unknown>) => {
  const exp = payload.exp
  const now = Math.floor(Date.now() / 1000)

  if (typeof exp === 'number') {
    const expDate = new Date(exp * 1000)
    const isExpired = now > exp
    const expiresIn = isExpired ? null : exp - now
    const expiredFor = isExpired ? now - exp : null
    const isExpiringSoon = !isExpired && expiresIn !== null && expiresIn < 3600

    tokenStatus.value = {
      isExpired,
      isExpiringSoon,
      expiresIn,
      expiredFor,
      expDate,
    }

    startCountdown()
  } else {
    tokenStatus.value = {
      isExpired: false,
      isExpiringSoon: false,
      expiresIn: null,
      expiredFor: null,
      expDate: null,
    }

    stopCountdown()
  }
}

const startCountdown = () => {
  stopCountdown()
  countdownTimer = window.setInterval(() => {
    if (tokenStatus.value && tokenStatus.value.expiresIn !== null) {
      const now = Math.floor(Date.now() / 1000)
      const exp = Math.floor(tokenStatus.value.expDate!.getTime() / 1000)
      const isExpired = now > exp
      const expiresIn = isExpired ? null : exp - now
      const expiredFor = isExpired ? now - exp : null
      const isExpiringSoon = !isExpired && expiresIn !== null && expiresIn < 3600

      tokenStatus.value = {
        ...tokenStatus.value,
        isExpired,
        isExpiringSoon,
        expiresIn,
        expiredFor,
      }
    } else {
      stopCountdown()
    }
  }, 1000)
}

const stopCountdown = () => {
  if (countdownTimer !== null) {
    clearInterval(countdownTimer)
    countdownTimer = null
  }
}

onUnmounted(() => {
  stopCountdown()
})

const applyPayloadEdit = () => {
  try {
    const newPayload = JSON.parse(editablePayload.value)
    if (parsedData.value) {
      parsedData.value.payload = newPayload
      toast.success('Payload 已更新')
    }
  } catch {
    toast.error('JSON 格式错误，请检查输入')
  }
}

const verifyJWT = async () => {
  if (!ensureInput()) return

  error.value = ''
  verifyResult.value = null

  try {
    const result = await jwt.verify(inputToken.value, {
      algorithm: generateConfig.value.algorithm,
      secret: generateConfig.value.secret,
      publicKey: generateConfig.value.publicKey,
    })

    verifyResult.value = result

    if (result.valid) {
      toast.success('JWT 验证通过')
    } else {
      toast.error('JWT 验证失败')
    }
  } catch (err) {
    error.value = err instanceof Error ? err.message : '验证失败，请检查 JWT Token 格式'
    toast.error('JWT 验证失败')
  }
}

const generateJWT = async () => {
  if (!parsedData.value) {
    toast.warning('请先解析一个 JWT Token')
    return
  }

  try {
    let payload: Record<string, unknown>

    try {
      payload = JSON.parse(editablePayload.value)
    } catch {
      payload = parsedData.value.payload as Record<string, unknown>
    }

    const token = await jwt.generate(payload, {
      algorithm: generateConfig.value.algorithm,
      secret: generateConfig.value.secret,
      privateKey: generateConfig.value.privateKey,
      header: parsedData.value.header,
    })

    generatedToken.value = token
    toast.success('JWT 生成成功')
  } catch (err) {
    error.value = err instanceof Error ? err.message : '生成失败'
    toast.error('JWT 生成失败')
  }
}

const copyToClipboard = async (data: unknown) => {
  const text = typeof data === 'string' ? data : JSON.stringify(data, null, 2)
  toastCopy(text)
}

const formatValue = (value: unknown) => {
  if (value === null || value === undefined) {
    return 'null'
  }
  if (typeof value === 'string') {
    return `"${value}"`
  }
  if (typeof value === 'number') {
    return value.toString()
  }
  if (typeof value === 'boolean') {
    return value.toString()
  }
  if (Array.isArray(value)) {
    return `Array(${value.length})`
  }
  if (typeof value === 'object') {
    return 'Object'
  }
  return String(value)
}

const formatToken = (token: string) => {
  const parts = token.split('.')
  if (parts.length !== 3) return token

  const colors = ['text-purple-600', 'text-green-600', 'text-orange-600']
  return parts.map((part, index) => `<span class="${colors[index]}">${part}</span>`).join('.')
}

const getFormattedToken = () => {
  if (!formatTokenDisplay.value || !inputToken.value) return inputToken.value
  return formatToken(inputToken.value)
}
</script>

<style scoped></style>
