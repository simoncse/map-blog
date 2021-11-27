import { ref } from 'vue'

const getLocation = (lng, lat) => {
  const error = ref(null)
  const address = ref(null)
  const isPending = ref(null)

  const load = async () => {
    try {
      isPending.value = true
      const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=pk.eyJ1Ijoic2M3NTIiLCJhIjoiY2t1YjFrd3dhMG04cDMxazZrdDA2aWowNiJ9.X7GV_JZfv45IyMJPsSkhPg`

      const res = await fetch(url)
      const data = await res.json();
      address.value = data.features[0].place_name;
      error.value = null
      isPending.value = false
    }
    catch (err) {
      console.log(err.message)
      error.value = 'Cannot get location detail'
      isPending.value = false
    }

  }



  return { error, address, isPending, load }
}

export default getLocation