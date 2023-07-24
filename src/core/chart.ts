import { drawText, remap } from '../utils/utils'

const CIRCLE = Math.PI * 2

const OPTIONS: ChartOptions = {
  margin: { top: 20, left: 40, bottom: 20, right: 40 },
  axisX: {
    label: 'data',
  },
  axisY: {
    label: 'value',
  },
}

/**
 * https://www.youtube.com/watch?v=n8uCt1TSGKE&t=4743s
 */
export default class Chart {
  data: any
  container: HTMLElement
  canvas: HTMLCanvasElement
  context: CanvasRenderingContext2D
  options: ChartOptions
  canvasSize: Size

  dataBounds: Bounds
  pixelBounds: Bounds
  dataRange: DataRange

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

    this.canvas = this.canvas || document.createElement('canvas')
    this.context = this.context || this.canvas.getContext('2d')

    this.canvas.style.width = box.width + 'px'
    this.canvas.style.height = box.height + 'px'

    this.canvas.width = box.width * scale
    this.canvas.height = box.height * scale
    this.canvasSize = {
      width: box.width,
      height: box.height,
    }

    this.context.scale(scale, scale)

    this.container.appendChild(this.canvas)

    this.dataBounds = this.getDataBounds()
    this.pixelBounds = this.getPixelBounds()

    this.draw()
  }

  resize(): void {
    console.log('RESIZE')
    this.init()
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

    this.dataRange = { min: minY, max: maxY }

    const bounds: Bounds = {
      top: maxY,
      right: maxX,
      bottom: minY,
      left: minX,
    }

    return bounds
  }

  draw(): void {
    const { canvasSize, context } = this
    // Limpiamos el canvas
    this.context.globalAlpha = 0.5
    context.clearRect(0, 0, canvasSize.width, canvasSize.height)
    this.context.globalAlpha = 1

    this.drawData()
    this.drawAxes()
    this.drawThresholdLine(0, 'green')
    this.drawThresholdLine(1, 'orange')
    this.drawThresholdLine(-0.5, 'red')
  }

  drawData(): void {
    const { context, data, dataBounds, pixelBounds, dataRange } = this
    const { min, max } = dataRange
    const range = (min - max) * -1

    for (const item of data) {
      /**
       * @todo esto se puede sacar a una función
       *
       * @note como vemos le sumamos/restamos la mitad del tamaño de los circulos para que
       * queden dentro. Esto hay que pensarlo bien
       **/
      const point: Point = {
        x: remap(
          dataBounds.left,
          dataBounds.right,
          pixelBounds.left + 4,
          pixelBounds.right - 4,
          item.date
        ),
        y: remap(
          dataBounds.top,
          dataBounds.bottom,
          pixelBounds.top + 4,
          pixelBounds.bottom - 4,
          item.value
        ),
      }

      const opacity = (item.value - min) / range
      const normalize = Math.max(0.1, Math.min(1, opacity))
      this.drawPoint(context, point, `rgba(62, 166, 255, ${normalize})`)
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
    context.strokeStyle = 'rgba(0, 0, 0, 0.4)'
    context.arc(point.x, point.y, size / 2, 0, CIRCLE)
    context.fill()
    context.stroke()
  }

  /**
   * 
   */
  drawAxes(): void {
    const position: Point = {
      x: this.canvasSize.width / 2,
      y: this.pixelBounds.bottom + 12,
    }

    this.context.save()
    
    drawText({
      context: this.context,
      text: 'Value',
      point: position,
      size: 12,
    })

    this.context.restore()

    // Draw the axis X line
    this.context.beginPath()
    this.context.moveTo(this.pixelBounds.left, this.pixelBounds.bottom)
    this.context.lineTo(this.pixelBounds.right, this.pixelBounds.bottom)
    this.context.lineWidth = 1
    this.context.strokeStyle = 'lightgrey'
    this.context.stroke()

    // Draw the axis Y line
    // this.context.beginPath()
    // this.context.moveTo(this.pixelBounds.left, this.pixelBounds.top)
    // this.context.lineTo(this.pixelBounds.left, this.pixelBounds.bottom)
    // this.context.lineWidth = 1
    // this.context.strokeStyle = 'lightgrey'
    // this.context.stroke()
  }

  drawThresholdLine(value: number = 0, color: string = 'darkgrey'): void {
    const height = this.pixelBounds.bottom - this.pixelBounds.top
    const range = (this.dataRange.min - this.dataRange.max) * -1
    const escalaY = height / range
    const zero = this.dataBounds.top + height - ((value - this.dataRange.min) * escalaY)
    
     // Draw the axis X line
     this.context.beginPath()
     this.context.moveTo(this.pixelBounds.left, zero)
     this.context.lineTo(this.pixelBounds.right, zero)
     this.context.lineWidth = 1
     this.context.strokeStyle = color
     this.context.stroke()
  }
}
