<template>
  <div class="avatar" :class="{ disabled }" @click.stop="() => {}">
    <el-popover placement="right-start" :width="'auto'" trigger="hover" :disabled="disabled">
      <template #reference>
        <Image :src="image" :type="type" />
      </template>
      <UserCardVue :meta-id="metaId" :name="name" />
    </el-popover>
  </div>
</template>
<script lang="ts" setup>
import { useRouter } from 'vue-router'
import UserCardVue from '../UserCard/UserCard.vue'

interface Props {
  name: string
  metaId: string
  image: string
  type?: 'metaId' | 'metafile'
  disabled?: boolean
}
const props = withDefaults(defineProps<Props>(), {
  disabled: false,
  type: 'metaId',
})
</script>
<style lang="scss" scoped src="./UserAvatar.scss"></style>
