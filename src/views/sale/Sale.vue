<template>
  <div class="create">
    <div class="create-header flex flex-align-center">
      <img class="icon" src="@/assets/images/bannet_icon_ins.svg" @click="$router.back()" />
      <div class="title flex1 flex flex-align-center">
        <span class="flex1">{{ $t('salenft') }}</span>
        <!-- <router-link :to="{ name: 'saleLegend' }"
          >{{ $t('saledrsc') }}<i class="el-icon-arrow-right"
        /></router-link> -->
      </div>
    </div>

    <div class="cont-warp">
      <div class="nft-sale-set">
        <!-- NFT 信息 卡片 -->
        <NftMsgCard
          :user-name="nft.val.foundryName"
          :cover-url="nft.val.coverUrl"
          :is-show-cert="true"
          :name="nft.val.nftName"
          :created-at="nft.val.forgeTime"
          :meta-id="nft.val.foundryMetaId"
        />

        <div class="form">
          <div class="form-item">
            <div class="cont flex flex-align-center">
              <textarea v-model="saleIntro" :placeholder="$t('offSaleIntro')"></textarea>
            </div>
          </div>
          <div class="form-item">
            <!-- <div class="title">时间</div> -->
            <div class="cont flex flex-align-center">
              <!-- <input
                v-model="$filters.dateTimeFormat(saleTime)"
                :placeholder="$t('timeplac')"
                type="datetime"
                class="flex1"
              />
               -->
              <ElDatePicker
                class="el-datetime flex1"
                v-model="saleTime"
                :editable="false"
                :clearable="false"
                :disabledDate="setDisabledDate"
                type="datetime"
                :placeholder="$t('timeplac')"
              >
              </ElDatePicker>
              <img class="icon" src="@/assets/images/list_icon_calendar.svg" />
            </div>
          </div>
          <div class="form-item">
            <!-- <div class="title">价格</div> -->
            <div class="cont flex flex-align-center">
              <input
                v-model="saleAmount"
                :placeholder="
                  $t('priceplac') +
                  new Decimal(Math.pow(10, 8)).div(units[unitIndex].sats).mul(0.00001)
                "
                @change="saleAmountChange"
                type="number"
                class="flex1"
              />
              <div class="type">
                <ElDropdown trigger="click">
                  <span class="flex flex-align-center">
                    {{ units[unitIndex].unit }} <span class="arrow"></span>
                  </span>
                  <template #dropdown>
                    <el-dropdown-menu>
                      <el-dropdown-item
                        v-for="(unit, index) in units"
                        :key="index"
                        @click="changeUnitIndex(index)"
                        >{{ unit.unit }}</el-dropdown-item
                      >
                    </el-dropdown-menu>
                  </template>
                </ElDropdown>
              </div>
            </div>
          </div>
          <!-- <div class="to-histiry">
            <a>{{ $t('seehistoryprice') }}</a>
          </div> -->
        </div>
        <div class="btn btn-block" :class="{'btn-gray': saleIntro === '' || saleAmount === '' || saleTime === ''}" @click="confirmSale">{{ $t('confirmsale') }}</div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { GetMyNftEligibility, GetNftDetail, Langs, NftApiCode, SaleNft, SetDeadlineTime } from '@/api'
import { reactive, ref } from '@vue/reactivity'
import { useRoute, useRouter } from 'vue-router'
import {
  ElDropdown,
  ElDropdownItem,
  ElDropdownMenu,
  ElMessage,
  ElDatePicker,
  ElLoading,
  ElMessageBox,
} from 'element-plus'
import { useI18n } from 'vue-i18n'
import { store } from '@/store'
import Decimal from 'decimal.js-light'
import NftMsgCard from '@/components/NftMsgCard/NftMsgCard.vue'
import { units } from '@/config'
import NFTDetail from '@/utils/nftDetail'

const i18n = useI18n()
const route = useRoute()
const router = useRouter()
const unitIndex = ref(0)

// @ts-ignore
const nft: { val: NftItemDetail } = reactive({
  val: {},
})

const saleTime = ref('')
const saleAmount = ref('')
const saleIntro = ref('')

function getDetail() {
  return new Promise<void>(async (resolve) => {
    const _nft = await NFTDetail(
      typeof route.params.genesisId === 'string' ? route.params.genesisId : '',
      typeof route.params.codehash === 'string' ? route.params.codehash : '',
      typeof route.params.tokenIndex === 'string' ? route.params.tokenIndex : '',
    ).catch(() => {})
    if (_nft && typeof _nft !== 'boolean') {
      nft.val = _nft
    }
    resolve()
  })
}

if (route.params.genesisId && route.params.codehash && route.params.tokenIndex) {
  getDetail()
}

function saleAmountChange() {
  const min = 0.00001
  if (new Decimal(saleAmount.value).toNumber() <= min) {
    saleAmount.value = min.toString()
  }
}

async function confirmSale() {
  
  if (saleTime.value === '' || saleAmount.value === '' || saleIntro.value === '') return

  // 檢查是否有權限
  const res = await GetMyNftEligibility({
    MetaId: store.state.userInfo!.metaId,
    IssueMetaId: nft.val.foundryMetaId,
    lang: i18n.locale.value === 'en' ? Langs.EN : Langs.CN
  })
  if (res.code !== 0) {
    ElMessage.error(res.data)
    return
  }

  const loading = ElLoading.service({
    lock: true,
    text: 'Loading',
    spinner: 'el-icon-loading',
    background: 'rgba(0, 0, 0, 0.7)',
    customClass: 'full-loading',
  })
  const stasPrice =
    units[unitIndex.value].unit === 'BSV'
      ? new Decimal(saleAmount.value).mul(Math.pow(10,8)).toNumber()
      : new Decimal(saleAmount.value).toNumber()
  const params = {
    codehash: nft.val!.codeHash,
    genesis: nft.val!.genesis,
    tokenIndex: nft.val!.tokenIndex,
    satoshisPrice: stasPrice,
    genesisTxid: nft.val!.genesisTxId,
    sensibleId: nft.val.sensibleId,
    sellDesc: saleIntro.value
  }
  const useAmountRes = await store.state.sdk?.nftSell({ checkOnly: true, ...params }).catch(() => {
    loading.close()
  })
  alert('sell result' + JSON.stringify(useAmountRes))
  if (useAmountRes && useAmountRes.code === 200) {
    alert('sell a')
    const useAmount = useAmountRes.data.amount!
    alert('sell b')
    const userBalanceRes = await store.state.sdk?.getBalance()
    alert('sell c')
    alert('userBalanceRes c'+  userBalanceRes)
    if (userBalanceRes?.code === 200) {
      alert('sell d')
      alert('userBalanceRes.data.satoshis' + userBalanceRes.data.satoshis)
      alert('useAmount' + useAmount)
      if (userBalanceRes.data.satoshis > useAmount) {
        alert('sell e')
        // 余额足够
        ElMessageBox.confirm(`${i18n.t('useAmountTips')}: ${useAmount} SATS`, i18n.t('niceWarning'), {
          confirmButtonText: i18n.t('confirm'),
          cancelButtonText: i18n.t('cancel'),
          closeOnClickModal: false
        }).then(async () => {
          alert('sell f')
          // 确认支付
          const res = await store.state.sdk?.nftSell(params).catch(() => {
            loading.close()
          })
          if (res?.code === 200) {
            alert('sell g')
            // 上报时间
            const response = await SetDeadlineTime({
              genesis: nft.val.genesis,
              codeHash: nft.val.codeHash,
              tokenIndex: nft.val.tokenIndex,
              deadlineTime: new Date(saleTime.value).getTime()
            }).catch((res) => alert('SetDeadlineTime response fail' + JSON.stringify(res)))
            alert('sell h')
            alert('SetDeadlineTime response' + JSON.stringify(response))
            if (response && response.code === NftApiCode.success) {
              alert('sell h')
              // 检查txId状态，确认上链后再跳转，防止上链延迟，跳转后拿不到数据
              await store.state.sdk?.checkNftTxIdStatus(res.data.sellTxId)
              alert('sell j')
              await store.state.sdk?.checkNftTxIdStatus(res.data.txid)
              alert('sell k')
              ElMessage.success(i18n.t('saleSuccess'))
              alert('sell l')
              router.back()
            }

            // sell协议上完 要上报服务器
            // const response = await SaleNft({
            //   sellValidTime: new Date(saleTime.value).getTime(),
            //   amount: stasPrice,
            //   tokenId: nft.val!.tokenId,
            //   sellTxId: res.data.sellTxId,
            // })
            // if (response.code === NftApiCode.success) {
            //   ElMessage.success(i18n.t('saleSuccess'))
            //   router.back()
            // }
          }
          loading.close()
        })
        .catch(() => loading.close())
      } else {
        loading.close()
        ElMessageBox.alert(
          `
          <p>${i18n.t('useAmountTips')}: ${useAmount} SATS</p>
          <p>${i18n.t('insufficientBalance')}</p>
        `,
          {
            confirmButtonText: i18n.t('confirm'),
            dangerouslyUseHTMLString: true,
          }
        )
        return
      }
    }
  }

  

  // const lineRes = await store.state.sdk?.nftSell(params)
  // if (lineRes && lineRes.code === 200) {
  //   // 上架完 要上链 sell 协议
  //   const sellProtocolRes = await store.state.sdk?.createNftSellProtocol({
  //     txid: lineRes.data.txId, // sell txId string
  //     sellTxId: lineRes.data.sellTxId, // sellUtxoTxId
  //     sellTxHex: lineRes.data.sellTxHex,  // sell的utxo
  //     createdAt: new Date().getTime(), // 创建时间
  //     ...params
  //   })
  //   if (sellProtocolRes && sellProtocolRes.code === 200) {
  //     // sell协议上完 要上报服务器
  //     const res = await SaleNft({
  //       sellValidTime: new Date(saleTime.value).getTime(),
  //       amount: saleAmount.value,
  //       tokenId: nft.val!.tokenId,
  //       sellTxId: lineRes.data.sellTxId
  //     })
  //     if (res.code === NftApiCode.success) {
  //       ElMessage.success(i18n.t('saleSuccess'))
  //       router.back()
  //     }
  //   }
  // }
  
}

const setDisabledDate = (time: string) => {
  const now = new Date().getTime() + 1000 * 60 * 30
  return new Date(time).getTime() < now
}

// 更改单位
function changeUnitIndex(index: number) {
  if (unitIndex.value === index) return
  if (saleAmount.value !== '') {
    const oldSats = units[unitIndex.value].sats
    const newSats = units[index].sats
    saleAmount.value = new Decimal(oldSats).div(newSats).mul(saleAmount.value).toString()
  }
  unitIndex.value = index
}
</script>
<style lang="scss" scoped src="./Sale.scss"></style>
