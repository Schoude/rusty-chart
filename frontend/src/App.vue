<script setup lang="ts">
import TheNav from '@/layout/TheNav.vue';
</script>

<template>
  <TheNav />
  <main>
    <RouterView />
  </main>
</template>

<style>
*,
*::before,
*::after {
  box-sizing: border-box;
}

html {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #e9e9e9;
}

body {
  margin: 0;
}

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

button {
  background-color: #e9e9e9;
  font: inherit;
  color: #333;
  border: none;
  border-radius: 4px;
  padding: 0.5em 1em;
  cursor: pointer;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}

main {
  padding: 0 1rem 3rem;
}
</style>
