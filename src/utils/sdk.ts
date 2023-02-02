import {
  AppMsg,
  createBrfcChildNodeParams,
  CreateNodeRes,
  MetaIdJsRes,
  NftBuyParams,
  NftCancelParams,
  NftSellParams,
  UtxoItem,
} from '@/@types/sdk'
import {
  BaseUtxo,
  DEFAULTS,
  HdWallet,
  hdWalletFromAccount,
  MetaIdTag,
  Network,
  NftTransferResult,
  ProtocolOptions,
  Reqswapargs,
} from '@/utils/wallet/hd-wallet'
import { decode, encode } from 'js-base64'
import { AttachmentItem } from '@/@types/hd-wallet'
import { router } from '@/router'
import { toClipboard } from '@soerenmartius/vue3-clipboard'
import { isAndroid, isAndroidApp, isIOS, isIosApp } from '@/stores/root'
import { PayToItem } from '@/@types/hd-wallet'
import { SdkPayType, IsEncrypt, NodeName, JobStepStatus, JobStatus } from '@/enum'
import { GetMeUtxos, GetMyMEBalance, GetProtocolMeInfo } from '@/api/v3'
import * as bsv from '@sensible-contract/bsv'
import { openLoading, realRandomString } from './util'
import { Toast } from 'vant'
import { Transaction } from 'dexie'
import { useUserStore } from '@/stores/user'
import { useJobsStore } from '@/stores/jobs'
import i18n from './i18n'
import SdkPayConfirmModalVue from '@/components/SdkPayConfirmModal/SdkPayConfirmModal.vue'
import { h, render } from 'vue'
import { NftManager, FtManager, API_NET, API_TARGET, TxComposer, mvc } from 'meta-contract'
import { resolve } from 'path'
import detectEthereumProvider from '@metamask/detect-provider'
import { v1 as UUID } from 'uuid'
import { useLayoutStore } from '@/stores/layout'
import { GetTx } from '@/api/metaid-base'
import { MetaNameBeforeReqRes } from '@/api/index'
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
    version: string
  }
} = {
  [NodeName.SimpleMicroblog]: {
    brfcId: 'b17e9e277bd7',
    path: '/Protocols/SimpleMicroblog',
    version: '1.0.0',
  },
  [NodeName.MetaFile]: {
    brfcId: 'fcac10a5ed83',
    path: '/Protocols/MetaFile',
    version: '1.0.1',
  },
  [NodeName.SimpleGroupChat]: {
    brfcId: '96e2649ce8b6',
    path: '/Protocols/SimpleGroupChat',
    version: '1.0.2',
  },
  [NodeName.SimpleFileGroupChat]: {
    brfcId: '47cf94e87a8a',
    path: '/Protocols/SimpleFileGroupChat',
    version: '1.0.0',
  },
  [NodeName.ETHBinding]: {
    brfcId: '对应ETH钱包地址',
    path: '/Info/EVMBinding',
    version: '1.0.0',
  },
  [NodeName.NFTAvatar]: {
    brfcId: 'b1e12b089e71',
    path: '/Protocols/NFTAvatar',
    version: '1.0.0',
  },
  [NodeName.PayComment]: {
    brfcId: '9396c994040a',
    path: '/Protocols/PayComment',
    version: '1.0.0',
  },
  [NodeName.SimpleRePost]: {
    brfcId: '157cd804478e',
    path: '/Protocols/SimpleRePost',
    version: '1.0.0',
  },
  [NodeName.PayLike]: {
    brfcId: '2ae43eeb26d9',
    path: '/Protocols/PayLike',
    version: '1.0.0',
  },
  [NodeName.SimpleCommunity]: {
    brfcId: 'c12f783a883f',
    path: '/Protocols/SimpleCommunity',
    version: '1.0.3',
  },
  [NodeName.SimpleCommunityJoin]: {
    brfcId: 'b736fc6b98fd',
    path: '/Protocols/SimpleCommunityJoin',
    version: '1.0.0',
  },
  [NodeName.ShowMsg]: {
    brfcId: '1bf2c5a70377',
    path: '/Protocols/ShowMsg',
    version: '1.0.1',
  },
  [NodeName.SimpleGroupCreate]: {
    brfcId: '16cdf1737815',
    path: '/Protocols/SimpleGroupCreate',
    version: '1.0.2',
  },
  [NodeName.PayFollow]: {
    brfcId: '203ee2c8b732',
    path: '/Protocols/PayFollow',
    version: '1.0.0',
  },
  [NodeName.NftIssue]: {
    brfcId: '5a6fa04c6612',
    path: '/Protocols/NftIssue',
    version: '1.0.0',
  },
  [NodeName.NftGenesis]: {
    brfcId: '599aa8e586e8',
    path: '/Protocols/NftGenesis',
    version: '1.0.0',
  },
  [NodeName.FtIssue]: {
    brfcId: '97b23b9f3a09',
    path: '/Protocols/FtIssue',
    version: '1.0.0',
  },
  [NodeName.FtGenesis]: {
    brfcId: 'c75e9217b9bd',
    path: '/Protocols/FtGenesis',
    version: '1.0.0',
  },
  [NodeName.SimpleRedEnvelope]: {
    brfcId: '695e19ddf852',
    path: '/Protocols/SimpleRedEnvelope',
    version: '1.0.2',
  },
  [NodeName.SimplePublicShare]: {
    brfcId: 'ba9478837e9a',
    path: '/Protocols/SimplePublicShare',
    version: '1.0.0',
  },
  [NodeName.OpenRedenvelope]: {
    brfcId: 'bf90aa3b2d1c',
    path: '/Protocols/OpenRedenvelope',
    version: '1.0.1',
  },
  [NodeName.MetaNote]: {
    brfcId: '4934f562fc29',
    path: '/Protocols/metanote',
    version: '1.0.1',
  },
  [NodeName.NftSell]: {
    brfcId: '13104a689fd3',
    path: '/Protocols/NftSell',
    version: '1.0.1',
  },
  [NodeName.SimpleFileMsg]: {
    brfcId: '1b9ff346f190',
    path: '/Protocols/SimpleFileMsg',
    version: '1.0.1',
  },
  [NodeName.SimpleCreateAnnouncement]: {
    brfcId: '97b6023a62e8',
    path: '/Protocols/SimpleCreateAnnouncement',
    version: '1.0.4',
  },
  [NodeName.SimpleAnnouncementQuote]: {
    brfcId: '4118a343ce29',
    path: '/Protocols/SimpleAnnouncementQuote',
    version: '1.0.5',
  },
  [NodeName.SimpleDAOCreate]: {
    brfcId: '7dac362b04b7',
    path: '/Protocols/SimpleDAOCreate',
    version: '1.0.4',
  },
  [NodeName.NftName]: {
    brfcId: '6ed1b1d1119d',
    path: '/Protocols/NftName',
    version: '1.0.0',
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
  bfrcNodeList: { nodeName: NodeName; data: CreateNodeRes }[] = [] // 存储Brfc节点， 防止未广播时重复构建

  constructor(network: any) {
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
          const userInfo: UserInfo = JSON.parse(decode(localUserInfo))

          // 如果缓存是老的（没有Path），则删除缓存重新登录
          if (!userInfo.path) {
            window.localStorage.removeItem(encode('password'))
            window.localStorage.removeItem(encode('user'))
            // reload
            window.location.reload()
          }
          const walletObj = await hdWalletFromAccount(
            {
              ...userInfo,
              password: password,
            },
            this.network,
            userInfo.path
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
  transferNFT(
    params: {
      receiverAddress: string
      tokenIndex: string
      codehash: string
      genesis: string
    },
    option?: {
      isBroadcast: boolean
    }
  ) {
    return new Promise<{
      txHex: string
      txid: string
      tx: mvc.Transaction
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
          const res = await this.wallet?.transferNft(params, option)
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
            reject(new Error('生成钱包失败,请尝试重新登录'))
          }
        } else {
          reject(new Error('请先登录，再操作'))
        }
      }
    })
  }

  // 签名
  sigMessage(msg: string, path = '0/0') {
    return new Promise<string>(async (resolve, reject) => {
      try {
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
      } catch (error) {
        reject(error)
      }
    })
  }

  createBrfcChildNode(
    params: createBrfcChildNodeParams,
    option?: {
      isBroadcast?: boolean
      payType?: SdkPayType
      useQueue?: boolean
      subscribeId?: string
      checkOnly?: boolean //false弹窗，true不弹窗
    }
  ) {
    return new Promise<NodeTransactions | null>(async (resolve, reject) => {
      const initOption = {
        isBroadcast: true,
        payType: SdkPayType.ME,
        useQueue: false,
        subscribeId: '',
      }
      const initParams = {
        appId: ['ShowV3', this.getOnLinkAppUrl(), this.getPlatform()],
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
      const subscribeId = option?.subscribeId || (option?.useQueue ? UUID() : '')
      option = {
        ...initOption,
        ...option,
        subscribeId,
      }
      if (params.payTo && params.payTo.length) {
        params.payTo = params.payTo.filter(item => item.amount)
      }

      const userStore = useUserStore()
      try {
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
          // 构建没有utxo 的所有 transaction
          let transactions = await this.createBrfcChildNodeTransactions(params)

          let payToRes: CreateNodeRes | undefined = undefined
          if (!params.utxos!.length) {
            // 计算总价
            let totalAmount = this.getNodeTransactionsAmount(transactions, params.payTo)

            const useSatoshis = totalAmount
            // 当时用Me支付时，总价 space 要转换为 ME 值
            if (option.payType === SdkPayType.ME) {
              const meInfo = await GetProtocolMeInfo({
                protocol: params.nodeName,
                address: userStore.user?.address!,
              })
              let useMe = Math.ceil(totalAmount / meInfo.me_rate_amount)
              if (useMe * 100 < meInfo.me_amount_min) useMe = meInfo.me_amount_min / 100
              totalAmount = useMe
            }

            //  获取余额
            const balance = await this.getBalance(option.payType!)
            // 等待 确认支付
            const result = await this.awitSdkPayconfirm(
              option.payType!,
              totalAmount,
              balance!,
              option.checkOnly
            )
            if (result) {
              // 确认支付

              // 打钱地址
              let receive = this.getNodeTransactionsFirstReceive(transactions, params)

              // 获取上链时的utxo
              const getUtxoRes = await this.getAmountUxto({
                sdkPayType: option.payType!,
                amount: useSatoshis,
                nodeName: params.nodeName,
                receive,
              })
              const currentUtxo = getUtxoRes.utxo
              if (getUtxoRes.payToRes) {
                payToRes = getUtxoRes.payToRes
              }

              // 使用utxo 组装 新的transactions
              transactions = await this.setUtxoForCreateChileNodeTransactions(
                transactions,
                currentUtxo!,
                params
              )

              // 广播
              if (option.isBroadcast && !option.useQueue) {
                // 广播 打钱操作
                if (payToRes && payToRes.transaction) {
                  await this.wallet?.provider.broadcast(payToRes.transaction.toString())
                }
                // 广播 transactions 所有交易
                await this.broadcastNodeTransactions(transactions)
              }

              resolve({
                payToAddress: payToRes,
                ...transactions,
                subscribeId: option!.subscribeId,
              })

              // 如果使用队列，则不进行广播，而是收集当次Job的所有交易作为step，推进队列
              if (option.useQueue) {
                this.convertTransactionsIntoJob(transactions, payToRes, option!.subscribeId!)
              }
            } else {
              resolve(null)
            }
          } else {
            // 默认有 UTXO 不弹窗

            // 广播
            if (option.isBroadcast) {
              // 广播 打钱操作
              if (payToRes && payToRes.transaction) {
                await this.wallet?.provider.broadcast(payToRes.transaction.toString())
              }
              // 广播 transactions 所有交易
              await this.broadcastNodeTransactions(transactions)
            }

            resolve({
              payToAddress: payToRes,
              ...transactions,
            })
          }
        }
      } catch (error) {
        reject(error)
      }
    })
  }

  private convertTransactionsIntoJob(
    transactions: NodeTransactions,
    payToRes: CreateNodeRes | undefined,
    subscribeId: string
  ) {
    const jobsStore = useJobsStore()
    const job: Job = {
      id: subscribeId,
      name: 'AReallyNormalJob',
      steps: [],
      status: JobStatus.Waiting,
    }
    const converting: Transaction[] = []

    // A. 收集交易
    // 1. 打钱交易
    if (payToRes && payToRes.transaction) {
      converting.push(payToRes.transaction)
    }
    // 2. Metafile Brfc交易
    if (transactions.metaFileBrfc?.transaction) {
      converting.push(transactions.metaFileBrfc.transaction)
    }
    // 3. Metafile 交易
    if (transactions.metaFiles && transactions.metaFiles.length) {
      for (let i = 0; i < transactions.metaFiles.length; i++) {
        converting.push(transactions.metaFiles[i].transaction)
      }
    }
    // 4. 当前节点 Brfc 交易
    if (transactions.currentNodeBrfc?.transaction) {
      converting.push(transactions.currentNodeBrfc.transaction)
    }
    // 5. 当前节点交易
    if (transactions.currentNode?.transaction) {
      converting.push(transactions.currentNode.transaction)
    }
    // 6. NFT issue 交易
    if (transactions.issueNFT?.transaction) {
      converting.push(transactions.issueNFT.transaction)
    }

    // B. 将交易转换为step
    converting.forEach((tx: any) => {
      job.steps.push({
        txId: tx.id,
        txHex: tx.toString(),
        status: JobStepStatus.Waiting,
      })
    })

    // C. 将job推进队列
    jobsStore.push(job)
  }

  batchCreateBrfcChildNode(
    params: createBrfcChildNodeParams[],
    option?: {
      isBroadcast?: boolean
      payType?: SdkPayType
      callback?: (params: {
        index: number
        transactions: NodeTransactions
      }) => Promise<{
        isContinue: boolean
        error?: string
      }>
    }
  ) {
    return new Promise<null | {
      payToRes?: CreateNodeRes
      transactionsList: NodeTransactions[]
    }>(async (resolve, reject) => {
      const initParams = {
        appId: ['ShowV3', this.getOnLinkAppUrl(), this.getPlatform()],
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
      const initOption = {
        isBroadcast: true,
        payType: SdkPayType.ME,
      }
      option = {
        ...initOption,
        ...option,
      }

      const userStore = useUserStore()

      // 初始化 参数
      for (let item of params) {
        item = {
          ...initParams,
          ...item,
        }
      }

      const transactionsList: NodeTransactions[] = []

      let payToRes: CreateNodeRes | undefined = undefined

      // 构建tx 并机选总价
      let totalAmount = 0 // 总价
      let useSatoshis = 0
      for (let [index, item] of params.entries()) {
        const transactions = await this.createBrfcChildNodeTransactions(item)
        transactionsList.push(transactions)

        //  + transactions 价格
        totalAmount += this.getNodeTransactionsAmount(transactions, item.payTo)
        useSatoshis = totalAmount
      }

      // 使用MC 上链时，需要 把价格 换算成 ME
      if (option.payType === SdkPayType.ME) {
        const meInfo = await GetProtocolMeInfo({
          protocol: params[0].nodeName,
          address: userStore.user?.address!,
        })
        let useMe = Math.ceil(totalAmount / meInfo.me_rate_amount)
        if (useMe * 100 < meInfo.me_amount_min) useMe = meInfo.me_amount_min / 100
        totalAmount = useMe
      }

      // 获取余额
      const balance = await this.getBalance(option.payType!)

      // 等待 确认支付
      const result = await this.awitSdkPayconfirm(option.payType!, totalAmount, balance!)
      if (result) {
        // 打钱地址
        let receive = this.getNodeTransactionsFirstReceive(transactionsList[0], params[0])

        // 获取上链时的utxo
        let currentUtxo: UtxoItem
        const getUtxoRes = await this.getAmountUxto({
          sdkPayType: option.payType!,
          amount: useSatoshis,
          nodeName: params[0].nodeName,
          receive,
        })
        currentUtxo = getUtxoRes.utxo
        if (getUtxoRes.payToRes) {
          payToRes = getUtxoRes.payToRes
        }

        // 使用utxo 组装 每個 新的transactions
        for (let [index, transactions] of transactionsList.entries()) {
          //  下一个请求开始的第一个地址
          const nextNodeReceiveAddress =
            index < transactionsList.length - 1
              ? this.getNodeTransactionsFirstReceive(transactionsList[index + 1], params[index + 1])
                  .address
              : this.wallet!.rootAddress
          transactions = await this.setUtxoForCreateChileNodeTransactions(
            transactions,
            currentUtxo!,
            params[index],
            nextNodeReceiveAddress
          )
          if (index !== transactionsList.length - 1) {
            //  获取 下一个请求 要用的 utxo
            currentUtxo = await this.wallet!.utxoFromTx({
              tx: this.getNodeTransactionsLastTx(transactions),
            })
          }
        }

        // 广播
        let error
        if (option.isBroadcast) {
          // 广播 打钱操作
          if (payToRes && payToRes.transaction) {
            await this.wallet?.provider.broadcast(payToRes.transaction.toString())
          }
          for (let [index, transactions] of transactionsList.entries()) {
            await this.broadcastNodeTransactions(transactions)
            if (option.callback) {
              const result = await option.callback({
                index,
                transactions,
              })
              if (!result.isContinue) {
                error = result.error
                break
              }
            }
          }
        }

        if (error) {
          reject(new Error(error))
        } else {
          resolve({
            payToRes: payToRes,
            transactionsList,
          })
        }
      } else {
        resolve(null)
      }
    })
  }

  private createBrfcChildNodeTransactions(params: createBrfcChildNodeParams) {
    return new Promise<NodeTransactions>(async (resolve, reject) => {
      try {
        const userStore = useUserStore()
        let transactions: {
          metaFileBrfc?: CreateNodeRes
          metaFiles?: CreateNodeRes[]
          currentNodeBrfc?: CreateNodeRes
          currentNode?: CreateNodeRes
          issueNFT?: {
            transaction: bsv.Transaction
            txId?: string
          }
        } = {}
        if (params.nodeName === NodeName.Name) {
          const res = await this.wallet?.createNode({
            ...params,
            parentTxId: userStore.user!.infoTxId,
          })
          transactions.currentNode = res
        } else {
          // 如果有附件
          if (params.attachments && params.attachments!.length > 0) {
            const createAttachmentParams: any = []
            transactions.metaFileBrfc = await this.getBrfcNode(
              {
                nodeName: NodeName.MetaFile,
                parentTxId: userStore.user?.protocolTxId!,
                utxos: [],
                useFeeb: params.useFeeb,
              },
              {
                isBroadcast: false,
              }
            )

            for (const item of params.attachments!) {
              const index = params.attachments!.findIndex(_item => _item.sha256 === item.sha256)
              createAttachmentParams.push({
                nodeName: item.fileName,
                metaIdTag: import.meta.env.VITE_METAID_TAG,
                encrypt: item.encrypt,
                data: item.data,
                dataType: item.fileType,
                encoding: 'binary',
                parentTxId: transactions.metaFileBrfc!.txId,
              })
              const res = await this.wallet?.createNode(createAttachmentParams[index])
              if (res) {
                if (!transactions.metaFiles) transactions.metaFiles = []
                transactions.metaFiles.push(res)
              }
            }
          }

          //  处理当前节点
          if (params.nodeName !== NodeName.MetaFile) {
            // 当前节点的brfc 节点
            if (params.publickey && params.txId) {
              // 修改
              const res = await GetTx(params.txId)
              if (res.code === 0) {
                const protocol = await this.wallet!.getProtocolInfo(
                  params.nodeName,
                  res.data.parentTxId,
                  res.data.parentData
                )
                transactions.currentNodeBrfc = {
                  address: res.data.parentAddress,
                  txId: res.data.parentTxId,
                  addressType: protocol!.addressType,
                  addressIndex: protocol!.addressIndex,
                }
              }
            } else {
              // 新增
              transactions.currentNodeBrfc = await this.getBrfcNode(
                {
                  nodeName: params.nodeName,
                  parentTxId: userStore.user?.protocolTxId!,
                  utxos: params.utxos,
                  useFeeb: params.useFeeb,
                },
                { isBroadcast: false }
              )
            }

            // 处理brfc 子节点

            let res = await this.wallet?.createBrfcChildNode(
              {
                ...params,
                publickey: params.publickey,
                brfcTxId: transactions.currentNodeBrfc!.txId,
                ...AllNodeName[params.nodeName as NodeName]!,
              },
              {
                isBroadcast: false,
              }
            )
            // NFT
            let nftManager: NftManager
            if (this.isNFTProtocol(params.nodeName)) {
              nftManager = new NftManager({
                apiTarget: API_TARGET.MVC,
                // @ts-ignore
                network: this.network,
                purse: this.wallet?.wallet
                  .deriveChild(0)
                  .deriveChild(0)
                  .privateKey.toString(),
                feeb: params.useFeeb,
              })

              // NodeName.NftGenesis
              if (params.nodeName === NodeName.NftGenesis) {
                const _res = await nftManager.genesis({
                  ...JSON.parse(params.data!),
                  opreturnData: res!.scriptPlayload!,
                  noBroadcast: true,
                  calcFee: true,
                })
                res = {
                  txId: '',
                  address: '',
                  addressIndex: 0,
                  addressType: 0,
                  transaction: {
                    getNeedFee: () => {
                      return _res.fee
                    },
                  },
                  scriptPlayload: [],
                }
              } else if (params.nodeName === NodeName.NftSell) {
                // nftSell
              }
            } else if (this.isFTProtocol(params.nodeName)) {
              // FT
            }
            if (res) {
              transactions.currentNode = res
            }

            if (params.nodeName === NodeName.NftIssue) {
              const data = JSON.parse(params.data!)
              const response = await nftManager!.mint({
                sensibleId: data.sensibleId,
                metaTxId: transactions.currentNode!.txId,
                noBroadcast: true,
                metaOutputIndex: 0,
                calcFee: true,
              })
              if (response) {
                transactions.issueNFT = {
                  transaction: {
                    // @ts-ignore
                    getNeedFee: () => {
                      return response.fee
                    },
                  },
                }
              }
            }
          }
        }
        resolve(transactions)
      } catch (error) {
        reject(error)
      }
    })
  }

  private getBrfcNode(params: CreateBrfcNodePrams, option?: { isBroadcast: boolean }) {
    return new Promise<CreateNodeRes>(async (resolve, reject) => {
      try {
        if (this.bfrcNodeList.some(item => item.nodeName === params.nodeName)) {
          resolve(this.bfrcNodeList.find(item => item.nodeName === params.nodeName)!.data)
        } else {
          const currentNodeBrfc = await this.wallet?.createBrfcNode(params, option)
          this.bfrcNodeList.push({
            nodeName: params.nodeName,
            data: {
              ...currentNodeBrfc!,
              transaction: undefined,
            },
          })
          resolve(currentNodeBrfc!)
        }
      } catch (error) {
        reject(error)
      }
    })
  }

  private getNodeTransactionsFirstReceive(
    transactions: NodeTransactions,
    params: createBrfcChildNodeParams
  ) {
    // 打钱地址
    let receive: {
      address: string
      addressIndex: number
      addressType: number
    }
    // 需要创建 metafile brfc 节点 ，把钱打去 protocol 地址
    if (transactions.metaFileBrfc?.transaction) {
      receive = {
        address: this.wallet!.protocolAddress,
        addressType: parseInt(this.wallet!.keyPathMap['Protocols'].keyPath.split('/')[0]),
        addressIndex: parseInt(this.wallet!.keyPathMap['Protocols'].keyPath.split('/')[1]),
      }
    } else if (transactions.metaFiles && transactions.metaFiles.length) {
      // 需要创建 metafile 节点 ，把钱打去 metafile brfc 地址
      receive = {
        address: transactions.metaFileBrfc!.address,
        addressType: transactions.metaFileBrfc!.addressType,
        addressIndex: transactions.metaFileBrfc!.addressIndex,
      }
    } else if (transactions.currentNodeBrfc?.transaction) {
      // 需要创建 brfc 节点 ，把钱打去 protocol 地址
      receive = {
        address: this.wallet!.protocolAddress,
        addressType: parseInt(this.wallet!.keyPathMap['Protocols'].keyPath.split('/')[0]),
        addressIndex: parseInt(this.wallet!.keyPathMap['Protocols'].keyPath.split('/')[1]),
      }
    } else {
      if (params.nodeName === NodeName.Name) {
        receive = {
          address: this.wallet!.infoAddress,
          addressType: parseInt(this.wallet!.keyPathMap['Info'].keyPath.split('/')[0]),
          addressIndex: parseInt(this.wallet!.keyPathMap['Info'].keyPath.split('/')[1]),
        }
      } else {
        receive = {
          address: transactions.currentNodeBrfc!.address,
          addressType: transactions.currentNodeBrfc!.addressType,
          addressIndex: transactions.currentNodeBrfc!.addressIndex,
        }
      }
    }
    return receive
  }

  private setUtxoForCreateChileNodeTransactions(
    transactions: {
      metaFileBrfc?: CreateNodeRes
      metaFiles?: CreateNodeRes[]
      currentNodeBrfc?: CreateNodeRes
      currentNode?: CreateNodeRes
      issueNFT?: {
        transaction: bsv.Transaction
        txId?: string
      }
    },
    utxo: UtxoItem,
    params: createBrfcChildNodeParams,
    lastChangeAddress = this.wallet!.rootAddress
  ) {
    return new Promise<{
      metaFileBrfc?: CreateNodeRes
      metaFiles?: CreateNodeRes[]
      currentNodeBrfc?: CreateNodeRes
      currentNode?: CreateNodeRes
      issueNFT?: {
        transaction: bsv.Transaction
        txId?: string
      }
    }>(async (resolve, reject) => {
      try {
        if (params.nodeName === NodeName.Name) {
          this.setTransferUtxoAndOutputAndSign(
            transactions.currentNode!.transaction,
            [utxo],
            lastChangeAddress
          )
          // 更新txId
          transactions.currentNode!.txId = transactions.currentNode!.transaction.id
        } else {
          if (transactions.metaFileBrfc?.transaction) {
            this.setTransferUtxoAndOutputAndSign(
              transactions.metaFileBrfc.transaction,
              [utxo],
              transactions.metaFileBrfc.address
            )
            // 更新txId
            transactions.metaFileBrfc.txId = transactions.metaFileBrfc.transaction.id
            // 更新本地bfrcNodeList
            this.updateBfrcNodeList(NodeName.MetaFile, transactions.metaFileBrfc)

            // 组装新 utxo
            utxo = await this.wallet!.utxoFromTx({
              tx: transactions.metaFileBrfc.transaction,
            })

            // 当有 metafile Brfc 改变时 metafile 节点也需要重新构建，因为父节点Brfc的txid 已改变
            transactions.metaFiles!.length = 0
            for (const item of params.attachments!) {
              const res = await this.wallet?.createNode({
                nodeName: item.fileName,
                metaIdTag: import.meta.env.VITE_METAID_TAG,
                encrypt: item.encrypt,
                data: item.data,
                dataType: item.fileType,
                encoding: 'binary',
                parentTxId: transactions.metaFileBrfc!.txId,
              })
              if (res) {
                if (!transactions.metaFiles) transactions.metaFiles = []
                transactions.metaFiles.push(res)
              }
            }
          }

          if (transactions.metaFiles && transactions.metaFiles.length) {
            for (const item of transactions.metaFiles) {
              const index = transactions.metaFiles.findIndex(_item => _item.txId === item.txId)
              this.setTransferUtxoAndOutputAndSign(
                item.transaction,
                [utxo],
                // 最后一个metafile 的找零地址 如果之后需要创建brfc节点 则打到 protocol 地址 否则 打到 bfr节点地址
                index < transactions.metaFiles.length - 1
                  ? transactions.metaFileBrfc!.address
                  : transactions.currentNodeBrfc?.transaction
                  ? this.wallet!.protocolAddress
                  : transactions.issueNFT?.transaction || transactions.currentNode?.transaction
                  ? transactions.currentNodeBrfc!.address
                  : lastChangeAddress
              )
              // 更新txId
              transactions.metaFiles[index].txId = transactions.metaFiles[index].transaction.id

              // 组装新 utxo
              utxo = await this.wallet!.utxoFromTx({ tx: item.transaction })
            }
          }

          if (transactions.currentNodeBrfc?.transaction) {
            this.setTransferUtxoAndOutputAndSign(
              transactions.currentNodeBrfc.transaction,
              [utxo],
              transactions.currentNodeBrfc.address
            )
            // 更新txId
            transactions.currentNodeBrfc.txId = transactions.currentNodeBrfc.transaction.id
            // 更新本地bfrcNodeList
            this.updateBfrcNodeList(params.nodeName, transactions.currentNodeBrfc)

            if (transactions.currentNode?.transaction) {
              // 组装新 utxo
              utxo = await this.wallet!.utxoFromTx({
                tx: transactions.currentNodeBrfc!.transaction,
              })
            }
          }

          if (transactions.currentNode?.transaction) {
            // 有附件 或则 需要创建brfc节点时， 都需要重新构建currentNode节点
            if (
              (transactions.metaFiles && transactions.metaFiles.length) ||
              transactions.currentNodeBrfc?.transaction ||
              params.nodeName === NodeName.NftGenesis
            ) {
              // metafile txId变了，所以要改变currentNode 节点的data 对应数据
              if (transactions.metaFiles && transactions.metaFiles.length) {
                for (let i = 0; i < transactions.metaFiles.length; i++) {
                  const fileSuffix = params.attachments![i].fileName.split('.')[
                    params.attachments![i].fileName.split('.').length - 1
                  ]
                  params.data = params.data!.replace(
                    `$[${i}]`,
                    transactions.metaFiles[i].transaction.id + `.${fileSuffix}`
                  )
                }
              }

              // 因为 currentNode Params.data 改变了，是所以需要重新构建 current node transtation
              const res = await this.wallet?.createBrfcChildNode(
                // @ts-ignore
                {
                  ...params,
                  brfcTxId: transactions.currentNodeBrfc!.txId!,
                  ...AllNodeName[params.nodeName as NodeName]!,
                },
                {
                  isBroadcast: false,
                }
              )
              if (res) transactions.currentNode = res
            }

            let nftManager: NftManager
            // NFT
            if (this.isNFTProtocol(params.nodeName)) {
              nftManager = new NftManager({
                apiTarget: API_TARGET.MVC,
                // @ts-ignore
                network: this.network,
                purse: this.wallet?.wallet
                  .deriveChild(0)
                  .deriveChild(0)
                  .privateKey.toString(),
                feeb: params.useFeeb,
              })
            }

            // NftGenesis
            if (params.nodeName === NodeName.NftGenesis) {
              utxo.wif = this.getPathPrivateKey(
                `${utxo.addressType}/${utxo.addressIndex}`
              )!.toString()
              const res = await nftManager!.genesis({
                ...JSON.parse(params.data!),
                opreturnData: transactions.currentNode.scriptPlayload!,
                noBroadcast: true,
                utxos: [utxo],
                changeAddress: lastChangeAddress,
              })
              if (res && typeof res !== 'number') {
                transactions.currentNode = {
                  txId: res.txid!,
                  address: '',
                  addressIndex: 0,
                  addressType: 0,
                  transaction: res.tx!,
                  scriptPlayload: [],
                  codehash: res.codehash!,
                  genesis: res.genesis!,
                  sensibleId: res.sensibleId!,
                }
              }
            } else {
              this.setTransferUtxoAndOutputAndSign(
                transactions.currentNode.transaction,
                [utxo],
                params.nodeName === NodeName.NftIssue ? this.wallet!.rootAddress : lastChangeAddress
              )
              // 更新txId
              transactions.currentNode.txId = transactions.currentNode.transaction.id

              if (params.nodeName === NodeName.NftIssue) {
                // 组装新 utxo
                utxo = await this.wallet!.utxoFromTx({
                  tx: transactions.currentNode!.transaction,
                })
                utxo.wif = this.getPathPrivateKey(
                  `${utxo.addressType}/${utxo.addressIndex}`
                )!.toString()
                // @ts-ignore
                const data = JSON.parse(params.data)
                const res = await nftManager!.mint({
                  sensibleId: data.sensibleId,
                  metaTxId: transactions.currentNode.txId,
                  noBroadcast: true,
                  metaOutputIndex: 0,
                  utxos: [utxo],
                  changeAddres: lastChangeAddress,
                })
                if (res) {
                  transactions.issueNFT = {
                    // @ts-ignore
                    transaction: res.tx,
                    // @ts-ignore
                    txId: res.txid,
                  }
                }
              }
            }
          }
        }

        resolve(transactions)
      } catch (error) {
        reject(error)
      }
    })
  }

  // 更新本地存储的brfc节点信息
  private updateBfrcNodeList(nodeName: NodeName, nodeInfo: CreateNodeRes) {
    const index = this.bfrcNodeList.findIndex(item => item.nodeName === nodeName)
    if (index !== -1) {
      this.bfrcNodeList[index].data = {
        ...nodeInfo,
        transaction: undefined,
      }
    }
  }

  private broadcastNodeTransactions(transactions: NodeTransactions) {
    return new Promise<void>(async (resolve, reject) => {
      try {
        // 广播 Metafile Brfc
        if (transactions.metaFileBrfc?.transaction) {
          await this.wallet?.provider.broadcast(transactions.metaFileBrfc.transaction.toString())
        }
        // 广播 Metafile
        if (transactions.metaFiles && transactions.metaFiles.length) {
          let catchError
          for (let i = 0; i < transactions.metaFiles.length; i++) {
            try {
              await this.wallet?.provider.broadcast(
                transactions.metaFiles[i].transaction.toString()
              )
            } catch (error) {
              catchError = (error as any).message
              break
            }
          }
          if (catchError) {
            throw new Error(catchError)
          }
        }
        // 广播当前节点的Brfc节点
        if (transactions.currentNodeBrfc?.transaction) {
          await this.wallet?.provider.broadcast(transactions.currentNodeBrfc.transaction.toString())
        }
        // 广播当前节点
        if (transactions.currentNode?.transaction) {
          await this.wallet?.provider.broadcast(transactions.currentNode.transaction.toString())
        }

        // 广播 nft issue
        if (transactions.issueNFT?.transaction) {
          await this.wallet?.provider.broadcast(transactions.issueNFT?.transaction.toString())
        }
        resolve()
      } catch (error) {
        reject(error)
      }
    })
  }

  private getNodeTransactionsAmount(transactions: NodeTransactions, payTo: PayToItem[] = []) {
    let amount = 0
    // 计算总价
    // metafile brfc 节点价格
    if (transactions.metaFileBrfc?.transaction)
      amount += transactions.metaFileBrfc.transaction.getNeedFee()
    // metafile 节点价格
    if (transactions.metaFiles && transactions.metaFiles.length > 0) {
      for (const item of transactions.metaFiles) {
        amount += item.transaction.getNeedFee()
      }
    }
    // brfc 节点价格
    if (transactions.currentNodeBrfc?.transaction)
      amount += transactions.currentNodeBrfc.transaction.getNeedFee()
    // 节点价格
    if (transactions.currentNode?.transaction)
      amount += transactions.currentNode.transaction.getNeedFee()

    // nft issue 价格
    if (transactions.issueNFT)
      // @ts-ignore
      amount += transactions.issueNFT.transaction.getNeedFee()

    // payTo 价格
    if (payTo && payTo.length > 0) {
      for (const item of payTo) {
        amount += item.amount
      }
    }

    return amount
  }

  private getBalance(type: SdkPayType) {
    return new Promise<number>(async (resolve, reject) => {
      try {
        let balance = 0
        const userStore = useUserStore()
        if (type === SdkPayType.SPACE) {
          // 使用bsv 上链时，不需要检查权限
          // 获取余额
          const res = await this.wallet?.provider.getXpubBalance(
            this.wallet.wallet.xpubkey.toString()
          )
          if (typeof res === 'number') balance = res
        } else {
          const userMeRes = await GetMyMEBalance({
            address: userStore.user?.address!,
          })
          if (userMeRes.code === 0) {
            balance = userMeRes.data.count / 100
          }
        }
        resolve(balance)
      } catch (error) {
        reject(error)
      }
    })
  }

  getAmountUxto(params: {
    sdkPayType: SdkPayType
    amount: number
    nodeName: NodeName
    receive: {
      address: string
      addressType: number
      addressIndex: number
    }
  }) {
    return new Promise<{
      utxo: UtxoItem
      payToRes?: CreateNodeRes
    }>(async (resolve, reject) => {
      const userStore = useUserStore()
      let utxo: UtxoItem
      let payToRes: CreateNodeRes | undefined = undefined
      try {
        if (params.sdkPayType === SdkPayType.SPACE) {
          const allUtxos = await this.wallet?.provider.getUtxos(
            this.wallet.wallet.xpubkey.toString()
          )
          const useUtxos = []
          if (allUtxos && allUtxos?.length > 0) {
            // 总价加个 最小金额  给转账费用
            let leftAmount = params.amount + bsv.Transaction.DUST_AMOUNT
            for (let i = 0; i < allUtxos.length; i++) {
              if (leftAmount > 0) {
                useUtxos.push(allUtxos[i])
                leftAmount -= allUtxos[i].satoshis
              } else {
                break
              }
            }
            if (leftAmount > 0) {
              // @ts-ignore
              throw new Error(i18n.global.t('Insufficient balance'))
            } else {
              const res = await this.wallet?.makeTx({
                utxos: useUtxos,
                opReturn: [],
                change: this.wallet.wallet.rootAddress,
                payTo: [
                  {
                    amount: params.amount,
                    address: params.receive.address,
                  },
                ],
              })
              if (res) {
                payToRes = {
                  transaction: res,
                  txId: res.id,
                  address: params.receive.address,
                  addressType: params.receive.addressType,
                  addressIndex: params.receive.addressIndex,
                  scriptPlayload: [],
                }
                utxo = await this.wallet!.utxoFromTx({
                  tx: payToRes.transaction,
                  outPutIndex: 0,
                })
              }
            }
          }
        } else {
          const getMeUtxo = await GetMeUtxos({
            address: userStore.user!.address,
            amount: params.amount,
            meta_id: userStore.user!.metaId,
            protocol: params.nodeName,
            // 打钱地址： 如果需要创建brfc节点则打到 protocol 地址，否则打到 brfc 节点地址
            receive_address: params.receive.address,
          })
          if (getMeUtxo.code === 0) {
            utxo = {
              address: getMeUtxo.data.address,
              // utxo 所在的路径
              addressIndex: params.receive.addressIndex,
              addressType: params.receive!.addressType,
              outputIndex: 0,
              txId: getMeUtxo.data.tx,
              xpub: this.wallet!.wallet.xpubkey.toString(),
              script: getMeUtxo.data.script,
              satoshis: getMeUtxo.data.amount,
              amount: getMeUtxo.data.amount / 1e8,
            }
          }
        }

        resolve({
          utxo: utxo!,
          payToRes: payToRes,
        })
      } catch (error) {
        reject(error)
      }
    })
  }

  private awitSdkPayconfirm(
    payType: SdkPayType,
    useAmount: number,
    balance: number,
    checkOnly: boolean = false
  ) {
    return new Promise<boolean>((resolve, reject) => {
      const userStore = useUserStore()
      if (
        !checkOnly &&
        (userStore.sdkPayConfirm[payType].visible ||
          (!userStore.sdkPayConfirm[payType].visible &&
            userStore.sdkPayConfirm[payType].value < useAmount))
      ) {
        // 需要弹出确认框操作
        const divId = `sdk-pay-conirm-${new Date().getTime()}`
        const div = document.createElement('div')
        div.id = divId
        document.body.append(div)
        render(
          // @ts-ignore
          h(SdkPayConfirmModalVue, {
            i18n: i18n.global,
            confirmVisible: userStore.sdkPayConfirm[payType].visible,
            useAmount,
            maxCount: userStore.sdkPayConfirm[payType].value,
            balance,
            router,
            payType,
            onChangeConfirmVisible: (res: boolean) => {
              userStore.changeSdkPayConfirm('visible', res, payType)
            },
            onConfirm: () => {
              setTimeout(() => {
                document.getElementById(divId)?.remove()
              }, 500)
              resolve(true)
            },
            onCancel: () => {
              setTimeout(() => {
                document.getElementById(divId)?.remove()
              }, 500)
              resolve(false)
            },
            onRecharge: () => {
              setTimeout(() => {
                document.getElementById(divId)?.remove()
              }, 500)
              resolve(false)
              const layout = useLayoutStore()
              layout.$patch({ isShowWallet: true })
            },
          }),
          document.getElementById(divId)!
        )
      } else {
        // 不需要弹出 确认框操作
        resolve(true)
      }
    })
  }

  private getNodeTransactionsLastTx(transactions: NodeTransactions) {
    if (transactions.issueNFT?.transaction) {
      return transactions.issueNFT?.transaction
    } else if (transactions.currentNode?.transaction) {
      return transactions.currentNode?.transaction
    } else if (transactions.currentNodeBrfc?.transaction) {
      return transactions.currentNodeBrfc?.transaction
    } else if (transactions.metaFiles && transactions.metaFiles.length) {
      return transactions.metaFiles[transactions.metaFiles.length - 1].transaction
    } else if (transactions.metaFileBrfc?.transaction) {
      return transactions.metaFileBrfc?.transaction
    }
  }

  getPlatform() {
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

  // 去登录， 兼容 iosApp 和其他情况
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
    tx.from(utxos)
    // @ts-ignore
    // if (tx.isNeedChange()) {
    // }

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

  isNFTProtocol(nodeName: NodeName) {
    if (nodeName === NodeName.NftGenesis || nodeName === NodeName.NftIssue) {
      return true
    } else {
      return false
    }
  }

  isFTProtocol(nodeName: NodeName) {
    const nfts = [NodeName.FtGenesis, NodeName.FtIssue, NodeName.NftSell]
    if (nfts.includes(nodeName)) {
      return true
    } else {
      return false
    }
  }

  ftGenesis() {
    return this.wallet?.ftGenesis()
  }

  async sendMoney(payTo: Array<{ amount: number; address: string }>) {
    const Utxos = await this.wallet?.provider.getUtxos(this.wallet.wallet.xpubkey.toString())

    const res = await this.wallet?.makeTx({
      utxos: Utxos,
      opReturn: [],
      change: this.wallet.wallet.rootAddress,
      payTo: payTo,
    })

    return await this.wallet?.provider.broadcast(res.toString(), true)
  }

  MetaNameBeforeReq(params: {
    name: string
    op: number
  }): Promise<{ code: number; data: Reqswapargs; msg: string }> {
    const newParams = {
      ...params,
      address: this.wallet!.rootAddress,
    }
    return MetaNameBeforeReqRes(newParams)
  }

  sendMetaNameTransation(params: {
    op_code: number
    info?: {
      metaid?: string
      mvc?: string
      icon?: string
      [key: string]: any
    }
    years?: number
    reqswapargs: Reqswapargs
  }) {
    return this.wallet?.sendMetaNameTransation(params)
  }
}
