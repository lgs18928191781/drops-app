<template>
  <Popover class="relative cursor-pointer w-10 h-10 max-w-full max-h-full">
    <PopoverButton>
      <Image
        :src="image"
        :type="type"
        :default-image="DefaultAvatar"
        :custom-class="'avatar-rounded'"
      />
    </PopoverButton>
    <PopoverPanel class="absolute top-0 right-0 translate-x-full z-50 pl-2">
      <UserCardVue :meta-id="metaId" :name="name" v-model="isShowUserCard" />
    </PopoverPanel>
  </Popover>
</template>
<script lang="ts" setup>
import { ref } from 'vue'
import { Popover, PopoverButton, PopoverPanel } from '@headlessui/vue'

import UserCardVue from '../UserCard/UserCard.vue'
import DefaultAvatar from '@/assets/images/default_user.png'

interface Props {
  name?: string
  metaId?: string
  image: string
  type?: 'metaId' | 'metafile'
  disabled?: boolean
}
const props = withDefaults(defineProps<Props>(), {
  disabled: false,
  type: 'metaId',
})

const isShowUserCard = ref(false)
</script>
