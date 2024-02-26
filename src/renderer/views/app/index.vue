<script setup lang="ts">
import { useToken } from '@renderer/theme';
import { useMainStyle } from './style';
import { updateStyle } from 'cinjs';
const mainStyle = useMainStyle();
const token = useToken();
const setTheme = (theme: string) => {
  if (theme === 'dark') {
    token.value.background = '#000000';
  } else {
    token.value.background = '#ffffff';
  }
  updateStyle();
};
const onClick = (event: MouseEvent) => {
  const x = event.clientX;
  const y = event.clientY;
  const endRadius = Math.hypot(
    Math.max(x, innerWidth - x),
    Math.max(y, innerHeight - y),
  );
  let isDark: Boolean;
  // @ts-ignore
  const transition = document.startViewTransition(() => {
    const root = document.documentElement;
    isDark = root.classList.contains('dark');
    root.classList.remove(isDark ? 'dark' : 'light');
    root.classList.add(isDark ? 'light' : 'dark');
    if(!isDark){
      setTheme('dark')
    }else{
      setTheme('light')
    }
  });

  transition.ready.then(() => {
    const clipPath = [
      `circle(0px at ${x}px ${y}px)`,
      `circle(${endRadius}px at ${x}px ${y}px)`,
    ];
    document.documentElement.animate(
      {
        clipPath: isDark ? [...clipPath].reverse() : clipPath,
      },
      {
        duration: 450,
        easing: 'ease-in-out',
        pseudoElement: isDark
          ? '::view-transition-old(root)'
          : '::view-transition-new(root)',
      },
    );
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
