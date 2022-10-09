import HttpRequest from 'request-sdk'

// @ts-ignore
const ShowMan = new HttpRequest(`${import.meta.env.VITE_BASEAPI}/v2showMANDB`).request

export const QueryFindMetaData = (params: string) => {
  return ShowMan.get(`/api/v1/query/queryFindMetaData/${params}`)
}

export const QueryFindMetaDataForPost = (params: any) => {
  return ShowMan.post('/api/v1/query/queryFindMetaDataForPost', {
    data: {
      query: btoa(JSON.stringify(params)),
    },
  })
}

export const GetTxData = (txId: string) => {
  return QueryFindMetaDataForPost({
    find: {
      txId,
    },
    skip: 0,
  })
}
