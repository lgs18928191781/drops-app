<template>
    <div class="tariff-description">
        <div class="title">NFTonShow资费说明</div>

        <div class="tariff-description-section">
            <div class="tariff-description-title">业务收费销售</div>
            <div class="type">平台费用：<span>销售价格的5%</span></div>
            <div class="drsc">
                <div class="drsc-title">说明:</div>
                <div class="drsc-cont">
                    卖方收入：卖方所设定的价格，比如设定销售价格是1bsv，那么卖方在NFT成交后收入就是1bsv； NOS方收入：卖方设定价格的5%，比如NFT设定的销售价格是1bsv，那么NOS方收入就是0.05bsv； 买家支出：NFT销售价格+NOS平台费用+矿工手续费。比如NFT定价是1BSV，手续费是 0.0002bsv，NOS手续费 0.05，那么买家支出1.0502bsv。
                </div>
            </div>
        </div>

        <div class="tariff-description-section">
            <div class="tariff-description-title">上架</div>
            <div class="type">平台费用：<span>10,000 sat</span></div>
            <div class="drsc">
                <div class="drsc-title">说明:</div>
                <div class="drsc-cont">前提：NFT的上架 (nft sell) 手续费为10,000 sat左右。如果这个费用有比较大变化，则我们的上架费用也需要相应变化；
                    用户上架总费用为：矿工费+10,000 sat。
                </div>
            </div>
        </div>

        <div class="tariff-description-section">
            <div class="tariff-description-title">下架</div>
            <div class="type">平台费用：<span>10,000 sat</span></div>
            <div class="drsc">
                <div class="drsc-title">说明:</div>
                <div class="drsc-cont">
                    一般下架的矿工费为2万聪左右，则用户总下架费用为矿工费+10,000 sat。
                </div>
            </div>
        </div>

        <div class="tariff-description-section">
            <div class="tariff-description-title">铸造</div>
            <div class="type">平台费用：<span>10,000 sat</span></div>
            <div class="drsc">
                <div class="drsc-title">说明:</div>
                <div class="drsc-cont">
                    铸造功能开放条件（暂时条件）：用户的MC持有量≥50,000；说明：一般NFT铸造费用为2～4万聪，则用户需支付铸造费用和平台费用共约3～5万聪给平台。
                </div>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import { ref } from "vue";
import { useI18n } from "vue-i18n";

const i18n = useI18n()
const tabs = [
    { key: 'chargeDescription' },
    // { key: 'incomeStatement' }
]
const tabIndex = ref(0)

function changeTab (index: number) {
    if (tabIndex.value === index) return
    tabIndex.value = index
}
</script>
<style lang="scss" scoped src="./TariffDescription.scss"></style>