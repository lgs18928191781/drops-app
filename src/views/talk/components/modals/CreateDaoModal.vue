<template>
  <FullScreenModal
    :show-control="modelValue"
    :extra-close-event="rest"
    @update:show-control="val => emit('update:modelValue', val)"
  >
    <template #title>
      <div class="flex flex-align-center">
        <div class="flex1 flex flex-pack-start">
          {{ form.publiceKey ? $t('DAO.Edit DAO Title') : $t('DAO.Create DAO Title') }}
        </div>
        <a class="main-border primary mr-4 px-2 py-1 cursor-pointer" @click="create">
          {{ form.publiceKey ? $t('DAO.Edit') : $t('DAO.Create') }}
        </a>
      </div>
    </template>

    <template #body>
      <ElSkeleton :loading="isSkeleton" animated class="px-4 py-8">
        <ElForm
          :model="form"
          :rules="rules"
          class="h-full w-full overflow-y-auto p-6"
          :label-width="100"
        >
          <div class="lg:flex flex-col space-y-6 lg:space-y-8 w-full place-items-stretch pb-12">
            <h3 class="w-full text-lg font-bold">{{ $t('DAO.Profile') }}</h3>

            <ElFormItem prop="daoLogo">
              <template #label>
                <h4 class="field-label col-span-1">{{ $t('DAO.Icon') }}</h4>
              </template>
              <!-- Icon -->
              <div class="lg:grid lg:grid-cols-5 lg:gap-x-4 space-y-2 lg:space-y-0 ">
                <div class="col-span-4">
                  <div class="w-20 h-20 relative cursor-pointer">
                    <Image :src="form.daoLogo" custom-class="w-20 h-20 rounded-full object-cover" />
                    <input
                      type="file"
                      accept="images/*"
                      class="absolute left-0 top-0 z-10 h-full w-full opacity-0 cursor-pointer"
                      :title="$t('DAO.Choose DAO Icon')"
                      ref="IconRef"
                      @change="onIconChange"
                    />
                  </div>
                </div>
              </div>
            </ElFormItem>

            <!-- Name -->
            <ElFormItem prop="daoName">
              <template #label>
                <h4 class="field-label col-span-1 ">{{ $t('DAO.Name') }}</h4>
              </template>
              <div class="lg:grid lg:grid-cols-5 lg:gap-x-4 space-y-2 lg:space-y-0 flex1">
                <div class="col-span-4">
                  <ElInput
                    type="text"
                    v-model="form.daoName"
                    :placeholder="$t('DAO.Name placeholder')"
                    class=""
                  />
                </div>
              </div>
            </ElFormItem>

            <!-- Description -->
            <ElFormItem prop="daoIntro">
              <template #label>
                <h4 class="field-label col-span-1">{{ $t('DAO.Description') }}</h4>
              </template>
              <div class="lg:grid lg:grid-cols-5 lg:gap-x-4 space-y-2 lg:space-y-0 flex1">
                <div class="col-span-4">
                  <ElInput
                    :type="'textarea'"
                    v-model="form.daoIntro"
                    :placeholder="$t('DAO.Description placeholder')"
                    rows="3"
                  ></ElInput>
                </div>
              </div>
            </ElFormItem>

            <!-- Mission -->
            <ElFormItem prop="daoMission">
              <template #label>
                <h4 class="field-label col-span-1">{{ $t('DAO.Mission') }}</h4>
              </template>
              <div class="lg:grid lg:grid-cols-5 lg:gap-x-4 space-y-2 lg:space-y-0 flex1">
                <div class="col-span-4">
                  <ElInput
                    v-model="form.daoMission"
                    type="textarea"
                    :placeholder="$t('DAO.Mission placeholder')"
                    rows="3"
                  ></ElInput>
                </div>
              </div>
            </ElFormItem>

            <!-- Categories -->
            <ElFormItem prop="daoTypes">
              <template #label>
                <h4 class="field-label col-span-1">{{ $t('DAO.Categories') }}</h4>
              </template>
              <div class="lg:grid lg:grid-cols-5 lg:gap-x-4 space-y-2 lg:space-y-0">
                <div class="col-span-4">
                  <div class="flex flex-wrap gap-2">
                    <div
                      v-for="category in DAOTypes"
                      :key="category.val"
                      class="flex items-center gap-2 px-4 py-1.5 rounded-full transition duration-200 cursor-pointer"
                      :class="[
                        form.daoTypes.some(item => item === category.val)
                          ? 'bg-primary text-dark-800'
                          : 'bg-dark-200 dark:bg-gray-950 text-dark-300',
                      ]"
                      @click="changeCategory(category.val)"
                    >
                      <span class="text-sm capitalize">{{ $t(category.name) }}</span>
                      <Icon
                        name="check"
                        class="w-4 h-4"
                        v-if="form.daoTypes.some(item => item === category.val)"
                      />
                      <div
                        class="w-4 h-4 shadow-inner shadow-gray-300 dark:shadow-blue-200/20 rounded"
                        v-else
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </ElFormItem>

            <!-- Mission -->
            <ElFormItem prop="daoTerms">
              <template #label>
                <h4 class="field-label col-span-1">{{ $t('DAO.Terms') }}</h4>
              </template>
              <div class="lg:grid lg:grid-cols-5 lg:gap-x-4 space-y-2 lg:space-y-0 flex1">
                <div class="col-span-4">
                  <textarea
                    v-model="form.daoTerms"
                    type="text"
                    class="main-border faded-switch still field-input resize-none"
                    :placeholder="$t('DAO.Terms placeholder')"
                    rows="3"
                  ></textarea>
                </div>
              </div>
            </ElFormItem>

            <!-- Website -->
            <ElFormItem prop="daoWebsite">
              <template #label>
                <h4 class="field-label col-span-1">{{ $t('DAO.Website') }}</h4>
              </template>
              <div class="lg:grid lg:grid-cols-5 lg:gap-x-4 space-y-2 lg:space-y-0 flex1">
                <div class="col-span-4">
                  <ElInput
                    v-model="form.daoWebsite"
                    type="text"
                    placeholder="e.g. https://metabot.world"
                  />
                </div>
              </div>
            </ElFormItem>

            <!-- admin -->
            <ElFormItem prop="daoAdmins">
              <template #label>
                <h4 class="field-label col-span-1">{{ $t('DAO.Admins') }}</h4>
              </template>
              <div class="lg:grid lg:grid-cols-5 lg:gap-x-4 space-y-2 lg:space-y-0 flex1">
                <div class="col-span-4">
                  <div class="lg:grid lg:grid-cols-3 gap-2">
                    <div
                      class="flex flex-align-center px-2 py-2 rounded-lg bg-dark-100 dark:bg-gray-100 relative"
                      v-for="user in admins"
                      :key="user.metaId"
                    >
                      <a
                        class="cursor-pointer w-5 h-5 flex flex-align-center flex-pack-center bg-red-300  rounded-full absolute -right-1 -top-1"
                        v-if="user.metaId !== userStore.user?.metaId"
                        @click="removeAmind(user.metaId)"
                      >
                        <Icon name="x_mark" class="w-2 h-2" />
                      </a>
                      <UserAvatar
                        :meta-name="user.metaId"
                        :name="user.name"
                        :image="user.avatarImage"
                        class="w-12 h-12 mr-1"
                        :disabled="true"
                      />
                      <div class="cont flex1">
                        <div class="">
                          <UserName :name="user.name" :meta-name="user.metaName" :no-tag="true" />
                        </div>
                        <div class="text-xs text-dark-250 dark:text-gray-200">
                          MetaID:{{ user.metaId.slice(0, 6) }}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="mt-2 flex flex-align-center" ref="GetUserWarpRef">
                    <input
                      v-model="newAdmin"
                      type="text"
                      class="main-border faded-switch still field-input resize-none flex1"
                      placeholder="MetaID/Address/Paymail/MetaName"
                    />
                    <a
                      class="main-border py-1 px-2 ml-2 cursor-pointer"
                      :class="[newAdmin ? 'primary' : 'faded']"
                      @click="getUser"
                      >{{ $t('DAO.Add') }}</a
                    >
                  </div>
                </div>
              </div>
            </ElFormItem>

            <!-- governance Header -->
            <h3
              class="w-full text-lg font-bold pt-12 !mt-12 border-t-2 border-solid border-dark-200 dark:border-gray-700"
            >
              {{ $t('DAO.Governance') }}
            </h3>

            <!-- governance type -->
            <ElFormItem prop="governanceType">
              <template #label>
                <h4 class="field-label col-span-1">{{ $t('DAO.Governance Type') }}</h4>
              </template>
              <div class="lg:grid lg:grid-cols-5 lg:gap-x-4 space-y-2 lg:space-y-0 flex1">
                <div class="col-span-4">
                  <ElSelect
                    v-model="form.governanceType"
                    :placeholder="$t('DAO.GovernanceType placeholder')"
                    :disabled="form.publiceKey ? true : false"
                  >
                    <ElOption
                      v-for="(item, index) in governanceTypes"
                      :key="index"
                      :label="item.toUpperCase()"
                      :value="item"
                    />
                  </ElSelect>
                </div>
              </div>
            </ElFormItem>

            <!-- Social Header -->
            <h3
              class="w-full text-lg font-bold pt-12 !mt-12 border-t-2 border-solid border-dark-200 dark:border-gray-700"
            >
              {{ $t('DAO.Social') }}
            </h3>

            <!-- Twitter -->
            <ElFormItem prop="daoTwitter">
              <template #label>
                <h4 class="field-label col-span-1">Twitter</h4>
              </template>
              <div class="lg:grid lg:grid-cols-5 lg:gap-x-4 space-y-2 lg:space-y-0 flex1">
                <div class="col-span-4">
                  <ElInput
                    v-model="form.daoTwitter"
                    type="text"
                    placeholder="If you have an official Twitter account, enter it here."
                  />
                </div>
              </div>
            </ElFormItem>

            <!-- Discord -->
            <ElFormItem prop="daoDiscord">
              <template #label>
                <h4 class="field-label col-span-1">Discord</h4>
              </template>
              <div class="lg:grid lg:grid-cols-5 lg:gap-x-4 space-y-2 lg:space-y-0 flex1">
                <div class="col-span-4">
                  <ElInput v-model="form.daoDiscord" type="text" placeholder="...and Discord, " />
                </div>
              </div>
            </ElFormItem>

            <!-- Telegram -->
            <ElFormItem prop="daoTelegram">
              <template #label>
                <h4 class="field-label col-span-1">Telegram</h4>
              </template>
              <div class="lg:grid lg:grid-cols-5 lg:gap-x-4 space-y-2 lg:space-y-0 flex1">
                <div class="col-span-4">
                  <ElInput
                    v-model="form.daoTelegram"
                    type="text"
                    placeholder="...and Telegram too. "
                  />
                </div>
              </div>
            </ElFormItem>
          </div>
        </ElForm>
      </ElSkeleton>
    </template>
  </FullScreenModal>
</template>

<script lang="ts" setup>
import { useLayoutStore } from '@/stores/layout'
import { useMutateDaoFormStore } from '@/stores/forms'
import FullScreenModal from './FullScreenModal.vue'
import { NodeName, ShowControl } from '@/enum'
import { useTalkStore } from '@/stores/talk'
import { reactive, onMounted, watch, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useUserStore } from '@/stores/user'
import {
  FileToAttachmentItem,
  getAccountUserInfo,
  getAttachmentsMark,
  openLoading,
  realRandomString,
} from '@/utils/util'
// @ts-ignore
import { SHA256 } from 'crypto-es/lib/sha256.js'
import { DAOTypes } from '@/utils/DAO'
import { FormRules } from 'element-plus'
import { AttachmentItem } from '@/@types/hd-wallet'
import { GetUserAllInfo } from '@/api/aggregation'

const props = defineProps<{
  modelValue: boolean
}>()

const layout = useLayoutStore()
const talk = useTalkStore()
const i18n = useI18n()
const userStore = useUserStore()
const emit = defineEmits(['update:modelValue'])
let iconAttachment: AttachmentItem | undefined = undefined
const newAdmin = ref('')
const GetUserWarpRef = ref()
const isSkeleton = ref(false)

const form = reactive({
  communityId: '', //string
  daoName: '', //string
  daoID: '', //string, 生成方法hash(随机64位)，必须确保是唯一。Sha256 once after generating a 64-bit random string.
  daoAdmins: [], //array, 管理员metaId数组
  daoIntro: '', //string
  daoMission: '', //string
  daoTypes: [], //array, 值: "protocol/service/social/investment/grant/collector/culture",
  daoLogo: '', //string, logo所在的metafile
  governanceType: 'space', //string, 治理类型：ft/nft/bsv/space/none
  governanceSymbol: 'space', // {space/ft-symbol} string, Symbol of Governance Token.治理代币的Symbol。
  governanceToken: 'space', //string, 治理tokenId,若为源生币为"space", 如没有则为"none",
  daoWebsite: '', //string, DAO官网
  daoTwitter: '', //string, 推特账号
  daoDiscord: '', //string, discord地址
  daoTelegram: '', //string, telegrame地址
  daoTerms: '', //string,
  daoTermsContentType: 'text/markdwon', //string, 进入条款的内容格式
  joinDaoRequireTokenNumber: 1, //number, 加入该DAO的时候，需要最少治理token数量，如果治理Token为none，则忽略此值
  createProposalRequireTokenNumber: 10000, //number, 创建议题需要的治理Token数量，如果治理Token为none，则忽略此值
  publiceKey: '',
  txId: '',
})

const rules = reactive<FormRules>({
  daoName: [{ required: true, message: i18n.t('DAO.Name placeholder'), trigger: 'blur' }],
  daoAdmins: [], //array, 管理员metaId数组
  daoIntro: [], //string
  daoMission: [], //string
  daoTypes: [], //array, 值: "protocol/service/social/investment/grant/collector/culture",
  daoLogo: [{ required: true, message: '', trigger: 'blur' }], //string, logo所在的metafile
  governanceType: [
    { required: true, message: i18n.t('DAO.GovernanceType placeholder'), trigger: 'blur' },
  ], //string, 治理类型：ft/nft/bsv/space/none
  // governanceSymbol: [], // {space/ft-symbol} string, Symbol of Governance Token.治理代币的Symbol。
  // governanceToken: [], //string, 治理tokenId,若为源生币为"space", 如没有则为"none",
  daoWebsite: [], //string, DAO官网
  daoTwitter: [], //string, 推特账号
  daoDiscord: [], //string, discord地址
  daoTelegram: [], //string, telegrame地址
  daoTerms: [], //string,
  // joinDaoRequireTokenNumber: [{ required: true, message: i18n.t('DAO.JoinDaoRequireTokenNumber placeholder'), trigger: 'blur' }], //number, 加入该DAO的时候，需要最少治理token数量，如果治理Token为none，则忽略此值
  // createProposalRequireTokenNumber: [{ required: true, message: i18n.t('DAO.GovernanceType placeholder'), trigger: 'blur' }], //number, 创建议题需要的治理Token数量，如果治理Token为none，则忽略此值
})
const governanceTypes = [
  'space',
  // 'ft',
  // 'nft',
  //  'bsv'
]
const admins: {
  avatarImage: string
  name: string
  metaName: string
  metaId: string
}[] = reactive([
  {
    avatarImage: userStore.user!.avatarImage,
    name: userStore.user!.name,
    metaName: userStore.user!.metaName,
    metaId: userStore.user!.metaId,
  },
])

function rest() {
  form.communityId = '' //string
  form.daoName = '' //string
  form.daoID = '' //string, 生成方法hash(随机64位)，必须确保是唯一。Sha256 once after generating a 64-bit random string.
  form.daoAdmins = [] //array, 管理员metaId数组
  form.daoIntro = '' //string
  form.daoMission = '' //string
  form.daoTypes = [] //array, 值: "protocol/service/social/investment/grant/collector/culture",
  form.daoLogo = '' //string, logo所在的metafile
  form.governanceType = 'space' //string, 治理类型：ft/nft/bsv/space/none
  form.governanceSymbol = 'space' // {space/ft-symbol} string, Symbol of Governance Token.治理代币的Symbol。
  form.governanceToken = 'space' //string, 治理tokenId,若为源生币为"space", 如没有则为"none",
  form.daoWebsite = '' //string, DAO官网
  form.daoTwitter = '' //string, 推特账号
  form.daoDiscord = '' //string, discord地址
  form.daoTelegram = '' //string, telegrame地址
  form.daoTerms = '' //string,
  form.daoTermsContentType = 'text/markdwon' //string, 进入条款的内容格式
  form.joinDaoRequireTokenNumber = 1 //number, 加入该DAO的时候，需要最少治理token数量，如果治理Token为none，则忽略此值
  form.createProposalRequireTokenNumber = 10000 //number, 创建议题需要的治理Token数量，如果治理Token为none，则忽略此值
  form.publiceKey = ''
  form.txId = ''
  admins.length = 0
  admins.push({
    avatarImage: userStore.user!.avatarImage,
    name: userStore.user!.name,
    metaName: userStore.user!.metaName,
    metaId: userStore.user!.metaId,
  })
}

function changeCategory(val: string) {
  if (form.daoTypes.some(item => item === val)) {
    form.daoTypes = form.daoTypes.filter(c => c !== val)
  } else {
    form.daoTypes.push(val)
  }
}

async function create() {
  const loading = openLoading()
  if (!form.communityId) {
    form.communityId = talk.activeCommunity!.id!
  }
  if (!form.daoID) form.daoID = SHA256(realRandomString(64)).toString()
  const { publiceKey, txId, ...params } = form
  let attachments: any[] = []
  if (iconAttachment) {
    params.daoLogo = 'metafile://$[0]'
    attachments.push(iconAttachment)
  }

  const adminMetaIds = []
  for (let i = 0; i < admins.length; i++) {
    adminMetaIds.push(admins[i].metaId)
  }
  const res = await userStore.showWallet
    .createBrfcChildNode({
      nodeName: NodeName.SimpleDAOCreate,
      data: JSON.stringify({
        ...params,
        daoAdmins: adminMetaIds,
      }),
      publickey: publiceKey,
      txId,
      attachments,
    })
    .catch(error => {
      loading.close()
      ElMessage.error(error.message)
    })
  if (res) {
    loading.close()
    console.log(res)
  } else if (res === null) {
    loading.close()
  }
}

async function onIconChange(e: any) {
  const files: File[] = e.target.files
  if (files.length) {
    const res = await FileToAttachmentItem(files[0])
    if (res) {
      iconAttachment = res
      form.daoLogo = res.url
    }
  }
}

async function getUser() {
  if (newAdmin.value === '') return
  const loading = openLoading({ target: GetUserWarpRef.value })
  const res = await getAccountUserInfo(newAdmin.value).catch(error => {
    ElMessage.error(error.message)
    loading.close()
  })
  if (res) {
    if (res.metaId) {
      if (admins.some(item => item.metaId === res.metaId)) {
        ElMessage.error(i18n.t('DAO.User Is Existed'))
        loading.close()
      }
      admins.push({
        avatarImage: res.avatarImage,
        name: res.name,
        metaName: res.metaName,
        metaId: res.metaId,
      })
      newAdmin.value = ''
    } else {
      ElMessage.error(i18n.t('DAO.Not Found User'))
    }
    loading.close()
  }
}

function removeAmind(metaId: string) {
  const index = admins.findIndex(item => item.metaId === metaId)
  if (index > -1) {
    admins.splice(index, 1)
  }
}

defineExpose({
  form,
  admins,
  isSkeleton,
})

watch(
  () => [props.modelValue, talk.activeCommunity],
  async result => {
    if (result[0] && result[1] && !form.publiceKey) {
      form.communityId = talk.activeCommunity!.id!
      form.daoName = talk.activeCommunity!.name
      form.daoLogo = talk.activeCommunity!.icon
    }
  },
  { immediate: true }
)
</script>

<style lang="scss" scoped>
.el-form {
  :deep(.el-form-item__label) {
    /* prettier-ignore */
    line-height: calc(14PX * 1.5 + 24PX);
    font-weight: bold;
  }
}
</style>
