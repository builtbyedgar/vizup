import Arc from './arc'

export default class Circle extends Arc {
  constructor({ context, x, y, r, color, border, emphasis }: CircleProps) {
    super({ context, x, y, r, start: 0, end: Math.PI * 2, color, border, emphasis })
  }
  
  draw() {
    super.draw()
  }
}
