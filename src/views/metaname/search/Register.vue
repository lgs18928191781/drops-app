<template>
  <div class="metaname-sm-container">
    <Navigation
      :list="[$t('MetaName.Search'), $t('MetaName.Register'), $t('MetaName.Registering')]"
    />

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
        <div class="check-warp flex flex-align-center flex-pack-center" v-if="status >= item.value">
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
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import { Loading } from '@element-plus/icons-vue'
import PlainBtnVue from '../components/PlainBtn/PlainBtn.vue'
import Navigation from '../components/Navigation/Navigation.vue'

const i18n = useI18n()
const route = useRoute()

const status = ref(0)

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
</script>

<style lang="scss" scoped src="./Register.scss"></style>
