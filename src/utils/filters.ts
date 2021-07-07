
export function avatar(showId: string) {
    return `${import.meta.env.VITE_AppImgApi}metafile/avatar/${showId}?time=${new Date().getTime()}`
}