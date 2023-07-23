import { drawText, remap } from '../utils/utils'

const CIRCLE = Math.PI * 2

const OPTIONS: ChartOptions = {
  margin: { top: 8, left: 8, bottom: 8, right: 8 },
  axisX: {
    label: 'data',
  },
  axisY: {
    label: 'value',
  },
}

export default class Chart {
  data: any
  container: HTMLElement
  canvas: HTMLCanvasElement
  context: CanvasRenderingContext2D
  options: ChartOptions
  canvasSize: Size

  dataBounds: Bounds
  pixelBounds: Bounds

  constructor(
    container: HTMLElement,
    data: any,
    options: ChartOptions = OPTIONS
  ) {
    this.container = container
    this.data = data.map((d) => ({ ...d, date: new Date(d.date) }))
    this.options = options

    this.init()
  }

  init() {
    const box = this.container.getBoundingClientRect()
    const scale = window.devicePixelRatio || 1

    this.canvas = document.createElement('canvas')
    this.context = this.canvas.getContext('2d')

    this.canvas.style.width = box.width + 'px'
    this.canvas.style.height = box.height + 'px'

    this.canvas.width = box.width * scale
    this.canvas.height = box.height * scale
    this.canvasSize = {
      width: box.width,
      height: box.height
    }

    this.context.scale(scale, scale)

    this.container.appendChild(this.canvas)

    this.dataBounds = this.getDataBounds()
    this.pixelBounds = this.getPixelBounds()

    this.draw()
  }

  getPixelBounds(): Bounds {
    const bounds: Bounds = {
      top: this.options.margin.top,
      right: this.canvasSize.width - this.options.margin.right,
      bottom: this.canvasSize.height - this.options.margin.bottom,
      left: this.options.margin.left,
    }

    return bounds
  }

  getDataBounds(): Bounds {
    const x = this.data.map((d) => d.date)
    const y = this.data.map((d) => d.value)
    const minX = Math.min(...x)
    const maxX = Math.max(...x)
    const minY = Math.min(...y)
    const maxY = Math.max(...y)

    const bounds: Bounds = {
      top: maxY,
      right: maxX,
      bottom: minY,
      left: minX,
    }

    return bounds
  }

  draw(): void {
    const { canvas, context } = this
    // Limpiamos el canvas
    this.context.globalAlpha = 0.5
    context.clearRect(0, 0, canvas.width, canvas.height)
    this.context.globalAlpha = 1

    this.drawData()
    this.drawAxes()
  }

  drawData(): void {
    const { context, data, dataBounds, pixelBounds } = this

    for (const item of data) {
      /** @todo esto se puede sacar a una función */
      const point: Point = {
        x: remap(
          dataBounds.left,
          dataBounds.right,
          pixelBounds.left,
          pixelBounds.right,
          item.date
        ),
        y: remap(
          dataBounds.top,
          dataBounds.bottom,
          pixelBounds.top,
          pixelBounds.bottom,
          item.value
        ),
      }

      this.drawPoint(context, point, 'rgba(62, 166, 255, 0.75)')
    }
  }

  /**
   * @todo
   *
   * Esto debería ser una clase Primitives/Circle
   */
  drawPoint(
    context: CanvasRenderingContext2D,
    point: Point,
    color: string = 'black',
    size: number = 6
  ): void {
    context.beginPath()
    context.fillStyle = color
    context.strokeStyle = '1px solid black'
    context.arc(point.x, point.y, size / 2, 0, CIRCLE)
    context.fill()
    context.stroke()
  }

  drawAxes() {
    const position: Point = {
      x: this.canvasSize.width / 2,
      y: this.pixelBounds.bottom,
    }
    drawText({ context: this.context, text: 'Value', point: position, size: 14 })
  }
}
