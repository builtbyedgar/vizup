export default class Canvas {
  container: HTMLDivElement | HTMLElement
  canvas: HTMLCanvasElement
  context: CanvasRenderingContext2D
  size: Size

  constructor(container: HTMLDivElement | HTMLElement) {
    this.container = container
    this.canvas = this.canvas || document.createElement('canvas')
    this.context = this.context || this.canvas.getContext('2d')

    this.resize()

    this.container.appendChild(this.canvas)
  }

  resize(): Size {
    const { width, height } = this.container.getBoundingClientRect()
    const scale = window.devicePixelRatio || 1

    this.canvas.style.width = width + 'px'
    this.canvas.style.height = height + 'px'

    this.canvas.width = width * scale
    this.canvas.height = height * scale
    this.size = { width: width, height: height }

    this.context.scale(scale, scale)

    return this.size
  }

  public getCanvas(): HTMLCanvasElement {
    return this.canvas
  }

  public getContext(): CanvasRenderingContext2D {
    return this.context
  }

  public getSize(): Size {
    return this.size
  }
}
