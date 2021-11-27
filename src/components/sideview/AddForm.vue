<template>
  <div v-if="!user" class="message">Please log in or sign up first.</div>

  <div v-if="user && !hasNewLocation" class="message">
    Please select a location on the map by cliking on it or using the search box
  </div>

  <form
    v-if="user && hasNewLocation && newAddress"
    @submit.prevent="handleSubmit"
    class="add-form"
  >
    <label>Title</label>
    <input class="title" placeholder="enter a title" required v-model="title" />
    <label>Review</label>
    <textarea
      class="review custom-scroll"
      placeholder="Tell us something about this place"
      required
      v-model="review"
    />
    <label>Address</label>
    <textarea class="address" required v-model="newAddress" />
    <div class="rating-wrapper">
      <label>Rating</label>
      <StarRating @update="setRating" />
    </div>
    <div class="action">
      <button v-if="!isPending" type="sumbit" class="btn-outline">
        Add Pin
      </button>
      <div v-if="isPending" class="spinner"></div>
    </div>
  </form>
</template>

<script>
import StarRating from "@/components/StarRating.vue";
import { ref, toRefs, computed } from "vue";
import getUser from "@/composables/getUser";
import useCollection from "@/composables/useCollection";
import { timestamp } from "@/firebase/config";
import store from "@/store";
import { setActiveTab } from "./state";
import { clearActivePopup } from "../map/useMap";
import { setMessage } from "../notification/state";

export default {
  props: ["autoAddress"],
  components: { StarRating },
  setup(props) {
    const { newAddress, newCoords } = toRefs(store.state);

    const hasNewLocation = computed(() => {
      return newAddress.value !== null && newCoords.value !== null;
    });

    const title = ref("");
    const review = ref("");
    const rating = ref(0);
    const { user } = getUser();

    const { error, isPending, addDoc } = useCollection("blogs");

    const setRating = (e) => {
      rating.value = e;
    };

    const handleSubmit = async () => {
      const obj = {
        title: title.value,
        review: review.value,
        address: newAddress.value,
        rating: rating.value,
        coords: newCoords.value,
        userId: user.value.uid,
        userName: user.value.displayName,
        createdAt: timestamp(),
      };

      const res = await addDoc(obj);

      if (!error.value) {
        title.value = "";
        rating.value = "";
        review.value = "";
        clearActivePopup("all");
        store.methods.clearLocation();
        setMessage("New Blog Created");
        setActiveTab("PlaceList", "created");
      }
    };

    return {
      isPending,
      user,
      title,
      review,
      setRating,
      newAddress,
      hasNewLocation,
      handleSubmit,
    };
  },
};
</script>

<style>
.add-form {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 0 22px;
}

.add-form label {
  font-weight: bold;
}

.add-form input,
.add-form textarea {
  border: none;
}

input.title,
textarea.review,
textarea.address {
  width: 250px;
  border-bottom: 1px solid rgb(194, 194, 194);
}

textarea.review {
  flex-grow: 1;
}

input::placeholder,
textarea::placeholder {
  font-size: 14px;
  color: rgb(199, 198, 198);
}

.rating-wrapper {
  display: flex;
  justify-content: space-between;
}

.action {
  margin-top: 12px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding-bottom: 10px;
}

.action .spinner {
  margin-right: 5px;
  border-top-color: tomato;
}

.message {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 15px;
  width: 70%;
  line-height: 150%;
}
</style>