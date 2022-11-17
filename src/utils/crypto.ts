import { enc, AES, mode, pad } from 'crypto-js'
import CryptoJS from 'crypto-js'
import crypto from 'crypto'

const Utf8 = enc.Utf8
const iv = Utf8.parse('0000000000000000')

export function decrypt(message: string, secretKeyStr: string): string {
  const secretKey = Utf8.parse(secretKeyStr)

  try {
    const messageBuffer = Buffer.from(message, 'hex')
    const messageBase64 = messageBuffer.toString('base64')

    const messageBytes = AES.decrypt(messageBase64, secretKey, {
      iv,
      mode: mode.CBC,
      padding: pad.Pkcs7,
    })

    return messageBytes.toString(Utf8)
  } catch {
    return message
  }
}

export function encrypt(message: string, secretKeyStr: string): string {
  const messageWordArray = Utf8.parse(message)
  const secretKey = Utf8.parse(secretKeyStr)

  const encrypted = AES.encrypt(messageWordArray, secretKey, {
    iv,
    mode: mode.CBC,
    padding: pad.Pkcs7,
  })
  const _encryptedBuf = Buffer.from(encrypted.toString(), 'base64')

  return _encryptedBuf.toString('hex')
}

export function ecdhDecrypt(message: string, privateKeyStr: string, publicKeyStr: string): string {
  const secretKey = _createEcdhSecret(privateKeyStr, publicKeyStr)
  const messageBytes = AES.decrypt(message, secretKey)

  return messageBytes.toString(enc.Utf8)
}

export function ecdhEncrypt(message: string, privateKeyStr: string, publicKeyStr: string): string {
  const secretKey = _createEcdhSecret(privateKeyStr, publicKeyStr)

  return AES.encrypt(message, secretKey).toString()
}

function _createEcdhSecret(privateKeyStr: string, publicKeyStr: string): string {
  const ECDH = crypto.createECDH('secp256k1')
  ECDH.setPrivateKey(privateKeyStr, 'hex')

  return ECDH.computeSecret(publicKeyStr, 'hex', 'hex')
}
