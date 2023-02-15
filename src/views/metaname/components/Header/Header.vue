<template>
  <header>
    <div class="metaname-container flex flex-align-center">
      <div class="phone-warp">
        <Icon
          :name="isShowPhoneMenu ? 'x_mark' : 'bars'"
          id="phone-menu-btn"
          @click="isShowPhoneMenu = true"
        />
      </div>
      <div class="flex1">
        <LogoVue />
      </div>
      <div class="operates flex flex-align-center">
        <!-- lang -->
        <ElDropdown trigger="click" @visible-change="val => (isShowLang = val)">
          <a
            class="lang flex flex-align-center flex-pack-center user-warp-item"
            :class="{ active: isShowLang }"
          >
            {{ $i18n.locale.toUpperCase() }}
            <Icon name="ins" />
          </a>
          <template #dropdown>
            <ElDropdownMenu>
              <ElDropdownItem
                v-for="(item, index) in $i18n.availableLocales"
                :key="index"
                @click="SetLang(item)"
              >
                <div class="flex flex-align-center lang-item">
                  <span class="name">{{ item.toUpperCase() }}</span>
                </div>
              </ElDropdownItem>
            </ElDropdownMenu>
          </template>
        </ElDropdown>

        <template v-if="userStore.isAuthorized">
          <ElDropdown trigger="click" @visible-change="val => (isShowLang = val)">
            <UserAvatar
              :meta-id="userStore.user!.metaId"
              :name="userStore.user!.name"
              :image="userStore.user!.avatarImage"
              :disabled="true"
            />
            <template #dropdown>
              <ElDropdownMenu>
                <ElDropdownItem
                  v-for="(item, index) in userOperates"
                  :key="index"
                  @click="item.fun"
                >
                  <div class="flex flex-align-center user-operate-item">
                    <span class="name">{{ item.name() }}</span>
                  </div>
                </ElDropdownItem>
              </ElDropdownMenu>
            </template>
          </ElDropdown>
        </template>
        <template v-else>
          <PlainBtn class="connect-btn" @click="rootStore.$patch({ isShowLogin: true })">
            {{ $t('Login.connectWallet') }}
          </PlainBtn>
        </template>
      </div>

      <nav class="flex flex-align-center flex-pack-center">
        <template v-for="(item, index) in navs" :key="index">
          <RouterLink :to="item.route">{{ item.name() }}</RouterLink>
        </template>
      </nav>
    </div>
  </header>

  <ElDrawer v-model="isShowPhoneMenu" :direction="'ttb'" :size="'auto'" :title="$t('Menu')">
    <div class="phone-nav">
      <nav>
        <template v-for="(item, index) in navs" :key="index">
          <RouterLink :to="item.route" @click="isShowPhoneMenu = false">{{
            item.name()
          }}</RouterLink>
        </template>
      </nav>
    </div>
  </ElDrawer>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import LogoVue from '../Logo/Logo.vue'
import { SetLang } from '@/utils/util'
import { useUserStore } from '@/stores/user'
import { useRoute, useRouter } from 'vue-router'
import PlainBtn from '../PlainBtn/PlainBtn.vue'
import { useRootStore } from '@/stores/root'
import { EnvMode } from '@/enum'

const rootStore = useRootStore()
const userStore = useUserStore()
const route = useRoute()
const router = useRouter()
const i18n = useI18n()
const isShowPhoneMenu = ref(false)

const isShowLang = ref(false)
const userOperates = [
  {
    name: () => i18n.t('logout'),
    fun: () => {
      userStore.logout(route)
    },
  },
]

const navs = [
  {
    name: () => i18n.t('MetaName.Search'),
    route: {
      name: 'metaNameSearch',
    },
  },
  {
    name: () => i18n.t('MetaName.Mine'),
    route: {
      name: 'metaNameMine',
    },
  },
  {
    name: () => i18n.t('MetaName.Market'),
    route: {
      name: 'metaNameMarket',
    },
  },
]
</script>

<style lang="scss" scoped src="./Header.scss"></style>
