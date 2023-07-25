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

export function drawText({
  context,
  text,
  point,
  align = 'center',
  verticalAlign = 'middle',
  size = 10,
  color = 'black',
}: DrawTextArgs): void {
  context.textAlign = align
  context.textBaseline = verticalAlign
  context.font = `${size}px SF Pro`
  context.fillStyle = color
  context.fillText(text, point.x, point.y)
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

export function encoder<T>(obj: T, encode: Encode): T {
  const newObjb = { ...obj }

  for (const key in encode) {
    const fn = encode[key]
    const value = typeof fn === 'function' ? fn(obj) : obj[fn]
    newObjb[key] = value
  }


  return { ...newObjb }
}
