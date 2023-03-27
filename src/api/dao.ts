import { DAOStakeReqstakeArgs, DAOUserStakeInfo, ProposalItem } from '@/@types/api/dao'
import HttpRequest from '@/utils/request'
import { DAOStakeOperate } from '@/enum'
import pako from 'pako'
import { gzip } from 'node-gzip'

const DAO = new HttpRequest(`${import.meta.env.VITE_DAO_API}`, {
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

export function Proposals(params: { symbol: string; offset: number; limit: number }) {
  return new Promise<ProposalItem[]>(async (resolve, reject) => {
    const res: any = await DAO.get(`/manyvoteinfo`, {
      params,
    }).catch(error => reject(error))
    if (res.code === 0) {
      resolve(res.data)
    }
  })
}

export const GetStake = async (params: {
  symbol: string
  address: string
  op: DAOStakeOperate
}): Promise<{ code: number; data: DAOStakeReqstakeArgs; msg: string }> => {
  return DAO.post('/reqstakeargs', params)
}

export const CreateVote = async (params: {
  symbol: string
  requestIndex: string
  mvcRawTx: string
  mvcOutputIndex: number
  title: string
  desc: string
  options: string[]
  minVoteAmount: string
  beginBlockTime: number
  endBlockTime: number
}): Promise<{ code: number; data: { txid: string; voteID: string }; msg: string }> => {
  return DAO.post('/createvote', params)
}

export const GetUserStakeInfo = async (params: {
  symbol: string
  address: string
}): Promise<{ code: number; data: DAOUserStakeInfo; msg: string }> => {
  return DAO.get('/userinfo', { params })
}

export const Pledge = async (params: {
  symbol: string
  requestIndex: string
  mvcRawTx: string
  mvcOutputIndex: number
  mvcAddAmount: number
}): Promise<{
  code: number
  data: {
    txid: string
    blockTime: number
  }
  msg: string
}> => {
  const compressData = await gzip(JSON.stringify(params))
  return DAO.post(
    '/deposit',
    { data: compressData },
    {
      headers: {
        'Content-Type': 'application/json',
      },
    }
  )
}
