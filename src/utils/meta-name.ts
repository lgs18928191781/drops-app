const metaNameRegex = /[\s\S]+[.][a-zA-Z0-9_-]+/

export function isMetaName(name: string) {
  return metaNameRegex.test(name)
}

export async function resolveMetaName(metaName: string) {
  // 带.meta后缀的常规名，则先裁掉后缀；否则直接解析
  const metaNameWithoutSuffix = metaName.endsWith('.meta')
    ? metaName.slice(0, metaName.length - 5)
    : metaName

  // 解析metaName：sha256一次
  const encoder = new TextEncoder()
  const data = encoder.encode(metaNameWithoutSuffix)
  // 查看本地是否有缓存
  const metaNameLookup = localStorage.getItem('metaNameLookup') || '{}'
  let metaNameLookupObj = JSON.parse(metaNameLookup)
  if (metaNameLookupObj[metaNameWithoutSuffix]) {
    const communityId = metaNameLookupObj[metaNameWithoutSuffix]
    return {
      communityId,
      metaName,
    }
  }

  // 本地没有缓存，则计算sha256
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)

  const hashArray = Array.from(new Uint8Array(hashBuffer))
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')

  // 缓存到本地
  metaNameLookupObj[metaNameWithoutSuffix] = hashHex
  localStorage.setItem('metaNameLookup', JSON.stringify(metaNameLookupObj))

  return {
    communityId: hashHex,
    metaName,
  }
}
