<template>
  <div id="mapContainer" class="basemap">
    <Modal />
  </div>
</template>

<script>
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";
import "mapbox-gl/dist/mapbox-gl.css";

import PopupAddress from "./PopupAddress.vue";
import { useMap } from "./useMap";
import { setActiveBlog } from "../sideview/state";
import { ref, onMounted, createApp } from "vue";
import store from "@/store";
import Modal from "../modal/Modal.vue";
import LS from "./useLocalStorage";
import { setZoomLevel } from "./state";

export default {
  components: { PopupAddress, Modal },
  setup(props, { emit }) {
    const loading = ref(true);
    onMounted(() => {
      const { map, geocoder, setResources, newActivePin, newPopup } =
        useMap(map);
      map.on("load", () => {
        console.log("map loaded");
        setResources();
        loading.value = false;

        map.on("moveend", (e) => {
          const { lng, lat } = map.getCenter();
          LS.setCenter([lng, lat]);
        });

        map.on("zoomstart", (e) => {
          setZoomLevel(map.getZoom());
        });
      });

      map.on("click", (e) => {
        if (loading.value) return;

        const features = map.queryRenderedFeatures(e.point, {
          layers: ["current-pins"],
        });

        const featuresOwn = map.queryRenderedFeatures(e.point, {
          layers: ["user-pins"],
        });

        if (features.length) {
          const { id, address, lng, lat } = features[0].properties;
          const coords = [lng, lat];
          setActiveBlog({ id, coords, address }, "map");

          return;
        }

        if (featuresOwn.length) {
          const { id, address, lng, lat } = featuresOwn[0].properties;
          const coords = [lng, lat];

          setActiveBlog({ id, coords, address }, "map");

          return;
        }

        const { lng, lat } = e.lngLat;
        const clearPin = newActivePin([lng, lat]);
        store.state.newCoords = [lng, lat];
        const popup = newPopup("popup-info", e.lngLat);
        createApp(PopupAddress, { type: "clickOnMap" }).mount("#popup-info");

        popup.on("close", clearPin);
      });

      geocoder.on("result", (e) => {
        const [lng, lat] = e.result.center;
        const clearPin = newActivePin(e.result.center);
        store.state.newCoords = e.result.center;
        const popup = newPopup("popup-info", { lng, lat });
        createApp(PopupAddress, {
          type: "geocoder",
          data: e.result.place_name,
        }).mount("#popup-info");

        popup.on("close", clearPin);
      });
    });

    // return { modalOpen };
  },
};
</script>

<style>
#mapContainer {
  height: 100%;
  position: relative;
}

/* override and style mapbox-popup-content  */
.mapboxgl-popup-content {
  display: grid;
  padding: 0; /*override default padding*/
}

.mapboxgl-popup-close-button {
  position: static; /* override default abosolute position */
  order: -1; /* forces this to comes before the content */
  justify-self: end;
  outline: none;
  font-size: 18px;
}

.mapboxgl-popup-content > * {
  padding: 4px 8px; /*make sure every direct child grid item have the same padding, including buttons*/
}

/* more padding to the last child, notice that the mapboxgl close button is actually the last child,
so the "correct" last element is the second last child*/
.mapboxgl-popup-content > *:nth-last-child(2) {
  padding-bottom: 12px;
}
</style>