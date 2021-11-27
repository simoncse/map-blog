import { ref } from "vue";

export const showN = ref(false);

export const toggleShowN = () => { showN.value = !showN.value }

export const message = ref("")

export const setMessage = (m) => {
  showN.value = true;
  message.value = m
};