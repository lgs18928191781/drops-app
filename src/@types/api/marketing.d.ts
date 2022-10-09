declare interface Coupon {
  activity_pic: string
  end_date: string
  activity_name: string
  activity_scope: string
  activity_rules: {
    activityId: string
    genesis: string
    stackable: string
    availableDaysAfterPickUp: number
    tokenIndexMin: number
    codehash: string
    tokenIndexMax: number
    discount: number
    order_amt_max: number
    order_amt_min: number
    deduct_amt: number
  }
  available: 'yes' | 'no' // yes 此券可用，no 此券已经使用或者不可用。
  consume_date: string
  activity_type: 'priority' | 'discount' | 'deduct'
  activity_id: string
  activity_version: string
  activity_available: string
  id: string
  start_date: string
}

declare interface GetCouponsRes extends apiResponse {
  dsta: Coupon[]
}
