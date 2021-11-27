<template>
  <div class="spinner-wrapper" v-if="!formattedBlogs.length">
    <div class="spinner spinner-large"></div>
  </div>
  <div
    v-else
    id="user-places"
    class="places-container custom-scroll"
    ref="scrollUserRef"
  >
    <div
      v-for="blog in formattedBlogs"
      :key="blog.id"
      :ref="
        (el) => {
          lists[blog.id] = el;
        }
      "
    >
      <Place :blog="blog" />
    </div>
  </div>
</template>

<script>
import { state, hasActiveBlog } from "./state.js";
import { scrollUserRef, handleScrolling } from "./scrolling";
import Place from "./Place.vue";
import {
  computed,
  ref,
  watch,
  onActivated,
  onDeactivated,
  nextTick,
} from "vue";
import { useMapMethods } from "../map/useMap";
import store from "@/store";
import { formatDistanceToNow, format } from "date-fns";

export default {
  components: { Place },
  setup() {
    //get reference the elements in DOM
    const lists = ref({});

    const isActive = ref(false);

    const { flyTo, createPopup, togglePins } = useMapMethods();

    onActivated(() => {
      togglePins("user");
      isActive.value = true;
    });

    onDeactivated(() => {
      isActive.value = false;
    });

    watch(
      () => state.activeBlog,
      (activeBlog) => {
        if (isActive.value && hasActiveBlog.value && !state.createdJustNow) {
          const target = lists.value[activeBlog.id];

          flyTo(activeBlog.coords);
          createPopup(activeBlog);

          //Use nextTick to make sure the tab has been switched back first before handling scrolling
          nextTick(() => {
            handleScrolling(target, "UserPlaceList");
          });
        }
      },
      { deep: true }
    );

    const formattedBlogs = computed(() => {
      if (store.userBlogs.value) {
        return store.userBlogs.value.map((doc) => {
          let time = formatDistanceToNow(doc.createdAt.toDate(), {
            addSuffix: true,
          });
          let fullDate = format(doc.createdAt.toDate(), "dd MMMM, yyyy");
          return { ...doc, createdAt: time, fullDate: fullDate };
        });
      }
    });

    return { scrollUserRef, formattedBlogs, lists };
  },
};
</script>

<style>
</style>