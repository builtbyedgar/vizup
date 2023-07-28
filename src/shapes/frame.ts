import Shape from './shape'

export default class Frame extends Shape {
  context: CanvasRenderingContext2D
  boundingBox: BoundingBox

  constructor(context: CanvasRenderingContext2D, boundingBox: BoundingBox) {
    super(context)
    this.context = context
    this.boundingBox = boundingBox
  }

  draw(): void {
    const { ctx, boundingBox } = this

    ctx.beginPath()
    ctx.rect(
      boundingBox.x,
      boundingBox.y,
      boundingBox.width,
      boundingBox.height
    )
    ctx.strokeStyle = 'red'
    ctx.stroke()
  }

  clear(): void {
    const { ctx, boundingBox } = this
    ctx.clearRect(boundingBox.x, boundingBox.y, boundingBox.width, boundingBox.height)
  }
}
