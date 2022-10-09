declare interface GetMyMEBalanceRes extends apiResponse {
  data: {
    count: number
  }
}
declare interface GetMeRateRes extends apiResponse {
  data: {
    rate: number
  }
}
declare interface CreateMeOrderRes extends apiResponse {
  data: {
    address: string
    amount: string
    count: number
    create_time: number
    error_status: string
    goods_name: string
    metaid: string
    outside_order_id: string
    price: 0
    status: 0
    url: string
    uuid: string
  }
}

declare interface MeRecordItem {
  address: string
  count: number
  create_time: number
  describe: string
  direction: number
  inside_tx: string
  memo: number
  meta_id: string
  send_tx: string
  summary: string
}

declare interface GetMeRecordsRes extends apiResponse {
  data: {
    data: MeRecordItem[]
    total: number
  }
}

declare interface GetProtocolMeInfoRes {
  is_support: boolean
  limit_amount: number
  me_amount: number
  me_amount_max: number
  me_amount_min: number
  me_rate_amount: number
  protocol: string
  tip_description: string
  tip_name: string
}

declare interface GetMeUtxosRes extends apiResponse {
  data: {
    address: string
    amount: number
    index: number
    tx: string
    script: string
  }
}

declare interface MetaEggItem {
  codehash: string
  egg_uuid: string
  genesis: string
  icon: string
  level: number
  nft_hash: string
  task_count: number
  task_index_finish_list: number[]
  task_total: number
  token_index: string
  upgrade_index: number
  egg_status: MetaEggStatus
  deadline: number
  isUpgradeing: boolean
  rare_type: 1 | 20 | 30 | 40
}

declare interface GetMetaEggsRes extends apiResponse {
  data: {
    data: MetaEggItem[]
  }
}

declare interface GetMetaEggRes extends apiResponse {
  data: MetaEggItem
}

declare interface UpgradeMetaEggResData {
  codehash: string
  egg_uuid: string
  genesis: string
  icon: string
  level: number
  nft_hash: string
  rare_type: string
  token_index: string
}
declare interface UpgradeMetaEggRes extends apiResponse {
  data: UpgradeMetaEggResData
}

declare interface MetaEggAdoptMsg {
  count: number
  day: string
  next_round: number
  next_start_time: number
  next_total: number
  round: number
  rule: string
  status: number
  total: number
}

declare interface MetaEggAdoptMsgRes extends apiResponse {
  data: MetaEggAdoptMsg
}
