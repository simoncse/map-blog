<template>
  <Navbar />
  <div class="content">
    <router-view />
  </div>
</template>

<script>
import Navbar from "./components/Navbar.vue";
export default {
  components: { Navbar },
  setup() {},
};
</script>


<style>
.content {
  overflow: hidden;
}

#app {
  width: 100vw;
  height: 100%;
  display: grid;
  grid-template-rows: 50px 1fr;
}

html {
  scroll-behavior: smooth;
}

html:focus-within {
  scroll-behavior: smooth;
}
</style>
