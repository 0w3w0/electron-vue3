<script setup lang="ts">
import { useButtonStyles } from './style';

const styles = useButtonStyles();
</script>

<template>
  <button :class="[styles.classHash,styles.button]">
    <slot />
  </button>
</template>