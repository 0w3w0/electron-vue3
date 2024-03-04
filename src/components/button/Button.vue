<script setup lang="ts">
import { useButtonStyles } from './style';

const styles = useButtonStyles();
</script>

<template>
  <button :class="styles.button">
    <slot />
  </button>
</template>