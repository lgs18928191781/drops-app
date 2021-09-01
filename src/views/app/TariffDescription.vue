<template>
    <div class="tab">
        <a v-for="(tab, index) in tabs" :key="index" :class="{ 'active': tabIndex === index }" @click="changeTab(index)">{{tab.name}}</a>
    </div>
    <div class="tab-cont">
        <template v-if="tabIndex === 0">
        关于NFTonShow的收费 <br />
        
        概要App MetaID:<br />
        登录账号：nos@showpay.io<br />
        项目主Email：nos@showpay.io<br />
        项目收款地址：<br />
        16tp7PhBjvYpHcv53AXkHYHTynmy6xQnxy<br />
        业务收费销售：平台费用：销售价格的5%<br />
        说明：<br />
        卖方收入：卖方所设定的价格，比如设定销售价格是1bsv，那么卖方在NFT成交后收入就是1bsv<br />
        NOS方收入：卖房设定价格的5%，比如NFT设定的销售价格是1bsv，那么NOS方收入就是0.05bsv<br />
        买家支出：NFT销售价格+NOS平台费用+矿工手续费。比如NFT定价是1BSV，手续费是 0.0002bsv，NOS手续费0.05，那么买家支出1.0502bsv<br />

        上架：平台费用：1万聪<br />
        说明：<br />
        前提：NFT的上架（nft sell）手续费为1万聪左右。如果这个费用有比较大变化，则我们的上架费用也需要相应变化<br />
        用户上架总费用为矿工费+1万聪<br />

        下架：平台费用：1万聪<br />
        说明：<br />
        一般下架的矿工费为2万聪左右，则用户总下架费用为矿工费+1万聪<br />

        铸造：平台费用：1万聪<br />
        条件：用户持有1万MC方可铸造（暂时条件）<br />
        说明：<br />
        一般NFT铸造费用为2-4万聪，则用户需支付约3-5万聪给平台<br />

    </template>
    </div>
    <!-- <div class="list-wap">
        <div class="title">{{ $t('protocolUsed ')}}</div>
        <div class="list">

        </div>
    </div> -->
</template>
<script setup lang="ts">
import { ref } from "vue";

const tabs = [
    { name: '收费说明' },
    { name: '收入说明' }
]
const tabIndex = ref(0)

function changeTab (index: number) {
    if (tabIndex.value === index) return
    tabIndex.value = index
}
</script>
<style lang="scss" scoped src="./TariffDescription.scss"></style>