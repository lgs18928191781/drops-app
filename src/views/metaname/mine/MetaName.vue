<template>
  <div class="metaname-sm-container mine-metaname">
    <Navigation :list="[$t('MetaName.Mine'), $t('MetaName.Domain Name')]" />

    <ElSkeleton :loading="isSkeleton" animated>
      <Image
        :src="`metacontract://${metaName.val!.nftCodeHash}/${metaName.val!.genesisId}/${metaName.val!.tokenIndex}`"
        class="cover "
      />

      <div class="section">
        <div class="title">{{ $t('MetaName.Domain Configuration') }}</div>
        <div class="content">
          <template v-for="item in configs" :key="item.name">
            <template v-if="item.value">
              <div class="config-list flex flex-align-center">
                <div class="lable">{{ item.name }}</div>
                <div class="cont flex1 flex flex-align-center" v-if="item.value">
                  <div class="value flex1" @click="copyValue(item.value)">{{ item.value() }}</div>
                  <span class="edit flex">
                    <span class="not-set" v-if="!item.value()">{{ $t('MetaName.Not set') }}</span>
                    <Icon name="edit" @click="edit(item)" />
                  </span>
                </div>
              </div>
            </template>
            <template v-else>
              <div class="config-list flex ">
                <div class="lable">{{ item.name }}</div>
                <div class="cont flex1">
                  <div class="config-item flex" v-for="child in item.list!" :key="child.name">
                    <div class="key">{{ child.name }}</div>
                    <div class="value flex1" @click="copyValue(child.value)">
                      {{ child.value() }}
                    </div>
                    <span class="edit flex">
                      <span class="not-set" v-if="!child.value()">{{
                        $t('MetaName.Not set')
                      }}</span>
                      <Icon name="edit" @click="edit(child)" />
                    </span>
                  </div>
                </div>
              </div>
            </template>
          </template>
        </div>
      </div>

      <div class="section">
        <div class="title flex flex-align-center">
          <div class="flex1">
            {{ $t('MetaName.Domain name registration information') }}
          </div>
          <a class="btn primary" @click="isShowRenew = true">{{ $t('MetaName.Renew') }}</a>
        </div>
        <div class="content">
          <div class="info-list">
            <div class="info-item flex flex-align-center">
              <div class="flex1">
                <span class="label">{{ $t('MetaName.Registration time') }}</span>
              </div>
              <span class="value">
                <template v-if="isGetRegisterDateLoading">
                  <ElIcon class="is-loading">
                    <Loading />
                  </ElIcon>
                </template>
                <template v-else>{{ $filters.dateTimeFormat(registerDate) }} (UTC)</template>
              </span>
            </div>
            <div class="info-item flex flex-align-center">
              <div class="flex1">
                <span class="label">{{ $t('MetaName.Expire date') }}</span>
              </div>
              <span class="value flex flex-align-center">
                <template v-if="isGetExpireDateLoading">
                  <ElIcon class="is-loading">
                    <Loading />
                  </ElIcon>
                </template>
                <template v-else>{{ expireDate }} (UTC)</template>
                <el-tooltip
                  class="pre-line"
                  :content="$t('MetaName.Expire date Tips')"
                  placement="top"
                >
                  <Icon name="question_circle" />
                </el-tooltip>
              </span>
            </div>
          </div>

          <div class="info-list">
            <div class="info-item flex flex-align-center">
              <div class="flex1">
                <span class="label">{{ $t('MetaName.Transaction TX') }}</span>
              </div>
              <span class="value"
                ><a @click="tx(metaName.val!.txid)"
                  >{{metaName.val!.txid.slice(0,6)}}...{{metaName.val!.txid.slice(-6)}}</a
                ></span
              >
            </div>
          </div>
        </div>
      </div>
    </ElSkeleton>
  </div>

  <RenewModal
    v-model="isShowRenew"
    v-if="metaName.val"
    :metaname="metaName.val!.name"
    :expire-date="expireDate"
    :metafile="`metacontract://${metaName.val!.nftCodeHash}/${metaName.val!.genesisId}/${metaName.val!.tokenIndex}`"
    @success="getData"
  />
</template>

<script setup lang="ts">
import { GetTx } from '@/api'
import { useUserStore } from '@/stores/user'
import { copy, GetExpiredUTC, openLoading, tx } from '@/utils/util'
import { MetaNameReqCode } from '@/utils/wallet/hd-wallet'
import { ElMessageBox } from 'element-plus'
import { reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import Navigation from '../components/Navigation/Navigation.vue'
import RenewModal from '../components/RenewModal/RenewModal.vue'
import { Loading } from '@element-plus/icons-vue'
import { GetMetaNameInfo, MetaNameBeforeReqRes, MetaNameUpdateInfo } from '@/api/wxcore'
import { getMetaNameOperateParams } from '@/utils/metaname'

const route = useRoute()
const userStore = useUserStore()
const isShowRenew = ref(false)

const configs = reactive([
  {
    name: 'METAID',
    key: 'metaid',
    value: () => metaName.val?.infos.metaid || '',
  },
  {
    name: 'ADDRESSES',
    list: [
      {
        name: 'ETH',
        key: 'eth',
        value: () => metaName.val?.infos.eth || '',
      },
      {
        name: 'Polygon',
        key: 'polygon',
        value: () => metaName.val?.infos.polygon || '',
      },
      {
        name: 'Solana',
        key: 'solana',
        value: () => metaName.val?.infos.solana || '',
      },
      {
        name: 'MVC',
        key: 'mvc',
        value: () => metaName.val?.infos.mvc || '',
      },
      {
        name: 'BSV',
        key: 'BSV',
        value: () => metaName.val?.infos.BSV || '',
      },
      {
        name: 'IPFS',
        key: 'IPFS',
        value: () => metaName.val?.infos.IPFS || '',
      },
      {
        name: 'MetaFile',
        key: 'icon',
        value: () => metaName.val?.infos.icon || '',
      },
      {
        name: 'DNS',
        key: 'DNS',
        value: () => metaName.val?.infos.DNS || '',
      },
    ],
  },
  {
    name: 'CONTENT',
    key: 'Content',
    value: () => metaName.val?.infos.Content || '',
  },
  {
    name: 'TEXT RECORD',
    list: [
      {
        name: 'email',
        key: 'email',
        value: () => metaName.val?.infos.email || '',
      },
      {
        name: 'url',
        key: 'url',
        value: () => metaName.val?.infos.url || '',
      },
      {
        name: 'com.discord',
        key: 'discord',
        value: () => metaName.val?.infos.discord || '',
      },
      {
        name: 'com.github',
        key: 'github',
        value: () => metaName.val?.infos.github || '',
      },
      {
        name: 'com.reddit',
        key: 'reddit',
        value: () => metaName.val?.infos.reddit || '',
      },
      {
        name: 'com.twitter',
        key: 'twitter',
        value: () => metaName.val?.infos.twitter || '',
      },
      {
        name: 'com.telegram',
        key: 'telegram',
        value: () => metaName.val?.infos.telegram || '',
      },
    ],
  },
])
const isSkeleton = ref(true)
const metaName: { val: MetaNameSearchResult | null } = reactive({ val: null })
const editItem: {
  val: null | {
    name: string
    key: string
    value: () => string
  }
} = reactive({ val: null })
const i18n = useI18n()

function getInfo() {
  return new Promise<void>(async (resolve, reject) => {
    const res = await GetMetaNameInfo(route.params.metaName as string).catch(error => {
      ElMessage.error(error.message)
    })
    if (res) {
      metaName.val = res
      resolve()
    }
  })
}
const expireDate = ref('')
const registerDate = ref(0)

function copyValue(value: () => string) {
  if (!value()) return
  copy(value())
}
const isGetExpireDateLoading = ref(true)
const isGetRegisterDateLoading = ref(true)

function edit(item: any) {
  ElMessageBox.prompt('', i18n.t(item.name), {
    confirmButtonText: i18n.t('Confirm'),
    cancelButtonText: i18n.t('Cancel'),
    inputErrorMessage: i18n.t('Invalid Value'),
    confirmButtonClass: 'main-border primary',
    cancelButtonClass: 'main-border',
    inputValue: item.value(),
    closeOnClickModal: false,
  }).then(async ({ value }) => {
    const loading = openLoading()
    await update({ [item.key]: value }).catch(error => {
      ElMessage.error(error.message)
      loading.close()
    })
    loading.close()
  })
}

function update(params: object) {
  return new Promise<void>(async (resolve, reject) => {
    try {
      const response = await MetaNameBeforeReqRes({
        name: metaName.val!.name,
        op: MetaNameReqCode.updataInfo,
        address: userStore.showWallet.wallet!.rootAddress,
      })
      if (response.code == 0) {
        const metaNameParams = {
          op_code: response.data.op,
          info: {
            ...metaName.val!.infos,
            ...params,
          },
          reqswapargs: response.data,
        }
        const res = await getMetaNameOperateParams(metaNameParams)

        if (res) {
          const updateInfoTx = await MetaNameUpdateInfo(res!.registerMetaNameResp!)
          if (updateInfoTx.code == 0) {
            for (let i in params) {
              // @ts-ignore
              metaName.val!.infos[i] = params[i]
            }
            ElMessage.success(i18n.t('MetaName.UpdateInfoSuccess'))
            resolve()
          }
        } else {
          resolve()
        }
      }
    } catch (error) {
      reject(error)
    }
  })
}

function getExporeDate(height: number) {
  return new Promise<string>(async (resolve, reject) => {
    const res = GetExpiredUTC(height)
    if (res) {
      resolve(res)
    }
  })
}

function getData() {
  getInfo().then(() => {
    isSkeleton.value = false
    getExporeDate(metaName.val!.expiredBlockTime).then(res => {
      expireDate.value = res
      isGetExpireDateLoading.value = false
    })
    GetTx(metaName.val!.txid).then(res => {
      registerDate.value = res.txDetail.timestamp * 1000
      isGetRegisterDateLoading.value = false
    })
  })
}

getData()
</script>

<style lang="scss" scoped src="./MetaName.scss"></style>
