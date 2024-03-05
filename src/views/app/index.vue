<script setup lang="ts">
import { cssinjs } from '@/theme';
import { useAppStyle, useTheme } from './style';
import Button from '@/components/button/Button.vue';

const styles = useAppStyle();
const themeToken = cssinjs.theme;
const onClick = (event: MouseEvent) => {
  const x = event.clientX;
  const y = event.clientY;
  const endRadius = Math.hypot(
    Math.max(x, innerWidth - x),
    Math.max(y, innerHeight - y),
  );
  useTheme(x, y, endRadius, (theme) => {
    if (theme === 'dark') {
      themeToken.background = '#000';
    } else {
      themeToken.background = '#fff';
    }
    cssinjs.updateTheme(themeToken);
  });
};
</script>

<template>
  <div :class="[styles.classHash,styles.wrapper]">
    <Button class="btn" @click="onClick">Theme</Button>
  </div>
</template>

<style>
.btn {
  position: absolute;
  bottom: 20px;
  right: 20px;
  -webkit-app-region: no-drag;
}
</style>
