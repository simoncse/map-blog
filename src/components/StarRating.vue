<template>
  <div class="rating">
    <label class="star-rating" v-for="star in stars" :key="star">
      <Star
        @mouseenter="handleMouseEnter(star)"
        @mouseleave="hover = null"
        v-if="star <= (hover || rating) && rating !== 0"
        fill="gold"
        :class="{ pointer: editable }"
      />
      <Star
        @mouseenter="handleMouseEnter(star)"
        @mouseleave="hover = null"
        v-else
        fill="grey"
        :class="{ pointer: editable }"
      />
      <input
        type="radio"
        name="rating"
        :value="star"
        @click="handleClick(star)"
      />
    </label>
  </div>
</template>

<script>
import Star from "./Star.vue";
import { ref, watch } from "vue";

export default {
  components: { Star },
  props: {
    rating: { default: 0 },
    editable: { default: true },
  },

  setup(props, { emit }) {
    const stars = ref([1, 2, 3, 4, 5]);
    const rating = ref(props.rating);
    const clicked = ref(false);
    const hover = ref(null);

    watch(
      () => props.rating,
      (val) => {
        rating.value = val;
      }
    );

    const handleClick = (val) => {
      if (!props.editable) return;
      //if user click the first star again it will reset to zero
      if (clicked.value && rating.value === 1) {
        rating.value = 0;
        clicked.value = false;
      } else {
        clicked.value = true;
        rating.value = val;
      }
      emit("update", rating.value);
    };

    const handleMouseEnter = (val) => {
      if (!props.editable) return;
      hover.value = val;
    };

    return { stars, rating, hover, handleClick, handleMouseEnter };
  },
};
</script>

<style>
.rating {
  display: flex;
  align-items: center;
  justify-content: center;
}
.star-rating {
  display: inline-flex;
  border: none;
}
.pointer {
  cursor: pointer;
}
</style>