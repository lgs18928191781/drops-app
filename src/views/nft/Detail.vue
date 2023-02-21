<template>
  <div class="nft-detail" v-if="nft.val">
    <div class="nft-msg flex">
      <div class="cover-warp">
        <NFTCover
          :needGizp="true"
          :cover="[
            nft.val!.nftIcon,
            nft.val!.nftBackIcon,
          ]"
          :is-show-prew="true"
          :is-lazy="false"
          :is-remint="nft.val!.nftHasCompound"
        />
      </div>
      <div class="flex1 flex flex-v">
        <div class="flex1">
          <div class="top flex flex-align-center">
            <div class="flex1">
              <div class="collection-name flex flex-align-center">
                MetaBot Avatar <Icon name="certed" />
              </div>
            </div>
            <div class="operate-list flex flex-align-center">
              <div class="operate-item flex flex-align-center">
                <Icon name="like" />
                <span class="count">0</span>
              </div>
              <div class="operate-item flex flex-align-center">
                <Icon name="share_nft" />
              </div>
            </div>
          </div>
          <div class="name">
            {{ nft.val.nftName }}
          </div>

          <div class="owner flex flex-align-center">
            <UserAvatar
              :meta-id="nft.val.nftOwnerMetaId"
              :image="nft.val.nftOwnerAvatarImage"
              :name="nft.val.nftOwnerName"
            />
            <div class="flex1">
              <div class="owner-msg-item">
                <span class="label">{{ $t('NFT.Owner') }}:</span>
                <span class="value"
                  ><RouterLink :to="{}">
                    <UserName :name="nft.val.nftOwnerName" :meta-name="''" /> </RouterLink
                ></span>
              </div>
              <div class="owner-msg-item">
                <span class="label">MetaID:</span>
                <span class="value">{{ nft.val.nftOwnerMetaId.slice(0, 6) }}</span>
              </div>
            </div>
          </div>

          <div class="current-price">
            <div class="title">{{ $t('NFT.Current price') }}</div>
            <div class="price flex flex-align-end">
              <span class="space">1.02 Space</span>
              <span class="curreny">$34.48</span>
            </div>
          </div>
        </div>

        <div
          class="main-border flex flex-align-center flex-pack-center"
          :class="nftBtnClass"
          @click="nftBtnFunction"
        >
          {{ nftBtnText }}
        </div>
      </div>
    </div>

    <div class="nft-other-msg flex">
      <div class="description-warp">
        <div class="nft-other-msg-section">
          <div class="nft-other-msg-item">
            <div class="title">{{ $t('NFT.Description') }}</div>
            <div class="content">
              <div class="description-list">
                <div class="description-item flex">
                  <span class="label">{{ $t('NFT.Name') }}:</span>
                  <span class="value flex1">{{ nft.val.nftName }}</span>
                </div>
                <div class="description-item flex">
                  <span class="label">{{ $t('NFT.Category') }}:</span>
                  <span class="value flex1">{{ nft.val.nftClassifyList.join(' ') || '--' }}</span>
                </div>
                <div class="description-item flex">
                  <span class="label">{{ $t('NFT.Introduction') }}:</span>
                  <span class="value flex1">{{ nft.val.nftDesc || '--' }}</span>
                </div>
              </div>
            </div>
          </div>

          <div class="nft-other-msg-item">
            <div class="title">{{ $t('NFT.Details') }}</div>
            <div class="content">
              <div class="description-list">
                <div class="description-item flex">
                  <span class="label">TokenID:</span>
                  <span class="value flex1">
                    <template v-if="nft.val.nftTokenId">
                      {{ nft.val.nftTokenId }}
                      <a @click="copy(nft.val!.nftTokenId)">{{ $t('Copy') }}</a
                      ><a @click="tx(nft.val!.nftTokenId)">{{ $t('NFT.Check') }}</a>
                    </template>
                    <template v-else>
                      --
                    </template>
                  </span>
                </div>
                <div class="description-item flex">
                  <span class="label">{{ $t('NFT.Create Time') }}:</span>
                  <span
                    class="value flex1"
                    >{{ nft.val!.nftTimestamp ? $filters.dateTimeFormat(nft.val!.nftTimestamp) : '--'}}</span
                  >
                </div>
                <div class="description-item flex">
                  <span class="label">{{ $t('NFT.Issue TXID') }}:</span>
                  <span class="value flex1">
                    <template v-if="nft.val.nftIssueMetaTxId">
                      {{ nft.val.nftIssueMetaTxId
                      }}<a @click="copy(nft.val.nftIssueMetaTxId)">{{ $t('Copy') }}</a
                      ><a @click="tx(nft.val.nftIssueMetaTxId)">{{ $t('NFT.Check') }}</a>
                    </template>
                    <template v-else>--</template>
                  </span>
                </div>

                <div class="description-item flex">
                  <span class="label">{{ $t('NFT.Creator') }}:</span>
                  <span class="value flex1 flex flex-align-center">
                    <div class="creator flex flex-align-center">
                      <UserAvatar
                        :meta-id="nft.val.nftIssueMetaId"
                        :image="nft.val.nftIssueAvatarImage"
                        :name="nft.val.nftIssuer"
                      />
                      <div class="flex1">
                        <div class="username">
                          <RouterLink :to="{}">
                            <UserName :name="nft.val.nftIssuer" :meta-name="''" />
                          </RouterLink>
                        </div>
                        <div class="meta-id">MetaID: {{ nft.val!.nftIssueMetaId.slice(0, 6) }}</div>
                      </div>
                    </div>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="flex1">
        <div class="nft-other-msg-section">
          <div class="nft-other-msg-item">
            <div class="title">{{ $t('NFT.Record') }}</div>
            <div class="content">
              <div class="record">
                <div class="record-item th flex flex-align-center">
                  <span class="owner flex1">{{ $t('NFT.Owner') }}</span>
                  <span class="role flex1">{{ $t('NFT.Role') }}</span>
                  <span class="time flex1">{{ $t('NFT.Time') }}</span>
                  <span class="price flex1">{{ $t('NFT.Price') }}</span>
                </div>

                <div
                  class="record-item flex flex-align-center"
                  v-for="item in Array.from({ length: 6 })"
                >
                  <Icon name="top" />
                  <span class="owner flex1">
                    <div class="flex flex-align-center">
                      <UserAvatar
                        :meta-id="nft.val.nftIssueMetaId"
                        :image="nft.val.nftIssueAvatarImage"
                        :name="nft.val.nftIssuer"
                      />
                      <span class="name">Sacred Sword</span>
                    </div>
                  </span>
                  <span class="role flex1">{{ $t('NFT.Role') }}</span>
                  <span class="time flex1">2021-09-09 22:00</span>
                  <span class="price flex1 flex flex-align-center"
                    >0.86 Space <Icon name="link" />
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="nft-detail-wrap">
    <ElSkeleton :loading="isShowSkeleton" animated>
      <!-- 骨架屏 -->
      <template #template>
        <DetailSkeletonVue />
      </template>
      <template #default>
        <div class="top flex nftDetailContainer">
          <!-- 封面图 -->
          <div class="cover-warp">
            <NFTCover
              :needGizp="true"
              :cover="[
                nft.val!.nftIcon,
                nft.val!.nftBackIcon,
              ]"
              :is-show-prew="true"
              :is-lazy="false"
              :is-remint="nft.val!.nftHasCompound"
            />
          </div>

          <div class="cont flex1 flex flex-v">
            <div class="name flex flex-align-center">
              <ElPopover
                placement="bottom"
                :width="400"
                trigger="hover"
                popper-class="common-popover"
              >
                <template #reference>
                  <span class="text flex1">{{ nft.val!.nftName }}</span>
                </template>
                {{ nft.val!.nftName }}
              </ElPopover>

              <img :src="ShareIcon" :alt="$t('share')" @click="share" />
            </div>
            <div
              class="series-cert flex flex-align-center"
              v-if="nft.val!.nftGenesisCertificationType"
            >
              <!-- <img src="@/assets/images/icon_cer_nft.png" /> -->
              {{ $t('beCertedSeries') }}：{{ $t(nft.val!.nftGenesisCertificationName) }}
            </div>
            <div class="creater-msg">
              <!-- 铸造者 -->
              <div class="author flex flex-align-center">
                <UserAvatar
                  class="avatar"
                  :meta-id="nft.val!.nftIssueMetaId"
                  :image="nft.val!.nftIssueAvatarImage"
                  :name="nft.val!.nftIssuer"
                />
                <div class="author-msg flex1">
                  <div class="creater">
                    {{ $t('creater') }}:
                    {{ nft.val!.nftIssuer ? nft.val!.nftIssuer : nft.val!.nftIssueAddress }}
                  </div>
                  <div class="metaid" v-if="nft.val!.nftIssueMetaId">
                    MetaID:{{ nft.val!.nftIssueMetaId.slice(0, 6) }}
                  </div>
                </div>
              </div>

              <!-- 认证信息 -->
              <CertTemp
                :metaId="nft.val!.nftIssueMetaId"
                :certed="nft.val!.nftGenesisCertificationType === 1"
              />
            </div>

            <!-- 描述 -->
            <div class="drsc flex1 flex flex-v">
              <div class="title flex flex-align-center">
                <template v-if="(nft.val!.nftSellState === 0 && nft.val?.nftIsReady)">
                  {{ $t('seller') }}

                  <span>{{ nft.val!.nftOwnerName }}</span>
                  {{ $t('theIntro') }}：
                </template>
                <template v-else>{{ $t('drsc') }}:</template>
              </div>
              <div class="cont">
                {{
                  NFTMainMsgDesc && NFTMainMsgDesc.length > 60
                    ? NFTMainMsgDesc.slice(0, 60)
                    : NFTMainMsgDesc
                }}
                <a v-if="NFTMainMsgDesc && NFTMainMsgDesc.length > 60">
                  ...
                  <span @click="isShowDrscDetail = true">{{ $t('getmore') }}</span>
                </a>
              </div>
            </div>
            <div class="operate-warp flex flex-align-center">
              <!-- 非自己的 -->
              <template v-if="!isMyNFT">
                <!-- 购买 -->
                <div
                  class="main-border flex1 flex flex-align-center flex-pack-center"
                  :class="[isSale ? 'primary' : 'faded']"
                  @click="startBuy"
                >
                  <template v-if="isSale">
                    <template v-if="i18n.locale.value === 'zh'">
                      以&nbsp;
                      <AmountVue
                        class="amount-warp"
                        :price="nft.val!.nftIsLegal ? nft.val!.nftLegalPrice : nft.val!.nftPrice"
                        :currency="nft.val!.nftIsLegal ? ToCurrency.CNY : ToCurrency.MVC"
                      />
                      &nbsp; 购买
                    </template>
                    <template v-else>
                      Buy Now At&nbsp;
                      <AmountVue
                        class="amount-warp"
                        :price="nft.val!.nftIsLegal ? nft.val!.nftLegalPrice : nft.val!.nftPrice"
                        :currency="nft.val!.nftIsLegal ? ToCurrency.CNY : ToCurrency.MVC"
                      />
                    </template>
                  </template>
                  <template v-else>{{ $t('isBeBuyedOrCanceled') }}</template>
                </div>
              </template>
              <!-- 自己的 -->
              <template v-else-if="isMyNFT">
                <div
                  class="main-border primary flex flex-align-center flex1"
                  v-if="isSale"
                  @click="offSale"
                >
                  <div
                    class="btn btn-block btn-plain flex1 flex flex-align-center flex-pack-center"
                  >
                    <span class="amount-warp">
                      <AmountVue
                        :price="nft.val!.nftIsLegal ? nft.val!.nftLegalPrice : nft.val!.nftPrice"
                        :currency="nft.val!.nftIsLegal ? ToCurrency.CNY : ToCurrency.MVC"
                      /> </span
                    >{{ $t('offsale') }}
                  </div>
                </div>
                <div
                  class="main-border primary faded flex1 flex flex-align-center flex-pack-center"
                  v-else
                  @click="toSale"
                >
                  {{ $t('sale') }}
                </div>

                <!-- 转赠 -->
                <div
                  class="main-border primary flex flex-align-center flex1"
                  v-if="!isSale"
                  @click="transfer"
                >
                  <div
                    class="btn btn-block btn-plain flex1 flex flex-align-center flex-pack-center"
                  >
                    {{ $t('NFT.Transfer') }}
                  </div>
                </div>
              </template>
            </div>
          </div>
        </div>
        <div class="bottom">
          <div class="bottom-warp">
            <div class="tab">
              <a
                class="main-border"
                :class="{ primary: index === tabIndex }"
                v-for="(tab, index) in tabs"
                :key="index"
                @click="changeTabIndex(index)"
                >{{ $t(tab.key) }}</a
              >
            </div>
            <div class="tab-cont">
              <!-- 作品细节 -->
              <div class="work-deail" v-if="tabIndex === 0">
                <div class="work-deail-section">
                  <div class="work-detail-item flex flex-align-center">
                    <div class="key">{{ $t('workname') }}：</div>
                    <div class="value flex1">{{ nft.val!.nftName }}</div>
                  </div>
                  <div class="work-detail-item flex flex-align-center">
                    <div class="key">{{ $t('workclass') }}：</div>
                    <div class="value flex1">
                      <template
                        v-if="nft.val!.nftClassifyList && nft.val!.nftClassifyList.length > 0"
                      >
                        <span v-for="item in nft.val!.nftClassifyList" :key="item">{{
                          item === 'avatar' ? $t('profilepic') : $t(item)
                        }}</span>
                      </template>
                      <template v-else>--</template>
                    </div>
                  </div>
                  <!-- 作品链接 -->
                  <div
                    class="work-detail-item flex flex-align-center"
                    v-if="
                      nft.val!.nftClassifyList && 
                      nft.val!.nftClassifyList.find(item => item === 'article') &&
                      nft.val!.nftClassifyList.find(item => item === 'rights')
                    "
                  >
                    <div class="key">{{ $t('worklink') }}：</div>
                    <div class="value flex1">
                      <a class="link" :href="nft.val!.nftWebsite" target="_blank">{{
                        $t('workdetaillink')
                      }}</a>
                    </div>
                  </div>
                  <div class="work-detail-item flex flex-align-baseline">
                    <div class="key">{{ $t('workdrsc') }}：</div>
                    <div class="value flex1">
                      {{ nft.val!.nftDesc ? nft.val!.nftDesc : '--' }}
                    </div>
                  </div>
                </div>
                <div class="work-deail-section">
                  <div class="work-detail-item flex flex-align-center">
                    <div class="key">{{ $t('createtime') }}：</div>
                    <div class="value flex1">
                      {{ nft.val!.nftTimestamp ? $filters.dateTimeFormat(nft.val!.nftTimestamp) : '--'}}
                    </div>
                  </div>
                  <div
                    class="work-detail-item flex flex flex-align-baseline"
                    v-if="(nft.val!.nftSellTxId !== '' && !nft.val!.nftIsLegal)"
                  >
                    <div class="key">{{ $t('contractaddr') }}：</div>
                    <div class="value flex1 nowrap">
                      {{ nft.val!.nftSellTxId }}
                      <a class="copy" @click="copy(nft.val!.nftSellTxId)">{{ $t('copy') }}</a>
                      <a class="copy" @click="tx(nft.val!.nftSellTxId)">{{ $t('look') }}</a>
                    </div>
                  </div>
                  <div class="work-detail-item flex flex-align-center">
                    <div class="key">TokenID：</div>
                    <div class="value flex1 nowrap">
                      {{ nft.val!.nftTokenId }}
                      <a class="copy" @click="copy(nft.val!.nftTokenId)">{{ $t('copy') }}</a>
                      <!-- <a class="copy" @click="tx(NFT.val!.tokenId)">{{ $t('look') }}</a> -->
                    </div>
                  </div>
                  <div class="work-detail-item flex flex-align-center">
                    <div class="key">{{ $t('issueMetaTxId') }}：</div>
                    <div class="value flex1 nowrap">
                      <template v-if="nft.val!.nftIssueMetaTxId">
                        {{ nft.val!.nftIssueMetaTxId }}
                        <a class="copy" @click="copy(nft.val!.nftIssueMetaTxId)">{{
                          $t('copy')
                        }}</a>
                        <a class="copy" @click="tx(nft.val!.nftIssueMetaTxId)">
                          {{ $t('look') }}
                        </a>
                      </template>
                      <template v-else>--</template>
                    </div>
                  </div>
                </div>
                <div class="work-deail-section">
                  <div class="work-detail-item flex flex-align-center">
                    <div class="key">{{ $t('creater') }}：</div>
                    <div class="value flex1">
                      <div class="author flex flex-align-center">
                        <UserAvatar
                          class="avatar"
                          :meta-id="nft.val!.nftIssueMetaId"
                          :image="nft.val!.nftIssueAvatarImage"
                          :name="nft.val!.nftIssuer"
                        />
                        <div class="author-msg flex1">
                          <div class="creater">
                            {{ nft.val!.nftIssuer ? nft.val!.nftIssuer : nft.val!.nftIssueAddress }}
                          </div>
                          <div class="metaid" v-if="nft.val!.nftIssueMetaId">
                            MetaID: {{ nft.val!.nftIssueMetaId.slice(0, 6) }}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="work-detail-item flex flex-align-center">
                    <div class="key">{{ $t('haveder') }}：</div>
                    <div class="value flex1">
                      <div class="author flex flex-align-center">
                        <UserAvatar
                          class="avatar"
                          :meta-id="nft.val!.nftOwnerMetaId"
                          :image="nft.val!.nftOwnerAvatarImage"
                          :name="nft.val!.nftOwnerName"
                        />
                        <div class="author-msg flex1">
                          <div class="creater">
                            {{ nft.val!.nftOwnerName ? nft.val!.nftOwnerName : nft.val!.nftOwnerAddress }}
                          </div>
                          <div class="metaid" v-if="nft.val!.nftOwnerMetaId">
                            MetaID:{{ nft.val!.nftOwnerMetaId.slice(0, 6) }}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="remark">
                  <div class="remark-item">
                    {{ $t('remark1') }}
                  </div>
                  <div class="remark-item">{{ $t('remark2') }}</div>
                  <div class="remark-item">{{ $t('remark3') }}</div>
                </div>
              </div>

              <!-- 拥有记录 -->
              <div class="haved-record" v-else-if="tabIndex === 1">
                <div class="tr th flex flex-align-center">
                  <span class="td flex1">{{ $t('owner') }}</span>
                  <span class="td flex1">{{ $t('role') }}</span>
                  <span class="td flex1">{{ $t('time') }}</span>
                  <span class="td  price flex1">{{ $t('price') }}</span>
                </div>

                <!-- 历史拥有者 -->
                <div
                  class="tr flex flex-align-center"
                  v-for="(record, index) in records"
                  :key="record.timestamp"
                >
                  <img class="tobe" :src="ListIcon" v-if="index !== 0" />
                  <span class="td flex1 user flex flex-align-center" @click="ToUser(record.metaId)">
                    <UserAvatar
                      class="avatar"
                      :meta-id="record.metaId"
                      :image="record.avatarImage"
                      :name="record.name"
                    />
                    <span class="name">{{ record.name }}</span>
                  </span>
                  <span class="td role flex1 flex flex-align-center">
                    <template v-if="index === records.length - 1">
                      <img :src="CastingIcon" />
                      {{ $t('creater') }}
                    </template>
                    <template v-else>{{
                      index === 0 ? $t('haveder') : $t('histsoryowner')
                    }}</template>
                  </span>
                  <span class="td time flex1">{{
                    $filters.dateTimeFormat(record.timestamp, 'YYYY-MM-DD HH:mm')
                  }}</span>
                  <span class="td price flex1"
                    >{{
                      record.satoshisPrice
                        ? $filters.bsv(record.satoshisPrice) + 'BSV'
                        : $t('noPaid')
                    }}
                  </span>
                  <a class="link" @click="tx(record.txId)"><img :src="LinkIcon"/></a>
                </div>

                <LoadMore
                  :showMoreButton="true"
                  :pagination="ownerHistoryPagination"
                  @getMore="getMoreRecords"
                  v-if="records.length > ownerHistoryPagination.pageSize"
                />
              </div>
            </div>
          </div>
        </div>

        <NFTSellVue :nft="nft.val!" v-model="isShowSell" @success="getDetail" />
        <NFTBuyVue
          :nft="nft.val!"
          v-model="isShowBuy"
          :is-hide-detail="true"
          @success="getDetail"
        />
        <NFTTransferVue :nft="nft.val!" v-model="isShowTransfer" @success="getDetail" />
      </template>
    </ElSkeleton>
  </div>

  <!-- pay confirm -->
  <!-- <PayConfirmVue
    :visible="isShowConfirm"
    :genesis="NFT.val?.genesis"
    :codehash="NFT.val?.codeHash"
    :token-index="NFT.val?.tokenIndex"
    :isLegal="isLegal"
    :uuid="NFT.val?.uuid"
    @close="isShowConfirm = false"
    @success="buySuccess"
    :price="price"
    :blindBoxPage="blindBoxPage"
  ></PayConfirmVue> -->
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed, watch } from 'vue'
import DetailSkeletonVue from './DetailSkeleton.vue'
import NFTCover from '@/components/NFTCover/NFTCover.vue'
import CertTemp from '@/components/Cert/Cert.vue'
import { useUserStore } from '@/stores/user'
import { useRoute } from 'vue-router'
import NFTDetail from '@/utils/nftDetail'
import { GetLegalNftDetail } from '@/api/legal'
import ShareIcon from '@/assets/images/icon_share.svg?url'
import { useI18n } from 'vue-i18n'
import ListIcon from '@/assets/images/list_icon_ins.svg?url'
import CastingIcon from '@/assets/images/icon_casting.svg?url'
import { GetNFT, GetNftHolderList } from '@/api/aggregation'
import { pagination } from '@/config'
import Decimal from 'decimal.js-light'
import LinkIcon from '@/assets/images/list_icon_link.svg?url'
import { ArrowDown } from '@element-plus/icons-vue'
import { useRootStore } from '@/stores/root'
import PayConfirmVue from '@/components/PayConfirm/PayConfirm.vue'
import { UnitName } from '@/config'
import NFTSellVue from '@/components/NFTSell/NFTSell.vue'
import NFTBuyVue from '@/components/NFTBuy/NFTBuy.vue'
import { checkUserLogin, NFTOffSale, tx } from '@/utils/util'
import AmountVue from '@/components/Amount/Amount.vue'
import NFTTransferVue from '@/components/NFTTransfer/NFTTransfer.vue'
import { toClipboard } from '@soerenmartius/vue3-clipboard'
import { Chains, ToCurrency } from '@/enum'

const isShowSkeleton = ref(true)
const isShowDrscDetail = ref(false)
const userStore = useUserStore()
const route = useRoute()
const i18n = useI18n()
const tabIndex = ref(0)
const rootStore = useRootStore()

const isSale = computed(() => {
  let result = false
  if (nft.val!) {
    if (nft.val.nftIsLegal) {
      if (nft.val.nftSellState === 0) {
        result = true
      }
    } else {
      if (nft.val.nftSellState === 0 && nft.val.nftIsReady) {
        result = true
      }
    }
  }
  return result
})

const isMyNFT = computed(() => {
  let result = false
  if (nft.val && userStore.isAuthorized) {
    if (nft.val.nftChain === Chains.MVC || nft.val.nftChain === Chains.BSV) {
      if (nft.val.nftOwnerMetaId === userStore.user?.metaId) {
        result = true
      }
    } else {
      if (nft.val.nftOwnerAddress === userStore.user?.evmAddress) {
        result = true
      }
    }
  }
  return result
})

// setTimeout(() => {
//   isShowSkeleton.value = false
// }, 3000)

const currentPrice = computed(() => {
  return rootStore.currentPrice
})

const blindBoxPage = computed(() => {
  return route.name === 'blindBoxDetail'
})
const price = ref('0')
const nft: { val: GenesisNFTItem | null } = reactive({
  val: null,
})
const tabs = [
  { name: () => i18n.t('workdetail'), key: 'workdetail' },
  { name: () => i18n.t('possessionrecord'), key: 'possessionrecord' },
]
const records: GetNftHolderListResItem[] = reactive([])

const ownerHistoryPagination = reactive({
  ...pagination,
})

const ownerRecord: { val: GetNftHolderListResItem | null } = reactive({
  val: null,
})

const issueRecord: { val: GetNftHolderListResItem | null } = reactive({
  val: null,
})
const isShowBuy = ref(false)
const isShowTransfer = ref(false)

const isLegal = computed(() => {
  return route.name === 'legaldetail'
})

const isShowConfirm = ref(false)

const nftBtnText = computed(() => {
  if (isMyNFT.value) {
    if (isSale.value) {
      return i18n.t('NFT.Off Sale')
    } else {
      return i18n.t('NFT.Sale')
    }
  } else {
    if (isSale.value) {
      return i18n.t('NFT.Buy Now')
    } else {
      return i18n.t('NFT.NotCanBuy')
    }
  }
})

const nftBtnClass = computed(() => {
  if (isMyNFT.value) {
    return 'primary'
  } else {
    if (isSale.value) {
      return 'primary'
    } else {
      return 'faded'
    }
  }
})

const nftBtnFunction = computed(() => {
  if (isMyNFT.value) {
    if (isSale.value) {
      return NFTOffSale
    } else {
      isShowSell.value = true
    }
  } else {
    if (isSale.value) {
      return ''
    } else {
      return () => {}
    }
  }
})

const cnyMode = computed(() => {
  return rootStore.currentPrice == UnitName.RMB
})

const prices = reactive([
  {
    name: 'BSV',
    key: 'bsv',
  },
  {
    name: 'CNY',
    key: 'cny',
  },
])

const isShowSell = ref(false)

const NFTMainMsgDesc = computed(() => {
  // 1. 是否拍卖 显示拍卖描述 2. 是否上架 显示上架描述 3.下架状态 显示 NFT 的描述
  return nft.val!.nftCurrentAuctionCreateTxId
    ? nft.val!.nftDesc
    : nft.val!.nftSellState === 0 && nft.val!.nftIsReady
    ? nft.val!.nftSellDesc
    : nft.val!.nftDesc
    ? nft.val!.nftDesc
    : '--'
})

watch(
  () => nft.val,
  newVal => {
    if (newVal) {
      price.value = converterPrice(newVal.amount)
    }
  }
)

function handleCommand(command: string) {
  rootStore.changePrices(command)
  console.log('command', command)
}

function converterPrice(amount: number) {
  if (amount) {
    return new Decimal(amount).div(10 ** 8).toString() + ' ' + 'BSV'
  } else {
    return '--'
  }
}

function changeTabIndex(index: number) {
  if (tabIndex.value === index) {
    return
  }
  tabIndex.value = index
}

function copy(value: string) {
  //   toClipboard(value)
  //     .then(() => {
  //       ElMessage.success(i18n.t('copysuccess'))
  //     })
  //     .catch(() => {
  //       ElMessage.success(i18n.t('copyerror'))
  //     })
}

function ToUser(metaId: string) {}

async function startBuy() {
  if (!isSale.value) return
  await checkUserLogin()
  isShowBuy.value = true
}

function getDetail() {
  return new Promise<void>(async resolve => {
    const res = await GetNFT({
      genesis: route.params.genesis as string,
      codehash: route.params.codehash as string,
      chain: route.params.chain as string,
      tokenIndex: route.params.tokenIndex as string,
    }).catch(error => {
      ElMessage.error(error.message)
    })
    if (res?.code === 0) {
      nft.val = res.data.results.items[0]
      resolve()
    }
  })
}

// async function getNftFeePercent() {
//   return new Promise<void>(async resolve => {
//     const res = await GetFeeInfo({
//       codehash: route.params.codehash,
//       genesis: route.params.genesisId,
//     })
//     if (res.code === 0) {
//       nftPlatformPercent.value = NFT.val!.nftIsFirstSell
//         ? res.data.first_platform
//         : res.data.other_platform
//       nftRoyaltyPercent.value = NFT.val!.nftIsFirstSell
//         ? res.data.first_royalty
//         : res.data.other_royalty
//     }
//     resolve()
//   })
// }

async function offSale() {
  // return ElMessage.info(i18n.t('Comming Soon'))
  const result = await NFTOffSale(nft.val!)
  if (result) {
    nft.val!.nftSellState = 1
    // getDetail()
  }
}

function toSale() {
  return ElMessage.info(i18n.t('Comming Soon'))
  // isShowSell.value = true
}

// 分享
function share() {
  const value = `${i18n.t('shareText1')}\r\n ${nft.val!.nftName}:${window.location.href}`
  toClipboard(value)
    .then(() => {
      ElMessage.success(i18n.t('copyShareSuccess'))
    })
    .catch(() => {
      ElMessage.success(i18n.t('copyerror'))
    })
}

function transfer() {
  // return ElMessage.info(i18n.t('Comming Soon'))
  if (nft.val!.nftChain === 'bsv' || nft.val!.nftChain === 'mvc') {
    isShowTransfer.value = true
  } else {
    ElMessage.info(
      `${i18n.t('NotSupportCurrentChainNFTTransfer')}: ${nft.val!.nftChain.toUpperCase()}`
    )
  }
}

//  获取拥有记录
async function getNftHolderList(isCover = false) {
  return new Promise(async resolve => {
    const res = await GetNftHolderList({
      genesis: route.params.genesis as string,
      codehash: route.params.codehash as string,
      tokenIndex: route.params.tokenIndex as string,
      page: ownerHistoryPagination.page.toString(),
      pageSize: ownerHistoryPagination.pageSize.toString(),
    })

    if (res?.code === 0) {
      if (isCover) {
        records.length = 0
      }
      records.push(...res.data.results.items.holderList)
      ownerRecord.val = res.data.results.items.owner
      issueRecord.val = res.data.results.items.issuer
      const totalPages = Math.ceil(res.data.total / ownerHistoryPagination.pageSize)
      if (totalPages <= ownerHistoryPagination.page) {
        ownerHistoryPagination.nothing = true
      }
    }
  })
}

function getMoreRecords() {
  ownerHistoryPagination.loading = true
  ownerHistoryPagination.page++
  getNftHolderList().then(() => {
    ownerHistoryPagination.loading = false
  })
}

onMounted(() => {
  if (route.params.genesis && route.params.codehash && route.params.tokenIndex) {
    getDetail().then(() => {
      isShowSkeleton.value = false
    })
    getNftHolderList()
  }
})

watch(
  () => userStore.isAuthorized,
  () => {
    isShowSkeleton.value = true
    getDetail().then(() => {
      isShowSkeleton.value = false
    })
  }
)
</script>

<style lang="scss" scoped src="./Detail.scss"></style>
