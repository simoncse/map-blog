import { reactive } from "vue";

const newPin = {
  type: "FeatureCollection",
  features: [],
};

const allPins = reactive({
  type: "FeatureCollection",
  features: [],
});

const userPins = reactive({
  type: "FeatureCollection",
  features: [],
});

const helpers = {
  createPoint(lngLat, props) {
    const geojson = {
      type: "Feature",
      properties: props,
      geometry: {
        type: "Point",
        coordinates: lngLat,
      },
    }
    return geojson
  },

}

export {
  newPin, allPins, helpers, userPins
}