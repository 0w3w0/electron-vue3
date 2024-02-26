<script setup lang="ts">
import { useToken } from '@renderer/theme';
import { useMainStyle, useTheme } from './style';
import { updateStyle } from 'cinjs';
const mainStyle = useMainStyle();
const token = useToken();

const onClick = (event: MouseEvent) => {
  const x = event.clientX;
  const y = event.clientY;
  const endRadius = Math.hypot(
    Math.max(x, innerWidth - x),
    Math.max(y, innerHeight - y),
  );
  useTheme(x, y, endRadius, (theme) => {
    if (theme === 'dark') {
      token.value.background = '#000';
    } else {
      token.value.background = '#fff';
    }
    updateStyle();
  });
};
</script>

<template>
  <div :class="mainStyle">
    <button @click="onClick" class="btn">Theme</button>
  </div>
</template>

<style lang="scss">
.btn {
  position: absolute;
  bottom: 20px;
  right: 20px;
  -webkit-app-region: no-drag;
}
</style>
