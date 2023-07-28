/**
 * Para el ejemplo ChatGPT ha generado los datos comparativos del uso de TypeScript y
 * Javascript sobre los diez años anteriores a su entrenamiento.
 */

// globalThis.debug = true

import Chart from './core/chart'
import dataPlot from './data/dataPlot'
import dataLine from './data/dataLine'
import dataLine2 from './data/dataLine2'

const encodePlot : Encode = { x: (d) => new Date(d.date), y: 'value' }
const encodeLine = { x: (d) => new Date(d.date), y: 'close' }
const encodeLine2 = { x: (d) => new Date(d.date), y: 'value' }

const container = document.querySelector('#chart') as HTMLElement
const options: ChartOptions = {
  // xAxis: 'date',
  // yAxis: 'value',
  datasets: [
    // {
    //   type: 'plot',
    //   data: dataPlot,
    //   encode: encodePlot,
    // },
    // {
    //   type: 'line',
    //   data: dataLine,
    //   encode: encodeLine,
    //   lineWidth: 2,
    //   color: '#2B8CBE',
    //   lineType: 'custom',
    // },
    {
      type: 'line',
      data: dataLine2,
      encode: encodeLine2,
      lineWidth: 1,
      lineType: 'hvh',
      color: '#2B8CBE'
    }
  ]
}
const chart = new Chart({ container, options })
