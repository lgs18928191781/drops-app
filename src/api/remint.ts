import HttpRequest from 'request-sdk'
// @ts-ignore
const Remint = new HttpRequest('https://api.showmoney.app/dunhuangnew/ruoxi').request
// const Remint = new HttpRequest('https://7b67-59-33-61-120.ap.ngrok.io/ruoxi').request

export const FinallyRemint = (params: {
  metaid: string
  address: string
  accessKey: string
  userName: string
  userType: string
  rawTxList: {
    rawTx: string
    txid: string
  }[]
  remintNftList: {
    genesis: string
    codehash: string
    tokenIndex: string
  }[]
  timestamp: number
  sliverNft: {
    genesis: string
    codehash: string
    tokenIndex: string
  }[]
}): Promise<GetSeriesNftListRes> => {
  return Remint.post('/ultimate/remint', params)
}

export const CollectionRemint = (params: {
  metaid: string
  address: string
  accessKey: string
  userName: string
  userType: string
  rawTx: {
    rawTx: string
    txid: string
  }[]
  remintNftList: {
    genesis: string
    codehash: string
    tokenIndex: string
  }[]
  timestamp: number
  copperNftList: {
    genesis: string
    codehash: string
    tokenIndex: string
  }[]
}): Promise<GetSeriesNftListRes> => {
  return Remint.post('/collection/remint', params)
}

export const GetReciverAddress = (): Promise<GetReciverAddressRes> => {
  return Remint.get('/remint/reciveraddress')
}
