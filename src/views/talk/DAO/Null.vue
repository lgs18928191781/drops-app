<template>
  <div class="h-full flex flex-align-center flex-pack-center">
    <div class="main-border primary px-4 py-2 cursor-pointer" @click="isShwoCreateDAOModal = true">
      {{ $t('DAO.Create DAO') }}
    </div>
  </div>

  <CreateDaoModal v-model="isShwoCreateDAOModal" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import CreateDaoModal from '../components/modals/CreateDaoModal.vue'

const isShwoCreateDAOModal = ref(false)
</script>

<style lang="scss" scoped></style>
