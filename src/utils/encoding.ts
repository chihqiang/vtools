import Base64 from 'crypto-js/enc-base64'
import Utf8 from 'crypto-js/enc-utf8'

export const base64 = {
  encrypt: (text: string): string => {
    return Base64.stringify(Utf8.parse(text))
  },

  decrypt: (text: string): string => {
    return Utf8.stringify(Base64.parse(text))
  },
}

export const url = {
  encode: (text: string): string => {
    return encodeURIComponent(text)
  },

  decode: (text: string): string => {
    return decodeURIComponent(text)
  },
}
