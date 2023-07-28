declare enum Shapes {
  Circle = 'Circle',
  Point = 'Point',
}

type ShapeProps = {
  context: CanvasRenderingContext2D
  x: number
  y: number
  color?: string
}

type ArcProps = ShapeProps & {
  r: number
  start: number
  end: number
  border?: string
  opacity?: number
  emphasis?: {
    r?: number
    color?: string
    border?: string
    opacity?: number
  }
}

type CircleProps = ShapeProps & Omit<ArcProps, 'start' | 'end'>

type LineType = 'hv' | 'hvh' | 'spline' | 'linear' | 'custom'

type LineProps = Omit<ShapeProps, 'x' | 'y'> & {
  points: Point[]
  shapeProps?: DatasetLineProps
}
