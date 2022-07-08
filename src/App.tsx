import { createRoot, extend } from "@react-three/fiber"
import mapboxgl from "mapbox-gl"
import "mapbox-gl/dist/mapbox-gl.css"
import { useEffect, useState } from "react"
import * as THREE from "three"

extend(THREE)

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN ?? ""

const fullWidthHeight = {
  width: "100%",
  height: "100%",
}

const App = () => {
  const [mapElement, setMapElement] = useState<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!mapElement) return

    const map = new mapboxgl.Map({
      container: mapElement, // container ID
      style: "mapbox://styles/mapbox/streets-v11", // style URL
      center: [-0.0804, 51.5145], // starting position [lng, lat]
      zoom: 18, // starting zoom
      projection: {
        name: "globe",
      },
    })

    // const size = { width: window.innerWidth, height: window.innerHeight }
    const canvas = mapElement.querySelector("canvas")

    if (!canvas) return

    const root = createRoot(canvas)

    map.on("style.load", () => {
      map.setFog({}) // Set the default atmosphere style
      map.addLayer({
        id: "custom_layer",
        type: "custom",
        renderingMode: "3d",
        onAdd: function (map, mbxContext) {
          root.configure({ gl: mbxContext })
        },

        render: function (gl, matrix) {},
      })
    })

    return () => root.unmount()
  }, [mapElement])

  return (
    <div style={{ position: "absolute", ...fullWidthHeight }}>
      <div ref={setMapElement} style={fullWidthHeight} />
    </div>
  )
}

export default App
