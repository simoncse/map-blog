import { reactive, ref, computed } from "vue"

const state = reactive({
  newCoords: null,
  newAddress: null,
})

const blogs = ref([])

const userBlogs = ref([])





const methods = {
  setNewAddress(address) {
    state.newAddress = address
  },

  clearLocation() {
    state.newAddress = null;
    state.newCoords = null;
  },

  setBlogs(arr) {
    blogs.value = arr;
  },

  setUserBlogs(arr) {
    userBlogs.value = arr
  },

  findLatestBlog(blogs) {
    const newest = blogs.reduce((a, b) => {
      return a.createdAt > b.createdAt ? a : b
    })
    return newest;
  }
}




export default {
  state,
  blogs,
  methods,
  userBlogs
}