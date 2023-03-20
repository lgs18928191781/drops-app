<template>
  <div class="h-full overflow-y-auto overflow-x-hidden">
    <div class="header flex flex-align-center">
      <div class="flex1 flex flex-align-center">
        <a class="back" @click="$router.back()">
          <Icon name="right" />
        </a>
        <span class="title">
          {{ $t('DAO.New Proposal') }}
        </span>
      </div>
      <a class="main-border primary"> {{ $t('DAO.Publish') }}</a>
    </div>

    <ElForm :label-position="'top'">
      <ElFormItem :label="$t('DAO.Proposal Title')" prop="title">
        <ElInput v-model="form.title" type="text" />
      </ElFormItem>
      <ElFormItem :label="$t('DAO.Proposal Type')" prop="type">
        <ElSelect v-model="form.type">
          <ElOption
            v-for="item in typeOptions"
            :key="item.value"
            :label="item.name()"
            :value="item.value"
          />
        </ElSelect>
      </ElFormItem>
      <ElFormItem :label="$t('DAO.Vote Options')" prop="options">
        <ElSelect multiple allow-create v-model="form.options" :filterable="true" type="text" />
      </ElFormItem>
      <ElFormItem :label="$t('DAO.Vote Time')" prop="time">
        <ElDatePicker
          v-model="form.time"
          type="datetimerange"
          range-separator="To"
          start-placeholder="Start date"
          end-placeholder="End date"
        />
      </ElFormItem>
      <ElFormItem :label="$t('DAO.Vote Content')" prop="content">
        <div class="el-input__wrapper" id="vditor" ref="MarkDownRef"></div>
      </ElFormItem>
    </ElForm>
  </div>
</template>

<script setup lang="ts">
import { DAOProposalType } from '@/enum'
import { onMounted, reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import Vditor from 'vditor'
import 'vditor/dist/index.css'
const vditor = ref<Vditor | null>(null)

const i18n = useI18n()
const form = reactive({
  title: '',
  type: DAOProposalType.Base,
  options: [],
  time: ['', ''],
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

onMounted(() => {
  initMarkDown()
})
</script>

<style lang="scss" scoped src="./Create.scss"></style>
