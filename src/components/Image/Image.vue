<template>
  <ElSkeleton :loading="isSkeleton" animated>
    <template #template>
      <ElSkeletonItem variant="image" />
    </template>
    <template #default>
      <img ref="imgRef" :src="url" class="image" @error="fail" />
    </template>
  </ElSkeleton>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { DB } from '@/utils/db'
import { metafile } from '@/utils/filters'

const Default =
  'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/PjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+PHN2ZyBmaWxsPSIjOTA5Mzk5IiB0PSIxNjU2MDc5MTEyMDU5IiBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjE4NDk0IiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgd2lkdGg9IjIwMCIgaGVpZ2h0PSIyMDAiPjxkZWZzPjxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+QGZvbnQtZmFjZSB7IGZvbnQtZmFtaWx5OiBmZWVkYmFjay1pY29uZm9udDsgc3JjOiB1cmwoIi8vYXQuYWxpY2RuLmNvbS90L2ZvbnRfMTAzMTE1OF91Njl3OHloeGR1LndvZmYyP3Q9MTYzMDAzMzc1OTk0NCIpIGZvcm1hdCgid29mZjIiKSwgdXJsKCIvL2F0LmFsaWNkbi5jb20vdC9mb250XzEwMzExNThfdTY5dzh5aHhkdS53b2ZmP3Q9MTYzMDAzMzc1OTk0NCIpIGZvcm1hdCgid29mZiIpLCB1cmwoIi8vYXQuYWxpY2RuLmNvbS90L2ZvbnRfMTAzMTE1OF91Njl3OHloeGR1LnR0Zj90PTE2MzAwMzM3NTk5NDQiKSBmb3JtYXQoInRydWV0eXBlIik7IH0KPC9zdHlsZT48L2RlZnM+PHBhdGggZD0iTTY5Ni40MyA0NjUuMjVjNDAuNjEgMCA3My41My0zMi43MiA3My41My03My4wOXMtMzIuOTYtNzMuMDgtNzMuNTMtNzMuMDgtNzMuNTQgMzIuNzItNzMuNTQgNzMuMDggMzIuOTIgNzMuMDkgNzMuNTQgNzMuMDl6TTUzNS43NCA2NTAuNjJsLTI3My42MS0yNTkuNGE1Ni4xOSA1Ni4xOSAwIDAgMC0xNS4zNiAxMS41OGwtMTE0IDExOS42My02LTIyMi43N2MtMC43My0yNi44MiAyMC44NC00OS40MSA0Ny42Ny01MC4xNGwyMDEuNzctNS40NCA0Ny4zNC01MC0yNTAuNDMgNi43NUMxMTkgMjAyLjMzIDc2LjMzIDI0Ny4xNyA3Ny43OCAzMDFsNy4zMiAyNzEuNCA0LjUgMTY2Ljc4QzkxLjA2IDc5MyAxMzYuMDUgODM1LjQ3IDE5MC4yIDgzNGwxNzYtNC43NSAxMi0wLjMyIDQ3LjM0LTUwIDExNi4xOC0xMjIuNjR6IiBwLWlkPSIxODQ5NSI+PC9wYXRoPjxwYXRoIGQ9Ik04NjEuNzEgMjE0LjhsLTI0Mi44My0zMy44Ni01NS4wOSA0MS40Nkw4NTUgMjYzYTQ5LjA1IDQ5LjA1IDAgMCAxIDQxLjc5IDU1LjEzbC01NC4zMyAzODkuNTktMTIwLjg3LTE1OS4wNUE1OS44NiA1OS44NiAwIDAgMCA2MzguMDYgNTM3bC00NCAzMy4wOCA2NS4wNyA4Ni4xNUw2MDMuODQgNjk4bC03OS41NyA2MC4xLTU0LjkyIDQxLjQ4IDM0LjE3IDQuNzYgMjcwLjczIDM3Ljc2YTk3LjU1IDk3LjU1IDAgMCAwIDEwOS44OC03OS42IDIyLjM3IDIyLjM3IDAgMCAwIDAuNjUtMy40NGw2MC41My00MzQuMTZjNy40NC01My4zMi0yOS45NS0xMDIuNjItODMuNi0xMTAuMXoiIHAtaWQ9IjE4NDk2Ij48L3BhdGg+PC9zdmc+'

interface Props {
  src: string
  customClass: string
  width: number
}
const props = withDefaults(defineProps<Props>(), {
  width: 235,
})

const imgRef = ref()

const isSkeleton = ref(true)
const url = ref('')

// 格式有问题的txid 要过滤不存本地
const filterTxids = [
  'metafile://09785e0ff9fffaee15a6e8f25b4390e86ed6a3646843bce2884a7a95c45e64d1.gif',
  'metafile://a48ac7831ceeacf283ad78da7edee14533b3e8992a33c0ec8d79322dc74e2f05.gif',
  'metafile://1a6346211a21d76aa82cf13f8c81ca17ea77607c729c904eb234a35b2e4c9643.gif',
  'metafile://a1e47d9f8ac015377353e5a507e8d802b4f1bbf679c14059dcd800f2d73bb66c.gif',
  'metafile://6d4c57fba123b8769495c76e22c7b90057e6ce32d443940c822c86d1a08c7c7a.gif',
  'metafile://b508e32cde3583bad834448fc474d46a81da06a760320d6e41fa2f4d68017319.gif',
  'metafile://46cd5737cab0806af07ed33de7487ddb793d1510c5bc32f9f2065c2aac464175.gif',
  'metafile://c878d8380aeefda88dd65246cf967748e3a46726fe0c7439b3b801aaad9cb129.gif',
  'metafile://0dc2634838fbd0a5d15649c9392d4c00f46bc491604f7918bc4f58445722a0a1.gif',
  'metafile://6d83a80c470c85cdf56c6f402bd810404c931b0408a986b73c1ee30c97ac0e49.gif',
]

setTimeout(async () => {
  let src = props.src
  if (filterTxids.includes(props.src)) {
    src = await metafile(props.src, -1)
  }
  DB.getMetaFile(src, props.width).then(res => {
    url.value = res
    isSkeleton.value = false
  })
})

function fail(event) {
  const img = event.srcElement
  img.src = Default
  img.onerror = null // 防止闪图
}

defineExpose({
  imgRef,
})
</script>

<style lang="scss" scoped src="./Image.scss"></style>
