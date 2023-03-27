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

export function getStatusText(startTime: number, endTime: number) {
  const now = new Date().getTime()
  if (startTime * 1000 < now) return i18n.global.t('DAO.Proposal Status.UnStarted')
  else if (startTime * 1000 >= startTime && endTime * 1000 <= now)
    return i18n.global.t('DAO.Proposal Status.Voting')
  else return i18n.global.t('DAO.Proposal Status.Ended')
}

export function getStatusClass(startTime: number, endTime: number) {
  const now = new Date().getTime()
  if (startTime * 1000 < now) return 'faded'
  else if (startTime * 1000 >= startTime && endTime * 1000 <= now) return 'active'
  else return 'faded'
}
