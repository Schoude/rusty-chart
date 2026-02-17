<script lang="ts">
import { defineColadaLoader } from 'vue-router/experimental/pinia-colada';

export const useCommentsLoader = defineColadaLoader('comments', {
  async query(to, { signal }) {
    return fetch(`https://jsonplaceholder.typicode.com/comments?postId=${to.params.id}`, { signal }).then((res) =>
      res.json(),
    );
  },
  key: (to) => ['comments', to.params.id],
});
</script>

<script setup lang="ts">
const { isLoading, data, refetch } = useCommentsLoader();
</script>

<template>
  <h1>The Comments</h1>
  <p v-if="isLoading">Loading comments</p>
  <pre v-else>{{ data }}</pre>

  <button @click="() => refetch()">Reload</button>
</template>
