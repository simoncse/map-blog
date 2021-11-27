import mapboxgl from "mapbox-gl";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import LS from "./useLocalStorage";
mapboxgl.accessToken =
  "pk.eyJ1Ijoic2M3NTIiLCJhIjoiY2t3aGQ4bWFtMHhqODJxbnNpbHpqb2R4diJ9.5ZFb554BGN0gJIfTJnZW0g";


//initialzed the map and popup object and expose their methods elsewhere in the app.
export const initMap = (DOMId) => {
  const mapObj = new mapboxgl.Map({
    container: DOMId,
    style: "mapbox://styles/sc752/ckub3k4qc5vww18r07bw7iwl2/draft",
    center: LS.getCenter(),
    zoom: 4,
  });

  const nav = new mapboxgl.NavigationControl();
  mapObj.addControl(nav, "bottom-right");

  const geocoder = new MapboxGeocoder({
    accessToken: mapboxgl.accessToken,
    mapboxgl: mapboxgl,
    marker: false,
  });
  mapObj.addControl(geocoder);

  return { mapObj, geocoder }
}

export const initPopup = (options) => {
  return new mapboxgl.Popup({ offset: 19 })
}





