<template>
  <div class="search-register">
    <div class="metaname-sm-container">
      <Navigation
        :list="[$t('MetaName.Search'), $t('MetaName.Register'), $t('MetaName.Registering')]"
      />

      <ElSkeleton :loading="isSkeleton" animated>
        <div class="metaname-card">
          <img class="metaname" src="@/assets/images/metaname.png" />
          <div class="name">{{ $route.params.metaName || '' }}</div>

          <div class="tag">
            .meta
          </div>
        </div>

        <div class="tips">{{ $t('MetaName.RegisteringTips') }}</div>

        <div class="status">
          <div
            class="status-item flex flexa-alignc-center"
            v-for="(item, index) in statusList"
            :key="index"
            :class="{ active: status + 1 >= item.value }"
          >
            <div class="index">{{ index + 1 }}.</div>
            <div class="label flex1">{{ item.name() }}</div>
            <div
              class="check-warp flex flex-align-center flex-pack-center"
              v-if="status >= item.value"
            >
              <Icon name="check" />
            </div>
            <ElIcon class="is-loading" v-if="item.value === status + 1">
              <Loading />
            </ElIcon>
          </div>
        </div>

        <PlainBtnVue>
          {{ $t('MetaName.Continue to register other domain names') }}
        </PlainBtnVue>
      </ElSkeleton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import { Loading } from '@element-plus/icons-vue'
import PlainBtnVue from '../components/PlainBtn/PlainBtn.vue'
import Navigation from '../components/Navigation/Navigation.vue'
import { reject } from 'lodash'
import { GetMetaNameIsRegister } from '@/api/metaname'

const i18n = useI18n()
const route = useRoute()

const status = ref(0)
const metaName: { val: null | MetaNameSearchResult } = reactive({ val: null })
const isSkeleton = ref(true)

const statusList = [
  {
    name: () => i18n.t('MetaName.Confirm Collect Money'),
    value: 0,
  },
  {
    name: () => i18n.t('MetaName.Locked') + ' ' + route.params.metaName,
    value: 1,
  },
  {
    name: () => i18n.t('MetaName.Register') + ' ' + route.params.metaName,
    value: 2,
  },
  {
    name: () =>
      i18n.t('MetaName.Confirm') +
      ' ' +
      route.params.metaName +
      ' ' +
      i18n.t('MetaName.is uniqueness'),
    value: 3,
  },
  {
    name: () => i18n.t('MetaName.Register Success'),
    value: 4,
  },
]

function getMetaName() {
  return new Promise<void>(async (resolve, reject) => {
    const res = await GetMetaNameIsRegister(route.params.metaName as string).catch(error => {
      ElMessage.error(error.message)
    })
    if (res?.code === 0) {
      metaName.val = res.data
      resolve()
    }
  })
}

if (route.params.metaName) {
  getMetaName().then(() => {
    isSkeleton.value = false
  })
}
</script>

<style lang="scss" scoped src="./Register.scss"></style>
