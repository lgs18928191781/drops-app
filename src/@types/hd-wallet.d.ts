export interface PayToItem {
  amount: number
  address: string
}

export interface AttachmentItem {
  fileName: string
  fileType: string
  data: string
  encrypt: IsEncrypt
}
