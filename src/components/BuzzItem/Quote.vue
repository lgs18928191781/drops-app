<template>
  <div
    class="forward buzz-item"
    @click.stop="$router.push({ name: 'appBuzzDetail', params: { txId: buzz.txId } })"
  >
    <div class="header">
      <div class="user-info" @click.stop="$filters.toUserHome(buzz.metaId)">
        <div class="head">
          <UserAvatar :meta-id="buzz.metaId" :type="buzz.avatarType" />
        </div>
        <div class="info">
          <div class="name">{{ buzz.userName }}</div>
          <div class="desc">
            <span>MetaID: {{ buzz.metaId.slice(0, 6) }}</span>
            <span class="time">{{ $filters.dateTimeFormat(buzz.timestamp) }}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="content">
      <pre
        class="text"
        v-html="buzz.content.length > 80 ? buzz.content.slice(0, 80) + '...' : buzz.content"
      ></pre>
      <Attachment :attachments="buzz.attachments" />
    </div>
  </div>
</template>

<script setup lang="ts">
import Attachment from './Attachment.vue'

interface Props {
  buzz: BuzzItem
}

const props = withDefaults(defineProps<Props>(), {})
</script>

<style lang="scss" scoped src="./Quote.scss"></style>
