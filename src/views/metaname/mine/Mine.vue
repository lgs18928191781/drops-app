<template>
  <div class="metaname-sm-container">
    <div class="mine-section">
      <div class="title">{{ $t('MetaName.Currently Connected Wallet') }}</div>
      <div class="content">
        <div class="current-wallet flex flex-align-center">
          <UserAvatar
            :meta-id="userStore.user!.metaId"
            :image="userStore.user!.avatarImage"
            :name="userStore.user!.name"
          />
          <div class="cont flex1">
            <div class="name">{{ userStore.user!.name }}</div>
            <div class="metaid">
              {{ userStore.user!.metaId.slice(0, 6) }}...{{ userStore.user!.metaId.slice(-6) }}
            </div>
          </div>
          <PlainBtnVue>
            {{ $t('MetaName.Switch Wallet') }}
          </PlainBtnVue>
        </div>
      </div>
    </div>

    <div class="mine-section">
      <div class="title">{{ $t('MetaName.My MetaName') }}</div>
      <div class="content">
        <div
          class="metaname-list"
          v-infinite-scroll="load"
          :infinite-scroll-immediate="false"
          :infinite-scroll-distance="100"
        >
          <div
            class="metaname-item flex "
            v-for="(item, index) in Array.from({ length: 6 })"
            :key="index"
          >
            <Image class="cover" src="" />
            <div class="cont flex1">
              <div class="name">lsongren.meta</div>
              <div class="time">
                {{ $t('MetaName.Expire date') }}:&nbsp;{{ $t('MetaName.About') }}&nbsp;{{
                  $filters.dateTimeFormat('0', 'YYYY-MM-DD hh:MM')
                }}
              </div>
              <div class="operate flex flex-align-center flex-pack-end">
                <a class="btn primary"> {{ $t('MetaName.Domain Renewal') }}</a>
                <RouterLink :to="{ name: 'mineMetaName', params: { metaName: 'kpio' } }">
                  <PlainBtnVue>
                    {{ $t('MetaName.Configure domain name') }}
                  </PlainBtnVue>
                </RouterLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <RenewModal v-model="isShowRenew" :metaname="'kpio'" />
</template>

<script setup lang="ts">
import { useUserStore } from '@/stores/user'
import { ref } from 'vue'
import PlainBtnVue from '../components/PlainBtn/PlainBtn.vue'
import RenewModal from '../components/RenewModal/RenewModal.vue'

const userStore = useUserStore()
const isShowRenew = ref(true)

function load() {}
</script>

<style lang="scss" scoped src="./Mine.scss"></style>
