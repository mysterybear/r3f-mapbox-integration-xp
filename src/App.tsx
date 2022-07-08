import { createRoot } from "@react-three/fiber"
import mapboxgl from "mapbox-gl"
import "mapbox-gl/dist/mapbox-gl.css"
import { useEffect, useRef } from "react"
import ThreeApp from "./ThreeApp"

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN ?? ""

const fullWidthHeight = {
  width: "100%",
  height: "100%",
}

const App = () => {
  const mapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!mapRef.current) return

    const map = new mapboxgl.Map({
      container: mapRef.current, // container ID
      style: "mapbox://styles/mapbox/streets-v11", // style URL
      center: [-0.0804, 51.5145], // starting position [lng, lat]
      zoom: 18, // starting zoom
      projection: {
        name: "globe",
      },
    })

    map.on("style.load", () => {
      map.setFog({}) // Set the default atmosphere style
    })

    // const size = { width: window.innerWidth, height: window.innerHeight }
    const canvas = mapRef.current.querySelector("canvas")

    if (!canvas) return

    const root = createRoot(canvas)

    root.render(<ThreeApp />)
  }, [])

  return (
    <div style={{ position: "absolute", ...fullWidthHeight }}>
      <div ref={mapRef} style={fullWidthHeight} />
    </div>
  )
}

export default App
