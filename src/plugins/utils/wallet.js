import Web3 from 'web3'
import Web3Modal from 'web3modal'
import WalletConfig from './network'
// import Vue from 'vue'
import { getCurrentNetwork } from './commonFunction'

import mitt from 'mitt'

const bus = {}

const emitter = mitt()

bus.$on = emitter.on
bus.$off = emitter.off
bus.$emit = emitter.emit

function connect(flag) {
  return new Promise(async (resolve, reject) => {
    if (window.web3) {
      let web3Modal
      try {
        const networkConfig = await getCurrentNetwork()
        const providerOptions = WalletConfig.providerOptions

        for (let i in providerOptions) {
          if (!providerOptions[i].options) {
            continue
          }
          console.log('providerOptions', providerOptions)
          providerOptions[i].options.chainId = networkConfig.chainId
          if (networkConfig.rpcs) {
            providerOptions[i].options.rpc = networkConfig.rpcs
          } else {
            const _rpcs = {}
            _rpcs[networkConfig.chainId] = networkConfig.rpcUrl
            providerOptions[i].options.rpc = _rpcs
          }
        }
        web3Modal = new Web3Modal({
          network: networkConfig.network,
          cacheProvider: true,
          disableInjectedProvider: false, // disable metamask
          providerOptions,
        })

        // if (web3Modal && !flag) {
        //   setTimeout(() => {
        //     if (!provider) {
        //       console.log('ClearCachedProvider and reconnect')
        //       web3Modal.clearCachedProvider()
        //       connect(true)
        //     }
        //   }, 3000)
        // }
        web3Modal
          .connect()
          .then(async provider => {
            if (provider) {
              debugger
              window.provider = provider
              window.web3 = provider.type == 'TRON' ? provider.web3 : new Web3(provider)
              if (window.web3.trx) {
                provider.selectedAddress = window.web3.defaultAddress.base58
              } else {
                const chainId = await web3.eth.getChainId()
                if (chainId != networkConfig.chainId) {
                  await _addChain(provider, networkConfig)
                }
                if (provider.accounts && provider.selectedAddress != provider.accounts[0]) {
                  provider.selectedAddress = provider.accounts[0]
                }
              }
              window.connectedAddress = provider.selectedAddress
              window.web3Modal = web3Modal

              // store.dispatch('setCurrentAccount', window.connectedAddress)
              // console.log('vue', Vue.prototype.$metamaskeventBus)
              bus.$emit('WALLET_CONNECTED', window.connectedAddress)

              subscribeProvider(window.provider)
              resolve(true)

              // Init Contract暂不引入合约
              // window.connectedAddress && Contract.init();
            }
          })
          .catch(error => {
            reject(error)
          })
      } catch (error) {
        debugger
        if (web3Modal) {
          web3Modal.clearCachedProvider()
        }
        reject(error)
      }
    } else {
      reject(new Error('web3 is not define'))
    }
  })
}

async function _addChain(provider, networkConfig) {
  let res = await provider.request({
    method: 'eth_requestAccounts',
  })
  if (!res || res.length == 0) {
    return false
  }
  console.log(networkConfig)
  await provider.request({
    method: 'wallet_addEthereumChain',
    params: [
      {
        chainId: web3.utils.numberToHex(networkConfig.chainId),
        chainName: networkConfig.chainName,
        nativeCurrency: {
          name: networkConfig.chainSymbol,
          symbol: networkConfig.chainSymbol,
          decimals: networkConfig.decimals,
        },
        rpcUrls: networkConfig.rpcUrl.split(','),
        blockExplorerUrls: [networkConfig.scanUrl],
      },
    ],
  })
}

async function disconnect() {
  if (window.provider == null) {
    return
  }
  if (typeof window.provider.disconnect == 'function') {
    await window.provider.disconnect()
  }
  await window.web3Modal.clearCachedProvider()
  window.provider = null
  window.connectedAddress = null
  window.web3Modal = null

  store.dispatch('setCurrentAccount', window.connectedAddress)
  window.localStorage.removeItem('pw')
  Vue.prototype.$metamaskeventBus.$metamaskeventBus.emit('WALLET_DISCONNECTED')
}

function subscribeProvider(provider) {
  if (!provider.on) {
    return
  }
  provider.on('close', () => {
    disconnect()
  })
  provider.on('chainChanged', () => {
    console.log('chainChanged')
  })
  provider.on('networkChanged', () => {
    console.log('networkChanged')
  })
  provider.on('accountsChanged', () => {
    console.log('accountsChanged')
    Vue.prototype.$eventBus.$emit('web3AccountChange')
    window.location.reload()
  })
}

export default {
  connect,
  disconnect,
}
