<template>
  <div class="home">
    <div class="snowTitleWrap">
      <img :src="Snow" alt="" />
    </div>
  </div>
</template>
<script setup lang="ts">
import {} from '@/api'
import Snow from '@/assets/images/snow.png'
import { useStore } from '@/store'
import { reactive, ref } from 'vue'

import FileUploadIcon from '@/assets/images/file_upload.svg'
import IsNull from '../components/IsNull/IsNull.vue'
import { useI18n } from 'vue-i18n'
import { checkSdkStatus } from '@/utils/util'
import axios from 'axios'
import { ElMessage } from 'element-plus'

const i18n = useI18n()
const store = useStore()
const pagination = reactive({
  ...store.state.pagination,
})

const form = reactive({
  idNumber: '',
  information: '',
  informationEn: '',
  informationJp: '',
  metaId: '',
  metaIdName: '',
  organizationName: '',
  organizationNameEn: '',
  organizationNameJp: '',
  realName: '',
  userProfile: '',
  userProfileEn: '',
  userProfileJp: '',
})
let sendMetaTxDataRes: { val: any } = reactive({ val: {} })

async function sendMetaTxData() {
  await checkSdkStatus()
  sendMetaTxDataRes.val = await store.state.sdk?.sendMetaDataTx({
    brfcId: 'test1',
    // data: JSON.stringify({
    //   blockMetaIDs: [],
    //   blockTxs: [],
    //   blockNFTIDs: [
    //     '16ebfddb3c050f416895509d1d66e7569c55d750/0d0fc08db6e27dc0263b594d6b203f55fb5282e2/0',
    //   ],
    //   blockNFTGenesisIDs: [],
    // }),
    data: JSON.stringify({
      siteName: 'NFTOnShow',
      siteDescription: '元网首个NFT市场',
      faviconIco: 'metafile://d2e845c78cdf60f57ba86a99e672e0fe1033d27015fd6b2afda1b7e3fe698b70',
      siteLogo: 'metafile://aae472c0108d4c48007a312fc7090da563b1a3c777b814f94279667d8b2a7866',
      siteLogo2: 'metafile://a921f7bfcab5ba9e2c0d447b3a6077333a75571bda313adb2b125266c90dd8d8',
      siteURL: 'https://showbuzz.app',
      siteOwner: 'xxx',
      blockPolicy: 'on',
      blockPolicyTxids: ['0efe89076da19ee50b60ee257cabf272cc84ca538d252df9a55907b74b630bb4'],
      manifest: {
        short_name: 'NFTOnShow',
        theme_color: '#fff',
        icons: [
          {
            src: 'metafile://17414fb81660908722080c4322d441676d3aa03fffdf3a3f4696aa08ba3e9c21',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'metafile://50503efd64e9d5beb5a53c2b548507a5b93114af3f90b5186c7a95d0d3c66bee',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: 'metafile://50503efd64e9d5beb5a53c2b548507a5b93114af3f90b5186c7a95d0d3c66bee',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable',
          },
        ],
      },
      banners: [
        {
          name: 'metaElfLandRightCard',
          sort: 4,
          picUrlZh: 'http://filecdn.showpay.top/nos/banner/banner.png',
          picUrlEn: 'http://filecdn.showpay.top/nos/banner/banner.png',
          picUrlJp: 'http://filecdn.showpay.top/nos/banner/banner.png',
          url:
            '/collection/detail/MetaElfLandRightCard/67740e86c2b0569787600fdd9123eec80756f17934b3de0cd74ccf359af59d80',
        },
      ],
      collections: [
        {
          tag: 'string',
          sort: 0,
          coverPicUrlZh: 'http://filecdn.showpay.top/nos/topic/Webot 2022 Revenue NFT Sale.png',
          coverPicUrlEn: 'http://filecdn.showpay.top/nos/topic/Webot 2022 Revenue NFT Sale.png',
          coverPicUrlJp: 'http://filecdn.showpay.top/nos/topic/Webot 2022 Revenue NFT Sale.png',
          name: 'aaa1',
          createMetaId: '88f869fa97aad5dcc4cf1739b757f8e6d9d8f1fdbadd21b3d2bd63b91a32e5cf',
          createName: 'aaa1',
          CreateAvatarTxId: '',
          CreateAvatarType: '',
          key: 'aaa1',
          timestamp: 1640773786037,
          url: '',
        },
      ],
      certificationMetaIds: [
        '3c03f6b8783fa672bb34953519110944dab1d8a23711c7df4f1dd9e16e5b823c',
        '974e2977d5c9446f7f48fd82c9ea51f82749b9ef7c00d26b73bc450d167d5f31',
        'aaf66589caf185d6840a51cd47a91cb2fbf831c0eb6a4c32ab31f3e3b3fa5bc2',
        'baac7625edf7a3dcc28385917a6fc9a72798ffd3657da8bc22ce59fdeb3b35e0',
        'fc0a92af9977f4b3bf82492508c18ab28f666922eb8ee52dcefd5b7f2a690f83',
        '69f5a1cfa00ae301cc911978861b0e8c0dadf42486f64aabe3ffef7c94cf9490',
        '446988fc6cc0240c0a81c9e95e41183aa162a8a1aafef89dc30ef6c310ca4362',
        '34ce9372af128c496ff638d5e48f32c6e45a64aab82318bd7fb9a1107201b6f4',
        'f4bf10cf16f64137bb3aa0974adc32c9ded0ed2796c6c5e0cca0559f70c02ae8',
        'b89840e798b334e4f2d5279b6a325b411125e927f2dba16af4208d827ede8e11',
        'd8ad55b10de53e13c88ab28593285484bb672ff5707c26293d032082dbbb4cc7',
        '83d83218204545133485f5abeb1f4c5bdcc3dd8aac9a3a91946484d24e5542f8',
        '67740e86c2b0569787600fdd9123eec80756f17934b3de0cd74ccf359af59d80',
        '57f366ced1c9cddcdd209bd939b35ae82e52dafcbbdea01b159a4c69b1f7e06b',
        'd577d48b15fe574206a17bda58c68bce1fbe98f61e77fb3fb139f9f5bd7e9236',
        '1734f4732ddd1ec2a94f55a85c1b7a3051c7000bbc2e4d4eaaca7ae698b25c28',
        'ece4ee8945fecd67c49eaab633c8bf36926692bbdb80b60db5a4063ee7b561eb',
        '2df27132058cd24ff9ef2939315c9ca0d8ec88733f5bda0df130b7798efea972',
        '902dddae7cfea0cba6dcb10d8520b0e8f8e9f6d2c7486fc59d3722b46e5f315e',
        '63b3aa865021f1677bf85c5bdc7617224bc79d4be6dc3f7b89237f733ade22d4',
        'baaf3e11a24854a985e46c1504e1a2ee451249fc48a3c0ad848ddb5597df1e70',
        'f666898cbbef5651064c5220575e7f24f3c974baaa4c90854f5e67ba99be717d',
        '1b08a6b7192c392e4b7ce384cefb1ca95921db3cbed8b0dc8ff92414181c94a4',
        '86cedccff32be6267fec5ce892314bbeefc81a29cd42065ed023637e587b6d9f',
        'ae6452663883c88bcd21d020e125850099dbaf42eee33626c7ce756fe833ea2c',
        '88f869fa97aad5dcc4cf1739b757f8e6d9d8f1fdbadd21b3d2bd63b91a32e5cf',
        '5686d21fcab051ace888e17947383801f6df7fad06f38f955fefe482a4a3e8b2',
        'f071580414e3a6ce87952b7b7cc66c7c4f35709ff1edd66b88fa1a308c14d6d7',
      ],
    }),
    nodeName: 'SimpleSiteConfig',
    path: '/Protocols/SimpleSiteConfig',
    nodeKey: '021a61cfe337c314ef591917b6089e8cd15f45c565e61d4d5e3ed371689cba7fc2',
  })
}

//  加载更多
function getMore() {
  pagination.loading = true
  pagination.page++
}

function onSubmit() {
  axios
    .post(
      'https://api.showmoney.app/broad/v1/nos/certification/setNosCertificationUserInfo',
      { ...form },
      {
        headers: {
          AuthorizationToken:
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJTaG93T3BlcmF0aW9uIiwibWV0YUlkIjoiIiwiY29yZVRva2VuIjoiIiwidXNlckFjY291bnQiOiJTaG93T3BlcmF0aW9uIiwiaGFzaFBhc3MiOiIkMmEkMTAkLnZjZGZIVFB2aGI1RGp3ME00NXNOZWNQLkprTWNWWUpvbFg4aFE5RGxUbFJVaVRCTGNxV2kiLCJub25jZSI6IlhWbEJ6Z2JhaUNNUkFqV3cifQ.wqzgS8xvDLsJv2mHOA0D34Ojq6HafxuRijfgmwyhdy0',
        },
      }
    )
    .then(() => {
      ElMessage.success('success')
      for (let i in form) {
        //@ts-ignore
        form[i] = ''
      }
    })
}
</script>
<style lang="scss" scoped>
@import '@/assets/styles/var.scss';
.banner {
  margin-top: -20px;
}

.home {
  margin-top: 40px;
  .section {
    margin-bottom: 90px;
    &:last-child {
      margin-bottom: 0;
    }
    .section-screen {
    }
    &.recommend-section {
      position: relative;
      .recommend-skeleton-list {
        position: absolute;
        width: 100%;
        left: 0;
        top: 0;
      }
      .section-cont {
        margin-top: 0;
      }
    }
  }
  .snowTitleWrap {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: -200px;
    img {
      width: 65%;
    }
  }
}

@media only screen and (max-width: 500px) {
  .home {
    .section {
      margin-bottom: 60px;
      .section-screen {
        flex-direction: column-reverse;
        .search-warp {
          width: 100%;
        }
        .tags {
          margin-top: 15px;
          a {
            margin-bottom: 15px;
          }
        }
      }
    }
  }
}
</style>
