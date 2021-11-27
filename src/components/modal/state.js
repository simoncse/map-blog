import { ref } from "vue"

export const showModal = ref(false)

export const toggleModal = (bool) => {
  showModal.value = bool
  console.log("toggle modal")
};

export const activeComponent = ref(null);

export const setActive = (comp) => activeComponent.value = comp;


export const data = ref(null);

export const setModalData = (obj, flag) => {
  data.value = { ...obj };
  if (flag === "blog") {
    activeComponent.value = "BlogDetail"
  }
  if (flag === "edit") {
    activeComponent.value = "EditBlog"

  }
}

