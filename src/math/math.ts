/**
 * Linear interpolation
 * 
 * @param a point A
 * @param b point B
 * @param percent 0 - 1
 * 
 * @returns 
 */
export function lerp(a: number, b: number, percent: number): number {
  return a + (b - a) * percent
}

export function lerpInv(a: number, b: number, percent: number): number {
  return (percent - a) / (b - a)
}

export function remap(oldA, oldB, newA, newB, value): number {
  return lerp(newA, newB, lerpInv(oldA, oldB, value))
}
