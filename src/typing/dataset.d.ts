type Primitive = number | string | boolean | Date | Function

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

type DatasetShapeType = 'plot' | 'line'

type DatasetPlotProps = {
  color?: string
  radius?: number
  borderColor?: string
  opacity?: number
  /** @todo implemet */
  emphasis?: {
    radius?: number
    color?: string
    borderColor?: string
    opacity?: number
  }
}

type DatasetLineProps = {
  color?: string
  lineWidth: number
  opacity?: number
  lineType?: LineType
  /** @todo implemet */
  emphasis?: {
    color: string
    lineWidth: number
    opacity?: number
  }
}

type ChartDatasetProps<T = any> =
  | {
      type: 'plot' | 'line'
      data: T[]
      encode?: Encode
    }
  | ({
      type: 'plot'
      data: T[]
      encode?: Encode
    } & DatasetPlotProps)
  | ({
      type: 'line'
      data: T[]
      encode?: Encode
    } & DatasetLineProps)

type ChartOptions = {
  margin?: Bounds
  xAxis?: string | boolean
  yAxis?: string | boolean
  datasets: ChartDatasetProps[]
}

type ChartDefaultOptions = Omit<ChartOptions, 'datasets'>

type ChartProps = {
  container: HTMLElement
  options: ChartOptions
}
