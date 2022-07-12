export const TILE_SIZE = 512
export const WORLD_SIZE = TILE_SIZE * 2000 // 1024000 // TILE_SIZE * 2000
export const EARTH_RADIUS = 6371008.8 //from Mapbox  https://github.com/mapbox/mapbox-gl-js/blob/0063cbd10a97218fb6a0f64c99bf18609b918f4c/src/geo/lng_lat.js#L11
export const EARTH_CIRCUMFERENCE = 2 * Math.PI * EARTH_RADIUS // 40075000 in meters
export const DEFAULT_ORIGIN: [number, number] = [-0.0804, 51.5145]
