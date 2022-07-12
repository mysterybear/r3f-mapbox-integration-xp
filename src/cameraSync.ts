import { useThree } from "@react-three/fiber"
import { RefObject, useEffect } from "react"
import { Group, Matrix4, OrthographicCamera, Vector3 } from "three"
import { useSnapshot } from "valtio"
import { TILE_SIZE, WORLD_SIZE } from "./constants"
import store from "./store"
import {
  clamp,
  makeOrthographicMatrix,
  makePerspectiveMatrix,
  mercatorZfromAltitude,
} from "./utils"

const { sin, cos, tan, min, max, PI } = Math

const useCameraSync = (groupRef: RefObject<Group>) => {
  const { map } = useSnapshot(store)
  const camera = useThree((three) => three.camera)

  useEffect(() => {
    if (!map || !groupRef.current) return

    if (camera.matrixAutoUpdate) camera.matrixAutoUpdate = false

    groupRef.current.position.x = groupRef.current.position.y = WORLD_SIZE / 2
    if (groupRef.current.matrixAutoUpdate)
      groupRef.current.matrixAutoUpdate = false

    const cameraState = {
      translateCenter: new Matrix4().makeTranslation(
        WORLD_SIZE / 2,
        -WORLD_SIZE / 2,
        0
      ),
      worldSizeRatio: TILE_SIZE / WORLD_SIZE,
      worldSize: TILE_SIZE * (map as any).transform.scale,
    }

    const update = () => {
      if (!groupRef.current) return

      const t = (map as any).transform as any,
        halfFov = t._fov / 2,
        cameraToCenterDistance = (0.5 / tan(halfFov)) * t.height,
        offset = t.centerOffset || new Vector3(),
        groundAngle = PI / 2 + t._pitch,
        pitchAngle = cos(PI / 2 - t._pitch),
        worldSize = t.tileSize * t.scale,
        pixelsPerMeter = mercatorZfromAltitude(1, t.center.lat) * worldSize,
        fovAboveCenter = t._fov * (0.5 + t.centerOffset.y / t.height),
        minElevationInPixels = t.elevation
          ? t.elevation.getMinElevationBelowMSL() * pixelsPerMeter
          : 0,
        cameraToSeaLevelDistance =
          (t._camera.position[2] * worldSize - minElevationInPixels) /
          cos(t._pitch),
        topHalfSurfaceDistance =
          (sin(fovAboveCenter) * cameraToSeaLevelDistance) /
          sin(
            clamp(Math.PI - groundAngle - fovAboveCenter, 0.01, Math.PI - 0.01)
          ),
        furthestDistance =
          pitchAngle * topHalfSurfaceDistance + cameraToSeaLevelDistance,
        horizonDistance = cameraToSeaLevelDistance * (1 / t._horizonShift),
        farZ = min(furthestDistance * 1.01, horizonDistance),
        cameraTranslateZ = new Matrix4().makeTranslation(
          0,
          0,
          cameraToCenterDistance
        ),
        nz = t.height / 50,
        nearZ = max(nz * pitchAngle, nz),
        h = t.height,
        w = t.width

      if (camera instanceof OrthographicCamera) {
        camera.projectionMatrix = makeOrthographicMatrix(
          w / -2,
          w / 2,
          h / 2,
          h / -2,
          nearZ,
          farZ
        )
      } else {
        camera.projectionMatrix = makePerspectiveMatrix(
          t._fov,
          w / h,
          nearZ,
          farZ
        )
      }

      camera.projectionMatrix.elements[8] = (-offset.x * 2) / t.width
      camera.projectionMatrix.elements[9] = (offset.y * 2) / t.height

      const cameraWorldMatrix = new Matrix4()
        .premultiply(cameraTranslateZ)
        .premultiply(new Matrix4().makeRotationX(t._pitch))
        .premultiply(new Matrix4().makeRotationZ(t._angle))

      if (t.elevation)
        cameraWorldMatrix.elements[14] = t._camera.position[2] * worldSize

      camera.matrixWorld.copy(cameraWorldMatrix)

      const zoomPow = t.scale * cameraState.worldSizeRatio

      // Handle scaling and translation of objects in the map in the world's matrix transform, not the camera
      const scale = new Matrix4()
      const translateMap = new Matrix4()
      const rotateMap = new Matrix4()

      scale.makeScale(zoomPow, zoomPow, zoomPow)

      const x = t.x ?? t.point.x
      const y = t.y ?? t.point.y

      translateMap.makeTranslation(-x, y, 0)
      rotateMap.makeRotationZ(Math.PI)

      groupRef.current.matrix = new Matrix4()
        .premultiply(rotateMap)
        .premultiply(cameraState.translateCenter)
        .premultiply(scale)
        .premultiply(translateMap)
    }

    map.on("move", update)
    map.on("resize", update)

    update()
  }, [map, camera, groupRef])
}

export default useCameraSync
