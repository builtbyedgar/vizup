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

type BoundingBox = {
  x: number
  y: number
  top: number
  right: number
  bottom: number
  left: number
  width: number
  height: number
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