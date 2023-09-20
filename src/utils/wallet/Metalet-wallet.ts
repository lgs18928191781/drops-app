import mvc from 'mvc-lib'
import { isBtcAddress, isNaturalNumber } from '@/utils/wallet/is'
import {
  Chains,
  HdWalletChain,
  IsEncrypt,
  Network,
  NodeName,
  WalletTxVersion,
  GetInitAmountType,
} from '@/enum'
import ShowmoneyProvider from './showmoney-provider'
import { KeyPathRelationType, MetaIdInfoTypes, DEFAULTS, OutputTypes } from './hd-wallet'
import {
  CreateNodeOptions,
  TransferTypes,
  UtxoItem,
  HdWalletCreateBrfcChildNodeParams,
  CreateNodeBaseRes,
  CreateNodeMetaFileRes,
  CreateNodeBrfcRes,
} from '@/@types/sdk'
import { Session } from '@/utils/wallet/session'
import { NftManager, FtManager, API_TARGET } from 'meta-contract'
interface KeyPathObjTypes {
  [key: string]: KeyPathRelationType
}

type TransferOutput = {
  genesis?: string
  codehash?: string
  receviers: Array<{ amount: string; address: string }>
}

type TaskResponse = {
  id: number
  txid: string
  txHex: string
  routeCheckTxid?: string
  routeCheckTxHex?: string
}

export type TransactionInfo = {
  txHex: string
  address: string
  inputIndex: number
  scriptHex: string
  satoshis: number
  sigtype?: number
}

interface SigInfo {
  publicKey: string
  r: string
  s: string
  sig: string

  sigtype: number
}

type UtxoItem = {
  address: string
  flag: string
  height: number
  outIndex: number
  txid: string
  value: number
}

enum encodingType {
  hex = 'hex',
  utf8 = 'utf-8',
  base64 = 'base64',
}

interface metaIDJsWallet {
  connect: () => Promise<{ address: string }>
  isConnected: () => Promise<boolean>
  disconnect: () => Promise<{ status: string }>
  getNetwork: () => Promise<{ network: Network }>
  switchNetwork: () => Promise<{ address: string; status: string; network: Network }>
  getAddress: (params: { path: string }) => Promise<string>
  getBalance: () => Promise<{
    address: string
    confirmed: number
    unconfirmed: number
    total: number
  }>
  getPublicKey: (params: { path: string }) => Promise<string>
  getXPublicKey: () => Promise<string>
  eciesDecrypt: (params: any) => Promise<any>
  eciesEncrypt: (params: any) => Promise<any>
  /**
   *
   * @param path 为路径 example “0/0、0/1 默认0/0”
   *  对应参数 parse
   */
  getUtxos: (params: { path: string }) => Promise<UtxoItem[]>
  transfer: (parmas: {
    task: TransferOutput[]
    broadcast?: boolean
  }) => Promise<{ res: TaskResponse[]; txids: string[]; broadcasted: boolean }>
  signTransaction: (params: { transaction: TransactionInfo }) => Promise<{ signature: SigInfo }>
  merge: () => Promise<any>
  signMessage: (params: {
    message: string
    encoding?: encodingType
  }) => Promise<{ signature: string }>
  signTransactions: (params: {
    transactions: TransactionInfo[]
  }) => Promise<{
    signedTransactions: Array<{
      txid: string
      txHex: string
    }>
  }>
  previewTransaction: (params: { transaction: TransactionInfo }) => Promise<{ txid: string }>
}

export class MetaletWallet {
  public network = Network.mainnet
  public rootAddress = ''

  public provider: ShowmoneyProvider
  public metaIDJsWallet: metaIDJsWallet
  public xpubkey: string = ''
  public session = new Session()
  public keyPathMap: KeyPathObjTypes = {
    Root: {
      keyPath: '0/0',
      parentKeyPath: '0/0',
    },
    Info: {
      keyPath: '0/1',
      parentKeyPath: '0/0',
    },
    Protocols: {
      keyPath: '0/2',
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
  }

  // 当查询是有某个节点时， 查询完存到这里， 反之重复调接口查询
  private userBrfcNodeList: UserProtocolBrfcNode[] = []

  constructor(params: { address: string; metaIDJsWallet: metaIDJsWallet; network?: Network }) {
    this.network = params.network || Network.mainnet
    this.rootAddress = params.address
    this.metaIDJsWallet = params.metaIDJsWallet

    this.provider = new ShowmoneyProvider({
      ...params,
      network: this.network,
      session: this.session,
    })
    this.metaIDJsWallet.getXPublicKey().then((xpub: string) => (this.xpubkey = xpub))
  }

  get xpub() {
    return this.xpubkey
  }

  public async getMetaIdInfo(rootAddress: string): Promise<MetaIdInfoTypes> {
    let metaIdInfo: MetaIdInfoTypes = {
      metaId: '',
      infoTxId: '',
      protocolTxId: '',
      name: '',
      phone: '',
      email: '',
    }
    const metaId = await this.provider.getMetaId(rootAddress).catch(error => {
      ElMessage.error(error.message)
    })
    if (metaId) {
      const info = await this.provider.getMetaIdInfo(metaId)
      metaIdInfo = {
        ...metaIdInfo,
        ...info,
      }
    }
    return metaIdInfo
  }

  private utxoFromTx(params: {
    tx: mvc.Transaction
    addressInfo?: {
      addressType: number
      addressIndex: number
    }
    outPutIndex?: number
    chain?: HdWalletChain
  }) {
    return new Promise<UtxoItem>(async (resolve, reject) => {
      try {
        // 默认  outPutIndex = changeIndex
        if (typeof params?.outPutIndex === 'undefined') {
          if (params.tx._changeIndex) {
            params.outPutIndex = params.tx._changeIndex
          } else {
            params.outPutIndex = params.tx.outputs.length - 1
          }
        }
        const OutPut = params.tx.outputs[params.outPutIndex]
        if (!params.chain) params.chain = HdWalletChain.MVC
        if (!params.addressInfo) {
          const res = this.session.getAddressPath(OutPut.script.toAddress(this.network).toString())
          params.addressInfo = {
            addressType: 0,
            addressIndex: res.path,
          }
        }
        // 把Utxo 标记为已使用， 防止被其他地方用了
        this.provider.isUsedUtxos.push({
          txId: params.tx.id,
          address: OutPut.script.toAddress(this.network).toString(),
        })

        resolve({
          address: OutPut.script.toAddress(this.network).toString(),
          satoshis: OutPut.satoshis,
          amount: OutPut.satoshis * 1e-8,
          script: OutPut.script.toHex(),
          outputIndex: params.outPutIndex!,
          txId: params.tx.id,
          addressType: params!.addressInfo?.addressType!,
          addressIndex: params!.addressInfo?.addressIndex!,
          xpub: this.xpub, //this.wallet.xpubkey.toString(),
          //  wif: this.getPathPrivateKey(
          //    `${params!.addressInfo?.addressType!}/${params!.addressInfo?.addressIndex!}`
          //  )!.toString(),
        })
      } catch (error) {
        reject(error)
      }
    })
  }

  // 初始化 metaId
  public initMetaIdNode(retry: number = 10) {
    return new Promise<MetaIdInfoTypes>(async (resolve, reject) => {
      try {
        const metaIdInfo: any = await this.getMetaIdInfo(this.rootAddress)
        metaIdInfo.pubKey = await this.metaIDJsWallet.getPublicKey({ path: '0/0' }) //this._root.toPublicKey().toString()
        //  检查 metaidinfo 是否完整
        if (metaIdInfo.metaId && metaIdInfo.infoTxId && metaIdInfo.protocolTxId) {
          resolve(metaIdInfo)
        } else {
          let utxos: UtxoItem[] = []
          const hexTxs = []
          const infoAddress = await this.metaIDJsWallet.getAddress({
            path: this.keyPathMap.Info.keyPath,
          }) //this.getPathPrivateKey(this.keyPathMap.Info.keyPath)

          //utxos = await this.metaIDJsWallet.getUtxos({ path: '0/0' })

          // 初始化 metaId
          if (!metaIdInfo.metaId) {
            // TODO: 尝试获始资金
            if (!utxos.length) {
              const initUtxo = await this.provider.getInitAmount({
                address: this.rootAddress,
                xpub: this.xpub,
                reqSource: GetInitAmountType.metalet,
              })
              utxos = [initUtxo]
            } else {
            }

            let outputs: any[] = []

            const root = await this.createNode({
              nodeName: 'Root',
              metaIdTag: import.meta.env.VITE_METAID_TAG,
              data: 'NULL',
              dataType: 'NULL',
              encoding: 'NULL',
              utxos: utxos,
              outputs: outputs,
            })
            console.log('root', root)

            hexTxs.push({
              hex: root.transaction.toString(),
              transation: root.transaction,
            })
            metaIdInfo.metaId = root.txId

            const newUtxo = await this.utxoFromTx({
              tx: root.transaction,
              addressInfo: {
                addressType: 0,
                addressIndex: 0,
              },
            })

            if (newUtxo) {
              utxos = [newUtxo]
            }
          }

          // 初始化 metaId
          if (!metaIdInfo.protocolTxId) {
            const protocol = await this.createNode({
              nodeName: 'Protocols',
              parentTxId: metaIdInfo.metaId,
              metaIdTag: import.meta.env.VITE_METAID_TAG,
              data: 'NULL',
              version: 'NULL',
              utxos: utxos,
            })

            hexTxs.push({
              hex: protocol.transaction.toString(),
              transation: protocol.transaction,
            })
            metaIdInfo.protocolTxId = protocol.txId
            const newUtxo = await this.utxoFromTx({
              tx: protocol.transaction,
              addressInfo: {
                addressType: 0,
                addressIndex: 0,
              },
            })

            if (newUtxo) utxos = [newUtxo]
          }

          // 初始化 infoTxId
          if (!metaIdInfo.infoTxId) {
            const info = await this.createNode({
              nodeName: 'Info',
              parentTxId: metaIdInfo.metaId,
              metaIdTag: import.meta.env.VITE_METAID_TAG,
              data: 'NULL',
              version: 'NULL',
              utxos: utxos,
              change: infoAddress,
            })
            hexTxs.push({
              hex: info.transaction.toString(),
              transation: info.transaction,
            })
            metaIdInfo.infoTxId = info.txId
            const newUtxo = await this.utxoFromTx({
              tx: info.transaction,
              addressInfo: {
                addressType: 0,
                addressIndex: 1,
              },
            })
            if (newUtxo) utxos = [newUtxo]
          }

          // 初始化 name
          // if (!metaIdInfo.name) {
          //   const name = await this.createNode({
          //     nodeName: 'name',
          //     parentTxId: metaIdInfo.infoTxId,
          //     metaIdTag: import.meta.env.VITE_METAID_TAG,
          //     data: account.name,
          //     utxos: utxos,
          //     change: infoAddress, //infoAddress.publicKey.toAddress(this.network).toString(),
          //   })
          //   hexTxs.push(name.transaction.toString())
          //   metaIdInfo.name = account.name
          //   const newUtxo = await this.utxoFromTx({
          //     tx: name.transaction,
          //     addressInfo: {
          //       addressType: 0,
          //       addressIndex: 1,
          //     },
          //   })
          //   if (newUtxo) utxos = [newUtxo]
          // }

          // 初始化 loginName
          // if (!metaIdInfo[account.userType]) {
          //   const loginName = account.userType === 'phone' ? account.phone : account.email
          //   // const keyPath =
          //   //   account.userType === 'phone'
          //   //     ? this.keyPathMap.phone.keyPath
          //   //     : this.keyPathMap.email.keyPath
          //   // const address = this.getPathPrivateKey(keyPath)

          //   const loginNameTx = await this.createNode({
          //     nodeName: account.userType,
          //     parentTxId: metaIdInfo.infoTxId,
          //     metaIdTag: import.meta.env.VITE_METAID_TAG,
          //     data: loginName,
          //     encrypt: 1,
          //     utxos: utxos,
          //     change: infoAddress, //infoAddress.publicKey.toAddress(this.network).toString(),
          //   })
          //   hexTxs.push(loginNameTx.transaction.toString())
          //   metaIdInfo[account.userType] = loginName
          //   const newUtxo = await this.utxoFromTx({
          //     tx: loginNameTx.transaction,
          //     addressInfo: {
          //       addressType: 0,
          //       addressIndex: 1,
          //     },
          //   })
          //   if (newUtxo) utxos = [newUtxo]
          // }

          // eth 绑定新 metaId 账号

          // if (account.ethAddress) {
          //   // 先把钱打回到 infoAddress
          //   const transfer = await this.makeTx({
          //     utxos: utxos,
          //     opReturn: [],
          //     change: this.rootAddress,
          //     payTo: [
          //       {
          //         amount: 1000,
          //         address: infoAddress, //infoAddress.publicKey.toAddress(this.network).toString(),
          //       },
          //     ],
          //   })
          let errorMsg: any
          //统一签名
          const unSignTransations: TransactionInfo[] = []
          hexTxs.forEach(tx => {
            const { transation } = tx
            unSignTransations.push({
              txHex: transation.toString(),
              address: transation.inputs[0].output!.script.toAddress(this.network).toString(),
              inputIndex: 0,
              scriptHex: transation.inputs[0].output!.script.toHex(),
              satoshis: transation.inputs[0].output!.satoshis,
            })
          })

          const { signedTransactions } = await this.metaIDJsWallet.signTransactions({
            transactions: unSignTransations,
          })

          // 广播
          for (let i = 0; i < signedTransactions.length; i++) {
            try {
              const tx = signedTransactions[i]
              console.log('tx', tx)
              await this.provider.broadcast(tx.txHex)
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
            resolve(metaIdInfo)
          }
        }
      } catch (error) {
        retry--
        if (retry <= 0) {
          reject(error)
        } else {
          this.initMetaIdNode(account, retry)
        }
      }
    })
  }

  public async createAddress(keyPath: string): Promise<{ address: string; publicKey: string }> {
    const publicKey = await this.metaIDJsWallet.getPublicKey(keyPath)
    const address = await this.metaIDJsWallet.getAddress(keyPath)
    return {
      address,
      publicKey,
    }
  }

  public async createNode({
    nodeName,
    payTo = [],
    utxos = [],
    change,
    metaIdTag = import.meta.env.VITE_METAID_TAG,
    parentTxId = 'NULL',
    data = 'NULL',
    encrypt = IsEncrypt.No,
    version = '1.0.1',
    dataType = 'text/plain',
    encoding = 'UTF-8',
    outputs = [],
    node,
    chain = HdWalletChain.MVC,
  }: CreateNodeOptions) {
    return new Promise<CreateNodeBaseRes>(async (resolve, reject) => {
      try {
        if (!nodeName) {
          throw new Error('Parameter Error: NodeName can not empty')
        }
        //let privateKey = this.getPathPrivateKey('0/0')
        // TODO: 自定义节点支持
        if (this.keyPathMap[nodeName]) {
          const nodeInfo = this.keyPathMap[nodeName]
          const { address, publicKey } = await this.createAddress(nodeInfo.keyPath)
          node = {
            path: nodeInfo.keyPath,
            publicKey,
            address,
          }
        } else {
          if (encoding === encoding) {
            // 文件
            if (!node) {
              // @ts-ignore
              const _privateKey = new mvc.PrivateKey(undefined, this.network)
              const _publickey = _privateKey.toPublicKey().toString()
              const _address = _privateKey.toAddress().toString()
              node = {
                address: _address,
                publicKey: _publickey,
                path: `-1/-1`,
              }
            }
          } else {
            if (!node) {
              throw new Error('Parameter Error: node can not empty')
            }
          }
        }
        // 数据加密
        if (+encrypt === 1) {
          //data = await this.metaIDJsWallet.eciesEncrypt() //this.eciesEncryptData(data, privateKey, privateKey.publicKey).toString('hex')
        } else {
          if (encoding.toLowerCase() === 'binary') {
            data = Buffer.from(data.toString('hex'), 'hex')
          }
        }

        const chain = await this.provider.getTxChainInfo(parentTxId)

        const scriptPlayload = [
          'mvc',
          node.publicKey.toString(),
          `${chain}:${parentTxId}`,
          metaIdTag.toLowerCase(),
          nodeName,
          data,
          encrypt.toString(),
          version,
          dataType,
          encoding,
        ]
        const makeTxOptions = {
          from: [],
          utxos: utxos,
          opReturn: scriptPlayload,
          change: change,
          outputs,
          payTo,
          chain,
        }

        // TODO: 父节点 utxo 管理
        // if (parentTxId !== 'NULL' && !parentAddress) {
        //   console.log('get parent utxos')
        // } else {
        //   throw new Error("Cant't get parent address")
        // }

        let nodeTx = await this.makeTx(makeTxOptions)

        if (nodeTx) {
          resolve({
            hex: nodeTx.toString(),
            transaction: nodeTx,
            txId: nodeTx.id,
            address: node.address,
            addressType: parseInt(node.path.split('/')[0]),
            addressIndex: parseInt(node.path.split('/')[1]),
            scriptPlayload: scriptPlayload,
            //previewTransaction: newTransaction,
          })
        }
      } catch (error) {
        reject(error)
      }
    })
  }

  public async makeTx({
    payTo = [],
    outputs = [],
    change = this.rootAddress,
    opReturn,
    utxos,
    useFeeb = DEFAULTS.feeb,
    chain = HdWalletChain.MVC,
  }: TransferTypes): Promise<mvc.Transaction> {
    return new Promise(async (resolve, reject) => {
      try {
        const { tx } = await this.makeTxNotUtxos({
          payTo,
          outputs,
          opReturn,
          useFeeb,
          utxos,
          chain,
        })

        tx.change(change)

        // @ts-ignore
        tx.getNeedFee = function() {
          const amount = Math.ceil(30 + this._estimateSize() + 182) * useFeeb
          // @ts-ignore
          const offerFed = Math.ceil(amount * useFeeb)
          // if (amount < minAmount) amount = minAmount
          const total =
            offerFed + amount < mvc.Transaction.DUST_AMOUNT
              ? mvc.Transaction.DUST_AMOUNT + 30
              : offerFed + amount

          return total
        }
        // @ts-ignore
        tx.isNeedChange = function() {
          return (
            // @ts-ignore
            ((this._getUnspentValue() - this.getNeedFee()) as number) >= mvc.Transaction.DUST_AMOUNT
          )
        }
        // @ts-ignore
        tx.getChangeAmount = function() {
          // @ts-ignore
          return (this._getUnspentValue() - this.getNeedFee()) as number
        }

        if (utxos) {
          tx.from(utxos)
        }
        //30是签名后交易字节数
        tx.fee(Math.ceil(tx._estimateSize() + 30 * useFeeb))

        // const unSignTransation = {
        //   txHex: tx.toString(),
        //   address: tx.inputs[0].output!.script.toAddress(this.network).toString(),
        //   inputIndex: 0,
        //   scriptHex: tx.inputs[0].output!.script.toHex(),
        //   satoshis: tx.inputs[0].output!.satoshis,
        // }

        // const { signature } = await this.metaIDJsWallet.signTransaction({
        //   transaction: unSignTransation,
        // })
        // console.log('signatrue')
        // debugger
        // //@ts-ignore
        // const pureSig = mvc.crypto.Signature.fromTxFormat(Buffer.from(signature.sig, 'hex')).toDER()
        // const signedscript = mvc.Script.buildPublicKeyHashIn(
        //   signature.publicKey,
        //   pureSig,
        //   signature.sigtype
        // )
        // //@ts-ignore
        // tx.inputs[0].setScript(signedscript)

        resolve(tx)
      } catch (error) {
        reject(error)
      }
    })
  }

  public async makeTxNotUtxos({
    payTo = [],
    outputs = [],
    utxos = [],
    opReturn,
    useFeeb = DEFAULTS.feeb,
    chain = HdWalletChain.MVC,
  }: TransferTypes) {
    if (!this.metaIDJsWallet) {
      throw new Error('Wallet uninitialized! (core-makeTx)')
    }

    const tx = new mvc.Transaction()
    // 更改 Transaction 为 Bsv  Transaction
    //if (chain === HdWalletChain.BSV) tx.version = WalletTxVersion.BSV
    // 添加 payto
    if (Array.isArray(payTo) && payTo.length) {
      payTo.forEach(item => {
        if (!this.isValidOutput(item)) {
          throw new Error('Output format error.')
        }
        tx.to(item.address, item.amount)
      })
    }

    // 添加 opReturn 内容
    if (opReturn) {
      tx.addOutput(
        new mvc.Transaction.Output({
          script: mvc.Script.buildSafeDataOut(opReturn),
          satoshis: 0,
        })
      )
    }

    if (Array.isArray(outputs) && outputs.length) {
      outputs.forEach(output => {
        tx.addOutput(new mvc.Transaction.Output(output))
      })
    }

    if (utxos.length > 0) {
      tx.from(utxos)
    }
    console.log('tx', tx)

    return {
      tx,
    }
  }

  // 验证交易输出 TODO：地址只验证长度，后续要做合法性验证
  private isValidOutput(output: OutputTypes): boolean {
    return (
      isNaturalNumber(output.amount) &&
      +output.amount >= DEFAULTS.minAmount &&
      isBtcAddress(output.address)
    )
  }

  public async createBrfcChildNode(
    params: HdWalletCreateBrfcChildNodeParams,
    option?: {
      isBroadcast: boolean // 是否广播
      chain?: HdWalletChain
    }
  ): Promise<CreateNodeBrfcRes> {
    return new Promise<CreateNodeBrfcRes>(async (resolve, reject) => {
      const initParams = {
        autoRename: true,
        version: '0.0.9',
        data: 'NULL',
        dataType: 'application/json',
        encoding: 'UTF-8',
        payCurrency: 'Space',
        payTo: [],
        attachments: [],
        utxos: [],
        useFeeb: DEFAULTS.feeb,
      }
      const initOption = {
        isBroadcast: true,
        chain: HdWalletChain.MVC,
      }
      params = {
        ...initParams,
        ...params,
      }
      option = {
        ...initOption,
        ...option,
      }
      try {
        // 是否指定地址
        let address
        let publickey
        const addressType = -1 // 叶子节点都用 -1
        const addressIndex = -1 // 叶子节点都用 -1
        if (params.publickey) {
          publickey = params.publickey
          address = mvc.PublicKey.fromHex(params.publickey)
            .toAddress(this.network)
            .toString()
        } else {
          // 随机生生产 私钥
          // @ts-ignore
          const privateKey = new mvc.PrivateKey(undefined, this.network)
          publickey = privateKey.toPublicKey().toString()
          address = privateKey.toAddress().toString()
        }
        const node: NewNodeBaseInfo = {
          address,
          publicKey: publickey,
          path: `${addressType}/${addressIndex}`,
        }

        if (params.ecdh) {
          // 付费Buzz 待完善
          // if (params.data !== 'NULL' && typeof params.data === 'string') {
          //   let r: any
          //   r = JSON.parse(params.data)
          //   r[params.ecdh.type] = this.ecdhEncryptData(
          //     r[params.ecdh.type],
          //     params.ecdh.publickey,
          //     keyPath.join('/')
          //   )
          //   params.data = JSON.stringify(r)
          // }
        }
        const res = await this.createNode({
          nodeName: params.autoRename
            ? [params.nodeName, publickey.toString().slice(0, 11)].join('-')
            : params.nodeName,
          metaIdTag: import.meta.env.VITE_METAID_TAG,
          parentTxId: params.brfcTxId,
          encrypt: params.encrypt,
          data: params.data,
          payTo: params.payTo,
          dataType: params.dataType,
          version: params.version,
          encoding: params.encoding,
          utxos: params.utxos,
          node,
          chain: option.chain,
        })
        if (res) {
          if (option.isBroadcast) {
            const response = await this.provider.broadcast(res.transaction!.toString())
            if (response?.txid) {
              resolve(res)
            }
          } else {
            resolve(res)
          }
        }
      } catch (error) {
        reject(error)
      }
    })
  }

  async getProtocolInfo(
    nodeName: NodeName,
    protocolsTxId: string,
    brfcId: string,
    chain = HdWalletChain.MVC
  ) {
    return new Promise<ProtocolBrfcNode | null>(async (resolve, reject) => {
      try {
        let brfcNode = this.userBrfcNodeList.find(
          item => item.nodeName == nodeName && item.brfcId === brfcId
        )

        if (brfcNode) {
          resolve(brfcNode)
        } else {
          const protocols: any = await this.getProtocols({
            protocolsTxId: protocolsTxId,
            protocolType: nodeName,
          })

          const protocol = protocols.filter((item: any) => {
            return item?.nodeName === nodeName && item?.data === brfcId
          })[0]
          if (protocol) {
            const res = await this.session.getAddressPath(protocol.address)
            const protocolInfo = {
              xpub: this.wallet.xpubkey.toString(),
              address: protocol.address,
              addressType: 0,
              addressIndex: res.path,
            }
            if (protocolInfo) {
              this.userBrfcNodeList.push({
                ...protocol,
                ...protocolInfo,
                nodeName,
                brfcId,
              })
              resolve({
                ...protocol,
                ...protocolInfo,
              })
            }
          } else {
            resolve(null)
          }
        }
      } catch (error) {
        reject(error)
      }
    })
  }

  // 获取协议类型数据
  async getProtocols({ protocolsTxId, protocolType }: GetProtocolsTypes) {
    return new Promise((resolve, reject) => {
      fetch(import.meta.env.VITE_BASEAPI + '/serviceapi/api/v1/protocol/getProtocolDataList', {
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
        .then((response: Response) => {
          return response.json()
        })
        .then(json => {
          if (json && json.code === 200 && json.result.data) {
            resolve(json.result.data)
          } else {
            resolve([])
          }
        })
        .catch(error => {
          reject(error)
        })
    })
  }
}
