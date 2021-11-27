<template>
  <div class="modal" v-if="showModal">
    <nav class="modal__nav">
      <button class="btn btn-modal-close" @click="toggleModal(false)">x</button>
    </nav>
    <div class="modal__content">
      <component :is="activeComponent" :data="data" />
    </div>
  </div>
</template>



<script>
import { ref, watch } from "vue";
import { showModal, toggleModal, data, activeComponent } from "./state";
import BlogDetail from "./BlogDetail.vue";
import EditBlog from "./EditBlog.vue";

export default {
  components: { BlogDetail, EditBlog },
  setup() {
    watch(data, (data) => {
      // console.log(data);
      // console.log(activeComponent.value);
    });

    return { showModal, toggleModal, activeComponent, data };
  },
};
</script>

<style>
.modal {
  position: absolute;
  width: 80%;
  height: 80%;
  background: white;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -45%);
  z-index: 10;
  border-radius: 10px;
  box-shadow: 1px 3px rgba(0, 0, 0, 0.12);
  /* overflow: hidden; */
  display: flex;
  flex-direction: column;
}

.modal__content {
  flex-grow: 1;
  overflow: hidden;
}

.modal__nav {
  width: 100%;
  display: flex;
  flex-direction: row-reverse;
}

.btn-modal-close {
  background: transparent;
  font-size: 20px;
  border-radius: 12px;
}

.btn-modal-close:hover {
  background: var(--secondary);
  color: var(--primary);
}
</style>