<template>
  <div class="buzz-comment-list">
    <template v-for="(item, index) in commentList" :key="index">
      <div
        class="comment-item"
        @click.stop="
          emit('reply', { txId: item.txId, username: item.userName, userAddress: item.zeroAddress })
        "
      >
        <div class="header">
          <div class="user-info">
            <div class="head">
              <UserAvatar :meta-id="item.metaId" />
            </div>
            <div class="info">
              <div class="name">{{ item.userName }}</div>
              <div class="desc">
                <span>MetaID: {{ sliceStr(item.metaId) }}</span>
                <span class="time">{{ $filters.dateTimeFormat(item.timestamp) }}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="content">
          <div class="text" v-html="item.content"></div>
          <div class="children-comment" v-if="item.children && item.children.length">
            <template v-for="(child, childIndex) in item.children" :key="childIndex">
              <div
                class="child-comment-item"
                @click.stop="
                  emit('reply', {
                    txId: child.txId,
                    username: child.userName,
                    userAddress: child.zeroAddress,
                  })
                "
              >
                <div class="name">{{ child.userName }}:</div>
                <pre class="flex1" v-html="child.content"></pre>
              </div>
            </template>
          </div>
        </div>
      </div>
    </template>

    <IsNullVue v-if="commentList.length <= 0" />
  </div>
</template>

<script setup lang="ts">
import { isApp } from '@/stores/root'
import { txId } from '@/utils/filters'
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import IsNullVue from '@/components/IsNull/IsNull.vue'
interface Props {
  commentList: any
}

const router = useRouter()
const emit = defineEmits(['reply'])
const props = withDefaults(defineProps<Props>(), {
  commentList: [],
})

function sliceStr(str?: string, len = 8) {
  return str ? str.slice(0, len) : ''
}
</script>
<style scoped lang="scss">
.buzz-comment-list {
  margin-top: 7px;
  .comment-item {
    padding: 20px 0;
    box-sizing: border-box;
    border-bottom: 1px solid #f4f7f9;

    .header {
      display: flex;
      justify-content: space-between;

      .user-info {
        display: flex;
        flex-grow: 1;
        .head {
          width: 36px;
          height: 36px;
          flex-shrink: 0;
          margin-right: 12px;

          .avatar {
            display: block;
            width: 100%;
            height: 100%;
          }
        }
        .info {
          flex-grow: 1;
          overflow: hidden;
          .name {
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
          .desc {
            color: #bfc2cc;
            font-size: 10px;
            margin-top: 2px;

            .time {
              padding-left: 8px;
            }
          }
        }
      }
    }

    .content {
      box-sizing: border-box;
      padding-left: 48px;
      margin-top: 18px;
      .text {
        line-height: 1.7;
        padding: 0;
        font-size: 16px;
      }
      .children-comment {
        padding: 8px 12px;
        border-radius: 8px;
        background: #26262e;

        .child-comment-item {
          display: flex;
          padding-bottom: 8px;
          margin-bottom: 8px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);

          &:last-child {
            margin-bottom: 0;
            border-bottom: 0;
            padding-bottom: 0;
          }

          .name {
            flex-shrink: 0;
            line-height: 1.7;
            font-size: 12px;
          }
          pre {
            flex-grow: 1;
            margin: 0 0 0 6px;
            line-height: 1.7;
            font-size: 12px;
          }
        }
      }
    }
  }
}
</style>
