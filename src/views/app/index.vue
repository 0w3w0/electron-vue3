<script setup lang="ts">
import { ref } from 'vue';
import { cssinjs } from '@/theme';
import { useAppStyle, useTheme } from './style';
import Button from '@/components/button/Button.vue';

const btnLabel = ref('D');
const styles = useAppStyle();
const themeToken = cssinjs.theme;
const onClick = (event: MouseEvent) => {
  window.electronAPI.testIPC();
  const ele = event.target as HTMLElement;
  const rect = ele.getBoundingClientRect();
  const x = rect.left + rect.width / 2;
  const y = rect.top + rect.height / 2;
  const endRadius = Math.hypot(
    Math.max(x, innerWidth - x),
    Math.max(y, innerHeight - y),
  );
  useTheme(x, y, endRadius, (theme) => {
    if (theme === 'dark') {
      btnLabel.value = 'L';
      themeToken.background = '#000';
    } else {
      btnLabel.value = 'D';
      themeToken.background = '#fff';
    }
    cssinjs.updateTheme(themeToken);
  });
};
</script>

<template>
  <div :class="[styles.classHash, styles.wrapper]">
    <Button class="btn" @click="onClick">{{ btnLabel }}</Button>
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
