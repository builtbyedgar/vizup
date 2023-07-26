import { Arc, Circle } from '../geoms'
import {
  debounce,
  distance,
  drawText,
  encodeData,
  getNearestIndex,
  interpolateColor,
  remapPoint,
} from '../utils'
import Canvas from './canvas'

const CIRCLE_SIZE = 6

const OPTIONS: ChartOptions = {
  margin: { top: 20, left: 40, bottom: 20, right: 40 },
  axisX: 'data',
  axisY: 'value',
}

/**
 * @refs
 * https://www.youtube.com/watch?v=n8uCt1TSGKE&t=4743s
 *
 *
 * @note
 * Utilizando diferentes capas y una estrategia de optimización adecuada podemos mejorar
 * bastante el performance. Cuando pintamos muchos elementos (1644) con opacidad (L202),
 * el drag va bastante fino, hay que probar con datasets mas grandes.
 * 👀 Cuando pintamos 7470 elementos el mouseover se pilla!
 *
 * https://developer.ibm.com/tutorials/wa-canvashtml5layering/
 */
export default class Chart<T> {
  data: any[] = []
  elements: Arc[] | Circle[] = []
  container: HTMLElement
  canvasElement: HTMLCanvasElement
  context: CanvasRenderingContext2D
  options: ChartOptions
  canvasSize: Size
  canvas: Canvas
  dataBounds: Bounds
  defaultDataBounds: Bounds
  pixelBounds: Bounds
  dataRange: DataRange
  nearestItemToMouse: any = null
  prevNearestItemToMouse: any = null

  constructor({ type = 'point', container, data, options }: ChartProps<T>) {
    this.canvas = new Canvas(container)
    this.canvasElement = this.canvas.canvas
    this.context = this.canvas.context
    this.canvasSize = this.canvas.size

    this.container = container
    this.options = { ...OPTIONS, ...options }

    this.data = this.options.encode
      ? encodeData(data, this.options.encode)
      : data

    this.render()
    this.addEventListeners()
  }

  render(): void {
    this.canvasSize = this.canvas.resize()
    this.setData()
    this.createElements()
    this.draw()
  }

  setData() {
    this.dataBounds = this.getDataBounds()
    this.defaultDataBounds = { ...this.dataBounds }
    this.pixelBounds = this.getPixelBounds()
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
    const x = this.data.map((d) => d.x)
    const y = this.data.map((d) => d.y)
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

  createElements(): void {
    const { context, data, dataBounds, pixelBounds, dataRange } = this
    const { min, max } = dataRange
    const range = (min - max) * -1
    this.elements = []

    for (const item of data) {
      const point: Point = remapPoint(dataBounds, pixelBounds, {
        x: item.x,
        y: item.y,
      })
      // const opacity = Math.max(0.1, Math.min(1, q))
      const q = (item.y - min) / range
      const color = interpolateColor('C7E9C0', '2B8CBE', q)

      const circle = new Circle({
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

      this.elements.push(circle)
    }
  }

  draw(): void {
    const { canvasSize, context } = this

    context.clearRect(0, 0, canvasSize.width, canvasSize.height)

    this.drawAxes()
    this.drawElements()
    // this.drawThresholdLine(0, 'green')
    // this.drawThresholdLine(1, 'orange')
    // this.drawThresholdLine(-0.5, 'red')
  }

  drawElements(): void {
    const { elements } = this

    if (this.nearestItemToMouse !== null) {
      this.prevNearestItemToMouse = this.nearestItemToMouse
      const circle = elements[this.nearestItemToMouse] as Circle
      circle.emphasize()
    }

    if (this.prevNearestItemToMouse !== null) {
      const circle = elements[this.prevNearestItemToMouse] as Circle
      circle.unemphasize()
    }
    this.prevNearestItemToMouse = null
    this.nearestItemToMouse = null

    this.elements.forEach((element) => element.draw())
  }

  drawAxes(): void {
    const { canvasSize, context, pixelBounds } = this
    const position: Point = {
      x: canvasSize.width / 2,
      y: pixelBounds.bottom + 12,
    }

    drawText({
      context: context,
      text: 'Value',
      point: position,
      size: 12,
    })

    context.beginPath()
    context.moveTo(pixelBounds.left, pixelBounds.bottom)
    context.lineTo(pixelBounds.right, pixelBounds.bottom)
    context.lineWidth = 1
    context.strokeStyle = 'rgb(245, 245, 245)'
    context.stroke()
  }

  drawThresholdLine(value: number = 0, color: string = 'darkgrey'): void {
    const { context, dataBounds, dataRange, pixelBounds } = this
    const height = pixelBounds.bottom - pixelBounds.top
    const range = (dataRange.min - dataRange.max) * -1
    const escalaY = height / range
    const zero = dataBounds.top + height - (value - dataRange.min) * escalaY

    context.beginPath()
    context.moveTo(pixelBounds.left, zero)
    context.lineTo(pixelBounds.right, zero)
    context.lineWidth = 1
    context.strokeStyle = color
    context.stroke()
  }

  addEventListeners(): void {
    const { canvasElement: canvas, data, dataBounds, pixelBounds } = this

    window.addEventListener(
      'resize',
      debounce(() => this.render(), 100),
      false
    )

    canvas.addEventListener('mousemove', (event: MouseEvent) => {
      const pLocation = this.getMouse(event)
      const point = remapPoint(dataBounds, pixelBounds, pLocation)
      const points = data.map((item) =>
        remapPoint(dataBounds, pixelBounds, { x: item.x, y: item.y })
      )

      const index = getNearestIndex(point, points)
      const dist = distance(points[index], point)

      if (dist < CIRCLE_SIZE) {
        this.nearestItemToMouse = index
      } else {
        this.nearestItemToMouse = null
      }

      this.draw()
    })
  }

  getMouse(event: MouseEvent, dataSpace: boolean = true): Point {
    const { canvasElement: canvas, defaultDataBounds, pixelBounds } = this
    const box = canvas.getBoundingClientRect()

    /** @question restamos los margenes? */
    const location: Point = {
      x: event.clientX - box.left,
      y: event.clientY - box.top,
    }

    if (dataSpace === true) {
      return remapPoint(pixelBounds, defaultDataBounds, location)
    }

    return location
  }

  destroy(): void {
    /** @todo */
  }
}
