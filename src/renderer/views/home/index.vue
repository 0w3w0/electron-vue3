<script setup lang="ts">
import { updateStyle } from '@libs/jss/core';
import { getHomeStyle } from './style';
import { useToken } from '@renderer/theme';
const css = getHomeStyle();
console.log(css);
const token = useToken();
const change = () => {
  token.value.primary = 'blue';
  updateStyle()
}
</script>

<template>
  <div :class="css"> 
    <div class="no-drag">
      <button @click="change">change</button>
    </div>
  </div>
</template>

<style scoped lang="scss">
button + button {
  margin-left: 1em;
}

.no-drag {
  -webkit-app-region: no-drag;
}

// .container {
//   display: flex;
//   justify-content: center;
//   align-items: center;
//   height: 100vh;
//   transition: background-color 1s;
//   -webkit-app-region: drag;
// }
</style>
