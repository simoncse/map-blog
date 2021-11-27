<template>
  <div class="notification">
    <div class="checkmark">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="white"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M5 13l4 4L19 7"
        />
      </svg>
    </div>

    <div class="notification__dialog">{{ message }}</div>
    <button class="notification__close" @click="toggleShowN">x</button>
  </div>
</template>

<script>
let timeoutHandle;
import { onMounted, onUnmounted } from "vue";
import { showN, toggleShowN, message } from "./state";
export default {
  setup() {
    onMounted(() => {
      timeoutHandle = setTimeout(() => (showN.value = false), 4000);
    });

    onUnmounted(() => {
      clearTimeout(timeoutHandle);
    });

    return { message, toggleShowN };
  },
};
</script>

<style>
.notification {
  position: fixed;
  z-index: 60;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 300px;
  max-width: 20%;
  background: rgb(88, 202, 88);
  color: white;
  padding: 10px;
  border-radius: 5px;
  box-shadow: 1px 2px 2px rgba(0, 0, 0, 0.12);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.checkmark {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 10%;
}

.notification__dialog {
  color: white;
  flex-grow: 1;
}

.notification__close {
  color: white;
  font-size: 20px;
  position: absolute;
  padding: 2px 10px 2px 0;
  top: 0;
  right: 0;
}

.notification__close:hover {
  transform: scale(110%);
}
</style>