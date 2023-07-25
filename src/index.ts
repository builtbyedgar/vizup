/**
 * Para el ejemplo ChatGPT ha generado los datos comparativos del uso de TypeScript y
 * Javascript sobre los diez años anteriores a su entrenamiento.
 */

import Chart from './core/chart'
import dataPlot from './data/dataPlot'
import dataLine from './data/dataLine'

// Parse dataPlot
// const data = dataPlot.map(dato => ({
//   value: dato.value,
//   date: new Date(dato.date),
// }))

// Parse dataLine
const data = dataPlot
const encode = { x: (d) => new Date(d.date), y: 'value' }

const container = document.querySelector('#chart') as HTMLElement
const options: any = {
  axisX: 'date',
  axisY: 'unemployment',
  encode,
}
const chart = new Chart({ container, data, options })

window.addEventListener('resize', () => chart.resize(), false)
