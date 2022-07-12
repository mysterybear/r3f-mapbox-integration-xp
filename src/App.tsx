import {
  addAfterEffect,
  addEffect,
  advance,
  createRoot,
  events,
  extend,
  ReconcilerRoot,
} from "@react-three/fiber"
import mapboxgl, { AnyLayer } from "mapbox-gl"
import "mapbox-gl/dist/mapbox-gl.css"
import { useEffect, useState } from "react"
import * as THREE from "three"
import { DEFAULT_ORIGIN } from "./constants"
import { useMap } from "./store"
import ThreeApp from "./ThreeApp"

extend(THREE)

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN ?? ""

const fullWidthHeight = {
  width: "100%",
  height: "100%",
}

const App = () => {
  const [mapElement, setMapElement] = useState<HTMLDivElement | null>(null)

  const [root, setRoot] = useState<ReconcilerRoot<HTMLCanvasElement> | null>(
    null
  )

  const [map, setMap] = useMap()

  useEffect(() => {
    if (!mapElement) return

    if (!map) {
      setMap(
        new mapboxgl.Map({
          container: mapElement, // container ID
          style: "mapbox://styles/mapbox/streets-v11", // style URL
          center: DEFAULT_ORIGIN, // starting position [lng, lat]
          zoom: 18, // starting zoom
          antialias: true,
          // interactive: false,
        })
      )
    }

    if (!map) return

    // const size = { width: window.innerWidth, height: window.innerHeight }
    const canvas = mapElement.querySelector("canvas")

    if (!canvas) return

    if (!root) setRoot(createRoot(canvas))
    if (!root) return

    const render = (ctx?: WebGLRenderingContext, matrix?: number[]): void => {
      advance(Date.now(), true)
      map.triggerRepaint()
    }

    const handleResize = () => {
      const size = { width: window.innerWidth, height: window.innerHeight }
      root.configure({ size })
      render()
    }

    window.addEventListener("resize", handleResize)

    const customLayer: AnyLayer = {
      id: "custom_layer",
      type: "custom",
      renderingMode: "3d",
      onAdd: function (map, context) {
        root.configure({
          events,
          frameloop: "never",
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
          onCreated: (state) => {
            state.events.connect?.(mapElement)
            addEffect(() => state.gl.resetState())
            addAfterEffect(() => map.triggerRepaint())
          },
        })

        map.repaint = false

        root.render(<ThreeApp />)
      },
      render,
    }

    map.on("style.load", () => {
      map.setFog({}) // Set the default atmosphere style
      map.addLayer(customLayer)
    })

    return () => root.unmount()
  }, [map, mapElement, root, setMap])

  return (
    <div style={{ position: "absolute", ...fullWidthHeight }}>
      <div ref={setMapElement} style={fullWidthHeight} />
    </div>
  )
}

export default App
