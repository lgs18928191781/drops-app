export interface ProposalItem {
  id: string
  title: string
  desc: string
  options: string[]
  voteSumData: string[]
  beginBlockTime: number
  endBlockTime: number
  minVoteAmount: string
}
