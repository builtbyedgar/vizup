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
}: DrawTextArgs): void {
  context.textAlign = align
  context.textBaseline = verticalAlign
  context.font = `${size}px SF Pro`
  context.fillStyle = color
  context.fillText(text, point.x, point.y)
}
