<template>
  <div class="h-full flex flex-v ">
    <div class="header flex flex-align-center">
      <div class="flex1">
        <span class="title">{{ $t('DAO.Proposal') }}</span>
      </div>
      <a class="main-border primary" @click="toCreate">{{ $t('DAO.New Proposal') }}</a>
    </div>

    <ElSkeleton :loading="isSkeleton" animated>
      <div
        class="proposal-list flex1"
        v-infinite-scroll="getMore"
        :infinite-scroll-immediate="false"
        :infinite-scroll-distance="100"
      >
        <RouterLink
          :to="{ name: 'talkDAOProposalDetail', params: { txId: '1' } }"
          class="proposal-item"
          v-for="item in proposal"
        >
          <!-- top -->
          <div class="top flex flex-align-center">
            <div class="flex1 flex flex-align-center">
              <span class="user flex flex-align-center">
                <UserAvatar :meta-id="''" :image="''" :meta-name="''" :name="''" />
                <span>proposal</span>
              </span>
              <span class="txid flex flex-align-center"><Icon name="link" /> asd4456</span>
              <span class="time">2019-02-45 12:45:12</span>
            </div>
            <span class="status">已结束</span>
          </div>

          <div class="title">你是否赞成MetaCoin的分发机制改为体积占比+最低费率</div>

          <div class="content">
            Metacoin的初衷是作为Metaid应用的数据上链补贴，以激励用户通过Metaid协议上链数据，其基本计算依据是以当日上链数据的体积占比分配恒定的MC。如果用户通过每个Metaid应用的上链费率是相同的，则体积占比是竞争公平的。但随着BSV网络的降费进展，不同矿池出现了不同的费率，此时如果仅以体积占比计算，则在体积占比相同情形下，较低费率者恒能取得超额利润，而如果较低费率是不公开的且仅限于少数人，则此种费率恒定损害通过较高的公开费率上链者，这是不公平的竞争。长远来看，将持续破坏MC的激励机制。且考虑到BSV网络的费率调整进程将始终处于动态变化中，如果MC协议始终不考虑费率差异对竞争公平的影响，则MC的激励机制将大打折扣甚至倒塌，也会影响MetaId作为数据协议的成功。故本提案建议，在以体积占比作为MC的基础分配原则时，应当考虑费率因素，即只有不低于Metaid协议各应用公开采用的最低费率者才能纳入MC的体积占比，具体计算时可用实际费率/Metaid公开最低费率*体积计算。
          </div>
        </RouterLink>

        <LoadMore :pagination="pagination" v-if="proposal.length" />
        <IsNull v-else />
      </div>
    </ElSkeleton>
  </div>
</template>

<script setup lang="ts">
import { initPagination } from '@/config'
import { reactive, ref } from 'vue'
import LoadMore from '@/components/LoadMore/LoadMore.vue'
import IsNull from '@/components/IsNull/IsNull.vue'
import { checkUserLogin } from '@/utils/util'
import { useRouter } from 'vue-router'

const pagination = reactive({ ...initPagination })
const proposal: any[] = reactive([])
const isSkeleton = ref(true)
const router = useRouter()

function getDatas(isCover = false) {
  return new Promise<void>(async (resolve, reject) => {
    setTimeout(() => {
      const res = {
        code: 0,
        data: {
          list: Array.from({ length: 12 }),
        },
      }
      if (res.code === 0) {
        if (isCover) proposal.length = 0
        if (res.data.list) {
          proposal.push(...res.data.list)
          pagination.nothing = false
        } else {
          pagination.nothing = true
        }
        resolve()
      }
    }, 1000)
  })
}

function getMore() {
  if (pagination.nothing || pagination.loading) return
  pagination.loading = true
  pagination.page++
  getDatas().then(() => {
    pagination.loading = false
  })
}

async function toCreate() {
  await checkUserLogin()
  router.push({
    name: 'talkDAOProposalCreate',
  })
}

getDatas(true).then(() => {
  isSkeleton.value = false
})
</script>

<style lang="scss" scoped src="./Index.scss"></style>
