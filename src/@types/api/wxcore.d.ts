declare interface CouponInfo {
  active_end_time: number
  active_index: number
  active_start_time: number
  coupon_value: number
  description: string
  name: string
  tag: string
}
declare interface GetCouponInfoRes extends apiResponse {
  data: CouponInfo
}
