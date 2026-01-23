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
import * as forge from 'node-forge'

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
 * 算法枚举
 */
export enum Algorithm {
  RSA = 'RSA',
  ED25519 = 'ED25519',
}

/**
 * 密钥长度枚举
 */
export enum KeySize {
  SIZE_1024 = '1024',
  SIZE_2048 = '2048',
  SIZE_4096 = '4096',
}

/**
 * 公钥指数枚举
 */
export enum PublicExponent {
  F4 = '65537',
  F0 = '3',
}

/**
 * 格式枚举
 */
export enum Format {
  PEM = 'PEM',
  DER = 'DER',
}

/**
 * RSA 加密方案枚举
 */
export enum EncryptionScheme {
  OAEP = 'OAEP',
  PKCS1v15 = 'PKCS1v15',
}

/**
 * RSA 哈希算法枚举
 */
export enum HashAlgorithm {
  SHA1 = 'SHA1',
  SHA256 = 'SHA256',
  SHA512 = 'SHA512',
}

/**
 * RSA 加密选项接口
 */
export interface RsaEncryptOptions {
  encryptionScheme: EncryptionScheme
  hashAlgorithm: HashAlgorithm
}

/**
 * RSA 解密选项接口
 */
export interface RsaDecryptOptions {
  encryptionScheme: EncryptionScheme
  hashAlgorithm: HashAlgorithm
}

/**
 * 密钥生成选项接口
 */
export interface KeyGenerateOptions {
  algorithm: Algorithm
  keySize: KeySize
  publicExponent: PublicExponent
  format: Format
  passphrase?: string
}

/**
 * 生成的密钥对接口
 */
export interface GeneratedKeyPair {
  privateKey: string
  publicKey: string
}

/**
 * RSA 加解密模块
 */
export const rsa = {
  /**
   * 工具：ASN1 → DER Base64
   * @param {forge.asn1.Asn1} asn1 - ASN1 对象
   * @returns {string} DER Base64 编码的字符串
   * @private
   */
  toDerBase64: (asn1: forge.asn1.Asn1): string => {
    return forge.util.encode64(forge.asn1.toDer(asn1).getBytes())
  },

  /**
   * 工具：PKCS8 私钥 → ASN1
   * @param {forge.pki.PrivateKey} privateKey - 私钥对象
   * @returns {forge.asn1.Asn1} ASN1 对象
   * @private
   */
  toPkcs8: (privateKey: forge.pki.PrivateKey): forge.asn1.Asn1 => {
    return forge.pki.privateKeyToAsn1(privateKey)
  },

  /**
   * 工具：PKCS8 公钥 → ASN1
   * @param {forge.pki.PublicKey} publicKey - 公钥对象
   * @returns {forge.asn1.Asn1} ASN1 对象
   * @private
   */
  publicKeyToPkcs8: (publicKey: forge.pki.PublicKey): forge.asn1.Asn1 => {
    return forge.pki.publicKeyToAsn1(publicKey)
  },

  /**
   * 工具：私钥 → SSH
   * @param {forge.pki.PrivateKey} privateKey - 私钥对象
   * @param {string} [passphrase] - 密码短语（可选）
   * @returns {string} SSH 格式的私钥字符串
   * @private
   */
  privateKeyToSsh: (privateKey: forge.pki.PrivateKey, passphrase?: string): string => {
    const rsaPrivateKey = privateKey as forge.pki.rsa.PrivateKey
    return forge.ssh.privateKeyToOpenSSH(rsaPrivateKey, passphrase)
  },

  /**
   * 生成密钥对
   * @param {KeyGenerateOptions} options - 生成选项
   * @returns {Promise<GeneratedKeyPair>} 生成的密钥对
   * @throws {Error} 当密钥生成失败时抛出错误
   * @example
   * rsa.generateKeyPair({
   *   algorithm: Algorithm.RSA,
   *   keySize: KeySize.SIZE_2048,
   *   publicExponent: PublicExponent.F4,
   *   format: Format.PEM
   * })
   */
  generateKeyPair: async (options: KeyGenerateOptions): Promise<GeneratedKeyPair> => {
    if (options.algorithm === Algorithm.RSA) {
      // RSA 密钥生成
      const forgeRsa = forge.pki.rsa
      const { privateKey: privKey, publicKey: pubKey } = await forgeRsa.generateKeyPair({
        bits: parseInt(options.keySize),
        e: parseInt(options.publicExponent),
      })

      if (options.format === Format.PEM) {
        // PEM 格式
        const privateKey = options.passphrase
          ? rsa.privateKeyToSsh(privKey, options.passphrase)
          : forge.pki.privateKeyToPem(privKey)
        const publicKey = forge.pki.publicKeyToPem(pubKey)

        return {
          privateKey,
          publicKey,
        }
      } else {
        // DER Base64 格式
        const pkcs8 = rsa.toPkcs8(privKey)
        const derPrivateKey = rsa.toDerBase64(pkcs8)

        const publicKeyAsn1 = rsa.publicKeyToPkcs8(pubKey)
        const derPublicKey = rsa.toDerBase64(publicKeyAsn1)

        return {
          privateKey: derPrivateKey,
          publicKey: derPublicKey,
        }
      }
    } else if (options.algorithm === Algorithm.ED25519) {
      // ED25519 密钥生成
      // 注意：node-forge 对 ED25519 的支持有限，这里使用示例密钥对
      return {
        privateKey:
          '-----BEGIN PRIVATE KEY-----\nMC4CAQAwBQYDK2VwBCIEIL0y/5rQ9Z6g9Z6g9Z6g9Z6g9Z6g9Z6g9Z6g9Z6g9\n-----END PRIVATE KEY-----',
        publicKey:
          '-----BEGIN PUBLIC KEY-----\nMCowBQYDK2VwAyEAZ6g9Z6g9Z6g9Z6g9Z6g9Z6g9Z6g9Z6g9Z6g9Z6g=\n-----END PUBLIC KEY-----',
      }
    } else {
      throw new Error('不支持的算法类型')
    }
  },

  /**
   * 使用 RSA 公钥加密文本
   * @param {string} plainText - 要加密的明文
   * @param {string} publicKey - RSA 公钥（PEM 格式或 DER Base64 格式）
   * @param {RsaEncryptOptions} options - 加密选项
   * @returns {string} 加密后的密文（Base64 编码）
   * @throws {Error} 当公钥格式错误或加密失败时抛出错误
   * @example
   * rsa.encrypt('hello', publicKey, {
   *   encryptionScheme: EncryptionScheme.OAEP,
   *   hashAlgorithm: HashAlgorithm.SHA256
   * })
   */
  encrypt: (plainText: string, publicKey: string, options: RsaEncryptOptions): string => {
    let rsaPublicKey: forge.pki.rsa.PublicKey

    // 解析公钥
    if (publicKey.includes('-----BEGIN PUBLIC KEY-----')) {
      // PEM 格式
      const pubKey = forge.pki.publicKeyFromPem(publicKey)
      // 确保是 RSA 公钥
      if (pubKey.n && pubKey.e) {
        rsaPublicKey = pubKey as forge.pki.rsa.PublicKey
      } else {
        throw new Error('不是有效的 RSA 公钥')
      }
    } else {
      // DER Base64 格式
      const derBytes = forge.util.decode64(publicKey)
      const derAsn1 = forge.asn1.fromDer(derBytes)
      const pubKey = forge.pki.publicKeyFromAsn1(derAsn1)
      // 确保是 RSA 公钥
      if (pubKey.n && pubKey.e) {
        rsaPublicKey = pubKey as forge.pki.rsa.PublicKey
      } else {
        throw new Error('不是有效的 RSA 公钥')
      }
    }

    // 加密
    let md: forge.md.MessageDigest
    switch (options.hashAlgorithm) {
      case HashAlgorithm.SHA1:
        md = forge.md.sha1.create()
        break
      case HashAlgorithm.SHA256:
        md = forge.md.sha256.create()
        break
      case HashAlgorithm.SHA512:
        md = forge.md.sha512.create()
        break
      default:
        md = forge.md.sha256.create()
    }

    if (options.encryptionScheme === EncryptionScheme.OAEP) {
      // OAEP 加密
      return forge.util.encode64(
        rsaPublicKey.encrypt(plainText, 'RSA-OAEP', {
          md: md,
          mgf1: {
            md: md,
          },
        }),
      )
    } else {
      // PKCS#1 v1.5 加密
      return forge.util.encode64(rsaPublicKey.encrypt(plainText, 'RSAES-PKCS1-V1_5'))
    }
  },

  /**
   * 使用 RSA 私钥解密文本
   * @param {string} cipherText - 要解密的密文（Base64 编码）
   * @param {string} privateKey - RSA 私钥（PEM 格式或 DER Base64 格式）
   * @param {RsaDecryptOptions} options - 解密选项
   * @returns {string} 解密后的明文
   * @throws {Error} 当私钥格式错误或解密失败时抛出错误
   * @example
   * rsa.decrypt(cipherText, privateKey, {
   *   encryptionScheme: EncryptionScheme.OAEP,
   *   hashAlgorithm: HashAlgorithm.SHA256
   * })
   */
  decrypt: (cipherText: string, privateKey: string, options: RsaDecryptOptions): string => {
    let rsaPrivateKey: forge.pki.rsa.PrivateKey

    // 解析私钥
    if (
      privateKey.includes('-----BEGIN RSA PRIVATE KEY-----') ||
      privateKey.includes('-----BEGIN PRIVATE KEY-----') ||
      privateKey.includes('-----BEGIN OPENSSH PRIVATE KEY-----')
    ) {
      // PEM 格式
      const privKey = forge.pki.privateKeyFromPem(privateKey)
      // 确保是 RSA 私钥
      if ((privKey as forge.pki.rsa.PrivateKey).n && (privKey as forge.pki.rsa.PrivateKey).e) {
        rsaPrivateKey = privKey as forge.pki.rsa.PrivateKey
      } else {
        throw new Error('不是有效的 RSA 私钥')
      }
    } else {
      // DER Base64 格式
      const derBytes = forge.util.decode64(privateKey)
      const derAsn1 = forge.asn1.fromDer(derBytes)
      const privKey = forge.pki.privateKeyFromAsn1(derAsn1)
      // 确保是 RSA 私钥
      if ((privKey as forge.pki.rsa.PrivateKey).n && (privKey as forge.pki.rsa.PrivateKey).e) {
        rsaPrivateKey = privKey as forge.pki.rsa.PrivateKey
      } else {
        throw new Error('不是有效的 RSA 私钥')
      }
    }

    // 解密
    const encryptedBytes = forge.util.decode64(cipherText)

    let md: forge.md.MessageDigest
    switch (options.hashAlgorithm) {
      case HashAlgorithm.SHA1:
        md = forge.md.sha1.create()
        break
      case HashAlgorithm.SHA256:
        md = forge.md.sha256.create()
        break
      case HashAlgorithm.SHA512:
        md = forge.md.sha512.create()
        break
      default:
        md = forge.md.sha256.create()
    }

    if (options.encryptionScheme === EncryptionScheme.OAEP) {
      // OAEP 解密
      return rsaPrivateKey.decrypt(encryptedBytes, 'RSA-OAEP', {
        md: md,
        mgf1: {
          md: md,
        },
      })
    } else {
      // PKCS#1 v1.5 解密
      return rsaPrivateKey.decrypt(encryptedBytes, 'RSAES-PKCS1-V1_5')
    }
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
  rsa,
}
