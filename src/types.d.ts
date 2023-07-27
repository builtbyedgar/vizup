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
type ChartEncodedData = {
  x: string | number
  y: string | number
  color?: string
  size?: number
  // x1?: string | number
  // y1?: string | number
}

type Primitive = number | string | boolean | Date | Function

type MaybeArray<T> = T | T[]

type DynamicObject = {
  [key: string]: Primitive
}

/**
 * @todo
 * Si aquí le pasamos `DataRange` se pueden mapear los datos desde fuera del chart
 * */
type EncodeFunction = (data: Record<string, DynamicObject>[]) => DynamicObject

// type EncodeTypes = 'constant' | 'field' | 'transform' | 'column'

type Encode = DynamicObject | EncodeFunction

type ChartType = 'point' | 'line'

type ChartData<T = any> = {
  type?: ChartType
  data: T[]
}

type ChartOptions = {
  margin?: Bounds
  xAxis?: string | boolean
  yAxis?: string | boolean
  encode?: Encode
  data: ChartData
}

type ChartDefaultOptions = Omit<ChartOptions, 'data'>

type ChartProps = {
  container: HTMLElement
  options: ChartOptions
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

/**
 * Geometries
*/

type ArcProps = {
  context: CanvasRenderingContext2D
  x: number
  y: number
  r: number
  start: number
  end: number
  color?: string
  border?: string
  opacity?: number
  emphasis?: {
    r?: number
    color?: string
    border?: string
    opacity?: number
  }
}

type CircleProps = Omit<ArcProps, 'start' | 'end'>


type ChartConfig<T> = {
  elementId: string
  dataset: T[]

}