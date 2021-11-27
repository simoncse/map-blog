<template>
  <div class="notFound">
    <h2>404</h2>
    <h3>Page Not Found.</h3>
    <router-link class="link" :to="{ name: 'Home' }">Back to Home</router-link>
  </div>
</template>

<script>
export default {};
</script>

<style>
.notFound {
  max-width: 400px;
  margin: 60px auto 0;
  display: grid;
  gap: 0.4rem;
}

.notFound a {
  margin-top: 1rem;
}

.link {
  text-decoration: underline;
}

.link:hover {
  color: black;
}
</style>