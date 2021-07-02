<template>
    <div class="nft-detail">
        <div class="container">
            <div class="top flex">
                <img class="cover" alt="" />
                <div class="cont flex1 flex flex-v flex-pack-justify">
                    <div class="name">The Card of Unity</div>
                    <div class="count-down">
                        <div class="title">截止时间</div>
                        <div class="count-down-list flex flex-align-center">
                            <div class="count-down-item">
                                <div class="num">20</div>
                                <div class="label">天</div>
                            </div>
                            <div class="count-down-item">
                                <div class="num">20</div>
                                <div class="label">时</div>
                            </div>
                            <div class="count-down-item">
                                <div class="num">20</div>
                                <div class="label">分</div>
                            </div>
                            <div class="count-down-item">
                                <div class="num">20</div>
                                <div class="label">秒</div>
                            </div>
                        </div>
                    </div>
                    <div class="price">
                        <div class="title">价格</div>
                        <div class="amount">0.355 BSV</div>
                        <div class="btn btn-block">购买</div>
                    </div>
                </div>
            </div>

            <div class="bottom flex">
                <div class="left">
                    <div class="tags">
                        <a>艺术</a>
                    </div>
                    <div class="drsc">
                        <div class="title">描述</div>
                        <div class="cont">
                            Outside the spring mountains, the master-disciple the crowd, outing in late spring, preaching and teaching karma to solve puzzles. 画意：春山外，春衫短。夫子徒众，暮春踏青，传道授业解惑者也。
                        </div>
                    </div>
                    <div class="author flex flex-align-center">
                        <img class="avatar" />
                        <div class="author-msg flex1">
                            <div class="creater">铸造者: 范特西</div>
                            <div class="metaid">MetaID:34c5em</div>
                        </div>
                    </div>

                    <div class="nft-info">
                        <div class="nft-info-item">
                            <div class="key">合约地址</div>
                            <div class="value">0x1dDB2C0897daF18632662E71fdD2dbDC0eB3a9Ec</div>
                        </div>
                        <div class="nft-info-item">
                            <div class="key">TokenID</div>
                            <div class="value">100300002424</div>
                        </div>
                    </div>
                </div>
                <div class="right flex1">
                    <div class="tab">
                        <a class="active">记录</a>
                        <a>更多</a>
                    </div>
                    <div class="tab-cont">
                        <!-- 记录 -->
                        <div class="record">
                            <div class="record-item author flex flex-align-center">
                                <img class="avatar" />
                                <div class="author-msg flex1">
                                    <div class="creater">铸造者: 范特西</div>
                                    <div class="metaid">MetaID:34c5em</div>
                                </div>
                            </div>
                            <div class="record-item author flex flex-align-center">
                                <img class="avatar" />
                                <div class="author-msg flex1">
                                    <div class="creater">铸造者: 范特西</div>
                                    <div class="metaid">MetaID:34c5em</div>
                                </div>
                            </div>
                            <div class="record-item author flex flex-align-center">
                                <img class="avatar" />
                                <div class="author-msg flex1">
                                    <div class="creater">铸造者: 范特西</div>
                                    <div class="metaid">MetaID:34c5em</div>
                                </div>
                            </div>
                            <div class="record-item author flex flex-align-center">
                                <img class="avatar" />
                                <div class="author-msg flex1">
                                    <div class="creater">铸造者: 范特西</div>
                                    <div class="metaid">MetaID:34c5em</div>
                                </div>
                            </div>
                        </div>
                        <!-- 更多 -->
                        <div class="more-info">
                            <div class="more-info-item">
                                <div class="key">类型</div>
                                <div class="value">300万字节 文章</div>
                            </div>
                            <div class="more-info-item">
                                <div class="key">NFT历史营收</div>
                                <div class="value">0.26002475 BSV</div>
                            </div>
                            <div class="link">
                                <a>点此查看文章部分内容</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import NftItem from '@/components/Nft-item/Nft-item.vue'
</script>
<style lang="scss" scoped src="./Detail.scss"></style>