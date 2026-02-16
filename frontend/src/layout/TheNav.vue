<template>
  <nav>
    <ul>
      <li>
        <RouterLink :to="{ name: 'home' }">Home</RouterLink>
      </li>
      <li>
        <RouterLink :to="{ name: 'comments' }">Comments</RouterLink>
      </li>
    </ul>
  </nav>
</template>

<style scoped>
nav {
  border-block-end: 1px solid lightblue;
  padding: 1rem;
  margin-block-end: 1rem;
}

a {
  color: white;
  text-decoration: none;
}

ul {
  display: flex;
  gap: 1rem;
  list-style: none;
  padding: 0;
  margin: 0;
}

.router-link-exact-active {
  text-decoration: underline;
}
</style>
