<template>
  <div class="sideview">
    <div class="sideview__nav">
      <button
        v-for="(tab, i) in tabs"
        :key="i"
        @click="handleClick(tab.view)"
        :class="{ active: activeTab == tab.view }"
      >
        {{ tab.name }}
      </button>
    </div>

    <div class="sideview__tab" ref="container">
      <keep-alive>
        <component :is="activeTab" />
      </keep-alive>
    </div>
  </div>
</template>

<script>
import AddForm from "./AddForm.vue";
import PlaceList from "./PlaceList.vue";
import UserPlaceList from "./UserPlaceList.vue";
import { computed, onMounted } from "vue";
import { activeTab, setActiveTab } from "./state";
import getUser from "@/composables/getUser";
import { viewableArea, container } from "./scrolling";
export default {
  components: { AddForm, PlaceList, UserPlaceList },
  setup() {
    const { user } = getUser();

    onMounted(() => {
      const { top, bottom } = container.value.getBoundingClientRect();
      viewableArea.height = container.value.clientHeight;
      viewableArea.top = top;
      viewableArea.bottom = bottom;
    });

    const tabs = computed(() => {
      if (user.value) {
        return [
          { name: "All Places", view: "PlaceList" },
          { name: "Your Places", view: "UserPlaceList" },
          { name: "Add", view: "AddForm" },
        ];
      } else {
        return [
          { name: "All Places", view: "PlaceList" },
          { name: "Add", view: "AddForm" },
        ];
      }
    });

    const handleClick = (tab) => {
      setActiveTab(tab);
    };

    return { activeTab, container, tabs, handleClick };
  },
};
</script>

<style>
.sideview {
  width: 300px;
  display: flex;
  flex-direction: column;
  padding: 10px 0 0;
  gap: 1.5rem;
  background: white;
  overflow: hidden;
  box-shadow: 2px 4px 6px rgba(28, 6, 49, 0.1);
}

.sideview__nav {
  padding: 0 10px;
}

.sideview__nav button {
  margin-right: 10px;
  border: none;
  background: none;
  border-radius: 0;
  margin-right: 1.4rem;
  padding-bottom: 3px;
  font-weight: 700;

  position: relative;
  cursor: pointer;
}

.sideview__nav button::after {
  content: "";
  position: absolute;
  background-color: rgb(226, 85, 61);
  height: 2.4px;
  width: 0;
  left: 0;
  bottom: -3px;
}

.sideview__nav button.active::after {
  width: 100%;
}

.sideview__tab {
  flex-grow: 1;
  overflow: hidden;
  position: relative;
}
</style>