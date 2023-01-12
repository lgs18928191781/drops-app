<template>
  <div
    class="fixed inset-0 bg-white dark:bg-gray-950 z-[999] flex items-center justify-center flex-col gap-y-4 text-base"
  >
    <img :src="LocationSearchImg" alt="" class="h-48 w-48 -mt-12" />
    <div class="flex gap-x-2 items-center">
      <Icon name="magnifying_glass" class="w-5 h-5 animate-bounce" />
      <div class="font-bold">{{ $t('Talk.MetaName.resolving') }}</div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import LocationSearchImg from '@/assets/images/location_search.svg?url'
import { sleep } from '@/utils/util'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const minResolveDuration = 1000 // 最少解析时间

async function resolveMetaName() {
  const start = Date.now()

  const { metaName } = route.params as { metaName: string }
  // 带.meta后缀的常规名，则先裁掉后缀；否则直接解析
  const metaNameWithoutSuffix = metaName.endsWith('.meta')
    ? metaName.slice(0, metaName.length - 5)
    : metaName

  // 解析metaName：sha256一次
  const encoder = new TextEncoder()
  const data = encoder.encode(metaNameWithoutSuffix)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)

  const hashArray = Array.from(new Uint8Array(hashBuffer))
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')

  // console.log({ metaNameWithoutSuffix, metaName, hashHex })
  // 保持最少解析时间
  const duration = Date.now() - start
  if (duration < minResolveDuration) {
    await sleep(minResolveDuration - duration)
  }

  return {
    communityId: hashHex,
    metaName,
  }
}

resolveMetaName().then(({ communityId, metaName }) => {
  // URI编码metaName
  const encodedMetaName = encodeURIComponent(metaName)
  // 跳转到communityId对应的社区
  const fullPath = route.fullPath.replace(encodedMetaName, communityId)

  router.push(fullPath)
})
</script>
