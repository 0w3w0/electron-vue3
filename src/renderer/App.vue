<script setup lang="ts">
import Button from "@/renderer/components/Button.vue";

const changeTheme = (themeName:string) => {
  const html = document.querySelector('html')
  if (!html) return
  html.setAttribute('data-theme', themeName)
}

</script>

<template>
  <div class="container">
   <div class="no-drag">
     <Button @click="changeTheme('dark')">黑色主题</Button>
     <Button @click="changeTheme('light')">白色主题</Button>
     <Button @click="changeTheme('custom')">自定义主题</Button>
   </div>
  </div>
</template>

<style  lang="scss">
@use "./styles/themes/mixins";
@use "./styles/themes/variables";
@use "./styles/components/button";

button + button {
  margin-left: 1em;
}

.no-drag {
  -webkit-app-region: no-drag;
}

.container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  transition: background-color 1s;
  -webkit-app-region: drag;
  @include mixins.bg-color(variables.$colorBaseBackground);
  @include mixins.font-color(variables.$colorFont);
}

.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}

.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}

.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
