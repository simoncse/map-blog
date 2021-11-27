import { ref, reactive } from "vue"


export const scrollRef = ref(null)
export const scrollUserRef = ref(null)

export const container = ref(null)

export const viewableArea = reactive({
  height: null,
  top: null,
  bottom: null,
})



export const handleScrolling = (child, source) => {

  let parent;
  if (source === "UserPlaceList") {
    parent = scrollUserRef.value
  } else {
    parent = scrollRef.value
  }

  const childRect = child.getBoundingClientRect()

  const isViewable = (childRect.top >= viewableArea.top) && (childRect.bottom <= viewableArea.height + viewableArea.top);

  if (isViewable) {
    return;
  }

  const scrollTop = childRect.top - viewableArea.top;
  const scrollBot = childRect.bottom - viewableArea.bottom;

  if (Math.abs(scrollTop) < Math.abs(scrollBot)) {

    //near the top of the list
    console.log("scrolling down")
    parent.scrollTop += scrollTop
  } else {
    parent.scrollTop += scrollBot;
    console.log("scrolling up")

  }

}

export const scrollBackTop = (type) => {
  if (type === "default") {
    scrollRef.value.scrollTop = 0;
  }
  if (type === "user") {
    scrollUserRef.value.scrollTop = 0;
  }

}
