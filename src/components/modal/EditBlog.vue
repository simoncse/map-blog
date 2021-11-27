<template>
  <form class="edit-form" @submit.prevent="handleSubmit">
    <div class="form-group">
      <label>Title</label>
      <input
        class="edit-form__title"
        placeholder="enter a title"
        required
        v-model="blog.title"
      />
    </div>

    <label>Review</label>
    <textarea
      class="edit-form__review custom-scroll"
      placeholder="Tell us something about this place"
      required
      v-model="blog.review"
    />
    <div class="edit-form__address">
      <label>Address : </label> {{ blog.address }}
    </div>
    <div class="edit-form__rating">
      <label>Rating : </label>
      <StarRating @update="setRating" :rating="blog.rating" />
    </div>
    <div class="edit-form__actions">
      <button type="button" class="btn btn-back" @click="goBack">Back</button>
      <button
        type="button"
        class="btn btn-delete"
        @click="handleDelete"
        v-if="!isPending"
      >
        Delete
      </button>
      <button type="sumbit" class="btn btn-update" v-if="!isPending">
        Update
      </button>
      <div class="edit-form__loading" v-if="isPending">
        <div class="spinner"></div>
      </div>
    </div>
  </form>
</template>

<script>
const props = {
  data: {
    type: Object,
    default: null,
  },
};
import StarRating from "@/components/StarRating.vue";
import { ref, watch, computed } from "vue";
import { setModalData, toggleModal } from "./state";
import useDocument from "@/composables/useDocument";
import { clearActivePopup } from "../map/useMap";
import { setMessage } from "../notification/state";
import { checkActive, clearActiveBlog } from "../sideview/state";
import { useMapMethods } from "../map/useMap";

export default {
  components: { StarRating },
  props,
  setup(props) {
    const blog = ref(props.data);
    const cache = ref({ ...props.data });
    const { zoomOut } = useMapMethods();

    const isActive = computed(() => checkActive(blog.value.id));

    const { error, isPending, deleteDoc, updateDoc } = useDocument(
      "blogs",
      blog.value.id
    );

    watch(
      () => props.data,
      (data) => {
        blog.value = data;
        cache.value = JSON.parse(JSON.stringify(data));
      }
    );

    const setRating = (e) => {
      blog.value.rating = e;
    };

    const goBack = () => {
      setModalData(cache.value, "blog");
    };

    const handleDelete = async () => {
      let cleanup;
      if (isActive.value) {
        cleanup = clearActiveBlog("delete");
      }

      await deleteDoc();

      if (!error.value && !isPending.value) {
        toggleModal(false);
        clearActivePopup("all");
        setMessage("Blog Deleted");
        if (cleanup) {
          cleanup();
          zoomOut();
        }
      }
    };

    const handleSubmit = async () => {
      const { id, createdAt, ...obj } = blog.value;

      await updateDoc(obj);

      if (!error.value) {
        setModalData(blog.value, "blog"); //this sends a 'cached' version of the updated data
        setMessage("Blog Updated");
      }
    };

    return { blog, setRating, isPending, goBack, handleSubmit, handleDelete };
  },
};
</script>

<style>
.edit-form {
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 10px 12px 10px;
  font-size: 15px;
}

.form-group {
  display: flex;
  gap: 1rem;
  align-items: center;
  margin-bottom: 10px;
}

.edit-form textarea,
.edit-form input {
  border: 1px solid rgb(192, 191, 191);
  border-radius: 4px;
  padding: 2px 6px;
}

.edit-form label {
  font-weight: 600;
}

.edit-form__title {
  flex-grow: 1;
}

.edit-form__review {
  flex-grow: 1;
  overflow-y: auto;
}

.edit-form__rating {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.edit-form__actions button {
  padding: 7px 9px;
}

.edit-form__actions {
  display: flex;
  padding: 10px 0;
}

.btn-back {
  background: transparent;
  border: 1px solid var(--primary);
}

.btn-back:hover {
  background: transparent;
  color: black;
  border: 1px solid black;
}

.btn-delete {
  margin-left: auto;
  margin-right: 10px;

  color: var(--warning);
  background: transparent;
  border: 1px solid var(--warning);
}

.btn-delete:hover {
  background: transparent;
  font-weight: bold;
  color: var(--warning);
  border: 1px solid var(--warning-darken);
}

.btn-update {
  background: transparent;
  color: var(--blue);
  border: 1px solid var(--blue);
}

.btn-update:hover {
  background: transparent;
  color: var(--blue-darken);
  font-weight: bold;
  border: 1px solid var(--blue-darken);
}

.edit-form__actions {
  position: relative;
}

.edit-form__loading {
  position: absolute;
  right: 2%;
  top: 50;
  transform: translateY(50%);
}
</style>