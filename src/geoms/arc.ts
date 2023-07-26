export default class Arc {
  context: CanvasRenderingContext2D
  x: number = 0
  y: number = 0
  r: number = 0
  start: number = 0
  end: number = 0
  color: string = 'rgba(0, 0, 0, 0)'
  border: string = '#000000'
  opacity: number
  emphasis: any

  constructor({ context, x, y, r, start, end, color, border, opacity = 1, emphasis }: ArcProps) {
    this.context = context
    this.x = x
    this.y = y
    this.r = r
    this.start = start
    this.end = end
    this.color = color
    this.border = border
    this.opacity = opacity
    this.emphasis = emphasis
  }
  
  draw() {
    const { context, x, y, r, start, end, color, border } = this
    context.beginPath()
    context.arc(x, y, r, start, end, false)
    context.fillStyle = color
    context.strokeStyle = border
    context.fill()
    context.stroke()
    context.closePath()
  }

  emphasize(): void {
    const { context, x, y, r, start, end, color, border, emphasis } = this
    context.beginPath()
    context.arc(x, y, emphasis.r || r, start, end, false)
    context.fillStyle = emphasis.color || color
    context.strokeStyle = emphasis.border || border
    context.fill()
    context.stroke()
    context.closePath()
  }

  unemphasize(): void {
    this.draw()
  }
}
