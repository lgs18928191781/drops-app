<template>
  <div class="nft-detail">
    <div class="top flex container">
      <img class="cover" alt="" />
      <div class="cont flex1 flex flex-v">
        <div class="name flex flex-align-center">
          <span class="text flex1">The Card of Unity</span>
          <img src="@/assets/images/icon_share.svg" alt="分享" />
        </div>
        <div class="creater-msg">
          <div class="author flex flex-align-center">
            <img class="avatar" />
            <div class="author-msg flex1">
              <div class="creater">{{ $t('creater') }}: 范特西</div>
              <div class="metaid">MetaID:34c5em</div>
            </div>
          </div>
          <CertTemp />
        </div>
        <div class="drsc flex1 flex flex-v">
          <div class="title">{{ $t('drsc')}}：</div>
          <div class="cont flex1">
            忘记了他留在自己星球上的沉闷灰色忧虑，阿斯特罗在他丰富多彩的梦想领域中感到生机勃勃。
          </div>
        </div>

        <div class="timeleft">{{ $t('timeleft')}}：<span>21</span>{{ $t('day')}}<span>21</span>{{ $t('hour')}}<span>21</span>{{ $t('minu')}}<span>21</span>{{ $t('second')}}</div>
        <div class="btn btn-block">{{$t('use')}} 0.52BSV {{$t('buy')}}</div>
      </div>
    </div>

    <div class="bottom">
      <div class="bottom-warp">
        <div class="tab">
          <a :class="{ active: index === tabIndex }" v-for="(tab, index) in tabs" :key="index" @click="changeTabIndex(index)">{{
            tab.name
          }}</a>
        </div>
        <div class="tab-cont">
          <!-- 作品细节 -->
          <div class="work-deail" v-if="tabIndex === 0">
            <div class="work-deail-section">
              <div class="work-detail-item flex flex-align-center">
                <div class="key">{{$t('workname')}}：</div>
                <div class="value flex1">守护者画像</div>
              </div>
              <div class="work-detail-item flex flex-align-center">
                <div class="key">{{$t('workclass')}}：</div>
                <div class="value flex1">艺术</div>
              </div>
              <div class="work-detail-item flex flex-align-baseline">
                <div class="key">{{$t('workdrsc')}}：</div>
                <div class="value flex1">
                  忘记了他留在自己星球上的沉闷灰色忧虑，阿斯特罗在他丰富多彩的梦想领域中感到生机勃勃。
                </div>
              </div>
            </div>
            <div class="work-deail-section">
              <div class="work-detail-item flex flex-align-center">
                <div class="key">{{$t('createtime')}}：</div>
                <div class="value flex1">2020-12-30 12:34:20</div>
              </div>
              <div class="work-detail-item flex flex flex-align-baseline">
                <div class="key">{{$t('contractaddr')}}：</div>
                <div class="value flex1">
                  0x1dDB2C0897daF18632662E71fdD2dbDC0eB3a9Ec <a class="copy" @click="copy('0x1dDB2C0897daF18632662E71fdD2dbDC0eB3a9Ec')">{{$t('copy')}}</a>
                </div>
              </div>
              <div class="work-detail-item flex flex-align-center">
                <div class="key">TokenID：</div>
                <div class="value flex1">100300002424 <a class="copy" @click="copy('100300002424')">{{$t('copy')}}</a></div>
              </div>
            </div>
            <div class="work-deail-section">
              <div class="work-detail-item flex flex-align-center">
                <div class="key">{{$t('creater')}}：</div>
                <div class="value flex1">
                  <div class="author flex flex-align-center">
                    <img class="avatar" />
                    <div class="author-msg flex1">
                      <div class="creater">{{$t('creater')}}: 范特西</div>
                      <div class="metaid">MetaID:34c5em</div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="work-detail-item flex flex-align-center">
                <div class="key">{{$t('haveder')}}：</div>
                <div class="value flex1">
                  <div class="author flex flex-align-center">
                    <img class="avatar" />
                    <div class="author-msg flex1">
                      <div class="creater">{{$t('creater')}}: 范特西</div>
                      <div class="metaid">MetaID:34c5em</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="work-deail-section">
              <div class="work-detail-item flex flex-align-center">
                <div class="key">{{$t('worktype')}}：</div>
                <div class="value flex1">图片  1920*1080PX  5.2M</div>
              </div>
              <div class="work-detail-item flex flex-align-center">
                <div class="key">{{$t('histroyrevenue')}}：</div>
                <div class="value flex1">0.24053045 BSV <a>{{$t('workdetaillink')}}</a></div>
              </div>
            </div>

            <div class="remark">
                <div class="remark-item">{{$t('remark1')}}<a>{{$t('knowmore')}}</a></div>
                <div class="remark-item">{{$t('remark2')}}</div>
                <div class="remark-item">{{$t('remark3')}}</div>
            </div>
          </div>

          <!-- 拥有记录 -->
          <div class="haved-record" v-else-if="tabIndex === 1">
            <div class="tr th flex flex-align-center">
              <span class="td flex1">{{$t('owner')}}</span>
              <span class="td flex1">{{$t('role')}}</span>
              <span class="td flex1">{{$t('time')}}</span>
              <span class="td flex1">{{$t('price')}}</span>
            </div>
            <div class="tr flex flex-align-center">
              <span class="td flex1 user flex flex-align-center">
                <img src="avatar" />
                <span class="name">霸蛮</span>
              </span>
              <span class="td role flex1 flex flex-align-center flex-pack-center">
                {{$t('creater')}}
              </span>
              <span class="td time flex1">2021-06-24 06:20:00</span>
              <span class="td price flex1">0.52BSV</span>
            </div>
            <div class="tr flex flex-align-center">
              <span class="td flex1 user flex flex-align-center">
                <img src="avatar" />
                <span class="name">霸蛮</span>
              </span>
              <span class="td role flex1 flex flex-align-center flex-pack-center">
                {{$t('creater')}}
              </span>
              <span class="td time flex1">2021-06-24 06:20:00</span>
              <span class="td price flex1">0.52BSV</span>
            </div>
            <div class="tr flex flex-align-center">
              <span class="td flex1 user flex flex-align-center">
                <img src="avatar" />
                <span class="name">霸蛮</span>
              </span>
              <span class="td role flex1 flex flex-align-center flex-pack-center">
                {{$t('creater')}}
              </span>
              <span class="td time flex1">2021-06-24 06:20:00</span>
              <span class="td price flex1">0.52BSV</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, reactive } from "vue";
import CertTemp from '@/components/Cert/Cert.vue'
import { useI18n } from "vue-i18n";
import { toClipboard } from '@soerenmartius/vue3-clipboard'
import { ElMessage } from 'element-plus';

const i18n = useI18n();
const tabs = [{ name: i18n.t('workdetail') }, { name: i18n.t('possessionrecord') }]
let tabIndex = ref(0)



function changeTabIndex (index: number) {
  if (tabIndex.value === index) {
    return
  }
  tabIndex.value = index
}

function copy (value: string) {
  toClipboard(value).then(() => {
    ElMessage.success(i18n.t('copysuccess'))
  })
  .catch(() => {
    ElMessage.success(i18n.t('copyerror'))
  })
}
</script>
<style lang="scss" scoped src="./Detail.scss"></style>
