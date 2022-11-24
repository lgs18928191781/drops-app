<template>
  <div class="menu-wrap">
    <ElDropdown trigger="click" @command="handleCommand">
      <a class="tools flex flex-align-center"
        >{{ $t('prices') }}{{ currentPrice }}
        <el-icon class="el-icon--right"><arrow-down /></el-icon>
      </a>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item :command="item.name" v-for="item in prices">{{
            item.name
          }}</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </ElDropdown>
  </div>
  <div class="nft-detail-wrap">
    <ElSkeleton :loading="isShowSkeleton" animated>
      <!-- 骨架屏 -->
      <template #template>
        <DetailSkeletonVue />
      </template>
      <template #default>
        <div class="top flex nftDetailContainer">
          <!-- 封面图 -->
          <div class="cover">
            <NFTCover
              :needGizp="true"
              :cover="[
                $filters.metafile(NFT.val!.coverUrl, 500),
                NFT.val!.nftBackIcon ? NFT.val!.nftBackIcon : undefined,
              ]"
              :is-show-prew="true"
              :is-lazy="false"
              :is-remint="NFT.val!.nftHasCompound"
              :blindBoxRest="NFT.val!.remain"
            />
          </div>

          <div class="cont flex1 flex flex-v">
            <div class="name flex flex-align-center">
              <ElPopover
                placement="bottom"
                :width="400"
                trigger="hover"
                popper-class="common-popover"
              >
                <template #reference>
                  <span class="text flex1">{{ NFT.val!.nftName }}</span>
                </template>
                {{ NFT.val!.nftName }}
              </ElPopover>

              <img :src="ShareIcon" :alt="$t('share')" @click="share" />
            </div>
            <div
              class="series-cert flex flex-align-center"
              v-if="NFT.val!.nftGenesisCertificationType"
            >
              <img src="@/assets/images/icon_cer_nft.png" />
              {{ $t('beCertedSeries') }}：{{ $t(NFT.val!.nftGenesisCertificationName) }}
            </div>
            <div class="creater-msg">
              <!-- 铸造者 -->
              <div class="author flex flex-align-center">
                <UserAvatar class="avatar" :meta-id="NFT.val!.foundryMetaId" />
                <div class="author-msg flex1">
                  <div class="creater">{{ $t('creater') }}: {{ NFT.val!.foundryName }}</div>
                  <div class="metaid" v-if="NFT.val!.foundryMetaId">
                    MetaID:{{ NFT.val!.foundryMetaId.slice(0, 6) }}
                  </div>
                </div>
              </div>

              <!-- 认证信息 -->
              <CertTemp
                :metaId="NFT.val!.foundryMetaId"
                :certed="NFT.val!.nftCertificationType === 1"
              />
            </div>

            <!-- 描述 -->
            <div class="drsc flex1 flex flex-v">
              <div class="title flex flex-align-center">
                <template v-if="NFT.val!.putAway">
                  {{ $t('seller') }}

                  <span>{{ NFT.val!.ownerName }}</span>
                  {{ $t('theIntro') }}：
                </template>
                <template v-else>{{ $t('drsc') }}:</template>
              </div>
              <div class="cont">
                {{
                  NFTMainMsgDesc && NFTMainMsgDesc.length > 60
                    ? NFTMainMsgDesc.slice(0, 60)
                    : NFTMainMsgDesc
                }}
                <a v-if="NFTMainMsgDesc && NFTMainMsgDesc.length > 60">
                  ...
                  <span @click="isShowDrscDetail = true">{{ $t('getmore') }}</span>
                </a>
              </div>
            </div>
            <div class="operate-warp flex flex-align-center">
              <!-- 非自己的 -->
              <template
                v-if="
                  !userStore.user ||
                    (userStore.user && userStore.user?.metaId !== NFT.val!?.ownerMetaId)
                "
              >
                <!-- 购买 -->
                <div
                  class="btn btn-block flex1 flex flex-align-center flex-pack-center"
                  :class="[
                    !NFT.val!?.putAway && !blindBoxPage ? 'btn-gray' : blindBoxPage ? 
                    NFT.val!?.remain > 0 ? '' : 'btn-noColor' : ''
                  ]"
                  @click="startBuy"
                >
                  <template v-if="NFT.val!?.putAway && !NFT.val!?.uuid">
                    {{ i18n.locale.value === 'zh' ? `以 ${price}  购买` : `Buy Now At ${price} ` }}
                  </template>
                  <template v-else-if="NFT.val!?.putAway && NFT.val!?.uuid">
                    {{ i18n.locale.value === 'zh' ? `以 ${price} 购买` : `Buy Now At ${price}` }}
                  </template>
                  <template v-else>{{ $t('isBeBuyedOrCanceled') }}</template>
                </div>
              </template>
              <!-- 自己的 -->
              <template
                v-else-if="
                  userStore.user! && userStore.user?.metaId === NFT.val!.ownerMetaId
                "
              >
                <div class="flex flex-align-center putAway-warp flex1" v-if="NFT.val!.putAway">
                  <div
                    class="btn btn-block btn-plain flex1 flex flex-align-center flex-pack-center"
                    @click="offSale"
                  >
                    {{ $t('offsale') }}
                  </div>
                </div>
                <div
                  class="btn btn-block flex1 flex flex-align-center flex-pack-center"
                  v-else
                  @click="toSale"
                >
                  {{ $t('sale') }}
                </div>
              </template>
            </div>
          </div>
        </div>
        <div class="bottom">
          <div class="bottom-warp">
            <div class="tab">
              <a
                :class="{ active: index === tabIndex }"
                v-for="(tab, index) in tabs"
                :key="index"
                @click="changeTabIndex(index)"
                >{{ $t(tab.key) }}</a
              >
            </div>
            <div class="tab-cont">
              <!-- 作品细节 -->
              <div class="work-deail" v-if="tabIndex === 0">
                <div class="work-deail-section">
                  <div class="work-detail-item flex flex-align-center">
                    <div class="key">{{ $t('workname') }}：</div>
                    <div class="value flex1">{{ NFT.val!.nftName }}</div>
                  </div>
                  <div class="work-detail-item flex flex-align-center">
                    <div class="key">{{ $t('workclass') }}：</div>
                    <div class="value flex1">
                      <template v-if="NFT.val!.classify && NFT.val!.classify.length > 0">
                        <span v-for="item in NFT.val!.classify" :key="item">{{
                          item === 'avatar' ? $t('profilepic') : $t(item)
                        }}</span>
                      </template>
                      <template v-else>--</template>
                    </div>
                  </div>
                  <!-- 作品链接 -->
                  <div
                    class="work-detail-item flex flex-align-center"
                    v-if="
                      NFT.val!.classify.find(item => item === 'article') &&
                        NFT.val!.classify.find(item => item === 'rights')
                    "
                  >
                    <div class="key">{{ $t('worklink') }}：</div>
                    <div class="value flex1">
                      <a class="link" :href="NFT.val!.nftWebsite" target="_blank">{{
                        $t('workdetaillink')
                      }}</a>
                    </div>
                  </div>
                  <div class="work-detail-item flex flex-align-baseline">
                    <div class="key">{{ $t('workdrsc') }}：</div>
                    <div class="value flex1">
                      <pre>{{ NFT.val!.describe }}</pre>
                    </div>
                  </div>
                </div>
                <div class="work-deail-section">
                  <div class="work-detail-item flex flex-align-center">
                    <div class="key">{{ $t('createtime') }}：</div>
                    <div class="value flex1">{{ $filters.dateTimeFormat(NFT.val!.forgeTime) }}</div>
                  </div>
                  <div
                    class="work-detail-item flex flex flex-align-baseline"
                    v-if="NFT.val!.sellTxId !== '' && !NFT.val!?.uuid"
                  >
                    <div class="key">{{ $t('contractaddr') }}：</div>
                    <div class="value flex1 nowrap">
                      {{ NFT.val!.sellTxId }}
                      <a class="copy" @click="copy(NFT.val!.sellTxId)">{{ $t('copy') }}</a>
                      <a class="copy" @click="toWhatsonchain(NFT.val!.sellTxId)">{{
                        $t('look')
                      }}</a>
                    </div>
                  </div>
                  <div class="work-detail-item flex flex-align-center">
                    <div class="key">TokenID：</div>
                    <div class="value flex1 nowrap">
                      {{ NFT.val!.tokenId }}
                      <a class="copy" @click="copy(NFT.val!.tokenId)">{{ $t('copy') }}</a>
                      <!-- <a class="copy" @click="toWhatsonchain(NFT.val!.tokenId)">{{ $t('look') }}</a> -->
                    </div>
                  </div>
                  <div class="work-detail-item flex flex-align-center">
                    <div class="key">{{ $t('issueMetaTxId') }}：</div>
                    <div class="value flex1 nowrap">
                      {{ NFT.val!.issueMetaTxId }}
                      <a class="copy" @click="copy(NFT.val!.issueMetaTxId)">{{ $t('copy') }}</a>
                      <a class="copy" @click="toWhatsonchain(NFT.val!.issueMetaTxId)">
                        {{ $t('look') }}
                      </a>
                    </div>
                  </div>
                </div>
                <div class="work-deail-section">
                  <div class="work-detail-item flex flex-align-center">
                    <div class="key">{{ $t('creater') }}：</div>
                    <div class="value flex1">
                      <div class="author flex flex-align-center">
                        <UserAvatar class="avatar" :meta-id="NFT.val!.foundryMetaId" />
                        <div class="author-msg flex1">
                          <div class="creater">{{ NFT.val!.foundryName }}</div>
                          <div class="metaid" v-if="NFT.val!.foundryMetaId">
                            MetaID: {{ NFT.val!.foundryMetaId.slice(0, 6) }}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="work-detail-item flex flex-align-center">
                    <div class="key">{{ $t('haveder') }}：</div>
                    <div class="value flex1">
                      <div class="author flex flex-align-center">
                        <UserAvatar class="avatar" :meta-id="NFT.val!.ownerMetaId" />
                        <div class="author-msg flex1">
                          <div class="creater">
                            {{ NFT.val!.ownerName ? NFT.val!.ownerName : NFT.val!.ownerAddress }}
                          </div>
                          <div class="metaid" v-if="NFT.val!.ownerMetaId">
                            MetaID:{{ NFT.val!.ownerMetaId.slice(0, 6) }}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="remark">
                  <div class="remark-item">
                    {{ $t('remark1') }}
                  </div>
                  <div class="remark-item">{{ $t('remark2') }}</div>
                  <div class="remark-item">{{ $t('remark3') }}</div>
                </div>
              </div>

              <!-- 拥有记录 -->
              <div class="haved-record" v-else-if="tabIndex === 1">
                <div class="tr th flex flex-align-center">
                  <span class="td flex1">{{ $t('owner') }}</span>
                  <span class="td flex1">{{ $t('role') }}</span>
                  <span class="td flex1">{{ $t('time') }}</span>
                  <span class="td  price flex1">{{ $t('price') }}</span>
                </div>

                <!-- 历史拥有者 -->
                <div
                  class="tr flex flex-align-center"
                  v-for="(record, index) in records"
                  :key="record.timestamp"
                >
                  <img class="tobe" :src="ListIcon" v-if="index !== 0" />
                  <span class="td flex1 user flex flex-align-center" @click="ToUser(record.metaId)">
                    <UserAvatar class="avatar" :meta-id="record.metaId" />
                    <span class="name">{{ record.name }}</span>
                  </span>
                  <span class="td role flex1 flex flex-align-center">
                    <template v-if="index === records.length - 1">
                      <img :src="CastingIcon" />
                      {{ $t('creater') }}
                    </template>
                    <template v-else>{{
                      index === 0 ? $t('haveder') : $t('histsoryowner')
                    }}</template>
                  </span>
                  <span class="td time flex1">{{
                    $filters.dateTimeFormat(record.timestamp, 'YYYY-MM-DD HH:mm')
                  }}</span>
                  <span class="td price flex1"
                    >{{
                      record.satoshisPrice
                        ? $filters.bsv(record.satoshisPrice) + 'BSV'
                        : $t('noPaid')
                    }}
                  </span>
                  <a class="link" @click="toWhatsonchain(record.txId)"><img :src="LinkIcon"/></a>
                </div>

                <LoadMore
                  :showMoreButton="true"
                  :pagination="ownerHistoryPagination"
                  @getMore="getMoreRecords"
                  v-if="records.length > ownerHistoryPagination.pageSize"
                />
              </div>
            </div>
          </div>
        </div>
      </template>
    </ElSkeleton>
  </div>

  <!-- pay confirm -->
  <PayConfirmVue
    :visible="isShowConfirm"
    :genesis="NFT.val?.genesis"
    :codehash="NFT.val?.codeHash"
    :token-index="NFT.val?.tokenIndex"
    :isLegal="isLegal"
    :uuid="NFT.val?.uuid"
    @close="isShowConfirm = false"
    @success="buySuccess"
    :price="price"
    :blindBoxPage="blindBoxPage"
  ></PayConfirmVue>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed, watch } from 'vue'
import DetailSkeletonVue from './DetailSkeleton.vue'
import NFTCover from '@/components/NFT/Cover.vue'
import CertTemp from '@/components/Cert/Cert.vue'
import { useUserStore } from '@/stores/user'
import { useRoute } from 'vue-router'
import NFTDetail from '@/utils/nftDetail'
import { GetLegalNftDetail } from '@/api/legal'
import ShareIcon from '@/assets/images/icon_share.svg?url'
import { useI18n } from 'vue-i18n'
import ListIcon from '@/assets/images/list_icon_ins.svg?url'
import CastingIcon from '@/assets/images/icon_casting.svg?url'
import { GetNftHolderList } from '@/api/aggregation'
import { pagination } from '@/config'
import { Decimal } from 'decimal.js'
import LinkIcon from '@/assets/images/list_icon_link.svg?url'
import { ArrowDown } from '@element-plus/icons-vue'
import { useRootStore } from '@/stores/root'
import PayConfirmVue from '@/components/PayConfirm/PayConfirm.vue'
import { UnitName } from '@/config'

const isShowSkeleton = ref(true)
const isShowDrscDetail = ref(false)
const userStore = useUserStore()
const route = useRoute()
const i18n = useI18n()
const tabIndex = ref(0)
const rootStore = useRootStore()
// setTimeout(() => {
//   isShowSkeleton.value = false
// }, 3000)
const currentPrice = computed(() => {
  return rootStore.currentPrice
})

const blindBoxPage = computed(() => {
  return route.name === 'blindBoxDetail'
})
const price = ref('0')
const NFT: { val: NftItemDetail | null } = reactive({
  val: null,
})
const tabs = [
  { name: i18n.t('workdetail'), key: 'workdetail' },
  { name: i18n.t('possessionrecord'), key: 'possessionrecord' },
]
const records: GetNftHolderListResItem[] = reactive([])

const ownerHistoryPagination = reactive({
  ...pagination,
})

const ownerRecord: { val: GetNftHolderListResItem | null } = reactive({
  val: null,
})

const issueRecord: { val: GetNftHolderListResItem | null } = reactive({
  val: null,
})

const isLegal = computed(() => {
  return route.name === 'legaldetail'
})

const isShowConfirm = ref(false)

const cnyMode = computed(() => {
  return rootStore.currentPrice == UnitName.RMB
})

const prices = reactive([
  {
    name: 'BSV',
    key: 'bsv',
  },
  {
    name: 'CNY',
    key: 'cny',
  },
])

const NFTMainMsgDesc = computed(() => {
  // 1. 是否拍卖 显示拍卖描述 2. 是否上架 显示上架描述 3.下架状态 显示 NFT 的描述
  return NFT.val!.isAuction
    ? NFT.val!.describe
    : NFT.val!.putAway
    ? NFT.val!.sellDesc
    : NFT.val!.describe
})

watch(
  () => NFT.val,
  newVal => {
    if (newVal) {
      price.value = converterPrice(newVal.amount)
    }
  }
)

function handleCommand(command: string) {
  rootStore.changePrices(command)
  console.log('command', command)
}

function converterPrice(amount: number) {
  if (amount) {
    return new Decimal(amount).div(10 ** 8).toString() + ' ' + 'BSV'
  } else {
    return '--'
  }
}

function changeTabIndex(index: number) {
  if (tabIndex.value === index) {
    return
  }
  tabIndex.value = index
}

function copy(value: string) {
  //   toClipboard(value)
  //     .then(() => {
  //       ElMessage.success(i18n.t('copysuccess'))
  //     })
  //     .catch(() => {
  //       ElMessage.success(i18n.t('copyerror'))
  //     })
}

function toWhatsonchain(txId: string) {
  window.open(`https://whatsonchain.com/tx/${txId}`)
}

function ToUser(metaId: string) {}

function startBuy() {
  if (NFT.val!.sellState !== 0) return
  if (isLegal.value && !cnyMode.value) {
    return ElMessage.error(`${i18n.t('notSupportBsvBuyLegal')}`)
  }
  isShowConfirm.value = true
}

function getDetail() {
  return new Promise<void>(async resolve => {
    let _nft
    if (route.name === 'legaldetail') {
      const res: any = await GetLegalNftDetail({
        uuid: typeof route.params.uuid === 'string' ? route.params.uuid : '',
      }).catch(() => (isShowSkeleton.value = false))
      if (res?.code == 0) {
        _nft = res.data
      }
    } else {
      _nft = await NFTDetail(
        typeof route.params.genesisId === 'string' ? route.params.genesisId : '',
        typeof route.params.codehash === 'string' ? route.params.codehash : '',
        typeof route.params.tokenIndex === 'string' ? route.params.tokenIndex : ''
      ).catch(() => (isShowSkeleton.value = false))
    }

    if (_nft && typeof _nft !== 'boolean') {
      NFT.val! = _nft

      if (route.name === 'legaldetail') {
        NFT.val!.classify = _nft.nftClassifyList
        NFT.val!.foundryMetaId = _nft.nftIssueMetaId
        NFT.val!.issueUserAvatarType = _nft.nftIssueAvatarType
        NFT.val!.foundryName = _nft.nftIssuer
        NFT.val!.coverUrl = _nft.nftBackIcon || _nft.nftIcon
        NFT.val!.putAway = true
        NFT.val!.ownerMetaId = _nft.nftOwnerMetaId
        NFT.val!.ownerAvatarType = _nft.nftOwnerAvatarType
        NFT.val!.ownerName = _nft.nftOwnerName
        NFT.val!.describe = _nft.nftDesc
        NFT.val!.tokenId = _nft.nftTokenId
        NFT.val!.issueMetaTxId = _nft.nftIssueMetaTxId
        NFT.val!.genesis = _nft.nftGenesis
        NFT.val!.codeHash = _nft.nftCodehash
        NFT.val!.tokenIndex = _nft.nftTokenIndex
        NFT.val!.sellState = _nft.nftSellState
        NFT.val!.sellDesc = _nft.nftSellDesc
      }

      console.log('zxzxzx222asas', NFT.val!)

      // 获取 NFT 费率
      if (route.name !== 'legaldetail') {
        // await getNftFeePercent()
      } else {
        // await getlegalFeePercent(_nft)
      }
      // countDownTimeLeft()
      isShowSkeleton.value = false
    }
    resolve()
  })
}

// async function getNftFeePercent() {
//   return new Promise<void>(async resolve => {
//     const res = await GetFeeInfo({
//       codehash: route.params.codehash,
//       genesis: route.params.genesisId,
//     })
//     if (res.code === 0) {
//       nftPlatformPercent.value = NFT.val!.nftIsFirstSell
//         ? res.data.first_platform
//         : res.data.other_platform
//       nftRoyaltyPercent.value = NFT.val!.nftIsFirstSell
//         ? res.data.first_royalty
//         : res.data.other_royalty
//     }
//     resolve()
//   })
// }

function offSale() {
  //   const loading = ElLoading.service({
  //     lock: true,
  //     text: 'Loading',
  //     spinner: 'el-icon-loading',
  //     background: 'rgba(0, 0, 0, 0.7)',
  //     customClass: 'full-loading',
  //   })
  //   ElMessageBox.confirm(`${i18n.t('offsaleConfirm')} ${NFT.val!.nftName} ?`, i18n.t('niceWarning'), {
  //     confirmButtonText: i18n.t('confirm'),
  //     cancelButtonText: i18n.t('cancel'),
  //     closeOnClickModal: false,
  //   })
  //     .then(async () => {
  //       if (route.name === 'legaldetail') {
  //         loading.close()
  //       } else {
  //         NftOffSale(NFT.val!, loading)
  //           .then(() => {
  //             loading.close()
  //           })
  //           .catch(() => {
  //             loading.close()
  //           })
  //       }
  //     })
  //     .catch(() => loading.close())
}

function toSale() {}

// 分享
function share() {
  //   const value = `${i18n.t('shareText1')}\r\n ${NFT.val!.nftName}：${window.location.href}`
  //   toClipboard(value)
  //     .then(() => {
  //       ElMessage.success(i18n.t('copyShareSuccess'))
  //     })
  //     .catch(() => {
  //       ElMessage.success(i18n.t('copyerror'))
  //     })
}

//  获取拥有记录
async function getNftHolderList(isCover = false) {
  return new Promise(async resolve => {
    let res
    if (route.name === 'legaldetail') {
      res = await GetNftHolderList({
        genesis: NFT.val!.nftGenesis ? NFT.val!.nftGenesis : '',
        codehash: NFT.val!.nftCodehash ? NFT.val!.nftCodehash : '',
        tokenIndex: NFT.val!.nftTokenIndex ? NFT.val!.nftTokenIndex : '',
        page: ownerHistoryPagination.page.toString(),
        pageSize: ownerHistoryPagination.pageSize.toString(),
      })
      console.log('x222xzxz', res)
    } else {
      res = await GetNftHolderList({
        genesis: typeof route.params.genesisId === 'string' ? route.params.genesisId : '',
        codehash: typeof route.params.codehash === 'string' ? route.params.codehash : '',
        tokenIndex: typeof route.params.tokenIndex === 'string' ? route.params.tokenIndex : '',
        page: ownerHistoryPagination.page.toString(),
        pageSize: ownerHistoryPagination.pageSize.toString(),
      })
    }

    if (res && res.code === 0) {
      if (isCover) {
        records.length = 0
      }
      records.push(...res.data.results.items.holderList)
      console.log('x222xxxxxxxxxxxzxz', records)
      ownerRecord.val = res.data.results.items.owner
      issueRecord.val = res.data.results.items.issuer
      const totalPages = Math.ceil(res.data.total / ownerHistoryPagination.pageSize)
      if (totalPages <= ownerHistoryPagination.page) {
        ownerHistoryPagination.nothing = true
      }
    }
  })
}

function getMoreRecords() {
  ownerHistoryPagination.loading = true
  ownerHistoryPagination.page++
  getNftHolderList().then(() => {
    ownerHistoryPagination.loading = false
  })
}

onMounted(() => {
  if (route.params.genesisId && route.params.codehash && route.params.tokenIndex) {
    getDetail()
    getNftHolderList()
  }
})
</script>

<style lang="scss" src="./NftDetail.scss"></style>
