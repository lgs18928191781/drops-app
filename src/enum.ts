export const enum SortType {
  Time = 0,
  Price = 1,
  Index = 2,
  Default = 3,
}

export const enum OrderType {
  ASC = 1,
  DESC = -1,
}

export const enum ToBsvType {
  Number = 'number',
  String = 'string',
}
export const enum TextAlign {
  Start = 'start',
  End = 'end',
  Right = 'right',
  Center = 'center',
  Justify = 'justify',
  MatchParent = 'match-parent',
}

export enum ScreenTypes {
  ButtonList = 'ButtonList',
  Price = 'Price',
  CheckboxList = 'checkboxList',
}

export enum legalOrderType {
  PRICE = 1, // 按价格排序
  ID = 2, // 按序号排序
}

export enum legalSortType {
  ASC = 1, // 正序
  DESC = 2, // 倒序
}

export enum legalSellType {
  SALE = 1, // 可购买
  NONSALE = 2, // 非销售
  AUCTION = 3, // 拍卖
  NEWSALE = 4, // 新上架
}

export enum LegalPayType {
  Native = 1,
  App = 2,
  H5 = 3,
  Jsapi = 4,
}

export enum Unit {
  BSV = 'BSV',
  CNY = 'CNY',
}

export enum PayType {
  Native = 1,
  App = 2,
  H5 = 3,
  Jsapi = 4,
}

export enum PayStatus {
  Ing = 0,
  Fail = -1,
  Success = 1,
}

export enum CertificationType {
  isCert = 1,
  unCert = 2,
}

export enum PayPlatform {
  WechatPay = 1,
  AliPay = 401,
  AliPaySelf = 2,
  UnionPay = 300,
  QuickPay = 301,
  BalancePay = 350,
}

export enum NFTSellState {
  Sale = 0, // 可购买
  OffSale, // 下架
  Buyed, // 已购买，
  ComingSoon, // 敬请期待，
  PanicBuying, // 抢购状态，
  NotSale, // 非销售，
  AuctionUnStart, // 拍卖未开始
  Auctioning, // 拍卖进行中
  AuctionEndButNotSend, // 拍卖结束但未发送NFT
  AuctionEndAndSended, // 拍卖结束且已发送NFT
}

export enum withdrawStatus {
  wait = '待审核',
  fail = '审核失败',
  successButNotWithdraw = '提现中',
  thirdWithdrawFail = '提现失败',
  thirdWithdrawSucc = '提现成功',
  adminClose = '提现关闭',
  rebackBalance = '回退余额',
}

export enum withdrawStatusId {
  wait = 0,
  fail = 1,
  successButNotWithdraw = 2,
  thirdWithdrawFail = 3,
  thirdWithdrawSucc = 4,
  adminClose = 5,
  rebackBalance = 7,
}

export enum orderError {
  lostParams = 1000,
  notAllowBuy = 1001,
  restEnougth = 1002,
  limitedOnceSale = 1003,
  limitedMetaIdBuy = 1004,
  serviceBusy = 1005,
  notFoundWxCoreId = 1006,
  wxCoreOrderFail = 1007,
  noThatBlindBox = 1008,
  noThisNft = 1009,
}

// 活动预约状态
export enum ActDateStaus {
  Dateing = 1,
  DateSuccess = 2,
  DateFail = 3,
}

export enum RemintStatus {
  Remint = 0,
  Reminting = 1,
  RemintSuccess = 2,
}

export enum InviteActivityTag {
  ShareWechat = 1, // 分享微信
  ShareWechatCircle = 2, // 分享朋友圈
  SharLink = 3, // 复制URL
  ShareImage = 4, // 分享图片
  Rigisted = 5, // 注册完成
  Kyced = 6, // kyc完成
  ShareOnChain = 10, // 链上补充
}

export enum BlindboxUUIDStatus {
  Queue = 1, // 排队中
  ToBePay = 2, // 待支付
  PaySuccess = 3, // 支付完成 (完成)
  PayFail = 4, // 支付失败 (完成)
  PayCancel = 5, // 支付取消 (完成)
  QueueFail = 6, // 排队失败 (完成)
}

export enum CloudWalletStatus {
  Normal = '00',
  Freeze = '01',
  Inactivated = '02',
  UnCreated = '03',
  SoldOut = '09',
}

export enum WalletCheckType {
  Recharge = 'recharge',
  Withdraw = 'withdraw',
}

export enum CloudWalletOrderStatus {
  PaySuccess = '00', // 成功
  PayIng = '01', // 处理中
  PayFail = '02', // 失败
  isCollection = '06', // 已收款
  isReturn = '08', // 已退回
}

export enum WalletRecordType {
  Pay = '00', // 余额支付
  Transfer = '01', // 若喜余额转帐
  Withdraw = '02', // 提现
  Recharge = '03', // 充值
  Refund = '04', // 退款
  AirDrop = '05', // 空投
  SystemRetraction = '06', // 系统收回
  Feed = '07', // 系统收回
}

export enum CollectRecordType {
  Buy = 1, // 购买类型，
  Sale = 2, // 上架类型
  OffSale = 3, // -下架类型
}

export enum IsEncrypt {
  Yes = 1,
  No = 0,
}

export enum NFTSaleAmountType {
  SalePrice = 1,
  IncomePrice = 2,
}

export enum PayMeParamsType {
  BuzzPublish = 'SimpleMicroblog',
  BuzzPayLike = 'BuzzPayLike',
  BuzzComment = 'PayComment',
  BuzzReopost = 'SimpleRePost',
}
export enum CreateBrfcChildNodePayType {
  MC = 'MC',
  SPACE = 'SPACE',
}

export enum BuzzTabType {
  Hot = 'hot',
  Home = 'home',
  Follow = 'follow',
}

export enum BuzzHotTabType {
  Today = 'today',
  Week = 'week',
  Month = 'month',
}

export enum MetaEggStatus {
  Inactivated = 1,
  Activated = 2,
  Expired = 3,
}

export enum MetaEggTaskType {
  RealnNameAndCardBinding = 'RealnNameAndCardBinding',
  MetaEggLock = 'MetaEggLock',
  FeedMe = 'FeedMe',
  FeedFSTigerFragment = 'FeedFSTigerFragment',
  FeedNFT = 'FeedNFT',
}

export enum BatchType {
  Sale = 'batchSale',
  Transfer = 'batchTransfer',
}

export enum SignUserType {
  Phone = 'phone',
  Email = 'email',
}

export enum NodeName {
  ETHBinding = 'ETHBinding',
  SimpleMicroblog = 'SimpleMicroblog',
  SimpleRePost = 'SimpleRePost',
  SimpleGroupChat = 'SimpleGroupChat',
  SimpleFileGroupChat = 'SimpleFileGroupChat',
  MetaFile = 'MetaFile',
  NFTAvatar = 'NFTAvatar',
  ShowMsg = 'ShowMsg',
  PayComment = 'PayComment',
  PayLike = 'PayLike',
  SimpleCommunity = 'SimpleCommunity',
  SimpleCommunityJoin = 'SimpleCommunityJoin',
  SimpleGroupCreate = 'SimpleGroupCreate',
}

export const enum BindStatus {
  ChooseType,
  BindHavedMetaId,
  BindRegisterMetaId,
  BindSuccess,
  InputPassword,
}

export const enum CommunityJoinAction {
  Join = 1,
  Leave = -1,
}

export const enum ChannelPublicityType {
  Public = '1',
  Private = '2',
}

export enum MessageType {
  Text = 'text',
  Image = 'image',
  NftEmoji = 'nftEmoji',
  OnChainImage = 'onChainImage',
}

export enum ChannelType {
  Group = 'group',
  Session = 'session',
}

export enum GroupChannelType {
  PublicText = 'publicText',
}
