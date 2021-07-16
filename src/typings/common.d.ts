declare interface Pagination {
    page: number,
    pageSize: number,
    loading?: boolean,
    nothing?: boolean,
    totalPages?: number
}

declare interface Token {
    access_token: string
    token_type: string
    refresh_token: string
    expires_in: number
    expires_time: number
}

declare interface UserInfo {
    showId: string
    metaId: string
    xpub: string
    address: string
    pubKey: string
    infoTxId: string
    protocolTxId: string
    name: string
    nameEncrypt: string
    phone: string
    phoneEncrypt: string
    email: string
    emailEncrypt: string
    headUrl: string
    headUrlEncrypt: string
    avatarTxId: string
    timestamp: number
}