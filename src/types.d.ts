/**
 * Types
 */

type Point = {
  x: number
  y: number
}

type Size = {
  width: number
  height: number
}

type Bounds = {
  top: number
  right: number
  bottom: number
  left: number
}

type ChartDataTransfer = {
  offset: Point
  scale: number
}

type ChartDataInfo = {
  start: Point
  end: Point
  offset: Point
  dragging: boolean
}

type DataRange = {
  min: number
  max: number
}

/**
 * @todo
 * Si aquí le pasamos `DataRange` se pueden mapear los datos desde fuera del chart
 * */
type EncoderMethod = (key: string) => any

type ChartOptions<T = undefined> = {
  margin?: Bounds
  axisX?: keyof T | string
  axisY?: keyof T | string
}

type ChartProps<T = unknown> = {
  container: HTMLElement
  data: T[]
  options?: ChartOptions
}

/**
 * Methods
 */

type DrawTextArgs = {
  context: CanvasRenderingContext2D
  text: string
  point: Point
  align?: CanvasTextAlign
  verticalAlign?: CanvasTextBaseline
  size?: number
  color?: string
}
