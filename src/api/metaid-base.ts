import { useUserStore } from '@/stores/user'
import HttpRequest from '@/utils/request'
import i18n from '@/utils/i18n'

const MetaIdBase = new HttpRequest(`${import.meta.env.VITE_BASEAPI}/metaid-base`, {
  header: () => {
    const userStore = useUserStore()
    if (userStore.isAuthorized) {
      return {
        accessKey: userStore.user!.token,
        userName: userStore.userName!,
        timestamp: new Date().getTime(),
        metaId: userStore.user!.metaId,
      }
    } else {
      return {}
    }
  },
  responseHandel: response => {
    return new Promise((resolve, reject) => {
      if (response?.data && typeof response.data?.code === 'number') {
        if (response.data.code === 0) {
          resolve(response.data)
        } else {
          reject({
            code: response.data.code,
            message: response.data.msg,
          })
        }
      } else {
        resolve(response.data)
      }
    })
  },
}).request

export const GetNFTs = (params: {
  address: string
  chain: string
  limit: string | number
  cursor: string
}): Promise<{
  cursor: string
  status: string
  total: number
  page: number
  page_size: number
  result: {
    amount: string
    block_number: string
    block_number_minted: string
    contract_type: string
    last_metadata_sync: string
    last_token_uri_sync: string
    metadata: string
    minter_address: string
    name: string
    owner_of: string
    symbol: string
    token_address: string
    token_hash: string
    token_id: string
    token_uri: string
  }[]
}> => {
  const { address, ..._params } = params
  return MetaIdBase.get(`/v1/eth/wallet/${address}/nfts`, { params: _params })
}

export const reportTask = (body: {
  id: string
  list: {
    hex: string
    txId: string
  }[]
}): Promise<any> => {
  return MetaIdBase.post(`/v1/meta/upload/task`, body)
}

export const GetTx = (
  txId: string
): Promise<{
  code: number
  data: {
    metanetId: string
    parentAddress: string
    parentTxId: string
    parentData: string
    publicKey: string
    txId: string
  }
}> => {
  return MetaIdBase.get(`/v1/meta/${txId}/info`)
}
