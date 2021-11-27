<template>
  <div v-if="isPending">Loading...</div>
  <div v-else class="popup-info">
    <h4 v-if="address">{{ address }}</h4>
    <h4 v-else>No Location found.</h4>
    <button
      v-if="address"
      class="btn btn-outline"
      :class="{ reminder: !user }"
      @click="handleClick"
      :disabled="!user"
      data-tooltip="You must log in first in order to add a location"
    >
      Add
    </button>
  </div>
</template>

<script>
import getLocation from "./getLocation";
import { ref, watch } from "vue";
import store from "@/store";
import { setActiveTab } from "../sideview/state";
import getUser from "@/composables/getUser";

const props = {
  type: null,
  data: null,
};

export default {
  props,
  setup(props) {
    const address = ref(null);
    const isPending = ref(true);

    const { user } = getUser();

    if (props.type === "geocoder") {
      // console.log("from geocoder");
      address.value = props.data;
      isPending.value = false;
    }

    if (props.type === "clickOnMap") {
      const {
        address: _address,
        load,
        isPending: _isPending,
      } = getLocation(store.state.newCoords[0], store.state.newCoords[1]);

      load();

      watch(_address, (val) => {
        address.value = val;
      });

      watch(_isPending, (bool) => {
        isPending.value = bool;
      });
    }

    const handleClick = () => {
      store.methods.setNewAddress(address.value);
      setActiveTab("AddForm");
    };
    return { address, isPending, handleClick, user };
  },
};
</script>

<style>
:root {
  --btn-light-text: #f1eded;
}

.popup-info {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.popup-info button {
  align-self: flex-end;
}

.btn-outline[disabled],
.btn-outline[disabled]:hover {
  color: rgb(165, 165, 165);
  cursor: default;
  border: 1px solid rgb(165, 165, 165);
  background: transparent;
}

.reminder {
  position: relative;
}

.reminder::before,
.reminder::after {
  --scale: 0;

  position: absolute;
  right: -0.25rem;
  bottom: -0.25rem;
  content: "";
  transform: translateX(100%) translateY(100%) scale(var(--scale));
  transition: 150ms transform;
  transform-origin: top left;
}

.reminder::before {
  content: attr(data-tooltip);
  width: max-content;
  padding: 0.3rem;
  border-radius: 0.2rem;
  text-align: center;
  background: #333;
  color: white;
}

.reminder:hover::before {
  --scale: 1;
}
</style>