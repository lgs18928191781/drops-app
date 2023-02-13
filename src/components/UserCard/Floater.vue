<template>
  <Dialog :open="true" @close="setIsOpenUserCard" class="bg-white/30 fixed inset-0 z-[999]">
    <DialogPanel class="">
      <DialogTitle>Deactivate account</DialogTitle>
      <DialogDescription>
        This will permanently deactivate your account
      </DialogDescription>
    </DialogPanel>
  </Dialog>
</template>

<script lang="ts" setup>
import { useLayoutStore } from '@/stores/layout'
import { Dialog, DialogPanel, DialogTitle, DialogDescription } from '@headlessui/vue'

const layout = useLayoutStore()
const setIsOpenUserCard = (isOpen: boolean) => {
  layout.isShowUserCard = isOpen
}
</script>
