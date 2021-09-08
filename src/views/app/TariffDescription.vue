<template>
    <div class="tariff-description">
        <div class="title">NFTonShow {{$t('tariffDescription ')}}</div>

        <div class="tariff-description-section">
            <div class="tariff-description-title">{{$t('tariffDescription1title')}}</div>
            <div class="type">{{$t('platformFee')}}：<span>{{$t('tariffDescription1count')}}</span></div>
            <div class="drsc">
                <div class="drsc-title">{{$t('illustrate')}}:</div>
                <div class="drsc-cont">
                    {{ $t('tariffDescription1cont') }}
                </div>
            </div>
        </div>

        <div class="tariff-description-section">
            <div class="tariff-description-title">{{$t('tariffDescription2title')}}</div>
            <div class="type">{{$t('platformFee')}}：<span>10,000 sat</span></div>
            <div class="drsc">
                <div class="drsc-title">{{$t('illustrate')}}:</div>
                <div class="drsc-cont">
                    {{ $t('tariffDescription2cont') }}
                </div>
            </div>
        </div>

        <div class="tariff-description-section">
            <div class="tariff-description-title">{{$t('offsale')}}</div>
            <div class="type">{{$t('platformFee')}}：<span>10,000 sat</span></div>
            <div class="drsc">
                <div class="drsc-title">{{$t('illustrate')}}:</div>
                <div class="drsc-cont">
                    {{ $t('tariffDescription3cont') }}
                </div>
            </div>
        </div>

        <div class="tariff-description-section">
            <div class="tariff-description-title">{{$t('Casting')}}</div>
            <div class="type">{{$t('platformFee')}}：<span>10,000 sat</span></div>
            <div class="drsc">
                <div class="drsc-title">{{$t('illustrate')}}:</div>
                <div class="drsc-cont">
                    {{ $t('tariffDescription4cont') }}
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