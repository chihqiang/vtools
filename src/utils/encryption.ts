/**
 * 加密工具模块
 * 提供各种加密解密算法的封装，包括：
 * - Base64 编码/解码
 * - URL 编码/解码
 * - MD5 哈希（32位/16位）
 * - SHA 系列哈希（SHA1/SHA224/SHA256/SHA384/SHA512/SHA3）
 * - RIPEMD160 哈希
 * - HMAC 消息认证码
 * - JWT 令牌解析/验证/生成
 */

import md5 from 'crypto-js/md5'
import sha1 from 'crypto-js/sha1'
import sha224 from 'crypto-js/sha224'
import sha256 from 'crypto-js/sha256'
import sha384 from 'crypto-js/sha384'
import sha512 from 'crypto-js/sha512'
import sha3 from 'crypto-js/sha3'
import ripemd160 from 'crypto-js/ripemd160'
import hmacMd5 from 'crypto-js/hmac-md5'
import hmacSha1 from 'crypto-js/hmac-sha1'
import hmacSha256 from 'crypto-js/hmac-sha256'
import Base64 from 'crypto-js/enc-base64'
import Utf8 from 'crypto-js/enc-utf8'
import { decodeJwt, SignJWT, jwtVerify, importPKCS8, importSPKI } from 'jose'

const DEFAULT_HMAC_KEY = 'vtools-secret-key'

/**
 * Base64 编码/解码模块
 */
export const base64 = {
  /**
   * 将字符串进行 Base64 编码
   * @param {string} text - 要编码的字符串
   * @returns {string} Base64 编码后的字符串
   * @example
   * base64.encrypt('hello') // 'aGVsbG8='
   */
  encrypt: (text: string): string => {
    return Base64.stringify(Utf8.parse(text))
  },

  /**
   * 将 Base64 编码的字符串解码
   * @param {string} text - 要解码的 Base64 字符串
   * @returns {string} 解码后的原始字符串
   * @example
   * base64.decrypt('aGVsbG8=') // 'hello'
   */
  decrypt: (text: string): string => {
    return Utf8.stringify(Base64.parse(text))
  },
}

/**
 * URL 编码/解码模块
 */
export const url = {
  /**
   * 将字符串进行 URL 编码
   * @param {string} text - 要编码的字符串
   * @returns {string} URL 编码后的字符串
   * @example
   * url.encode('hello world') // 'hello%20world'
   */
  encode: (text: string): string => {
    return encodeURIComponent(text)
  },

  /**
   * 将 URL 编码的字符串解码
   * @param {string} text - 要解码的 URL 编码字符串
   * @returns {string} 解码后的原始字符串
   * @example
   * url.decode('hello%20world') // 'hello world'
   */
  decode: (text: string): string => {
    return decodeURIComponent(text)
  },
}

/**
 * MD5 哈希模块
 */
export const md5Hash = {
  /**
   * 计算字符串的 32 位 MD5 哈希值
   * @param {string} text - 要计算哈希的字符串
   * @returns {string} 32 位小写 MD5 哈希值
   * @example
   * md5Hash[32]('hello') // '5d41402abc4b2a76b9719d911017c592'
   */
  32: (text: string): string => {
    return md5(text).toString().toLowerCase()
  },

  /**
   * 计算字符串的 16 位 MD5 哈希值
   * @param {string} text - 要计算哈希的字符串
   * @returns {string} 16 位小写 MD5 哈希值
   * @example
   * md5Hash[16]('hello') // '98d70c9794c72f8b'
   */
  16: (text: string): string => {
    return md5(text).toString().substring(8, 24).toLowerCase()
  },
}

/**
 * SHA 系列哈希模块
 */
export const sha = {
  /**
   * 计算字符串的 SHA1 哈希值
   * @param {string} text - 要计算哈希的字符串
   * @returns {string} 小写 SHA1 哈希值
   * @example
   * sha.sha1('hello') // 'aaf4c61ddcc5e8a2dabede0f3b482cd9aea9434d'
   */
  sha1: (text: string): string => {
    return sha1(text).toString().toLowerCase()
  },

  /**
   * 计算字符串的 SHA224 哈希值
   * @param {string} text - 要计算哈希的字符串
   * @returns {string} 小写 SHA224 哈希值
   */
  sha224: (text: string): string => {
    return sha224(text).toString().toLowerCase()
  },

  /**
   * 计算字符串的 SHA256 哈希值
   * @param {string} text - 要计算哈希的字符串
   * @returns {string} 小写 SHA256 哈希值
   * @example
   * sha.sha256('hello') // '2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824'
   */
  sha256: (text: string): string => {
    return sha256(text).toString().toLowerCase()
  },

  /**
   * 计算字符串的 SHA384 哈希值
   * @param {string} text - 要计算哈希的字符串
   * @returns {string} 小写 SHA384 哈希值
   */
  sha384: (text: string): string => {
    return sha384(text).toString().toLowerCase()
  },

  /**
   * 计算字符串的 SHA512 哈希值
   * @param {string} text - 要计算哈希的字符串
   * @returns {string} 小写 SHA512 哈希值
   */
  sha512: (text: string): string => {
    return sha512(text).toString().toLowerCase()
  },

  /**
   * 计算字符串的 SHA3 哈希值
   * @param {string} text - 要计算哈希的字符串
   * @returns {string} 小写 SHA3 哈希值
   */
  sha3: (text: string): string => {
    return sha3(text).toString().toLowerCase()
  },
}

/**
 * RIPEMD160 哈希模块
 */
export const ripemd = {
  /**
   * 计算字符串的 RIPEMD160 哈希值
   * @param {string} text - 要计算哈希的字符串
   * @returns {string} 小写 RIPEMD160 哈希值
   * @example
   * ripemd.ripemd160('hello') // '108f07b8382412612c048d07d13f814118445acd'
   */
  ripemd160: (text: string): string => {
    return ripemd160(text).toString().toLowerCase()
  },
}

/**
 * HMAC 消息认证码模块
 */
export const hmac = {
  /**
   * 计算字符串的 HMAC-MD5 哈希值
   * @param {string} text - 要计算哈希的字符串
   * @param {string} [key=DEFAULT_HMAC_KEY] - 密钥
   * @returns {string} 小写 HMAC-MD5 哈希值
   */
  md5: (text: string, key: string = DEFAULT_HMAC_KEY): string => {
    return hmacMd5(text, key).toString().toLowerCase()
  },

  /**
   * 计算字符串的 HMAC-SHA1 哈希值
   * @param {string} text - 要计算哈希的字符串
   * @param {string} [key=DEFAULT_HMAC_KEY] - 密钥
   * @returns {string} 小写 HMAC-SHA1 哈希值
   */
  sha1: (text: string, key: string = DEFAULT_HMAC_KEY): string => {
    return hmacSha1(text, key).toString().toLowerCase()
  },

  /**
   * 计算字符串的 HMAC-SHA256 哈希值
   * @param {string} text - 要计算哈希的字符串
   * @param {string} [key=DEFAULT_HMAC_KEY] - 密钥
   * @returns {string} 小写 HMAC-SHA256 哈希值
   */
  sha256: (text: string, key: string = DEFAULT_HMAC_KEY): string => {
    return hmacSha256(text, key).toString().toLowerCase()
  },
}

/**
 * JWT 解析数据接口
 */
export interface JwtParsedData {
  /** JWT 头部信息 */
  header: Record<string, unknown>
  /** JWT 载荷信息 */
  payload: Record<string, unknown>
  /** JWT 签名 */
  signature: string
}

/**
 * JWT 验证结果接口
 */
export interface JwtVerifyResult {
  /** 验证是否通过 */
  valid: boolean
  /** 验证结果消息 */
  message: string
}

/**
 * JWT 生成选项接口
 */
export interface JwtGenerateOptions {
  /** 签名算法 */
  algorithm: string
  /** 对称加密密钥（用于 HS 系列算法） */
  secret?: string
  /** 公钥（用于 RS/ES/EdDSA 系列算法的验证） */
  publicKey?: string
  /** 私钥（用于 RS/ES/EdDSA 系列算法的签名） */
  privateKey?: string
  /** 自定义 JWT 头部 */
  header?: Record<string, unknown>
}

export const JwtFieldMap: Record<string, string> = {
  alg: '算法 (alg)',
  typ: '类型 (typ)',
  cty: '内容类型 (cty)',
  kid: '密钥 ID (kid)',
  jku: 'JWK Set URL (jku)',
  x5u: 'X.509 URL (x5u)',
  x5c: 'X.509 证书链 (x5c)',
  x5t: 'X.509 证书指纹 (x5t)',
  'x5t#S256': 'X.509 证书指纹 SHA256 (x5t#S256)',
  sub: '主题 (sub)',
  iss: '签发者 (iss)',
  aud: '受众 (aud)',
  exp: '过期时间 (exp)',
  iat: '签发时间 (iat)',
  nbf: '生效时间 (nbf)',
  jti: 'JWT ID (jti)',
  azp: '授权方 (azp)',
  nonce: '随机数 (nonce)',
  auth_time: '认证时间 (auth_time)',
  at_hash: '访问令牌哈希 (at_hash)',
  c_hash: '代码哈希 (c_hash)',
  acr: '认证上下文引用 (acr)',
  amr: '认证方法引用 (amr)',
  scopes: '作用域 (scopes)',
  client_id: '客户端 ID (client_id)',
  preferred_username: '首选用户名 (preferred_username)',
  email: '邮箱 (email)',
  email_verified: '邮箱已验证 (email_verified)',
  name: '姓名 (name)',
  given_name: '名 (given_name)',
  family_name: '姓 (family_name)',
  picture: '头像 (picture)',
  locale: '地区 (locale)',
  updated_at: '更新时间 (updated_at)',
}

/**
 * JWT 工具模块
 */
export const jwt = {
  /**
   * 格式化 JWT 字段名称
   * @param {string} field - JWT 字段名称
   * @returns {string} 格式化后的字段名称
   */
  formatFieldName: (field: string): string => {
    return JwtFieldMap[field] || field
  },

  /**
   * 判断 JWT 字段是否为时间戳字段
   * @param {string} field - JWT 字段名称
   * @returns {boolean} 是否为时间戳字段
   */
  isTimestampField: (field: string): boolean => {
    return ['exp', 'iat', 'nbf'].includes(field)
  },

  /**
   * 解析 JWT 令牌
   * @param {string} token - JWT 令牌字符串
   * @returns {JwtParsedData} 解析后的 JWT 数据
   * @throws {Error} 当令牌格式不正确时抛出错误
   * @example
   * jwt.parse('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...')
   */
  parse: (token: string): JwtParsedData => {
    const parts = token.split('.')
    if (parts.length !== 3) {
      throw new Error('JWT Token 格式不正确，应该包含 Header、Payload 和 Signature 三部分')
    }

    const [headerB64, , signature] = parts

    if (!headerB64 || !signature) {
      throw new Error('JWT Token 格式不正确')
    }

    const header = JSON.parse(atob(headerB64))
    const payload = decodeJwt(token)

    return {
      header,
      payload: payload as Record<string, unknown>,
      signature,
    }
  },

  /**
   * 验证 JWT 令牌
   * @param {string} token - JWT 令牌字符串
   * @param {JwtGenerateOptions} options - 验证选项
   * @returns {Promise<JwtVerifyResult>} 验证结果
   * @throws {Error} 当令牌格式不正确或缺少必要参数时抛出错误
   * @example
   * await jwt.verify('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...', {
   *   algorithm: 'HS256',
   *   secret: 'your-secret-key'
   * })
   */
  verify: async (token: string, options: JwtGenerateOptions): Promise<JwtVerifyResult> => {
    const parts = token.split('.')
    if (parts.length !== 3) {
      throw new Error('JWT Token 格式不正确')
    }

    const headerB64 = parts[0]
    if (!headerB64) {
      throw new Error('JWT Token 格式不正确')
    }

    const header = JSON.parse(atob(headerB64))
    const algorithm = header.alg

    if (algorithm === 'none') {
      return {
        valid: false,
        message: 'None 算法不安全，无法验证',
      }
    }

    let key: Uint8Array | CryptoKey

    if (algorithm.startsWith('HS')) {
      if (!options.secret) {
        throw new Error('请提供密钥以验证对称加密算法')
      }
      key = new TextEncoder().encode(options.secret)
    } else {
      if (!options.publicKey) {
        throw new Error('请提供公钥以验证非对称加密算法')
      }
      key = await importSPKI(options.publicKey, algorithm)
    }

    try {
      await jwtVerify(token, key)
      return {
        valid: true,
        message: '签名验证通过，Token 有效',
      }
    } catch {
      return {
        valid: false,
        message: '签名验证失败，请检查密钥或 Token 是否被篡改',
      }
    }
  },

  /**
   * 生成 JWT 令牌
   * @param {Record<string, unknown>} payload - JWT 载荷数据
   * @param {JwtGenerateOptions} options - 生成选项
   * @returns {Promise<string>} 生成的 JWT 令牌字符串
   * @throws {Error} 当缺少必要参数时抛出错误
   * @example
   * await jwt.generate({ userId: '123' }, {
   *   algorithm: 'HS256',
   *   secret: 'your-secret-key'
   * })
   */
  generate: async (
    payload: Record<string, unknown>,
    options: JwtGenerateOptions,
  ): Promise<string> => {
    let key: Uint8Array | CryptoKey

    if (options.algorithm.startsWith('HS') || options.algorithm === 'none') {
      if (!options.secret) {
        throw new Error('请提供签名密钥')
      }
      key = new TextEncoder().encode(options.secret)
    } else {
      if (!options.privateKey) {
        throw new Error('请提供私钥以生成非对称加密算法的 JWT')
      }
      key = await importPKCS8(options.privateKey, options.algorithm)
    }

    const cleanPayload = JSON.parse(JSON.stringify(payload))
    const headerWithoutAlg = options.header ? { ...options.header } : {}
    delete headerWithoutAlg.alg

    let jwt = new SignJWT(cleanPayload).setProtectedHeader({
      alg: options.algorithm,
      ...headerWithoutAlg,
      typ: 'JWT',
    })

    if (typeof cleanPayload.exp === 'number') {
      jwt = jwt.setExpirationTime(cleanPayload.exp)
    }
    if (typeof cleanPayload.iat === 'number') {
      jwt = jwt.setIssuedAt(cleanPayload.iat)
    }
    if (typeof cleanPayload.nbf === 'number') {
      jwt = jwt.setNotBefore(cleanPayload.nbf)
    }
    if (typeof cleanPayload.iss === 'string') {
      jwt = jwt.setIssuer(cleanPayload.iss)
    }
    if (typeof cleanPayload.sub === 'string') {
      jwt = jwt.setSubject(cleanPayload.sub)
    }
    if (typeof cleanPayload.aud === 'string' || Array.isArray(cleanPayload.aud)) {
      jwt = jwt.setAudience(cleanPayload.aud)
    }

    return await jwt.sign(key)
  },
}

/**
 * 加密工具默认导出
 */
export default {
  base64,
  url,
  md5: md5Hash,
  sha,
  ripemd,
  hmac,
  jwt,
}
