<template>
  <div class="place-detail" :class="{ active: isActive }">
    <h3 class="title" @click="handleClick">{{ blog.title }}</h3>
    <p class="author">By {{ blog.userName }}</p>
    <StarRating :rating="blog.rating" :editable="false" />
    <p class="address">{{ blog.address }}</p>
    <div class="review">
      <p>{{ snippet }}</p>
      <button class="btn btn-more" @click="handleModal">More</button>
    </div>
    <span class="date">{{ blog.createdAt }}</span>
  </div>
</template>

<script>
import { state, setActiveBlog } from "./state";
import StarRating from "../StarRating.vue";
import { toggleModal, setModalData } from "../modal/state";
import { computed } from "vue";
import { useMapMethods } from "../map/useMap";

export default {
  components: { StarRating },
  props: ["blog"],
  setup(props) {
    const { flyTo, createPopup } = useMapMethods();

    const isActive = computed(() => props.blog.id === state.activeBlog.id);
    const snippet = computed(() => {
      return props.blog.review.substring(0, 140) + "...";
    });

    const handleClick = (e) => {
      const obj = {
        id: props.blog.id,
        coords: props.blog.coords,
        address: props.blog.address,
      };
      setActiveBlog({ ...obj });
      flyTo(obj.coords);
      createPopup(obj);
    };

    const handleModal = () => {
      toggleModal(true);
      setModalData(props.blog, "blog");
    };

    return { snippet, isActive, handleClick, handleModal };
  },
};
</script>

<style>
.place-detail {
  padding: 10px;
}
.review {
  margin: 10px 0;
}

p.author {
  font-size: 13px;
}

p.address,
span.date {
  font-size: 12px;
}

.review p {
  font-size: 14px;
}

.review {
  display: grid;
  gap: 0.7rem;
}

.review button {
  justify-self: end;
}

.place-detail .rating {
  display: block;
}

/* Interaction */
.place-detail.active {
  background: #eaeaeb;
}

h3.title {
  cursor: pointer;
}

.place-detail.active h3.title,
h3.title:hover {
  color: black;
}

.btn-more {
  border: 1px solid var(--primary);
  background: transparent;
}
</style>