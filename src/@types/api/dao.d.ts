export interface ProposalItem {
  _id: string
  beginBlockTime: number
  desc: string
  endBlockTime: number
  genesisTxid: string
  minVoteAmount: string
  options: any[]
  title: string
  voteID: string
  voteMainCodeHash: string
  voteSumData: string[]
  createTime: number
  txid: string
  creator: any
  infos: {
    resultOption: {
      minAmount: number
      minPercent: number
      minUser: number
    }
  }
}

export interface DAOStakeReqstakeArgs {
  mvcMode: boolean
  mvcToAddress: string
  op: number
  requestIndex: string
  tokenToAddress: string
  txFee: number
}

export interface DAOUserStakeInfo {
  lockedTokenAmount: string
  rewardTokenAmount: string
  poolTokenAmount: string
  selfStakeRate: string
  unlockingTokens: { expired: number; amount: string }[]
  voteInfo: {
    [key: string]: {
      voteOption: number
      voteAmount: string
    }
  }
}

export interface VoterItem {
  _id: string
  address: string
  voteAmount: string
  voteOption: number
  txid: string
  time: number
}
