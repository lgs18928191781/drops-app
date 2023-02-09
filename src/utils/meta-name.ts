import sha256 from 'crypto-js/sha256'

const metaNameRegex = /[\s\S]+[.][a-zA-Z0-9_-]+/

export function isMetaName(name: string) {
  return metaNameRegex.test(name)
}

export async function resolveMetaName(metaName: string) {
  // 带.meta后缀的常规名，则先裁掉后缀；否则直接解析
  let metaNameWithoutSuffix = metaName.endsWith('.meta')
    ? metaName.slice(0, metaName.length - 5)
    : metaName

  // 转为小写（白名单的除外）
  const whiteList = [
    'YOU',
    'Soul',
    'MetaID',
    'MVC',
    'Show3',
    'TEST_MVC_COMMUNITY',
    'AVATAR2',
    'MAN',
    'One World One Community',
    'MetaId Test',
    'OurTesting',
  ]
  if (!whiteList.includes(metaNameWithoutSuffix)) {
    metaNameWithoutSuffix = metaNameWithoutSuffix.toLowerCase()
  }

  // 解析metaName：sha256一次
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
  const hashHex = sha256(metaNameWithoutSuffix).toString()

  // 缓存到本地
  metaNameLookupObj[metaNameWithoutSuffix] = hashHex
  localStorage.setItem('metaNameLookup', JSON.stringify(metaNameLookupObj))

  return {
    communityId: hashHex,
    metaName,
  }
}
