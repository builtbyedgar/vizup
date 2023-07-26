/**
 * Para el ejemplo ChatGPT ha generado los datos comparativos del uso de TypeScript y
 * Javascript sobre los diez años anteriores a su entrenamiento.
 */

import Chart from './core/chart'
import dataPlot from './data/dataPlot'
import dataLine from './data/dataLine'

const data = dataPlot
// const encode: Encode = { x: (d) => new Date(d.date), y: 'unemployment' }  // dataLine
const encode = { x: (d) => new Date(d.date), y: 'value' } // dataPlot

const container = document.querySelector('#chart') as HTMLElement
const options: ChartOptions = {
  axisX: 'date',
  axisY: 'unemployment',
  encode,
}
const chart = new Chart({ container, data, options })
console.log(chart)
