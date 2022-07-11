import mapboxgl from "mapbox-gl"
import { proxy, ref, useSnapshot } from "valtio"
import * as z from "zod"

const interactions = z.enum([
  "scrollZoom",
  "boxZoom",
  "dragRotate",
  "dragPan",
  "keyboard",
  "doubleClickZoom",
  "touchZoomRotate",
])

const store = proxy<{
  map: mapboxgl.Map | null
}>({
  map: null,
})

export const setMap = (map: mapboxgl.Map) => {
  store.map = ref(map)
}

export const useMap = () => {
  const { map } = useSnapshot(store)
  return [map, setMap] as const
}

export const useInteractions = () => {
  const enableInteractions = () => {
    const map = store.map
    if (!map) return

    for (let interaction of interactions.options) {
      if (!map[interaction].isEnabled()) map[interaction].enable()
    }
  }

  const disableInteractions = () => {
    const map = store.map
    if (!map) return

    for (let interaction of interactions.options) {
      if (map[interaction].isEnabled()) map[interaction].disable()
    }
  }
  return [enableInteractions, disableInteractions] as const
}

export default store
