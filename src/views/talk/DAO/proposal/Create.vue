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
              v-for="item in typeOptions"
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
</template>

<script setup lang="ts">
import { DAOProposalType, DAOStakeOperate, NodeName, SdkPayType } from '@/enum'
import { onMounted, reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import Vditor from 'vditor'
import 'vditor/dist/index.css'
import { ElAffix, FormInstance, FormRules } from 'element-plus'
import { CreateVote, GetStake } from '@/api/dao'
import { useUserStore } from '@/stores/user'
import { useRouter } from 'vue-router'
import { openLoading } from '@/utils/util'
import { useTalkStore } from '@/stores/talk'

const vditor = ref<Vditor | null>(null)
const headeroffSetTop = ref(0)
const WarpRef = ref()
const i18n = useI18n()
const userStore = useUserStore()
const router = useRouter()
const talk = useTalkStore()

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
          callback()
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
  ],
})

const typeOptions = [
  { name: () => i18n.t('DAO.Basic Type Voting'), value: DAOProposalType.Base },
  { name: () => i18n.t('DAO.Custom Single Choice Voting'), value: DAOProposalType.DiySingleChoose },
  {
    name: () => i18n.t('DAO.Custom Multiple Choice Voting'),
    value: DAOProposalType.DiyMultipleChoose,
  },
]
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
      const loading = openLoading()
      try {
        const res = await GetStake({
          symbol: `${talk.activeCommunity!.dao!.governanceSymbol}_${
            talk.activeCommunity!.dao!.daoId
          }`,
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
            const response = await CreateVote({
              symbol: `${talk.activeCommunity!.dao!.governanceSymbol}_${
                talk.activeCommunity!.dao!.daoId
              }`,
              requestIndex: res.data.requestIndex,
              mvcRawTx: transfer.sendMoney!.transaction!.toString(),
              mvcOutputIndex: 0,
              title: form.title,
              desc: form.content,
              options: form.options,
              minVoteAmount: '1',
              beginBlockTime: new Date(form.time[0]).getTime(),
              endBlockTime: new Date(form.time[1]).getTime(),
            })
            if (response.code === 0) {
              loading.close()
              ElMessage.success(i18n.t('DAO.Create Proposal Successful'))
              router.push({
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
  })
}

onMounted(() => {
  initMarkDown()

  headeroffSetTop.value = WarpRef.value.getBoundingClientRect().top
})
</script>

<style lang="scss" scoped src="./Create.scss"></style>
