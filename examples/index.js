/******/ /* webpack/runtime/compat */
/******/ 
/******/ if (typeof __nccwpck_require__ !== 'undefined') __nccwpck_require__.ab = new URL('.', import.meta.url).pathname.slice(import.meta.url.match(/^file:\/\/\/\w:/) ? 1 : 0, -1) + "/";
/******/ 
/************************************************************************/
var __webpack_exports__ = {};

;// CONCATENATED MODULE: ./src/utils/data.ts
function encode(obj, encode) {
    const newObjb = Object.assign({}, obj);
    for (const key in encode) {
        const fn = encode[key];
        const value = typeof fn === 'function' ? fn(obj) : obj[fn];
        newObjb[key] = value;
    }
    return Object.assign({}, newObjb);
}
function encodeData(data, encoders) {
    return data.map((dato) => encode(dato, encoders));
}

;// CONCATENATED MODULE: ./src/utils/utils.ts
function lerp(a, b, percent) {
    return a + (b - a) * percent;
}
function lerpInv(a, b, percent) {
    return (percent - a) / (b - a);
}
function remap(oldA, oldB, newA, newB, value) {
    return lerp(newA, newB, lerpInv(oldA, oldB, value));
}
function remapPoint(oldBounds, newBounds, point) {
    return {
        x: remap(oldBounds.left, oldBounds.right, newBounds.left, newBounds.right, point.x),
        y: remap(oldBounds.top, oldBounds.bottom, newBounds.top, newBounds.bottom, point.y),
    };
}
function add(p1, p2) {
    return {
        x: p1.x + p2.x,
        y: p1.y + p2.y,
    };
}
function substract(p1, p2) {
    return {
        x: p1.x - p2.x,
        y: p1.y - p2.y,
    };
}
function scale(p, factor) {
    return {
        x: p.x * factor,
        y: p.y * factor,
    };
}
function distance(p1, p2) {
    return Math.sqrt(Math.pow((p1.x - p2.x), 2) + Math.pow((p1.y - p2.y), 2));
}
function getNearestIndex(location, points) {
    const len = points.length;
    let min = Number.MAX_SAFE_INTEGER;
    let index = 0;
    for (let i = 0; i < len; i++) {
        const point = points[i];
        const dist = distance(location, point);
        if (dist < min) {
            min = dist;
            index = i;
        }
    }
    return index;
}
function interpolateColor(c0, c1, f) {
    const color0 = c0.match(/.{1,2}/g).map((oct) => parseInt(oct, 16) * (1 - f));
    const color1 = c1.match(/.{1,2}/g).map((oct) => parseInt(oct, 16) * f);
    let ci = [0, 1, 2].map((i) => Math.min(Math.round(color0[i] + color1[i]), 255));
    return (ci
        .reduce((a, v) => (a << 8) + v, 0)
        .toString(16)
        // @ts-ignore
        .padStart(6, '0'));
}
function debounce(func, timeout) {
    var timeoutID, timeout = timeout || 200;
    return function () {
        var scope = this, args = arguments;
        clearTimeout(timeoutID);
        timeoutID = setTimeout(function () {
            func.apply(scope, Array.prototype.slice.call(args));
        }, timeout);
    };
}
function radiansToDegrees(radians) {
    return radians * (180 / Math.PI);
}
function degreesToRadians(degrees) {
    return degrees * (Math.PI / 180);
}

;// CONCATENATED MODULE: ./src/shapes/shape.ts
class Shape {
    constructor(ctx) {
        this.ctx = ctx;
    }
    draw() { }
}

;// CONCATENATED MODULE: ./src/shapes/arc.ts

class Arc extends Shape {
    constructor({ context, x, y, r, start, end, color, border, opacity = 1, emphasis }) {
        super(context);
        this.x = 0;
        this.y = 0;
        this.r = 0;
        this.start = 0;
        this.end = 0;
        this.color = 'rgba(0, 0, 0, 0)';
        this.border = '#000000';
        this.context = context;
        this.x = x;
        this.y = y;
        this.r = r;
        this.start = start;
        this.end = end;
        this.color = color;
        this.border = border;
        this.opacity = opacity;
        this.emphasis = emphasis;
    }
    draw() {
        const { context, x, y, r, start, end, color, border } = this;
        context.beginPath();
        context.arc(x, y, r, start, end, false);
        context.fillStyle = color;
        context.strokeStyle = border;
        context.fill();
        context.stroke();
        context.closePath();
    }
    emphasize() {
        const { context, x, y, r, start, end, color, border, emphasis } = this;
        context.beginPath();
        context.arc(x, y, emphasis.r || r, start, end, false);
        context.fillStyle = emphasis.color || color;
        context.strokeStyle = emphasis.border || border;
        context.fill();
        context.stroke();
        context.closePath();
    }
    unemphasize() {
        this.draw();
    }
}

;// CONCATENATED MODULE: ./src/shapes/circle.ts

class Circle extends Arc {
    constructor({ context, x, y, r, color, border, emphasis }) {
        super({ context, x, y, r, start: 0, end: Math.PI * 2, color, border, emphasis });
    }
    draw() {
        super.draw();
    }
}

;// CONCATENATED MODULE: ./src/shapes/line.ts

class Line extends Shape {
    constructor({ context, points, shapeProps }) {
        console.log(shapeProps);
        super(context);
        this.radius = 2;
        this.context = context;
        this.points = points;
        this.color = shapeProps.color;
        this.lineWidth = shapeProps.lineWidth;
        this.lineType = shapeProps.lineType;
    }
    draw() {
        this.context.strokeStyle = this.color;
        this.context.lineWidth = this.lineWidth;
        this.context.lineJoin = 'round';
        console.log(this.color);
        switch (this.lineType) {
            case 'hv':
                this.drawHVLine(this.context, this.points);
                break;
            case 'hvh':
                this.drawHVHLine(this.context, this.points);
                break;
            case 'spline':
                this.drawSplineLine(this.context, this.points);
                break;
            case 'linear':
                this.drawLinearLine(this.context, this.points);
                break;
            case 'custom':
                this.drawCustomLine(this.context, this.points);
                break;
        }
    }
    drawHVLine(ctx, points) {
        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);
        for (let i = 1; i < points.length; i++) {
            ctx.lineTo(points[i].x, points[i - 1].y);
            ctx.lineTo(points[i].x, points[i].y);
        }
        ctx.stroke();
    }
    drawHVHLine(ctx, points) {
        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);
        for (let i = 1; i < points.length; i++) {
            const prevX = points[i - 1].x;
            const prevY = points[i - 1].y;
            const currX = points[i].x;
            const currY = points[i].y;
            const midX = (prevX + currX) / 2;
            ctx.lineTo(midX, prevY);
            ctx.lineTo(midX, currY);
        }
        ctx.stroke();
    }
    drawSplineLine(ctx, points) {
        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);
        for (let i = 1; i < points.length; i++) {
            const prevX = points[i - 1].x;
            const prevY = points[i - 1].y;
            const currX = points[i].x;
            const currY = points[i].y;
            const cpX = (prevX + currX) / 2;
            const cpY = (prevY + currY) / 2;
            ctx.quadraticCurveTo(prevX, prevY, cpX, cpY);
        }
        ctx.stroke();
    }
    drawLinearLine(ctx, points) {
        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);
        for (let i = 1; i < points.length; i++) {
            ctx.lineTo(points[i].x, points[i].y);
        }
        ctx.stroke();
    }
    drawCustomLine(ctx, points) {
        let i = 0;
        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);
        // draw a bunch of quadratics, using the average of two points as the control point
        for (i = 1; i < points.length - 2; i++) {
            const c = (points[i].x + points[i + 1].x) / 2;
            const d = (points[i].y + points[i + 1].y) / 2;
            ctx.quadraticCurveTo(points[i].x, points[i].y, c, d);
        }
        ctx.quadraticCurveTo(points[i].x, points[i].y, points[i + 1].x, points[i + 1].y);
        ctx.stroke();
    }
}

;// CONCATENATED MODULE: ./src/utils/shapes.ts


function createCircles(context, data, min, range, dataBounds, pixelBounds) {
    const shapes = [];
    // const opacity = Math.max(0.1, Math.min(1, q))
    for (const item of data) {
        const q = (item.y - min) / range;
        const color = interpolateColor('C7E9C0', '2B8CBE', q);
        const point = remapPoint(dataBounds, pixelBounds, {
            x: item.x,
            y: item.y,
        });
        shapes.push(new Circle({
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
        }));
    }
    return shapes;
}
function createLines(context, data, dataBounds, pixelBounds, datasetProps) {
    const points = [];
    const shapes = [];
    for (const item of data) {
        const point = remapPoint(dataBounds, pixelBounds, {
            x: item.x,
            y: item.y,
        });
        points.push(point);
    }
    const shapeProps = datasetProps;
    shapes.push(new Line({ context, points, shapeProps }));
    return shapes;
}

;// CONCATENATED MODULE: ./src/core/canvas.ts
class Canvas {
    constructor(container, size) {
        this.container = container;
        this.canvas = this.canvas || document.createElement('canvas');
        this.context = this.context || this.canvas.getContext('2d');
        this.resize(size);
        this.container.appendChild(this.canvas);
    }
    resize(size) {
        let { width, height } = this.container.getBoundingClientRect();
        if (size) {
            width = size.width;
            height = size.height;
        }
        const scale = window.devicePixelRatio || 1;
        this.canvas.style.position = 'abrolute';
        this.canvas.style.top = '0px';
        this.canvas.style.left = '0px';
        this.canvas.style.width = width + 'px';
        this.canvas.style.height = height + 'px';
        this.canvas.width = width * scale;
        this.canvas.height = height * scale;
        this.size = { width, height };
        this.context.scale(scale, scale);
        return this.size;
    }
    getCanvas() {
        return this.canvas;
    }
    getContext() {
        return this.context;
    }
    getWidth() {
        return this.size.width;
    }
    getHeight() {
        return this.size.height;
    }
    getSize() {
        return this.size;
    }
}

;// CONCATENATED MODULE: ./src/core/canvas-layer.ts


class CanvasLayer {
    constructor(container, dataBounds, pixelBounds, margin, props) {
        this.data = [];
        this.shapes = [];
        this.container = container;
        this.type = props.type;
        this.data = props.data;
        this.canvas = new Canvas(container);
        this.context = this.canvas.getContext();
        this.dataBounds = dataBounds;
        this.pixelBounds = pixelBounds;
        this.margin = margin;
        this.datasetProps = props;
        this.setup();
        return this;
    }
    setup() {
        this.boundingBox = {
            x: this.margin.left,
            y: this.margin.top,
            top: this.margin.top,
            right: this.margin.right,
            bottom: this.margin.bottom,
            left: this.margin.left,
            width: this.canvas.getWidth() - this.margin.left - this.margin.right,
            height: this.canvas.getHeight() - this.margin.top - this.margin.bottom,
        };
        this.shapes.length = 0;
        this.getNormalizedElements();
        // this.renderFrame() // Only for dev
        this.renderShapes();
    }
    getNormalizedElements() {
        const { context, data, dataBounds, pixelBounds, type, datasetProps } = this;
        const { bottom: min, top: max } = dataBounds;
        const range = (min - max) * -1;
        switch (type) {
            case 'line': {
                this.shapes = createLines(context, data, dataBounds, pixelBounds, datasetProps);
                break;
            }
            case 'plot': {
                this.shapes = createCircles(context, data, min, range, dataBounds, pixelBounds);
                break;
            }
        }
    }
    renderShapes() {
        this.shapes.forEach((shape) => shape.draw());
    }
    /**
     * Renders a red frame to debugging
     */
    renderFrame() {
        const { x, y, width, height } = this.boundingBox;
        this.context.beginPath();
        this.context.rect(x, y, width, height);
        this.context.strokeStyle = 'red';
        this.context.stroke();
    }
    clear() {
        const { width, height, top, bottom, left, right } = this.boundingBox;
        this.context.clearRect(0, 0, width + right + left, height + top + bottom);
    }
}

;// CONCATENATED MODULE: ./src/core/chart.ts
var __rest = (undefined && undefined.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};


const CIRCLE_SIZE = 6;
const OPTIONS = {
    margin: { top: 20, left: 40, bottom: 20, right: 40 },
    xAxis: 'data',
    yAxis: 'value',
};
/**
 * @refs
 * https://www.youtube.com/watch?v=n8uCt1TSGKE&t=4743s
 *
 *
 * @note
 * Utilizando diferentes capas y una estrategia de optimización adecuada podemos mejorar
 * bastante el performance. Cuando pintamos muchos elementos (1644) con opacidad (L202),
 * el drag va bastante fino, hay que probar con datasets mas grandes.
 * 👀 Cuando pintamos 7470 elementos el mouseover se pilla!
 *
 * https://developer.ibm.com/tutorials/wa-canvashtml5layering/
 */
class Chart {
    constructor({ container, options }) {
        this.elements = [];
        this.nearestItemToMouse = null;
        this.prevNearestItemToMouse = null;
        /** Las diferentes capas del Chart */
        this.layers = [];
        /** Margenes del Canvas */
        this.margin = {
            top: 20,
            right: 30,
            bottom: 60,
            left: 100,
        };
        this.options = options;
        this.datasets = this.options.datasets;
        this.container = container;
        this.options = Object.assign(Object.assign({}, OPTIONS), options);
        this.data = this.options.datasets.map((dataset) => {
            return dataset.encode
                ? encodeData(dataset.data, dataset.encode)
                : dataset.data;
        });
        this.render();
        this.addEventListeners();
    }
    render() {
        for (const { layer } of this.layers) {
            layer.clear();
        }
        /**
         * @performance 👻
         * Resetar así un Array es mucho más eficiente que `array = []` puesto que de ese
         * modo estamos creando otro objeto en memoria y dependemos del GC para que lo elimine.
         */
        this.layers.length = 0;
        this.setBounds();
        this.createCanvasLayers();
    }
    createCanvasLayers() {
        for (const index in this.datasets) {
            const props = __rest(this.datasets[index], []);
            const encoded = encodeData(props.data, props.encode);
            props.data = encoded;
            console.log(encoded);
            this.layers[index] = {
                type: props.type,
                layer: new CanvasLayer(this.container, this.dataBounds, this.pixelBounds, this.margin, props),
            };
        }
    }
    /**
     * Handles the bounding boxes calculation
     */
    setBounds() {
        this.dataBounds = this.getDataBounds();
        this.defaultDataBounds = Object.assign({}, this.dataBounds);
        this.pixelBounds = this.getPixelBounds();
    }
    /**
     * Calculates the available bounding box for the canvas
     */
    getPixelBounds() {
        const rect = this.container.getBoundingClientRect();
        return {
            x: rect.x + this.margin.left,
            y: rect.y + this.margin.top,
            top: rect.top + this.margin.top,
            right: rect.right - this.margin.right,
            bottom: rect.bottom - this.margin.bottom,
            left: rect.left + this.margin.left,
            width: rect.width - this.margin.left - this.margin.right,
            height: rect.height - this.margin.top - this.margin.bottom,
        };
    }
    /**
     * Calculates the bounding box relative to the data
     */
    getDataBounds() {
        const data = [].concat.apply([], this.data);
        const x = data.map((d) => d.x);
        const y = data.map((d) => d.y);
        const minX = Math.min(...x);
        const maxX = Math.max(...x);
        const minY = Math.min(...y);
        const maxY = Math.max(...y);
        const bounds = {
            top: maxY,
            right: maxX,
            bottom: minY,
            left: minX,
        };
        return bounds;
    }
    /**
     * Event listener management
     */
    addEventListeners() {
        window.addEventListener('resize', debounce(() => this.render(), 100), false);
        /**
         * @todo
         * This isn't efficient. It should be fired every mouse movement and should probably causes
         * performance issues. A possible solution is to move the nearest element find logic to a
         * method that is called on requestAnimationFrame and the mousemove event handler only
         * handle a control variable.
         */
        // canvas.addEventListener('mousemove', (event: MouseEvent) => {
        //   const pLocation = this.getMousePoint(event)
        //   const point = remapPoint(dataBounds, pixelBounds, pLocation)
        //   const points = data.map((item) =>
        //     remapPoint(dataBounds, pixelBounds, { x: item.x, y: item.y })
        //   )
        //   const index = getNearestIndex(point, points)
        //   const dist = distance(points[index], point)
        //   if (dist < CIRCLE_SIZE) {
        //     this.nearestItemToMouse = index
        //   } else {
        //     this.nearestItemToMouse = null
        //   }
        //   // this.draw()
        // })
    }
    /**
     * Get de mouse position relative to the canvas
     */
    getMousePoint(event, dataSpace = true) {
        const { canvasElement: canvas, defaultDataBounds, pixelBounds } = this;
        const box = canvas.getBoundingClientRect();
        /** @question restamos los margenes? */
        const location = {
            x: event.clientX - box.left,
            y: event.clientY - box.top,
        };
        if (dataSpace === true) {
            return remapPoint(pixelBounds, defaultDataBounds, location);
        }
        return location;
    }
    destroy() {
        /** @todo */
    }
}

;// CONCATENATED MODULE: ./src/data/dataLine2.ts
const dataLine = [
    {
        date: '2019-11-10T00:53:00.000Z',
        value: 36,
        condition: 'SCT',
    },
    {
        date: '2019-11-10T01:19:00.000Z',
        value: 36,
        condition: 'BKN',
    },
    {
        date: '2019-11-10T01:42:00.000Z',
        value: 36,
        condition: 'SCT',
    },
    {
        date: '2019-11-10T01:53:00.000Z',
        value: 35.1,
        condition: 'FEW',
    },
    {
        date: '2019-11-10T02:53:00.000Z',
        value: 35.1,
        condition: 'OVC',
    },
    {
        date: '2019-11-10T03:53:00.000Z',
        value: 35.1,
        condition: 'OVC',
    },
    {
        date: '2019-11-10T04:53:00.000Z',
        value: 33.1,
        condition: 'FEW',
    },
    {
        date: '2019-11-10T05:06:00.000Z',
        value: 34,
        condition: 'BKN',
    },
    {
        date: '2019-11-10T05:53:00.000Z',
        value: 33.1,
        condition: 'BKN',
    },
    {
        date: '2019-11-10T05:58:00.000Z',
        value: 33.1,
        condition: 'SCT',
    },
    {
        date: '2019-11-10T06:53:00.000Z',
        value: 30.9,
        condition: 'FEW',
    },
    {
        date: '2019-11-10T07:53:00.000Z',
        value: 32,
        condition: 'FEW',
    },
    {
        date: '2019-11-10T08:53:00.000Z',
        value: 30.9,
        condition: 'CLR',
    },
    {
        date: '2019-11-10T09:53:00.000Z',
        value: 30.9,
        condition: 'CLR',
    },
    {
        date: '2019-11-10T10:27:00.000Z',
        value: 30.9,
        condition: 'BKN',
    },
    {
        date: '2019-11-10T10:53:00.000Z',
        value: 30.9,
        condition: 'OVC',
    },
    {
        date: '2019-11-10T11:53:00.000Z',
        value: 30,
        condition: 'OVC',
    },
    {
        date: '2019-11-10T12:53:00.000Z',
        value: 30,
        condition: 'OVC',
    },
    {
        date: '2019-11-10T13:23:00.000Z',
        value: 30,
        condition: 'OVC',
    },
    {
        date: '2019-11-10T13:53:00.000Z',
        value: 30,
        condition: 'OVC',
    },
    {
        date: '2019-11-10T14:53:00.000Z',
        value: 28.9,
        condition: 'OVC',
    },
    {
        date: '2019-11-10T15:53:00.000Z',
        value: 30,
        condition: 'OVC',
    },
    {
        date: '2019-11-10T16:23:00.000Z',
        value: 30,
        condition: 'BKN',
    },
    {
        date: '2019-11-10T16:53:00.000Z',
        value: 28.9,
        condition: 'OVC',
    },
    {
        date: '2019-11-10T17:53:00.000Z',
        value: 30,
        condition: 'BKN',
    },
    {
        date: '2019-11-10T18:53:00.000Z',
        value: 28.9,
        condition: 'SCT',
    },
    {
        date: '2019-11-10T19:53:00.000Z',
        value: 28,
        condition: 'FEW',
    },
    {
        date: '2019-11-10T20:53:00.000Z',
        value: 27,
        condition: 'FEW',
    },
    {
        date: '2019-11-10T21:53:00.000Z',
        value: 25,
        condition: 'FEW',
    },
    {
        date: '2019-11-10T22:13:00.000Z',
        value: 24.1,
        condition: 'BKN',
    },
    {
        date: '2019-11-10T22:50:00.000Z',
        value: 23,
        condition: 'BKN',
    },
    {
        date: '2019-11-10T22:53:00.000Z',
        value: 23,
        condition: 'SCT',
    },
    {
        date: '2019-11-10T23:00:00.000Z',
        value: 21.9,
        condition: 'SCT',
    },
    {
        date: '2019-11-10T23:19:00.000Z',
        value: 21.9,
        condition: 'OVC',
    },
    {
        date: '2019-11-10T23:35:00.000Z',
        value: 21,
        condition: 'FEW',
    },
    {
        date: '2019-11-10T23:53:00.000Z',
        value: 21,
        condition: 'SCT',
    },
    {
        date: '2019-11-11T00:01:00.000Z',
        value: 21,
        condition: 'FEW',
    },
    {
        date: '2019-11-11T00:53:00.000Z',
        value: 21,
        condition: 'CLR',
    },
    {
        date: '2019-11-11T01:53:00.000Z',
        value: 19.9,
        condition: 'CLR',
    },
    {
        date: '2019-11-11T02:53:00.000Z',
        value: 19.9,
        condition: 'CLR',
    },
    {
        date: '2019-11-11T03:53:00.000Z',
        value: 19,
        condition: 'CLR',
    },
    {
        date: '2019-11-11T04:53:00.000Z',
        value: 19,
        condition: 'BKN',
    },
    {
        date: '2019-11-11T05:53:00.000Z',
        value: 18,
        condition: 'OVC',
    },
    {
        date: '2019-11-11T06:53:00.000Z',
        value: 17.1,
        condition: 'FEW',
    },
    {
        date: '2019-11-11T07:53:00.000Z',
        value: 17.1,
        condition: 'BKN',
    },
    {
        date: '2019-11-11T08:53:00.000Z',
        value: 17.1,
        condition: 'OVC',
    },
    {
        date: '2019-11-11T09:53:00.000Z',
        value: 17.1,
        condition: 'OVC',
    },
    {
        date: '2019-11-11T10:53:00.000Z',
        value: 17.1,
        condition: 'SCT',
    },
    {
        date: '2019-11-11T11:53:00.000Z',
        value: 15.1,
        condition: 'OVC',
    },
    {
        date: '2019-11-11T12:53:00.000Z',
        value: 12.9,
        condition: 'CLR',
    },
    {
        date: '2019-11-11T13:53:00.000Z',
        value: 12.9,
        condition: 'OVC',
    },
    {
        date: '2019-11-11T14:53:00.000Z',
        value: 14,
        condition: 'CLR',
    },
    {
        date: '2019-11-11T15:53:00.000Z',
        value: 15.1,
        condition: 'FEW',
    },
    {
        date: '2019-11-11T16:53:00.000Z',
        value: 15.1,
        condition: 'SCT',
    },
    {
        date: '2019-11-11T17:53:00.000Z',
        value: 15.1,
        condition: 'FEW',
    },
    {
        date: '2019-11-11T18:53:00.000Z',
        value: 15.1,
        condition: 'SCT',
    },
    {
        date: '2019-11-11T19:53:00.000Z',
        value: 17.1,
        condition: 'OVC',
    },
    {
        date: '2019-11-11T20:53:00.000Z',
        value: 15.1,
        condition: 'BKN',
    },
    {
        date: '2019-11-11T21:53:00.000Z',
        value: 14,
        condition: 'FEW',
    },
    {
        date: '2019-11-11T22:53:00.000Z',
        value: 12,
        condition: 'CLR',
    },
    {
        date: '2019-11-11T23:53:00.000Z',
        value: 10.9,
        condition: 'FEW',
    },
    {
        date: '2019-11-12T00:53:00.000Z',
        value: 10.9,
        condition: 'CLR',
    },
    {
        date: '2019-11-12T01:53:00.000Z',
        value: 10,
        condition: 'CLR',
    },
    {
        date: '2019-11-12T02:53:00.000Z',
        value: 10,
        condition: 'CLR',
    },
    {
        date: '2019-11-12T03:53:00.000Z',
        value: 10,
        condition: 'CLR',
    },
    {
        date: '2019-11-12T04:53:00.000Z',
        value: 9,
        condition: 'CLR',
    },
    {
        date: '2019-11-12T05:53:00.000Z',
        value: 8.1,
        condition: 'CLR',
    },
    {
        date: '2019-11-12T06:53:00.000Z',
        value: 8.1,
        condition: 'CLR',
    },
    {
        date: '2019-11-12T07:53:00.000Z',
        value: 7,
        condition: 'CLR',
    },
    {
        date: '2019-11-12T08:53:00.000Z',
        value: 6.1,
        condition: 'CLR',
    },
    {
        date: '2019-11-12T09:53:00.000Z',
        value: 5,
        condition: 'CLR',
    },
    {
        date: '2019-11-12T10:53:00.000Z',
        value: 3.9,
        condition: 'CLR',
    },
    {
        date: '2019-11-12T11:53:00.000Z',
        value: 3.9,
        condition: 'CLR',
    },
    {
        date: '2019-11-12T12:53:00.000Z',
        value: 3,
        condition: 'CLR',
    },
    {
        date: '2019-11-12T13:53:00.000Z',
        value: 5,
        condition: 'CLR',
    },
    {
        date: '2019-11-12T14:53:00.000Z',
        value: 9,
        condition: 'CLR',
    },
    {
        date: '2019-11-12T15:53:00.000Z',
        value: 12,
        condition: 'CLR',
    },
    {
        date: '2019-11-12T16:53:00.000Z',
        value: 15.1,
        condition: 'CLR',
    },
    {
        date: '2019-11-12T17:53:00.000Z',
        value: 18,
        condition: 'CLR',
    },
    {
        date: '2019-11-12T18:53:00.000Z',
        value: 19,
        condition: 'CLR',
    },
    {
        date: '2019-11-12T19:53:00.000Z',
        value: 19,
        condition: 'CLR',
    },
    {
        date: '2019-11-12T20:53:00.000Z',
        value: 18,
        condition: 'CLR',
    },
    {
        date: '2019-11-12T21:53:00.000Z',
        value: 18,
        condition: 'CLR',
    },
    {
        date: '2019-11-12T22:53:00.000Z',
        value: 18,
        condition: 'CLR',
    },
    {
        date: '2019-11-12T23:53:00.000Z',
        value: 19,
        condition: 'CLR',
    },
    {
        date: '2019-11-13T00:53:00.000Z',
        value: 19,
        condition: 'FEW',
    },
    {
        date: '2019-11-13T01:53:00.000Z',
        value: 18,
        condition: 'FEW',
    },
    {
        date: '2019-11-13T02:53:00.000Z',
        value: 18,
        condition: 'BKN',
    },
    {
        date: '2019-11-13T03:53:00.000Z',
        value: 18,
        condition: 'BKN',
    },
    {
        date: '2019-11-13T04:53:00.000Z',
        value: 18,
        condition: 'SCT',
    },
    {
        date: '2019-11-13T05:53:00.000Z',
        value: 19,
        condition: 'SCT',
    },
    {
        date: '2019-11-13T06:53:00.000Z',
        value: 19.9,
        condition: 'FEW',
    },
    {
        date: '2019-11-13T07:53:00.000Z',
        value: 19.9,
        condition: 'CLR',
    },
    {
        date: '2019-11-13T08:53:00.000Z',
        value: 21,
        condition: 'BKN',
    },
    {
        date: '2019-11-13T09:53:00.000Z',
        value: 21,
        condition: 'SCT',
    },
    {
        date: '2019-11-13T10:53:00.000Z',
        value: 21.9,
        condition: 'OVC',
    },
    {
        date: '2019-11-13T11:53:00.000Z',
        value: 21.9,
        condition: 'FEW',
    },
    {
        date: '2019-11-13T12:53:00.000Z',
        value: 23,
        condition: 'OVC',
    },
    {
        date: '2019-11-13T13:53:00.000Z',
        value: 23,
        condition: 'OVC',
    },
    {
        date: '2019-11-13T14:53:00.000Z',
        value: 24.1,
        condition: 'BKN',
    },
    {
        date: '2019-11-13T15:53:00.000Z',
        value: 25,
        condition: 'OVC',
    },
    {
        date: '2019-11-13T16:02:00.000Z',
        value: 25,
        condition: 'BKN',
    },
    {
        date: '2019-11-13T16:14:00.000Z',
        value: 25,
        condition: 'BKN',
    },
    {
        date: '2019-11-13T16:32:00.000Z',
        value: 25,
        condition: 'SCT',
    },
    {
        date: '2019-11-13T16:53:00.000Z',
        value: 25,
        condition: 'SCT',
    },
    {
        date: '2019-11-13T17:08:00.000Z',
        value: 25,
        condition: 'BKN',
    },
    {
        date: '2019-11-13T17:28:00.000Z',
        value: 25,
        condition: 'FEW',
    },
    {
        date: '2019-11-13T17:53:00.000Z',
        value: 26.1,
        condition: 'BKN',
    },
    {
        date: '2019-11-13T18:37:00.000Z',
        value: 27,
        condition: 'SCT',
    },
    {
        date: '2019-11-13T18:46:00.000Z',
        value: 27,
        condition: 'SCT',
    },
    {
        date: '2019-11-13T18:53:00.000Z',
        value: 27,
        condition: 'FEW',
    },
    {
        date: '2019-11-13T19:21:00.000Z',
        value: 28,
        condition: 'SCT',
    },
    {
        date: '2019-11-13T19:26:00.000Z',
        value: 28,
        condition: 'OVC',
    },
    {
        date: '2019-11-13T19:53:00.000Z',
        value: 28,
        condition: 'BKN',
    },
    {
        date: '2019-11-13T20:12:00.000Z',
        value: 28,
        condition: 'BKN',
    },
    {
        date: '2019-11-13T20:16:00.000Z',
        value: 28,
        condition: 'BKN',
    },
    {
        date: '2019-11-13T20:36:00.000Z',
        value: 28,
        condition: 'OVC',
    },
    {
        date: '2019-11-13T20:43:00.000Z',
        value: 28,
        condition: 'OVC',
    },
    {
        date: '2019-11-13T20:53:00.000Z',
        value: 28,
        condition: 'OVC',
    },
    {
        date: '2019-11-13T21:32:00.000Z',
        value: 28.9,
        condition: 'OVC',
    },
    {
        date: '2019-11-13T21:53:00.000Z',
        value: 28,
        condition: 'OVC',
    },
    {
        date: '2019-11-13T22:53:00.000Z',
        value: 28,
        condition: 'OVC',
    },
    {
        date: '2019-11-13T23:53:00.000Z',
        value: 28,
        condition: 'OVC',
    },
    {
        date: '2019-11-14T00:53:00.000Z',
        value: 28,
        condition: 'OVC',
    },
    {
        date: '2019-11-14T01:53:00.000Z',
        value: 28,
        condition: 'OVC',
    },
    {
        date: '2019-11-14T02:53:00.000Z',
        value: 28,
        condition: 'OVC',
    },
    {
        date: '2019-11-14T03:53:00.000Z',
        value: 28,
        condition: 'OVC',
    },
    {
        date: '2019-11-14T04:53:00.000Z',
        value: 28,
        condition: 'OVC',
    },
    {
        date: '2019-11-14T05:53:00.000Z',
        value: 27,
        condition: 'OVC',
    },
    {
        date: '2019-11-14T06:53:00.000Z',
        value: 27,
        condition: 'OVC',
    },
    {
        date: '2019-11-14T07:53:00.000Z',
        value: 26.1,
        condition: 'OVC',
    },
    {
        date: '2019-11-14T08:53:00.000Z',
        value: 25,
        condition: 'OVC',
    },
    {
        date: '2019-11-14T09:53:00.000Z',
        value: 24.1,
        condition: 'OVC',
    },
    {
        date: '2019-11-14T10:53:00.000Z',
        value: 23,
        condition: 'OVC',
    },
    {
        date: '2019-11-14T11:53:00.000Z',
        value: 21.9,
        condition: 'OVC',
    },
    {
        date: '2019-11-14T12:53:00.000Z',
        value: 21,
        condition: 'OVC',
    },
    {
        date: '2019-11-14T13:53:00.000Z',
        value: 19.9,
        condition: 'OVC',
    },
    {
        date: '2019-11-14T14:26:00.000Z',
        value: 19.9,
        condition: 'SCT',
    },
    {
        date: '2019-11-14T14:53:00.000Z',
        value: 21,
        condition: 'CLR',
    },
    {
        date: '2019-11-14T15:53:00.000Z',
        value: 23,
        condition: 'CLR',
    },
    {
        date: '2019-11-14T16:53:00.000Z',
        value: 25,
        condition: 'CLR',
    },
    {
        date: '2019-11-14T17:53:00.000Z',
        value: 28,
        condition: 'CLR',
    },
    {
        date: '2019-11-14T18:53:00.000Z',
        value: 28.9,
        condition: 'CLR',
    },
    {
        date: '2019-11-14T19:53:00.000Z',
        value: 30.9,
        condition: 'CLR',
    },
    {
        date: '2019-11-14T20:53:00.000Z',
        value: 32,
        condition: 'OVC',
    },
    {
        date: '2019-11-14T21:53:00.000Z',
        value: 32,
        condition: 'SCT',
    },
    {
        date: '2019-11-14T22:53:00.000Z',
        value: 30,
        condition: 'CLR',
    },
    {
        date: '2019-11-14T23:53:00.000Z',
        value: 28.9,
        condition: 'CLR',
    },
    {
        date: '2019-11-15T00:53:00.000Z',
        value: 28.9,
        condition: 'CLR',
    },
    {
        date: '2019-11-15T01:53:00.000Z',
        value: 28,
        condition: 'CLR',
    },
    {
        date: '2019-11-15T02:53:00.000Z',
        value: 28.9,
        condition: 'CLR',
    },
    {
        date: '2019-11-15T03:53:00.000Z',
        value: 30.9,
        condition: 'CLR',
    },
    {
        date: '2019-11-15T04:53:00.000Z',
        value: 30,
        condition: 'CLR',
    },
    {
        date: '2019-11-15T05:53:00.000Z',
        value: 28.9,
        condition: 'CLR',
    },
    {
        date: '2019-11-15T06:53:00.000Z',
        value: 30,
        condition: 'OVC',
    },
    {
        date: '2019-11-15T07:53:00.000Z',
        value: 30.9,
        condition: 'OVC',
    },
    {
        date: '2019-11-15T08:08:00.000Z',
        value: 30.9,
        condition: 'OVC',
    },
    {
        date: '2019-11-15T08:53:00.000Z',
        value: 32,
        condition: 'OVC',
    },
    {
        date: '2019-11-15T09:19:00.000Z',
        value: 30.9,
        condition: 'OVC',
    },
    {
        date: '2019-11-15T09:53:00.000Z',
        value: 32,
        condition: 'OVC',
    },
    {
        date: '2019-11-15T10:53:00.000Z',
        value: 30.9,
        condition: 'OVC',
    },
    {
        date: '2019-11-15T11:53:00.000Z',
        value: 28,
        condition: 'CLR',
    },
    {
        date: '2019-11-15T12:53:00.000Z',
        value: 28.9,
        condition: 'CLR',
    },
    {
        date: '2019-11-15T13:53:00.000Z',
        value: 28,
        condition: 'CLR',
    },
    {
        date: '2019-11-15T14:53:00.000Z',
        value: 34,
        condition: 'CLR',
    },
    {
        date: '2019-11-15T15:53:00.000Z',
        value: 37.9,
        condition: 'CLR',
    },
    {
        date: '2019-11-15T16:53:00.000Z',
        value: 39,
        condition: 'CLR',
    },
    {
        date: '2019-11-15T17:53:00.000Z',
        value: 39.9,
        condition: 'CLR',
    },
    {
        date: '2019-11-15T18:53:00.000Z',
        value: 39.9,
        condition: 'CLR',
    },
    {
        date: '2019-11-15T19:53:00.000Z',
        value: 39.9,
        condition: 'CLR',
    },
    {
        date: '2019-11-15T20:53:00.000Z',
        value: 39,
        condition: 'CLR',
    },
    {
        date: '2019-11-15T21:53:00.000Z',
        value: 37.9,
        condition: 'CLR',
    },
    {
        date: '2019-11-15T22:53:00.000Z',
        value: 35.1,
        condition: 'CLR',
    },
    {
        date: '2019-11-15T23:53:00.000Z',
        value: 34,
        condition: 'CLR',
    },
    {
        date: '2019-11-16T00:53:00.000Z',
        value: 34,
        condition: 'CLR',
    },
    {
        date: '2019-11-16T01:53:00.000Z',
        value: 35.1,
        condition: 'CLR',
    },
    {
        date: '2019-11-16T02:53:00.000Z',
        value: 34,
        condition: 'CLR',
    },
    {
        date: '2019-11-16T03:53:00.000Z',
        value: 34,
        condition: 'CLR',
    },
    {
        date: '2019-11-16T04:53:00.000Z',
        value: 34,
        condition: 'CLR',
    },
    {
        date: '2019-11-16T05:53:00.000Z',
        value: 34,
        condition: 'CLR',
    },
    {
        date: '2019-11-16T06:53:00.000Z',
        value: 34,
        condition: 'CLR',
    },
    {
        date: '2019-11-16T07:53:00.000Z',
        value: 34,
        condition: 'CLR',
    },
    {
        date: '2019-11-16T08:53:00.000Z',
        value: 34,
        condition: 'FEW',
    },
    {
        date: '2019-11-16T09:53:00.000Z',
        value: 34,
        condition: 'CLR',
    },
    {
        date: '2019-11-16T10:53:00.000Z',
        value: 33.1,
        condition: 'CLR',
    },
    {
        date: '2019-11-16T11:53:00.000Z',
        value: 33.1,
        condition: 'CLR',
    },
    {
        date: '2019-11-16T12:53:00.000Z',
        value: 33.1,
        condition: 'CLR',
    },
    {
        date: '2019-11-16T13:53:00.000Z',
        value: 34,
        condition: 'CLR',
    },
    {
        date: '2019-11-16T14:53:00.000Z',
        value: 37.9,
        condition: 'CLR',
    },
    {
        date: '2019-11-16T15:53:00.000Z',
        value: 39,
        condition: 'CLR',
    },
    {
        date: '2019-11-16T16:53:00.000Z',
        value: 43,
        condition: 'CLR',
    },
    {
        date: '2019-11-16T17:53:00.000Z',
        value: 44.1,
        condition: 'CLR',
    },
    {
        date: '2019-11-16T18:53:00.000Z',
        value: 46.9,
        condition: 'CLR',
    },
    {
        date: '2019-11-16T19:53:00.000Z',
        value: 46,
        condition: 'CLR',
    },
    {
        date: '2019-11-16T20:53:00.000Z',
        value: 46,
        condition: 'CLR',
    },
    {
        date: '2019-11-16T21:53:00.000Z',
        value: 44.1,
        condition: 'CLR',
    },
    {
        date: '2019-11-16T22:53:00.000Z',
        value: 43,
        condition: 'FEW',
    },
    {
        date: '2019-11-16T23:53:00.000Z',
        value: 41,
        condition: 'CLR',
    },
    {
        date: '2019-11-17T00:53:00.000Z',
        value: 39,
        condition: 'CLR',
    },
    {
        date: '2019-11-17T01:53:00.000Z',
        value: 39,
        condition: 'CLR',
    },
    {
        date: '2019-11-17T02:53:00.000Z',
        value: 37.9,
        condition: 'FEW',
    },
    {
        date: '2019-11-17T03:53:00.000Z',
        value: 37.9,
        condition: 'BKN',
    },
    {
        date: '2019-11-17T04:53:00.000Z',
        value: 39,
        condition: 'OVC',
    },
    {
        date: '2019-11-17T05:53:00.000Z',
        value: 39,
        condition: 'OVC',
    },
    {
        date: '2019-11-17T06:53:00.000Z',
        value: 37.9,
        condition: 'OVC',
    },
    {
        date: '2019-11-17T07:53:00.000Z',
        value: 39,
        condition: 'OVC',
    },
    {
        date: '2019-11-17T08:53:00.000Z',
        value: 37.9,
        condition: 'BKN',
    },
    {
        date: '2019-11-17T09:53:00.000Z',
        value: 37,
        condition: 'SCT',
    },
    {
        date: '2019-11-17T10:38:00.000Z',
        value: 37,
        condition: 'SCT',
    },
    {
        date: '2019-11-17T10:53:00.000Z',
        value: 37,
        condition: 'BKN',
    },
    {
        date: '2019-11-17T11:18:00.000Z',
        value: 37,
        condition: 'OVC',
    },
    {
        date: '2019-11-17T11:53:00.000Z',
        value: 37,
        condition: 'BKN',
    },
    {
        date: '2019-11-17T12:53:00.000Z',
        value: 37,
        condition: 'BKN',
    },
    {
        date: '2019-11-17T13:53:00.000Z',
        value: 39,
        condition: 'OVC',
    },
    {
        date: '2019-11-17T14:17:00.000Z',
        value: 37.9,
        condition: 'BKN',
    },
    {
        date: '2019-11-17T14:53:00.000Z',
        value: 37.9,
        condition: 'OVC',
    },
    {
        date: '2019-11-17T15:53:00.000Z',
        value: 39,
        condition: 'FEW',
    },
    {
        date: '2019-11-17T16:11:00.000Z',
        value: 39,
        condition: 'BKN',
    },
    {
        date: '2019-11-17T16:53:00.000Z',
        value: 39,
        condition: 'BKN',
    },
    {
        date: '2019-11-17T17:09:00.000Z',
        value: 39,
        condition: 'SCT',
    },
    {
        date: '2019-11-17T17:53:00.000Z',
        value: 39,
        condition: 'SCT',
    },
    {
        date: '2019-11-17T18:12:00.000Z',
        value: 39,
        condition: 'BKN',
    },
    {
        date: '2019-11-17T18:53:00.000Z',
        value: 37.9,
        condition: 'FEW',
    },
    {
        date: '2019-11-17T19:53:00.000Z',
        value: 37.9,
        condition: 'OVC',
    },
    {
        date: '2019-11-17T20:53:00.000Z',
        value: 36,
        condition: 'OVC',
    },
    {
        date: '2019-11-17T21:53:00.000Z',
        value: 35.1,
        condition: 'OVC',
    },
    {
        date: '2019-11-17T22:53:00.000Z',
        value: 34,
        condition: 'OVC',
    },
    {
        date: '2019-11-17T23:53:00.000Z',
        value: 33.1,
        condition: 'OVC',
    },
    {
        date: '2019-11-18T00:36:00.000Z',
        value: 33.1,
        condition: 'OVC',
    },
    {
        date: '2019-11-18T00:53:00.000Z',
        value: 33.1,
        condition: 'OVC',
    },
    {
        date: '2019-11-18T01:53:00.000Z',
        value: 33.1,
        condition: 'OVC',
    },
    {
        date: '2019-11-18T02:09:00.000Z',
        value: 33.1,
        condition: 'OVC',
    },
    {
        date: '2019-11-18T02:53:00.000Z',
        value: 32,
        condition: 'OVC',
    },
    {
        date: '2019-11-18T03:53:00.000Z',
        value: 32,
        condition: 'OVC',
    },
    {
        date: '2019-11-18T04:53:00.000Z',
        value: 32,
        condition: 'OVC',
    },
    {
        date: '2019-11-18T05:53:00.000Z',
        value: 32,
        condition: 'OVC',
    },
    {
        date: '2019-11-18T06:53:00.000Z',
        value: 32,
        condition: 'OVC',
    },
    {
        date: '2019-11-18T07:31:00.000Z',
        value: 30.9,
        condition: 'OVC',
    },
    {
        date: '2019-11-18T07:53:00.000Z',
        value: 30.9,
        condition: 'OVC',
    },
    {
        date: '2019-11-18T08:53:00.000Z',
        value: 30.9,
        condition: 'OVC',
    },
    {
        date: '2019-11-18T09:53:00.000Z',
        value: 30.9,
        condition: 'OVC',
    },
    {
        date: '2019-11-18T10:53:00.000Z',
        value: 30.9,
        condition: 'OVC',
    },
    {
        date: '2019-11-18T11:53:00.000Z',
        value: 30.9,
        condition: 'OVC',
    },
    {
        date: '2019-11-18T12:53:00.000Z',
        value: 32,
        condition: 'OVC',
    },
    {
        date: '2019-11-18T13:53:00.000Z',
        value: 32,
        condition: 'OVC',
    },
    {
        date: '2019-11-18T14:53:00.000Z',
        value: 33.1,
        condition: 'OVC',
    },
    {
        date: '2019-11-18T15:31:00.000Z',
        value: 33.1,
        condition: 'OVC',
    },
    {
        date: '2019-11-18T15:53:00.000Z',
        value: 34,
        condition: 'OVC',
    },
    {
        date: '2019-11-18T16:53:00.000Z',
        value: 35.1,
        condition: 'OVC',
    },
    {
        date: '2019-11-18T17:53:00.000Z',
        value: 36,
        condition: 'OVC',
    },
    {
        date: '2019-11-18T18:00:00.000Z',
        value: 36,
        condition: 'OVC',
    },
    {
        date: '2019-11-18T18:53:00.000Z',
        value: 37,
        condition: 'OVC',
    },
    {
        date: '2019-11-18T19:53:00.000Z',
        value: 37,
        condition: 'OVC',
    },
    {
        date: '2019-11-18T20:53:00.000Z',
        value: 37.9,
        condition: 'BKN',
    },
    {
        date: '2019-11-18T21:53:00.000Z',
        value: 37,
        condition: 'OVC',
    },
    {
        date: '2019-11-18T22:53:00.000Z',
        value: 37,
        condition: 'OVC',
    },
    {
        date: '2019-11-18T23:53:00.000Z',
        value: 37,
        condition: 'OVC',
    },
    {
        date: '2019-11-19T00:53:00.000Z',
        value: 37,
        condition: 'OVC',
    },
    {
        date: '2019-11-19T01:53:00.000Z',
        value: 36,
        condition: 'OVC',
    },
    {
        date: '2019-11-19T02:53:00.000Z',
        value: 36,
        condition: 'OVC',
    },
    {
        date: '2019-11-19T03:53:00.000Z',
        value: 36,
        condition: 'OVC',
    },
    {
        date: '2019-11-19T04:53:00.000Z',
        value: 36,
        condition: 'OVC',
    },
    {
        date: '2019-11-19T05:18:00.000Z',
        value: 36,
        condition: 'OVC',
    },
    {
        date: '2019-11-19T05:53:00.000Z',
        value: 35.1,
        condition: 'BKN',
    },
    {
        date: '2019-11-19T06:53:00.000Z',
        value: 35.1,
        condition: 'BKN',
    },
    {
        date: '2019-11-19T07:17:00.000Z',
        value: 35.1,
        condition: 'SCT',
    },
    {
        date: '2019-11-19T07:53:00.000Z',
        value: 35.1,
        condition: 'BKN',
    },
    {
        date: '2019-11-19T08:04:00.000Z',
        value: 35.1,
        condition: 'OVC',
    },
    {
        date: '2019-11-19T08:53:00.000Z',
        value: 35.1,
        condition: 'OVC',
    },
    {
        date: '2019-11-19T09:02:00.000Z',
        value: 35.1,
        condition: 'OVC',
    },
    {
        date: '2019-11-19T09:53:00.000Z',
        value: 35.1,
        condition: 'OVC',
    },
    {
        date: '2019-11-19T10:42:00.000Z',
        value: 36,
        condition: 'OVC',
    },
    {
        date: '2019-11-19T10:53:00.000Z',
        value: 36,
        condition: 'OVC',
    },
    {
        date: '2019-11-19T11:53:00.000Z',
        value: 36,
        condition: 'VV ',
    },
    {
        date: '2019-11-19T12:31:00.000Z',
        value: 36,
        condition: 'VV ',
    },
    {
        date: '2019-11-19T12:53:00.000Z',
        value: 36,
        condition: 'VV ',
    },
    {
        date: '2019-11-19T13:53:00.000Z',
        value: 37,
        condition: 'VV ',
    },
    {
        date: '2019-11-19T14:17:00.000Z',
        value: 37,
        condition: 'OVC',
    },
    {
        date: '2019-11-19T14:41:00.000Z',
        value: 37,
        condition: 'OVC',
    },
    {
        date: '2019-11-19T14:44:00.000Z',
        value: 37,
        condition: 'OVC',
    },
    {
        date: '2019-11-19T14:53:00.000Z',
        value: 37,
        condition: 'OVC',
    },
    {
        date: '2019-11-19T15:53:00.000Z',
        value: 37.9,
        condition: 'OVC',
    },
    {
        date: '2019-11-19T16:53:00.000Z',
        value: 39,
        condition: 'OVC',
    },
    {
        date: '2019-11-19T17:53:00.000Z',
        value: 39.9,
        condition: 'OVC',
    },
    {
        date: '2019-11-19T18:22:00.000Z',
        value: 41,
        condition: 'OVC',
    },
    {
        date: '2019-11-19T18:53:00.000Z',
        value: 41,
        condition: 'OVC',
    },
    {
        date: '2019-11-19T19:53:00.000Z',
        value: 42.1,
        condition: 'OVC',
    },
    {
        date: '2019-11-19T20:33:00.000Z',
        value: 42.1,
        condition: 'OVC',
    },
    {
        date: '2019-11-19T20:53:00.000Z',
        value: 43,
        condition: 'OVC',
    },
    {
        date: '2019-11-19T21:43:00.000Z',
        value: 43,
        condition: 'FEW',
    },
    {
        date: '2019-11-19T21:53:00.000Z',
        value: 43,
        condition: 'FEW',
    },
    {
        date: '2019-11-19T22:44:00.000Z',
        value: 42.1,
        condition: 'BKN',
    },
    {
        date: '2019-11-19T22:53:00.000Z',
        value: 42.1,
        condition: 'OVC',
    },
    {
        date: '2019-11-19T23:53:00.000Z',
        value: 42.1,
        condition: 'OVC',
    },
    {
        date: '2019-11-20T00:53:00.000Z',
        value: 41,
        condition: 'OVC',
    },
    {
        date: '2019-11-20T01:53:00.000Z',
        value: 41,
        condition: 'OVC',
    },
    {
        date: '2019-11-20T02:53:00.000Z',
        value: 39.9,
        condition: 'OVC',
    },
    {
        date: '2019-11-20T03:53:00.000Z',
        value: 39.9,
        condition: 'OVC',
    },
    {
        date: '2019-11-20T04:53:00.000Z',
        value: 39,
        condition: 'OVC',
    },
    {
        date: '2019-11-20T05:53:00.000Z',
        value: 39,
        condition: 'OVC',
    },
    {
        date: '2019-11-20T06:53:00.000Z',
        value: 39,
        condition: 'OVC',
    },
    {
        date: '2019-11-20T07:53:00.000Z',
        value: 39,
        condition: 'OVC',
    },
    {
        date: '2019-11-20T08:53:00.000Z',
        value: 39,
        condition: 'OVC',
    },
    {
        date: '2019-11-20T09:53:00.000Z',
        value: 37.9,
        condition: 'OVC',
    },
    {
        date: '2019-11-20T10:53:00.000Z',
        value: 39,
        condition: 'OVC',
    },
    {
        date: '2019-11-20T11:53:00.000Z',
        value: 37.9,
        condition: 'OVC',
    },
    {
        date: '2019-11-20T12:53:00.000Z',
        value: 37.9,
        condition: 'BKN',
    },
    {
        date: '2019-11-20T13:08:00.000Z',
        value: 37,
        condition: 'SCT',
    },
    {
        date: '2019-11-20T13:53:00.000Z',
        value: 39,
        condition: 'BKN',
    },
    {
        date: '2019-11-20T14:53:00.000Z',
        value: 39,
        condition: 'CLR',
    },
    {
        date: '2019-11-20T15:53:00.000Z',
        value: 39.9,
        condition: 'SCT',
    },
    {
        date: '2019-11-20T15:58:00.000Z',
        value: 39.9,
        condition: 'BKN',
    },
    {
        date: '2019-11-20T16:53:00.000Z',
        value: 39.9,
        condition: 'OVC',
    },
    {
        date: '2019-11-20T17:53:00.000Z',
        value: 42.1,
        condition: 'BKN',
    },
    {
        date: '2019-11-20T18:04:00.000Z',
        value: 42.1,
        condition: 'SCT',
    },
    {
        date: '2019-11-20T18:53:00.000Z',
        value: 45,
        condition: 'FEW',
    },
    {
        date: '2019-11-20T19:53:00.000Z',
        value: 45,
        condition: 'CLR',
    },
    {
        date: '2019-11-20T20:53:00.000Z',
        value: 46,
        condition: 'FEW',
    },
    {
        date: '2019-11-20T21:53:00.000Z',
        value: 45,
        condition: 'OVC',
    },
    {
        date: '2019-11-20T22:53:00.000Z',
        value: 43,
        condition: 'FEW',
    },
    {
        date: '2019-11-20T23:53:00.000Z',
        value: 43,
        condition: 'SCT',
    },
    {
        date: '2019-11-21T00:53:00.000Z',
        value: 42.1,
        condition: 'OVC',
    },
    {
        date: '2019-11-21T01:53:00.000Z',
        value: 43,
        condition: 'OVC',
    },
    {
        date: '2019-11-21T02:53:00.000Z',
        value: 43,
        condition: 'OVC',
    },
    {
        date: '2019-11-21T03:53:00.000Z',
        value: 43,
        condition: 'OVC',
    },
    {
        date: '2019-11-21T04:53:00.000Z',
        value: 43,
        condition: 'OVC',
    },
    {
        date: '2019-11-21T05:53:00.000Z',
        value: 44.1,
        condition: 'OVC',
    },
    {
        date: '2019-11-21T06:53:00.000Z',
        value: 43,
        condition: 'OVC',
    },
    {
        date: '2019-11-21T07:04:00.000Z',
        value: 43,
        condition: 'OVC',
    },
    {
        date: '2019-11-21T07:53:00.000Z',
        value: 42.1,
        condition: 'OVC',
    },
    {
        date: '2019-11-21T08:18:00.000Z',
        value: 42.1,
        condition: 'OVC',
    },
    {
        date: '2019-11-21T08:49:00.000Z',
        value: 42.8,
        condition: 'OVC',
    },
    {
        date: '2019-11-21T08:53:00.000Z',
        value: 42.1,
        condition: 'OVC',
    },
    {
        date: '2019-11-21T09:53:00.000Z',
        value: 42.1,
        condition: 'OVC',
    },
    {
        date: '2019-11-21T10:05:00.000Z',
        value: 42.1,
        condition: 'SCT',
    },
    {
        date: '2019-11-21T10:14:00.000Z',
        value: 42.1,
        condition: 'BKN',
    },
    {
        date: '2019-11-21T10:53:00.000Z',
        value: 39.9,
        condition: 'OVC',
    },
    {
        date: '2019-11-21T11:53:00.000Z',
        value: 39,
        condition: 'OVC',
    },
    {
        date: '2019-11-21T12:13:00.000Z',
        value: 37,
        condition: 'OVC',
    },
    {
        date: '2019-11-21T12:23:00.000Z',
        value: 36,
        condition: 'OVC',
    },
    {
        date: '2019-11-21T12:53:00.000Z',
        value: 35.1,
        condition: 'BKN',
    },
    {
        date: '2019-11-21T13:13:00.000Z',
        value: 34,
        condition: 'BKN',
    },
    {
        date: '2019-11-21T13:23:00.000Z',
        value: 34,
        condition: 'BKN',
    },
    {
        date: '2019-11-21T13:29:00.000Z',
        value: 34,
        condition: 'SCT',
    },
    {
        date: '2019-11-21T13:53:00.000Z',
        value: 35.1,
        condition: 'BKN',
    },
    {
        date: '2019-11-21T14:53:00.000Z',
        value: 35.1,
        condition: 'OVC',
    },
    {
        date: '2019-11-21T15:14:00.000Z',
        value: 35.1,
        condition: 'OVC',
    },
    {
        date: '2019-11-21T15:33:00.000Z',
        value: 35.1,
        condition: 'OVC',
    },
    {
        date: '2019-11-21T15:53:00.000Z',
        value: 35.1,
        condition: 'BKN',
    },
    {
        date: '2019-11-21T16:28:00.000Z',
        value: 35.1,
        condition: 'BKN',
    },
    {
        date: '2019-11-21T16:53:00.000Z',
        value: 36,
        condition: 'BKN',
    },
    {
        date: '2019-11-21T17:53:00.000Z',
        value: 36,
        condition: 'OVC',
    },
    {
        date: '2019-11-21T18:53:00.000Z',
        value: 35.1,
        condition: 'OVC',
    },
    {
        date: '2019-11-21T19:53:00.000Z',
        value: 34,
        condition: 'OVC',
    },
    {
        date: '2019-11-21T20:53:00.000Z',
        value: 32,
        condition: 'OVC',
    },
    {
        date: '2019-11-21T21:29:00.000Z',
        value: 30.9,
        condition: 'SCT',
    },
    {
        date: '2019-11-21T21:53:00.000Z',
        value: 30,
        condition: 'FEW',
    },
    {
        date: '2019-11-21T22:53:00.000Z',
        value: 28.9,
        condition: 'CLR',
    },
    {
        date: '2019-11-21T23:53:00.000Z',
        value: 27,
        condition: 'BKN',
    },
    {
        date: '2019-11-22T00:53:00.000Z',
        value: 26.1,
        condition: 'OVC',
    },
    {
        date: '2019-11-22T01:53:00.000Z',
        value: 25,
        condition: 'OVC',
    },
    {
        date: '2019-11-22T02:53:00.000Z',
        value: 24.1,
        condition: 'OVC',
    },
    {
        date: '2019-11-22T03:53:00.000Z',
        value: 21.9,
        condition: 'OVC',
    },
    {
        date: '2019-11-22T04:53:00.000Z',
        value: 21.9,
        condition: 'OVC',
    },
    {
        date: '2019-11-22T05:53:00.000Z',
        value: 23,
        condition: 'OVC',
    },
    {
        date: '2019-11-22T06:53:00.000Z',
        value: 23,
        condition: 'OVC',
    },
    {
        date: '2019-11-22T07:53:00.000Z',
        value: 21.9,
        condition: 'OVC',
    },
    {
        date: '2019-11-22T08:53:00.000Z',
        value: 21.9,
        condition: 'OVC',
    },
    {
        date: '2019-11-22T09:53:00.000Z',
        value: 21.9,
        condition: 'OVC',
    },
    {
        date: '2019-11-22T10:53:00.000Z',
        value: 21.9,
        condition: 'OVC',
    },
    {
        date: '2019-11-22T11:53:00.000Z',
        value: 21,
        condition: 'OVC',
    },
    {
        date: '2019-11-22T12:53:00.000Z',
        value: 21,
        condition: 'OVC',
    },
    {
        date: '2019-11-22T13:33:00.000Z',
        value: 19.9,
        condition: 'OVC',
    },
    {
        date: '2019-11-22T13:53:00.000Z',
        value: 19,
        condition: 'SCT',
    },
    {
        date: '2019-11-22T14:53:00.000Z',
        value: 19.9,
        condition: 'OVC',
    },
    {
        date: '2019-11-22T15:53:00.000Z',
        value: 21,
        condition: 'OVC',
    },
    {
        date: '2019-11-22T16:53:00.000Z',
        value: 21.9,
        condition: 'OVC',
    },
    {
        date: '2019-11-22T17:53:00.000Z',
        value: 24.1,
        condition: 'SCT',
    },
    {
        date: '2019-11-22T18:53:00.000Z',
        value: 26.1,
        condition: 'CLR',
    },
    {
        date: '2019-11-22T19:53:00.000Z',
        value: 28,
        condition: 'CLR',
    },
    {
        date: '2019-11-22T20:53:00.000Z',
        value: 28,
        condition: 'CLR',
    },
    {
        date: '2019-11-22T21:53:00.000Z',
        value: 28,
        condition: 'CLR',
    },
    {
        date: '2019-11-22T22:53:00.000Z',
        value: 26.1,
        condition: 'CLR',
    },
    {
        date: '2019-11-22T23:53:00.000Z',
        value: 25,
        condition: 'CLR',
    },
    {
        date: '2019-11-23T00:53:00.000Z',
        value: 25,
        condition: 'CLR',
    },
    {
        date: '2019-11-23T01:53:00.000Z',
        value: 24.1,
        condition: 'CLR',
    },
    {
        date: '2019-11-23T02:53:00.000Z',
        value: 25,
        condition: 'CLR',
    },
    {
        date: '2019-11-23T03:53:00.000Z',
        value: 24.1,
        condition: 'CLR',
    },
    {
        date: '2019-11-23T04:53:00.000Z',
        value: 24.1,
        condition: 'CLR',
    },
    {
        date: '2019-11-23T05:53:00.000Z',
        value: 25,
        condition: 'CLR',
    },
    {
        date: '2019-11-23T06:53:00.000Z',
        value: 27,
        condition: 'CLR',
    },
    {
        date: '2019-11-23T07:53:00.000Z',
        value: 27,
        condition: 'CLR',
    },
    {
        date: '2019-11-23T08:53:00.000Z',
        value: 28.9,
        condition: 'CLR',
    },
    {
        date: '2019-11-23T09:53:00.000Z',
        value: 28.9,
        condition: 'CLR',
    },
    {
        date: '2019-11-23T10:53:00.000Z',
        value: 30,
        condition: 'CLR',
    },
    {
        date: '2019-11-23T11:53:00.000Z',
        value: 30,
        condition: 'CLR',
    },
    {
        date: '2019-11-23T12:53:00.000Z',
        value: 28,
        condition: 'CLR',
    },
    {
        date: '2019-11-23T13:53:00.000Z',
        value: 28,
        condition: 'CLR',
    },
    {
        date: '2019-11-23T14:53:00.000Z',
        value: 30.9,
        condition: 'CLR',
    },
    {
        date: '2019-11-23T15:53:00.000Z',
        value: 35.1,
        condition: 'CLR',
    },
    {
        date: '2019-11-23T16:53:00.000Z',
        value: 39,
        condition: 'CLR',
    },
    {
        date: '2019-11-23T17:53:00.000Z',
        value: 41,
        condition: 'CLR',
    },
    {
        date: '2019-11-23T18:53:00.000Z',
        value: 43,
        condition: 'CLR',
    },
    {
        date: '2019-11-23T19:53:00.000Z',
        value: 43,
        condition: 'CLR',
    },
    {
        date: '2019-11-23T20:53:00.000Z',
        value: 44.1,
        condition: 'CLR',
    },
    {
        date: '2019-11-23T21:53:00.000Z',
        value: 42.1,
        condition: 'CLR',
    },
    {
        date: '2019-11-23T22:53:00.000Z',
        value: 39,
        condition: 'CLR',
    },
    {
        date: '2019-11-23T23:53:00.000Z',
        value: 37,
        condition: 'CLR',
    },
    {
        date: '2019-11-24T00:53:00.000Z',
        value: 36,
        condition: 'CLR',
    },
    {
        date: '2019-11-24T01:53:00.000Z',
        value: 35.1,
        condition: 'CLR',
    },
    {
        date: '2019-11-24T02:53:00.000Z',
        value: 33.1,
        condition: 'CLR',
    },
    {
        date: '2019-11-24T03:53:00.000Z',
        value: 34,
        condition: 'CLR',
    },
    {
        date: '2019-11-24T04:53:00.000Z',
        value: 34,
        condition: 'FEW',
    },
    {
        date: '2019-11-24T05:53:00.000Z',
        value: 34,
        condition: 'BKN',
    },
    {
        date: '2019-11-24T06:53:00.000Z',
        value: 34,
        condition: 'CLR',
    },
    {
        date: '2019-11-24T07:53:00.000Z',
        value: 33.1,
        condition: 'CLR',
    },
    {
        date: '2019-11-24T08:53:00.000Z',
        value: 33.1,
        condition: 'CLR',
    },
    {
        date: '2019-11-24T09:53:00.000Z',
        value: 33.1,
        condition: 'CLR',
    },
    {
        date: '2019-11-24T10:53:00.000Z',
        value: 32,
        condition: 'CLR',
    },
    {
        date: '2019-11-24T11:53:00.000Z',
        value: 33.1,
        condition: 'BKN',
    },
    {
        date: '2019-11-24T12:53:00.000Z',
        value: 33.1,
        condition: 'OVC',
    },
    {
        date: '2019-11-24T13:53:00.000Z',
        value: 33.1,
        condition: 'BKN',
    },
    {
        date: '2019-11-24T14:53:00.000Z',
        value: 36,
        condition: 'BKN',
    },
    {
        date: '2019-11-24T15:53:00.000Z',
        value: 37,
        condition: 'FEW',
    },
    {
        date: '2019-11-24T16:53:00.000Z',
        value: 37.9,
        condition: 'CLR',
    },
    {
        date: '2019-11-24T17:53:00.000Z',
        value: 41,
        condition: 'CLR',
    },
    {
        date: '2019-11-24T18:53:00.000Z',
        value: 41,
        condition: 'CLR',
    },
    {
        date: '2019-11-24T19:53:00.000Z',
        value: 44.1,
        condition: 'BKN',
    },
    {
        date: '2019-11-24T20:53:00.000Z',
        value: 44.1,
        condition: 'OVC',
    },
    {
        date: '2019-11-24T21:53:00.000Z',
        value: 43,
        condition: 'OVC',
    },
    {
        date: '2019-11-24T22:53:00.000Z',
        value: 42.1,
        condition: 'OVC',
    },
    {
        date: '2019-11-24T23:53:00.000Z',
        value: 41,
        condition: 'OVC',
    },
    {
        date: '2019-11-25T00:53:00.000Z',
        value: 39.9,
        condition: 'OVC',
    },
    {
        date: '2019-11-25T01:53:00.000Z',
        value: 39.9,
        condition: 'BKN',
    },
    {
        date: '2019-11-25T02:53:00.000Z',
        value: 39.9,
        condition: 'SCT',
    },
    {
        date: '2019-11-25T03:53:00.000Z',
        value: 39.9,
        condition: 'BKN',
    },
    {
        date: '2019-11-25T04:53:00.000Z',
        value: 39,
        condition: 'CLR',
    },
    {
        date: '2019-11-25T05:53:00.000Z',
        value: 37.9,
        condition: 'CLR',
    },
    {
        date: '2019-11-25T06:53:00.000Z',
        value: 36,
        condition: 'CLR',
    },
    {
        date: '2019-11-25T07:53:00.000Z',
        value: 37.9,
        condition: 'SCT',
    },
    {
        date: '2019-11-25T08:53:00.000Z',
        value: 39,
        condition: 'FEW',
    },
    {
        date: '2019-11-25T09:53:00.000Z',
        value: 37.9,
        condition: 'CLR',
    },
    {
        date: '2019-11-25T10:53:00.000Z',
        value: 37.9,
        condition: 'CLR',
    },
    {
        date: '2019-11-25T11:53:00.000Z',
        value: 37.9,
        condition: 'CLR',
    },
    {
        date: '2019-11-25T12:53:00.000Z',
        value: 36,
        condition: 'CLR',
    },
    {
        date: '2019-11-25T13:53:00.000Z',
        value: 36,
        condition: 'CLR',
    },
    {
        date: '2019-11-25T14:53:00.000Z',
        value: 37.9,
        condition: 'CLR',
    },
    {
        date: '2019-11-25T15:53:00.000Z',
        value: 41,
        condition: 'CLR',
    },
    {
        date: '2019-11-25T16:53:00.000Z',
        value: 44.1,
        condition: 'CLR',
    },
    {
        date: '2019-11-25T17:53:00.000Z',
        value: 45,
        condition: 'BKN',
    },
    {
        date: '2019-11-25T18:53:00.000Z',
        value: 44.1,
        condition: 'OVC',
    },
    {
        date: '2019-11-25T19:53:00.000Z',
        value: 44.1,
        condition: 'OVC',
    },
    {
        date: '2019-11-25T20:53:00.000Z',
        value: 43,
        condition: 'BKN',
    },
    {
        date: '2019-11-25T21:28:00.000Z',
        value: 42.1,
        condition: 'BKN',
    },
    {
        date: '2019-11-25T21:53:00.000Z',
        value: 41,
        condition: 'OVC',
    },
    {
        date: '2019-11-25T22:45:00.000Z',
        value: 39.9,
        condition: 'FEW',
    },
    {
        date: '2019-11-25T22:53:00.000Z',
        value: 39.9,
        condition: 'BKN',
    },
    {
        date: '2019-11-25T23:53:00.000Z',
        value: 39.9,
        condition: 'OVC',
    },
    {
        date: '2019-11-26T00:53:00.000Z',
        value: 39,
        condition: 'BKN',
    },
    {
        date: '2019-11-26T01:53:00.000Z',
        value: 39,
        condition: 'OVC',
    },
    {
        date: '2019-11-26T02:53:00.000Z',
        value: 39,
        condition: 'OVC',
    },
    {
        date: '2019-11-26T03:53:00.000Z',
        value: 39,
        condition: 'OVC',
    },
    {
        date: '2019-11-26T04:53:00.000Z',
        value: 37.9,
        condition: 'OVC',
    },
    {
        date: '2019-11-26T05:53:00.000Z',
        value: 37,
        condition: 'OVC',
    },
    {
        date: '2019-11-26T06:53:00.000Z',
        value: 37,
        condition: 'OVC',
    },
    {
        date: '2019-11-26T07:53:00.000Z',
        value: 36,
        condition: 'OVC',
    },
    {
        date: '2019-11-26T08:53:00.000Z',
        value: 36,
        condition: 'OVC',
    },
    {
        date: '2019-11-26T09:53:00.000Z',
        value: 35.1,
        condition: 'OVC',
    },
    {
        date: '2019-11-26T10:53:00.000Z',
        value: 35.1,
        condition: 'BKN',
    },
    {
        date: '2019-11-26T11:53:00.000Z',
        value: 35.1,
        condition: 'OVC',
    },
    {
        date: '2019-11-26T12:53:00.000Z',
        value: 35.1,
        condition: 'OVC',
    },
    {
        date: '2019-11-26T13:53:00.000Z',
        value: 35.1,
        condition: 'OVC',
    },
    {
        date: '2019-11-26T14:53:00.000Z',
        value: 36,
        condition: 'OVC',
    },
    {
        date: '2019-11-26T15:53:00.000Z',
        value: 36,
        condition: 'OVC',
    },
    {
        date: '2019-11-26T16:53:00.000Z',
        value: 36,
        condition: 'OVC',
    },
    {
        date: '2019-11-26T17:17:00.000Z',
        value: 36,
        condition: 'SCT',
    },
    {
        date: '2019-11-26T17:53:00.000Z',
        value: 36,
        condition: 'OVC',
    },
    {
        date: '2019-11-26T18:53:00.000Z',
        value: 36,
        condition: 'OVC',
    },
    {
        date: '2019-11-26T19:53:00.000Z',
        value: 36,
        condition: 'SCT',
    },
    {
        date: '2019-11-26T20:53:00.000Z',
        value: 36,
        condition: 'FEW',
    },
    {
        date: '2019-11-26T21:53:00.000Z',
        value: 35.1,
        condition: 'OVC',
    },
    {
        date: '2019-11-26T22:53:00.000Z',
        value: 35.1,
        condition: 'BKN',
    },
    {
        date: '2019-11-26T23:53:00.000Z',
        value: 35.1,
        condition: 'OVC',
    },
    {
        date: '2019-11-27T00:53:00.000Z',
        value: 34,
        condition: 'OVC',
    },
    {
        date: '2019-11-27T01:53:00.000Z',
        value: 33.1,
        condition: 'BKN',
    },
    {
        date: '2019-11-27T02:53:00.000Z',
        value: 33.1,
        condition: 'OVC',
    },
    {
        date: '2019-11-27T03:05:00.000Z',
        value: 32,
        condition: 'OVC',
    },
    {
        date: '2019-11-27T03:21:00.000Z',
        value: 32,
        condition: 'BKN',
    },
    {
        date: '2019-11-27T03:36:00.000Z',
        value: 30.9,
        condition: 'VV ',
    },
    {
        date: '2019-11-27T03:53:00.000Z',
        value: 30.9,
        condition: 'VV ',
    },
    {
        date: '2019-11-27T04:03:00.000Z',
        value: 30.9,
        condition: 'VV ',
    },
    {
        date: '2019-11-27T04:26:00.000Z',
        value: 30.9,
        condition: 'VV ',
    },
    {
        date: '2019-11-27T04:53:00.000Z',
        value: 30.9,
        condition: 'VV ',
    },
    {
        date: '2019-11-27T05:42:00.000Z',
        value: 30.9,
        condition: 'VV ',
    },
    {
        date: '2019-11-27T05:53:00.000Z',
        value: 30.9,
        condition: 'VV ',
    },
    {
        date: '2019-11-27T06:08:00.000Z',
        value: 30.9,
        condition: 'VV ',
    },
    {
        date: '2019-11-27T06:53:00.000Z',
        value: 30.9,
        condition: 'VV ',
    },
    {
        date: '2019-11-27T07:04:00.000Z',
        value: 30.9,
        condition: 'VV ',
    },
    {
        date: '2019-11-27T07:14:00.000Z',
        value: 30.9,
        condition: 'FEW',
    },
    {
        date: '2019-11-27T07:53:00.000Z',
        value: 30.9,
        condition: 'FEW',
    },
    {
        date: '2019-11-27T08:01:00.000Z',
        value: 30.9,
        condition: 'VV ',
    },
    {
        date: '2019-11-27T08:16:00.000Z',
        value: 30.9,
        condition: 'VV ',
    },
    {
        date: '2019-11-27T08:29:00.000Z',
        value: 30.9,
        condition: 'VV ',
    },
    {
        date: '2019-11-27T08:53:00.000Z',
        value: 30.9,
        condition: 'VV ',
    },
    {
        date: '2019-11-27T09:19:00.000Z',
        value: 30.9,
        condition: 'VV ',
    },
    {
        date: '2019-11-27T09:30:00.000Z',
        value: 30.9,
        condition: 'VV ',
    },
    {
        date: '2019-11-27T09:46:00.000Z',
        value: 32,
        condition: 'VV ',
    },
    {
        date: '2019-11-27T09:53:00.000Z',
        value: 32,
        condition: 'VV ',
    },
    {
        date: '2019-11-27T10:11:00.000Z',
        value: 32,
        condition: 'OVC',
    },
    {
        date: '2019-11-27T10:53:00.000Z',
        value: 30.9,
        condition: 'FEW',
    },
    {
        date: '2019-11-27T11:03:00.000Z',
        value: 30.9,
        condition: 'VV ',
    },
    {
        date: '2019-11-27T11:39:00.000Z',
        value: 30,
        condition: 'OVC',
    },
    {
        date: '2019-11-27T11:53:00.000Z',
        value: 30,
        condition: 'OVC',
    },
    {
        date: '2019-11-27T12:05:00.000Z',
        value: 30,
        condition: 'OVC',
    },
    {
        date: '2019-11-27T12:17:00.000Z',
        value: 30,
        condition: 'BKN',
    },
    {
        date: '2019-11-27T12:39:00.000Z',
        value: 30,
        condition: 'OVC',
    },
    {
        date: '2019-11-27T12:53:00.000Z',
        value: 30,
        condition: 'BKN',
    },
    {
        date: '2019-11-27T13:13:00.000Z',
        value: 30,
        condition: 'BKN',
    },
    {
        date: '2019-11-27T13:46:00.000Z',
        value: 30,
        condition: 'SCT',
    },
    {
        date: '2019-11-27T13:53:00.000Z',
        value: 30,
        condition: 'BKN',
    },
    {
        date: '2019-11-27T14:04:00.000Z',
        value: 30,
        condition: 'BKN',
    },
    {
        date: '2019-11-27T14:53:00.000Z',
        value: 30,
        condition: 'OVC',
    },
    {
        date: '2019-11-27T15:53:00.000Z',
        value: 30.9,
        condition: 'OVC',
    },
    {
        date: '2019-11-27T16:53:00.000Z',
        value: 30.9,
        condition: 'OVC',
    },
    {
        date: '2019-11-27T17:53:00.000Z',
        value: 32,
        condition: 'OVC',
    },
    {
        date: '2019-11-27T18:53:00.000Z',
        value: 32,
        condition: 'OVC',
    },
    {
        date: '2019-11-27T19:53:00.000Z',
        value: 32,
        condition: 'OVC',
    },
    {
        date: '2019-11-27T20:53:00.000Z',
        value: 32,
        condition: 'OVC',
    },
    {
        date: '2019-11-27T21:53:00.000Z',
        value: 30.9,
        condition: 'OVC',
    },
    {
        date: '2019-11-27T22:53:00.000Z',
        value: 30,
        condition: 'OVC',
    },
    {
        date: '2019-11-27T23:53:00.000Z',
        value: 30,
        condition: 'OVC',
    },
    {
        date: '2019-11-28T00:53:00.000Z',
        value: 28.9,
        condition: 'OVC',
    },
    {
        date: '2019-11-28T01:53:00.000Z',
        value: 28.9,
        condition: 'OVC',
    },
    {
        date: '2019-11-28T02:53:00.000Z',
        value: 28,
        condition: 'OVC',
    },
    {
        date: '2019-11-28T03:53:00.000Z',
        value: 28,
        condition: 'OVC',
    },
    {
        date: '2019-11-28T04:53:00.000Z',
        value: 27,
        condition: 'OVC',
    },
    {
        date: '2019-11-28T05:53:00.000Z',
        value: 27,
        condition: 'OVC',
    },
    {
        date: '2019-11-28T06:53:00.000Z',
        value: 27,
        condition: 'OVC',
    },
    {
        date: '2019-11-28T07:53:00.000Z',
        value: 26.1,
        condition: 'OVC',
    },
    {
        date: '2019-11-28T08:53:00.000Z',
        value: 25,
        condition: 'OVC',
    },
    {
        date: '2019-11-28T09:53:00.000Z',
        value: 25,
        condition: 'OVC',
    },
    {
        date: '2019-11-28T10:53:00.000Z',
        value: 25,
        condition: 'OVC',
    },
    {
        date: '2019-11-28T11:53:00.000Z',
        value: 25,
        condition: 'OVC',
    },
    {
        date: '2019-11-28T12:53:00.000Z',
        value: 24.1,
        condition: 'OVC',
    },
    {
        date: '2019-11-28T13:53:00.000Z',
        value: 24.1,
        condition: 'OVC',
    },
    {
        date: '2019-11-28T14:53:00.000Z',
        value: 25,
        condition: 'OVC',
    },
    {
        date: '2019-11-28T15:53:00.000Z',
        value: 25,
        condition: 'OVC',
    },
    {
        date: '2019-11-28T16:53:00.000Z',
        value: 26.1,
        condition: 'BKN',
    },
    {
        date: '2019-11-28T17:53:00.000Z',
        value: 27,
        condition: 'OVC',
    },
    {
        date: '2019-11-28T18:53:00.000Z',
        value: 27,
        condition: 'OVC',
    },
    {
        date: '2019-11-28T19:53:00.000Z',
        value: 28,
        condition: 'OVC',
    },
    {
        date: '2019-11-28T20:53:00.000Z',
        value: 28,
        condition: 'OVC',
    },
    {
        date: '2019-11-28T21:53:00.000Z',
        value: 27,
        condition: 'OVC',
    },
    {
        date: '2019-11-28T22:51:00.000Z',
        value: 26.6,
        condition: 'OVC',
    },
    {
        date: '2019-11-28T22:53:00.000Z',
        value: 26.1,
        condition: 'OVC',
    },
    {
        date: '2019-11-28T23:53:00.000Z',
        value: 26.1,
        condition: 'OVC',
    },
    {
        date: '2019-11-29T00:53:00.000Z',
        value: 27,
        condition: 'OVC',
    },
    {
        date: '2019-11-29T01:53:00.000Z',
        value: 27,
        condition: 'OVC',
    },
    {
        date: '2019-11-29T02:53:00.000Z',
        value: 27,
        condition: 'OVC',
    },
    {
        date: '2019-11-29T03:53:00.000Z',
        value: 27,
        condition: 'OVC',
    },
    {
        date: '2019-11-29T04:06:00.000Z',
        value: 27,
        condition: 'OVC',
    },
    {
        date: '2019-11-29T04:53:00.000Z',
        value: 27,
        condition: 'OVC',
    },
    {
        date: '2019-11-29T05:53:00.000Z',
        value: 28,
        condition: 'OVC',
    },
    {
        date: '2019-11-29T06:53:00.000Z',
        value: 28,
        condition: 'OVC',
    },
    {
        date: '2019-11-29T07:36:00.000Z',
        value: 28,
        condition: 'SCT',
    },
    {
        date: '2019-11-29T07:53:00.000Z',
        value: 28,
        condition: 'OVC',
    },
    {
        date: '2019-11-29T08:53:00.000Z',
        value: 28.9,
        condition: 'SCT',
    },
    {
        date: '2019-11-29T09:53:00.000Z',
        value: 28.9,
        condition: 'SCT',
    },
    {
        date: '2019-11-29T10:13:00.000Z',
        value: 28.9,
        condition: 'OVC',
    },
    {
        date: '2019-11-29T10:20:00.000Z',
        value: 28.9,
        condition: 'OVC',
    },
    {
        date: '2019-11-29T10:44:00.000Z',
        value: 28.9,
        condition: 'OVC',
    },
    {
        date: '2019-11-29T10:53:00.000Z',
        value: 28.9,
        condition: 'OVC',
    },
    {
        date: '2019-11-29T11:53:00.000Z',
        value: 28.9,
        condition: 'BKN',
    },
    {
        date: '2019-11-29T12:22:00.000Z',
        value: 28.9,
        condition: 'FEW',
    },
    {
        date: '2019-11-29T12:53:00.000Z',
        value: 28.9,
        condition: 'OVC',
    },
    {
        date: '2019-11-29T13:27:00.000Z',
        value: 28.9,
        condition: 'BKN',
    },
    {
        date: '2019-11-29T13:39:00.000Z',
        value: 28.9,
        condition: 'BKN',
    },
    {
        date: '2019-11-29T13:53:00.000Z',
        value: 28.9,
        condition: 'BKN',
    },
    {
        date: '2019-11-29T14:17:00.000Z',
        value: 30,
        condition: 'FEW',
    },
    {
        date: '2019-11-29T14:53:00.000Z',
        value: 30,
        condition: 'BKN',
    },
    {
        date: '2019-11-29T15:13:00.000Z',
        value: 30,
        condition: 'FEW',
    },
    {
        date: '2019-11-29T15:23:00.000Z',
        value: 30,
        condition: 'FEW',
    },
    {
        date: '2019-11-29T15:53:00.000Z',
        value: 30.9,
        condition: 'FEW',
    },
    {
        date: '2019-11-29T16:53:00.000Z',
        value: 32,
        condition: 'BKN',
    },
    {
        date: '2019-11-29T17:07:00.000Z',
        value: 32,
        condition: 'BKN',
    },
    {
        date: '2019-11-29T17:44:00.000Z',
        value: 32,
        condition: 'SCT',
    },
    {
        date: '2019-11-29T17:53:00.000Z',
        value: 32,
        condition: 'BKN',
    },
    {
        date: '2019-11-29T18:53:00.000Z',
        value: 33.1,
        condition: 'BKN',
    },
    {
        date: '2019-11-29T19:29:00.000Z',
        value: 32,
        condition: 'SCT',
    },
    {
        date: '2019-11-29T19:53:00.000Z',
        value: 32,
        condition: 'SCT',
    },
    {
        date: '2019-11-29T20:30:00.000Z',
        value: 32,
        condition: 'BKN',
    },
    {
        date: '2019-11-29T20:51:00.000Z',
        value: 32,
        condition: 'BKN',
    },
    {
        date: '2019-11-29T20:53:00.000Z',
        value: 32,
        condition: 'BKN',
    },
    {
        date: '2019-11-29T21:53:00.000Z',
        value: 33.1,
        condition: 'OVC',
    },
    {
        date: '2019-11-29T22:53:00.000Z',
        value: 33.1,
        condition: 'OVC',
    },
    {
        date: '2019-11-29T23:53:00.000Z',
        value: 32,
        condition: 'OVC',
    },
    {
        date: '2019-11-30T00:09:00.000Z',
        value: 32,
        condition: 'OVC',
    },
    {
        date: '2019-11-30T00:53:00.000Z',
        value: 32,
        condition: 'OVC',
    },
    {
        date: '2019-11-30T01:53:00.000Z',
        value: 33.1,
        condition: 'OVC',
    },
    {
        date: '2019-11-30T02:53:00.000Z',
        value: 33.1,
        condition: 'OVC',
    },
    {
        date: '2019-11-30T03:53:00.000Z',
        value: 32,
        condition: 'OVC',
    },
    {
        date: '2019-11-30T04:06:00.000Z',
        value: 32,
        condition: 'OVC',
    },
    {
        date: '2019-11-30T04:17:00.000Z',
        value: 32,
        condition: 'OVC',
    },
    {
        date: '2019-11-30T04:46:00.000Z',
        value: 32,
        condition: 'OVC',
    },
    {
        date: '2019-11-30T04:53:00.000Z',
        value: 32,
        condition: 'BKN',
    },
    {
        date: '2019-11-30T05:22:00.000Z',
        value: 32,
        condition: 'SCT',
    },
    {
        date: '2019-11-30T05:43:00.000Z',
        value: 32,
        condition: 'BKN',
    },
    {
        date: '2019-11-30T05:53:00.000Z',
        value: 32,
        condition: 'BKN',
    },
    {
        date: '2019-11-30T06:53:00.000Z',
        value: 32,
        condition: 'VV ',
    },
    {
        date: '2019-11-30T07:19:00.000Z',
        value: 30.9,
        condition: 'OVC',
    },
    {
        date: '2019-11-30T07:26:00.000Z',
        value: 30.9,
        condition: 'OVC',
    },
    {
        date: '2019-11-30T07:38:00.000Z',
        value: 30.9,
        condition: 'BKN',
    },
    {
        date: '2019-11-30T07:53:00.000Z',
        value: 30.9,
        condition: 'BKN',
    },
    {
        date: '2019-11-30T08:53:00.000Z',
        value: 30.9,
        condition: 'BKN',
    },
    {
        date: '2019-11-30T09:40:00.000Z',
        value: 30.9,
        condition: 'BKN',
    },
    {
        date: '2019-11-30T09:49:00.000Z',
        value: 30.2,
        condition: 'BKN',
    },
    {
        date: '2019-11-30T09:53:00.000Z',
        value: 30.9,
        condition: 'BKN',
    },
    {
        date: '2019-11-30T10:00:00.000Z',
        value: 30.9,
        condition: 'BKN',
    },
    {
        date: '2019-11-30T10:53:00.000Z',
        value: 32,
        condition: 'BKN',
    },
    {
        date: '2019-11-30T11:47:00.000Z',
        value: 32,
        condition: 'OVC',
    },
    {
        date: '2019-11-30T11:53:00.000Z',
        value: 32,
        condition: 'OVC',
    },
    {
        date: '2019-11-30T12:10:00.000Z',
        value: 32,
        condition: 'OVC',
    },
    {
        date: '2019-11-30T12:44:00.000Z',
        value: 32,
        condition: 'OVC',
    },
    {
        date: '2019-11-30T12:53:00.000Z',
        value: 32,
        condition: 'OVC',
    },
    {
        date: '2019-11-30T13:12:00.000Z',
        value: 32,
        condition: 'OVC',
    },
    {
        date: '2019-11-30T13:53:00.000Z',
        value: 33.1,
        condition: 'OVC',
    },
    {
        date: '2019-11-30T14:05:00.000Z',
        value: 33.1,
        condition: 'OVC',
    },
    {
        date: '2019-11-30T14:36:00.000Z',
        value: 33.1,
        condition: 'OVC',
    },
    {
        date: '2019-11-30T14:53:00.000Z',
        value: 33.1,
        condition: 'OVC',
    },
    {
        date: '2019-11-30T15:04:00.000Z',
        value: 33.1,
        condition: 'OVC',
    },
    {
        date: '2019-11-30T15:14:00.000Z',
        value: 33.1,
        condition: 'BKN',
    },
    {
        date: '2019-11-30T15:53:00.000Z',
        value: 33.1,
        condition: 'BKN',
    },
    {
        date: '2019-11-30T16:53:00.000Z',
        value: 33.1,
        condition: 'BKN',
    },
    {
        date: '2019-11-30T16:57:00.000Z',
        value: 33.1,
        condition: 'OVC',
    },
    {
        date: '2019-11-30T17:18:00.000Z',
        value: 33.1,
        condition: 'OVC',
    },
    {
        date: '2019-11-30T17:32:00.000Z',
        value: 33.1,
        condition: 'BKN',
    },
    {
        date: '2019-11-30T17:44:00.000Z',
        value: 33.1,
        condition: 'BKN',
    },
    {
        date: '2019-11-30T17:53:00.000Z',
        value: 33.1,
        condition: 'BKN',
    },
    {
        date: '2019-11-30T18:08:00.000Z',
        value: 33.1,
        condition: 'OVC',
    },
    {
        date: '2019-11-30T18:15:00.000Z',
        value: 33.1,
        condition: 'OVC',
    },
    {
        date: '2019-11-30T18:21:00.000Z',
        value: 33.1,
        condition: 'OVC',
    },
    {
        date: '2019-11-30T18:28:00.000Z',
        value: 33.1,
        condition: 'OVC',
    },
    {
        date: '2019-11-30T18:40:00.000Z',
        value: 33.1,
        condition: 'BKN',
    },
    {
        date: '2019-11-30T18:53:00.000Z',
        value: 33.1,
        condition: 'BKN',
    },
    {
        date: '2019-11-30T19:00:00.000Z',
        value: 34,
        condition: 'BKN',
    },
    {
        date: '2019-11-30T19:30:00.000Z',
        value: 33.1,
        condition: 'BKN',
    },
    {
        date: '2019-11-30T19:38:00.000Z',
        value: 33.1,
        condition: 'BKN',
    },
    {
        date: '2019-11-30T19:45:00.000Z',
        value: 33.1,
        condition: 'BKN',
    },
    {
        date: '2019-11-30T19:53:00.000Z',
        value: 34,
        condition: 'BKN',
    },
    {
        date: '2019-11-30T20:16:00.000Z',
        value: 34,
        condition: 'OVC',
    },
    {
        date: '2019-11-30T20:21:00.000Z',
        value: 34,
        condition: 'OVC',
    },
    {
        date: '2019-11-30T20:46:00.000Z',
        value: 34,
        condition: 'BKN',
    },
    {
        date: '2019-11-30T20:53:00.000Z',
        value: 34,
        condition: 'BKN',
    },
    {
        date: '2019-11-30T21:53:00.000Z',
        value: 33.1,
        condition: 'BKN',
    },
    {
        date: '2019-11-30T21:57:00.000Z',
        value: 33.1,
        condition: 'SCT',
    },
    {
        date: '2019-11-30T21:59:00.000Z',
        value: 33.1,
        condition: 'SCT',
    },
    {
        date: '2019-11-30T22:06:00.000Z',
        value: 33.1,
        condition: 'BKN',
    },
    {
        date: '2019-11-30T22:53:00.000Z',
        value: 33.1,
        condition: 'BKN',
    },
    {
        date: '2019-11-30T23:53:00.000Z',
        value: 33.1,
        condition: 'BKN',
    },
    {
        date: '2019-12-01T00:26:00.000Z',
        value: 33.1,
        condition: 'OVC',
    },
    {
        date: '2019-12-01T00:35:00.000Z',
        value: 33.1,
        condition: 'BKN',
    },
    {
        date: '2019-12-01T00:53:00.000Z',
        value: 33.1,
        condition: 'BKN',
    },
    {
        date: '2019-12-01T01:27:00.000Z',
        value: 33.1,
        condition: 'BKN',
    },
    {
        date: '2019-12-01T01:34:00.000Z',
        value: 33.1,
        condition: 'BKN',
    },
    {
        date: '2019-12-01T01:53:00.000Z',
        value: 33.1,
        condition: 'BKN',
    },
    {
        date: '2019-12-01T02:53:00.000Z',
        value: 32,
        condition: 'BKN',
    },
    {
        date: '2019-12-01T03:53:00.000Z',
        value: 32,
        condition: 'BKN',
    },
    {
        date: '2019-12-01T04:23:00.000Z',
        value: 32,
        condition: 'OVC',
    },
    {
        date: '2019-12-01T04:44:00.000Z',
        value: 32,
        condition: 'BKN',
    },
    {
        date: '2019-12-01T04:53:00.000Z',
        value: 32,
        condition: 'BKN',
    },
    {
        date: '2019-12-01T05:31:00.000Z',
        value: 32,
        condition: 'BKN',
    },
    {
        date: '2019-12-01T05:43:00.000Z',
        value: 32,
        condition: 'SCT',
    },
    {
        date: '2019-12-01T05:53:00.000Z',
        value: 32,
        condition: 'SCT',
    },
    {
        date: '2019-12-01T06:53:00.000Z',
        value: 32,
        condition: 'BKN',
    },
    {
        date: '2019-12-01T07:11:00.000Z',
        value: 32,
        condition: 'BKN',
    },
    {
        date: '2019-12-01T07:53:00.000Z',
        value: 30.9,
        condition: 'OVC',
    },
    {
        date: '2019-12-01T08:02:00.000Z',
        value: 30.9,
        condition: 'FEW',
    },
    {
        date: '2019-12-01T08:08:00.000Z',
        value: 30.9,
        condition: 'BKN',
    },
    {
        date: '2019-12-01T08:53:00.000Z',
        value: 30,
        condition: 'SCT',
    },
    {
        date: '2019-12-01T09:07:00.000Z',
        value: 30,
        condition: 'FEW',
    },
    {
        date: '2019-12-01T09:32:00.000Z',
        value: 28.9,
        condition: 'SCT',
    },
    {
        date: '2019-12-01T09:41:00.000Z',
        value: 28.9,
        condition: 'SCT',
    },
    {
        date: '2019-12-01T09:49:00.000Z',
        value: 28.4,
        condition: 'FEW',
    },
    {
        date: '2019-12-01T09:53:00.000Z',
        value: 28.9,
        condition: 'FEW',
    },
    {
        date: '2019-12-01T10:02:00.000Z',
        value: 28.9,
        condition: 'FEW',
    },
    {
        date: '2019-12-01T10:13:00.000Z',
        value: 28.9,
        condition: 'FEW',
    },
    {
        date: '2019-12-01T10:24:00.000Z',
        value: 28.9,
        condition: 'FEW',
    },
    {
        date: '2019-12-01T10:31:00.000Z',
        value: 28.9,
        condition: 'FEW',
    },
    {
        date: '2019-12-01T10:44:00.000Z',
        value: 28.9,
        condition: 'FEW',
    },
    {
        date: '2019-12-01T10:53:00.000Z',
        value: 28.9,
        condition: 'FEW',
    },
    {
        date: '2019-12-01T11:53:00.000Z',
        value: 30,
        condition: 'SCT',
    },
    {
        date: '2019-12-01T12:38:00.000Z',
        value: 30,
        condition: 'SCT',
    },
    {
        date: '2019-12-01T12:53:00.000Z',
        value: 30,
        condition: 'FEW',
    },
    {
        date: '2019-12-01T13:16:00.000Z',
        value: 30,
        condition: 'BKN',
    },
    {
        date: '2019-12-01T13:53:00.000Z',
        value: 30,
        condition: 'SCT',
    },
    {
        date: '2019-12-01T14:01:00.000Z',
        value: 30,
        condition: 'FEW',
    },
    {
        date: '2019-12-01T14:29:00.000Z',
        value: 30.9,
        condition: 'SCT',
    },
    {
        date: '2019-12-01T14:34:00.000Z',
        value: 30.9,
        condition: 'FEW',
    },
    {
        date: '2019-12-01T14:53:00.000Z',
        value: 30.9,
        condition: 'SCT',
    },
    {
        date: '2019-12-01T15:53:00.000Z',
        value: 30,
        condition: 'FEW',
    },
    {
        date: '2019-12-01T16:09:00.000Z',
        value: 30,
        condition: 'FEW',
    },
    {
        date: '2019-12-01T16:53:00.000Z',
        value: 30,
        condition: 'BKN',
    },
    {
        date: '2019-12-01T17:03:00.000Z',
        value: 30,
        condition: 'BKN',
    },
    {
        date: '2019-12-01T17:53:00.000Z',
        value: 30,
        condition: 'OVC',
    },
    {
        date: '2019-12-01T18:53:00.000Z',
        value: 28.9,
        condition: 'OVC',
    },
    {
        date: '2019-12-01T19:16:00.000Z',
        value: 28.9,
        condition: 'FEW',
    },
    {
        date: '2019-12-01T19:53:00.000Z',
        value: 30,
        condition: 'OVC',
    },
    {
        date: '2019-12-01T20:25:00.000Z',
        value: 28.9,
        condition: 'BKN',
    },
    {
        date: '2019-12-01T20:53:00.000Z',
        value: 28.9,
        condition: 'BKN',
    },
    {
        date: '2019-12-01T21:53:00.000Z',
        value: 28,
        condition: 'BKN',
    },
    {
        date: '2019-12-01T21:58:00.000Z',
        value: 28,
        condition: 'SCT',
    },
    {
        date: '2019-12-01T22:25:00.000Z',
        value: 28,
        condition: 'SCT',
    },
    {
        date: '2019-12-01T22:53:00.000Z',
        value: 28,
        condition: 'FEW',
    },
    {
        date: '2019-12-01T23:53:00.000Z',
        value: 28,
        condition: 'SCT',
    },
    {
        date: '2019-12-02T00:53:00.000Z',
        value: 26.1,
        condition: 'CLR',
    },
    {
        date: '2019-12-02T01:53:00.000Z',
        value: 26.1,
        condition: 'CLR',
    },
    {
        date: '2019-12-02T02:53:00.000Z',
        value: 23,
        condition: 'CLR',
    },
    {
        date: '2019-12-02T03:53:00.000Z',
        value: 21.9,
        condition: 'CLR',
    },
    {
        date: '2019-12-02T04:53:00.000Z',
        value: 19,
        condition: 'CLR',
    },
    {
        date: '2019-12-02T05:53:00.000Z',
        value: 19,
        condition: 'CLR',
    },
    {
        date: '2019-12-02T06:53:00.000Z',
        value: 18,
        condition: 'CLR',
    },
    {
        date: '2019-12-02T07:53:00.000Z',
        value: 17.1,
        condition: 'CLR',
    },
    {
        date: '2019-12-02T08:53:00.000Z',
        value: 16,
        condition: 'CLR',
    },
    {
        date: '2019-12-02T09:53:00.000Z',
        value: 12.9,
        condition: 'CLR',
    },
    {
        date: '2019-12-02T10:53:00.000Z',
        value: 9,
        condition: 'CLR',
    },
    {
        date: '2019-12-02T11:53:00.000Z',
        value: 9,
        condition: 'CLR',
    },
    {
        date: '2019-12-02T12:53:00.000Z',
        value: 10.9,
        condition: 'CLR',
    },
    {
        date: '2019-12-02T13:53:00.000Z',
        value: 9,
        condition: 'CLR',
    },
    {
        date: '2019-12-02T14:18:00.000Z',
        value: 9,
        condition: 'FEW',
    },
    {
        date: '2019-12-02T14:53:00.000Z',
        value: 10,
        condition: 'CLR',
    },
    {
        date: '2019-12-02T15:53:00.000Z',
        value: 12.9,
        condition: 'CLR',
    },
    {
        date: '2019-12-02T16:53:00.000Z',
        value: 16,
        condition: 'CLR',
    },
    {
        date: '2019-12-02T17:53:00.000Z',
        value: 19,
        condition: 'CLR',
    },
    {
        date: '2019-12-02T18:53:00.000Z',
        value: 19.9,
        condition: 'CLR',
    },
    {
        date: '2019-12-02T19:53:00.000Z',
        value: 21.9,
        condition: 'CLR',
    },
    {
        date: '2019-12-02T20:53:00.000Z',
        value: 21.9,
        condition: 'CLR',
    },
    {
        date: '2019-12-02T21:53:00.000Z',
        value: 23,
        condition: 'CLR',
    },
    {
        date: '2019-12-02T22:53:00.000Z',
        value: 24.1,
        condition: 'CLR',
    },
    {
        date: '2019-12-02T23:53:00.000Z',
        value: 21.9,
        condition: 'CLR',
    },
    {
        date: '2019-12-03T00:53:00.000Z',
        value: 23,
        condition: 'CLR',
    },
    {
        date: '2019-12-03T01:53:00.000Z',
        value: 23,
        condition: 'CLR',
    },
    {
        date: '2019-12-03T02:53:00.000Z',
        value: 24.1,
        condition: 'CLR',
    },
    {
        date: '2019-12-03T03:53:00.000Z',
        value: 25,
        condition: 'OVC',
    },
    {
        date: '2019-12-03T04:53:00.000Z',
        value: 26.1,
        condition: 'BKN',
    },
    {
        date: '2019-12-03T05:53:00.000Z',
        value: 25,
        condition: 'CLR',
    },
    {
        date: '2019-12-03T06:53:00.000Z',
        value: 23,
        condition: 'FEW',
    },
    {
        date: '2019-12-03T07:53:00.000Z',
        value: 23,
        condition: 'CLR',
    },
    {
        date: '2019-12-03T08:53:00.000Z',
        value: 21.9,
        condition: 'CLR',
    },
    {
        date: '2019-12-03T09:53:00.000Z',
        value: 21,
        condition: 'CLR',
    },
    {
        date: '2019-12-03T10:53:00.000Z',
        value: 21,
        condition: 'CLR',
    },
    {
        date: '2019-12-03T11:53:00.000Z',
        value: 19.9,
        condition: 'CLR',
    },
    {
        date: '2019-12-03T12:53:00.000Z',
        value: 19.9,
        condition: 'CLR',
    },
    {
        date: '2019-12-03T13:53:00.000Z',
        value: 21.9,
        condition: 'OVC',
    },
    {
        date: '2019-12-03T14:53:00.000Z',
        value: 23,
        condition: 'FEW',
    },
    {
        date: '2019-12-03T15:53:00.000Z',
        value: 26.1,
        condition: 'FEW',
    },
    {
        date: '2019-12-03T16:53:00.000Z',
        value: 32,
        condition: 'CLR',
    },
    {
        date: '2019-12-03T17:53:00.000Z',
        value: 34,
        condition: 'CLR',
    },
    {
        date: '2019-12-03T18:53:00.000Z',
        value: 35.1,
        condition: 'CLR',
    },
    {
        date: '2019-12-03T19:53:00.000Z',
        value: 36,
        condition: 'CLR',
    },
    {
        date: '2019-12-03T20:53:00.000Z',
        value: 37,
        condition: 'CLR',
    },
    {
        date: '2019-12-03T21:53:00.000Z',
        value: 35.1,
        condition: 'CLR',
    },
    {
        date: '2019-12-03T22:53:00.000Z',
        value: 33.1,
        condition: 'CLR',
    },
    {
        date: '2019-12-03T23:53:00.000Z',
        value: 33.1,
        condition: 'CLR',
    },
    {
        date: '2019-12-04T00:53:00.000Z',
        value: 33.1,
        condition: 'CLR',
    },
    {
        date: '2019-12-04T01:53:00.000Z',
        value: 32,
        condition: 'CLR',
    },
    {
        date: '2019-12-04T02:53:00.000Z',
        value: 32,
        condition: 'CLR',
    },
    {
        date: '2019-12-04T03:53:00.000Z',
        value: 32,
        condition: 'CLR',
    },
    {
        date: '2019-12-04T04:53:00.000Z',
        value: 30.9,
        condition: 'CLR',
    },
    {
        date: '2019-12-04T05:53:00.000Z',
        value: 30.9,
        condition: 'CLR',
    },
    {
        date: '2019-12-04T06:53:00.000Z',
        value: 30.9,
        condition: 'CLR',
    },
    {
        date: '2019-12-04T07:53:00.000Z',
        value: 32,
        condition: 'CLR',
    },
    {
        date: '2019-12-04T08:53:00.000Z',
        value: 30,
        condition: 'CLR',
    },
    {
        date: '2019-12-04T09:53:00.000Z',
        value: 28.9,
        condition: 'CLR',
    },
    {
        date: '2019-12-04T10:53:00.000Z',
        value: 28,
        condition: 'CLR',
    },
    {
        date: '2019-12-04T11:53:00.000Z',
        value: 28,
        condition: 'CLR',
    },
    {
        date: '2019-12-04T12:53:00.000Z',
        value: 25,
        condition: 'CLR',
    },
    {
        date: '2019-12-04T13:53:00.000Z',
        value: 24.1,
        condition: 'CLR',
    },
    {
        date: '2019-12-04T14:53:00.000Z',
        value: 28,
        condition: 'CLR',
    },
    {
        date: '2019-12-04T15:53:00.000Z',
        value: 30,
        condition: 'CLR',
    },
    {
        date: '2019-12-04T16:53:00.000Z',
        value: 35.1,
        condition: 'CLR',
    },
    {
        date: '2019-12-04T17:53:00.000Z',
        value: 35.1,
        condition: 'CLR',
    },
    {
        date: '2019-12-04T18:53:00.000Z',
        value: 37,
        condition: 'CLR',
    },
    {
        date: '2019-12-04T19:53:00.000Z',
        value: 36,
        condition: 'CLR',
    },
    {
        date: '2019-12-04T20:53:00.000Z',
        value: 36,
        condition: 'CLR',
    },
    {
        date: '2019-12-04T21:53:00.000Z',
        value: 35.1,
        condition: 'CLR',
    },
    {
        date: '2019-12-04T22:53:00.000Z',
        value: 32,
        condition: 'CLR',
    },
    {
        date: '2019-12-04T23:53:00.000Z',
        value: 30,
        condition: 'CLR',
    },
    {
        date: '2019-12-05T00:53:00.000Z',
        value: 28.9,
        condition: 'CLR',
    },
    {
        date: '2019-12-05T01:53:00.000Z',
        value: 28.9,
        condition: 'CLR',
    },
    {
        date: '2019-12-05T02:53:00.000Z',
        value: 28.9,
        condition: 'CLR',
    },
    {
        date: '2019-12-05T03:53:00.000Z',
        value: 25,
        condition: 'CLR',
    },
    {
        date: '2019-12-05T04:53:00.000Z',
        value: 24.1,
        condition: 'CLR',
    },
    {
        date: '2019-12-05T05:53:00.000Z',
        value: 24.1,
        condition: 'CLR',
    },
    {
        date: '2019-12-05T06:16:00.000Z',
        value: 23,
        condition: 'CLR',
    },
    {
        date: '2019-12-05T06:23:00.000Z',
        value: 23,
        condition: 'CLR',
    },
    {
        date: '2019-12-05T06:53:00.000Z',
        value: 23,
        condition: 'CLR',
    },
    {
        date: '2019-12-05T07:44:00.000Z',
        value: 23,
        condition: 'CLR',
    },
    {
        date: '2019-12-05T07:53:00.000Z',
        value: 23,
        condition: 'CLR',
    },
    {
        date: '2019-12-05T08:33:00.000Z',
        value: 21.9,
        condition: 'CLR',
    },
    {
        date: '2019-12-05T08:48:00.000Z',
        value: 21.2,
        condition: 'CLR',
    },
    {
        date: '2019-12-05T08:53:00.000Z',
        value: 21,
        condition: 'CLR',
    },
    {
        date: '2019-12-05T09:02:00.000Z',
        value: 21.9,
        condition: 'CLR',
    },
    {
        date: '2019-12-05T09:17:00.000Z',
        value: 21,
        condition: 'CLR',
    },
    {
        date: '2019-12-05T09:27:00.000Z',
        value: 21,
        condition: 'CLR',
    },
    {
        date: '2019-12-05T09:37:00.000Z',
        value: 23,
        condition: 'CLR',
    },
    {
        date: '2019-12-05T09:44:00.000Z',
        value: 21.9,
        condition: 'CLR',
    },
    {
        date: '2019-12-05T09:53:00.000Z',
        value: 21.9,
        condition: 'CLR',
    },
    {
        date: '2019-12-05T10:38:00.000Z',
        value: 21.9,
        condition: 'CLR',
    },
    {
        date: '2019-12-05T10:53:00.000Z',
        value: 21,
        condition: 'CLR',
    },
    {
        date: '2019-12-05T11:06:00.000Z',
        value: 21.9,
        condition: 'CLR',
    },
    {
        date: '2019-12-05T11:53:00.000Z',
        value: 21,
        condition: 'FEW',
    },
    {
        date: '2019-12-05T12:53:00.000Z',
        value: 24.1,
        condition: 'BKN',
    },
    {
        date: '2019-12-05T13:53:00.000Z',
        value: 25,
        condition: 'FEW',
    },
    {
        date: '2019-12-05T14:53:00.000Z',
        value: 25,
        condition: 'CLR',
    },
    {
        date: '2019-12-05T15:53:00.000Z',
        value: 27,
        condition: 'CLR',
    },
    {
        date: '2019-12-05T16:53:00.000Z',
        value: 28.9,
        condition: 'CLR',
    },
    {
        date: '2019-12-05T17:53:00.000Z',
        value: 32,
        condition: 'CLR',
    },
    {
        date: '2019-12-05T18:53:00.000Z',
        value: 35.1,
        condition: 'CLR',
    },
    {
        date: '2019-12-05T19:53:00.000Z',
        value: 36,
        condition: 'CLR',
    },
    {
        date: '2019-12-05T20:53:00.000Z',
        value: 37,
        condition: 'CLR',
    },
    {
        date: '2019-12-05T21:53:00.000Z',
        value: 35.1,
        condition: 'CLR',
    },
    {
        date: '2019-12-05T22:53:00.000Z',
        value: 32,
        condition: 'CLR',
    },
    {
        date: '2019-12-05T23:53:00.000Z',
        value: 32,
        condition: 'CLR',
    },
    {
        date: '2019-12-06T00:53:00.000Z',
        value: 33.1,
        condition: 'CLR',
    },
    {
        date: '2019-12-06T01:53:00.000Z',
        value: 33.1,
        condition: 'CLR',
    },
    {
        date: '2019-12-06T02:14:00.000Z',
        value: 33.1,
        condition: 'BKN',
    },
    {
        date: '2019-12-06T02:53:00.000Z',
        value: 33.1,
        condition: 'OVC',
    },
    {
        date: '2019-12-06T03:53:00.000Z',
        value: 33.1,
        condition: 'OVC',
    },
    {
        date: '2019-12-06T04:38:00.000Z',
        value: 30.9,
        condition: 'SCT',
    },
    {
        date: '2019-12-06T04:53:00.000Z',
        value: 30.9,
        condition: 'CLR',
    },
    {
        date: '2019-12-06T05:21:00.000Z',
        value: 32,
        condition: 'BKN',
    },
    {
        date: '2019-12-06T05:53:00.000Z',
        value: 32,
        condition: 'OVC',
    },
    {
        date: '2019-12-06T06:53:00.000Z',
        value: 32,
        condition: 'OVC',
    },
    {
        date: '2019-12-06T07:53:00.000Z',
        value: 28,
        condition: 'FEW',
    },
    {
        date: '2019-12-06T08:53:00.000Z',
        value: 25,
        condition: 'CLR',
    },
    {
        date: '2019-12-06T09:53:00.000Z',
        value: 23,
        condition: 'CLR',
    },
    {
        date: '2019-12-06T10:53:00.000Z',
        value: 21,
        condition: 'CLR',
    },
    {
        date: '2019-12-06T11:53:00.000Z',
        value: 19,
        condition: 'CLR',
    },
    {
        date: '2019-12-06T12:53:00.000Z',
        value: 16,
        condition: 'CLR',
    },
    {
        date: '2019-12-06T13:53:00.000Z',
        value: 16,
        condition: 'CLR',
    },
    {
        date: '2019-12-06T14:53:00.000Z',
        value: 17.1,
        condition: 'CLR',
    },
    {
        date: '2019-12-06T15:53:00.000Z',
        value: 18,
        condition: 'CLR',
    },
    {
        date: '2019-12-06T16:53:00.000Z',
        value: 21.9,
        condition: 'CLR',
    },
    {
        date: '2019-12-06T17:53:00.000Z',
        value: 21.9,
        condition: 'CLR',
    },
    {
        date: '2019-12-06T18:53:00.000Z',
        value: 23,
        condition: 'CLR',
    },
    {
        date: '2019-12-06T19:53:00.000Z',
        value: 23,
        condition: 'CLR',
    },
    {
        date: '2019-12-06T20:53:00.000Z',
        value: 21.9,
        condition: 'CLR',
    },
    {
        date: '2019-12-06T21:53:00.000Z',
        value: 21.9,
        condition: 'OVC',
    },
    {
        date: '2019-12-06T22:53:00.000Z',
        value: 19.9,
        condition: 'OVC',
    },
    {
        date: '2019-12-06T23:53:00.000Z',
        value: 21,
        condition: 'OVC',
    },
    {
        date: '2019-12-07T00:53:00.000Z',
        value: 21,
        condition: 'OVC',
    },
    {
        date: '2019-12-07T01:53:00.000Z',
        value: 21.9,
        condition: 'OVC',
    },
    {
        date: '2019-12-07T02:53:00.000Z',
        value: 23,
        condition: 'SCT',
    },
    {
        date: '2019-12-07T03:53:00.000Z',
        value: 23,
        condition: 'BKN',
    },
    {
        date: '2019-12-07T04:53:00.000Z',
        value: 25,
        condition: 'OVC',
    },
    {
        date: '2019-12-07T05:53:00.000Z',
        value: 25,
        condition: 'OVC',
    },
    {
        date: '2019-12-07T06:53:00.000Z',
        value: 26.1,
        condition: 'OVC',
    },
    {
        date: '2019-12-07T07:53:00.000Z',
        value: 27,
        condition: 'OVC',
    },
    {
        date: '2019-12-07T08:53:00.000Z',
        value: 26.1,
        condition: 'SCT',
    },
    {
        date: '2019-12-07T09:53:00.000Z',
        value: 25,
        condition: 'BKN',
    },
    {
        date: '2019-12-07T10:53:00.000Z',
        value: 25,
        condition: 'FEW',
    },
    {
        date: '2019-12-07T11:53:00.000Z',
        value: 24.1,
        condition: 'FEW',
    },
    {
        date: '2019-12-07T12:53:00.000Z',
        value: 23,
        condition: 'CLR',
    },
    {
        date: '2019-12-07T13:53:00.000Z',
        value: 24.1,
        condition: 'CLR',
    },
    {
        date: '2019-12-07T14:53:00.000Z',
        value: 25,
        condition: 'CLR',
    },
    {
        date: '2019-12-07T15:53:00.000Z',
        value: 27,
        condition: 'CLR',
    },
    {
        date: '2019-12-07T16:53:00.000Z',
        value: 30,
        condition: 'CLR',
    },
    {
        date: '2019-12-07T17:53:00.000Z',
        value: 32,
        condition: 'CLR',
    },
    {
        date: '2019-12-07T18:53:00.000Z',
        value: 32,
        condition: 'CLR',
    },
    {
        date: '2019-12-07T19:53:00.000Z',
        value: 34,
        condition: 'CLR',
    },
    {
        date: '2019-12-07T20:53:00.000Z',
        value: 34,
        condition: 'CLR',
    },
    {
        date: '2019-12-07T21:53:00.000Z',
        value: 34,
        condition: 'CLR',
    },
    {
        date: '2019-12-07T22:53:00.000Z',
        value: 35.1,
        condition: 'CLR',
    },
    {
        date: '2019-12-07T23:53:00.000Z',
        value: 35.1,
        condition: 'CLR',
    },
    {
        date: '2019-12-08T00:53:00.000Z',
        value: 37.9,
        condition: 'CLR',
    },
    {
        date: '2019-12-08T01:53:00.000Z',
        value: 39.9,
        condition: 'CLR',
    },
    {
        date: '2019-12-08T02:53:00.000Z',
        value: 41,
        condition: 'CLR',
    },
    {
        date: '2019-12-08T03:53:00.000Z',
        value: 39,
        condition: 'CLR',
    },
    {
        date: '2019-12-08T04:53:00.000Z',
        value: 39,
        condition: 'CLR',
    },
    {
        date: '2019-12-08T05:53:00.000Z',
        value: 39,
        condition: 'CLR',
    },
    {
        date: '2019-12-08T06:53:00.000Z',
        value: 39,
        condition: 'CLR',
    },
    {
        date: '2019-12-08T07:53:00.000Z',
        value: 37.9,
        condition: 'CLR',
    },
    {
        date: '2019-12-08T08:53:00.000Z',
        value: 37,
        condition: 'CLR',
    },
    {
        date: '2019-12-08T09:53:00.000Z',
        value: 36,
        condition: 'CLR',
    },
    {
        date: '2019-12-08T10:53:00.000Z',
        value: 34,
        condition: 'CLR',
    },
    {
        date: '2019-12-08T11:53:00.000Z',
        value: 33.1,
        condition: 'CLR',
    },
    {
        date: '2019-12-08T12:53:00.000Z',
        value: 30.9,
        condition: 'CLR',
    },
    {
        date: '2019-12-08T13:53:00.000Z',
        value: 28,
        condition: 'CLR',
    },
    {
        date: '2019-12-08T14:53:00.000Z',
        value: 30,
        condition: 'CLR',
    },
    {
        date: '2019-12-08T15:53:00.000Z',
        value: 32,
        condition: 'BKN',
    },
    {
        date: '2019-12-08T16:23:00.000Z',
        value: 30.9,
        condition: 'OVC',
    },
    {
        date: '2019-12-08T16:53:00.000Z',
        value: 30.9,
        condition: 'OVC',
    },
    {
        date: '2019-12-08T17:53:00.000Z',
        value: 32,
        condition: 'OVC',
    },
    {
        date: '2019-12-08T18:53:00.000Z',
        value: 32,
        condition: 'OVC',
    },
    {
        date: '2019-12-08T19:53:00.000Z',
        value: 33.1,
        condition: 'OVC',
    },
    {
        date: '2019-12-08T20:04:00.000Z',
        value: 33.1,
        condition: 'OVC',
    },
    {
        date: '2019-12-08T20:53:00.000Z',
        value: 33.1,
        condition: 'OVC',
    },
    {
        date: '2019-12-08T21:53:00.000Z',
        value: 33.1,
        condition: 'OVC',
    },
    {
        date: '2019-12-08T22:53:00.000Z',
        value: 34,
        condition: 'OVC',
    },
    {
        date: '2019-12-08T23:53:00.000Z',
        value: 34,
        condition: 'OVC',
    },
    {
        date: '2019-12-09T00:53:00.000Z',
        value: 34,
        condition: 'OVC',
    },
    {
        date: '2019-12-09T01:53:00.000Z',
        value: 34,
        condition: 'OVC',
    },
    {
        date: '2019-12-09T02:53:00.000Z',
        value: 34,
        condition: 'OVC',
    },
    {
        date: '2019-12-09T03:53:00.000Z',
        value: 34,
        condition: 'OVC',
    },
    {
        date: '2019-12-09T04:53:00.000Z',
        value: 34,
        condition: 'OVC',
    },
    {
        date: '2019-12-09T05:53:00.000Z',
        value: 34,
        condition: 'OVC',
    },
    {
        date: '2019-12-09T06:53:00.000Z',
        value: 34,
        condition: 'OVC',
    },
    {
        date: '2019-12-09T07:06:00.000Z',
        value: 34,
        condition: 'OVC',
    },
    {
        date: '2019-12-09T07:53:00.000Z',
        value: 34,
        condition: 'BKN',
    },
    {
        date: '2019-12-09T08:06:00.000Z',
        value: 34,
        condition: 'SCT',
    },
    {
        date: '2019-12-09T08:16:00.000Z',
        value: 34,
        condition: 'OVC',
    },
    {
        date: '2019-12-09T08:51:00.000Z',
        value: 33.8,
        condition: 'OVC',
    },
    {
        date: '2019-12-09T08:53:00.000Z',
        value: 33.1,
        condition: 'OVC',
    },
    {
        date: '2019-12-09T09:53:00.000Z',
        value: 33.1,
        condition: 'OVC',
    },
    {
        date: '2019-12-09T10:45:00.000Z',
        value: 33.1,
        condition: 'BKN',
    },
    {
        date: '2019-12-09T10:53:00.000Z',
        value: 33.1,
        condition: 'OVC',
    },
    {
        date: '2019-12-09T11:06:00.000Z',
        value: 33.1,
        condition: 'OVC',
    },
    {
        date: '2019-12-09T11:22:00.000Z',
        value: 32,
        condition: 'OVC',
    },
    {
        date: '2019-12-09T11:53:00.000Z',
        value: 33.1,
        condition: 'OVC',
    },
    {
        date: '2019-12-09T12:13:00.000Z',
        value: 32,
        condition: 'OVC',
    },
    {
        date: '2019-12-09T12:32:00.000Z',
        value: 26.1,
        condition: 'BKN',
    },
    {
        date: '2019-12-09T12:40:00.000Z',
        value: 25,
        condition: 'SCT',
    },
    {
        date: '2019-12-09T12:53:00.000Z',
        value: 25,
        condition: 'FEW',
    },
    {
        date: '2019-12-09T12:56:00.000Z',
        value: 24.1,
        condition: 'FEW',
    },
    {
        date: '2019-12-09T13:53:00.000Z',
        value: 21,
        condition: 'VV ',
    },
    {
        date: '2019-12-09T14:32:00.000Z',
        value: 19.9,
        condition: 'VV ',
    },
    {
        date: '2019-12-09T14:51:00.000Z',
        value: 19.4,
        condition: 'VV ',
    },
    {
        date: '2019-12-09T14:53:00.000Z',
        value: 19.9,
        condition: 'VV ',
    },
    {
        date: '2019-12-09T15:53:00.000Z',
        value: 19,
        condition: 'FEW',
    },
    {
        date: '2019-12-09T16:53:00.000Z',
        value: 17.1,
        condition: 'SCT',
    },
    {
        date: '2019-12-09T17:46:00.000Z',
        value: 15.1,
        condition: 'SCT',
    },
    {
        date: '2019-12-09T17:53:00.000Z',
        value: 15.1,
        condition: 'SCT',
    },
    {
        date: '2019-12-09T18:53:00.000Z',
        value: 16,
        condition: 'SCT',
    },
    {
        date: '2019-12-09T19:53:00.000Z',
        value: 15.1,
        condition: 'OVC',
    },
    {
        date: '2019-12-09T20:53:00.000Z',
        value: 14,
        condition: 'OVC',
    },
    {
        date: '2019-12-09T21:53:00.000Z',
        value: 14,
        condition: 'OVC',
    },
    {
        date: '2019-12-09T22:53:00.000Z',
        value: 12.9,
        condition: 'OVC',
    },
    {
        date: '2019-12-09T23:53:00.000Z',
        value: 10,
        condition: 'OVC',
    },
    {
        date: '2019-12-10T00:53:00.000Z',
        value: 6.1,
        condition: 'FEW',
    },
    {
        date: '2019-12-10T01:53:00.000Z',
        value: 3,
        condition: 'CLR',
    },
    {
        date: '2019-12-10T02:53:00.000Z',
        value: 1,
        condition: 'CLR',
    },
    {
        date: '2019-12-10T03:53:00.000Z',
        value: -0.9,
        condition: 'CLR',
    },
    {
        date: '2019-12-10T04:53:00.000Z',
        value: -0.9,
        condition: 'CLR',
    },
    {
        date: '2019-12-10T05:53:00.000Z',
        value: -4,
        condition: 'CLR',
    },
    {
        date: '2019-12-10T06:53:00.000Z',
        value: -5.1,
        condition: 'CLR',
    },
    {
        date: '2019-12-10T07:53:00.000Z',
        value: -6,
        condition: 'CLR',
    },
    {
        date: '2019-12-10T08:53:00.000Z',
        value: -6,
        condition: 'CLR',
    },
    {
        date: '2019-12-10T09:53:00.000Z',
        value: -7.1,
        condition: 'CLR',
    },
    {
        date: '2019-12-10T10:53:00.000Z',
        value: -7.1,
        condition: 'CLR',
    },
    {
        date: '2019-12-10T11:53:00.000Z',
        value: -5.1,
        condition: 'FEW',
    },
    {
        date: '2019-12-10T12:53:00.000Z',
        value: -2.9,
        condition: 'OVC',
    },
    {
        date: '2019-12-10T13:21:00.000Z',
        value: -4,
        condition: 'FEW',
    },
    {
        date: '2019-12-10T13:53:00.000Z',
        value: -2,
        condition: 'OVC',
    },
    {
        date: '2019-12-10T14:53:00.000Z',
        value: 0,
        condition: 'OVC',
    },
    {
        date: '2019-12-10T15:17:00.000Z',
        value: 1.9,
        condition: 'FEW',
    },
    {
        date: '2019-12-10T15:28:00.000Z',
        value: 3,
        condition: 'SCT',
    },
    {
        date: '2019-12-10T15:53:00.000Z',
        value: 3,
        condition: 'CLR',
    },
    {
        date: '2019-12-10T16:53:00.000Z',
        value: 5,
        condition: 'CLR',
    },
    {
        date: '2019-12-10T17:53:00.000Z',
        value: 6.1,
        condition: 'FEW',
    },
    {
        date: '2019-12-10T18:53:00.000Z',
        value: 5,
        condition: 'CLR',
    },
    {
        date: '2019-12-10T19:53:00.000Z',
        value: 5,
        condition: 'CLR',
    },
    {
        date: '2019-12-10T20:53:00.000Z',
        value: 3,
        condition: 'CLR',
    },
    {
        date: '2019-12-10T21:53:00.000Z',
        value: 1,
        condition: 'CLR',
    },
    {
        date: '2019-12-10T22:53:00.000Z',
        value: -2,
        condition: 'CLR',
    },
    {
        date: '2019-12-10T23:53:00.000Z',
        value: -4,
        condition: 'CLR',
    },
];
/* harmony default export */ const dataLine2 = (dataLine);

;// CONCATENATED MODULE: ./src/index.ts
/**
 * Para el ejemplo ChatGPT ha generado los datos comparativos del uso de TypeScript y
 * Javascript sobre los diez años anteriores a su entrenamiento.
 */
// globalThis.debug = true


const encodePlot = { x: (d) => new Date(d.date), y: 'value' };
const encodeLine = { x: (d) => new Date(d.date), y: 'close' };
const encodeLine2 = { x: (d) => new Date(d.date), y: 'value' };
const container = document.querySelector('#chart');
const options = {
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
};
const chart = new Chart({ container, options });

