<template>
  <div class="filter-warp">
    <ElCollapse accordion v-model="activeName" class="filter-list">
      <ElCollapseItem class="filter-item" :name="key.status">
        <template #title>
          <div class="filter-item-header flex flex-align-center flex1">
            <div class="label flex1">{{ $t('NFT.FilterItem.Status') }}:</div>
            <div class="sufix flex flex-align-center flex-pack-center">
              <Icon name="down" :class="[activeName === key.status ? 'top' : '']" />
            </div>
          </div>
        </template>
        <div class="fillter-item-content">
          <div class="button-list">
            <a
              class="main-border"
              v-for="(item, index) in sellTypes"
              :key="index"
              :class="{ primary: sellType === item.value }"
              @click="changeSellType(item.value)"
              >{{ item.name() }}</a
            >
          </div>
        </div>
      </ElCollapseItem>
      <ElCollapseItem class="filter-item" :name="key.price">
        <template #title>
          <div class="filter-item-header flex flex-align-center flex1">
            <div class="label flex1">{{ $t('NFT.FilterItem.Price') }}:</div>
            <div class="sufix flex flex-align-center flex-pack-center">
              <Icon name="down" :class="[activeName === key.price ? 'top' : '']" />
            </div>
          </div>
        </template>
        <div class="fillter-item-content">
          <div class="price-range flex flex-align-center">
            <div class="flex1">
              <ElInput
                type="number"
                :placeholder="$t('NFT.FilterItem.MinPrice')"
                v-model="curenntPriceRange[0]"
              />
            </div>
            <span>--</span>
            <div class="flex1">
              <ElInput
                type="number"
                :placeholder="$t('NFT.FilterItem.MaxPrice')"
                v-model="curenntPriceRange[1]"
              />
            </div>
          </div>
          <div class="main-border primary" @click="confirmPrice">{{ $t('Confirm') }}</div>
        </div>
      </ElCollapseItem>
    </ElCollapse>
  </div>
</template>

<script setup lang="ts">
import { NFTSellType } from '@/enum'
import { reactive, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'

interface Props {
  sellType: NFTSellType
  priceRange: [string, string]
}
const props = withDefaults(defineProps<Props>(), {})
const emit = defineEmits(['update:sellType', 'update:priceRange', 'change'])

const activeName = ref('')
const i18n = useI18n()
const curenntPriceRange = reactive([props.priceRange[0], props.priceRange[1]])

watch(
  () => props.priceRange,
  newVal => {
    curenntPriceRange[0] = newVal[0]
    curenntPriceRange[1] = newVal[1]
  }
)

const key = {
  status: 'status',
  price: 'price',
}

const sellTypes = [
  {
    name: () => i18n.t('NFT.SellType.All'),
    value: NFTSellType.All,
  },
  {
    name: () => i18n.t('NFT.SellType.Sale'),
    value: NFTSellType.SALE,
  },
  // {
  //   name: () => i18n.t('NFT.SellType.New On Sale'),
  //   value: NFTSellType.NEWSALE,
  // },
  {
    name: () => i18n.t('NFT.SellType.Off Sale'),
    value: NFTSellType.NONSALE,
  },
  // {
  //   name: () => i18n.t('NFT.SellType.Auction'),
  //   value: NFTSellType.AUCTION,
  // },
]

function changeSellType(type: NFTSellType) {
  if (props.sellType === type) return
  emit('update:sellType', type)
  emit('change', {
    sellType: type,
    priceRange: props.priceRange,
  })
}

function confirmPrice() {
  if (props.priceRange[0] === curenntPriceRange[0] && props.priceRange[1] === curenntPriceRange[1])
    return
  emit('update:priceRange', curenntPriceRange)
  emit('change', {
    sellType: props.sellType,
    priceRange: curenntPriceRange,
  })
}
</script>

<style lang="scss" scoped src="./CollectionFilterWarp.scss"></style>
