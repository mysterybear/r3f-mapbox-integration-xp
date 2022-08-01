import { Matrix4 } from "three"
import { EARTH_CIRCUMFERENCE } from "./constants"

const { cos } = Math

export const clamp = (n: number, min: number, max: number) =>
  Math.min(max, Math.max(min, n))

export const makePerspectiveMatrix = (
  fovy: number,
  aspect: number,
  near: number,
  far: number
) => {
  var out = new Matrix4()
  var f = 1.0 / Math.tan(fovy / 2),
    nf = 1 / (near - far)

  var newMatrix = [
    f / aspect,
    0,
    0,
    0,
    0,
    f,
    0,
    0,
    0,
    0,
    (far + near) * nf,
    -1,
    0,
    0,
    2 * far * near * nf,
    0,
  ]

  out.elements = newMatrix
  return out
}

//[jscastro] new orthographic matrix calculations https://en.wikipedia.org/wiki/Orthographic_projection and validated with https://bit.ly/3rPvB9Y
export const makeOrthographicMatrix = (
  left: number,
  right: number,
  top: number,
  bottom: number,
  near: number,
  far: number
) => {
  var out = new Matrix4()

  const w = 1.0 / (right - left)
  const h = 1.0 / (top - bottom)
  const p = 1.0 / (far - near)

  const x = (right + left) * w
  const y = (top + bottom) * h
  const z = near * p

  var newMatrix = [
    2 * w,
    0,
    0,
    0,
    0,
    2 * h,
    0,
    0,
    0,
    0,
    -1 * p,
    0,
    -x,
    -y,
    -z,
    1,
  ]

  out.elements = newMatrix
  return out
}

export const circumferenceAtLatitude = (latitude: number) =>
  EARTH_CIRCUMFERENCE * cos((latitude * Math.PI) / 180)

export const mercatorZfromAltitude = (altitude: number, lat: number) =>
  altitude / circumferenceAtLatitude(lat)

export const reverseV2 = ([x, y]: [number, number]): [number, number] => [y, x]
