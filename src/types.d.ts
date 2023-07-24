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