<template>
  Hello world??
</template>

<script lang="ts" setup>
import { useTalkStore } from '@/stores/talk'
import { useUserStore } from '@/stores/user'
import { toRaw } from 'vue'

// 查询一个metaid下的协议节点

console.log('hello')
const user = useUserStore()
const talk = useTalkStore()
const selfAddress = talk.selfAddress
const hdpk = toRaw(user!.wallet!.wallet?.wallet)

const rootAddress = hdpk
  ?.deriveChild('m/0/0')
  .privateKey.toAddress()
  .toString()

const infoAddress = hdpk
  ?.deriveChild('m/0/1')
  .privateKey.toAddress()
  .toString()

const protocolsAddress = hdpk
  ?.deriveChild('m/0/2')
  .privateKey.toAddress()
  .toString()

const nameAddress = hdpk
  ?.deriveChild('m/0/2')
  .privateKey.toAddress()
  .toString()

const chatAddress = hdpk
  ?.deriveChild('m/0/7')
  .privateKey.toAddress()
  .toString()

// 查阅聊天地址的协议节点
const addresses = [
  'n4NkCbTPRBAXiHBgDDbxQRSgiCdbCszCC1',
  'my7uCMarXuixoG9SsgGFp63RAt9Co9LDt5',
  'mx3KN1q9C6Ydmk9Fjv2UoStC8g2m1hFrjF',
]

const resAddresses = ['ms458oCKAG8TbFKLpBqnDfRVRtL98o1UoB', 'n3PXm5ogEgdUrDwqj5RAdtqueGed3Bvd5v']
const paths = []
for (let i = 0; i < addresses.length; i++) {
  const address = addresses[i]
  for (let j = 0; j < 100; j++) {
    const path = hdpk?.deriveChild(`m/0/${j}`)
    const pathAddress = path?.privateKey.toAddress().toString()
    if (pathAddress === address) {
      paths.push(`m/0/${j}`)
    }
  }
}

const resPaths = []
for (let i = 0; i < resAddresses.length; i++) {
  const address = resAddresses[i]
  for (let j = 0; j < 100; j++) {
    const path = hdpk?.deriveChild(`m/0/${j}`)
    const pathAddress = path?.privateKey.toAddress().toString()
    if (pathAddress === address) {
      resPaths.push({
        path: `m/0/${j}`,
        address,
      })
    }
  }
}

const savedProtocols = user?.wallet?.wallet?.userProtocols

console.log({ paths, resPaths, savedProtocols })

// fetch(url, {})

// wallet?.getProtocols({}).then(protocols => {
//   console.log({ protocols })
// })
</script>
