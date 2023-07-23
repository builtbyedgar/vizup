function lerp(a: number, b: number, percent: number): number {
  return a + (b - a) * percent
}

function lerpInv(a: number, b: number, percent: number): number {
  return (percent - a) / (b - a)
}

export function remap(oldA, oldB, newA, newB, value): number {
  return lerp(newA, newB, lerpInv(oldA, oldB, value))
}

export function drawText({
  context,
  text,
  point,
  align = 'center',
  verticalAlign = 'middle',
  size = 10,
  color = 'black',
}: {
  context: CanvasRenderingContext2D
  text: string
  point: Point
  align?: CanvasTextAlign
  verticalAlign?: CanvasTextBaseline
  size?: number
  color?: string
}): void {
  context.textAlign = align
  context.textBaseline = verticalAlign
  context.font = `${size}px SF Pro`
  context.fillStyle = color
  context.fillText(text, point.x, point.y)
}
