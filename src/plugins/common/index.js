import { AES } from 'crypto-es/lib/aes.js'
import { Utf8 } from 'crypto-es/lib/core.js'
import CryptoJS from 'crypto-js'
import { CBC, Pkcs7 } from 'crypto-es/lib/cipher-core.js'
import ShowmoneyProvider from './showmoneyProvider'
import { englishWords } from './word'
const Ripemd128 = require('ripemd128-js/ripemd128.js')
const bip39 = require('bip39')
const mvc = require('mvc-lib')
const bsv = mvc
const Mnemonic = require('mvc-lib/mnemonic')
const ECIES = require('mvc-lib/ecies')

const Message = require('mvc-lib/message')
const metaIdTag = `MetaID`
const IsEncrypt = {
  Yes: 1,
  No: 0,
}
const baseApi = process.env.VUE_APP_BASEAPI
export const DEFAULTS = {
  feeb: 0.05,
  minAmount: 546,
}

export const Network = {
  mainnet: 'mainnet',
  testnet: 'testnet',
}

export const encrypt = (word, keyStr) => {
  let encrypted = CryptoJS.AES.encrypt(word, CryptoJS.enc.Utf8.parse(keyStr), {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7,
  })
  return encrypted.toString()
}

export const decrypt = (word, keyStr) => {
  let decrypt = CryptoJS.AES.decrypt(word, CryptoJS.enc.Utf8.parse(keyStr), {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7,
  })
  return decrypt.toString(CryptoJS.enc.Utf8)
}

export const isNaturalNumber = n => {
  n = n.toString()
  const n1 = Math.abs(Number(n))
  const n2 = parseInt(n, 10)
  return !isNaN(n1) && n2 === n1 && n1.toString() === n
}

export const isBtcAddress = value => {
  return /^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$/.test(value)
}

// 加密助记词
export const encryptMnemonic = (mnemonic, password) => {
  const mnemonicStr = mnemonic.split(' ').join(',')
  return aesEncrypt(mnemonicStr, password)
}

// 解密助记词
export const decryptMnemonic = (encryptedMnemonic, password) => {
  const mnemonic = aesDecrypt(encryptedMnemonic, password)
  return mnemonic.split(',').join(' ')
}

// AES 解密
export const aesDecrypt = (encryptedStr, key) => {
  key = key.length > 16 ? key.padEnd(32, '0') : key.padEnd(16, '0')
  const iv = '0000000000000000',
    utf8Key = Utf8.parse(key),
    utf8Iv = Utf8.parse(iv)
  let bufferData
  try {
    bufferData = Buffer.from(encryptedStr.toString(), 'hex')
  } catch {
    return encryptedStr
  }
  const base64Str = bufferData.toString('base64')
  const bytes = AES.decrypt(base64Str, utf8Key, {
    iv: utf8Iv,
    mode: CBC,
    padding: Pkcs7,
  })
  return bytes.toString(Utf8)
}

// AES 加密
export const aesEncrypt = (str, key) => {
  // 密码长度不足 16/32 位用 0 补够位数
  key = key.length > 16 ? key.padEnd(32, '0') : key.padEnd(16, '0')
  const iv = '0000000000000000'
  const utf8Str = Utf8.parse(str)
  const utf8Key = Utf8.parse(key)
  const utf8Iv = Utf8.parse(iv)
  const cipherText = AES.encrypt(utf8Str, utf8Key, {
    iv: utf8Iv,
    mode: CBC,
    padding: Pkcs7,
  })
  const bufferData = Buffer.from(cipherText.toString(), 'base64')
  const res = bufferData.toString('hex')
  return res
}

export const hdWalletFromMnemonic = mnemonic => {
  const HDseed = Mnemonic.fromString(mnemonic)
  const HDwallet = HDseed.toHDPrivateKey().deriveChild("m/44'/236'/0'")
  console.log('HDwallet', HDwallet)
  return HDwallet
}

export const createMnemonic = (address, pw) => {
  const ppBuffer = Buffer.from([address, pw].join('/'))
  const ppHex = bsv.crypto.Hash.sha256(ppBuffer).toString('hex')
  let hex
  let mnemonic
  hex = Buffer.from(ppHex.toLowerCase(), 'hex').toString('hex')
  hex = Ripemd128(hex).toString()
  mnemonic = bip39.entropyToMnemonic(hex, englishWords)
  return mnemonic
}

export const signature = (message, privateKey) => {
  const hash = bsv.crypto.Hash.sha256(Buffer.from(message))
  const sign = bsv.crypto.ECDSA.sign(hash, bsv.PrivateKey(privateKey))
  return sign.toBuffer().toString('base64')
}

export class HdWallet {
  bsvnet = 'mainnet'
  wallet
  provider
  _root
  keyPathMap = {
    Root: {
      keyPath: '0/0',
      parentKeyPath: '0/0',
    },
    Info: {
      keyPath: '0/1',
      parentKeyPath: '0/0',
    },
    name: {
      keyPath: '0/2',
      parentKeyPath: '0/1',
    },
    email: {
      keyPath: '0/3',
      parentKeyPath: '0/1',
    },
    phone: {
      keyPath: '0/4',
      parentKeyPath: '0/1',
    },
    avatar: {
      keyPath: '0/5',
      parentKeyPath: '0/1',
    },
    bio: {
      keyPath: '0/6',
      parentKeyPath: '0/1',
    },
    Protocols: {
      keyPath: '0/2',
      parentKeyPath: '0/0',
    },
  }
  usedPublicekeyAddress = []
  get rootAddress() {
    return this._root.toAddress(Network.mainnet).toString()
  }
  constructor(wallet) {
    this.wallet = wallet
    const root = wallet.deriveChild(0).deriveChild(0).privateKey
    this._root = root
    this.provider = new ShowmoneyProvider(baseApi)
  }

  async getMetaIdInfo() {
    let metaIdInfo = {
      metaId: '',
      infoTxId: '',
      protocolTxId: '',
      name: '',
      phone: '',
      email: '',
    }
    const metaId = await this.provider.getMetaId(this.rootAddress)
    if (metaId) {
      const info = await this.provider.getMetaIdInfo(metaId)
      metaIdInfo = {
        ...metaIdInfo,
        ...info,
      }
    }
    return metaIdInfo
  }

  initMetaIdNode(account) {
    return new Promise(async (resolve, reject) => {
      try {
        const metaIdInfo = await this.getMetaIdInfo()
        metaIdInfo.pubKey = this._root.toPublicKey().toString()
        //  检查 metaidinfo 是否完整
        if (metaIdInfo.metaId && metaIdInfo.infoTxId && metaIdInfo.protocolTxId) {
          console.log('metaidinfo 完整')
          resolve(metaIdInfo)
        } else {
          let utxos = []
          const hexTxs = []
          const infoAddress = this.getPathPrivateKey(this.keyPathMap.Info.keyPath)
          utxos = await this.provider.getUtxos(this.wallet.xpubkey.toString())
          // 初始化 metaId

          if (!metaIdInfo.metaId) {
            // TODO: 尝试获始资金
            if (!utxos.length) {
              const initUtxo = await this.provider.getInitAmount({
                address: this.rootAddress,
                xpub: this.wallet.xpubkey.toString(),
                userName: account.userName,
                accessKey: account.accessKey,
              })
              utxos = [initUtxo]
            }

            let outputs = []

            const rootTx = await this.createNode({
              nodeName: 'Root',
              metaIdTag: metaIdTag,
              data: 'NULL',
              dataType: 'NULL',
              encoding: 'NULL',
              utxos: utxos,
              outputs: outputs,
            })
            hexTxs.push(rootTx.hex)
            metaIdInfo.metaId = rootTx.txId
            const newUtxo = await this.utxoFromTxChange(rootTx.raw, {
              addressType: 0,
              addressIndex: 0,
            })
            if (newUtxo) {
              utxos = [newUtxo]
            }
          }

          // 初始化 metaId
          if (!metaIdInfo.protocolTxId) {
            const protocolTx = await this.createNode({
              nodeName: 'Protocols',
              parentTxId: metaIdInfo.metaId,
              metaIdTag: metaIdTag,
              data: 'NULL',
              version: 'NULL',
              utxos: utxos,
            })
            hexTxs.push(protocolTx.hex)
            metaIdInfo.protocolTxId = protocolTx.txId
            const newUtxo = await this.utxoFromTxChange(protocolTx.raw, {
              addressType: 0,
              addressIndex: 0,
            })
            if (newUtxo) utxos = [newUtxo]
          }

          // 初始化 infoTxId
          if (!metaIdInfo.infoTxId) {
            const infoTx = await this.createNode({
              nodeName: 'Info',
              parentTxId: metaIdInfo.metaId,
              metaIdTag: metaIdTag,
              data: 'NULL',
              version: 'NULL',
              utxos: utxos,
              change: infoAddress.publicKey.toAddress().toString(),
            })
            console.log('Info', infoTx)
            hexTxs.push(infoTx.hex)
            metaIdInfo.infoTxId = infoTx.txId
            const newUtxo = await this.utxoFromTxChange(infoTx.raw, {
              addressType: 0,
              addressIndex: 1,
            })
            if (newUtxo) utxos = [newUtxo]
          }

          // 初始化 name
          if (!metaIdInfo.name) {
            const nameTx = await this.createNode({
              nodeName: 'name',
              parentTxId: metaIdInfo.infoTxId,
              metaIdTag: metaIdTag,
              data: account.name,
              utxos: utxos,
              change: infoAddress.publicKey.toAddress().toString(),
            })
            console.log('Info', nameTx)
            hexTxs.push(nameTx.hex)
            metaIdInfo.name = account.name
            const newUtxo = await this.utxoFromTxChange(nameTx.raw, {
              addressType: 0,
              addressIndex: 1,
            })
            if (newUtxo) utxos = [newUtxo]
          }
          // const EthTx = await this.createBrfcNode({})

          let errorMsg
          // 广播

          for (let i = 0; i < hexTxs.length; i++) {
            try {
              const tx = hexTxs[i]
              await this.provider.broadcast(tx)
            } catch (error) {
              errorMsg = error
            }
            if (errorMsg) {
              break
            }
          }

          if (errorMsg) {
            throw new Error(errorMsg.message)
          } else {
            console.log('metaIdInfo', metaIdInfo)

            resolve(metaIdInfo)
          }
        }
      } catch (error) {
        reject(error)
      }
    })
  }

  async createNode({
    nodeName,
    parentAddress,
    parentKeyPath,
    keyPath,
    payTo = [],
    utxos = [],
    change,
    metaIdTag = 'metaid',
    parentTxId = 'NULL',
    data = 'NULL',
    encrypt = IsEncrypt.No,
    version = '1.0.1',
    dataType = 'text/plain',
    encoding = 'UTF-8',
    outputs = [],
  }) {
    return new Promise(async (resolve, reject) => {
      try {
        if (!nodeName) {
          throw new Error('Parameter Error: NodeName can not empty')
        }
        let nodeAddress,
          parentUtxos = []
        let privateKey = this.getPathPrivateKey('0/0')
        let nodeKeyPath
        // TODO: 自定义节点支持
        if (this.keyPathMap[nodeName]) {
          const nodeInfo = this.keyPathMap[nodeName]
          parentKeyPath = nodeInfo.parentKeyPath
          const nodeKeyPath = nodeInfo.keyPath
          parentAddress = this.createAddress(parentKeyPath)
          nodeAddress = this.createAddress(nodeKeyPath)
          privateKey = this.getPathPrivateKey(nodeKeyPath)
        } else if (keyPath && parentAddress) {
          nodeKeyPath = keyPath
          nodeAddress = this.createAddress(keyPath)
          // 查找 parentKeyPath
          try {
            const pathInfo = await this.provider.getPathWithNetWork({
              address: parentAddress,
              xpub: this.wallet.xpubkey.toString(),
            })
            parentKeyPath = `${pathInfo.addressType}/${pathInfo.addressIndex}`
          } catch (error) {
            if (parentKeyPath === '-1/-1') {
              const protocolAddr = this.createAddress(this.keyPathMap.Protocols.keyPath).address
              if (parentAddress === protocolAddr) {
                parentKeyPath = this.keyPathMap.Protocols.keyPath
                this._addressList.push({
                  Address: protocolAddr,
                  Path: parentKeyPath,
                })
              }
            }
          }
        } else {
          throw new Error('Unsupported Node Type')
        }
        // 数据加密
        if (+encrypt === 1) {
          data = this.eciesEncryptData(data, privateKey, privateKey.publicKey).toString('hex')
        } else {
          if (encoding.toLowerCase() === 'binary') {
            data = Buffer.from(data.toString('hex'), 'hex')
          }
        }

        const scriptPlayload = [
          'meta',
          nodeAddress.publicKey.toString(),
          parentTxId,
          metaIdTag.toLowerCase(),
          nodeName,
          data,
          encrypt.toString(),
          version,
          dataType,
          encoding,
        ]

        console.log('scriptPlayload', scriptPlayload)

        const makeTxOptions = {
          from: [],
          utxos: utxos,
          opReturn: scriptPlayload,
          change: change,
          outputs,
          payTo,
        }

        // TODO: 父节点 utxo 管理
        // if (parentTxId !== 'NULL' && !parentAddress) {
        //   console.log('get parent utxos')
        // } else {
        //   throw new Error("Cant't get parent address")
        // }
        const nodeTx = await this.makeTx(makeTxOptions)
        if (nodeTx) {
          resolve({
            raw: nodeTx,
            hex: nodeTx.toString(),
            txId: nodeTx.id,
            nodeAddress: nodeAddress?.address,
          })
        }
      } catch (error) {
        reject(error)
      }
    })
  }

  // 创建协议节点
  createBrfcNode(params) {
    return new Promise(async (resolve, reject) => {
      try {
        if (!params.useFeeb) params.useFeeb = DEFAULTS.feeb
        if (!params.payTo) params.payTo = []
        if (params.needConfirm === undefined) params.needConfirm = true
        if (params.isBroadcast === undefined) params.isBroadcast = true

        let protocol = await this.getProtocolInfo(
          params.nodeName,
          params.parentTxId,
          'ethBlinding'
          // params.data
        )

        //  处理根节点
        if (protocol) {
          resolve({
            address: protocol.address,
            txId: protocol.txId,
            addressType: protocol.addressType,
            addressIndex: protocol.addressIndex,
          })
          // 已存在根节点
        } else {
          // 不存在根节点
          if (!params.keyPath) {
            const newBfrcNodekeyPath = await this.getKeyPath({
              parentTxid: params.parentTxId,
            })
            if (newBfrcNodekeyPath) {
              params.keyPath = newBfrcNodekeyPath.join('/')
            }
          }
          params.utxos = await this.provider.getUtxos(this.wallet.xpubkey.toString())
          const aa = await this.getPathPrivateKey(this.keyPathMap.Protocols.keyPath)
          const protocolAddress = aa.publicKey.toAddress().toString()

          params.change = protocolAddress
          params.parentAddress = protocolAddress
          const protocolRoot = await this.createNode(params)
          console.log('protocolRoot', protocolRoot)

          if (protocolRoot) {
            // @ts-ignore
            protocol = {
              address: protocolRoot.nodeAddress,
              txId: protocolRoot.txId,
              addressType: parseInt(params.keyPath.split('/')[0]),
              addressIndex: parseInt(params.keyPath.split('/')[1]),
              // @ts-ignore
              tx: protocolRoot.raw,
            }

            const broadcastRes = await this.provider.broadcast(protocolRoot.hex)
            console.log('broadcastRes', broadcastRes)

            resolve(broadcastRes)
          }
        }

        // if (params.utxos.length < 1) {
        //   reject(Error('用户余额不足'))
        // } else {
        //   const protocol = await this.getProtocolInfo(
        //     params.nodeName,
        //     params.parentTxId,
        //     params.data
        //   )
        //   if (protocol) {
        //     resolve(protocol)
        //   } else {
        //     const res = await this.createNode(params)
        //     if (res) {
        //       if (params.isBroadcast) {
        //         const response = await this.provider.broadcast(res.hex)
        //         if (response?.txid) {
        //           resolve(res)
        //         }
        //       } else {
        //         resolve(res)
        //       }

        //       // this._protocolsTxId = res.data.txId
        //       // 地址已使用，path + 1
        //       // keyPath = [0, Number(keyPath[1]) + 1]
        //       // protocolTypeAddress = res.data.nodeAddress
        //       // protocolTypeTxId = res.data.txId
        //       // usedAmount += Number(res.data.usedAmount) - 546
        //       // // txArray.push(res.data.tran)
        //       // txArray = txArray.concat(res.data.transactionHex)
        //       // txDetail.push({ txId: res.data.txId, amount: res.data.usedAmount })
        //       // utxos = res.data.utxos
        //       // return res
        //     }
        //   }
        // }
      } catch (error) {
        reject(error)
      }
    })
  }

  async getKeyPath(params) {
    return new Promise(async (resolve, reject) => {
      try {
        if (!params.count) params.count = 15
        if (typeof params.count === 'undefined') params.checkOnly = true
        const result = await this.provider.getPulicKeyForNewNode(
          this.wallet.xpubkey.toString(),
          params.parentTxid,
          params.count
        )
        if (result.length > 0) {
          // 过滤掉已使用的地址， 避免重复使用
          const unUseResult = result.filter(
            item => !this.usedPublicekeyAddress.includes(item.address)
          )
          // 标记已使用
          if (unUseResult.length > 0) {
            this.usedPublicekeyAddress.push(unUseResult[0].address)
            resolve(unUseResult[0].path.split('/'))
          } else {
            throw new Error('getPublicKeyForNewNode fail')
          }
        } else {
          throw new Error('getPublicKeyForNewNode fail')
        }
      } catch (error) {
        reject(error)
      }
    })
  }

  async getProtocolInfo(protocolType, protocolsTxId, brfcId) {
    return new Promise(async (resolve, reject) => {
      try {
        const protocols = await this.getProtocols({
          protocolsTxId: protocolsTxId,
          protocolType: protocolType,
        })
        const protocol = protocols.filter(item => {
          return item.nodeName === protocolType && item.data === brfcId
        })[0]
        if (protocol) {
          const protocolInfo = await this.provider.getXpubLiteAddressInfo(
            this.wallet.xpubkey.toString(),
            protocol.address
          )
          if (protocolInfo) {
            if (protocolInfo.addressIndex <= 150) {
              resolve({
                ...protocol,
                ...protocolInfo,
              })
            } else {
              throw new Error('path>150 异常，请联系客服处理')
            }
          }
        } else {
          resolve(null)
        }
      } catch (error) {
        reject(error)
      }
    })
  }

  // 获取协议类型数据
  async getProtocols({ protocolsTxId, protocolType }) {
    return new Promise((resolve, reject) => {
      fetch(baseApi + '/serviceapi/api/v1/protocol/getProtocolDataList', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: JSON.stringify({
            protocolTxId: protocolsTxId,
            nodeName: protocolType,
          }),
        }),
      })
        .then(response => {
          return response.json()
        })
        .then(json => {
          // debugger
          if (json && json.code === 200 && json.result.data) {
            resolve(json.result.data)
          } else {
            reject({
              code: json.code,
              message: json.error,
            })
          }
        })
        .catch(error => {
          reject(error)
        })
    })
  }
  // 根据 path 生成 privateKey
  getPathPrivateKey(keyPath) {
    const privateKey = this.wallet
      .deriveChild(+keyPath.split('/')[0])
      .deriveChild(+keyPath.split('/')[1]).privateKey
    return privateKey
  }

  utxoFromTxChange(tx, params) {
    return new Promise(async (resolve, reject) => {
      try {
        const changeOutPut = tx.outputs[tx._changeIndex]
        if (!params) {
          const addressInfo = await this.provider.getPathWithNetWork({
            address: changeOutPut.script.toAddress().toString(),
            xpub: this.wallet.xpubkey.toString(),
          })
          if (addressInfo) {
            params = {
              addressType: addressInfo.addressType,
              addressIndex: addressInfo.addressIndex,
            }
          }
        }

        resolve({
          address: changeOutPut.script.toAddress().toString(),
          satoshis: changeOutPut.satoshis,
          value: changeOutPut.satoshis,
          amount: changeOutPut.satoshis * 1e-8,
          script: changeOutPut.script.toHex(),
          outputIndex: tx._changeIndex,
          txId: tx.id,
          addressType: params.addressType,
          addressIndex: params.addressIndex,
          xpub: this.wallet.xpubkey.toString(),
        })
      } catch (error) {
        reject(error)
      }
    })
  }

  createAddress(keyPath) {
    const privateKey = this.getPathPrivateKey(keyPath)
    const address = privateKey.toAddress(this.bsvnet).toString()
    return {
      address: address,
      publicKey: privateKey.toPublicKey(),
    }
  }

  /**
   * ECIES 加密
   */
  eciesEncryptData(data, privateKey, publicKey) {
    privateKey = privateKey || this.getPathPrivateKey('0/0')
    publicKey = publicKey || this.getPathPrivateKey('0/0').toPublicKey()
    const ecies = ECIES()
      .privateKey(privateKey)
      .publicKey(publicKey)
    return ecies.encrypt(data)
  }

  async makeTx({
    payTo = [],
    outputs = [],
    from = [],
    change = this.rootAddress,
    opReturn,
    utxos,
    useFeeb = DEFAULTS.feeb,
  }) {
    return new Promise(async (resolve, reject) => {
      try {
        const { tx, amount } = await this.makeTxNotUtxos({
          payTo,
          outputs,
          from,
          change,
          opReturn,
          useFeeb,
        })
        tx.change(change)
        // @ts-ignore
        tx.useFeeb = useFeeb
        // @ts-ignore
        tx.getNeedFee = function() {
          // @ts-ignore
          const amount = Math.ceil(
            // @ts-ignore
            (30 + this._estimateSize() + 182) * this.useFeeb
          )
          // @ts-ignore
          const offerFed = Math.ceil(amount * this.useFeeb)
          // if (amount < minAmount) amount = minAmount
          const total =
            offerFed + amount < bsv.Transaction.DUST_AMOUNT
              ? bsv.Transaction.DUST_AMOUNT + 30
              : offerFed + amount

          return total
        }
        // @ts-ignore
        tx.isNeedChange = function() {
          return (
            // @ts-ignore
            this._getUnspentValue() - this.getNeedFee() >= bsv.Transaction.DUST_AMOUNT
          )
        }
        // @ts-ignore
        tx.getChangeAmount = function() {
          // @ts-ignore
          return this._getUnspentValue() - this.getNeedFee()
        }
        // @ts-ignore
        const fee = Math.ceil(tx._estimateSize() * useFeeb)
        let balance = 0
        // let pickedUtxos: MetasvUtxoTypes[] = []

        // 如果指定了输入 utxos，则计算输入金额
        if (from.length) {
          balance = from.reduce((a, c) => a + c.satoshis, 0)
        }

        console.log('===费用')
        // @ts-ignore
        console.log('fee2', tx._estimateSize() * useFeeb)
        console.log(tx)

        // 如果指定的 utxos 金额不足，则选取其它 utxos 来补充
        if (balance < fee + amount) {
          // @ts-ignore
          const pickUtxosRes = this.pickUtxosByAmount(from, utxos, fee + amount)
          // if (!pickUtxosRes.isEnoughBalance) {
          //   throw new Error('余额不足')
          // }
          for (const utxo of pickUtxosRes.newPickedUtxos) {
            tx.from(utxo)
          }
          from.push(...pickUtxosRes.newPickedUtxos)
        } else {
          tx.from(from)
        }

        // 手续费指定
        // if (tx._getUnspentValue() - (34 + tx._estimateSize()) * useFeeb >= 546 * useFeeb) {
        //   tx.addOutput(
        //     new bsv.Transaction.Output({
        //       satoshis: Math.floor(tx._getUnspentValue() - (34 + tx._estimateSize()) * fee),
        //       script: bsv.Script.fromAddress(changeAddress),
        //     })
        //   )
        // }
        console.log(tx)
        // @ts-ignore
        console.log('fee2', tx._estimateSize() * useFeeb)
        // @ts-ignore
        tx.fee(Math.ceil(tx._estimateSize() * useFeeb))
        const privateKeys = this.getUtxosPrivateKeys(from)
        tx.sign(privateKeys)
        resolve(tx)
      } catch (error) {
        reject(error)
      }
    })
  }

  getUtxosPrivateKeys(utxos) {
    return utxos.map(u => {
      return this.wallet.deriveChild(u.addressType || 0).deriveChild(u.addressIndex || 0).privateKey
    })
  }

  pickUtxosByAmount(pickedUtxos, utxos, amount) {
    let balance = 0
    let unUsedInputs = []
    console.log('amount', amount)

    for (const utxo of utxos) {
      let isPicked = false
      // 排除已经选择的 utxos
      for (const pickedItem of pickedUtxos) {
        if (utxo.txId === pickedItem.txId && utxo.outputIndex === pickedItem.outputIndex) {
          isPicked = true
          break
        }
      }
      if (!isPicked && !utxo.isSpend) {
        unUsedInputs = [...unUsedInputs, utxo]
      }
    }

    // utxos = unUsedInputs

    let isEnoughBalance = false
    const newPickedUtxos = []
    for (const utxo of unUsedInputs) {
      balance += Number(utxo.value)
      newPickedUtxos.push(utxo)
      // 检查是否已经足够，加 200 浮动
      if (balance > amount + DEFAULTS.minAmount + 200) {
        isEnoughBalance = true
        break
      }
    }
    return {
      isEnoughBalance: isEnoughBalance,
      newPickedUtxos: newPickedUtxos,
    }
  }

  async makeTxNotUtxos({
    payTo = [],
    outputs = [],
    from = [],
    change = this.rootAddress,
    opReturn,
    useFeeb = DEFAULTS.feeb,
  }) {
    if (!this.wallet) {
      throw new Error('Wallet uninitialized! (core-makeTx)')
    }
    const tx = new bsv.Transaction()
    tx.feePerKb(useFeeb * 1000)
    let amount = 0
    // 添加 payto
    if (Array.isArray(payTo) && payTo.length) {
      payTo.forEach(item => {
        if (!this.isValidOutput(item)) {
          throw new Error('Output format error.')
        }
        amount += Math.ceil(item.amount)
        tx.to(item.address, item.amount)
      })
    }

    // 添加 opReturn 内容

    if (opReturn) {
      tx.addOutput(
        new bsv.Transaction.Output({
          script: bsv.Script.buildSafeDataOut(opReturn),
          satoshis: 0,
        })
      )
    }

    if (Array.isArray(outputs) && outputs.length) {
      outputs.forEach(output => {
        tx.addOutput(new bsv.Transaction.Output(output))
      })
    }

    tx.from(from)
    return {
      tx,
      amount,
    }
  }

  // 验证交易输出 TODO：地址只验证长度，后续要做合法性验证
  isValidOutput(output) {
    return (
      isNaturalNumber(output.amount) &&
      +output.amount >= DEFAULTS.minAmount &&
      isBtcAddress(output.address)
    )
  }
}
