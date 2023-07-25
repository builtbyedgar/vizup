import {
  add,
  distance,
  drawText,
  encoder,
  getNearestIndex,
  lerp,
  remapPoint,
} from '../utils/utils'

const CIRCLE = Math.PI * 2
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
  container: HTMLElement
  canvas: HTMLCanvasElement
  context: CanvasRenderingContext2D
  options: ChartOptions
  canvasSize: Size

  dataBounds: Bounds
  defaultDataBounds: Bounds
  pixelBounds: Bounds
  dataRange: DataRange
  dataTransfer: ChartDataTransfer = {
    offset: { x: 0, y: 0 },
    scale: 1,
  }
  dataInfo: ChartDataInfo = {
    start: { x: 0, y: 0 },
    end: { x: 0, y: 0 },
    offset: { x: 0, y: 0 },
    dragging: false,
  }
  nearestItemToMouse: any = null

  constructor({ type = 'point', container, data, options }: ChartProps<T>) {
    this.container = container
    this.options = { ...OPTIONS, ...options }

    this.data = data.map((dato) => {
      if (this.options.encode) {
        const { encode } = this.options
        return encoder(dato, encode)
      }

      return dato
    })

    this.setCanvas()
    this.setData()
    this.draw()
    this.addEventListeners()
  }

  setCanvas(): void {
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
  }

  setData() {
    this.dataTransfer = {
      offset: { x: 0, y: 0 },
      scale: 1,
    }
    this.dataInfo = {
      start: { x: 0, y: 0 },
      end: { x: 0, y: 0 },
      offset: { x: 0, y: 0 },
      dragging: false,
    }

    this.dataBounds = this.getDataBounds()
    this.defaultDataBounds = { ...this.dataBounds }
    this.pixelBounds = this.getPixelBounds()
  }

  resize(): void {
    this.setCanvas()
    this.setData()
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

  draw(): void {
    const { canvasSize, context, data, nearestItemToMouse } = this
    context.clearRect(0, 0, canvasSize.width, canvasSize.height)

    this.drawData(data)

    if (nearestItemToMouse) {
      this.emphasize(nearestItemToMouse)
    }

    this.drawAxes()
    // this.drawThresholdLine(0, 'green')
    // this.drawThresholdLine(1, 'orange')
    // this.drawThresholdLine(-0.5, 'red')
  }

  emphasize(item: any): void {
    const { context, dataBounds, pixelBounds } = this
    const p = remapPoint(dataBounds, pixelBounds, {
      x: item.x,
      y: item.y,
    })

    /** @todo scale the point */
    this.drawPoint(context, p, `rgba(62, 166, 255, 1)`, 12)
  }

  drawData(data: any): void {
    const { context, dataBounds, pixelBounds, dataRange } = this
    const { min, max } = dataRange
    const range = (min - max) * -1

    for (const item of data) {
      /**
       * @todo esto se puede sacar a una función
       *
       * @note como vemos le sumamos/restamos la mitad del tamaño de los circulos para que
       * queden dentro. Esto hay que pensarlo bien.
       *
       * @note el cálculo del color se debería hacer en el mapeo inicial de los datos.
       **/
      const point: Point = remapPoint(dataBounds, pixelBounds, {
        x: item.x,
        y: item.y,
      })

      const opacity = (item.y - min) / range
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
    size: number = CIRCLE_SIZE
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
    const { canvasSize, context, options, pixelBounds } = this
    const position: Point = {
      x: canvasSize.width / 2,
      y: pixelBounds.bottom + 12,
    }

    // context.clearRect(0, 0, canvasSize.width, options.margin.top)
    // context.clearRect(0, 0, options.margin.left, canvasSize.height)
    // context.clearRect(
    //   0,
    //   canvasSize.height - options.margin.bottom,
    //   canvasSize.width,
    //   options.margin.bottom
    // )
    // context.clearRect(
    //   canvasSize.width - options.margin.right,
    //   0,
    //   options.margin.right,
    //   canvasSize.height
    // )

    drawText({
      context: context,
      text: 'Value',
      point: position,
      size: 12,
    })

    context.save()

    // Draw the axis X line
    context.beginPath()
    context.moveTo(pixelBounds.left, pixelBounds.bottom)
    context.lineTo(pixelBounds.right, pixelBounds.bottom)
    context.lineWidth = 1
    context.strokeStyle = 'rgb(245, 245, 245)'
    context.stroke()

    context.restore()
    // Draw the axis Y line
    // context.beginPath()
    // context.moveTo(pixelBounds.left, pixelBounds.top)
    // context.lineTo(pixelBounds.left, pixelBounds.bottom)
    // context.lineWidth = 1
    // context.strokeStyle = 'lightgrey'
    // context.stroke()
  }

  drawThresholdLine(value: number = 0, color: string = 'darkgrey'): void {
    const { context, dataBounds, dataRange, pixelBounds } = this
    const height = pixelBounds.bottom - pixelBounds.top
    const range = (dataRange.min - dataRange.max) * -1
    const escalaY = height / range
    const zero = dataBounds.top + height - (value - dataRange.min) * escalaY

    // Draw the axis X line
    context.beginPath()
    context.moveTo(pixelBounds.left, zero)
    context.lineTo(pixelBounds.right, zero)
    context.lineWidth = 1
    context.strokeStyle = color
    context.stroke()
  }

  addEventListeners(): void {
    const { canvas, data, dataBounds, dataInfo, dataTransfer, pixelBounds } =
      this

    /** @todo esto hay que pensalo bien */
    // canvas.addEventListener('mousedown', (event: MouseEvent) => {
    //   const dataLocation: Point = this.getMouse(event, true)
    //   dataInfo.start = dataLocation
    //   dataInfo.dragging = true
    // })

    canvas.addEventListener('mousemove', (event: MouseEvent) => {
      // if (dataInfo.dragging) {
      //   const dataLocation: Point = this.getMouse(event, true)
      //   dataInfo.end = dataLocation
      //   const offset = substract(dataInfo.start, dataInfo.end)
      //   dataInfo.offset = scale(offset, dataTransfer.scale)
      //   const newOffset = add(dataTransfer.offset, dataInfo.offset)

      //   this.updateDataBounce(newOffset, dataTransfer.scale)
      // }

      const pLocation = this.getMouse(event)
      const point = remapPoint(dataBounds, pixelBounds, pLocation)
      const points = data.map((item) =>
        remapPoint(dataBounds, pixelBounds, { x: item.x, y: item.y })
      )
      const index = getNearestIndex(point, points)
      const dist = distance(points[index], point)

      if (dist < CIRCLE_SIZE) {
        this.nearestItemToMouse = data[index]
      } else {
        this.nearestItemToMouse = null
      }

      this.draw()
    })

    canvas.addEventListener('mouseup', (event: MouseEvent) => {
      dataTransfer.offset = add(dataTransfer.offset, dataInfo.offset)
      dataInfo.dragging = false
      dataInfo.end = { x: 0, y: 0 }
      dataInfo.offset = { x: 0, y: 0 }
    })

    /** @todo esto hay que pensalo bien */
    // canvas.addEventListener('wheel', (event: WheelEvent) => {
    //   event.preventDefault()
    //   const dir = Math.sign(event.deltaY)
    //   const step = 0.02

    //   dataTransfer.scale += dir * step
    //   /** @note  Limitamos el zoom */
    //   dataTransfer.scale = Math.max(step, Math.min(2, dataTransfer.scale))

    //   this.updateDataBounce(dataTransfer.offset, dataTransfer.scale)
    //   this.draw()
    // })
  }

  updateDataBounce(offset: Point, scale: number): void {
    const { dataBounds, defaultDataBounds } = this

    dataBounds.left = defaultDataBounds.left + offset.x
    dataBounds.right = defaultDataBounds.right + offset.x
    dataBounds.top = defaultDataBounds.top + offset.y
    dataBounds.bottom = defaultDataBounds.bottom + offset.y

    const center: Point = {
      x: (dataBounds.left + dataBounds.right) * 0.5,
      y: (dataBounds.top + dataBounds.bottom) * 0.5,
    }
    dataBounds.left = lerp(center.x, dataBounds.left, scale)
    dataBounds.right = lerp(center.x, dataBounds.right, scale)
    dataBounds.top = lerp(center.y, dataBounds.top, scale)
    dataBounds.bottom = lerp(center.y, dataBounds.bottom, scale)
  }

  getMouse(event: MouseEvent, dataSpace: boolean = true): Point {
    const { canvas, defaultDataBounds, pixelBounds } = this
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
}
