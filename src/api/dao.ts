import { ProposalItem } from '@/@types/api/dao'
import HttpRequest from '@/utils/request'

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

export function Proposals(params: { symbol: string }) {
  return new Promise<ProposalItem[]>(async (resolve, reject) => {
    const res: any = await DAO.get(`/voteinfo`, {
      params,
    }).catch(error => reject(error))
    if (res.code === 0) {
      let list: ProposalItem[] = []
      for (let i in res.data) {
        list.push({
          ...res.data[i],
          id: i,
        })
      }
      resolve(list)
    }
  })
}
