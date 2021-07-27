<template>
  <div class="picker-modal" v-if="visible">
    <div class="picker-modal-header flex flex-align-center">
      <div class="title flex1">{{props.title}}<span v-if="multiple">({{ $t('multiple') }})</span></div>
      <a @click.stop="confirm">{{ $t('confirm') }}</a>
    </div>
    <div class="picker-model-body">
      <div class="picker-model-list" v-if="props.list.length > 0">
        <div class="picker-model-item flex flex-align-center" v-for="(item, index) in props.list" :key="item.toString()" @click="itemClick(props.listKey ? item[props.listKey] : item)">
          <div class="label flex1">
            {{ props.name ? item[props.name] : item }}
            <slot name="item" v-bind:item="item"></slot>
          </div>
          <div class="icon">
            <img class="secected" src="@/assets/images/pop_icon_hook.svg" v-if="isSellected(props.listKey ? item[props.listKey] : item)" />
          </div>
        </div>
      </div>
      <div class="null" v-else>{{ $t('null') }}</div>
      <slot name="bottom"></slot>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { defineProps, defineEmit, computed, onMounted } from "vue";

const props = defineProps<{
  visible: boolean,
  list: any,
  name?: string,
  listKey?: string,
  selecteds: any [],
  multiple?: boolean,
  title: string
}>()

const emit = defineEmit(['confirm'])

function confirm() {
    emit('confirm')
}

function isSellected (item:any) {
  return props.selecteds.find((_item:any) => _item === item)
}

function itemClick (item: any) {
    let index
    index = props.selecteds.findIndex((_item:any) => _item === item)
    if (index === -1) {
        if (!props.multiple) {
            props.selecteds.length = 0
        }
        props.selecteds.push(item)
        
    } else {
        props.selecteds.splice(index, 1)
    }
}

onMounted(() => {
    // console.log('onMounted')
    // window.addEventListener('click', () => {
    //     if (props.visible) confirm()
    // })
})
</script>
<style lang="scss" scoped src="./PickerModel.scss"></style>
