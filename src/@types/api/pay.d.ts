declare interface PayApi {
  success: boolean
  code: string
  message: string
  data: any
}

declare interface GetWalletStatusRes extends PayApi {
  data: {
    faceStatus: '00' | '01' // 01.已识别      00.未识别
    memberRegisterDate: string
    memberLevel: '00' | '01' | '02' | '03' //      00:普通用户      01:一类账户      02:二类账户      03:三类账户
    responseTime: string
    bizUserNo: string // address
    uploadStatus: '00' | '01' //  01.已上传      00.未上传
    mid: string
    sandSerialNo: string
    version: string
    responseCode: string
    passwordSetupStatus: '00' | '01' //      00-未设置      01-已设置
    membeStatus: CloudWalletStatus //      00 正常      01 冻结      02 未激活       09  销户
    responseDesc: string
    customerOrderNo: string
  }
}

declare interface CreateAccountRes extends PayApi {
  data: {
    url: string
  }
}

declare interface GetWalletBalanceRes extends PayApi {
  data: {
    responseDesc: string
    responseTime: string
    accountList: {
      accountStatus: string
      availableBal: string // 余额
      frozenBal: string
      accountName: string
      accountType: string
    }[]
    bizUserNo: string
    mid: string
    sandSerialNo: string
    version: string
    customerOrderNo: string
    responseCode: string
  }
}

declare interface BankCardItem {
  dcFlag: string // 借贷标识 00：贷记卡 01：借记卡
  bankMobile: string // 银行预留手机号
  bankNo: string // 银行编号
  cardType: string // 卡类型 00:对公 01:对私
  name: string // 姓名
  bankName: string // 行名称
  relatedCardNo: string // 关联卡编号
  cardNo: string // 卡号
  bankCode?: string
}

declare interface GetBankCardsRes extends PayApi {
  data: {
    bankCardList: BankCardItem[]
    responseDesc: string
    responseTime: string
    bizUserNo: string
    mid: string
    sandSerialNo: string
    version: string
    customerOrderNo: string
    responseCode: string
  }
}

declare interface RechargeRes extends PayApi {
  data: {
    data: string
    sign: string
    mid: string
    signType: string
    encryptKey: string
    customerOrderNo: string
    version: string
    encryptType: string
    url: string
    timestamp: string
    [key: string]: string
  }
}

declare interface CloudWalletOrderStatusItem {
  oriResponseCode: string
  responseTime: string
  mid: string
  oriResponseDesc: string // 响应描述
  orirFeeAmt: number
  remark: string
  sandSerialNo: string
  oriResponseTime: string
  orirOderStatus: CloudWalletOrderStatus // 订单状态       00：成功      01：处理中      02：失败      06:已收款      08：已退回
  version: string
  responseCode: string
  orirOderAmt: number
  authWay: string
  oriCustomerOrderNo: string
  responseDesc: string
  customerOrderNo: string
}
declare interface GetWalletOrderStatusRes extends PayApi {
  data: CloudWalletOrderStatusItem
}
declare interface GetWalletRecordsRes extends PayApi {
  data: {
    total: string
    responseDesc: string
    responseTime: string
    pageNo: string
    dataList: {
      transTime: string
      postscript: string
      oppoName: string
      actAmt: string
      oppoAccountType: string
      oppoBizUserNo: string
      actBalAft: string
      remark: string
      customerOrderNo: string
      oppoType: WalletRecordType
    }[]
    bizUserNo: string
    pageSize: string
    mid: string
    sandSerialNo: string
    version: string
    responseCode: string
  }
}
declare interface BindCardRes extends PayApi {
  data: {
    responseDesc: string
    responseTime: string
    mid: string
    sandSerialNo: string
    relatedCardNo: string
    version: string
    customerOrderNo: string
    responseCode: string
  }
}
declare interface GetOrderAmoutRes extends PayApi {
  data: {
    order_no: string
    total_amount: string
  }
}

declare interface WithdrawRes extends PayApi {
  data: {
    authWay: string
    responseDesc: string
    responseTime: string
    mid: string
    orderStatus: string
    sandSerialNo: string
    customerOrderNo: string
    version: string
    feeAmt: number
    responseCode: string
  }
}
declare interface TransOrderConfirmRes extends PayApi {
  data: {
    responseDesc: string
    responseTime: string
    mid: string
    orderStatus: string
    sandSerialNo: string
    customerOrderNo: string
    version: string
    feeAmt: number
    responseCode: string
  }
}
