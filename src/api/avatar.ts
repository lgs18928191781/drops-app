import HttpRequest from 'request-sdk'
// @ts-ignore
const Avatar = new HttpRequest(`${import.meta.env.VITE_BASEAPI}/metabot-avatar`).request
// @ts-ignore
const Army = new HttpRequest(`${import.meta.env.VITE_BASEAPI}/metabot-army`).request
// const Army = new HttpRequest(`http://localhost:8133`).request

export const GetReceiveAddress = (): Promise<apiResponse> => {
  return Army.get('/api/v1/address')
}

interface RemintNft {
  genesis: string
  codehash: string
  tokenIndex: string
}
export const RemintAvatar = (params: {
  metaid: string
  nfts: {
    mainBody: RemintNft
    arms: RemintNft
    legs: RemintNft
    boots: RemintNft
    tool: RemintNft
    backGround?: RemintNft
  }
  nftName: string
  tranfer?: any
  isArmy?: boolean
}): Promise<apiResponse> => {
  const { isArmy, ..._params } = params
  if (isArmy) {
    return Army.post(`/api/v1/army/remint`, _params)
  } else {
    return Avatar.post(`/api/v1/remint`, _params)
  }
}

export const RemintPreview = (params: {
  metaid: string
  nfts: {
    mainBody: RemintNft
    arms: RemintNft
    legs: RemintNft
    boots: RemintNft
    tool: RemintNft
    backGround?: RemintNft
  }
  isArmy?: boolean
}): Promise<RemintPreviewRes> => {
  const { isArmy, ..._params } = params
  if (isArmy) {
    return Army.post(`/api/v1/remint/army/image`, _params)
  } else {
    return Avatar.post(`/api/v1/remint/image`, _params)
  }
}
