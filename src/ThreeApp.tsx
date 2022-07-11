import { useGesture } from "@use-gesture/react"
import { useRef } from "react"
import { Mesh } from "three"
import { useInteractions } from "./store"

const ThreeApp = () => {
  const meshRef = useRef<Mesh>(null)
  const [enableInteractions, disableInteractions] = useInteractions()

  const bind = useGesture({
    onDrag: ({ first, last, delta: [dx, dy] }) => {
      if (first) {
        disableInteractions()
      }
      if (last) {
        enableInteractions()
      }

      if (!meshRef.current) return

      meshRef.current.rotation.y += dx / 100
      meshRef.current.rotation.x += dy / 100
    },
  })

  return (
    <mesh ref={meshRef} {...(bind() as any)}>
      <boxBufferGeometry />
      <meshBasicMaterial color="tomato" />
    </mesh>
  )
}

export default ThreeApp
