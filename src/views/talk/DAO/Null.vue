<template>
  <div class="h-full flex flex-align-center flex-pack-center">
    <div
      class="main-border px-4 py-2 cursor-pointer"
      @click="createDAO"
      :class="[userStore.user?.metaId === talk.activeCommunity?.ownerMetaId ? 'primary' : 'faded']"
    >
      {{
        userStore.user?.metaId === talk.activeCommunity?.ownerMetaId
          ? $t('DAO.Create DAO')
          : $t('DAO.The community has not opened a DAO')
      }}
    </div>
  </div>

  <CreateDaoModal v-model="isShwoCreateDAOModal" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import CreateDaoModal from '../components/modals/CreateDaoModal.vue'
import { useTalkStore } from '@/stores/talk'
import { useUserStore } from '@/stores/user'

const talk = useTalkStore()
const userStore = useUserStore()
const isShwoCreateDAOModal = ref(false)

function createDAO() {
  if (userStore.user?.metaId !== talk.activeCommunity?.ownerMetaId) return
  isShwoCreateDAOModal.value = true
}
</script>

<style lang="scss" scoped></style>
