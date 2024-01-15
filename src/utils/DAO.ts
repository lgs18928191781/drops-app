import { Chains, DAOProposalType } from '@/enum'
import i18n from './i18n'
import { getOneCommunity } from '@/api/talk'
import { getBalance } from './util'
import { useTalkStore } from '@/stores/talk'
import { useUserStore } from '@/stores/user'
import { space } from './filters'
import { GetOwnerStakeInfo } from '@/api/dao'
import Decimal from 'decimal.js-light'

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
  {
    name: () => i18n.global.t('DAO.Custom Multiple Choice Voting'),
    value: DAOProposalType.DiyMultipleChoose,
  },
]

export function checkUserCanCreateProposal() {
  return new Promise<boolean>(async (resolve, reject) => {
    const talk = useTalkStore()
    const userStore = useUserStore()
    Promise.all([
      getOneCommunity(talk.activeCommunityId),
      getBalance({
        chain: Chains.MVC,
      }),
      GetOwnerStakeInfo({
        symbol: import.meta.env.VITE_MY_STAKE_SYMBOL,
        address: userStore.user!.address!,
      }),
    ])
      .then(([community, balance, stakeAmount]) => {
        if (typeof balance === 'number' && typeof stakeAmount === 'number') {
          if (
            new Decimal(balance).add(stakeAmount).toNumber() >=
            community.dao!.createProposalRequireTokenNumber
          ) {
            resolve(true)
          } else {
            ElMessage.error(
              `${i18n.global.t('DAO.createProposalRequireTokenNumber tips1')} ${space(
                community.dao!.createProposalRequireTokenNumber
              )} ${community.dao!.governanceSymbol!.toUpperCase()},${i18n.global.t(
                'DAO.createProposalRequireTokenNumber tips3'
              )} ${space(new Decimal(balance).add(stakeAmount).toNumber())} SPACES`
            )
            reject(false)
          }
        }
      })
      .catch(error => {
        ElMessage.error(error.message)
        reject(false)
      })
  })
}
