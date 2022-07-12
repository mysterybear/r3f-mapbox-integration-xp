import { useGesture } from "@use-gesture/react"
import { useRef } from "react"
import { Group, Mesh } from "three"
import useCameraSync from "./cameraSync"
import { DEFAULT_ORIGIN } from "./constants"
import { useInteractions } from "./store"

const ThreeApp = () => {
  const groupRef = useRef<Group>(null)
  const meshRef = useRef<Mesh>(null)
  // const [enableInteractions, disableInteractions] = useInteractions()

  // const bind = useGesture({
  //   onDrag: ({ first, last, delta: [dx, dy] }) => {
  //     if (first) {
  //       disableInteractions()
  //     }
  //     if (last) {
  //       enableInteractions()
  //     }

  //     if (!meshRef.current) return

  //     meshRef.current.rotation.y += dx / 100
  //     meshRef.current.rotation.x += dy / 100
  //   },
  // })

  useCameraSync(groupRef)

  return (
    <group ref={groupRef}>
      <mesh
        ref={meshRef}
        //  {...(bind() as any)}
      >
        <boxBufferGeometry />
        <meshBasicMaterial color="tomato" />
      </mesh>
    </group>
  )
}

export default ThreeApp
