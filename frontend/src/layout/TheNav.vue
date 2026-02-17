<script setup lang="ts">
import { Button } from '@/components/ui/button';
</script>
<template>
  <nav class="h-10 border-b-2 border-zinc-400">
    <ul class="flex">
      <li>
        <Button variant="link" as-child>
          <RouterLink :to="{ name: 'home' }">Home</RouterLink>
        </Button>
      </li>
      <li>
        <Button variant="link" as-child>
          <RouterLink :to="{ name: 'comments', params: { id: 1 } }">Comments</RouterLink>
        </Button>
      </li>
    </ul>
  </nav>
</template>

<style scoped>
.router-link-exact-active {
  text-decoration: underline;
}
</style>
