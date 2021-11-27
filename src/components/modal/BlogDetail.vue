<template>
  <div class="blog-detail" v-if="blog">
    <div class="blog-detail__header">
      <h2 class="blog-detail__title">
        {{ blog.title }}
      </h2>
      <button v-if="ownership" class="btn btn-edit" @click="handleModal">
        Edit
      </button>
    </div>
    <p class="blog-detail__author">By {{ blog.userName }}</p>
    <div class="blog-detail__rating">
      <StarRating :rating="blog.rating" :editable="false" />
    </div>
    <p class="blog-detail__date">Published on {{ blog.fullDate }}</p>
    <p class="blog-detail__address">{{ blog.address }}</p>
    <p class="blog-detail__review custom-scroll">{{ blog.review }}</p>
  </div>
</template>

<script>
const props = {
  data: {
    default: null,
  },
};

import { ref, computed, watch } from "vue";
import getUser from "@/composables/getUser";
import StarRating from "../StarRating.vue";
import { setModalData } from "./state";
export default {
  components: { StarRating },
  props,
  setup(props) {
    const { user } = getUser();
    const blog = ref(props.data);

    watch(
      () => props.data,
      (data) => {
        console.log("data changed");
        blog.value = data;
      }
    );

    const ownership = computed(() => {
      return blog.value && user.value && user.value.uid === blog.value.userId;
    });

    const handleModal = () => {
      setModalData(blog.value, "edit");
    };
    return { blog, ownership, handleModal };
  },
};
</script>

<style>
.blog-detail {
  padding: 0 12px 6px;
  height: 100%;

  display: grid;
  align-content: start;
  grid-template-columns: 1fr 1fr;
  gap: 6px;
  font-size: 13.5px;
  grid-template-areas:
    "header header"
    "author rating"
    "date address"
    "review review";
}

.blog-detail__header {
  grid-area: header;
  display: flex;
  align-items: center;
  gap: 2rem;
}

.blog-detail__title {
  font-size: 22px;
}

.btn-edit {
  font-size: 13.5px;
  border: 1px solid var(--primary);
  background: transparent;
  padding: 3px 7px;
}

.btn-edit:hover {
  background: transparent;
  border: 1px solid black;
  color: black;
}

.blog-detail__author {
  grid-area: author;
}
.blog-detail__rating {
  justify-self: end;
  grid-area: rating;
  display: flex;
  gap: 6px;
}
.blog-detail__date {
  grid-area: date;
}

.blog-detail__address {
  grid-area: address;
  justify-self: end;
  font-size: 13px;
  overflow-wrap: break-word;
  text-align: end;
}

.blog-detail__review {
  grid-area: review;
  margin-top: 20px;
  font-size: 16px;
  line-height: 150%;
  overflow-y: auto;
}
</style>