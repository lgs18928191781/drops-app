<template>
    <div class="create flex">
        <img class="icon" src="@/assets/images/bannet_icon_ins.svg" />
        <div class="cont-warp flex1">
            <div class="title">铸造NFT</div>
            <div class="tips">
                完善NFT作品信息，不仅能让您的NFT作品更容易被发现，还有机会为它增加额外价值。<br />NFT铸造完成后，作品信息公开透明，不可篡改。
            </div>
            <div class="upload-warp">
                <div class="upload">
                    <div class="add flex flex-align-center flex-pack-center">
                        <div>
                            <img src="@/assets/images/img_upload.svg" />
                            <div class="label">上传NFT封面图</div>
                        </div>
                        <input type="file" accept="image/gif, image/jpeg" />
                    </div>
                </div>
            </div>
            <div class="input-item name">
                <input placeholder="请输入NFT作品名称" />
            </div>
            <div class="input-item drsc">
                <textarea placeholder="请输入NFT作品描述"></textarea>
            </div>
            <div class="tags">
                <a class="add">选择分类</a>
            </div>
            <div class="btn btn-block">确认铸造</div>
        </div>
    </div>

    <div class="my-nft">
        <div class="section container">
            <div class="section-header flex flex-align-center">
                <div class="title flex1">我的NFT</div>
                <a class="btn">开始铸造<img class="icon-right" src="@/assets/images/bannet_icon_ins_right.svg" /></a>
            </div>
            <div class="section-cont nft-list">
                <template v-for="item in Array.from({length: 4})">
                    <NftItem />
                </template>
            </div>
        </div>
    </div>

    <!-- nft 详情modal -->
    <ElDialog
    v-model="dialogVisible">
    <div class="nft-msg">
        <div class="nft-msg-main flex">
            <div class="cover">
                <img src="" />
                <a class="tag">艺术</a>
            </div>
            <div class="cont flex1">
                <div class="name">Saint Sophia</div>
                <div class="author flex flex-align-center">
                    <img class="avatar" />
                    <div class="author-msg flex1">
                        <div class="creater">铸造者: 范特西</div>
                        <div class="metaid">MetaID:34c5em</div>
                    </div>
                </div>
                <div class="drsc">
                        Outside the spring mountains, the master-disciple the crowd, outing in late spring, preaching and teaching karma to solve puzzles. 画意：春山外，春衫短。夫子徒众，暮春踏青，传道授业解惑者也。
                </div>
            </div>
        </div>
        <div class="nft-msg-other">
            <div class="nft-msg-other-item">
                <div class="key">合约地址</div>
                <div class="value">0x1dDB2C0897daF18632662E71fdD2dbDC0eB3a9Ec</div>
            </div>
            <div class="nft-msg-other-item">
                <div class="key">TokenID</div>
                <div class="value">0x1dDB2C0897daF18632662E71fdD2dbDC0eB3a9Ec</div>
            </div>
        </div>
        <div class="btn btn-block">上架出售</div>
    </div>
    </ElDialog>

    <!-- nft 上架设置modal -->
    <ElDialog
    v-model="isShowSetModal">
    <div class="nft-sale-set">
        <div class="msg flex flex-align-center">
            <img class="cover" alt="" />
            <div class="name flex1">Saint Sophia</div>
        </div>
        <div class="form">
            <div class="form-item">
                <div class="title">价格</div>
                <div class="cont flex flex-align-center">
                    <input placeholder="设置NFT的价格" type="number" class="flex1" />
                    <div class="type">
                        <ElDropdown trigger="click">
                            <span class="flex flex-align-center">
                                BSV <span class="arrow"></span>
                            </span>
                            <template #dropdown>
                                <el-dropdown-menu>
                                    <el-dropdown-item>BSV</el-dropdown-item>
                                    <el-dropdown-item>狮子头</el-dropdown-item>
                                </el-dropdown-menu>
                            </template>
                        </ElDropdown>
                    </div>
                </div>
            </div>
            <div class="form-item">
                <div class="title">时间</div>
                <div class="cont flex flex-align-center">
                    <input placeholder="选择NFT上架结束时间" type="datetime" class="flex1" />
                    <img class="icon" src="@/assets/images/list_icon_calendar.svg" />
                    <ElDatePicker class="el-datetime"
                            v-model="value1"
                            :editable="false"
                            type="datetime"
                            placeholder="选择日期时间">
                    </ElDatePicker>
                </div>
            </div>
        </div>
        <div class="btn btn-block">确认上架</div>
    </div>
    </ElDialog>
</template>
<script setup lang="ts">
import { ElDialog, ElDropdown, ElDropdownItem, ElDropdownMenu, ElDatePicker } from 'element-plus'
import NftItem from '@/components/Nft-item/Nft-item.vue'
const dialogVisible = false
const isShowSetModal = true
</script>
<style lang="scss" scoped src="./Create.scss"></style>