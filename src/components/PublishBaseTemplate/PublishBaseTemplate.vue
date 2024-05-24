<template>
  <ElDialog
    :model-value="modelValue"
    class="sm none-header none-padding"
    :close-on-click-modal="false"
    :destroy-on-close="true"
    @close="emit('close')"
  >
    <div
      class="publish"
      v-loading="loading"
      :element-loading-svg="LoadingTEXT"
      :element-loading-text="$t('Loading')"
    >
      <div class="top flex flex-align-center">
        <div class="user flex flex-align-center flex1">
          <UserAvatar
            :meta-id="userStore.user!.metaId"
            :image="connectStore.last.user.avatarId"
            :name="userStore.user!.name"
            :meta-name="userStore.user!.metaName"
            :disabled="true"
          />
          <div class="cont flex1">
            <div class="name">
              <UserName :name="userStore.user!.name" :meta-name="userStore.user!.metaName" />
            </div>
            <div class="metaid">
              {{replayUser ? $t('Replying to') :  'MetaID: ' + userStore.user!.metaId!.slice(0, 6)}}
              <template v-if="replayUser"
                ><span class="user">&nbsp;@&nbsp;{{ replayUser }}</span></template
              >
            </div>
          </div>
        </div>
        <a
          class="close-btn flex flex-align-center flex-pack-center"
          @click="emit('update:modelValue', false)"
        >
          <Icon name="x_mark" />
        </a>
      </div>
      <div class="text">
        <textarea
          v-model="content"
          @input="val => emit('update:text', content)"
          autofocus
          :placeholder="placeholder"
        />
        <slot name="repostBuzz"></slot>
      </div>

      <slot name="other"></slot>
    </div>
  </ElDialog>
</template>

<script setup lang="ts">
import { useUserStore } from '@/stores/user'
import { ref, watch } from 'vue'
import { LoadingTEXT } from '@/utils/LoadingSVGText'
import { useConnectionStore } from '@/stores/connection'

const props = defineProps<{
  modelValue: boolean
  text: string
  loading?: boolean
  replayUser?: string
  placeholder?: string
}>()

const emit = defineEmits(['update:modelValue', 'update:text', 'close'])
const userStore = useUserStore()
const content = ref(props.text)
const connectStore = useConnectionStore()
watch(
  () => props.text,
  () => {
    content.value = props.text
  }
)
</script>

<style lang="scss" scoped src="./PublishBaseTemplate.scss"></style>
