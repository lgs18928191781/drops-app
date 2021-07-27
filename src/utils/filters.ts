
// @ts-ignore
import dayjs from 'dayjs'

export function avatar(showId: string) {
    return `${import.meta.env.VITE_AppImgApi}/metafile/avatar/${showId}?time=${new Date().getTime()}`
}

export function dateTimeFormat(timestamp: Date, format: string = 'YYYY-MM-DD HH:mm:ss') {
    return dayjs(timestamp).format(format)
}
