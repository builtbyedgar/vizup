/**
 * Para el ejemplo ChatGPT ha generado los datos comparativos del uso de TypeScript y
 * Javascript sobre los diez años anteriores a su entrenamiento.
 */

import Chart from './core/chart'
import data from './data'

// console.table(data);

const container = document.querySelector('#chart') as HTMLElement;
const chart = new Chart(container, data)

