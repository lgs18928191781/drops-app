<template>施工中</template>

<script lang="ts" setup>
import { useTalkStore } from '@/stores/talk'

const talk = useTalkStore()
talk.activeChannelId = 'topics'
</script>
