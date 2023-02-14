import { GetUserMetaNames, GetUserEnsNames } from '@/api/aggregation'
import { getEnsNames, getNewMetaNames } from '@/api/talk'

type NameSolution = 'MetaName' | 'ENS'
type ContractSolution = 'metacontract' | 'ens'
type UseCase = 'community' | 'profile'
type MetaName = {
  name: string
  genesis: string
  codeHash: string
  tokenIndex: string
  communityId: string // 哈希值，创建社区时使用
  ns: NameSolution
  solution: ContractSolution
  chain: 'mvc' | 'eth' | 'goerli'
}

const resolveSolution = (name: string) => {
  const suffix = name.split('.')[1]
  let ns, solution, chain
  if (suffix === 'eth') {
    ns = 'ENS'
    solution = 'ens'
    chain = import.meta.env.VITE_ETH_CHAIN
  } else {
    ns = 'MetaName'
    solution = 'metacontract'
    chain = 'mvc'
  }

  return { ns, solution, chain }
}

const dataTransformer = (res: any) => {
  const data: MetaName[] = res.data.results.items.map((item: any) => {
    const { ns, solution, chain } = resolveSolution(item.name)

    return {
      name: item.name,
      genesis: item.genesis,
      codeHash: item.codeHash,
      tokenIndex: item.tokenIndex,
      communityId: item.communityId,
      ns,
      solution,
      chain,
    }
  })

  return {
    data,
    flag: res.data.nextFlag,
  }
}

export async function fetchMetaNames(
  address: string,
  ns: NameSolution,
  useCase: UseCase,
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
