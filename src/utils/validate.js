// 判断是否外部图标
export function isExternal(url) {
    return /^https?:\/\//.test(url)
}