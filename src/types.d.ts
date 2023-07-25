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

// Data to encode
type ChartData = {
  x: string | number
  y: string | number
  color?: string
  size?: number
  // x1?: string | number
  // y1?: string | number
}

type Primitive = number | string | boolean | Date

type MaybeArray<T> = T | T[]

/**
 * @todo
 * Si aquí le pasamos `DataRange` se pueden mapear los datos desde fuera del chart
 * */
type EncodeFunction = (
  data: Record<string, MaybeArray<Primitive>>[]
) => MaybeArray<Primitive>[]

// type EncodeTypes = 'constant' | 'field' | 'transform' | 'column'

type Encode = MaybeArray<EncodeFunction>

type ChartType = 'point' | 'line'

type ChartOptions<T = undefined> = {
  margin?: Bounds
  axisX?: keyof T | string
  axisY?: keyof T | string
  encode?: Encode
}

type ChartProps<T> = {
  container: HTMLElement
  data: T[]
  type?: ChartType
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
