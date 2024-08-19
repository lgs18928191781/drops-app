/// <reference types="chrome" />
// type BitcoinJs = typeof import('bitcoinjs-lib')
// type ECPairFactory = typeof import('ecpair')

declare interface IDialog {
  outsideName: string
  insideName?: string
}

declare interface BtcUtxos {
  confirmed: boolean
  inscriptions: any
  outputIndex: number
  satoshi: number
  satoshis: number
  txId: string
  vout: number
}

declare interface Window {
  // bitcoinjs: BitcoinJs
  // ecpair: ECPairFactory
  appMetaIdJs?: any
  appMetaIdJsV2?: any
  ethereum: import('ethers').providers.ExternalProvider
  provider?: MetaMaskEthereumProvider
  metaidwallet: {
    getUtxos: (parmas:{needRawTx?: boolean, useUnconfirmed?: boolean}) => Promise<BtcUtxos[]>
    verifySignature(verifyObj: { message: unknown; signature: any; encoding: string }): any
    getPublicKey(): any
    getXPublicKey(): string
    signMessage(arg0: {
      message: string
      encoding?: string
    }): { signature: any } | PromiseLike<{ signature: any }>
    getAddress(): any
    getMvcBalance: () => Promise<{
      address: string
      confirmed: number
      total: number
      unconfirmed: number
    }>
    switchNetwork: (
      network: 'livenet' | 'testnet' | 'regtest'
    ) => Promise<{
      address: string
      network: 'mainnet' | 'testnet' | 'regtest'
      status: string
    }>
    on: (eventName: string, handler: { mvcAddress: string; btcAddress: string } | any) => void
    removeListener: (
      eventName: string,
      handler: { mvcAddress: string; btcAddress: string } | any
    ) => void
    getNetwork: () => Promise<{ network: 'mainnet' | 'testnet' | 'regtest' }>
    connect: () => Promise<{
      address?: string
      pubKey?: string
      status?: string
    }>
    btc: {
      getAddress: () => Promise<string>
      getPublicKey: () => Promise<string>
      connect: () => Promise<{
        address?: string
        pubKey?: string
        status?: string
      }>
      getBalance: (chain: string) => Promise<{ total: number }>
      getUtxos: (params:{needRawTx?: boolean, useUnconfirmed?: boolean}) => Promise<BtcUtxos[]>
      inscribeTransfer: (tick: string) => Promise<string>
      signMessage: (message: string) => Promise<string>
      signPsbt: ({ psbtHex, options }: { psbtHex: string; options?: any }) => Promise<string>
      pushPsbt: (psbt: string) => Promise<string>
      signPsbts: (psbtHexs: string[], options?: any[]) => Promise<string[]>
    }
    token: {
      getBalance: () => Promise<any>
    }
    transfer: (params: { tasks: TransferOutput[]; broadcast: boolean }) => Promise<TransferResponse>
  }
}
