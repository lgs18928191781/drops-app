import { enc, AES, mode, pad } from 'crypto-js'
import CryptoJS from 'crypto-js'

export function decrypt(message: string, secretKeyStr: string): string {
  const Utf8 = enc.Utf8

  const _iv = '0000000000000000'
  const iv = Utf8.parse(_iv)

  const secretKey = Utf8.parse(secretKeyStr)

  try {
    const messageBuffer = Buffer.from(message, 'hex')
    const messageBase64 = messageBuffer.toString('base64')
    // Decrypt
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

export function decryptMessage2(message, secret_key) {
  let iv = '0000000000000000'
  iv = CryptoJS.enc.Utf8.parse(iv)
  secret_key = CryptoJS.enc.Utf8.parse(secret_key)
  let buff
  try {
    buff = new Buffer.from(message, 'hex')
    let base64data = buff.toString('base64')
    // Decrypt
    var bytes = CryptoJS.AES.decrypt(base64data, secret_key, {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    })
    return bytes.toString(CryptoJS.enc.Utf8)
  } catch {
    return message
  }
}
