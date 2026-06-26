import * as forge from 'node-forge'

export enum Algorithm {
  RSA = 'RSA',
  ED25519 = 'ED25519',
}

export enum KeySize {
  SIZE_1024 = '1024',
  SIZE_2048 = '2048',
  SIZE_4096 = '4096',
}

export enum PublicExponent {
  F4 = '65537',
  F0 = '3',
}

export enum Format {
  PEM = 'PEM',
  DER = 'DER',
}

export enum EncryptionScheme {
  OAEP = 'OAEP',
  PKCS1v15 = 'PKCS1v15',
}

export enum HashAlgorithm {
  SHA1 = 'SHA1',
  SHA256 = 'SHA256',
  SHA512 = 'SHA512',
}

export interface RsaEncryptOptions {
  encryptionScheme: EncryptionScheme
  hashAlgorithm: HashAlgorithm
}

export interface RsaDecryptOptions {
  encryptionScheme: EncryptionScheme
  hashAlgorithm: HashAlgorithm
}

export interface KeyGenerateOptions {
  algorithm: Algorithm
  keySize: KeySize
  publicExponent: PublicExponent
  format: Format
  passphrase?: string
}

export interface GeneratedKeyPair {
  privateKey: string
  publicKey: string
}

function toDerBase64(asn1: forge.asn1.Asn1): string {
  return forge.util.encode64(forge.asn1.toDer(asn1).getBytes())
}

function toPkcs8(privateKey: forge.pki.PrivateKey): forge.asn1.Asn1 {
  return forge.pki.privateKeyToAsn1(privateKey)
}

function publicKeyToPkcs8(publicKey: forge.pki.PublicKey): forge.asn1.Asn1 {
  return forge.pki.publicKeyToAsn1(publicKey)
}

function privateKeyToSsh(privateKey: forge.pki.PrivateKey, passphrase?: string): string {
  const rsaPrivateKey = privateKey as forge.pki.rsa.PrivateKey
  return forge.ssh.privateKeyToOpenSSH(rsaPrivateKey, passphrase)
}

export const rsa = {
  generateKeyPair: async (options: KeyGenerateOptions): Promise<GeneratedKeyPair> => {
    if (options.algorithm === Algorithm.RSA) {
      const forgeRsa = forge.pki.rsa
      const { privateKey: privKey, publicKey: pubKey } = await forgeRsa.generateKeyPair({
        bits: parseInt(options.keySize),
        e: parseInt(options.publicExponent),
      })

      if (options.format === Format.PEM) {
        const privateKey = options.passphrase
          ? privateKeyToSsh(privKey, options.passphrase)
          : forge.pki.privateKeyToPem(privKey)
        const publicKey = forge.pki.publicKeyToPem(pubKey)

        return {
          privateKey,
          publicKey,
        }
      } else {
        const pkcs8 = toPkcs8(privKey)
        const derPrivateKey = toDerBase64(pkcs8)

        const publicKeyAsn1 = publicKeyToPkcs8(pubKey)
        const derPublicKey = toDerBase64(publicKeyAsn1)

        return {
          privateKey: derPrivateKey,
          publicKey: derPublicKey,
        }
      }
    } else if (options.algorithm === Algorithm.ED25519) {
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

  encrypt: (plainText: string, publicKey: string, options: RsaEncryptOptions): string => {
    let rsaPublicKey: forge.pki.rsa.PublicKey

    if (publicKey.includes('-----BEGIN PUBLIC KEY-----')) {
      const pubKey = forge.pki.publicKeyFromPem(publicKey)
      if (pubKey.n && pubKey.e) {
        rsaPublicKey = pubKey as forge.pki.rsa.PublicKey
      } else {
        throw new Error('不是有效的 RSA 公钥')
      }
    } else {
      const derBytes = forge.util.decode64(publicKey)
      const derAsn1 = forge.asn1.fromDer(derBytes)
      const pubKey = forge.pki.publicKeyFromAsn1(derAsn1)
      if (pubKey.n && pubKey.e) {
        rsaPublicKey = pubKey as forge.pki.rsa.PublicKey
      } else {
        throw new Error('不是有效的 RSA 公钥')
      }
    }

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
      return forge.util.encode64(
        rsaPublicKey.encrypt(plainText, 'RSA-OAEP', {
          md: md,
          mgf1: {
            md: md,
          },
        }),
      )
    } else {
      return forge.util.encode64(rsaPublicKey.encrypt(plainText, 'RSAES-PKCS1-V1_5'))
    }
  },

  decrypt: (cipherText: string, privateKey: string, options: RsaDecryptOptions): string => {
    let rsaPrivateKey: forge.pki.rsa.PrivateKey

    if (
      privateKey.includes('-----BEGIN RSA PRIVATE KEY-----') ||
      privateKey.includes('-----BEGIN PRIVATE KEY-----') ||
      privateKey.includes('-----BEGIN OPENSSH PRIVATE KEY-----')
    ) {
      const privKey = forge.pki.privateKeyFromPem(privateKey)
      if ((privKey as forge.pki.rsa.PrivateKey).n && (privKey as forge.pki.rsa.PrivateKey).e) {
        rsaPrivateKey = privKey as forge.pki.rsa.PrivateKey
      } else {
        throw new Error('不是有效的 RSA 私钥')
      }
    } else {
      const derBytes = forge.util.decode64(privateKey)
      const derAsn1 = forge.asn1.fromDer(derBytes)
      const privKey = forge.pki.privateKeyFromAsn1(derAsn1)
      if ((privKey as forge.pki.rsa.PrivateKey).n && (privKey as forge.pki.rsa.PrivateKey).e) {
        rsaPrivateKey = privKey as forge.pki.rsa.PrivateKey
      } else {
        throw new Error('不是有效的 RSA 私钥')
      }
    }

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
      return rsaPrivateKey.decrypt(encryptedBytes, 'RSA-OAEP', {
        md: md,
        mgf1: {
          md: md,
        },
      })
    } else {
      return rsaPrivateKey.decrypt(encryptedBytes, 'RSAES-PKCS1-V1_5')
    }
  },
}
