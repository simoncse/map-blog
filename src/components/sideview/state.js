import { reactive, ref, computed, nextTick } from "vue";
import { scrollBackTop } from "./scrolling";

export const activeTab = ref("PlaceList");

export const state = reactive({
  activeBlog: {
    id: null,
    coords: null,
    address: null,
  },
  createdJustNow: false,
});

export const setActiveTab = (tab, flag) => {
  console.log("switch to", tab)

  state.createdJustNow = false;

  if (flag === "created") {
    state.createdJustNow = true;
  }
  activeTab.value = tab

}

export const setActiveBlog = ({ id, coords, address }, source) => {
  if (activeTab.value === "AddForm") {
    activeTab.value = "PlaceList"
  }

  nextTick(() => {
    state.activeBlog.id = id;
    state.activeBlog.coords = coords;
    state.activeBlog.address = address;
  })

  if (source === "map") {
    state.createdJustNow = false;
  }

}

const scrollTopHandle = () => {
  //check the current active tab first;
  if (activeTab.value === "PlaceList") {
    scrollBackTop('default');
  }
  if (activeTab.value === "UserPlaceList") {
    scrollBackTop('user')
  }
}

export const clearActiveBlog = (flag) => {
  state.activeBlog.id = null;
  state.activeBlog.coords = null;
  state.activeBlog.address = null;

  if (flag === 'delete') {
    return scrollTopHandle;
  }

}

export const hasActiveBlog = computed(() => {
  return state.activeBlog.id && state.activeBlog.address && state.activeBlog.coords;
})

export const checkActive = (id) => {
  return id === state.activeBlog.id;
}

















