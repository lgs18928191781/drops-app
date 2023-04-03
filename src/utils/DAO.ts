import { DAOProposalType } from '@/enum'
import i18n from './i18n'

export const DAOTypes = [
  {
    name: 'DAO.TYPE.Protocol',
    val: 'protocol',
  },
  {
    name: 'DAO.TYPE.Service',
    val: 'service',
  },
  {
    name: 'DAO.TYPE.Social',
    val: 'social',
  },
  {
    name: 'DAO.TYPE.Investment',
    val: 'investment',
  },
  {
    name: 'DAO.TYPE.Grant',
    val: 'grant',
  },
  {
    name: 'DAO.TYPE.Collector',
    val: 'collector',
  },
  {
    name: 'DAO.TYPE.Culture',
    val: 'culture',
  },
]

export function getStatusText(startTime: number, endTime: number, currentblockTime: number) {
  //@ts-ignore
  if (startTime * 1000 > currentblockTime) return i18n.global.t('DAO.Proposal Status.UnStarted')
  else if (startTime * 1000 <= currentblockTime && endTime * 1000 > currentblockTime)
    return i18n.global.t('DAO.Proposal Status.Voting')
  else return i18n.global.t('DAO.Proposal Status.Ended')
}

export function getStatusClass(startTime: number, endTime: number, currentblockTime: number) {
  if (startTime * 1000 > currentblockTime) return 'faded'
  else if (startTime * 1000 <= currentblockTime && endTime * 1000 > currentblockTime)
    return 'active'
  else return 'faded'
}

export const DAOtypeOptions = [
  // @ts-ignore
  { name: () => i18n.global.t('DAO.Basic Type Voting'), value: DAOProposalType.Base },
  {
    name: () => i18n.global.t('DAO.Custom Single Choice Voting'),
    value: DAOProposalType.DiySingleChoose,
  },
  // {
  //   name: () => i18n.global.t('DAO.Custom Multiple Choice Voting'),
  //   value: DAOProposalType.DiyMultipleChoose,
  // },
]
