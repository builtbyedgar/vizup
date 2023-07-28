import { Arc, Circle } from '../geoms'
import {
  debounce,
  encodeData,
  remapPoint
} from '../utils'
import Canvas from './canvas'
import { CanvasLayer } from './canvas-layer'

type ChartDataLayer = {
  type: DatasetShapeType
  layer: CanvasLayer
  encode?: Encode
}

const CIRCLE_SIZE = 6

const OPTIONS: ChartDefaultOptions = {
  margin: { top: 20, left: 40, bottom: 20, right: 40 },
  xAxis: 'data',
  yAxis: 'value',
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
export default class Chart {
  canvas: Canvas // Here web draw axes and some "static" content
  dataCanvas: Canvas // Here web draw the data representation
  elements: Arc[] | Circle[] = []
  canvasElement: HTMLCanvasElement
  context: CanvasRenderingContext2D
  options: ChartOptions
  canvasSize: Size
  nearestItemToMouse: any = null
  prevNearestItemToMouse: any = null

  /** 💡 NEW APPROACH */
  /**
   * Guardamos los datos de todos los datasets para calcular los bounds generales para
   * el Chart y que utilizaremos para calcular los bounding boxes de las capas y los min/max values
   **/
  data: any[]
  /** Para pintar las diferentes capasas de datos */
  datasets: ChartDatasetProps[]
  container: HTMLElement
  /** Las diferentes capas del Chart */
  layers: ChartDataLayer[] = []
  // layersData: ChartDataset[] = []
  dataRange: DataRange
  /** Aunque tengamos diferentes datasets han de compartir el mismo */
  dataBounds: Bounds
  defaultDataBounds: Bounds
  /**
   * @todo
   * No se si realmente lo necesitamos puesto que cada layer lo tiene
   * Similar al DataBounds
   **/
  pixelBounds: BoundingBox
  /** Margenes del Canvas */
  margin: Bounds = {
    top: 20,
    right: 30,
    bottom: 60,
    left: 100,
  }

  constructor({ container, options }: ChartProps) {
    this.options = options
    this.datasets = this.options.datasets
    this.container = container
    this.options = { ...OPTIONS, ...options }

    this.data = this.options.datasets.map((dataset) => {
      return dataset.encode
        ? encodeData(dataset.data, dataset.encode)
        : dataset.data
    })    

    this.render()
    this.addEventListeners()
  }

  render(): void {
    for (const { layer } of this.layers) {
      layer.clear()
    }

    /**
     * @performance 👻
     * Resetar así un Array es mucho más eficiente que `array = []` puesto que de ese
     * modo estamos creando otro objeto en memoria y dependemos del GC para que lo elimine.
     */
    this.layers.length = 0
    this.setBounds()
    this.createCanvasLayers()
  }

  createCanvasLayers() {
    for (const index in this.datasets) {
      const { ...props } = this.datasets[index]
      const encoded = encodeData(props.data, props.encode)
      props.data = encoded
      console.log(encoded);
      
      this.layers[index] = {
        type: props.type,
        layer: new CanvasLayer(
          this.container,
          this.dataBounds,
          this.pixelBounds,
          this.margin,
          props,
        ),
      }
    }
  }

  /**
   * Handles the bounding boxes calculation
   */
  setBounds() {
    this.dataBounds = this.getDataBounds()
    this.defaultDataBounds = { ...this.dataBounds }
    this.pixelBounds = this.getPixelBounds()
  }

  /**
   * Calculates the available bounding box for the canvas
   */
  getPixelBounds(): BoundingBox {
    const rect = this.container.getBoundingClientRect()
    return {
      x: rect.x + this.margin.left,
      y: rect.y + this.margin.top,
      top: rect.top + this.margin.top,
      right: rect.right - this.margin.right,
      bottom: rect.bottom - this.margin.bottom,
      left: rect.left + this.margin.left,
      width: rect.width - this.margin.left - this.margin.right,
      height: rect.height - this.margin.top - this.margin.bottom,
    }
  }

  /**
   * Calculates the bounding box relative to the data
   */
  getDataBounds() {
    const data = [].concat.apply([], this.data) as ChartEncodedData[]
    const x = data.map((d) => d.x) as number[]
    const y = data.map((d) => d.y) as number[]
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

  /**
   * Event listener management
   */
  addEventListeners(): void {
    window.addEventListener(
      'resize',
      debounce(() => this.render(), 100),
      false
    )

    /**
     * @todo
     * This isn't efficient. It should be fired every mouse movement and should probably causes
     * performance issues. A possible solution is to move the nearest element find logic to a
     * method that is called on requestAnimationFrame and the mousemove event handler only
     * handle a control variable.
     */
    // canvas.addEventListener('mousemove', (event: MouseEvent) => {
    //   const pLocation = this.getMousePoint(event)
    //   const point = remapPoint(dataBounds, pixelBounds, pLocation)
    //   const points = data.map((item) =>
    //     remapPoint(dataBounds, pixelBounds, { x: item.x, y: item.y })
    //   )

    //   const index = getNearestIndex(point, points)
    //   const dist = distance(points[index], point)

    //   if (dist < CIRCLE_SIZE) {
    //     this.nearestItemToMouse = index
    //   } else {
    //     this.nearestItemToMouse = null
    //   }

    //   // this.draw()
    // })
  }

  /**
   * Get de mouse position relative to the canvas
   */
  getMousePoint(event: MouseEvent, dataSpace: boolean = true): Point {
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
