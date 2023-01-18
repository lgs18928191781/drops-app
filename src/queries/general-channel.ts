import { sleep } from '../utils/util'

export async function createDao() {
  interface DaoDataCarrier {
    // 基本信息
    daoName: string
    daoID: string
    daoAdmins: string[]

    // 详细信息
    daoIntro: string
    daoMission: string
    daoTypes: string[]
    daoLogo: string
    daoWebsite: string

    daoTwitter: string
    daoDiscord: string
    daoTelegram: string
    daoShowTalk: ''
    daoTerms: string
    daoTermsContentType: string

    // 治理相关
    governanceType: 'ft' | 'nft' | 'none'
    governanceToken: string
    governanceNFT: string
    joinDaoRequireTokenNumber: number
    joinDaoRequireNFTNumber: number
    createProposalRequireTokenNumber: number
    createProposalRequireNFTNumber: number
  }

  // const daoDataCarrier: DaoDataCarrier = {}

  throw new Error('Failed')
}
