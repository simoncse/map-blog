<template>
  <div class="home-view">
    <SideView v-if="true" />
    <Map />
    <transition name="slide">
      <Notifcation v-if="showN" />
    </transition>
  </div>
</template>

<script>
import Map from "../components/map/Map.vue";
import SideView from "../components/sideview/SideView.vue";
import Notifcation from "../components/notification/Notification.vue";
import { showN, toggleShowN } from "../components/notification/state";
import { onMounted } from "vue";
export default {
  components: { Map, SideView, Notifcation },
  setup() {
    onMounted(() => (document.title = "Map Blog | Home"));
    return { showN, toggleShowN };
  },
};
</script>

<style>
.home-view {
  height: 100%;
  display: grid;
  grid-template-columns: auto 1fr;
}

.test-btn {
  position: fixed;
}

.slide-enter-from,
.slide-leave-to {
  opacity: 0;
  transform: translateX(60px);
}

.slide-enter-active,
.slide-leave-active {
  transition: all 300ms ease;
}
</style>