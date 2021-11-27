import { reactive } from "vue"

export const state = reactive({
  zoom: 4
})

export const setZoomLevel = (val) => {
  state.zoom = val
}

