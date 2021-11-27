<template>
  <div v-if="!formattedBlogs.length" class="spinner-wrapper">
    <div class="spinner spinner-large"></div>
  </div>
  <div v-else class="places-container custom-scroll" ref="scrollRef">
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
import { state, setActiveBlog, hasActiveBlog } from "./state.js";
import { handleScrolling, scrollRef, scrollBackTop } from "./scrolling";
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
      togglePins("all");
      isActive.value = true;
    });

    onDeactivated(() => {
      isActive.value = false;
    });

    // Track active blog and trigger map flyto method, this also handle the User Placelist component. There is possible a better way to do this

    watch(store.blogs, (blogs) => {
      console.log("blog updated");
      if (state.createdJustNow) {
        console.log("New blog created.");
        const { id, coords, address } = store.methods.findLatestBlog(blogs);
        console.log(id, coords, address);
        setActiveBlog({ id, coords, address });
        createPopup({ coords, address });
      }
    });

    watch(
      () => state.activeBlog,
      (activeBlog) => {
        if (isActive.value && hasActiveBlog.value && !state.createdJustNow) {
          console.log("deteced from PlaceList");
          const target = lists.value[activeBlog.id];
          console.log(lists.value);
          flyTo(activeBlog.coords);
          createPopup(activeBlog);

          //Use nextTick to make sure the tab has been switched back first before handling scrolling
          nextTick(() => {
            console.log("start scrolling");
            handleScrolling(target);
          });
        }
      },
      { deep: true }
    );

    const formattedBlogs = computed(() => {
      if (store.blogs.value) {
        return store.blogs.value.map((doc) => {
          let time = formatDistanceToNow(doc.createdAt.toDate(), {
            addSuffix: true,
          });
          let fullDate = format(doc.createdAt.toDate(), "dd MMMM, yyyy");
          return { ...doc, createdAt: time, fullDate: fullDate };
        });
      }
    });

    return { formattedBlogs, lists, scrollRef };
  },
};
</script>

<style>
.spinner-wrapper {
  height: 100%;
  display: grid;
  place-items: center;
}

.places-container {
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-columns: 100%;
  overflow-y: auto;
  scroll-behavior: smooth;
}

.places-container > * {
  border-bottom: 1px solid rgb(153, 153, 153);
}

.btn-test {
  position: fixed;
  top: 0;
  left: 30%;
  z-index: 100;
  background: blue;
  color: white;
}
</style>