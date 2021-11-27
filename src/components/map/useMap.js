import { watch } from "vue";
import getCollection from "@/composables/getCollection";
import { newPin, allPins, userPins, helpers } from "./store";
import { initMap, initPopup } from "./config";
import store from "../../store";
import { partition } from "../../store/helpers";
import getUser from "@/composables/getUser";
import { state } from "./state";





const loadPins = () => {

  const { user } = getUser();
  const { error, documents: blogs } = getCollection("blogs");

  watch([user, blogs], ([user, blogs]) => {

    // console.log(user);
    // console.log(blogs);

    store.methods.setBlogs(blogs)

    let allGeoJSON;
    let userGeoJSON;

    if (user) {
      console.log("user logged in")
      const [userBlogs, allBlogs] = partition(blogs, blog => blog.userId === user.uid)
      store.methods.setUserBlogs(userBlogs);
      allGeoJSON = allBlogs.map(blog => {
        return helpers.createPoint(blog.coords, { id: blog.id, address: blog.address, lng: blog.coords[0], lat: blog.coords[1] })
      })
      userGeoJSON = userBlogs.map(blog => {
        return helpers.createPoint(blog.coords, { id: blog.id, address: blog.address, lng: blog.coords[0], lat: blog.coords[1] })
      })


    } else {
      console.log("no user detected")
      allGeoJSON = blogs.map(blog => {
        return helpers.createPoint(blog.coords, { id: blog.id, address: blog.address, lng: blog.coords[0], lat: blog.coords[1] })
      })
      userGeoJSON = [];
    }

    allPins.features = allGeoJSON
    userPins.features = userGeoJSON

  })


}

//this is basically a wrapper for the map and popup object methods
let map

//global methods

const clearActivePopup = (sideEffect) => {
  const popups = document.getElementsByClassName('mapboxgl-popup');
  /** Check if there is already a popup on the map and if so, remove it */
  if (popups[0]) {
    popups[0].remove();
  }

  //clear pin icon on map 
  if (map && sideEffect === "all") {
    newPin.features.pop();
    // console.log("clearing pin icon")
    map.getSource("newPin").setData(newPin);
  }
}



const useMap = () => {
  const { mapObj, geocoder } = initMap('mapContainer')
  map = mapObj
  // console.log("accessing mapboxgl and creating a map object to a DOM Id")


  const setResources = () => {
    loadPins();
    map.addSource("newPin", {
      type: "geojson",
      data: newPin,
    });

    map.addLayer({
      id: "new-pin",
      type: "symbol",
      source: "newPin",
      layout: {
        "icon-image": "pin-orange",
      },
    });

    map.addSource("allPins", {
      type: "geojson",
      data: allPins
    });
    map.addLayer({
      id: "current-pins",
      type: "symbol",
      source: "allPins",
      layout: {
        "icon-image": "pin-blue",
      },
    });

    map.addSource("userPins", {
      type: "geojson",
      data: userPins
    });
    map.addLayer({
      id: "user-pins",
      type: "symbol",
      source: "userPins",
      layout: {
        "icon-image": "pin-orange",
      },
    });

    //allPins is reactive 
    //if any pins data change, this watcher will update source data on mapboxgl and rerender 
    watch(allPins, allPins => {
      map.getSource("allPins").setData(allPins);
    })

    watch(userPins, userPins => {
      map.getSource("userPins").setData(userPins);
    })
  }

  //handle mapbox canvas drawing on new pin
  const newActivePin = (lngLat) => {

    if (newPin.features.length === 1) {
      newPin.features.pop();
    }

    const point = helpers.createPoint(lngLat, 'new')
    newPin.features.push(point)
    map.getSource("newPin").setData(newPin);

    //this will return a clearup function to removing the pin data in map source 
    return (() => {
      newPin.features.pop();
      map.getSource("newPin").setData(newPin);
    })
  }

  const newPopup = (DOMId, coordsObj) => {
    clearActivePopup();

    const popup = initPopup().setLngLat(coordsObj)
      .setHTML(`<div id="${DOMId}"></div>`)
      .addTo(map);

    return popup;
  }
  // const queryMapClick = (e) =>{
  //   const features = map.queryRenderedFeatures(e.point, {
  //     layers: [""],
  //       });
  // }

  return { map, geocoder, setResources, newActivePin, newPopup }
}



//global map methods used by other components 
const useMapMethods = () => {
  const flyTo = (coords) => {
    if (!map) return;
    map.flyTo({
      center: coords,
      zoom: 15,
      essential: true
    });
  }

  const zoomOut = () => {
    if (!map) return;
    map.zoomTo(state.zoom, {
      duration: 2000,
      offset: [100, 50]
    })
  }

  const createPopup = ({ coords, address }) => {
    const popUps = document.getElementsByClassName('mapboxgl-popup');
    /** Check if there is already a popup on the map and if so, remove it */
    if (popUps[0]) popUps[0].remove();

    if (!map) return;
    const popup = initPopup()
      .setLngLat(coords)
      .setHTML(`<h4>${address}</h4>`)
      .addTo(map)


  }

  const togglePins = (type) => {
    if (!map) return;
    if (type === "user") {
      map.setLayoutProperty('current-pins', 'visibility', 'none');
      map.setLayoutProperty('user-pins', 'visibility', 'visible');

    }
    if (type === "all") {
      map.setLayoutProperty('current-pins', 'visibility', 'visible');
      map.setLayoutProperty('user-pins', 'visibility', 'visible');


    }
  }

  return { flyTo, createPopup, togglePins, zoomOut }
}

export { useMap, useMapMethods, clearActivePopup }