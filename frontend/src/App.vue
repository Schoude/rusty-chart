<script setup lang="ts">
import TheNav from '@/layout/TheNav.vue';
import { PiniaColadaDevtools } from '@pinia/colada-devtools';
</script>

<template>
  <TheNav />
  <main>
    <RouterView />
  </main>

  <PiniaColadaDevtools />
</template>

<style>
.container {
  max-inline-size: 90dvw;
  margin: auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
}

.button-group {
  display: flex;
  justify-content: center;
  gap: 1em;
  margin-bottom: 1em;
}

main {
  padding: 0 1rem 3rem;
}
</style>
