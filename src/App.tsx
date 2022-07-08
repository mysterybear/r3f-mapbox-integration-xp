import { createRoot } from "@react-three/fiber"
import { useEffect, useRef } from "react"
import ThreeApp from "./ThreeApp"

const fullWidthHeight = {
  width: "100%",
  height: "100%",
}

const App = () => {
  const mapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!mapRef.current) return

    const canvas = mapRef.current.querySelector("canvas")

    if (!canvas) return

    const root = createRoot(canvas)

    root.render(<ThreeApp />)
  }, [])

  return (
    <div style={{ position: "absolute", ...fullWidthHeight }}>
      <div ref={mapRef} style={fullWidthHeight}>
        <canvas style={{ position: "relative", ...fullWidthHeight }} />
      </div>
    </div>
  )
}

export default App
