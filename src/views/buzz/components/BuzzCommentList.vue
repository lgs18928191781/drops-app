<template>
  <div class="buzz-comment-list">
    <template v-for="(item, index) in commentList" :key="index">
      <div class="comment-item">
        <div class="header flex flex-align-center">
          <div class="user-info flex1">
            <div class="head">
              <UserAvatar
                :meta-id="item.metaId"
                :image="item.avatarImage"
                :name="item.userName"
                :meta-name="item.userInfo.metaName"
              />
            </div>
            <div class="info">
              <div class="name">
                <UserName :name="item.userName" :meta-name="item.userInfo.metaName" />
              </div>
              <div class="desc">
                <span>MetaID: {{ sliceStr(item.metaId) }}</span>
                <span class="time">{{ $filters.dateTimeFormat(item.timestamp) }}</span>
              </div>
            </div>
          </div>
          <div class="operate flex flex-align-center">
            <a
              class="flex flex-align-center"
              :class="{ active: item.hasComment }"
              @click.stop="
                emit('replay', {
                  txId: item.buzzTxId,
                  username: item.userName,
                  userAddress: item.zeroAddress,
                  commentTo: item.txId,
                  replyTo: '',
                })
              "
            >
              <CommentIcon /> {{ item.commentCount }}
            </a>
            <a
              class="flex flex-align-center"
              :class="{ active: item.hasMyLike, ing: isLikeIng[index] }"
              @click.stop="like(item, index)"
            >
              <LikeIcon /> {{ item.likeCount }}
            </a>
          </div>
        </div>
        <div class="content">
          <div class="text" v-html="item.content"></div>
          <div
            class="children-comment"
            v-if="item.subInteractiveItem && item.subInteractiveItem.length"
          >
            <template v-for="(child, childIndex) in item.subInteractiveItem" :key="childIndex">
              <div
                class="child-comment-item flex flex-align-start"
                @click.stop="
                  emit('replay', {
                    txId: item.buzzTxId,
                    username: child.userName,
                    userAddress: child.zeroAddress,
                    commentTo: item.txId,
                    replyTo: child.metaId,
                  })
                "
              >
                <UserAvatar
                  :meta-id="child.metaId"
                  :image="child.avatarImage"
                  :name="child.userName"
                  :metaName="child.userInfo.metaName"
                ></UserAvatar>
                <div class="name flex flex-align-center">
                  <a class="flex flex-align-center"
                    ><UserName
                      :name="child.userName"
                      :meta-name="child.userInfo.metaName"
                      :no-tag="true"
                  /></a>
                  <template v-if="child.replyToUserName"
                    ><span>{{ $t('Replay') }}</span
                    ><a class="flex flex-align-center"
                      ><UserName
                        :name="child.replyToUserName"
                        :meta-name="child.replyToUserMetaName"
                        :no-tag="true"/></a></template
                  >：
                </div>
                <div class="flex1 content-child" v-html="child.content"></div>
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
import { computed, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import IsNullVue from '@/components/IsNull/IsNull.vue'
import CommentIcon from '@/assets/svg/comment.svg'
import LikeIcon from '@/assets/svg/like.svg'
interface Props {
  commentList: BuzzInteractiveItem[]
}

const router = useRouter()
const emit = defineEmits(['replay', 'like'])
const props = withDefaults(defineProps<Props>(), {})
const isLikeIng: boolean[] = reactive([])

function sliceStr(str?: string, len = 8) {
  return str ? str.slice(0, len) : ''
}

function like(item: BuzzInteractiveItem, index: number) {
  if (item.hasMyLike || isLikeIng[index]) return
  isLikeIng[index] = true
  const done = () => {
    isLikeIng[index] = false
  }
  emit('like', { txId: item.txId, address: item.zeroAddress, done })
}
</script>
<style scoped lang="scss">
@import '@/assets/styles/var.scss';
@keyframes sclae {
  0% {
    transform: scale(1);
  }

  50% {
    transform: scale(1.2);
    /*扩大到4倍*/
  }

  to {
    transform: scale(1);
  }
}
.buzz-comment-list {
  margin-top: 7px;
  .comment-item {
    padding: 20px 0;
    box-sizing: border-box;
    border-bottom: 1px solid var(--divid-color);

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
            font-weight: 700;
            font-size: 15px;
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

      .operate {
        a {
          margin-right: 16px;
          font-size: 12px;
          color: #bfc2cc;
          &:last-child {
            margin-right: 0;
          }
          svg {
            width: 24px;
            height: 24px;
            margin-right: 6px;
            :deep(path) {
              &:nth-child(1) {
                display: none;
              }
              &:nth-child(2) {
                fill: #bfc2cc;
              }
              &:nth-child(3) {
                fill: #bfc2cc;
              }
            }
          }

          &:first-child {
            svg {
            }
          }

          &:hover {
            svg {
              :deep(path) {
                &:nth-child(3) {
                  fill: var(--themeTextColor);
                }
              }
            }
          }

          &.active {
            color: #fc6d5e;
            svg {
              :deep(path) {
                &:nth-child(2) {
                  fill: #fc6d5e;
                }
                &:nth-child(3) {
                  fill: #fc6d5e;
                }
              }
            }
          }

          &.ing {
            svg {
              animation: sclae 1s infinite;
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
        line-height: 20px;
        padding: 0;
        font-size: 15px;
        white-space: pre-line;
        word-break: break-word;
      }
      .children-comment {
        padding: 8px 12px;
        border-radius: 8px;
        background: var(--divid-color);
        margin-top: 18px;

        .child-comment-item {
          display: flex;
          padding-bottom: 8px;
          margin-bottom: 8px;
          border-bottom: 1px solid #ebecf0;

          &:last-child {
            margin-bottom: 0;
            border-bottom: 0;
            padding-bottom: 0;
          }

          .avatar {
            width: 24px;
            height: 24px;
            line-height: 26px;
            margin-right: 6px;
          }

          .name {
            flex-shrink: 0;
            line-height: 1.7;
            font-size: 12px;
            line-height: 26px;
            color: #909399;
            margin-right: 6px;
            a {
              color: var(--color-hover);
              max-width: 60px;
              @extend %text-ellipsis;
            }
            span {
              margin: 0 3px;
            }
          }
          .content-child {
            flex-grow: 1;
            margin: 0 0 0 6px;
            line-height: 1.7;
            font-size: 16px;
            line-height: 26px;
            white-space: pre-line;
          }
        }
      }
    }
  }
}
</style>
