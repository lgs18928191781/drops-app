import detectEthereumProvider from '@metamask/detect-provider'
import { ethers } from 'ethers'

export interface MetaMaskEthereumProvider {
  isMetaMask?: boolean
  once(eventName: string | symbol, listener: (...args: any[]) => void): this
  on(eventName: string | symbol, listener: (...args: any[]) => void): this
  off(eventName: string | symbol, listener: (...args: any[]) => void): this
  addListener(eventName: string | symbol, listener: (...args: any[]) => void): this
  removeListener(eventName: string | symbol, listener: (...args: any[]) => void): this
  removeAllListeners(event?: string | symbol): this
}

function connect() {
  return new Promise<{
    ethAddress: string
    provider: MetaMaskEthereumProvider
    chain: string
  }>(async (resolve, reject) => {
    if (typeof (window as any).ethereum !== 'undefined') {
      const provider = await detectEthereumProvider()
      if (provider) {
        ;(window as any).ethereum
          .request({ method: 'eth_requestAccounts' })
          .then((res: string[]) => {
            const chain = (window as any).ethereum?.chainId
            const chainId = parseInt(chain).toString()
            resolve({
              ethAddress: res[0],
              provider,
              chain: chainId,
            })
          })
          .catch((error: any) => {
            if (error.message.includes('Already processing eth_requestAccounts')) {
              ;(window as any).ethereum
                .request({
                  method: 'wallet_requestPermissions',
                  params: [
                    {
                      eth_accounts: {},
                    },
                  ],
                })
                .catch((error: any) => {
                  reject(error)
                })
            }
            reject(error)
          })
        // From now on, this should always be true:
        // provider === window.ethereum
        // startApp(provider) // initialize your app
      } else {
        console.log('Please install MetaMask!')
      }
    } else {
      reject(new Error('web3 is not define'))
    }
  })
}

export default {
  connect,
}
