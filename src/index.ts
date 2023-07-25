/**
 * Para el ejemplo ChatGPT ha generado los datos comparativos del uso de TypeScript y
 * Javascript sobre los diez años anteriores a su entrenamiento.
 */

import Chart from './core/chart'
// import data from './data/dataPlot'
import data from './data/dataLine'

// console.table(data);

const container = document.querySelector('#chart') as HTMLElement
const options: any = {
  axisX: 'date',
  axisY: 'unemployment'
}
const chart = new Chart({ container, data, options })

window.addEventListener('resize', () => chart.resize(), false)
