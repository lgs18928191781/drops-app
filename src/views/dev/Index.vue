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

console.log({ rootAddress, selfAddress, protocolsAddress, infoAddress, nameAddress, chatAddress })

// fetch(url, {})

// wallet?.getProtocols({}).then(protocols => {
//   console.log({ protocols })
// })
</script>
