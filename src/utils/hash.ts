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

const DEFAULT_HMAC_KEY = 'vtools-secret-key'

export const md5Hash = {
  32: (text: string): string => {
    return md5(text).toString().toLowerCase()
  },

  16: (text: string): string => {
    return md5(text).toString().substring(8, 24).toLowerCase()
  },
}

export const sha = {
  sha1: (text: string): string => {
    return sha1(text).toString().toLowerCase()
  },

  sha224: (text: string): string => {
    return sha224(text).toString().toLowerCase()
  },

  sha256: (text: string): string => {
    return sha256(text).toString().toLowerCase()
  },

  sha384: (text: string): string => {
    return sha384(text).toString().toLowerCase()
  },

  sha512: (text: string): string => {
    return sha512(text).toString().toLowerCase()
  },

  sha3: (text: string): string => {
    return sha3(text).toString().toLowerCase()
  },
}

export const ripemd = {
  ripemd160: (text: string): string => {
    return ripemd160(text).toString().toLowerCase()
  },
}

export const hmac = {
  md5: (text: string, key: string = DEFAULT_HMAC_KEY): string => {
    return hmacMd5(text, key).toString().toLowerCase()
  },

  sha1: (text: string, key: string = DEFAULT_HMAC_KEY): string => {
    return hmacSha1(text, key).toString().toLowerCase()
  },

  sha256: (text: string, key: string = DEFAULT_HMAC_KEY): string => {
    return hmacSha256(text, key).toString().toLowerCase()
  },
}
