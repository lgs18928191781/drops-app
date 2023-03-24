<template>
  <div class="h-full flex flex-v">
    <div class="header">
      <a class="back flex flex-align-center" @click="$router.back()">
        <span class="icon-warp flex flex-align-center flex-pack-center">
          <Icon name="down" />
        </span>
        {{ $t('back') }}
      </a>
    </div>

    <ElSkeleton :loading="isSkeleton" animated>
      <div class="flex1 flex content-warp">
        <div
          class="content flex1"
          v-infinite-scroll="getMore"
          :infinite-scroll-immediate="false"
          :infinite-scroll-distance="100"
          :infinite-scroll-disabled="isMobile"
        >
          <div class="title">你是否赞成MetaCoin的分发机制改为体积占比+最低费率</div>

          <div class="msg flex flex-align-center">
            <div class="flex1 flex flex-align-center">
              <div class="user flex flex-align-center">
                <UserAvatar :meta-id="''" :name="''" :meta-name="''" :image="''" />
                <span>缺角居士</span>
              </div>
              <span class="status">已结束</span>
            </div>
            <div class="share">
              {{ $t('DAO.Share') }}
            </div>
          </div>

          <div class="cont">
            Metacoin的初衷是作为Metaid应用的数据上链补贴，以激励用户通过Metaid协议上链数据，其基本计算依据是以当日上链数据的体积占比分配恒定的MC。如果用户通过每个Metaid应用的上链费率是相同的，则体积占比是竞争公平的。但随着BSV网络的降费进展，不同矿池出现了不同的费率，此时如果仅以体积占比计算，则在体积占比相同情形下，较低费率者恒能取得超额利润，而如果较低费率是不公开的且仅限于少数人，则此种费率恒定损害通过较高的公开费率上链者，这是不公平的竞争。长远来看，将持续破坏MC的激励机制。且考虑到BSV网络的费率调整进程将始终处于动态变化中，如果MC协议始终不考虑费率差异对竞争公平的影响，则MC的激励机制将大打折扣甚至倒塌，也会影响MetaId作为数据协议的成功。故本提案建议，在以体积占比作为MC的基础分配原则时，应当考虑费率因素，即只有不低于Metaid协议各应用公开采用的最低费率者才能纳入MC的体积占比，具体计算时可用实际费率/Metaid公开最低费率*体积计算。
          </div>

          <Card>
            <template #default>
              <div class="vote">
                <div class="title">{{ $t('DAO.Vote Title') }}</div>
                <div class="vote-list">
                  <a class="main-border" v-for="(item, index) in dafaultVoteOptions" :key="index">{{
                    item.name()
                  }}</a>
                </div>
              </div>
            </template>
          </Card>

          <div class="vote-record">
            <div class="title">{{ $t('DAO.Vote Records') }}</div>

            <div
              class="vote-record-list"
              v-infinite-scroll="getMore"
              :infinite-scroll-immediate="false"
              :infinite-scroll-distance="100"
              :infinite-scroll-disabled="!isMobile"
            >
              <div
                class="vote-record-item flex flex-align-center"
                v-for="(item, index) in records"
                :key="index"
              >
                <div class="user flex flex-align-center">
                  <UserAvatar :name="''" :meta-id="''" :image="''" :meta-name="''" />
                  <div class="flex1">
                    <div class="username">波动超人</div>
                    <div class="metaid">MetaID: 878465</div>
                  </div>
                </div>

                <div class="value flex1">
                  赞成
                </div>
                <div class="time">2020-04-26 11:30:12</div>
                <Icon name="link" class="link"></Icon>
              </div>

              <LoadMore :pagination="pagination" v-if="records.length" />
              <IsNull v-else />
            </div>
          </div>
        </div>

        <div class="right">
          <!-- Information -->
          <div class="section">
            <div class="title">{{ $t('DAO.Information') }}</div>
            <div class="cont">
              <div class="information-list">
                <!-- Proposal Type -->
                <div class="information-item ">
                  <div class="information-item-warp flex flex-align-center">
                    <div class="flex1 lable">{{ $t('DAO.Proposal Type') }}</div>
                    <div class="value">基本类型投票</div>
                  </div>
                </div>

                <!-- Start Time -->
                <div class="information-item ">
                  <div class="information-item-warp flex flex-align-center">
                    <div class="flex1 lable">{{ $t('DAO.Start Time') }}</div>
                    <div class="value">22-04-25 00:00</div>
                  </div>
                </div>

                <!-- End Time -->
                <div class="information-item ">
                  <div class="information-item-warp flex flex-align-center">
                    <div class="flex1 lable">{{ $t('DAO.End Time') }}</div>
                    <div class="value">22-04-25 00:00</div>
                  </div>
                </div>

                <!-- MetaDao -->
                <div class="information-item ">
                  <div class="information-item-warp flex flex-align-center">
                    <div class="flex1 lable">MetaDao</div>
                    <div class="value">67</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Result -->
          <div class="section">
            <div class="title">{{ $t('DAO.Result') }}</div>
            <div class="cont">
              <div class="result-list">
                <div
                  class="result-item "
                  v-for="(item, index) in Array.from({ length: 3 })"
                  :key="index"
                >
                  <div class="top flex flex-align-center">
                    <div class="value flex1">赞成</div>
                    <div class="count">77.36%</div>
                  </div>
                  <div class="proccess">
                    <ElProgress :percentage="100" :show-text="false" />
                  </div>
                  <div class="vote-number">
                    {{ $t('DAO.Vote Number') }}: <br />
                    1104089145462356 / 1427247729614899
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ElSkeleton>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { DAOVoteDefaultOption } from '@/enum'
import Card from '@/components/Card/Card.vue'
import { reactive, ref } from 'vue'
import IsNull from '@/components/IsNull/IsNull.vue'
import LoadMore from '@/components/LoadMore/LoadMore.vue'
import { initPagination } from '@/config'
import { isMobile } from '@/stores/root'

const i18n = useI18n()
const records: any = reactive([])
const isSkeleton = ref(true)
const pagination = reactive({ ...initPagination })

const dafaultVoteOptions = [
  {
    name: () => i18n.t('DAO.Approve'),
    value: DAOVoteDefaultOption.Approve,
  },
  {
    name: () => i18n.t('DAO.Opposition'),
    value: DAOVoteDefaultOption.Opposition,
  },
  {
    name: () => i18n.t('DAO.Abstain'),
    value: DAOVoteDefaultOption.Abstain,
  },
]

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
        if (isCover) records.length = 0
        if (res.data.list.length) {
          records.push(...res.data.list)
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
  if (pagination.loading || pagination.nothing) return
  pagination.loading = true
  pagination.page++
  getDatas().then(() => {
    pagination.loading = false
  })
}

getDatas().then(() => {
  isSkeleton.value = false
})
</script>

<style lang="scss" scoped src="./Detail.scss"></style>
