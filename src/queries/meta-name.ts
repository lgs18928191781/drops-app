import { GetUserMetaNames, GetUserEnsNames } from '@/api/aggregation'
import { getEnsNames, getNewMetaNames } from '@/api/talk'

const dataTransformer = (res: any) => {
  return {
    data: res.data.results.items,
    flag: res.data.nextFlag,
  }
}

export async function fetchMetaNames(
  address: string,
  ns: 'MetaName' | 'ENS',
  useCase: 'community' | 'profile',
  pageParam?: {
    pageSize?: number
    flag?: string
  }
) {
  if (!pageParam) {
    pageParam = {}
  }
  if (!pageParam.pageSize) {
    pageParam.pageSize = 16
  }

  switch (ns) {
    case 'MetaName':
      if (useCase === 'community') {
        return getNewMetaNames({ address, ...pageParam }).then(dataTransformer)
      }

      return GetUserMetaNames({ address, ...pageParam }).then(dataTransformer)

    case 'ENS':
      if (useCase === 'community') {
        return getEnsNames({ address, ...pageParam }).then(dataTransformer)
      }

      return GetUserEnsNames({ address, ...pageParam }).then(dataTransformer)
  }
}
