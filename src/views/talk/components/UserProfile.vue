<template>
  <div class="h-22 border-t border-dark-100 border-solid shrink-0 bg-white">
    <div class="h-full w-full flex items-center justify-between px-3">
      <div class="flex items-center space-x-3">
        <!-- 头像 -->
        <UserAvatar
          :meta-id="userStore.user!.metaId"
          :image="userStore.user!.avatarImage"
          :name="userStore.user!.name"
          class="w-12 h-12 shrink-0"
        />

        <div class="">
          <!-- 用户名 -->
          <div class="text-dark-800 text-base font-medium truncate w-36 lg:w-32">
            {{ user.name }}
          </div>

          <!-- 用户metaId-->
          <div class="text-dark-300 text-xs font-normal">
            MetaID: {{ user?.metaId?.substring(0, 6) }}
          </div>
        </div>
      </div>

      <!-- 设置按钮 -->
      <div class="text-dark-800 cursor-pointer" @click="showSetting = true">
        <Icon name="settings" class="w-6 h-6" />
      </div>

      <!-- 设置弹窗 -->
      <Teleport to="body">
        <SettingsModal v-if="showSetting" @close-modal="showSetting = false" />
      </Teleport>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useUserStore } from '@/stores/user'
import { ref } from 'vue'
import SettingsModal from './modals/SettingsModal.vue'
const userStore = useUserStore()

const showSetting = ref(false)
const user = ref({
  name: 'Riverrun46',
  id: 1,
  avatarTxId: 'd1d25eadfbac91e3192b8012a8a9de6be8ad642dde7e76fdc344e96e94dc32b5',
  avatarType: 'avatar',
  status: 'online',
  metaId: '261562cd13734c7e9f3809e32d3d7c56f0b27788f88d6738fc95f96ddb89eb01',
})
</script>

<style lang="scss" scoped></style>
