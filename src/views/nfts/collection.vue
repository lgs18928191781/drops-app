<template>
  <div class="collection-wrap">
    <div class="top-bar flex flex-align-center">
      <div class="flex1 flex flex-align-center">
        <!-- <div class="flex1">
          <a class="back flex flex-align-center" @click="$router.back()">
            <span class="flex flex-align-center flex-pack-center ">
              <Icon name="down" />
            </span>
            {{ $t('back') }}
          </a>

          <div class="flex flex-align-center text-sm" v-else>
              <Icon name="shapexs" customClass="h-4 w-3.5 mr-2" />
              {{ $t('NFTS.NFTs Launch Pad') }}
            </div>
        </div> -->

        <div class="collection-selector  flex items-center text-sm" :class="layout.isMobilePhone ? 'flex1' : '' ">
          <el-select
            @change="triggleCollection"
            popper-class="select-wrap"
            v-model="genesisCollection"
          >
            <el-option
              v-for="(item, index) in MyCollectionList"
              :key="index"
              :label="item.name"
              :value="item.collectionPinId"
            >
              <template #default>
                <div class="flex w-full items-center justify-between text-white  hover:text-[#303133]">
                  <div class="flex items-center ">
                    <Image
                      :src="item?.coverPinid"
                      custom-class="w-8 h-8 mr-1 rounded-md object-cover"
                    />

                    <span class="">{{ item.name }}</span>
                  </div>
                  <div
                    v-if="genesisCollection == item.name"
                    class="w-5 h-5 flex items-center justify-center bg-[#EB4C93] p-1.5 rounded-md"
                  >
                    <el-icon :size="9" color="#fff"><Select /></el-icon>
                  </div>
                </div>
              </template>
            </el-option>
          </el-select>
        </div>
        <div
        :class="layout.isMobilePhone ? 'flex1' : '' "
          class=" flex cursor-pointer  items-center border border-[#656170] box-border px-4 rounded-lg ml-2 h-10 lead-[44px]"
          @click="genesisNfts"
        >
          <img src="@/assets/images/icon@1x.png" alt="" class="w-[18px] h-[18px] mr-2" />
          <div :class="layout.isMobilePhone ? 'text-sm' : 'text-base ' " class="font-500 font-sora text-white">Create NFTs</div>
        </div>
      </div>
      <!-- <nav>
            <a v-for="(item, index) in navs" :key="index" @click="commonSoon">{{ item.name }}</a>
          </nav> -->
    </div>

    <div class="content-wrap p-[30px] rounded-[6px] mt-5 bg-[#29272E]">
      <!-- <div class="nfts-card flex">
        <div class="nfts-cover flex items-center justify-center w-24 h-24 rounded-lg ">
          <Image :src="currentNftsCollect?.coverPinid" custom-class="w-full rounded-lg" />
          <img class="w-full rounded-lg " :src="currentNftsCollect?.cover" alt="" />
        </div>
        <div class="nfts-detail w-full ml-4">
          <div class="flex-col">
            <div class="nfts-name flex items-center justify-between">
              <span class="text-2xl font-medium">{{ currentNftsCollect?.name }}</span>

              <ExternalLink
                @click="toMarketCollection"
                :size="18"
                color="#909399"
                class="cursor-pointer hover:scale-110"
              ></ExternalLink>
            </div>
            <div class="nfts-intro flex text-[#909399] text-xs">
              <span>
                {{ currentNftsCollect?.desc }}
              </span>
            </div>
          </div>
          <div class="nfts-footer flex items-center text-sm ">
            <div class="flex items-center justify-start flex-wrap">
              <div class="blockchain flex items-center mr-6">
                <span class="mr-2">{{ $t('Nfts.lanuch_chain') }}</span>
                <img
                  class="w-5 h-5 mr-1"
                  :src="currentNftsCollect?.chain == NftsLaunchPadChainSymbol.btc ? btc : mvc"
                  alt=""
                />
                <span class="font-medium">{{
                  currentNftsCollect?.chain == NftsLaunchPadChainSymbol.btc
                    ? NftsLaunchPadChain.btc
                    : NftsLaunchPadChain.mvc
                }}</span>
              </div>
              <div class="market-option flex mr-6">
                <span class="mr-1">{{ $t('Nfts.lanuch_makemarket') }}</span>
                <span>{{ currentNftsCollect?.autoMarket }}</span>
              </div>
              <div class="total-supply flex mr-6">
                <span class="mr-1">{{ $t('Nfts.lanuch_totalSupply') }}</span>
                <span>{{ currentNftsCollect?.totalSupply }}</span>
              </div>

              <div class="total-supply flex mr-6">
                <span class="mr-1">{{ $t('Nfts.lanuch_mintable_Supply') }}</span>
                <span>{{ currentNftsCollect?.currentSupply }}</span>
              </div>

              <div class="mint-amount flex ">
                <span class="mr-1">{{ $t('Nfts.lanuch_minted') }}</span>
                <span>{{ mintedAmount }}</span>
              </div>
            </div>
          </div>
        </div>
      </div> -->

      <div class="nfts-card flex flex-col sm:justify-between sm:flex-row space-x-4">
        <div class="flex nfts-cover-container  flex-1 items-center flex-col sm:flex-row">
          <div
            class="nfts-cover flex items-center w-[150px] h-[150px] rounded-lg flex-shrink-0 mr-[30px]"
          >
            <Image :src="currentNftsCollect?.coverPinid" custom-class="w-full  rounded-lg" />
            <!-- <img class="w-full rounded-lg " :src="currentNftsCollect?.cover" alt="" /> -->
          </div>

          <div class="flex-col">
            <div class="nfts-name flex">
              <span class=" font-bold font-sora text-white mb-3" :class="layout.isMobilePhone ? 'text-2xl' : 'text-4xl' ">{{
                currentNftsCollect?.name
              }}</span>
            </div>
            <div class="nfts-intro flex font-sora text-white text-sm mb-5">
              <span>
                {{ currentNftsCollect?.desc }}
              </span>
            </div>
            <div class="cursor-pointer ">
              <el-icon v-if="currentNftsCollect?.website" @click="toCollectionWork" class="hover:scale-110" :size="18"><Promotion /></el-icon>
              <!-- <img @click="" src="@/assets/images/share@2x.png" alt="" class="w-[18px] h-[18px] " /> -->
            </div>
          </div>
        </div>
        <div class="flex nfts-detail flex-1 justify-end mt-8 sm:mt-0">
          <!-- <div class="nfts-footer flex items-center text-sm ">
            <div class="flex items-center justify-start flex-wrap">
              <div class="blockchain flex items-center mr-6">
                <span class="mr-2">{{ $t('Nfts.lanuch_chain') }}</span>
                <img
                  class="w-5 h-5 mr-1"
                  :src="currentNftsCollect?.chain == NftsLaunchPadChainSymbol.btc ? btc : mvc"
                  alt=""
                />
                <span class="font-medium">{{
                  currentNftsCollect?.chain == NftsLaunchPadChainSymbol.btc
                    ? NftsLaunchPadChain.btc
                    : NftsLaunchPadChain.mvc
                }}</span>
              </div>
              <div class="market-option flex mr-6">
                <span class="mr-1">{{ $t('Nfts.lanuch_makemarket') }}</span>
                <span>{{ currentNftsCollect?.autoMarket }}</span>
              </div>
              <div class="total-supply flex mr-6">
                <span class="mr-1">{{ $t('Nfts.lanuch_totalSupply') }}</span>
                <span>{{ currentNftsCollect?.totalSupply }}</span>
              </div>

              <div class="total-supply flex mr-6">
                <span class="mr-1">{{ $t('Nfts.lanuch_mintable_Supply') }}</span>
                <span>{{ currentNftsCollect?.currentSupply }}</span>
              </div>

              <div class="mint-amount flex ">
                <span class="mr-1">{{ $t('Nfts.lanuch_minted') }}</span>
                <span>{{ mintedAmount }}</span>
              </div>
            </div>
          </div> -->

          <div class="grid grip-wrap grid-cols-2 gap-4 sm:grid-cols-3">
            <!-- <div class="text-center">
              <p class="text-[20px] font-semibold font-sora text-white mb-2">
                {{ currentNftsCollect?.autoMarket == true ? 'Yes' : 'No' }}
              </p>
              <p class="text-[16px] font-thin font-sora text-[#909399]">
                {{ $t('Nfts.lanuch_makemarket') }}
              </p>
            </div> -->
            <div class="text-center">
              <p class="text-[20px] font-semibold font-sora text-white mb-2">
                {{ currentNftsCollect?.totalSupply }}
              </p>
              <p class="text-[16px] font-semiboldfont-sora text-[#909399]">
                {{ $t('Nfts.lanuch_totalSupply') }}
              </p>
            </div>
            <div class="text-center">
              <p class="text-[20px] font-semibold font-sora text-white mb-2">
                {{ currentNftsCollect?.currentSupply }}
              </p>
              <p class="text-[16px] font-semibold font-sora text-[#909399]">
                {{ $t('Nfts.lanuch_mintable_Supply') }}
              </p>
            </div>
            <div class="text-center">
              <p class="text-[20px] font-semibold font-sora text-white mb-2">{{ mintedAmount }}</p>
              <p class="text-[16px] font-semibold font-sora text-[#909399]">
                {{ $t('Nfts.lanuch_minted') }}
              </p>
            </div>
            <!-- <div class="text-center">
              <p class="text-[20px] font-semibold font-sora text-white mb-2">0</p>
              <p class="text-[16px] font-thin font-sora text-[#909399]">Owner</p>
            </div> -->
            <div class="text-center">
              <div
                class="text-[20px] font-semibold font-sora text-white mb-2 flex items-center justify-center"
              >
                <img
                  class="w-5 h-5 mr-1"
                  :src="currentNftsCollect?.chain == NftsLaunchPadChainSymbol.btc ? btc : mvc"
                  alt=""
                />
                <span class="font-medium">{{
                  currentNftsCollect?.chain == NftsLaunchPadChainSymbol.btc
                    ? NftsLaunchPadChain.btc
                    : NftsLaunchPadChain.mvc
                }}</span>
              </div>
              <p class="text-[16px] font-semibold font-sora text-[#909399]">
                {{ $t('Nfts.lanuch_chain') }}
              </p>
            </div>
          </div>
        </div>

        <!-- <div class="nfts-detail w-full ml-4"></div> -->
      </div>
    </div>

    <div class="echart-wrap bg-[#1E1E1E] mt-[50px] w-full " v-if="chart.vals?.data">
          <Line ref="chartRef" :style="customStyle" :data="chart.vals?.data" :options="chart.vals?.options" />
        </div>

    <div class="auto-market-wrap  mt-8">
      <!-- <div class="title text-lg py-4 font-medium">
        {{ $t('Nfts.lanuch_auto_market_title') }}
      </div>
      <div class="content flex items-center py-6 border-t border-[#EDEFF2] flex-row">
        <div class="config-wrap pr-10 border-r border-[#EDEFF2] w-1/5">
          <div class="flex flex-col">
            <div class="">
              <div>
                <span>{{ $t('Nfts.lanuch_auto_market_setprice') }}</span>
                <span class="ml-1 font-medium">({{ $t('Nfts.mint_price_unit') }})</span>
              </div>
              <el-input
                :placeholder="$t('Nfts.lanuch_set_init_price')"
                class="h-12 mt-2"
                v-model="autoMaketData.initialPrice"
                :disabled="
                  !currentNftsCollect?.autoMarket || Boolean(currentNftsCollect?.initialPrice)
                "
              ></el-input>
              <div class="flex items-center mt-2 text-[#909399]">
                <span class="mr-1">{{ autoMaketData.initialPrice ?? 0 }}</span>
                <span class="mr-1">BTC</span>
                <span class="mr-1">=</span>
                <span class="mr-1">{{ btcConverSats }}</span>
                <span>Sats</span>
              </div>
            </div>
            <div class="mt-3.5">
              <div>
                <span class="align-middle">{{ $t('Nfts.lanuch_auto_market_setpriceAdd') }}</span>
                <span class="ml-1 font-medium">({{ $t('Nfts.mint_price_unit') }})</span>
                <el-popover
                  placement="top-start"
                  :title="$t('Nfts.lanuch_growth_price_desc')"
                  :width="250"
                  trigger="hover"
                >
                  <template #reference>
                    <el-icon :size="18" class="align-middle ml-1 cursor-pointer"
                      ><QuestionFilled
                    /></el-icon>
                  </template>

                  <div class="flex flex-col text-sm font-medium">
                    <span>{{ $t('NFTs.lanuch_growth_content1') }}</span>
                    <span class="mt-2 whitespace-normal break-words">{{
                      $t('NFTs.lanuch_growth_content2')
                    }}</span>
                    <span class="mt-2">{{ $t('NFTs.lanuch_growth_content3') }}</span>
                  </div>
                </el-popover>
              </div>

              <el-input
                :placeholder="$t('Nfts.lanuch_set_price_increase')"
                class="h-12 mt-2"
                v-model="autoMaketData.priceGrowth"
                :disabled="
                  !currentNftsCollect?.autoMarket || Boolean(currentNftsCollect?.priceGrowth)
                "
              ></el-input>
              <div class="flex items-center mt-2 text-[#909399]">
                <span class="mr-1">{{ autoMaketData.priceGrowth ?? 0 }}</span>
                <span class="mr-1">BTC</span>
                <span class="mr-1">=</span>
                <span class="mr-1">{{ btcConverSatsPriceGrowth }}</span>
                <span>Sats</span>
              </div>
            </div>
          </div>
          <div class="mt-3.5 text-[#909399] flex flex-row items-center justify-center">
            <div class="mr-4">
              <span class="mr-1">X:</span> <span>{{ $t('Nfts.lanuch_X') }}</span>
            </div>
            <div>
              <span class="mr-1"> Y:</span>
              <span>{{ $t('Nfts.lanuch_Y') }}</span>
            </div>
          </div>
        </div>
     
      </div> -->
      <!-- <div class="price-area flex justify-between space-x-4">
        <div class="flex-1">
          <div class="font-sora  text-sm text-[#A9A8AC] font-light">
            <span>{{ $t('Nfts.lanuch_auto_market_setprice') }}</span>
            <span class="ml-1">({{ $t('Nfts.mint_price_unit') }})</span>
          </div>
          <el-input
            :placeholder="$t('Nfts.lanuch_set_init_price')"
            :class="['h-12 mt-2 ',initialPriceEmpty ? '' : 'shake input-error']"
            v-model="autoMaketData.initialPrice"
            :disabled="!currentNftsCollect?.autoMarket || Boolean(currentNftsCollect?.initialPrice)"
          ></el-input>
          <div class="flex ml-4 items-center mt-2 text-[#909399]">
            <span class="mr-1">{{ autoMaketData.initialPrice ?? 0 }}</span>
            <span class="mr-1">BTC</span>
            <span class="mr-1">=</span>
            <span class="mr-1">{{ btcConverSats }}</span>
            <span>Sats</span>
          </div>
        </div>
        <div class="flex-1">
          <div class="font-sora text-[#A9A8AC] font-light">
            <span class="align-middle font-sora  font-light">{{
              $t('Nfts.lanuch_auto_market_setpriceAdd')
            }}</span>
            <span class="ml-1 font-sora   font-light"
              >({{ $t('Nfts.mint_price_unit') }})</span
            >
            <el-popover placement="top-start" :width="250" trigger="hover">
              <template #reference>
                <el-icon :size="18" color="#fff" class="align-middle ml-1 mb-0.5 cursor-pointer"
                  ><QuestionFilled
                /></el-icon>
              </template>

              <div class="flex flex-col font-sora text-white text-sm font-light">
                <div>{{ $t('Nfts.lanuch_growth_price_desc') }}</div>
                <span class="font-sora text-white text-sm font-light">{{
                  $t('NFTs.lanuch_growth_content1')
                }}</span>
                <span class="mt-2 whitespace-normal break-words">{{
                  $t('NFTs.lanuch_growth_content2')
                }}</span>
                <span class="mt-2">{{ $t('NFTs.lanuch_growth_content3') }}</span>
              </div>
            </el-popover>
          </div>

          <el-input
            :placeholder="$t('Nfts.lanuch_set_price_increase')"
           :class="['h-12 mt-2 ',priceGrowthEmpty ? '' : 'shake input-error']"
            v-model="autoMaketData.priceGrowth"
            :disabled="!currentNftsCollect?.autoMarket || Boolean(currentNftsCollect?.priceGrowth)"
          ></el-input>
          <div class="flex ml-4 items-center mt-2 text-[#909399]">
            <span class="mr-1">{{ autoMaketData.priceGrowth ?? 0 }}</span>
            <span class="mr-1">BTC</span>
            <span class="mr-1">=</span>
            <span class="mr-1">{{ btcConverSatsPriceGrowth }}</span>
            <span>Sats</span>
          </div>
        </div>
      </div> -->
    </div>

    <div class="mt-12 ">
      <div class="mint-wrap flex items-center justify-between border-b pb-8 border-[#656170]">
        <div class="font-sora text-white  font-semibold" :class="layout.isMobilePhone ? 'text-[20px]' : 'text-[30px]'">
          {{ $t('Nfts.lanuch_bulkMint') }}
        </div>

        <div class="mint-btn flex text-sm font-medium">
          <!-- <button
            @click="deviceutxo"
            class="py-1 px-3 rounded-md border border-transparent flex items-center justify-center mr-2 bg-[#FFDC51] "
          >
            
          deviceutxo
          </button> -->

          <button
            @click=";(modelValue = true), (mintData.mintAmount = 0)"
            class="py-3 px-6 rounded-[12px] border border-[#656170] flex mr-4"
          >
            {{ $t('Nfts.lanuch_addMint') }}
          </button>
          <!-- <button
            class="py-1 px-3 rounded-md border border-transparent flex items-center justify-center "
            :class="[tableData.length ? 'bg-[#FFDC51]' : 'bg-[#EDEFF2] text-[#BFC2CC]']"
            @click="finallyMint"
          > -->
          <button
            class="py-3 px-6 rounded-[12px] border border-[#656170] flex"
            :class="[tableData.length ? 'text-white main-border primary' : 'text-[#656170]']"
            @click="finallyMint"
          >
            <span class="mr-1">{{ $t('Nfts.lanuch_confirm_minting') }}</span>
            <span v-if="tableData.length">{{ tableData.length }}</span>
          </button>
        </div>
      </div>
      <div class="form-wrap mt-6">
        <el-table
          @cell-click="selectChange"
          :data="tableData"
          style="width: 100%;height:500px"
          header-row-class-name="text-[16px] text-[#A9A8AC] font-sora font-light bg-[#17161A]"
          :header-cell-style="{ background: '#17161A', fontWeight: '300' }"
        >
          <el-table-column prop="id" :label="$t('Nfts.lanuch_nftIndex')" width="auto">
            <template #default="scope">
              <div
                class="main-border gray-exclued-text p-2 min-h-14  flex justify-between items-center "
              >
                <div class="w-8 h-8 rounded-md text-white">
                  <span>#{{ scope.row.id }}</span>
                </div>
              </div>
            </template>
          </el-table-column>

          <el-table-column prop="nftName" :label="$t('Nfts.lanuch_nft_name')" width="auto">
            <template #default="scope">
              <div
                class="main-border flex items-center gray-exclued-text min-h-14 truncate text-white"
              >
                <el-input v-model="scope.row.nftName"></el-input>
              </div>
            </template>
          </el-table-column>

          <el-table-column prop="cover" :label="$t('Nfts.lanuch_nftcover')" width="auto">
            <template #default="scope">
              <div
                class="main-border gray-exclued-text px-2 min-h-14  flex justify-between items-center "
              >
                <div class="w-[56px] h-[56px] tb-img-wrap">
                  <img class="rounded-lg " :src="scope.row.cover.url || scope.row.cover" alt="" />
                </div>
                <!-- <el-icon class="cursor-pointer" @click="deleteCover(scope.row)"><Close /></el-icon> -->
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="source" :label="$t('Nfts.lanuch_source')" width="auto">
            <template #default="scope">
              <div
                class="main-border gray-exclued-text  p-2 min-h-14 flex justify-between items-center truncate"
              >
                <div class="w-8 h-8 rounded-md text-white">
                  <span>{{ prettyAddress(scope.row.source) }}</span>
                </div>
                <!-- <el-icon class="cursor-pointer" @click="deleteCover(scope.row)"><Close /></el-icon> -->
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="desc" :label="$t('Nfts.lanuch_desc')" width="auto">
            <template #default="scope">
              <div class="main-border gray-exclued-text py-3.5  p-2 min-h-14 truncate text-white">
                <span class="text-white">{{ scope.row.desc ?? '' }}</span>
              </div>
            </template>
          </el-table-column>

          <!-- <el-table-column prop="classify" :label="$t('Nfts.lanuch_classify')" width="auto" >
            <template #default="scope">
              <div class=" gray-exclued-text p-2 min-h-14  flex">
                <el-select  v-model="scope.row.classify" placeholder="Select" >
                  <el-option
                    v-for="item in classifyList"
                    :key="item.classify"
                    :disabled="item.disabled"
                    :label="item.name()"
                    :value="item.classify"
                  />
                </el-select>
              </div>
            </template>
          </el-table-column> -->
          <!-- <el-table-column prop="receiver" :label="$t('Nfts.lanuch_receive_address')" width="250">
            <template #default="scope">
              <div class="main-border py-3.5 gray-exclued-text p-2 min-h-14  ">
                <span class="">{{ prettyAddress(scope.row.receiver, 12) }}</span>
              </div>
            </template>
          </el-table-column> -->

          <!-- <el-table-column prop="process" :label="$t('Nfts.lanuch_upload_process')" width="150">
            <template #default="scope">
             
              <el-progress
                :text-inside="true"
                :stroke-width="15"
                :percentage="scope.row.process"
                color="#FFDC51"
              />
            </template>
          </el-table-column> -->

          <el-table-column prop="op" :label="$t('Nfts.lanuch_operation')" width="auto">
            <template #default="scope">
              <div class="flex items-center ">
                <span
                  @click="removeItem(scope.row)"
                  :class="[
                    'ml-3',
                    'cursor-pointer',
                    'text-[#FC6D5E]',
                    'text-center',
                    'opacity-100',
                    ' hover:opacity-80',
                    'font-medium',
                  ]"
                  >{{ scope.row.op }}</span
                >
              </div>
            </template>
          </el-table-column>
          <template #empty>
            <div class="h-80 flex items-center justify-center ">
              <span class="text-base">{{ $t('Nfts.lanuch_mint_blank') }}</span>
            </div>
          </template>
        </el-table>
      </div>
    </div>

    <div v-if="isShowmsgModal" class="msg-overlay">
      <div class="modal">
        <!-- <img
          src="@/assets/image/pop_icon_close.png"
          alt=""
          @click="closeModal"
          class="close-style"
        /> -->
        <img
          src="@/assets/images/close-o@1x.png"
          alt=""
          class="w-[30px] h-[30px] absolute top-[30px] right-[20px] cursor-pointer"
          @click="closeModal"
        />
        <img
          src="@/assets/images/yes@2x.png"
          alt=""
          class="w-[90px] h-[58px] m-auto mt-15 mb-12"
        />
        <div class="title-line mb-8">Created Successfully</div>
        <div
          class="mt-5 text-base font-medium py-4 flex items-center cursor-pointer justify-center main-border primary text-white"
          @click="closeModal"
        >
          OK
        </div>
      </div>
    </div>
  </div>

  <CollectionDialog
    
    v-model="modelValue"
    :defiendFooter="defiendFooter"
    :isHideCancelBtn="true"
    :operateWarpMarginTop="12"
    :customHeight="true"
  >
    <template #title>
      <div class="title flex1" :style="{ fontSize: '24px' }">
        {{ isEdit ? $t('Nfts.lanuch_edit') : $t('Nfts.lanuch_addMint') }}
      </div>
    </template>
    <template #content>
      <div class="mintDialog-style">
        <el-form
          ref="ruleFormRef"
          :label-position="labelPosition"
          label-width="auto"
          :rules="rules"
          :model="mintData"
          style="max-width: 600px"
        >
          <!--cover-->
          <el-form-item>
            <div class="flex justify-between">
              <span class="text-sm font-light font-sora text-normalColor">{{
                $t('Nfts.lanuch_nftcover')
              }}</span>
              <!-- <div class="text-[#909399]">
                <div class="switch-list flex flex-align-center" v-if="!isEdit">
                  <div class="switch-item flex flex-align-center">
                    <span class="mr-2">{{ $t('Nfts.lanuch_useSameCover') }}</span>
                    <ElSwitch v-model="mintData.isSameCover" />
                  </div>
                </div>
              </div> -->
              <div class="w-30 mt-1">
                <AddImageWarpVue v-model:attachment="mintData.cover" :onlyFileName="false" />
              </div>
            </div>
            <!-- <div class="w-30 mt-1">
              <AddImageWarpVue v-model:attachment="mintData.cover" :onlyFileName="false" />
            </div> -->
          </el-form-item>
          <!--nft name-->
          <el-form-item>
            <template #label>
              <div class="flex items-center justify-between">
                <span class="text-sm font-light font-sora text-normalColor">{{
                  $t('Nfts.lanuch_nft_name')
                }}</span>
                <!-- <div class="text-[#909399]">
                  <div class="switch-list flex flex-align-center">
                    <div class="switch-item flex flex-align-center">
                      <span class="mr-2">{{ $t('Nfts.lanuch_useSameName') }}</span>
                      <ElSwitch v-model="mintData.isSameName" />
                    </div>
                  </div>
                </div> -->
              </div>
            </template>
            <div class="mt-1">
              <el-input v-model="mintData.nftName" />
            </div>
          </el-form-item>
          <!--desc-->
          <el-form-item>
            <div class="flex  items-center justify-between">
              <span class="text-sm font-light font-sora text-normalColor">{{
                $t('Nfts.lanuch_desc')
              }}</span>
              <!-- <div class="text-[#909399]">
                <div class="switch-list flex flex-align-center" v-if="!isEdit">
                  <div class="switch-item flex flex-align-center">
                    <span class="mr-2">{{ $t('Nfts.lanuch_useSameDesc') }}</span>
                    <ElSwitch v-model="mintData.isSameDesc" />
                  </div>
                </div>
              </div> -->
            </div>
            <div class="nfts-desc main-border gray mt-1">
              <ElInput
                :placeholder="$t('Nfts.lanuch_descPlaceholder')"
                type="textarea"
                v-model="mintData.desc"
              />
            </div>
          </el-form-item>

          <el-form-item props="mintAmount">
            <template #label>
              <div class="flex items-center justify-between">
                <span class="text-sm font-light font-sora text-normalColor">{{
                  $t('Nfts.lanuch_addMintAmount')
                }}</span>
                <div class="text-[#909399] flex items-center">
                  <span class="mr-1">{{ $t('Nfts.lanuch_mintLimited') }}</span>
                  <span>{{
                    Number(currentNftsCollect?.totalSupply! - currentNftsCollect?.currentSupply! - currentNftsCollect?.minted!) - tableData.length
                  }}</span>
                </div>
              </div>
            </template>
            <div class="mt-1 flex flex-col">
              <el-input v-model="mintData.mintAmount" @input="validateInput" />
              <span v-if="errorMsg" style="color: #fc6d5e;">{{ errorMsg }}</span>
            </div>
          </el-form-item>

          <!--sourece file-->
          <!-- <el-form-item>
            <div class="flex items-center justify-between">
              <span class="text-base font-medium">{{ $t('Nfts.lanuch_Nftsource') }}</span>
              <div class="text-[#909399]">
                <div class="switch-list flex flex-align-center" v-if="!isEdit">
                  <div class="switch-item flex flex-align-center">
                    <span class="mr-2">{{ $t('Nfts.lanuch_useSameSource') }}</span>
                    <ElSwitch v-model="mintData.isSameSource" />
                  </div>
                </div>
              </div>
            </div>
            <div class="mt-1">
              <AddImageWarpVue v-model:attachment="mintData.cover" :onlyFileName="true" />
            </div>
          </el-form-item> -->

          <!--Classify-->
          <!-- <el-form-item>
            <div class="flex items-center justify-between">
              <span class="text-sm font-light font-sora text-normalColor">{{
                $t('Nfts.lanuch_classify')
              }}</span>
             
            </div>

            <div class="mt-1">
              <ElSelect  v-model="mintData.classify" style="width:100%" class="class-select">
                <ElOption
                  v-for="item in classifyList"
                  :key="item.classify"
                  :disabled="item.disabled"
                  :label="item.name()"
                  :value="item.classify"
                />
              </ElSelect>
            </div>
          </el-form-item> -->

          <!--Receiver-->
          <!-- <el-form-item>
            <div class="flex items-center justify-between">
              <span class="text-base font-medium">{{ $t('Nfts.lanuch_receive_address') }}</span>
              <div class="text-[#909399]">
                <div class="switch-list flex flex-align-center" v-if="!isEdit">
                  <div class="switch-item flex flex-align-center">
                    <span class="mr-2">{{ $t('Nfts.lanuch_useSameReceiver') }}</span>
                    <ElSwitch v-model="mintData.isSameReceiver" />
                  </div>
                </div>
              </div>
            </div>

            <div class="mt-1">
              <ElInput type="text" v-model="mintData.receiver" />
            </div>
          </el-form-item> -->

          <el-form-item>
            <div class="operate flex items-center font-medium text-base">
              <!-- <div
                class="main-border  cursor-pointer text-center py-2.5  mr-2.5 darkGray flex-1"
                @click="cancel(ruleFormRef)"
              >
                {{ $t('Cancel') }}
              </div> -->
              <div
                class="main-border primary cursor-pointer text-center mt-3  py-2.5 flex-1"
                @click="confirm(ruleFormRef)"
              >
                {{ $t('Nfts.launch_OK') }}
              </div>
            </div>
          </el-form-item>
        </el-form>
      </div>
    </template>
  </CollectionDialog>

  <!--create Nfts-->
  <CollectionDialog
  :customWidth="true"
    v-model="createNftsModel"
    :defiendFooter="defiendFooter"
    :isHideCancelBtn="false"
    :operateWarpMarginTop="12"
  >
    <template #title>
      <header class="flex w-full items-center">
        <div class="text-lg font-medium ">
          {{ $t('Nfts.launch_create') }}
        </div>
      </header>
    </template>

    <template #content>
      <div class="form-wrap pt-7">
        <el-form :model="createCollectionform">
          <el-form-item class="flex" label-width="50%">
            <template #label>
              <span class="flex-1 text-base font-medium"> {{ $t('Nfts.launch_form_title1') }}</span>
            </template>
            <template #default>
              <div class="flex relative justify-end">
                <el-upload
                  :multiple="false"
                  action="#"
                  class="avatar-uploader  w-30 h-30 flex items-center justify-center rounded-[8px] bg-[#151417]"
                  :show-file-list="false"
                  :before-upload="beforeAvatarUpload"
                >
                  <img
                    v-if="createCollectionform.cover"
                    :src="createCollectionform.cover"
                    class="avatar rounded-lg"
                  />
                  <el-icon v-else class="avatar-uploader-icon " color="#BFC2CC" :size="25"
                    ><Plus
                  /></el-icon>
                 
                  <div
                    v-if="createCollectionform.cover"
                    @click="removeCollectionCover"
                    class="absolute w-[120PX] flex items-center justify-center bottom-[0px] py-0.5 bg-[rgba(0,0,0,0.4)] rounded-b-lg hover:bg-[rgba(0,0,0,0.3)]"
                  >
                    <span class="text-[#FFFFFF]">{{ $t('Nfts.lauch_delete') }}</span>
                  </div>
                </el-upload>
              </div>
            </template>
          </el-form-item>

          <el-form-item class="flex flex-col " label-width="auto">
            <template #label>
              <span class="flex text-base font-medium">{{ $t('Nfts.launch_title2') }}</span>
            </template>
            <template #default>
              <el-input
              maxlength="30"
              show-word-limit
                v-model="createCollectionform.name"
                :placeholder="$t('Nfts.launch_placeholder1')"
              />
            </template>
          </el-form-item>

          <el-form-item class="flex flex-col " label-width="auto">
            <template #label>
              <span class="flex text-base font-medium">{{ $t('Nfts.launch_title3') }}</span>
            </template>
            <template #default>
              <el-input
                :rows="5"
                v-model="createCollectionform.desc"
                type="textarea"
                :placeholder="$t('Nfts.launch_placeholder2')"
              />
            </template>
          </el-form-item>
          <div class="flex flex-col">
            <div class="flex items-center justify-between space-x-4">
              <el-form-item class="flex flex-col flex-1" label-width="auto">
                <template #label>
                  <span class="flex text-base font-medium">{{ $t('Nfts.launch_title4') }}</span>
                </template>
                <template #default>
                  <el-input
                    v-model="createCollectionform.totalSupply"
                    maxlength="4"
                    show-word-limit
                    :formatter="(value:string) => `${value}`.replace(/\D$/g, '').slice(0,4)"
                    :parser="(value:string) => `${value}`.replace(/\D$/g, '').slice(0,4)"
                    :placeholder="$t('Nfts.launch_placeholder3')"
                  />
                </template>
              </el-form-item>
              <el-form-item class="flex flex-col flex-1" label-width="auto">
                <template #label>
                  <span class="flex text-base font-medium">{{ $t('Nfts.launch_title5') }}</span>
                </template>
                <template #default>
                  <el-select
                    v-model="createCollectionform.royaltyRate"
                    placeholder="Select"
                    style="width: 100%"
                  >
                    <el-option
                      v-for="item in royaltyRate"
                      :label="item + ' ' + '%'"
                      :value="item"
                    />
                  </el-select>
                </template>
              </el-form-item>
            </div>
          </div>


          <el-form-item class="flex flex-col"   label-width="auto" >
              <template #label>
            <span class="flex text-sm font-light font-sora text-normalColor">{{
              $t('Nfts.lanuch_classify')
            }}</span>
          </template>
            <template #default>
              <div class=" gray-exclued-text  min-h-14  flex">
                <el-select class="custom-select" multiple v-model="createCollectionform.classify" placeholder="Select" style="width: 100%">
                  <el-option
                    v-for="item in classifyList"
                    :key="item.classify"
                    :disabled="item.disabled"
                    :label="item.name()"
                    :value="item.classify"
                  />
                </el-select>
              </div>
            </template>
          </el-form-item >

          <el-form-item class="flex flex-col " label-width="auto">
            <template #label>
              <span class="flex text-base font-medium">{{ $t('Nfts.launch_title6') }}</span>
            </template>
            <template #default>
              <el-input
                v-model="createCollectionform.website"
                :placeholder="$t('Nfts.launch_placeholder6')"
              />
            </template>
          </el-form-item>


          <div class="flex flex-col ">
            <div class="flex set-price-wrap items-center justify-between space-x-4">
              <el-form-item class="flex flex-col flex-1" label-width="auto">
                <template #label>
                  <span class="flex text-base font-medium">{{ $t('Nfts.lanuch_auto_market_setprice') }}</span>
                  <span class="ml-1  text-base font-medium">({{ $t('Nfts.mint_price_unit') }})</span>
                </template>
                <template #default>
                
   
                  <el-input
                    v-model="createCollectionform.initialPrice"
                   :formatter="(value:string) => `${value}`.replace(regex,(match,p1,p2,p3)=>`${p1}${p2}`)"
                    :parser="(value:string) => `${value}`.replace(regex,(match,p1,p2,p3)=>`${p1}${p2}`)"
                    :placeholder="$t('Nfts.lanuch_set_init_price')"
                  >
                  <template #append>
       = {{$filters.toSats(createCollectionform.initialPrice)}} Sats
      </template>
                </el-input>
                </template>
              </el-form-item>
              <el-form-item class="flex flex-col flex-1" label-width="auto">
                <template #label>
                  <span class="flex text-base font-medium">{{ $t('Nfts.lanuch_auto_market_setpriceAdd') }}</span>
                  <span class="ml-1 text-base font-medium">({{ $t('Nfts.mint_price_unit') }})</span>
                  <el-popover
                  placement="top-start"
                  :title="$t('Nfts.lanuch_growth_price_desc')"
                  :width="250"
                  trigger="hover"
                >
                  <template #reference>
                    <el-icon :size="18" class="align-middle ml-1 cursor-pointer"
                      ><QuestionFilled
                    /></el-icon>
                  </template>

                  <div class="flex flex-col text-sm font-medium">
                    <span>{{ $t('NFTs.lanuch_growth_content1') }}</span>
                    <span class="mt-2 whitespace-normal break-words">{{
                      $t('NFTs.lanuch_growth_content2')
                    }}</span>
                    <span class="mt-2">{{ $t('NFTs.lanuch_growth_content3') }}</span>
                  </div>
                </el-popover>
                </template>
                <template #default>
                  <el-input
                    v-model="createCollectionform.priceGrowth"
                   :formatter="(value:string) => `${value}`.replace(regex,(match,p1,p2,p3)=>`${p1}${p2}`)"
                    :parser="(value:string) => `${value}`.replace(regex,(match,p1,p2,p3)=>`${p1}${p2}`)"
                    :placeholder="$t('Nfts.lanuch_set_price_increase')"
                  >
                  <template #append>
       = {{$filters.toSats(createCollectionform.priceGrowth)}} Sats
      </template>
                </el-input>
                </template>
              </el-form-item>
            </div>
          </div>

          <!-- <el-form-item class="flex flex-col " label-width="auto">
            <template #label>
              <span class="flex text-base font-medium">{{ $t('NFTs.lanuch_title1') }}</span>
            </template>
            <template #default>
              <el-select v-model="chain" placeholder="Select" style="width:100%">
                <template #prefix>
                  <span>
                    <img
                      class="w-6 h-6"
                      :src="chain == NftsLaunchPadChain.btc ? btc : mvc"
                      alt=""
                    />
                  </span>
                </template>

                <el-option
                  class="flex items-center my-2"
                  v-for="item in chainOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                  <Icon :name="item.icon" custom-class="h-6 w-6 mr-2" />
                  <span class="text-sm">{{ item.label }}</span>
                </el-option>
              </el-select>
            </template>
          </el-form-item> -->

          <!-- <el-form-item class="flex flex-col " label-width="auto">
            <template #label>
              <span class="flex text-base font-medium">{{ $t('NFTs.lanuch_title2') }}</span>
            </template>
            <template #default>
              <el-select
                v-model="createCollectionform.autoMakeMarket"
                placeholder="Select"
                style="width: 100%"
              >
                <el-option
                  v-for="item in optionMakeMarket"
                  :label="item.label"
                  :value="item.value"
                  :disabled="item.disabled"
                />
              </el-select>
            </template>
          </el-form-item> -->

          <el-form-item>
            <div
              class="mt-5 text-base font-medium py-4 flex items-center cursor-pointer justify-center main-border "
              :class="[createCollectionDisabled ? 'primary' : 'gray']"
              @click="onSubmitNewCollection"
            >
              {{ $t('Nfts.launch_next') }}
            </div>
          </el-form-item>
        </el-form>
      </div>
    </template>
  </CollectionDialog>
</template>

<script setup lang="ts">


import btc from '@/assets/nft/btc.png'
import mvc from '@/assets/nft/mvc.png'
import { Close, Plus,Promotion } from '@element-plus/icons-vue'
import { useRouter, useRoute } from 'vue-router'
import { reactive, ref, computed, onMounted, watch, toRaw } from 'vue'
import { compressImage, FileToAttachmentItem, prettyAddress, sleep,openLoading } from '@/utils/util'
import { useI18n } from 'vue-i18n'
import CollectionDialog from './collection-dialog.vue'

import AddImageWarpVue from '@/components/AddImageWarp/AddImageWarp.vue'
import { AttachmentItem } from '@/@types/hd-wallet'
import { classifyList, fileType, royaltyRate } from '@/config'
import { useGenesisStore } from '@/stores/genesis'

import { CollectionMintChain,SdkPayType } from '@/enum'
import { Select ,QuestionFilled} from '@element-plus/icons-vue'
import { useConnectionStore } from '@/stores/connection'
import { ElLoading, ElMessage } from 'element-plus'
import {toSats} from '@/utils/filters'
import { NftsLaunchPadChain, NftsLaunchPadChainSymbol,SIGHASH_ALL,SIGHASH_ALL_ANYONECANPAY ,SIGHASH_SINGLE_ANYONECANPAY,DUMMY_UTXO_INPUT_LEGACY,MinPlatformFee,MRC721PlatformAddress} from '@/data/constants'
import { useMetaIDEntity } from '@/hooks/use-metaid-entity'
import { Line } from 'vue-chartjs'
import { useEchart } from '@/hooks/use-echart-tool'
import type {  FormInstance, FormRules,UploadProps } from 'element-plus'
import { useFeebStore } from '@/stores/feeb'
import { uploadNftsFile,uploadNftsFilePath,generateCommitAddress,getCollectionDetail,mintNftItem,submitMintOrder,issueCollection,genesisCollection as genesisCollect,getPoolInfo} from '@/api/mrc721-api'

import Decimal from 'decimal.js-light'
import {exclusiveChange,deviceDummy,getDummyUtxoforLegacy} from '@/hooks/use-buildtx-entity'
import { useNetworkStore } from '@/stores/network'
import { useBtcJsStore } from '@/stores/btcjs'
import * as secp256k1 from 'tiny-secp256k1'
import {usePayModalEntity} from '@/hooks/use-pay-modal-entity'
import {  type Psbt } from 'bitcoinjs-lib'
import { useLayoutStore } from '@/stores/layout'
import { settings } from 'cluster'



const i18n = useI18n()
const genesisStore = useGenesisStore()
const layout = useLayoutStore()
const connectionStore = useConnectionStore()
const bitcoinjs = useBtcJsStore().get!
const modelValue = ref(false)
const createNftsModel = ref(false)
const ruleFormRef = ref<FormInstance>()
const labelPosition = ref('top')
const isEdit = ref(false)
const defiendFooter = ref(true)
const chain = ref<string>(NftsLaunchPadChain.btc)
const router = useRouter()
const route = useRoute()
const networkStore=useNetworkStore()
const { mintNftEntity } = useMetaIDEntity()

const chartData=reactive({
  labelNum:0,
  growth:0
})

const chart=reactive({vals:{

}})




const feeStore = useFeebStore()
const chartRef = ref()
const payModalEntity=usePayModalEntity()
const errorMsg=ref('')




// const autoMaketData=ref({
//   initialPrice:0,
//   priceGrowth:0,

// })
const regex=/(\d+)(\.\d{5})(\d+)/
const totalSupplyRegex=/^\d{0,4}$/
const isShowmsgModal = ref(false)



watch(
  () => route.params.pinid,
  newValue => {
    currentNftsCollect.value = genesisStore.getList.find(item => {
      return item.collectionPinId == newValue
    })


  //   if(!currentNftsCollect.value?.cover){
  //     getCollectionDetail({
  //   collectionPinid:route.params.pinid as string
  // }).then((res)=>{
  //   if(res.code == 0){
  //     currentNftsCollect.value!.cover = res.data.result.cover_pinid
  //   }
  // })
  //   }
    // autoMaketData.value.initialPrice=currentNftsCollect.value?.initialPrice!

    // autoMaketData.value.priceGrowth=currentNftsCollect.value?.priceGrowth!
    //  autoMaketData.value.initialPrice=currentNftsCollect.value?.initialPrice! ? space(currentNftsCollect.value?.initialPrice!) : 0
    // autoMaketData.value.priceGrowth=currentNftsCollect.value?.priceGrowth! ? space(currentNftsCollect.value?.priceGrowth!) : 0

    genesisCollection.value = currentNftsCollect.value!.name
  }
)



// async function deviceutxo(){
//     await deviceDummy()
// }

onMounted(() => {


  // genesisStore.updateItem({
  //   ...currentNftsCollect.value,
  //   initialPrice:'',
  //   priceGrowth:""
  // })

})

type MintInfo = {
  mintAmount: number
  cover: AttachmentItem
  source: AttachmentItem
  desc: string
  //classify: string[]
  receiver: string
  nftName:string
}

type UseSameOption = {
  isSameCover: boolean
  isSameSource: boolean
  isSameDesc: boolean
  // isSameClassify: boolean
  isSameReceiver: boolean
  isSameName:boolean
}

const chainOptions = [
  {
    value: NftsLaunchPadChainSymbol.btc,
    label: NftsLaunchPadChain.btc,
    icon: 'logo_btc',
  },
  // {
  //   value: NftsLaunchPadChain.mvc,
  //   label: NftsLaunchPadChain.mvc,
  //   icon: 'logo_mvc',
  // },
]

const createCollectionform = reactive({
  name: '',
  cover: '',
  coverHex: '',
  desc: '',
  totalSupply: 0,
  royaltyRate: 0,
  website: '',
  metadata:{},
  originFile:null,
  initialPrice:0.0001,
  priceGrowth:0.0001,
  chain: NftsLaunchPadChainSymbol.btc,
  classify:[],
  autoMakeMarket: true,
})

const newFile: Array<{id:number, file: File; picId: string,itemDesc:string,nftName:string }> = reactive([])

const genesisCollection = ref('')
const currentNftsCollect = ref<Mrc721CollectionItem>()
const tableData = reactive<MintListInfo[]>([])

// const btcConverSats=computed(()=>{
//   if(autoMaketData.value.initialPrice){
//     return new Decimal(autoMaketData.value.initialPrice).mul(10**8).toNumber()
//   }else{
//     return 0
//   }
// })

// const btcConverSatsPriceGrowth=computed(()=>{
//   if(autoMaketData.value.priceGrowth){
//     return new Decimal(autoMaketData.value.priceGrowth).mul(10**8).toNumber()
//   }else{
//     return 0
//   }
// })

// const initialPriceEmpty=computed(()=>{
//   return autoMaketData.value.initialPrice
// })

// const priceGrowthEmpty=computed(()=>{
//   return autoMaketData.value.priceGrowth
// })

const customStyle = computed(() => {
  return {
    height: '230px',
  }
})

const optionMakeMarket = reactive([
  {
    value: true,
    label: computed(() => i18n.t('Nfts.launch_yes')
      // chain.value == NftsLaunchPadChain.btc
      //   ? i18n.t('Nfts.launch_noSupport')
      //   : i18n.t('Nfts.launch_yes')
    ),
    disabled:false
    //  disabled: computed(() => chain.value == NftsLaunchPadChain.btc),
  },
  // {
  //   value: false,
  //   label: computed(() => i18n.t('Nfts.launch_no')),
  // },
])

const MyCollectionList = computed(() => {
  if (genesisStore.getList.length) {

    return genesisStore.getList
  } else {
    return []
  }
})

const mintedAmount=computed(()=>{
  if(currentNftsCollect.value?.totalSupply!){
    return currentNftsCollect.value.minted
  }else{
    return 0
  }

})



const mintData = reactive<MintInfo & UseSameOption>({
  mintAmount: 0,
  cover: '',
  source: '',
  desc: '',
  nftName:'',
  //classify: [],
  receiver: connectionStore.userInfo.address ?? '',
  isSameCover: true,
  isSameSource: true,
  isSameDesc: true,
  isSameClassify: true,
  isSameReceiver: true,
  isSameName:true
})

const createCollectionDisabled=computed(()=>{
  return createCollectionform.name && createCollectionform.totalSupply && createCollectionform.originFile
})

const rules = reactive<FormRules<MintInfo>>({
  //mintAmount:[{validator:validatorMintAmount,trigger:'blur'}],
  // cover:[
  // {
  //     required: true,
  //     message: 'Please select NFT cover',
  //     trigger: 'change',
  // },
  // ],
  // source:[
  // {
  //     required: true,
  //     message: 'Please select NFT source file',
  //     trigger: 'change',
  // },
  // ],
  // desc:[
  // {
  //     required: false,
  //     message: 'Please select NFT source file',
  //     trigger: 'blur',
  // },
  // ],
  // classify:[
  // {
  //     required: false,
  //     message: 'Please select NFT source file',
  //     trigger: 'blur',
  // },
  // ],
  // receiver:[
  // { required: true, message: 'Please input receiver address', trigger: 'blur' },
  // ]
})

type MintListInfo = Omit<MintInfo, 'mintAmount'> & { id: number; op: string; }









function validateInput(){
  mintData.mintAmount = Number(String(mintData.mintAmount).replace(/[^0-9]/g, ''))
  if(mintData.mintAmount + tableData.length > 30){
    mintData.mintAmount =new Decimal(30).sub(tableData.length).toNumber()
    errorMsg.value=`${i18n.t('Nfts.lanuch_morethan_amount')}`
  }else{
    errorMsg.value=''
  }
}

  async function formatToSignInputs(psbt:Psbt){
    try {
      const pubkey=await connectionStore.provider?.btc.getPublicKey()

    const toSignInputs=[]
    if(psbt.inputCount == 1){
      throw new Error('No input to Sign')
    }

    if(psbt.inputCount > 0){
        for(let i=0;i<psbt.inputCount;i++){
          toSignInputs.push({
            index:i,
        address:connectionStore.last.user.address,
        publickey:pubkey,
        sighashTypes:[SIGHASH_ALL_ANYONECANPAY],
        disableTweakSigner:false
          })
        }
      }
      console.log("toSignInputs",toSignInputs)

      return toSignInputs
    } catch (error) {
      throw new Error(error as any)
    }
  }

function closeModal(){
  isShowmsgModal.value = false

}

  // async function mintOne(params:{
  //   creatorMetaId:string
  //   name:string
  //   commitAddress:string
  //   receiverAddress:string
  //   feeb:number
  // }){
  //   try {
  //   const getOrderPsbtRes= await mintNftItem(params)
  //   if(getOrderPsbtRes.code == 200){
  //   const psbtHex=getOrderPsbtRes.data.psbtHex
  //    const estiomateResult=await estimatePsbtFee(psbtHex,feeStore.last.currentFeeb.feeRate,true)
  //    if(estiomateResult){
  //     const {psbt,feeb}=await estimatePsbtFee(psbtHex,feeStore.last.currentFeeb.feeRate)
  //     const toSignInputs=await formatToSignInputs(psbt)
  //     const rawTx= await connectionStore.adapter.signPsbt(psbt.toHex(),{
  //       toSignInputs:toSignInputs,
  //       autoFinalized:false
  //     })
  //     console.log("signRes",rawTx)
  //     if(rawTx?.status == 'canceled'){
  //       throw new Error(`${i18n.t('Nfts.lanuch_sign_tx_fail')}`)
  //     }else{
  //       const submitRes= await submitMintOrder({
  //       creatorMetaId:params.creatorMetaId,
  //       name:params.name,
  //       commitAddress:params.commitAddress,
  //       psbtHex:rawTx,
  //       feeb:params.feeb
  //     })
  //     if(submitRes.code == 200){
  //
  //       return ElMessage.success(`${i18n.t('NFTS.NFTs mint_success')}`)
  //     }else{
  //       throw new Error(submitRes?.msg)
  //     }
  //     }

  //   }

  //   } }catch (error) {
  //

  //    return ElMessage.error(error as any)
  //   }

  // }


function getCollectionData() {
  currentNftsCollect.value = genesisStore.getList.find(item => {
    return item.collectionPinId == route.params.pinid
  })

  console.log("currentNftsCollect.value",currentNftsCollect.value)
  chartData.growth=currentNftsCollect.value?.priceGrowth ? new Decimal(currentNftsCollect.value?.priceGrowth).div(10 ** 8).toNumber() : 0
  chartData.labelNum=currentNftsCollect.value!.totalSupply + 1
  chart.vals= useEchart(chartData)
  
  if(currentNftsCollect.value?.name){

    genesisCollection.value = currentNftsCollect.value!.name

    // autoMaketData.value.initialPrice=currentNftsCollect.value?.initialPrice! ? space(currentNftsCollect.value?.initialPrice!) : 0
    // autoMaketData.value.priceGrowth=currentNftsCollect.value?.priceGrowth! ? space(currentNftsCollect.value?.priceGrowth!) : 0


  }

}

function genesisNfts() {
  createNftsModel.value = true
  //router.push('/nfts')
}

function removeItem(item: any) {
  let newArr = tableData.filter(ele => {
    return ele.id !== item.id
  })
  let newFileList=newFile.filter(ele => {
    return ele.id !== item.id
  })
  console.log("newFILE",newFile)

  tableData.length = 0
  newFile.length=0
  newArr.map((item,index)=>{
      item.id=index+1+mintedAmount.value
  })
  newFileList.map((item,index)=>{
      item.id=index+1+mintedAmount.value
  })



  tableData.push(...newArr)
  newFile.push(...newFileList)
}


function toMarketCollection(){
  if(currentNftsCollect.value?.initialPrice){
    router.push({
    name:"nftCollectionDetail",
    params: { topicType: currentNftsCollect.value?.collectionPinId}
  })
  }else{
    return ElMessage.error(`${i18n.t('NFTs.lanuch_price_exist')}`)
  }
  //    :to="{ name: 'nftCollectionDetail', params: { topicType: item.collection_pinid } }"

}

function editNft(item: MintListInfo) {
  isEdit.value = true
  fillMintData(item)
  modelValue.value = true
}

function fillMintData(item: MintListInfo) {
  mintData.cover = item.cover
  //mintData.classify = item.classify
  mintData.desc = item.desc
  mintData.receiver = item.receiver
  mintData.source = item.source
  mintData.nftName=item.nftName
}

async function selectChange(newSelection: any) {
  if (!newSelection.cover) {
    let input = document.createElement('input')
    input.type = 'file'
    await sleep(300)
    input.click()
    input.onchange = async (e: Event) => {
      const files: File[] = [...e.target!.files!]
      for (let item of files) {

        const compressed = await compressImage(item)
        const result = await FileToAttachmentItem(compressed)
        newSelection.cover = result.url
        newSelection.source = result.fileName
      }
    }
  }
}

function deleteCover(item: any) {

  item.cover = ''
  item.source = ''
}

function performChunk(datas: MintListInfo[]) {
  return new Promise<void>(resolve => {
    if (datas.length == 0) {
      return
    }
    let i = 0
    function _run() {
      if (i == datas.length) {
        return
      }
      requestIdleCallback(idle => {
        while (idle.timeRemaining() > 0 && i < datas.length) {
          const item = datas[i]
          tableData.push(item)
          i++
        }
        _run()
      })
    }
    _run()
    resolve()
  })
}

const confirm = async (formEl: any) => {
  if (!formEl) return
  if (!mintData.mintAmount) return
  if (mintData.mintAmount > (currentNftsCollect.value?.totalSupply! - currentNftsCollect?.value?.minted!))
    return ElMessage.error(`${i18n.t('Nfts.lanuch_overLimit_amount')}`)
  if (!mintData.cover) return ElMessage.error(`${i18n.t('Nfts.lanuch_cover_null')}`)
  if(mintData.mintAmount > 30){
    return ElMessage.error(`${i18n.t('Nfts.lanuch_morethan_amount')}`)
  }
  //newFile.length = 0


  let currentlength = tableData.length

  const tableList: MintListInfo[] = []
  for (let i = 1; i <= mintData.mintAmount; i++) {
    tableList.push({
      id: i + currentlength + mintedAmount.value! ,
      op: i18n.t('Nfts.lanuch_delete'),
      nftName:mintData.nftName,
      cover: mintData.cover,
      source: mintData.cover?.fileName,
      desc: mintData.desc,
      //receiver: mintData.receiver ?? connectionStore.userInfo.address,
      //classify: mintData.classify,
    })
    newFile.push({
      id:i + currentlength + mintedAmount.value!,
      file: mintData.cover.originFile!,
      picId: mintData.cover.sha256,
      itemDesc:mintData.desc,
      //classify:mintData.classify,
      nftName: mintData.nftName
    })
  }
  console.log('newFile', newFile)
  const loadingInstance = ElLoading.service({
    target: '.form-wrap',
    text: 'loading',
  })

  setTimeout(() => {
    performChunk(tableList).then(() => loadingInstance.close())
  }, 500)

  // setTimeout(async() => {
  //   tableData.push(...tableList)

  //   loadingInstance.close()
  // }, 500);
  modelValue.value = false
  //tableData
}

function cancel(formEl: any) {
  if (!formEl) return
  formEl.resetFields()
  modelValue.value = false
}

function triggleCollection(pinId: string) {
  if (pinId == currentNftsCollect.value!.collectionPinId) {
    let collection = MyCollectionList.value.find(item => {
      return item.collectionPinId == pinId
    })
    genesisCollection.value = collection?.name
  } else {
    const loadingInstance =openLoading()

    setTimeout(() => {
      router.push({
        name: 'nftsCollection',
        params: {
          pinid: pinId,
        },
      })

      loadingInstance.close()
    }, 300)
    // currentNftsCollect.value=MyCollectionList.value.find(item=>{
    //   return item.collectionPinId == pinId
    // })
  }
}

function checkIsSameFile(pre:{file: File;
    picId: string},cur:{file: File;
    picId: string}){
  if(cur.picId == pre.picId){
    return true
  }else return false
}

async function preMint() {
    try {
      let params=new FormData()
     

      for(let i=0;i<newFile.length;i++){
      params.append('file',newFile[i].file)
    }
    params.append('name',currentNftsCollect.value?.name!)
    // if(!currentNftsCollect.value?.initialPrice && autoMaketData.value.initialPrice){
    //     params.append('initialPrice',new Decimal(autoMaketData.value.initialPrice).mul(10**8).toString())
    //     params.append('priceGrowth',new Decimal(autoMaketData.value.priceGrowth).mul(10**8).toString())
    //   }

    const res= await generateCommitAddress(params)
    console.log("res",res)

    if(res?.code == 200){
      return res.data
    }else return {
      commitAddressList:[],
      totalFee:0,
      receiverAddress:''
    }


    } catch (error) {
      throw new Error(error as any)
    }
}

async function estimateBuildTxFee(targetAddress:string[] = [],feeb:number,extractFee:number,checkOnly:boolean=false){

  try {
    if(!targetAddress.length){
    for(let i=0;i<newFile.length;i++){
      targetAddress.push(connectionStore.last.user.address)
    }
  }

    const psbt=new bitcoinjs.Psbt({ network: networkStore.typedNetwork })
    //const psbt:Psbt =await getDummyUtxoforLegacy(1,SIGHASH_ALL_ANYONECANPAY,true)
    //第一个output
    // psbt.addOutput({
    //   value:DUMMY_UTXO_INPUT_LEGACY,
    //   address:connectionStore.last.user.address
    // })
    for(let i =0;i<newFile.length;i++){
      psbt.addOutput({
        value: 546,
        address:targetAddress[i],
      })
    }
    psbt.addOutput({
      value:MinPlatformFee,
      address:MRC721PlatformAddress
    })
  const estiomateResult= await exclusiveChange({
      psbt: psbt,
      maxUtxosCount:3,
      sighashType:SIGHASH_ALL_ANYONECANPAY,
      feeb:feeb ?? feeStore.getCurrentFeeb,
   })

   console.log("estiomateResult",estiomateResult)

   if(checkOnly){
    const feeInfo={
      basic:newFile.length * 546,
      service:import.meta.env.VITE_MINT_NFT_SERVICE_FEE,
      miner:estiomateResult!.fee,
      feeb:estiomateResult!.feeb,
      total:new Decimal(estiomateResult!.fee).add(newFile.length * 546).add(import.meta.env.VITE_MINT_NFT_SERVICE_FEE).toNumber()
    }
    const result= await payModalEntity.awaitPayConfrim(SdkPayType.BTC,feeInfo.total,feeInfo,'basic',extractFee)

    return result
   }
   console.log("estiomateresult",estiomateResult)
   return estiomateResult
  } catch (error) {
    ElMessage.error((error as any).message)
    return false
    // debugger
    // return false
  }
}

async function estimatePsbtFee(psbtHex:string,feeb:number,checkOnly:boolean=false){

  try {
   if(!psbtHex){
    throw new Error(`${i18n.t('Nfts.psbt_empty')}`)
   }
    const psbt =bitcoinjs.Psbt.fromHex(psbtHex,{ network: networkStore.typedNetwork })

    const estiomateResult= await exclusiveChange({
      psbt: psbt,
      maxUtxosCount:3,
      sighashType:SIGHASH_ALL_ANYONECANPAY,
      feeb:feeb ?? feeStore.getCurrentFeeb,
   })


   if(checkOnly){
    const {paymentValue,fee,changeValue}=estiomateResult
    const mintPrice=new Decimal(paymentValue!).sub(changeValue).sub(fee).sub(import.meta.env.VITE_MINT_NFT_SERVICE_FEE).toNumber()
    const feeInfo={
      basic:mintPrice,
      service:import.meta.env.VITE_MINT_NFT_SERVICE_FEE,
      miner:estiomateResult!.fee,
      feeb:estiomateResult!.feeb,
      total:new Decimal(estiomateResult!.fee).add(mintPrice).add(import.meta.env.VITE_MINT_NFT_SERVICE_FEE).toNumber()
    }
    const result= await payModalEntity.awaitPayConfrim(SdkPayType.BTC,feeInfo.total,feeInfo,'mint')

    return result
   }

   return estiomateResult
  } catch (error) {
    throw new Error(error as any)
  }
}

async function finallyMint() {
  const preloading = openLoading()
    try {
    // if(Number(autoMaketData.value.initialPrice) == 0){
    //   preloading.close()
    //   return ElMessage.error(`${i18n.t('Nfts.lanuch_automarket_set')}`)
    // }

    // const estiomateResult= await estimateBuildTxFee([],feeStore.getCurrentFeeb,0,true)
    //
    // if(!estiomateResult){

    //   return ElMessage.error(`${i18n.t('Nfts.cancel_transation')}`)
    // }
    let lockAddress=''

    let params=new FormData()
    let nftListInfo:UploadFileData={
      picId:[],
      picPath:[],
      itemDesc:[],
      // classify:[],
      nftName:[],
      collectionPinid:'',
      rawTx:'',
      commitAddress:[],
      lockAddress:'',
      mvcRawTx:''
    }

    for(let i=0;i<newFile.length;i++){
      params.append('file',newFile[i].file)
      //nftListInfo.classify.push(JSON.stringify(newFile[i].classify))
      nftListInfo.itemDesc.push(newFile[i].itemDesc)
      nftListInfo.nftName.push(newFile[i].nftName)
      nftListInfo.picId.push(newFile[i].picId)
      // params.append('picId',newFile[i].picId)
      // params.append('itemDesc',newFile[i].itemDesc)
      // params.append('classify',JSON.stringify(newFile[i].classify))
      // params.append('nftName',newFile[i].nftName)
    }


    nftListInfo.collectionPinid=currentNftsCollect.value?.collectionPinId!

    uploadNftsFile(params).then(async (response)=>{

        if(response.code == 200 && response.data.length){

          for(let item of response.data){
            nftListInfo.picPath.push(item.picPath)
            
          }
            // for(let i=0;i<newFile.length;i++){
    //   params.append('file',newFile[i].file)
    //   params.append('picId',newFile[i].picId)
    //   params.append('itemDesc',newFile[i].itemDesc)
    //   params.append('classify',JSON.stringify(newFile[i].classify))
    //   params.append('nftName',newFile[i].nftName)
    // }
    // params.append('metaid',currentNftsCollect.value?.metaId!)
    // params.append('name',currentNftsCollect.value?.name!)

    const {commitAddressList,totalFee,receiverAddress} =await preMint()
    lockAddress=receiverAddress
if(commitAddressList.length){
  nftListInfo.commitAddress=commitAddressList
  // params.append('commitAddress',JSON.stringify(commitAddressList))


}else{
  preloading.close()
  throw new Error(`${i18n.t('Nfts.lanuch_generate_commit_address_fail')}`)
}

if(totalFee > 0){

    const mvcBalance= await window.metaidwallet.getMvcBalance()

    if(Number(mvcBalance.total) < totalFee ){
      preloading.close()
      return ElMessage.error(`${i18n.t('Nts.mvc_balance_noenough')},${i18n.t('Nts.mvc_balance_need')} ${new Decimal(totalFee).div(10**8).toNumber()} Space`)
    }
  }



const estiomateResultAndMvc= await estimateBuildTxFee(commitAddressList,feeStore.getCurrentFeeb,totalFee,true)

if(!estiomateResultAndMvc){
  preloading.close()
  return
}

const mvcTransfer=await window.metaidwallet.transfer({
  tasks:[
    {
      receivers:[
        {
          address:receiverAddress,
          amount:totalFee
        }
      ]
    }
  ],
  broadcast:false
})

if(mvcTransfer?.status == "canceled"){
  preloading.close()
  return ElMessage.error(`${i18n.t('Nfts.lanuch_sign_tx_fail')}`)
}

if(!mvcTransfer.res.length){
  preloading.close()
  return ElMessage.error(`${i18n.t(`Nfts.pay_file_fail`)}`)
}
const mvcRawTx=mvcTransfer.res[0].txHex
const {psbt:Psbt1}=await estimateBuildTxFee(commitAddressList,feeStore.getCurrentFeeb,totalFee)

preloading.close()
const loading = openLoading()
//const toSignInputs=await formatToSignInputs(Psbt1)
const rawTx= await connectionStore.adapter.signPsbt(Psbt1.toHex())
console.log("signRes",rawTx)




if(rawTx?.status == 'canceled'){
loading.close()
throw new Error(`${i18n.t('Nfts.lanuch_sign_tx_fail')}`)

}else if(rawTx){

nftListInfo.rawTx = rawTx
//params.append('rawTx',rawTx)
}
nftListInfo.lockAddress=lockAddress
nftListInfo.mvcRawTx=mvcRawTx
//uploadNftsFilePath
uploadNftsFilePath(nftListInfo).then((res)=>{

  if(res.code == 200){
    loading.close()
  if(currentNftsCollect.value?.autoMarket){
    genesisStore.updateItem({
      ...currentNftsCollect.value,
      // initialPrice:autoMaketData.value.initialPrice!,
      // priceGrowth:autoMaketData.value.priceGrowth!
    })
    // currentNftsCollect.value.initialPrice=autoMaketData.value.initialPrice
    // currentNftsCollect.value.priceGrowth=autoMaketData.value.priceGrowth
  }
  genesisStore.updateCurrentTotalSupply({
        name:currentNftsCollect.value!.name,
        count:newFile.length
      })
      tableData.length=0
      newFile.length=0
      // ElMessage.success(`${i18n.t('Nfts.lanuch_upload_file_success')}`)
      isShowmsgModal.value = true
  }else{
    loading.close()
    ElMessage.error(`${res.msg}`)
  }



}).catch(err=>{
  loading.close()
  throw new Error(`${err.toString()}`)

})


        }else{
          preloading.close()
          throw new Error(response.msg)
        }
    }).catch(err=>{
      preloading.close()
      throw new Error(`${err.toString()}`)
    })



  } catch (error) {
    preloading.close()
    return ElMessage.error(error as any)

  }



  // try {



  //   const attachments: AttachmentItem[] = []
  //   const body = tableData.map((item, index) => {
  //     attachments.push(item.cover)
  //     return {
  //       pinid: '',
  //       name: `#${index + 1}`,
  //       desc: item.desc,
  //       cover: '',
  //       metadata: {
  //         classify: toRaw(item.classify),
  //       },
  //     }
  //   })
  //   console.log('body', body, attachments)
  //
  //   const mintItemRes = await mintNftItemEntity({
  //     collectionName: genesisCollection.value,
  //     body: body,
  //     attachments: attachments,

  //     noBroadcast: false,
  //   })
  //   console.log('mintItemRes', mintItemRes)
  //
  // } catch (error) {
  //   console.log('error', error)
  //
  // }


}

function toCollectionWork(){
 
  window.open(currentNftsCollect.value?.website,'_blank')
  //router.push(`/nft/collection/detail/${currentNftsCollect.value?.collectionPinId}`)
}

const onSubmitNewCollection = async () => {
  //router.push('/nfts')
  console.log("createCollectionform",createCollectionform)



  if(!createCollectionDisabled.value){
    return ElMessage.error(`${i18n.t('Nfts.onSubmitNewCollection_fail')}`)
  }
  const existNfts= genesisStore.getList.find((item)=>item.name == createCollectionform.name)
  try {
    //
    if(existNfts?.collectionPinId){
     return ElMessage.error(`${i18n.t('Nfts.lanuch_existNfts')}`)
  }else{



    const metaData={
      royaltyRate:createCollectionform.royaltyRate,
      classify:createCollectionform.classify
    }

    const preMint = await mintNftEntity({
    body:{
      name:createCollectionform.name,
      totalSupply:createCollectionform.totalSupply,
      //royaltyRate:createCollectionform.royaltyRate,
      desc:createCollectionform.desc,
      website:createCollectionform.website,
      //classify:createCollectionform.classify,
      cover:'',
      metadata:metaData
    },
    attachments:[createCollectionform.originFile],
    lockAddress:'',
    noBroadcast:true
  })

  if(preMint!.isPay){
    if(preMint!.txFee > 0){

    const mvcBalance= await window.metaidwallet.getMvcBalance()

    if(Number(mvcBalance.total) < preMint!.txFee ){
      return ElMessage.error(`${i18n.t('Nts.mvc_balance_noenough')},${i18n.t('Nts.mvc_balance_need')} ${new Decimal(totalFee).div(10**8).toNumber()} Space`)
    }
    const mvcTransfer=await window.metaidwallet.transfer({
  tasks:[
    {
      receivers:[
        {
          address:preMint!.receiverAddress,
          amount:preMint!.txFee
        }
      ]
    }
  ]
})

if(mvcTransfer?.status == "canceled"){
        return ElMessage.error(`${i18n.t('Nfts.lanuch_sign_tx_fail')}`)
      }

      if(!mvcTransfer.txids.length){

        return ElMessage.error(`${i18n.t(`Nfts.pay_file_fail`)}`)
        }

        const {createCollectionDescRes,coverPinId} = await mintNftEntity({
    body:{
      name:createCollectionform.name,
      totalSupply:createCollectionform.totalSupply,
      //royaltyRate:createCollectionform.royaltyRate,
      desc:createCollectionform.desc,
      website:createCollectionform.website,
      //classify:createCollectionform.classify,
      cover:'',
      metadata:metaData
    },
    attachments:[createCollectionform.originFile],
    lockAddress:preMint!.receiverAddress,
    noBroadcast:false
  })

  if( createCollectionDescRes?.revealTxIds.length){
    const collectionPinid=`${createCollectionDescRes.revealTxIds[0]}i0`
    const genesisRes= await genesisCollect({
        collectionPinid:collectionPinid,
        collectionName:createCollectionform.name,
        address:connectionStore.last.user.address
      })

      if(genesisRes.code !== 200){
        return ElMessage.error(genesisRes.msg)
      }
      console.log("genesisRes",genesisRes)

      const collectionInfo={
        name:createCollectionform.name,
        coverPinid:coverPinId,
        desc:`${createCollectionform.desc}`,
        website:createCollectionform.website,
        metaData:JSON.stringify(metaData),
        classify:JSON.stringify(createCollectionform.classify),
        totalSupply:createCollectionform.totalSupply,
        chain:createCollectionform.chain ,
        autoMarket:createCollectionform.autoMakeMarket,
        initialPrice:toSats(createCollectionform.initialPrice),
        priceGrowth:toSats(createCollectionform.priceGrowth),
        royaltyRate:createCollectionform.royaltyRate,
        collectionPinId:collectionPinid,
        metaId:connectionStore.last.metaid,
        address:connectionStore.last.user.address,

      }


      const issueRes=await issueCollection({
        collectionInfo
      })
      if(issueRes.code == 200){
        console.log("issueRes",issueRes)

      genesisStore.add({
    totalSupply: +createCollectionform.totalSupply,
    coverPinid:coverPinId,
    name: createCollectionform.name,
    desc: createCollectionform.desc,
    cover: createCollectionform.cover,
    website: createCollectionform.website,
    metaData: metaData,
    royaltyRate: +createCollectionform.royaltyRate,
    chain:
      createCollectionform.chain == 'btc' ? NftsLaunchPadChainSymbol.btc : NftsLaunchPadChainSymbol.mvc,
    collectionPinId: `${collectionPinid}`,
    minted:0,
    currentSupply:0,
    classify:createCollectionform.classify,
    autoMarket: createCollectionform.autoMakeMarket,
    genesisTimestamp: Date.now(),
    metaId: connectionStore.last.metaid,
    initialPrice:toSats(createCollectionform.initialPrice),
    priceGrowth:toSats(createCollectionform.priceGrowth),
  })
  toNftsDetail(`${collectionPinid}`)
}

  }



  }
  }else{
    return ElMessage.error(`${i18n.t('Nfts.lanuch_sign_tx_fail')}`)
  }
  }
  } catch (error) {

    ElMessage.error((error as any).toString())
  }



}

function toNftsDetail(pinid:string){
  router.push({name:'nftsCollection',params: {
      pinid
    }})
}

function removeCollectionCover(e: any) {
  e.stopPropagation()
  if (createCollectionform.cover) {
    createCollectionform.cover = ''
    createCollectionform.coverHex = ''
  } else return
}

const beforeAvatarUpload:UploadProps['beforeUpload'] = async (rawFile) => {
  if (!fileType.includes(rawFile.type)) {
    ElMessage.error('Avatar picture must be JPG/PNG/GIF/WEBP format!')
    return false
  } else if (rawFile.size / 1024 / 1024 > 1) {
    ElMessage.error('Avatar picture size can not exceed 1MB!')
    return false
  }
  const compressed = await compressImage(rawFile)
  const result = await FileToAttachmentItem(compressed, 0, true)
  createCollectionform.cover = result.base64!
  createCollectionform.originFile = result

  return true
}

getCollectionData()
</script>

<style scoped src="./collection.scss"></style>
