export function lerp(a: number, b: number, percent: number): number {
  return a + (b - a) * percent
}

function lerpInv(a: number, b: number, percent: number): number {
  return (percent - a) / (b - a)
}

export function remap(
  oldA: number,
  oldB: number,
  newA: number,
  newB: number,
  value: number
): number {
  return lerp(newA, newB, lerpInv(oldA, oldB, value))
}

export function remapPoint(
  oldBounds: Bounds,
  newBounds: Bounds,
  point: Point
): Point {
  return {
    x: remap(
      oldBounds.left,
      oldBounds.right,
      newBounds.left,
      newBounds.right,
      point.x
    ),
    y: remap(
      oldBounds.top,
      oldBounds.bottom,
      newBounds.top,
      newBounds.bottom,
      point.y
    ),
  }
}

export function add(p1: Point, p2: Point): Point {
  return {
    x: p1.x + p2.x,
    y: p1.y + p2.y,
  }
}

export function substract(p1: Point, p2: Point): Point {
  return {
    x: p1.x - p2.x,
    y: p1.y - p2.y,
  }
}

export function scale(p: Point, factor: number): Point {
  return {
    x: p.x * factor,
    y: p.y * factor,
  }
}

export function distance(p1: Point, p2: Point): number {
  return Math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2)
}

export function getNearestIndex(location: Point, points: any[]): number {
  const len = points.length
  let min = Number.MAX_SAFE_INTEGER
  let index = 0

  for (let i = 0; i < len; i++) {
    const point = points[i]
    const dist = distance(location, point)

    if (dist < min) {
      min = dist
      index = i
    }
  }

  return index
}

export function interpolateColor(c0: string, c1: string, f: number): string {
  const color0 = c0.match(/.{1,2}/g).map((oct) => parseInt(oct, 16) * (1 - f))
  const color1 = c1.match(/.{1,2}/g).map((oct) => parseInt(oct, 16) * f)
  let ci = [0, 1, 2].map((i) =>
    Math.min(Math.round(color0[i] + color1[i]), 255)
  )
  return (
    ci
      .reduce((a, v) => (a << 8) + v, 0)
      .toString(16)
      // @ts-ignore
      .padStart(6, '0')
  )
}

export function debounce(func, timeout) {
  var timeoutID,
    timeout = timeout || 200
  return function () {
    var scope = this,
      args = arguments
    clearTimeout(timeoutID)
    timeoutID = setTimeout(function () {
      func.apply(scope, Array.prototype.slice.call(args))
    }, timeout)
  }
}

export function radiansToDegrees(radians: number): number {
  return radians * (180 / Math.PI)
}

export function degreesToRadians(degrees: number): number {
  return degrees * (Math.PI / 180)
}
