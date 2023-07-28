import { Circle, Line } from '../geoms'
import Shape from '../geoms/shape'
import { interpolateColor, remapPoint } from '../utils'
import Canvas from './canvas'

export class CanvasLayer {
  container: HTMLElement
  type: DatasetShapeType
  data: any[] = []
  canvas: Canvas
  context: CanvasRenderingContext2D
  boundingBox: BoundingBox
  dataBounds: Bounds
  pixelBounds: Bounds
  margin: Bounds
  shapes: Shape[] = []

  datasetProps: ChartDatasetProps<any>

  constructor(
    container: HTMLElement,
    dataBounds: Bounds,
    pixelBounds: Bounds,
    margin: Bounds,
    props: any
  ) {
    this.container = container
    this.type = props.type
    this.data = props.data
    this.canvas = new Canvas(container)
    this.context = this.canvas.getContext()
    this.dataBounds = dataBounds
    this.pixelBounds = pixelBounds
    this.margin = margin
    this.datasetProps = props

    this.setup()

    return this
  }
  
  setup() {
    this.boundingBox = {
      x: this.margin.left,
      y: this.margin.top,
      top: this.margin.top,
      right: this.margin.right,
      bottom: this.margin.bottom,
      left: this.margin.left,
      width: this.canvas.getWidth() - this.margin.left - this.margin.right,
      height: this.canvas.getHeight() - this.margin.top - this.margin.bottom,
    }
  
    
    this.shapes.length = 0
    
    this.getNormalizedElements()
    // this.renderFrame() // Only for dev
    this.renderShapes()
  }

  getNormalizedElements(): void {
    const { context, data, dataBounds, pixelBounds, type } = this
    const { bottom: min, top: max } = dataBounds
    const range = (min - max) * -1

    switch (type) {
      case 'line': {
        this.createLines(context, data, dataBounds, pixelBounds)
        break
      }
      case 'plot': {
        this.createCircles(context, data, min, range, dataBounds, pixelBounds)
        break
      }
    }
  }

  createCircles(context, data, min, range, dataBounds, pixelBounds): void {
    // const opacity = Math.max(0.1, Math.min(1, q))
    for (const item of data) {
      const q = (item.y - min) / range
      const color = interpolateColor('C7E9C0', '2B8CBE', q)

      const point: Point = remapPoint(dataBounds, pixelBounds, {
        x: item.x,
        y: item.y,
      })

      this.shapes.push(
        new Circle({
          context: context,
          x: point.x,
          y: point.y,
          r: 3,
          color: 'transparent',
          border: `#${color}`,
          opacity: 1,
          emphasis: {
            r: 5,
            color: `#${color}`,
          },
        })
      )
    }
  }

  createLines(context, data, dataBounds, pixelBounds): void {
    const points: Point[] = []

    for (const item of data) {
      const point: Point = remapPoint(dataBounds, pixelBounds, {
        x: item.x,
        y: item.y,
      })

      points.push(point)
    }

    const shapeProps = this.datasetProps as DatasetLineProps
    this.shapes.push(new Line({ context, points, shapeProps }))
  }

  renderShapes(): void {
    console.log(this.shapes);
    
    this.shapes.forEach((shape) => shape.draw())
  }

  /**
   * Renders a red frame to debugging
   */
  renderFrame(): void {
    const { x, y, width, height } = this.boundingBox
    
    this.context.beginPath()
    this.context.rect(x, y, width, height)
    this.context.strokeStyle = 'red'
    this.context.stroke()
  }
  
  clear(): void {
    const { width, height, top, bottom, left, right } = this.boundingBox
    this.context.clearRect(0, 0, width + right + left, height + top + bottom)
  }
}
