import { Chains } from '@/enum'
import ETH from '@/assets/images/eth.png'
import MVC from '@/assets/images/iocn_mvc.png'
import POLYGON from '@/assets/svg/polygon.svg?url'

export default [
  {
    id: 1,
    key: 'eth',
    name: import.meta.env.VITE_ETH_CHAIN,
    icon: ETH,
    value: import.meta.env.VITE_ETH_CHAIN,
    precision: 18,
    minUnit: 'wei',
  },
  {
    id: 2,
    key: 'mvc',
    name: 'MVC',
    icon: MVC,
    value: 'mvc' as Chains,
    precision: 8,
    minUnit: 'sat',
  },
  {
    id: 3,
    key: 'polygon',
    name: import.meta.env.VITE_POLYGON_CHAIN,
    icon: POLYGON,
    value: import.meta.env.VITE_POLYGON_CHAIN,
    precision: 18,
    minUnit: 'wei',
  },
]
