<template>
    <slot></slot>
</template>
  
<script setup lang='ts'>
import { computed, provide, watch } from 'vue';
import { FullToken } from './interface';
import { tokenInjectKey } from './token';

const props = withDefaults(defineProps<{
    token?:FullToken
}>(),{})
watch(()=>props.token,()=>{
    console.log('token changed');
    provide(tokenInjectKey,computed(()=>props.token!))
},{deep:true})
</script>