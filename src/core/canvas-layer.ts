import Shape from '../shapes/shape'
import { createCircles, createLines } from '../utils'
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
    const { context, data, dataBounds, pixelBounds, type, datasetProps } = this
    const { bottom: min, top: max } = dataBounds
    const range = (min - max) * -1

    switch (type) {
      case 'line': {
        this.shapes = createLines(context, data, dataBounds, pixelBounds, datasetProps)
        break
      }
      case 'plot': {
        this.shapes = createCircles(
          context,
          data,
          min,
          range,
          dataBounds,
          pixelBounds
        )
        break
      }
    }
  }

  renderShapes(): void {
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
