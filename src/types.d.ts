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

type ChartOptions = {
  margin?: Bounds
  axisX?: any
  axisY?: any
}

type DataRange = {
  min: number, 
  max: number
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