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
        <ElFormItem
          :label="$t('DAO.Proposal Type')"
          prop="type"
          :class="[form.type ? 'is-success' : 'is-error']"
        >
          <ElSelect v-model="form.type" @change="onTypeChange">
            <ElOption
              v-for="item in DAOtypeOptions"
              :key="item.value"
              :label="item.name()"
              :value="item.value"
            />
          </ElSelect>
        </ElFormItem>
        <ElFormItem
          :label="$t('DAO.Vote Options')"
          prop="options"
          :class="[form.options.length ? 'is-success' : 'is-error']"
        >
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

        <ElFormItem
          prop="stakeHolderOnly"
          :class="[form.options.length ? 'is-success' : 'is-error']"
        >
          <div class="label-wrap flex flex-align-center" slot="label">
            <span>{{ $t('DAO.Vote stake_holder_only') }}</span>
            <el-popover
              placement="top-start"
              :width="300"
              trigger="hover"
              :content="$t('DAO.Vote stake_holder_only_tips')"
            >
              <template #reference>
                <el-icon><QuestionFilled /></el-icon>
              </template>
            </el-popover>
          </div>
          <ElSelect v-model="form.stakeHolderOnly" :placeholder="$t('DAO.Enter Vote stake_only')">
            <el-option :label="$t('DAO.Vote_No')" :value="false" />
            <el-option :label="$t('DAO.Vote_Yes')" :value="true" />
          </ElSelect>
        </ElFormItem>
        <ElFormItem :label="$t('DAO.Vote Option_limit')" prop="LimitMaximum">
          <el-input-number
            v-model="form.limitMaximum"
            :min="1"
            :max="form.type !== DAOProposalType.DiyMultipleChoose ? 1 : 30"
            :disabled="form.type !== DAOProposalType.DiyMultipleChoose"
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

        <div class="result-option flex flex-align-center">
          <ElFormItem
            :label="$t('DAO.Result Pass Min User Number')"
            prop="result.minUser"
            class="flex1"
          >
            <ElInput v-model="form.result.minUser" type="number">
              <template #append>People</template>
            </ElInput>
          </ElFormItem>
          <ElFormItem
            :label="$t('DAO.Result Pass Min Vote Amount')"
            prop="result.minAmount"
            class="flex1"
          >
            <ElInput v-model="form.result.minAmount" type="number">
              <template #append>Space</template>
            </ElInput>
          </ElFormItem>
          <ElFormItem
            :label="$t('DAO.DAO.Result Pass Min Percent')"
            prop="result.minPercent"
            class="flex1"
          >
            <ElInput v-model="form.result.minPercent" type="number">
              <template #append>%</template>
            </ElInput>
          </ElFormItem>
        </div>
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
import { Chains, DAOProposalType, DAOStakeOperate, NodeName, SdkPayType, DAOVoteType } from '@/enum'
import { onMounted, reactive, ref, computed, watch, toRaw } from 'vue'
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
import { DAOtypeOptions, checkUserCanCreateProposal } from '@/utils/DAO'
import { CreateVote } from '@/api/wxcore'
import { space } from '@/utils/filters'
import { getOneCommunity } from '@/api/talk'
import { QuestionFilled } from '@element-plus/icons-vue'

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
  options: ['Yes', 'No'],
  stakeHolderOnly: false,
  time: ['', ''],
  content: '',
  limitMaximum: 1,
  minVoteUser: 1,
  result: {
    minUser: 1,
    minAmount: 1,
    minPercent: 60,
  },
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
          if (form.options.length > 30) {
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
  ['result.minUser']: [
    { required: true, message: i18n.t('DAO.Result Pass Min User Number'), trigger: 'blur' },
  ],
  ['result.minAmount']: [
    { required: true, message: i18n.t('DAO.Result Pass Min Vote Amount'), trigger: 'blur' },
  ],
  ['result.minPercent']: [
    { required: true, message: i18n.t('DAO.DAO.Result Pass Min Percent'), trigger: 'blur' },
  ],
})

const MarkDownRef = ref()

watch(
  () => form.type,
  type => {
    if (type !== DAOProposalType.DiyMultipleChoose) {
      form.limitMaximum = 1
    }
  }
)

const currentVoteType = computed(() => {
  if (form.type === DAOProposalType.Base) {
    return DAOVoteType.Base
  } else if (form.type === DAOProposalType.DiySingleChoose) {
    return DAOVoteType.SingleChoose
  } else if (form.type === DAOProposalType.DiyMultipleChoose) {
    return DAOVoteType.MultipleChoose
  } else return DAOVoteType.Approve
})

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
    form.options = ['Yes', 'No']
  } else {
    form.options = []
  }
}

function submit() {
  FormRef.value?.validate(async result => {
    if (result) {
      const result = await checkUserCanCreateProposal()
      if (result) {
        isShowConfirmModal.value = true
      }
    }
  })
}

async function confirmPublish() {
  isShowConfirmModal.value = false
  const loading = openLoading()
  const desc = toRaw(vditor.value!.getValue())
  if (desc.match(/^\n/)) {
    loading.close()
    return ElMessage.error(i18n.t('DAO.Proposal descnull'))
  }

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
          isTransfer: true,
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
          desc: desc,
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
          infos: {
            resultOption: {
              ...form.result,
              minAmount: new Decimal(form.result.minAmount)
                .mul(Math.pow(10, 8))
                .toInteger()
                .toNumber(),
            },
            voteType: currentVoteType.value,
            stakeHolderOnly: form.stakeHolderOnly,
            limitMaximum: form.type !== DAOProposalType.DiyMultipleChoose ? 1 : form.limitMaximum,
          },
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
