<template>
  <div class="metaname-sm-container mine-metaname">
    <Navigation :list="[$t('MetaName.Mine'), $t('MetaName.Domain Name')]" />

    <ElSkeleton :loading="isSkeleton" animated>
      <Image :src="metaName.val!.infos.icon" class="cover " />

      <div class="section">
        <div class="title">{{ $t('MetaName.Domain Configuration') }}</div>
        <div class="content">
          <template v-for="item in configs" :key="item.name">
            <template v-if="item.value">
              <div class="config-list flex flex-align-center">
                <div class="lable">{{ item.name }}</div>
                <div class="cont flex1 flex flex-align-center">
                  <div class="value flex1">{{ item.value }}</div>
                  <span class="edit flex">
                    <span class="not-set">{{ $t('MetaName.Not set') }}</span>
                    <Icon name="edit" />
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
                    <div class="value flex1">{{ child.value }}</div>
                    <span class="edit flex">
                      <span class="not-set" v-if="!child.value">{{ $t('MetaName.Not set') }}</span>
                      <Icon name="edit" />
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
          <a class="btn primary">{{ $t('MetaName.Renew') }}</a>
        </div>
        <div class="content">
          <div class="info-list">
            <div class="info-item flex flex-align-center">
              <div class="flex1">
                <span class="label">{{ $t('MetaName.Registration time') }}</span>
              </div>
              <span class="value">2023.1.3 12:32 (UTC)</span>
            </div>
            <div class="info-item flex flex-align-center">
              <div class="flex1">
                <span class="label">{{ $t('MetaName.Expire date') }}</span>
              </div>
              <span class="value flex flex-align-center"
                >2023.1.3 12:32 (UTC) <Icon name="question_circle"
              /></span>
            </div>
          </div>

          <div class="info-list">
            <div class="info-item flex flex-align-center">
              <div class="flex1">
                <span class="label">{{ $t('MetaName.Transaction TX') }}</span>
              </div>
              <span class="value"><a>69a528...ae2005</a></span>
            </div>
          </div>
        </div>
      </div>
    </ElSkeleton>
  </div>
</template>

<script setup lang="ts">
import { GetMetaNameIsRegister } from '@/api/metaname'
import { reactive, ref } from 'vue'
import { useRoute } from 'vue-router'
import Navigation from '../components/Navigation/Navigation.vue'

const route = useRoute()

const configs = reactive([
  {
    name: 'METAID',
    value: '23123',
  },
  {
    name: 'ADDRESSES',
    list: [
      {
        name: 'ETH',
        value: '',
      },
      {
        name: 'Polygon',
        value: '',
      },
      {
        name: 'Solana',
        value: 'asdasda 546a5s45啊实打实 adasd asdas大点 callmesoul',
      },
      {
        name: 'MVC',
        value: '',
      },
      {
        name: 'BSV',
        value: '',
      },
      {
        name: 'IPFS',
        value: '',
      },
      {
        name: 'MetaFile',
        value: '',
      },
      {
        name: 'DNS',
        value: '',
      },
    ],
  },
  {
    name: 'CONTENT',
    value: '23123',
  },
  {
    name: 'TEXT RECORD',
    list: [
      {
        name: 'email',
        value: '',
      },
      {
        name: 'url',
        value: '',
      },
      {
        name: 'com.discord',
        value: '',
      },
      {
        name: 'com.github',
        value: '',
      },
      {
        name: 'com.reddit',
        value: '',
      },
      {
        name: 'com.twitter',
        value: '',
      },
      {
        name: 'com.telegram',
        value: '',
      },
    ],
  },
])
const isSkeleton = ref(true)

const metaName: { val: MetaNameSearchResult | null } = reactive({ val: null })

function getInfo() {
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

getInfo().then(() => {
  isSkeleton.value = false
})
</script>

<style lang="scss" scoped src="./MetaName.scss"></style>
