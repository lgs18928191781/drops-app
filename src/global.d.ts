declare interface IDialog {
  outsideName: string
  insideName?: string
}

declare interface Window {
  appMetaIdJs?: any
  appMetaIdJsV2?: any
  ethereum: import('ethers').providers.ExternalProvider
}
