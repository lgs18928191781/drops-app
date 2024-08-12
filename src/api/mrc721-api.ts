import HttpRequest from '@/utils/request'

const NftOrders = new HttpRequest(`http://127.0.0.1:3001/nfts-orders`, {
  header: {
    //SiteConfigMetanetId: import.meta.env.VITE_SiteConfigMetanetId,
  },
  responseHandel: response => {
    return new Promise((resolve, reject) => {
      if (response?.data && typeof response.data?.code === 'number') {
        if (response.data.code === 0 || response.data.code === 200) {
          resolve(response.data)
        } else {
          reject({
            code: response.data.code,
            message: response.data.data,
          })
        }
      } else {
        resolve(response.data)
      }
    })
  },
}).request

export const uploadNftsFile = async (params: FormData) => {
  return NftOrders.post('/uploads', params, { headers: { 'Content-Type': 'multipart/form-data' } })
}

export const genesisCollection = async (params: { metaId: string; name: string }) => {
  return NftOrders.post('/genesis-collection', params)
}

export const issueCollection = async (params: { collectionInfo: Mrc721CollectionItem }) => {
  return NftOrders.post('/issue-collection', params)
}
