import { decodeJwt, SignJWT, jwtVerify, importSPKI, importPKCS8 } from 'jose'

export interface JwtParsedData {
  header: Record<string, unknown>
  payload: Record<string, unknown>
  signature: string
}

export interface JwtVerifyResult {
  valid: boolean
  message: string
}

export interface JwtGenerateOptions {
  algorithm: string
  secret?: string
  publicKey?: string
  privateKey?: string
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

export const jwt = {
  formatFieldName: (field: string): string => {
    return JwtFieldMap[field] || field
  },

  isTimestampField: (field: string): boolean => {
    return ['exp', 'iat', 'nbf'].includes(field)
  },

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
