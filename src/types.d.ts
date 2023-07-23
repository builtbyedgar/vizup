/**
 * Types
 */

type Point = {
  x: number
  y: number
}

type Bounds = {
  top: number
  right: number
  bottom: number
  left: number
}

type ChartOptions = {
  size?: number
  margin?: Bounds
  axisX?: any
  axisY?: any
}