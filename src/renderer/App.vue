<script setup lang="ts">
const changeTheme = (themeName:string) => {
  const html = document.querySelector('html')
  if (!html) return
  const theme = html.getAttribute('data-theme')
  if (theme === 'dark') {
    html.setAttribute('data-theme', themeName)
  } else {
    html.setAttribute('data-theme', themeName)
  }
}


</script>

<template>
  <div class="container">
    <button @click="changeTheme('dark')" class="app-button">黑色主题</button>
    <button @click="changeTheme('light')" class="app-button">白色主题</button>
    <button @click="changeTheme('custom')" class="app-button">自定义主题</button>
  </div>
</template>

<style  lang="scss">
@use "./styles/themes/mixins";
@use "./styles/themes/variables";
@use "./styles/components/button";

button + button {
  margin-left: 1em;
}

.container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  transition: background-color 1s;
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
