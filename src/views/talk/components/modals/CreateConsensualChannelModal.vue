<template>
  <BaseModal :show-control="ShowControl.isShowCreateConsensualChannelModal">
    <template v-slot:title>
      {{ $t('Talk.Community.create_consensual_channel') }}
    </template>

    <template v-slot:body>
      123
    </template>
  </BaseModal>
</template>

<script lang="ts" setup>
import { ShowControl } from '@/enum'
import BaseModal from './BaseModal.vue'
import {} from '@headlessui/vue'
</script>
