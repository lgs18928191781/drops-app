<template>
  <div class="avatar" :class="{ disabled }" @click.stop="() => {}">
    <Image :src="image" :type="type" :default-image="DefaultAvatar" />
    <!-- <el-popover
      placement="right-start"
      :width="'auto'"
      trigger="click"
      :disabled="disabled"
      v-model:visible="isShowUserCard"
    >
      <template #reference>
        <Image :src="image" :type="type" :default-image="DefaultAvatar" />
      </template>
      <UserCardVue :meta-id="metaId" :name="name" v-model="isShowUserCard" />
    </el-popover> -->
  </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
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
<style lang="scss" scoped src="./UserAvatar.scss"></style>
