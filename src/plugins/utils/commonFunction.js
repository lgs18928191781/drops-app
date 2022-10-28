import NetworkConfig from './chainNode'

export const getCurrentNetwork = async () => {
  if (!window.web3) {
    throw new Error('web3 is not define')
  } else {
    const enable = window.web3 && window.web3.eth && typeof window.web3.eth.getChainId == 'function'
    const chainId = enable ? await window.web3.eth.getChainId() : null
    let network = null
    let defaultNetwork = null
    console.log('NetworkConfig', NetworkConfig)
    for (let k in NetworkConfig) {
      if (NetworkConfig[k].chainId && NetworkConfig[k].chainId == chainId) {
        network = NetworkConfig[k]
        break
      }
      if (NetworkConfig[k].default) {
        defaultNetwork = NetworkConfig[k]
      }
    }
    return network ? network : defaultNetwork
  }
}

export const getDate = timestamp => {
  const date = timestamp ? new Date(timestamp * 1000) : new Date()
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  let hour = date.getHours()
  hour = hour < 10 ? '0' + hour : hour
  let minute = date.getMinutes()
  minute = minute < 10 ? '0' + minute : minute
  let second = date.getSeconds()
  second = second < 10 ? '0' + second : second
  return year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second
}

export const sleep = delay => new Promise(resolve => setTimeout(resolve, delay))
