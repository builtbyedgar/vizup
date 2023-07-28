export default class Canvas {
  container: HTMLDivElement | HTMLElement
  canvas: HTMLCanvasElement
  context: CanvasRenderingContext2D
  size: Size

  constructor(container: HTMLDivElement | HTMLElement, size?: BoundingBox) {
    this.container = container
    this.canvas = this.canvas || document.createElement('canvas')
    this.context = this.context || this.canvas.getContext('2d')

    this.resize(size)

    this.container.appendChild(this.canvas)
  }

  resize(size?: BoundingBox): Size {
    let { width, height } = this.container.getBoundingClientRect()
    if (size) {
      width = size.width
      height = size.height
    }
    const scale = window.devicePixelRatio || 1

    this.canvas.style.position = 'abrolute'
    this.canvas.style.top = '0px'
    this.canvas.style.left = '0px'
    this.canvas.style.width = width + 'px'
    this.canvas.style.height = height + 'px'

    this.canvas.width = width * scale
    this.canvas.height = height * scale
    this.size = { width, height }

    this.context.scale(scale, scale)

    return this.size
  }

  public getCanvas(): HTMLCanvasElement {
    return this.canvas
  }

  public getContext(): CanvasRenderingContext2D {
    return this.context
  }

  public getWidth(): number {
    return this.size.width
  }
  
  public getHeight(): number {
    return this.size.height
  }

  public getSize(): Size {
    return this.size
  }
}
