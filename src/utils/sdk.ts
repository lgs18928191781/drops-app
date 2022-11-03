import {
  AppMsg,
  MetaIdJsRes,
  NftBuyParams,
  NftCancelParams,
  NftSellParams,
  UtxoItem,
} from '@/@types/sdk'
import {
  BaseUtxo,
  CreateNodeRes,
  DEFAULTS,
  HdWallet,
  hdWalletFromAccount,
  MetaIdTag,
  Network,
  NftTransferResult,
  ProtocolOptions,
} from '@/utils/wallet/hd-wallet'
import { decode, encode } from 'js-base64'
import { AttachmentItem } from '@/@types/hd-wallet'
import { router } from '@/router'
import { toClipboard } from '@soerenmartius/vue3-clipboard'
import { isAndroid, isAndroidApp, isIOS, isIosApp } from '@/stores/root'
import { PayToItem } from '@/@types/hd-wallet'
import { CreateBrfcChildNodePayType, IsEncrypt, NodeName } from '@/enum'
import { GetMeUtxos, GetMyMEBalance, GetProtocolMeInfo } from '@/api/v3'
import * as bsv from '@sensible-contract/bsv'
// import bsv from 'bsv'
import { openLoading } from './util'
import { Toast } from 'vant'
import { Transaction } from 'dexie'
import { useUserStore } from '@/stores/user'
import i18n from './i18n'

enum AppMode {
  PROD = 'prod',
  GRAY = 'gray',
  TEST = 'test',
  DEV2 = 'dev2',
}

export const AllNodeName: {
  [key in NodeName]: {
    brfcId: string
    path: string
  }
} = {
  [NodeName.SimpleMicroblog]: {
    brfcId: 'b17e9e277bd7',
    path: '/Protocols/SimpleMicroblog',
  },
  [NodeName.MetaFile]: {
    brfcId: 'MetaFile',
    path: '/Protocols/MetaFile',
  },
}

export class SDK {
  appAddress = {
    [AppMode.PROD]: '19NeJJM6eEa3bruYnqkTA4Cp6VvdFGSepd',
    [AppMode.TEST]: '1BrfsynMJ56gc2HFicgpBhEKRtRQYTm82E',
  } // Nft收手续费的地址

  appMsg: AppMsg | null = null
  appMetaIdJs = (window as any).appMetaIdJsV2
  wallet: HdWallet | null = null
  isInitSdked = false
  network = Network.mainnet

  constructor(network = Network.mainnet) {
    this.network = network
    if (this.appMetaIdJs) this.isInitSdked = true
  }

  randomString() {
    return Math.random()
      .toString()
      .replace('.', '')
  }

  initWallet() {
    return new Promise<void>(async (resolve, reject) => {
      const localPassword = window.localStorage.getItem(encode('password'))
      const localUserInfo = window.localStorage.getItem(encode('user'))
      if (!localPassword || !localUserInfo) {
        reject(new Error('用户登录失败'))
      } else {
        try {
          const password = decode(localPassword)
          const userInfo = JSON.parse(decode(localUserInfo))
          const walletObj = await hdWalletFromAccount(
            {
              ...userInfo,
              password: password,
            },
            this.network
          )
          const wallet = new HdWallet(walletObj.wallet)
          this.wallet = wallet
          this.isInitSdked = true
          resolve()
        } catch (error) {
          console.error(error)
          reject(new Error('生成钱包失败' + (error as any).message))
        }
      }
    })
  }

  checkAppHasMethod(methodName: string) {
    return new Promise<void>((resolve, reject) => {
      // @ts-ignore
      if (window.appMetaIdJsV2[methodName]) {
        resolve()
      } else {
        reject(Error('当前App版本不支持此功能，请先升级到最新版本使用'))
      }
    })
  }

  appSetUserInfo() {
    return new Promise<void>(async (resolve, reject) => {
      const userStore = useUserStore()
      await this.checkAppHasMethod('getUserInfo')
      const callback = async (res: MetaIdJsRes) => {
        try {
          if (typeof res === 'string') res = JSON.parse(res)
          if (res.code === 200) {
            if (res.appAccessToken) {
              res.data.token = res.appAccessToken
            }
            res.data.metaId = res.data.showId
            const userInfo = res.data
            if (userInfo) {
              userStore.updateUserInfo(userInfo)
              resolve()
            }
          } else {
            resolve()
          }
        } catch (error) {
          resolve()
        }
      }
      const functionName = `getUserInfoCallBack${this.randomString()}`
      // @ts-ignore
      window[functionName] = callback
      this.appMetaIdJs?.getUserInfo('', '', functionName)
    })
  }

  // 统一回调处理
  async callback(
    res: MetaIdJsRes,
    option?: {
      resolve?: (value: any) => any
      reject?: (reason: any) => void
    }
  ) {
    if (typeof res === 'string') {
      try {
        res = JSON.parse(res)
      } catch (error) {
        if (option?.reject) option?.reject(error)
        else return error
      }
    }
    if (res.code !== 200 && res.code !== 205 && res.code !== 201) {
      if (option?.reject) {
        if (res.data.message) {
          option?.reject(new Error(res.data.message))
        } else {
          option?.reject(undefined)
        }
      } else return res
    } else {
      if (option?.resolve) option?.resolve(res.data)
      else return res.data
    }
  }

  getAppAddress() {
    const env =
      this.appMsg?.isProduction ||
      this.appMsg?.mode === AppMode.PROD ||
      this.appMsg?.mode === AppMode.GRAY
        ? AppMode.PROD
        : AppMode.TEST

    return this.appAddress[env]
  }

  // nft 转账
  transferNFT(params: {
    receiverAddress: string
    tokenIndex: string
    codehash: string
    genesisId: string
    genesisTxid: string | undefined
    sensibleId: string
    checkOnly?: boolean
  }) {
    return new Promise<{
      tx: Transaction
      txid: string
      txHex: string
      txId: string
    }>(async (resolve, reject) => {
      try {
        const userStore = useUserStore()
        await this.checkSdkStatus()
        if (this.appMetaIdJs) {
          await this.checkAppHasMethod('transferNFT')
          const callback = (res: MetaIdJsRes) => {
            this.callback(res, { reject, resolve })
          }
          const accessToken = userStore.user?.token
          const functionName = `nftSellCallBack${this.randomString()}`
          // @ts-ignore
          window[functionName] = callback
          this.appMetaIdJs.transferNFT(accessToken, JSON.stringify(params), functionName)
        } else {
          const res = await this.wallet?.transferNft(
            { ...params, genesis: params.genesisId },
            !params.checkOnly
          )
          if (res) resolve(res)
        }
      } catch (error) {
        reject(error)
      }
    })
  }

  checkSdkStatus() {
    return new Promise<void>((resolve, reject) => {
      if (this.appMetaIdJs) {
        resolve()
      } else {
        const userStore = useUserStore()
        if (userStore.isAuthorized) {
          if (this.wallet) {
            resolve()
          } else {
            reject(new Error('生成钱包失败,请尝试重新登陆'))
          }
        } else {
          reject(new Error('请先登陆，再操作'))
        }
      }
    })
  }

  // 签名
  sigMessage(msg: string, path = '0/0') {
    return new Promise<string>(async (resolve, reject) => {
      await this.checkSdkStatus()
      const userStore = useUserStore()
      if (this.appMetaIdJs) {
        await this.checkAppHasMethod('sigMessage')
        const callback = (res: MetaIdJsRes) => {
          this.callback(res, { reject, resolve })
        }
        const callbackName = 'sigMessageCallback'
        // @ts-ignore
        window[callbackName] = callback
        this.appMetaIdJs!.sigMessage(
          userStore.user?.token,
          JSON.stringify({
            msg,
            path,
          }),
          callbackName
        )
      } else {
        const res = await this.wallet?.sigMessage(msg, path)
        if (res) {
          resolve(res)
        }
      }
    })
  }

  createBrfcChildNode(
    params: {
      nodeName: NodeName
      autoRename?: boolean
      appId?: string[]
      encrypt?: IsEncrypt
      version?: string
      data: string
      dataType?: string
      payCurrency?: string
      payTo?: PayToItem[]
      encoding?: string
      needConfirm?: boolean // 是否需要确认
      attachments?: AttachmentItem[] // 附件
      utxos?: any[] // 传入的utxos
      publickey?: string // 修改时 用的publicekey
      ecdh?: { type: string; publickey: string } // ecdh
      useFeeb?: number // 费率
      confirmHandel?: (params: { useMe: number }) => Promise<boolean>
      meConvertSatoshi?: number // 1Me 等于多少聪
      loading?: { close: () => void }
      payType?: CreateBrfcChildNodePayType
    },
    option?: {
      isBroadcast: boolean
      payType: CreateBrfcChildNodePayType
    }
  ) {
    return new Promise<CreateNodeRes | null>(async (resolve, reject) => {
      const initOption = {
        isBroadcast: true,
        payType: CreateBrfcChildNodePayType.SPACE,
      }
      const initParams = {
        appId: ['ShowV3', this.getOnLinkAppUrl(), this.getpPlatform()],
        autoRename: true,
        version: '0.0.9',
        data: 'NULL',
        dataType: 'application/json',
        encoding: 'UTF-8',
        payTo: [],
        attachments: [],
        utxos: [],
        useFeeb: DEFAULTS.feeb,
      }
      params = {
        ...initParams,
        ...params,
      }
      option = {
        ...initOption,
        ...option,
      }
      const userStore = useUserStore()
      const nodeName = AllNodeName[params.nodeName]
      try {
        //  检查ME 协议 权限
        let checkRes: any
        if (option.payType === CreateBrfcChildNodePayType.SPACE) {
          // 使用bsv 上链时，不需要检查权限
          checkRes = {
            is_support: true,
          }
        } else {
          // 使用MC 上链时，需要检查权限
          checkRes = await GetProtocolMeInfo({
            protocol: params.nodeName,
            address: userStore.user?.address!,
          })
        }

        if (checkRes) {
          if (checkRes.is_support) {
            // me 支持该协议

            // App 端
            if (this.appMetaIdJs) {
              await this.checkAppHasMethod('createBrfcChildNode')
              const functionName = `createBrfcChildNode${this.randomString()}`
              const callback: (res: string) => void = (res: any) => {
                this.callback(res, { resolve, reject })
              }
              // @ts-ignore
              window[functionName] = callback
              if (params.loading) delete params.loading
              if (params.attachments!.length > 0) {
                for (let i = 0; i < params.attachments!.length; i++) {
                  // @ts-ignore
                  params.attachments[i].data = params.attachments[i].hex
                }
              }
              this.appMetaIdJs.createBrfcChildNode(
                userStore.user?.token,
                JSON.stringify(params),
                functionName
              )
            } else {
              interface BrfcMsg {
                address: string
                addressType: number
                addressIndex: number
                txId: string
              }
              const transaction: {
                payTo: bsv.Transaction | null // 打钱到指定节点 space 第一步
                metafileBrfc: bsv.Transaction | null // 创建metaFile的 Brfc节点 第二步
                metafile: bsv.Transaction[] // metafile 节点 第三步
                brfcNode: bsv.Transaction | null // 指定协议的 brfc 节点 第四步
                childNode: bsv.Transaction | null // 指定协议节点 第五步
              } = {
                payTo: null,
                metafileBrfc: null,
                brfcNode: null,
                metafile: [],
                childNode: null,
              }
              let metafileBrfc: BrfcMsg | null = null
              let nodeBrfc: BrfcMsg | null = null
              const createAttachmentParams: any[] = []

              // 用 MC 上链
              // 先判断处理父节点
              const protocolAddress = this.wallet!.createAddress(
                this.wallet!.keyPathMap.Protocols.keyPath
              ).address

              // 如果有附件
              if (params.attachments!.length > 0) {
                let utxos: any[] = []

                //  处理metaFile brfc
                const createMetaFileBrfcRes = await this.wallet?.createBrfcNode(
                  {
                    nodeName: NodeName.MetaFile,
                    parentTxId: userStore.user?.protocolTxId!,
                    parentAddress: protocolAddress,
                    utxos: [...utxos, ...params.utxos!],
                    useFeeb: params.useFeeb,
                  },
                  {
                    isBroadcast: false,
                  }
                )
                if (createMetaFileBrfcRes) {
                  if (createMetaFileBrfcRes?.tx) {
                    transaction.metafileBrfc = createMetaFileBrfcRes?.tx
                  }
                  metafileBrfc = createMetaFileBrfcRes
                }

                for (const item of params.attachments!) {
                  const index = params.attachments!.findIndex(_item => _item.sha256 === item.sha256)
                  let keyPath = ''
                  if (transaction.metafileBrfc) {
                    keyPath = `0/${index.toString()}`
                  } else {
                    const newKeyPath = await this.wallet!.getKeyPath({
                      parentTxid: metafileBrfc!.txId,
                    })
                    if (newKeyPath) {
                      keyPath = newKeyPath.join('/')
                    }
                  }
                  createAttachmentParams.push({
                    nodeName: item.fileName,
                    metaIdTag: MetaIdTag[this.network],
                    encrypt: item.encrypt,
                    data: item.hex,
                    dataType: item.fileType,
                    encoding: 'binary',
                    parentTxId: metafileBrfc!.txId,
                    parentAddress: metafileBrfc!.address,
                    keyPath,
                  })
                  const res = await this.wallet?.createNode(createAttachmentParams[index])
                  if (res) transaction.metafile.push(res.raw)
                }
              }
              const createBrfcNodeRes = await this.wallet?.createBrfcNode(
                {
                  nodeName: params.nodeName,
                  parentTxId: userStore.user?.protocolTxId!,
                  parentAddress: protocolAddress,
                  utxos: params.utxos,
                  useFeeb: params.useFeeb,
                },
                { isBroadcast: false }
              )
              if (createBrfcNodeRes) {
                if (createBrfcNodeRes?.tx) {
                  transaction.brfcNode = createBrfcNodeRes?.tx
                }
                nodeBrfc = createBrfcNodeRes
              }
              // 子节点的 publickey， 如有有传 则为修改，使用传进来的值， 如果有 brfctx则需要创建父节点, 子节点就是父节点的0/0地址专为， 否则传空，自己会去去获取新的
              const publickey = params.publickey
                ? params.publickey
                : transaction.brfcNode
                ? '0'
                : undefined

              // 处理brfc 子节点
              const childNodePrams = {
                ...params,
                publickey,
                brfc: nodeBrfc!,
                ...nodeName,
              }
              const res = await this.wallet?.createBrfcChildNode(childNodePrams, {
                isBroadcast: false,
              })

              if (res) {
                transaction.childNode = res.raw
                // 全部需要的 transaction 已经构建好了

                // 计算总价
                let totalAmount = 0
                // metafile brfc 节点价格
                // @ts-ignore
                if (transaction.metafileBrfc) totalAmount += transaction.metafileBrfc.getNeedFee()
                // metafile 节点价格
                if (transaction.metafile.length > 0) {
                  for (const item of transaction.metafile) {
                    // @ts-ignore
                    totalAmount += item.getNeedFee()
                  }
                }
                // brfc 节点价格
                // @ts-ignore
                if (transaction.brfcNode) totalAmount += transaction.brfcNode.getNeedFee()
                // 节点价格
                // @ts-ignore
                totalAmount += transaction.childNode?.getNeedFee()
                const needBroadcastList = [] // 需要广播的任务
                // 打钱地址
                let receive_address = ''
                // 需要创建 metafile brfc 节点 ，把钱打去 protocol 地址
                if (transaction.metafileBrfc) receive_address = protocolAddress
                else if (transaction.metafile.length) {
                  // 需要创建 metafile 节点 ，把钱打去 metafile brfc 地址
                  receive_address = metafileBrfc!.address
                } else if (transaction.brfcNode) {
                  // 需要创建 brfc 节点 ，把钱打去 protocol 地址
                  receive_address = protocolAddress
                } else receive_address = nodeBrfc!.address // 把钱打去 brfc 节点 地址

                let currentUtxo: any // 上链使用的utxo

                if (option.payType === CreateBrfcChildNodePayType.SPACE) {
                  const useUtxos = []
                  const allUtxos = await this.wallet?.provider.getUtxos(
                    this.wallet.wallet.xpubkey.toString()
                  )
                  if (allUtxos && allUtxos?.length > 0) {
                    totalAmount + DEFAULTS.minAmount
                    let leftAmount = totalAmount
                    for (let i = 0; i < allUtxos.length; i++) {
                      if (leftAmount > 0) {
                        useUtxos.push(allUtxos[i])
                        leftAmount -= allUtxos[i].satoshis
                      } else {
                        break
                      }
                    }
                    if (leftAmount > 0) {
                      throw new Error(i18n.global.t('Insufficient balance'))
                    } else {
                      const res = await this.wallet?.makeTx({
                        utxos: useUtxos,
                        opReturn: [],
                        change: this.wallet.wallet.rootAddress,
                        payTo: [{ amount: totalAmount, address: receive_address }],
                      })
                      if (res) {
                        transaction.payTo = res
                        needBroadcastList.push(res)
                        currentUtxo = await this.wallet!.utxoFromTx({
                          tx: transaction.payTo,
                          outPutIndex: 0,
                        })
                      }
                    }
                  } else {
                    throw new Error(i18n.global.t('Insufficient balance'))
                  }
                } else {
                  // 使用 ME
                  // 总需使用 ME
                  let useMe = Math.ceil(totalAmount / checkRes.me_rate_amount)
                  if (useMe * 100 > checkRes.me_amount_max) {
                    throw new Error('上链内容过大，暂不支持，抱歉')
                  }
                  if (useMe * 100 < checkRes.me_amount_min) useMe = checkRes.me_amount_min / 100
                  const userMeRes = await GetMyMEBalance({ address: userStore.user?.address! })

                  if (userMeRes.code === 0) {
                    if (userMeRes.data.count >= useMe * 100) {
                      let confirmResult = false
                      const isUnCheckConfirm =
                        userStore.payConfirm && useMe <= userStore.payConfirm.me.value
                      if (isUnCheckConfirm) {
                        confirmResult = true
                      } else {
                        if (params.loading) params.loading.close()
                        try {
                          Toast.clear()
                        } catch (error) {}
                        const result = await params.confirmHandel!({ useMe })
                        confirmResult = result
                      }
                      if (confirmResult) {
                        const loading = openLoading()

                        try {
                          const getMeUtxo = await GetMeUtxos({
                            address: userStore.user?.address!,
                            amount: totalAmount,
                            meta_id: userStore.user?.metaId!,
                            protocol: params.nodeName,
                            // 打钱地址： 如果需要创建brfc节点则打到 protocol 地址，否则打到 brfc 节点地址
                            receive_address,
                          })
                          if (getMeUtxo.code === 0) {
                            const addressInfo = await this.wallet!.provider.getPathWithNetWork({
                              xpub: this.wallet!.wallet.xpubkey.toString(),
                              address: receive_address,
                            })

                            const meUtxo = {
                              address: getMeUtxo.data.address,
                              // utxo 所在的路径
                              addressIndex: addressInfo!.addressIndex,
                              addressType: addressInfo!.addressType,
                              // txIndex: 0,
                              outputIndex: 0,
                              txId: getMeUtxo.data.tx,
                              // value: getMeUtxo.data.amount,
                              xpub: this.wallet!.wallet.xpubkey.toString(),
                              script: getMeUtxo.data.script,
                              amount: getMeUtxo.data.amount / 1e8,
                            }
                            currentUtxo = meUtxo
                          }
                        } catch (error) {
                          loading.close()
                          reject(error)
                        }
                      } else {
                        reject(new Error(''))
                      }
                    } else {
                      throw new Error(
                        `此次需要消耗${useMe.toFixed(2)}个能量点,你的能量点余额不足，请充值`
                      )
                    }
                  }
                }

                // 开始给每个 transaction 组装 utxo

                // transaction.metafileBrfc
                if (transaction.metafileBrfc) {
                  this.setTransferUtxoAndOutputAndSign(
                    transaction.metafileBrfc,
                    [currentUtxo!],
                    metafileBrfc!.address
                  )
                  // 组装新 utxo
                  currentUtxo = await this.wallet!.utxoFromTx({ tx: transaction.metafileBrfc })
                  needBroadcastList.push(transaction.metafileBrfc)

                  // 塞 utxo进去 metafile brfc 节点后 metafile brfc transaction 已改变，所以重新构建新的 metafile transaction
                  for (let i = 0; i < transaction.metafile.length; i++) {
                    const res = await this.wallet?.createNode({
                      ...createAttachmentParams[i],
                      parentTxId: transaction.metafileBrfc.id,
                    })
                    if (res) transaction.metafile[i] = res.raw
                  }
                }

                if (transaction.metafile.length > 0) {
                  for (const item of transaction.metafile) {
                    const index = transaction.metafile.findIndex(_item => _item.id === item.id)
                    this.setTransferUtxoAndOutputAndSign(
                      item,
                      [currentUtxo],
                      // 最后一个metafile 的找零地址 如果之后需要创建brfc节点 则打到 protocol 地址 否则 打到 bfr节点地址
                      index < transaction.metafile.length - 1
                        ? metafileBrfc!.address
                        : transaction.brfcNode
                        ? protocolAddress
                        : nodeBrfc!.address
                    )
                    needBroadcastList.push(item)

                    // 组装新 utxo
                    currentUtxo = await this.wallet!.utxoFromTx({ tx: item })

                    // 替换 data 对应的 metafile 占位符
                    childNodePrams.data = childNodePrams.data.replace(
                      `$[${index}]`,
                      transaction.metafile[index].id
                    )
                  }

                  // 因为 childNodePrams.data 改变了，是所以需要重新构建 child node transtation
                  // 但需构建brfc 节点不重新构建， 因为构建完brfc节点也需重新构建 child node transtation, 避免重复构建
                  if (!transaction.brfcNode) {
                    // @ts-ignore
                    const res = await this.wallet?.createBrfcChildNode(
                      {
                        ...childNodePrams,
                        brfc: nodeBrfc!,
                      },
                      { isBroadcast: false }
                    )
                    if (res) {
                      transaction.childNode = res.raw
                    }
                  }
                }

                if (transaction.brfcNode) {
                  this.setTransferUtxoAndOutputAndSign(
                    transaction.brfcNode,
                    [currentUtxo],
                    nodeBrfc!.address
                  )

                  needBroadcastList.push(transaction.brfcNode)

                  // 组装新 utxo
                  currentUtxo = await this.wallet!.utxoFromTx({ tx: transaction.brfcNode })

                  // 塞 utxo进去 brfc 节点后 brfc transaction 已改变，所以重新构建新的 childNode
                  // @ts-ignore
                  const res = await this.wallet?.createBrfcChildNode(
                    {
                      ...childNodePrams,
                      brfc: {
                        ...nodeBrfc!,
                        txId: transaction.brfcNode.id,
                      },
                    },
                    {
                      isBroadcast: false,
                    }
                  )
                  if (res) transaction.childNode = res.raw
                }

                if (transaction.childNode) {
                  this.setTransferUtxoAndOutputAndSign(
                    transaction.childNode,
                    [currentUtxo],
                    nodeBrfc!.address
                  )
                  needBroadcastList.push(transaction.childNode)
                }

                // 全部 transaction 组装utxo 完成， 开始按顺序广播
                let isAllSuccess = true
                for (let i = 0; i < needBroadcastList.length; i++) {
                  try {
                    await this.wallet?.provider.broadcast(needBroadcastList[i]!.toString())
                  } catch (error) {
                    isAllSuccess = false
                    reject(error)
                    break
                  }
                }

                if (isAllSuccess) {
                  resolve({
                    txId: transaction.childNode!.id,
                    raw: transaction.childNode,
                    hex: transaction.childNode!.toString(),
                    nodeAddress: '',
                  })
                }
              }
            }
          } else {
            // me 不支持该协议
            throw new Error('暂不支持此操作，敬请期待')
          }
        }
      } catch (error) {
        reject(error)
      }
    })
  }

  getpPlatform() {
    return isIosApp
      ? 'iosApp'
      : isIOS
      ? 'ios:web'
      : isAndroidApp
      ? 'androidApp'
      : isAndroid
      ? 'android:web'
      : 'web'
  }

  getOnLinkAppUrl() {
    return import.meta.env.MODE === 'prod'
      ? 'https://nft.nos.art'
      : import.meta.env.MODE === 'gray'
      ? 'gray'
      : import.meta.env.MODE === 'test'
      ? 'test'
      : 'dev'
  }

  // 保存文件
  downloadFile(url: string, name = 'file') {
    return new Promise<void>(async resolve => {
      if (this.appMetaIdJs) {
        const userStore = useUserStore()
        await this.checkAppHasMethod('saveShareImage')
        window.appMetaIdJsV2.saveShareImage(userStore.user?.token, url, name)
        resolve()
      } else {
        const a = document.createElement('a')
        a.href = url
        a.download = name
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        resolve()
      }
    })
  }

  // 去登陆， 兼容 iosApp 和其他情况
  toLogin(fullpath: string) {
    if (this.appMetaIdJs) {
      this.appMetaIdJs.needLogin('', '', '')
    } else {
      router.push({
        name: 'preLogin',
        query: {
          redirect: fullpath,
        },
      })
    }
  }

  // 分享链接， App 走 sdk可以直接分享到微信等等
  shareUrl(params: { url: string; text: string }) {
    return new Promise<void>(async (resolve, reject) => {
      if (this.appMetaIdJs) {
        await this.checkAppHasMethod('shareUrl')
        this.appMetaIdJs.shareUrl('', JSON.stringify(params), '')
      } else {
        toClipboard(params.text)
          .then(() => {
            resolve()
          })
          .catch(error => {
            reject(error)
          })
      }
    })
  }

  // 批量转NFT
  /**
   *
   * @param nftList
   * {
      receiverAddress: string
      codehash: string
      genesis: string
      tokenIndex: string
      sensibleId: string
      gensisiTxid:string
    }
   * @returns
   */
  public async batchTransferNft(
    NftList: any[],
    receiverAddress: string,
    noBroadcast = false
  ): Promise<any> {
    return new Promise<PromiseSettledResult<NftTransferResult>[]>(async (resolve, reject) => {
      try {
        if (this.appMetaIdJs) {
          reject(new Error('App暂不支持，请在H5端使用此功能'))
        } else {
          const res = await this.wallet?.batchTransferNft(NftList, receiverAddress, noBroadcast)
          if (res) {
            resolve(res)
          }
        }
      } catch (error) {
        reject(error)
      }
    })
  }

  setTransferUtxoAndOutputAndSign(
    tx: bsv.Transaction,
    utxos: UtxoItem[],
    changeAddress: string,
    useFeeb = DEFAULTS.feeb
  ) {
    // @ts-ignore
    tx.from(utxos)
    tx.change(changeAddress)
    // @ts-ignore
    tx.fee(Math.ceil(tx._estimateSize() * useFeeb))
    // @ts-ignore
    // if (tx.isNeedChange()) {
    //   // tx.change(changeAddress)
    //   tx.addOutput(
    //     new bsv.Transaction.Output({
    //       // satoshis: Math.floor(
    //       //   brfcChildTransaction._getUnspentValue() -
    //       //     // @ts-ignore
    //       //     brfc.transaction.getNeedFee()
    //       // ),
    //       // @ts-ignore
    //       satoshis: tx.getChangeAmount(),
    //       script: bsv.Script.fromAddress(changeAddress),
    //     })
    //   )
    // }
    const privateKeys = this.wallet!.getUtxosPrivateKeys(utxos)
    tx.sign(privateKeys)
  }

  /**
   * ECIES 解密
   */
  eciesDecryptData(params: {
    data: string | Buffer
    privateKey?: bsv.PrivateKey | string
    publicKey?: string
  }) {
    return new Promise<string>(async (resolve, reject) => {
      if (this.appMetaIdJs) {
        await this.checkAppHasMethod('eciesDecryptData')
        const callback = (res: MetaIdJsRes) => {
          this.callback(res, { reject, resolve })
        }
        const callbackName = 'eciesDecryptDataCallback'
        // @ts-ignore
        window[callbackName] = callback
        const userStore = useUserStore()
        this.appMetaIdJs.eciesDecryptData(
          userStore.user?.token,
          JSON.stringify(params),
          callbackName
        )
      } else {
        const result = this.wallet!.eciesDecryptData(
          params.data,
          params.privateKey,
          params.publicKey
        )
        resolve(result)
      }
    })
  }

  getPathWithNetWork(params: { xpub: string; address: string }) {
    return this.wallet?.provider.getPathWithNetWork(params)
  }

  getPathPrivateKey(path: string) {
    return this.wallet?.getPathPrivateKey(path)
  }
}
