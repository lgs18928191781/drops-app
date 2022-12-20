import mitt from 'mitt'
export const Mitt = new mitt()

export enum MittEvent {
  AddBuzz = 'AddBuzz',
  FollowUser = 'AddBuzz',
  SellNFT = 'SellNFT',
}
