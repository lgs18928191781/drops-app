<template>
  <div class="h-full overflow-y-auto overflow-x-hidden" ref="WarpRef">
    <ElAffix :offset="headeroffSetTop">
      <div class="header flex flex-align-center">
        <div class="flex1 flex flex-align-center">
          <a class="back" @click="$router.back()">
            <Icon name="right" />
          </a>
          <span class="title">
            {{ $t('DAO.New Proposal') }}
          </span>
        </div>
        <a class="main-border primary" @click="submit"> {{ $t('DAO.Publish') }}</a>
      </div>
    </ElAffix>

    <div class="content">
      <ElForm :model="form" :label-position="'top'" ref="FormRef" :rules="rules">
        <ElFormItem :label="$t('DAO.Proposal Title')" prop="title">
          <ElInput v-model="form.title" type="text" :placeholder="$t('DAO.Enter Proposal Title')" />
        </ElFormItem>
        <ElFormItem :label="$t('DAO.Proposal Type')" prop="type">
          <ElSelect v-model="form.type" @change="onTypeChange">
            <ElOption
              v-for="item in DAOtypeOptions"
              :key="item.value"
              :label="item.name()"
              :value="item.value"
            />
          </ElSelect>
        </ElFormItem>
        <ElFormItem :label="$t('DAO.Vote Options')" prop="options">
          <ElSelect
            multiple
            allow-create
            v-model="form.options"
            :filterable="true"
            type="text"
            :placeholder="$t('DAO.Enter Vote Options')"
            :disabled="form.type === DAOProposalType.Base"
          />
        </ElFormItem>
        <ElFormItem :label="$t('DAO.Vote Time')" prop="time">
          <ElDatePicker
            v-model="(form.time as any)"
            type="datetimerange"
            class="flex1"
            range-separator="To"
            :start-placeholder="$t('DAO.Start date')"
            :end-placeholder="$t('DAO.End date')"
          />
        </ElFormItem>
        <ElFormItem :label="$t('DAO.Vote Content')" prop="content">
          <div class="el-input__wrapper" id="vditor" ref="MarkDownRef"></div>
        </ElFormItem>
      </ElForm>
    </div>
  </div>

  <Modal v-model="isShowConfirmModal" :width="'456px'">
    <template #title>{{ $t('DAO.Confirm Publish') }}</template>
    <template #body>
      <div class="confirm-tips" v-html="$t('DAO.Confirm Publish Tips')"></div>
      <div class="confirm-operate flex flex-align-center">
        <a class="main-border flex1" @click="isShowConfirmModal = false">{{ $t('Cancel') }}</a>
        <a class="main-border primary flex1" @click="confirmPublish">{{
          $t('DAO.Confirm Publish')
        }}</a>
      </div>
    </template>
  </Modal>
</template>

<script setup lang="ts">
import { Chains, DAOProposalType, DAOStakeOperate, NodeName, SdkPayType } from '@/enum'
import { onMounted, reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import Vditor from 'vditor'
import 'vditor/dist/index.css'
import { ElAffix, FormInstance, FormRules } from 'element-plus'
import { GetStake } from '@/api/dao'
import { useUserStore } from '@/stores/user'
import { useRouter } from 'vue-router'
import { getBalance, openLoading } from '@/utils/util'
import { useTalkStore } from '@/stores/talk'
import Decimal from 'decimal.js-light'
import Modal from '@/components/Modal/Modal.vue'
import { DAOtypeOptions } from '@/utils/DAO'
import { CreateVote } from '@/api/wxcore'
import { space } from '@/utils/filters'

const vditor = ref<Vditor | null>(null)
const headeroffSetTop = ref(0)
const WarpRef = ref()
const i18n = useI18n()
const userStore = useUserStore()
const router = useRouter()
const talk = useTalkStore()
const isShowConfirmModal = ref(false)

const form = reactive({
  title: '',
  type: DAOProposalType.Base,
  options: ['For', 'Against', 'Abstain'],
  time: ['', ''],
  content: '',
})
const FormRef = ref<FormInstance>()
const rules = reactive<FormRules>({
  title: [{ required: true, message: i18n.t('DAO.Enter Proposal Title'), trigger: 'blur' }],
  type: [{ required: true, message: i18n.t('DAO.Enter Proposal Type'), trigger: 'blur' }],
  options: [
    {
      required: true,
      message: i18n.t('DAO.Enter Vote Options'),
      trigger: 'blur',
    },
    {
      validator: (rule: any, value: any, callback: any) => {
        if (form.options && form.options.length) {
          if (form.options.length > 5) {
            callback(new Error(i18n.t('DAO.Max five Vote Options')))
          } else {
            callback()
          }
        } else {
          callback(new Error(i18n.t('DAO.Enter Vote Options')))
        }
      },
      trigger: 'blur',
    },
  ],
  time: [
    {
      required: true,
      validator: (rule: any, value: any, callback: any) => {
        if (form.time && form.time[0] && form.time[1]) {
          callback()
        } else {
          callback(new Error(i18n.t('DAO.Enter Vote Time')))
        }
      },
      trigger: 'blur',
    },
    {
      validator: (rule: any, value: any, callback: any) => {
        const least = new Date().getTime() + 1000 * 60 * 60 * 24
        if (new Date(form.time[1]).getTime() < least) {
          callback(new Error(i18n.t('DAO.Vote End Time Error')))
        } else {
          callback()
        }
      },
      trigger: 'blur',
    },
  ],
})

const MarkDownRef = ref()

function initMarkDown() {
  vditor.value = new Vditor('vditor', {
    cache: {
      enable: false,
    },
    placeholder: i18n.t('DAO.proposalDrscPlac'),
    minHeight: 500,
    toolbar: [
      'emoji',
      'headings',
      'bold',
      'italic',
      'strike',
      'link',
      '|',
      'list',
      'ordered-list',
      'check',
      'outdent',
      'indent',
      '|',
      'quote',
      'line',
      'code',
      'inline-code',
      'insert-before',
      'insert-after',
      '|',
      // 'upload',
      // 'record',
      'table',
      '|',
      'undo',
      'redo',
      '|',
      'fullscreen',
      // 'edit-mode',
      // {
      //   name: 'more',
      //   toolbar: [
      //     'both',
      //     'code-theme',
      //     'content-theme',
      //     'export',
      //     'outline',
      //     'preview',
      //     'devtools',
      //     'info',
      //     'help',
      //   ],
      // },
    ],
  })
}

function onTypeChange() {
  if (form.type === DAOProposalType.Base) {
    form.options = ['For', 'Against', 'Abstain']
  } else {
    form.options = []
  }
}

function submit() {
  FormRef.value?.validate(async result => {
    if (result) {
      const res = await getBalance({
        chain: Chains.MVC,
      }).catch(error => {
        ElMessage.error(error.message)
      })
      if (typeof res === 'number') {
        if (res >= talk.activeCommunity!.dao!.createProposalRequireTokenNumber) {
          isShowConfirmModal.value = true
        } else {
          ElMessage.error(
            `${i18n.t('DAO.createProposalRequireTokenNumber tips1')} ${space(
              talk.activeCommunity!.dao!.createProposalRequireTokenNumber
            )} ${talk.activeCommunity!.dao!.governanceSymbol!.toUpperCase()}`
          )
        }
      }
    }
  })
}

async function confirmPublish() {
  isShowConfirmModal.value = false
  const loading = openLoading()
  try {
    const res = await GetStake({
      symbol: `${talk.activeCommunity!.dao!.governanceSymbol}_${talk.activeCommunity!.dao!.daoId}`,
      address: userStore.user!.address!,
      op: DAOStakeOperate.CreateVote,
    })
    if (res.code === 0) {
      const transfer = await userStore.showWallet.createBrfcChildNode(
        {
          nodeName: NodeName.SendMoney,
          payTo: [{ address: res.data.mvcToAddress, amount: res.data.txFee }],
        },
        {
          payType: SdkPayType.SPACE,
          isBroadcast: false,
        }
      )
      if (transfer) {
        if (transfer.payToAddress?.transaction) {
          await userStore.showWallet.wallet?.provider.broadcast(
            transfer.payToAddress?.transaction.toString()
          )
        }
        const response = await CreateVote({
          symbol: `${talk.activeCommunity!.dao!.governanceSymbol}_${
            talk.activeCommunity!.dao!.daoId
          }`,
          requestIndex: res.data.requestIndex,
          mvcRawTx: transfer.sendMoney!.transaction!.toString(),
          mvcOutputIndex: 0,
          title: form.title,
          desc: vditor.value!.getValue(),
          options: form.options,
          minVoteAmount: '1',
          beginBlockTime: new Decimal(new Date(form.time[0]).getTime())
            .div(1000)
            .toInteger()
            .toNumber(),
          endBlockTime: new Decimal(new Date(form.time[1]).getTime())
            .div(1000)
            .toInteger()
            .toNumber(),
        })
        if (response.code === 0) {
          loading.close()
          ElMessage.success(i18n.t('DAO.Create Proposal Successful'))
          router.replace({
            name: 'talkDAOProposalDetail',
            params: {
              id: response.data.voteID,
            },
          })
        }
      } else if (transfer === null) {
        loading.close()
      }
    }
  } catch (error) {
    ElMessage.error((error as any).message)
    loading.close()
  }
}

onMounted(() => {
  initMarkDown()

  headeroffSetTop.value = WarpRef.value.getBoundingClientRect().top
})
</script>

<style lang="scss" scoped src="./Create.scss"></style>
