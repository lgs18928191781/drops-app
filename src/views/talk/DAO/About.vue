<template>
  <div class="h-full overflow-y-auto">
    <div class="header flex flex-align-center mt-1">
      <div class="flex1">
        {{ $t('DAO.About') }}
      </div>
      <a
        class="main-border primary px-2 py-1 cursor-pointer text-base"
        v-if="userStore.isAuthorized && talk.activeCommunity?.dao?.daoAdmins.includes(userStore.user!.metaId)"
        @click="edit"
      >
        {{ $t('DAO.Edit') }}
      </a>
    </div>

    <!-- Information -->
    <div class="section">
      <div class="title">
        {{ $t('DAO.Information') }}
      </div>
      <div class="content">
        <div class="information-list">
          <div class="information-item">
            <div class="lable">{{ $t('DAO.Information Website') }}</div>
            <div
              class="cont"
              v-html="
                $filters.repalceHref(
                  talk.activeCommunity?.dao?.daoWebsite || $t('noDatas'),
                  '#5586BB'
                )
              "
            ></div>
          </div>

          <div class="information-item">
            <div class="lable">{{ $t('DAO.Information Introduction') }}</div>
            <div class="cont">
              {{ talk.activeCommunity?.dao?.daoIntro || $t('noDatas') }}
            </div>
          </div>

          <div class="information-item">
            <div class="lable">{{ $t('DAO.Mission Introduction') }}</div>
            <div class="cont">
              {{ talk.activeCommunity?.dao?.daoMission || $t('noDatas') }}
            </div>
          </div>

          <div class="information-item">
            <div class="lable">{{ $t('DAO.Information Type') }}</div>
            <div class="cont">
              <ElTag
                type="info"
                v-for="item in talk.activeCommunity?.dao?.daoTypes"
                :key="item"
                class="mr-2"
              >
                {{ $t(DAOTypes.find(_item => _item.val === item)!.name) }}
              </ElTag>
            </div>
          </div>

          <div class="information-item">
            <div class="lable">{{ $t('DAO.Information Clause') }}</div>
            <div class="cont">
              {{ talk.activeCommunity?.dao?.daoTerms || $t('noDatas') }}
            </div>
          </div>

          <!-- 加入Dao需最少治理token数量 -->
          <!-- <div class="information-item">
            <div class="lable">{{ $t('DAO.Information Need Token Min') }}</div>
            <div class="cont">
              <ElTag type="info">{{ talk.activeCommunity?.dao?.joinDaoRequireTokenNumber }}</ElTag>
            </div>
          </div> -->

          <!-- 创建提案需要的最少Token数量  -->
          <!-- <div class="information-item">
            <div class="lable">{{ $t('DAO.Information Proposal Need Token Min') }}</div>
            <div class="cont">
              <ElTag type="info">{{
                talk.activeCommunity?.dao?.createProposalRequireTokenNumber
              }}</ElTag>
            </div>
          </div> -->
        </div>
      </div>
    </div>

    <!-- Administrators -->
    <!-- <div class="section">
      <div class="title">{{ $t('DAO.Administrators') }}</div>
      <div class="content">
        <div class="list">
          <div class="item" v-for="user in admins" :key="user.metaId">
            <div class="user flex flex-align-center">
              <UserAvatar
                :meta-id="user.metaId"
                :name="user.name"
                :image="user.avatarImage"
                :meta-name="user.metaName"
              />
              <div class="flex1">
                <div class="name">{{ user.name }}</div>
                <div class="metaid">MetaID: {{ user.metaId.slice(0, 6) }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div> -->

    <!-- Core Members -->
    <!-- <div class="section">
      <div class="title">{{ $t('DAO.Core Members') }}</div>
      <div class="content">
        <div class="list">
          <div class="item">
            <div class="user flex flex-align-center">
              <UserAvatar :meta-id="''" :name="''" :image="''" :meta-name="''" />
              <div class="flex1">
                <div class="name">UPKJUI</div>
                <div class="metaid">MetaID: 6d5465</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div> -->

    <!-- Core Members -->
    <!-- <div class="section">
      <div class="title">{{ $t('DAO.Members') }}</div>
      <div class="content">
        <div class="list">
          <div class="item">
            <div class="user flex flex-align-center">
              <UserAvatar :meta-id="''" :name="''" :image="''" :meta-name="''" />
              <div class="flex1">
                <div class="name">UPKJUI</div>
                <div class="metaid">MetaID: 6d5465</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div> -->
    <CreateDaoModal v-model="isShowEditModal" ref="DAORef" @success="onEditSuccess" />
  </div>
</template>

<script setup lang="ts">
import { GetUserAllInfo } from '@/api/aggregation'
import { useTalkStore } from '@/stores/talk'
import { ElTag } from 'element-plus'
import { reactive, ref, watch } from 'vue'
import { DAOTypes } from '@/utils/DAO'
import { useUserStore } from '@/stores/user'
import CreateDaoModal from '../components/modals/CreateDaoModal.vue'
import { Form } from 'vee-validate'

const talk = useTalkStore()
const admins: UserAllInfo[] = reactive([])
const userStore = useUserStore()
const DAORef = ref()

const isShowEditModal = ref(false)

function getAdminUserInfo() {
  return new Promise<void>(async (resolve, reject) => {
    const daoAdmins = talk.activeCommunity!.dao!.daoAdmins
    for (let i = 0; i < talk.activeCommunity!.dao!.daoAdmins.length; i++) {
      if (!admins.some(item => item.metaId === daoAdmins[i])) {
        const res = await GetUserAllInfo(daoAdmins[i])
        if (res.code === 0) admins.push(res.data)
      }
    }
    resolve()
  })
}

async function edit() {
  const form = DAORef.value.form
  form.isSkeleton = true
  const dao = talk.activeCommunity!.dao!
  form.communityId = dao.communityId //string
  form.daoName = dao.daoName //string
  form.daoID = dao.daoId //string, 生成方法hash(随机64位)，必须确保是唯一。Sha256 once after generating a 64-bit random string.
  form.daoAdmins = [] //array, 管理员metaId数组
  form.daoIntro = dao.daoIntro //string
  form.daoMission = dao.daoMission //string
  form.daoTypes = dao.daoTypes //array, 值: "protocol/service/social/investment/grant/collector/culture",
  form.daoLogo = dao.daoLogo //string, logo所在的metafile
  form.governanceType = dao.governanceType //string, 治理类型：ft/nft/bsv/space/none
  form.governanceSymbol = dao.governanceSymbol // {space/ft-symbol} string, Symbol of Governance Token.治理代币的Symbol。
  form.governanceToken = dao.governanceToken //string, 治理tokenId,若为源生币为"space", 如没有则为"none",
  form.daoWebsite = dao.daoWebsite //string, DAO官网
  form.daoTwitter = dao.daoTwitter //string, 推特账号
  form.daoDiscord = dao.daoDiscord //string, discord地址
  form.daoTelegram = dao.daoTelegram //string, telegrame地址
  form.daoTerms = dao.daoTerms //string,
  form.daoTermsContentType = dao.daoTermsContentType //string, 进入条款的内容格式
  form.joinDaoRequireTokenNumber = dao.joinDaoRequireTokenNumber //number, 加入该DAO的时候，需要最少治理token数量，如果治理Token为none，则忽略此值
  form.createProposalRequireTokenNumber = dao.createProposalRequireTokenNumber //number, 创建议题需要的治理Token数量，如果治理Token为none，则忽略此值
  form.publiceKey = dao.publicKey
  form.txId = dao.txId
  isShowEditModal.value = true
  form.daoAdmins = dao.daoAdmins
  // for (let i = 0; i < dao.daoAdmins.length; i++) {
  //   const res = await GetUserAllInfo(dao.daoAdmins[i])
  //   if (res.code === 0) {
  //     form.admins.push({
  //       avatarImage: res.data.avatarImage,
  //       name: res.data.name,
  //       metaName: res.data.metaName,
  //       metaId: res.data.metaId,
  //     })
  //   }
  // }
  form.isSkeleton = false
}

function onEditSuccess(data: any) {
  talk.activeCommunity!.dao! = {
    ...talk.activeCommunity!.dao!,
    ...data,
  }
  getAdminUserInfo()
}

let watchFun: any
watchFun = watch(
  () => talk.activeCommunity,
  result => {
    if (result) {
      if (watchFun) watchFun()
      getAdminUserInfo()
    }
  },
  { immediate: true }
)
</script>

<style lang="scss" scoped src="./About.scss"></style>
