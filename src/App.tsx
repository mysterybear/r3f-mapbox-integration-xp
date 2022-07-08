import { createRoot, extend } from "@react-three/fiber"
import mapboxgl, { AnyLayer } from "mapbox-gl"
import "mapbox-gl/dist/mapbox-gl.css"
import { useEffect, useState } from "react"
import * as THREE from "three"
import ThreeApp from "./ThreeApp"

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
      antialias: true,
      // projection: {
      //   name: "globe",
      // },
    })

    // const size = { width: window.innerWidth, height: window.innerHeight }
    const canvas = mapElement.querySelector("canvas")

    if (!canvas) return

    const root = createRoot(canvas)

    const customLayer: AnyLayer = {
      id: "custom_layer",
      type: "custom",
      renderingMode: "3d",
      onAdd: function (map, context) {
        root.configure({
          gl: {
            alpha: true,
            antialias: true,
            autoClear: false,
            canvas: map.getCanvas(),
            context,
            outputEncoding: THREE.sRGBEncoding,
            preserveDrawingBuffer: false,
          },
          size: {
            width: map.getCanvas().clientWidth,
            height: map.getCanvas().clientHeight,
          },
        })

        map.repaint = false
      },

      render: function (gl, matrix) {
        root.render(<ThreeApp />)
        map.triggerRepaint()
      },
    }

    map.on("style.load", () => {
      map.setFog({}) // Set the default atmosphere style
      map.addLayer(customLayer)
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
