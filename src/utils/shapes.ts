import { Circle, Line } from '../shapes'
import { interpolateColor, remapPoint } from './utils'

export function createCircles(
  context,
  data,
  min,
  range,
  dataBounds,
  pixelBounds
): any {
  const shapes = []
  // const opacity = Math.max(0.1, Math.min(1, q))
  for (const item of data) {
    const q = (item.y - min) / range
    const color = interpolateColor('C7E9C0', '2B8CBE', q)

    const point: Point = remapPoint(dataBounds, pixelBounds, {
      x: item.x,
      y: item.y,
    })

    shapes.push(
      new Circle({
        context: context,
        x: point.x,
        y: point.y,
        r: 3,
        color: 'transparent',
        border: `#${color}`,
        opacity: 1,
        emphasis: {
          r: 5,
          color: `#${color}`,
        },
      })
    )
  }

  return shapes
}

export function createLines(context, data, dataBounds, pixelBounds, datasetProps): any {
  const points: Point[] = []
  const shapes = []

  for (const item of data) {
    const point: Point = remapPoint(dataBounds, pixelBounds, {
      x: item.x,
      y: item.y,
    })

    points.push(point)
  }

  const shapeProps = datasetProps as DatasetLineProps
  shapes.push(new Line({ context, points, shapeProps }))

  return shapes
}
