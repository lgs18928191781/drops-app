<template>
    <ElSkeleton :loading="skeleton" animated>
        <template #template>
            <div class="nft-msg-card flex">
                <ElSkeletonItem variant="image" class="cover" />
                <div class="cont flex1 flex flex-v">
                    <div class="flex1">
                    <div class="name"><ElSkeletonItem variant="text" /></div>
                    <div class="msg-item flex flex-align-center">
                        <span class="key"><ElSkeletonItem variant="text" /></span>
                        <div class="value  flex1 flex flex-align-center">
                        <div class="author flex flex-align-center">
                            <ElSkeletonItem variant="circle" style="width: 20px; height: 20px;" />
                            <ElSkeletonItem variant="text" class="username" style="width: 100px;" />
                        </div>
                        </div>
                    </div>
                    <div class="msg-item flex flex-align-center">
                        <span class="key"><ElSkeletonItem variant="text" /></span>
                        <div class="value flex1"><ElSkeletonItem variant="text" /></div>
                    </div>
                    </div>
                </div>
            </div>
        </template>
        <template #default>
            <div class="nft-msg-card flex">
                <el-image class="cover"
                    :src="props.coverUrl"
                    :alt="props.name"
                    fit="cover"
                    :preview-src-list="[props.coverUrl]">
                </el-image>
                <div class="cont flex1 flex flex-v">
                    <div class="flex1">
                    <div class="name">{{ props.name }}</div>
                    <div class="msg-item flex flex-align-center">
                        <span class="key">{{ $t('creater') }}：</span>
                        <div class="value  flex1 flex flex-align-center">
                        <div class="author flex flex-align-center">
                            <img class="" :src="$filters.avatar(props.metaId)" :alt="props.userName" />
                            <span class="username">{{ props.userName }}</span>
                        </div>
                        </div>
                    </div>
                    <div class="msg-item flex flex-align-center">
                        <span class="key">{{ $t('createtime') }}：</span>
                        <div class="value flex1">{{ $filters.dateTimeFormat(props.createdAt) }}</div>
                    </div>
                    </div>
                    <CertTemp v-if="props.isShowCert" />
                </div>
            </div>
        </template>
    </ElSkeleton>
    
</template>
<script lang="ts" setup>
import { ElSkeleton, ElSkeletonItem } from 'element-plus'
import { computed, defineProps } from 'vue'
import CertTemp from '@/components/Cert/Cert.vue'

const props = defineProps<{
    coverUrl: string,
    name: string,
    metaId: string,
    userName: string,
    createdAt: number,
    isShowCert?: boolean
    skeleton?: boolean
}>()
</script>

<style lang="scss" scoped src="./NftMsgCard.scss"></style>