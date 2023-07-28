import Shape from './shape'

export default class Line extends Shape {
  context: CanvasRenderingContext2D
  points: Point[]
  color: string
  lineWidth: number
  radius: number = 2
  lineType: LineType

  constructor({ context, points, shapeProps }: LineProps) {
    console.log(shapeProps);
    
    super(context)
    this.context = context
    this.points = points
    this.color = shapeProps.color
    this.lineWidth = shapeProps.lineWidth
    this.lineType = shapeProps.lineType
  }

  draw() {
    this.context.strokeStyle = this.color
    this.context.lineWidth = this.lineWidth
    this.context.lineJoin = 'round'

    console.log(this.color);
    
    
    switch (this.lineType) {
      case 'hv':
        this.drawHVLine(this.context, this.points)
        break;
      case 'hvh':
        this.drawHVHLine(this.context, this.points)
        break;
      case 'spline':
        this.drawSplineLine(this.context, this.points)
        break;
      case 'linear':
        this.drawLinearLine(this.context, this.points)
        break;
      case 'custom':
        this.drawCustomLine(this.context, this.points)
        break;
    }
  }

  drawHVLine(ctx, points) {
    ctx.beginPath()
    ctx.moveTo(points[0].x, points[0].y)

    for (let i = 1; i < points.length; i++) {
      ctx.lineTo(points[i].x, points[i - 1].y)
      ctx.lineTo(points[i].x, points[i].y)
    }

    ctx.stroke()
  }

  drawHVHLine(ctx, points) {
    ctx.beginPath()
    ctx.moveTo(points[0].x, points[0].y)

    for (let i = 1; i < points.length; i++) {
      const prevX = points[i - 1].x
      const prevY = points[i - 1].y
      const currX = points[i].x
      const currY = points[i].y

      const midX = (prevX + currX) / 2
      ctx.lineTo(midX, prevY)
      ctx.lineTo(midX, currY)
    }

    ctx.stroke()
  }

  drawSplineLine(ctx, points) {
    ctx.beginPath()
    ctx.moveTo(points[0].x, points[0].y)

    for (let i = 1; i < points.length; i++) {
      const prevX = points[i - 1].x
      const prevY = points[i - 1].y
      const currX = points[i].x
      const currY = points[i].y

      const cpX = (prevX + currX) / 2
      const cpY = (prevY + currY) / 2
      ctx.quadraticCurveTo(prevX, prevY, cpX, cpY)
    }

    ctx.stroke()
  }

  drawLinearLine(ctx, points) {
    ctx.beginPath()
    ctx.moveTo(points[0].x, points[0].y)

    for (let i = 1; i < points.length; i++) {
      ctx.lineTo(points[i].x, points[i].y)
    }

    ctx.stroke()
  }

  drawCustomLine(ctx, points) {
    let i = 0
    ctx.beginPath()
    ctx.moveTo(points[0].x, points[0].y)
    // draw a bunch of quadratics, using the average of two points as the control point
    for (i = 1; i < points.length - 2; i++) {
      const c = (points[i].x + points[i + 1].x) / 2
      const d = (points[i].y + points[i + 1].y) / 2
      ctx.quadraticCurveTo(points[i].x, points[i].y, c, d)
    }
    ctx.quadraticCurveTo(
      points[i].x,
      points[i].y,
      points[i + 1].x,
      points[i + 1].y
    )
    ctx.stroke()
  }
}
