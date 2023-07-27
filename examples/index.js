/******/ /* webpack/runtime/compat */
/******/ 
/******/ if (typeof __nccwpck_require__ !== 'undefined') __nccwpck_require__.ab = new URL('.', import.meta.url).pathname.slice(import.meta.url.match(/^file:\/\/\/\w:/) ? 1 : 0, -1) + "/";
/******/ 
/************************************************************************/
var __webpack_exports__ = {};

;// CONCATENATED MODULE: ./src/geoms/arc.ts
class Arc {
    constructor({ context, x, y, r, start, end, color, border, opacity = 1, emphasis }) {
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

;// CONCATENATED MODULE: ./src/geoms/circle.ts

class Circle extends Arc {
    constructor({ context, x, y, r, color, border, emphasis }) {
        super({ context, x, y, r, start: 0, end: Math.PI * 2, color, border, emphasis });
    }
    draw() {
        super.draw();
    }
}

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
function drawText({ context, text, point, align = 'center', verticalAlign = 'middle', size = 10, color = 'black', }) {
    context.textAlign = align;
    context.textBaseline = verticalAlign;
    context.font = `${size}px SF Pro`;
    context.fillStyle = color;
    context.fillText(text, point.x, point.y);
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

;// CONCATENATED MODULE: ./src/core/canvas.ts
class Canvas {
    constructor(container) {
        this.container = container;
        this.canvas = this.canvas || document.createElement('canvas');
        this.context = this.context || this.canvas.getContext('2d');
        this.resize();
        this.container.appendChild(this.canvas);
    }
    resize() {
        const { width, height } = this.container.getBoundingClientRect();
        const scale = window.devicePixelRatio || 1;
        this.canvas.style.width = width + 'px';
        this.canvas.style.height = height + 'px';
        this.canvas.width = width * scale;
        this.canvas.height = height * scale;
        this.size = { width: width, height: height };
        this.context.scale(scale, scale);
        return this.size;
    }
    getCanvas() {
        return this.canvas;
    }
    getContext() {
        return this.context;
    }
    getSize() {
        return this.size;
    }
}

;// CONCATENATED MODULE: ./src/core/chart.ts



const CIRCLE_SIZE = 6;
const OPTIONS = {
    margin: { top: 20, left: 40, bottom: 20, right: 40 },
    axisX: 'data',
    axisY: 'value',
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
    constructor({ type = 'point', container, data, options }) {
        this.data = [];
        this.elements = [];
        this.nearestItemToMouse = null;
        this.prevNearestItemToMouse = null;
        this.canvas = new Canvas(container);
        this.canvasElement = this.canvas.canvas;
        this.context = this.canvas.context;
        this.canvasSize = this.canvas.size;
        this.container = container;
        this.options = Object.assign(Object.assign({}, OPTIONS), options);
        this.data = this.options.encode
            ? encodeData(data, this.options.encode)
            : data;
        this.render();
        this.addEventListeners();
    }
    render() {
        this.canvasSize = this.canvas.resize();
        this.setBounds();
        this.createElements();
        this.draw();
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
        const bounds = {
            top: this.options.margin.top,
            right: this.canvasSize.width - this.options.margin.right,
            bottom: this.canvasSize.height - this.options.margin.bottom,
            left: this.options.margin.left,
        };
        return bounds;
    }
    /**
     * Calculates the bounding box relative to the data
     */
    getDataBounds() {
        const x = this.data.map((d) => d.x);
        const y = this.data.map((d) => d.y);
        const minX = Math.min(...x);
        const maxX = Math.max(...x);
        const minY = Math.min(...y);
        const maxY = Math.max(...y);
        this.dataRange = { min: minY, max: maxY };
        const bounds = {
            top: maxY,
            right: maxX,
            bottom: minY,
            left: minX,
        };
        return bounds;
    }
    /**
     * Creates the elements that shows the data
     *
     * @todo
     * This need to be something like Factory Pattern?
     */
    createElements() {
        const { context, data, dataBounds, pixelBounds, dataRange } = this;
        const { min, max } = dataRange;
        const range = (min - max) * -1;
        this.elements = [];
        for (const item of data) {
            const point = remapPoint(dataBounds, pixelBounds, {
                x: item.x,
                y: item.y,
            });
            // const opacity = Math.max(0.1, Math.min(1, q))
            const q = (item.y - min) / range;
            const color = interpolateColor('C7E9C0', '2B8CBE', q);
            const circle = new Circle({
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
            });
            this.elements.push(circle);
        }
    }
    /**
     * Handle the draw of all elements that composes the chart and of course, clean the canvas.
     */
    draw() {
        const { canvasSize, context } = this;
        context.clearRect(0, 0, canvasSize.width, canvasSize.height);
        this.drawAxes();
        this.drawElements();
    }
    /**
     * This method is responsible for handling the drawing of the elements.
     */
    drawElements() {
        const { elements } = this;
        if (this.nearestItemToMouse !== null) {
            this.prevNearestItemToMouse = this.nearestItemToMouse;
            const circle = elements[this.nearestItemToMouse];
            circle.emphasize();
        }
        if (this.prevNearestItemToMouse !== null) {
            const circle = elements[this.prevNearestItemToMouse];
            circle.unemphasize();
        }
        this.prevNearestItemToMouse = null;
        this.nearestItemToMouse = null;
        this.elements.forEach((element) => element.draw());
    }
    /**
     * I don't like axes, I really love grids!
     */
    drawAxes() {
        const { canvasSize, context, pixelBounds } = this;
        const position = {
            x: canvasSize.width / 2,
            y: pixelBounds.bottom + 12,
        };
        drawText({
            context: context,
            text: 'Value',
            point: position,
            size: 12,
        });
        context.beginPath();
        context.moveTo(pixelBounds.left, pixelBounds.bottom);
        context.lineTo(pixelBounds.right, pixelBounds.bottom);
        context.lineWidth = 1;
        context.strokeStyle = 'rgb(245, 245, 245)';
        context.stroke();
    }
    /**
     * @todo
     * Move it
     */
    drawThresholdLine(value = 0, color = 'darkgrey') {
        const { context, dataBounds, dataRange, pixelBounds } = this;
        const height = pixelBounds.bottom - pixelBounds.top;
        const range = (dataRange.min - dataRange.max) * -1;
        const escalaY = height / range;
        const zero = dataBounds.top + height - (value - dataRange.min) * escalaY;
        context.beginPath();
        context.moveTo(pixelBounds.left, zero);
        context.lineTo(pixelBounds.right, zero);
        context.lineWidth = 1;
        context.strokeStyle = color;
        context.stroke();
    }
    /**
     * Event listener management
     */
    addEventListeners() {
        const { canvasElement: canvas, data, dataBounds, pixelBounds } = this;
        window.addEventListener('resize', debounce(() => this.render(), 100), false);
        /**
         * @todo
         * This isn't efficient. It should be fired every mouse movement and should probably causes
         * performance issues. A possible solution is to move the nearest element find logic to a
         * method that is called on requestAnimationFrame and the mousemove event handler only
         * handle a control variable.
         */
        canvas.addEventListener('mousemove', (event) => {
            const pLocation = this.getMousePoint(event);
            const point = remapPoint(dataBounds, pixelBounds, pLocation);
            const points = data.map((item) => remapPoint(dataBounds, pixelBounds, { x: item.x, y: item.y }));
            const index = getNearestIndex(point, points);
            const dist = distance(points[index], point);
            if (dist < CIRCLE_SIZE) {
                this.nearestItemToMouse = index;
            }
            else {
                this.nearestItemToMouse = null;
            }
            this.draw();
        });
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

;// CONCATENATED MODULE: ./src/data/dataPlot.ts
const dataPlot = [
    {
        "date": "1880-01-01T00:00:00.000Z",
        "value": -0.3
    },
    {
        "date": "1880-02-01T00:00:00.000Z",
        "value": -0.21
    },
    {
        "date": "1880-03-01T00:00:00.000Z",
        "value": -0.18
    },
    {
        "date": "1880-04-01T00:00:00.000Z",
        "value": -0.27
    },
    {
        "date": "1880-05-01T00:00:00.000Z",
        "value": -0.14
    },
    {
        "date": "1880-06-01T00:00:00.000Z",
        "value": -0.29
    },
    {
        "date": "1880-07-01T00:00:00.000Z",
        "value": -0.24
    },
    {
        "date": "1880-08-01T00:00:00.000Z",
        "value": -0.08
    },
    {
        "date": "1880-09-01T00:00:00.000Z",
        "value": -0.17
    },
    {
        "date": "1880-10-01T00:00:00.000Z",
        "value": -0.16
    },
    {
        "date": "1880-11-01T00:00:00.000Z",
        "value": -0.19
    },
    {
        "date": "1880-12-01T00:00:00.000Z",
        "value": -0.22
    },
    {
        "date": "1881-01-01T00:00:00.000Z",
        "value": -0.1
    },
    {
        "date": "1881-02-01T00:00:00.000Z",
        "value": -0.14
    },
    {
        "date": "1881-03-01T00:00:00.000Z",
        "value": 0.01
    },
    {
        "date": "1881-04-01T00:00:00.000Z",
        "value": -0.03
    },
    {
        "date": "1881-05-01T00:00:00.000Z",
        "value": -0.04
    },
    {
        "date": "1881-06-01T00:00:00.000Z",
        "value": -0.28
    },
    {
        "date": "1881-07-01T00:00:00.000Z",
        "value": -0.07
    },
    {
        "date": "1881-08-01T00:00:00.000Z",
        "value": -0.03
    },
    {
        "date": "1881-09-01T00:00:00.000Z",
        "value": -0.09
    },
    {
        "date": "1881-10-01T00:00:00.000Z",
        "value": -0.2
    },
    {
        "date": "1881-11-01T00:00:00.000Z",
        "value": -0.26
    },
    {
        "date": "1881-12-01T00:00:00.000Z",
        "value": -0.16
    },
    {
        "date": "1882-01-01T00:00:00.000Z",
        "value": 0.09
    },
    {
        "date": "1882-02-01T00:00:00.000Z",
        "value": 0.08
    },
    {
        "date": "1882-03-01T00:00:00.000Z",
        "value": 0.01
    },
    {
        "date": "1882-04-01T00:00:00.000Z",
        "value": -0.2
    },
    {
        "date": "1882-05-01T00:00:00.000Z",
        "value": -0.18
    },
    {
        "date": "1882-06-01T00:00:00.000Z",
        "value": -0.25
    },
    {
        "date": "1882-07-01T00:00:00.000Z",
        "value": -0.11
    },
    {
        "date": "1882-08-01T00:00:00.000Z",
        "value": 0.03
    },
    {
        "date": "1882-09-01T00:00:00.000Z",
        "value": -0.01
    },
    {
        "date": "1882-10-01T00:00:00.000Z",
        "value": -0.23
    },
    {
        "date": "1882-11-01T00:00:00.000Z",
        "value": -0.21
    },
    {
        "date": "1882-12-01T00:00:00.000Z",
        "value": -0.25
    },
    {
        "date": "1883-01-01T00:00:00.000Z",
        "value": -0.34
    },
    {
        "date": "1883-02-01T00:00:00.000Z",
        "value": -0.42
    },
    {
        "date": "1883-03-01T00:00:00.000Z",
        "value": -0.18
    },
    {
        "date": "1883-04-01T00:00:00.000Z",
        "value": -0.25
    },
    {
        "date": "1883-05-01T00:00:00.000Z",
        "value": -0.26
    },
    {
        "date": "1883-06-01T00:00:00.000Z",
        "value": -0.13
    },
    {
        "date": "1883-07-01T00:00:00.000Z",
        "value": -0.09
    },
    {
        "date": "1883-08-01T00:00:00.000Z",
        "value": -0.14
    },
    {
        "date": "1883-09-01T00:00:00.000Z",
        "value": -0.19
    },
    {
        "date": "1883-10-01T00:00:00.000Z",
        "value": -0.12
    },
    {
        "date": "1883-11-01T00:00:00.000Z",
        "value": -0.21
    },
    {
        "date": "1883-12-01T00:00:00.000Z",
        "value": -0.19
    },
    {
        "date": "1884-01-01T00:00:00.000Z",
        "value": -0.18
    },
    {
        "date": "1884-02-01T00:00:00.000Z",
        "value": -0.13
    },
    {
        "date": "1884-03-01T00:00:00.000Z",
        "value": -0.36
    },
    {
        "date": "1884-04-01T00:00:00.000Z",
        "value": -0.36
    },
    {
        "date": "1884-05-01T00:00:00.000Z",
        "value": -0.32
    },
    {
        "date": "1884-06-01T00:00:00.000Z",
        "value": -0.38
    },
    {
        "date": "1884-07-01T00:00:00.000Z",
        "value": -0.35
    },
    {
        "date": "1884-08-01T00:00:00.000Z",
        "value": -0.27
    },
    {
        "date": "1884-09-01T00:00:00.000Z",
        "value": -0.24
    },
    {
        "date": "1884-10-01T00:00:00.000Z",
        "value": -0.22
    },
    {
        "date": "1884-11-01T00:00:00.000Z",
        "value": -0.3
    },
    {
        "date": "1884-12-01T00:00:00.000Z",
        "value": -0.3
    },
    {
        "date": "1885-01-01T00:00:00.000Z",
        "value": -0.66
    },
    {
        "date": "1885-02-01T00:00:00.000Z",
        "value": -0.3
    },
    {
        "date": "1885-03-01T00:00:00.000Z",
        "value": -0.24
    },
    {
        "date": "1885-04-01T00:00:00.000Z",
        "value": -0.45
    },
    {
        "date": "1885-05-01T00:00:00.000Z",
        "value": -0.42
    },
    {
        "date": "1885-06-01T00:00:00.000Z",
        "value": -0.5
    },
    {
        "date": "1885-07-01T00:00:00.000Z",
        "value": -0.29
    },
    {
        "date": "1885-08-01T00:00:00.000Z",
        "value": -0.27
    },
    {
        "date": "1885-09-01T00:00:00.000Z",
        "value": -0.19
    },
    {
        "date": "1885-10-01T00:00:00.000Z",
        "value": -0.2
    },
    {
        "date": "1885-11-01T00:00:00.000Z",
        "value": -0.22
    },
    {
        "date": "1885-12-01T00:00:00.000Z",
        "value": -0.07
    },
    {
        "date": "1886-01-01T00:00:00.000Z",
        "value": -0.43
    },
    {
        "date": "1886-02-01T00:00:00.000Z",
        "value": -0.46
    },
    {
        "date": "1886-03-01T00:00:00.000Z",
        "value": -0.41
    },
    {
        "date": "1886-04-01T00:00:00.000Z",
        "value": -0.29
    },
    {
        "date": "1886-05-01T00:00:00.000Z",
        "value": -0.27
    },
    {
        "date": "1886-06-01T00:00:00.000Z",
        "value": -0.39
    },
    {
        "date": "1886-07-01T00:00:00.000Z",
        "value": -0.16
    },
    {
        "date": "1886-08-01T00:00:00.000Z",
        "value": -0.31
    },
    {
        "date": "1886-09-01T00:00:00.000Z",
        "value": -0.19
    },
    {
        "date": "1886-10-01T00:00:00.000Z",
        "value": -0.25
    },
    {
        "date": "1886-11-01T00:00:00.000Z",
        "value": -0.26
    },
    {
        "date": "1886-12-01T00:00:00.000Z",
        "value": -0.25
    },
    {
        "date": "1887-01-01T00:00:00.000Z",
        "value": -0.66
    },
    {
        "date": "1887-02-01T00:00:00.000Z",
        "value": -0.48
    },
    {
        "date": "1887-03-01T00:00:00.000Z",
        "value": -0.32
    },
    {
        "date": "1887-04-01T00:00:00.000Z",
        "value": -0.37
    },
    {
        "date": "1887-05-01T00:00:00.000Z",
        "value": -0.33
    },
    {
        "date": "1887-06-01T00:00:00.000Z",
        "value": -0.21
    },
    {
        "date": "1887-07-01T00:00:00.000Z",
        "value": -0.19
    },
    {
        "date": "1887-08-01T00:00:00.000Z",
        "value": -0.28
    },
    {
        "date": "1887-09-01T00:00:00.000Z",
        "value": -0.19
    },
    {
        "date": "1887-10-01T00:00:00.000Z",
        "value": -0.32
    },
    {
        "date": "1887-11-01T00:00:00.000Z",
        "value": -0.25
    },
    {
        "date": "1887-12-01T00:00:00.000Z",
        "value": -0.38
    },
    {
        "date": "1888-01-01T00:00:00.000Z",
        "value": -0.43
    },
    {
        "date": "1888-02-01T00:00:00.000Z",
        "value": -0.43
    },
    {
        "date": "1888-03-01T00:00:00.000Z",
        "value": -0.47
    },
    {
        "date": "1888-04-01T00:00:00.000Z",
        "value": -0.28
    },
    {
        "date": "1888-05-01T00:00:00.000Z",
        "value": -0.22
    },
    {
        "date": "1888-06-01T00:00:00.000Z",
        "value": -0.2
    },
    {
        "date": "1888-07-01T00:00:00.000Z",
        "value": -0.1
    },
    {
        "date": "1888-08-01T00:00:00.000Z",
        "value": -0.11
    },
    {
        "date": "1888-09-01T00:00:00.000Z",
        "value": -0.07
    },
    {
        "date": "1888-10-01T00:00:00.000Z",
        "value": 0.01
    },
    {
        "date": "1888-11-01T00:00:00.000Z",
        "value": 0
    },
    {
        "date": "1888-12-01T00:00:00.000Z",
        "value": -0.12
    },
    {
        "date": "1889-01-01T00:00:00.000Z",
        "value": -0.21
    },
    {
        "date": "1889-02-01T00:00:00.000Z",
        "value": 0.14
    },
    {
        "date": "1889-03-01T00:00:00.000Z",
        "value": 0.04
    },
    {
        "date": "1889-04-01T00:00:00.000Z",
        "value": 0.04
    },
    {
        "date": "1889-05-01T00:00:00.000Z",
        "value": -0.03
    },
    {
        "date": "1889-06-01T00:00:00.000Z",
        "value": -0.12
    },
    {
        "date": "1889-07-01T00:00:00.000Z",
        "value": -0.05
    },
    {
        "date": "1889-08-01T00:00:00.000Z",
        "value": -0.18
    },
    {
        "date": "1889-09-01T00:00:00.000Z",
        "value": -0.18
    },
    {
        "date": "1889-10-01T00:00:00.000Z",
        "value": -0.22
    },
    {
        "date": "1889-11-01T00:00:00.000Z",
        "value": -0.32
    },
    {
        "date": "1889-12-01T00:00:00.000Z",
        "value": -0.31
    },
    {
        "date": "1890-01-01T00:00:00.000Z",
        "value": -0.48
    },
    {
        "date": "1890-02-01T00:00:00.000Z",
        "value": -0.48
    },
    {
        "date": "1890-03-01T00:00:00.000Z",
        "value": -0.41
    },
    {
        "date": "1890-04-01T00:00:00.000Z",
        "value": -0.38
    },
    {
        "date": "1890-05-01T00:00:00.000Z",
        "value": -0.48
    },
    {
        "date": "1890-06-01T00:00:00.000Z",
        "value": -0.27
    },
    {
        "date": "1890-07-01T00:00:00.000Z",
        "value": -0.3
    },
    {
        "date": "1890-08-01T00:00:00.000Z",
        "value": -0.36
    },
    {
        "date": "1890-09-01T00:00:00.000Z",
        "value": -0.36
    },
    {
        "date": "1890-10-01T00:00:00.000Z",
        "value": -0.23
    },
    {
        "date": "1890-11-01T00:00:00.000Z",
        "value": -0.37
    },
    {
        "date": "1890-12-01T00:00:00.000Z",
        "value": -0.3
    },
    {
        "date": "1891-01-01T00:00:00.000Z",
        "value": -0.46
    },
    {
        "date": "1891-02-01T00:00:00.000Z",
        "value": -0.49
    },
    {
        "date": "1891-03-01T00:00:00.000Z",
        "value": -0.15
    },
    {
        "date": "1891-04-01T00:00:00.000Z",
        "value": -0.25
    },
    {
        "date": "1891-05-01T00:00:00.000Z",
        "value": -0.17
    },
    {
        "date": "1891-06-01T00:00:00.000Z",
        "value": -0.22
    },
    {
        "date": "1891-07-01T00:00:00.000Z",
        "value": -0.22
    },
    {
        "date": "1891-08-01T00:00:00.000Z",
        "value": -0.21
    },
    {
        "date": "1891-09-01T00:00:00.000Z",
        "value": -0.13
    },
    {
        "date": "1891-10-01T00:00:00.000Z",
        "value": -0.24
    },
    {
        "date": "1891-11-01T00:00:00.000Z",
        "value": -0.37
    },
    {
        "date": "1891-12-01T00:00:00.000Z",
        "value": -0.03
    },
    {
        "date": "1892-01-01T00:00:00.000Z",
        "value": -0.26
    },
    {
        "date": "1892-02-01T00:00:00.000Z",
        "value": -0.15
    },
    {
        "date": "1892-03-01T00:00:00.000Z",
        "value": -0.36
    },
    {
        "date": "1892-04-01T00:00:00.000Z",
        "value": -0.35
    },
    {
        "date": "1892-05-01T00:00:00.000Z",
        "value": -0.25
    },
    {
        "date": "1892-06-01T00:00:00.000Z",
        "value": -0.2
    },
    {
        "date": "1892-07-01T00:00:00.000Z",
        "value": -0.28
    },
    {
        "date": "1892-08-01T00:00:00.000Z",
        "value": -0.2
    },
    {
        "date": "1892-09-01T00:00:00.000Z",
        "value": -0.25
    },
    {
        "date": "1892-10-01T00:00:00.000Z",
        "value": -0.17
    },
    {
        "date": "1892-11-01T00:00:00.000Z",
        "value": -0.49
    },
    {
        "date": "1892-12-01T00:00:00.000Z",
        "value": -0.29
    },
    {
        "date": "1893-01-01T00:00:00.000Z",
        "value": -0.69
    },
    {
        "date": "1893-02-01T00:00:00.000Z",
        "value": -0.51
    },
    {
        "date": "1893-03-01T00:00:00.000Z",
        "value": -0.24
    },
    {
        "date": "1893-04-01T00:00:00.000Z",
        "value": -0.32
    },
    {
        "date": "1893-05-01T00:00:00.000Z",
        "value": -0.35
    },
    {
        "date": "1893-06-01T00:00:00.000Z",
        "value": -0.24
    },
    {
        "date": "1893-07-01T00:00:00.000Z",
        "value": -0.14
    },
    {
        "date": "1893-08-01T00:00:00.000Z",
        "value": -0.24
    },
    {
        "date": "1893-09-01T00:00:00.000Z",
        "value": -0.18
    },
    {
        "date": "1893-10-01T00:00:00.000Z",
        "value": -0.16
    },
    {
        "date": "1893-11-01T00:00:00.000Z",
        "value": -0.17
    },
    {
        "date": "1893-12-01T00:00:00.000Z",
        "value": -0.38
    },
    {
        "date": "1894-01-01T00:00:00.000Z",
        "value": -0.55
    },
    {
        "date": "1894-02-01T00:00:00.000Z",
        "value": -0.31
    },
    {
        "date": "1894-03-01T00:00:00.000Z",
        "value": -0.2
    },
    {
        "date": "1894-04-01T00:00:00.000Z",
        "value": -0.41
    },
    {
        "date": "1894-05-01T00:00:00.000Z",
        "value": -0.3
    },
    {
        "date": "1894-06-01T00:00:00.000Z",
        "value": -0.43
    },
    {
        "date": "1894-07-01T00:00:00.000Z",
        "value": -0.32
    },
    {
        "date": "1894-08-01T00:00:00.000Z",
        "value": -0.29
    },
    {
        "date": "1894-09-01T00:00:00.000Z",
        "value": -0.23
    },
    {
        "date": "1894-10-01T00:00:00.000Z",
        "value": -0.17
    },
    {
        "date": "1894-11-01T00:00:00.000Z",
        "value": -0.25
    },
    {
        "date": "1894-12-01T00:00:00.000Z",
        "value": -0.22
    },
    {
        "date": "1895-01-01T00:00:00.000Z",
        "value": -0.44
    },
    {
        "date": "1895-02-01T00:00:00.000Z",
        "value": -0.42
    },
    {
        "date": "1895-03-01T00:00:00.000Z",
        "value": -0.3
    },
    {
        "date": "1895-04-01T00:00:00.000Z",
        "value": -0.23
    },
    {
        "date": "1895-05-01T00:00:00.000Z",
        "value": -0.23
    },
    {
        "date": "1895-06-01T00:00:00.000Z",
        "value": -0.25
    },
    {
        "date": "1895-07-01T00:00:00.000Z",
        "value": -0.16
    },
    {
        "date": "1895-08-01T00:00:00.000Z",
        "value": -0.16
    },
    {
        "date": "1895-09-01T00:00:00.000Z",
        "value": -0.02
    },
    {
        "date": "1895-10-01T00:00:00.000Z",
        "value": -0.11
    },
    {
        "date": "1895-11-01T00:00:00.000Z",
        "value": -0.15
    },
    {
        "date": "1895-12-01T00:00:00.000Z",
        "value": -0.12
    },
    {
        "date": "1896-01-01T00:00:00.000Z",
        "value": -0.23
    },
    {
        "date": "1896-02-01T00:00:00.000Z",
        "value": -0.15
    },
    {
        "date": "1896-03-01T00:00:00.000Z",
        "value": -0.29
    },
    {
        "date": "1896-04-01T00:00:00.000Z",
        "value": -0.33
    },
    {
        "date": "1896-05-01T00:00:00.000Z",
        "value": -0.19
    },
    {
        "date": "1896-06-01T00:00:00.000Z",
        "value": -0.13
    },
    {
        "date": "1896-07-01T00:00:00.000Z",
        "value": -0.06
    },
    {
        "date": "1896-08-01T00:00:00.000Z",
        "value": -0.09
    },
    {
        "date": "1896-09-01T00:00:00.000Z",
        "value": -0.05
    },
    {
        "date": "1896-10-01T00:00:00.000Z",
        "value": 0.04
    },
    {
        "date": "1896-11-01T00:00:00.000Z",
        "value": -0.16
    },
    {
        "date": "1896-12-01T00:00:00.000Z",
        "value": -0.12
    },
    {
        "date": "1897-01-01T00:00:00.000Z",
        "value": -0.22
    },
    {
        "date": "1897-02-01T00:00:00.000Z",
        "value": -0.19
    },
    {
        "date": "1897-03-01T00:00:00.000Z",
        "value": -0.12
    },
    {
        "date": "1897-04-01T00:00:00.000Z",
        "value": -0.01
    },
    {
        "date": "1897-05-01T00:00:00.000Z",
        "value": 0
    },
    {
        "date": "1897-06-01T00:00:00.000Z",
        "value": -0.12
    },
    {
        "date": "1897-07-01T00:00:00.000Z",
        "value": -0.04
    },
    {
        "date": "1897-08-01T00:00:00.000Z",
        "value": -0.03
    },
    {
        "date": "1897-09-01T00:00:00.000Z",
        "value": -0.04
    },
    {
        "date": "1897-10-01T00:00:00.000Z",
        "value": -0.1
    },
    {
        "date": "1897-11-01T00:00:00.000Z",
        "value": -0.18
    },
    {
        "date": "1897-12-01T00:00:00.000Z",
        "value": -0.26
    },
    {
        "date": "1898-01-01T00:00:00.000Z",
        "value": -0.06
    },
    {
        "date": "1898-02-01T00:00:00.000Z",
        "value": -0.34
    },
    {
        "date": "1898-03-01T00:00:00.000Z",
        "value": -0.55
    },
    {
        "date": "1898-04-01T00:00:00.000Z",
        "value": -0.33
    },
    {
        "date": "1898-05-01T00:00:00.000Z",
        "value": -0.35
    },
    {
        "date": "1898-06-01T00:00:00.000Z",
        "value": -0.2
    },
    {
        "date": "1898-07-01T00:00:00.000Z",
        "value": -0.22
    },
    {
        "date": "1898-08-01T00:00:00.000Z",
        "value": -0.22
    },
    {
        "date": "1898-09-01T00:00:00.000Z",
        "value": -0.19
    },
    {
        "date": "1898-10-01T00:00:00.000Z",
        "value": -0.32
    },
    {
        "date": "1898-11-01T00:00:00.000Z",
        "value": -0.35
    },
    {
        "date": "1898-12-01T00:00:00.000Z",
        "value": -0.22
    },
    {
        "date": "1899-01-01T00:00:00.000Z",
        "value": -0.18
    },
    {
        "date": "1899-02-01T00:00:00.000Z",
        "value": -0.39
    },
    {
        "date": "1899-03-01T00:00:00.000Z",
        "value": -0.35
    },
    {
        "date": "1899-04-01T00:00:00.000Z",
        "value": -0.21
    },
    {
        "date": "1899-05-01T00:00:00.000Z",
        "value": -0.2
    },
    {
        "date": "1899-06-01T00:00:00.000Z",
        "value": -0.26
    },
    {
        "date": "1899-07-01T00:00:00.000Z",
        "value": -0.13
    },
    {
        "date": "1899-08-01T00:00:00.000Z",
        "value": -0.04
    },
    {
        "date": "1899-09-01T00:00:00.000Z",
        "value": 0
    },
    {
        "date": "1899-10-01T00:00:00.000Z",
        "value": 0
    },
    {
        "date": "1899-11-01T00:00:00.000Z",
        "value": 0.12
    },
    {
        "date": "1899-12-01T00:00:00.000Z",
        "value": -0.27
    },
    {
        "date": "1900-01-01T00:00:00.000Z",
        "value": -0.4
    },
    {
        "date": "1900-02-01T00:00:00.000Z",
        "value": -0.08
    },
    {
        "date": "1900-03-01T00:00:00.000Z",
        "value": 0.02
    },
    {
        "date": "1900-04-01T00:00:00.000Z",
        "value": -0.14
    },
    {
        "date": "1900-05-01T00:00:00.000Z",
        "value": -0.06
    },
    {
        "date": "1900-06-01T00:00:00.000Z",
        "value": -0.15
    },
    {
        "date": "1900-07-01T00:00:00.000Z",
        "value": -0.09
    },
    {
        "date": "1900-08-01T00:00:00.000Z",
        "value": -0.04
    },
    {
        "date": "1900-09-01T00:00:00.000Z",
        "value": 0.01
    },
    {
        "date": "1900-10-01T00:00:00.000Z",
        "value": 0.08
    },
    {
        "date": "1900-11-01T00:00:00.000Z",
        "value": -0.13
    },
    {
        "date": "1900-12-01T00:00:00.000Z",
        "value": -0.14
    },
    {
        "date": "1901-01-01T00:00:00.000Z",
        "value": -0.3
    },
    {
        "date": "1901-02-01T00:00:00.000Z",
        "value": -0.05
    },
    {
        "date": "1901-03-01T00:00:00.000Z",
        "value": 0.05
    },
    {
        "date": "1901-04-01T00:00:00.000Z",
        "value": -0.06
    },
    {
        "date": "1901-05-01T00:00:00.000Z",
        "value": -0.18
    },
    {
        "date": "1901-06-01T00:00:00.000Z",
        "value": -0.1
    },
    {
        "date": "1901-07-01T00:00:00.000Z",
        "value": -0.09
    },
    {
        "date": "1901-08-01T00:00:00.000Z",
        "value": -0.13
    },
    {
        "date": "1901-09-01T00:00:00.000Z",
        "value": -0.17
    },
    {
        "date": "1901-10-01T00:00:00.000Z",
        "value": -0.29
    },
    {
        "date": "1901-11-01T00:00:00.000Z",
        "value": -0.17
    },
    {
        "date": "1901-12-01T00:00:00.000Z",
        "value": -0.3
    },
    {
        "date": "1902-01-01T00:00:00.000Z",
        "value": -0.19
    },
    {
        "date": "1902-02-01T00:00:00.000Z",
        "value": -0.03
    },
    {
        "date": "1902-03-01T00:00:00.000Z",
        "value": -0.29
    },
    {
        "date": "1902-04-01T00:00:00.000Z",
        "value": -0.27
    },
    {
        "date": "1902-05-01T00:00:00.000Z",
        "value": -0.31
    },
    {
        "date": "1902-06-01T00:00:00.000Z",
        "value": -0.34
    },
    {
        "date": "1902-07-01T00:00:00.000Z",
        "value": -0.26
    },
    {
        "date": "1902-08-01T00:00:00.000Z",
        "value": -0.28
    },
    {
        "date": "1902-09-01T00:00:00.000Z",
        "value": -0.2
    },
    {
        "date": "1902-10-01T00:00:00.000Z",
        "value": -0.27
    },
    {
        "date": "1902-11-01T00:00:00.000Z",
        "value": -0.36
    },
    {
        "date": "1902-12-01T00:00:00.000Z",
        "value": -0.46
    },
    {
        "date": "1903-01-01T00:00:00.000Z",
        "value": -0.27
    },
    {
        "date": "1903-02-01T00:00:00.000Z",
        "value": -0.06
    },
    {
        "date": "1903-03-01T00:00:00.000Z",
        "value": -0.23
    },
    {
        "date": "1903-04-01T00:00:00.000Z",
        "value": -0.39
    },
    {
        "date": "1903-05-01T00:00:00.000Z",
        "value": -0.41
    },
    {
        "date": "1903-06-01T00:00:00.000Z",
        "value": -0.44
    },
    {
        "date": "1903-07-01T00:00:00.000Z",
        "value": -0.3
    },
    {
        "date": "1903-08-01T00:00:00.000Z",
        "value": -0.44
    },
    {
        "date": "1903-09-01T00:00:00.000Z",
        "value": -0.43
    },
    {
        "date": "1903-10-01T00:00:00.000Z",
        "value": -0.42
    },
    {
        "date": "1903-11-01T00:00:00.000Z",
        "value": -0.38
    },
    {
        "date": "1903-12-01T00:00:00.000Z",
        "value": -0.47
    },
    {
        "date": "1904-01-01T00:00:00.000Z",
        "value": -0.64
    },
    {
        "date": "1904-02-01T00:00:00.000Z",
        "value": -0.55
    },
    {
        "date": "1904-03-01T00:00:00.000Z",
        "value": -0.46
    },
    {
        "date": "1904-04-01T00:00:00.000Z",
        "value": -0.5
    },
    {
        "date": "1904-05-01T00:00:00.000Z",
        "value": -0.5
    },
    {
        "date": "1904-06-01T00:00:00.000Z",
        "value": -0.49
    },
    {
        "date": "1904-07-01T00:00:00.000Z",
        "value": -0.48
    },
    {
        "date": "1904-08-01T00:00:00.000Z",
        "value": -0.43
    },
    {
        "date": "1904-09-01T00:00:00.000Z",
        "value": -0.47
    },
    {
        "date": "1904-10-01T00:00:00.000Z",
        "value": -0.35
    },
    {
        "date": "1904-11-01T00:00:00.000Z",
        "value": -0.16
    },
    {
        "date": "1904-12-01T00:00:00.000Z",
        "value": -0.29
    },
    {
        "date": "1905-01-01T00:00:00.000Z",
        "value": -0.38
    },
    {
        "date": "1905-02-01T00:00:00.000Z",
        "value": -0.59
    },
    {
        "date": "1905-03-01T00:00:00.000Z",
        "value": -0.25
    },
    {
        "date": "1905-04-01T00:00:00.000Z",
        "value": -0.36
    },
    {
        "date": "1905-05-01T00:00:00.000Z",
        "value": -0.33
    },
    {
        "date": "1905-06-01T00:00:00.000Z",
        "value": -0.31
    },
    {
        "date": "1905-07-01T00:00:00.000Z",
        "value": -0.25
    },
    {
        "date": "1905-08-01T00:00:00.000Z",
        "value": -0.21
    },
    {
        "date": "1905-09-01T00:00:00.000Z",
        "value": -0.15
    },
    {
        "date": "1905-10-01T00:00:00.000Z",
        "value": -0.23
    },
    {
        "date": "1905-11-01T00:00:00.000Z",
        "value": -0.08
    },
    {
        "date": "1905-12-01T00:00:00.000Z",
        "value": -0.21
    },
    {
        "date": "1906-01-01T00:00:00.000Z",
        "value": -0.31
    },
    {
        "date": "1906-02-01T00:00:00.000Z",
        "value": -0.34
    },
    {
        "date": "1906-03-01T00:00:00.000Z",
        "value": -0.15
    },
    {
        "date": "1906-04-01T00:00:00.000Z",
        "value": -0.02
    },
    {
        "date": "1906-05-01T00:00:00.000Z",
        "value": -0.21
    },
    {
        "date": "1906-06-01T00:00:00.000Z",
        "value": -0.22
    },
    {
        "date": "1906-07-01T00:00:00.000Z",
        "value": -0.27
    },
    {
        "date": "1906-08-01T00:00:00.000Z",
        "value": -0.19
    },
    {
        "date": "1906-09-01T00:00:00.000Z",
        "value": -0.25
    },
    {
        "date": "1906-10-01T00:00:00.000Z",
        "value": -0.2
    },
    {
        "date": "1906-11-01T00:00:00.000Z",
        "value": -0.38
    },
    {
        "date": "1906-12-01T00:00:00.000Z",
        "value": -0.18
    },
    {
        "date": "1907-01-01T00:00:00.000Z",
        "value": -0.44
    },
    {
        "date": "1907-02-01T00:00:00.000Z",
        "value": -0.53
    },
    {
        "date": "1907-03-01T00:00:00.000Z",
        "value": -0.25
    },
    {
        "date": "1907-04-01T00:00:00.000Z",
        "value": -0.4
    },
    {
        "date": "1907-05-01T00:00:00.000Z",
        "value": -0.46
    },
    {
        "date": "1907-06-01T00:00:00.000Z",
        "value": -0.43
    },
    {
        "date": "1907-07-01T00:00:00.000Z",
        "value": -0.35
    },
    {
        "date": "1907-08-01T00:00:00.000Z",
        "value": -0.37
    },
    {
        "date": "1907-09-01T00:00:00.000Z",
        "value": -0.32
    },
    {
        "date": "1907-10-01T00:00:00.000Z",
        "value": -0.24
    },
    {
        "date": "1907-11-01T00:00:00.000Z",
        "value": -0.51
    },
    {
        "date": "1907-12-01T00:00:00.000Z",
        "value": -0.5
    },
    {
        "date": "1908-01-01T00:00:00.000Z",
        "value": -0.46
    },
    {
        "date": "1908-02-01T00:00:00.000Z",
        "value": -0.36
    },
    {
        "date": "1908-03-01T00:00:00.000Z",
        "value": -0.58
    },
    {
        "date": "1908-04-01T00:00:00.000Z",
        "value": -0.46
    },
    {
        "date": "1908-05-01T00:00:00.000Z",
        "value": -0.4
    },
    {
        "date": "1908-06-01T00:00:00.000Z",
        "value": -0.39
    },
    {
        "date": "1908-07-01T00:00:00.000Z",
        "value": -0.35
    },
    {
        "date": "1908-08-01T00:00:00.000Z",
        "value": -0.45
    },
    {
        "date": "1908-09-01T00:00:00.000Z",
        "value": -0.33
    },
    {
        "date": "1908-10-01T00:00:00.000Z",
        "value": -0.43
    },
    {
        "date": "1908-11-01T00:00:00.000Z",
        "value": -0.51
    },
    {
        "date": "1908-12-01T00:00:00.000Z",
        "value": -0.5
    },
    {
        "date": "1909-01-01T00:00:00.000Z",
        "value": -0.7
    },
    {
        "date": "1909-02-01T00:00:00.000Z",
        "value": -0.47
    },
    {
        "date": "1909-03-01T00:00:00.000Z",
        "value": -0.52
    },
    {
        "date": "1909-04-01T00:00:00.000Z",
        "value": -0.59
    },
    {
        "date": "1909-05-01T00:00:00.000Z",
        "value": -0.54
    },
    {
        "date": "1909-06-01T00:00:00.000Z",
        "value": -0.52
    },
    {
        "date": "1909-07-01T00:00:00.000Z",
        "value": -0.43
    },
    {
        "date": "1909-08-01T00:00:00.000Z",
        "value": -0.3
    },
    {
        "date": "1909-09-01T00:00:00.000Z",
        "value": -0.37
    },
    {
        "date": "1909-10-01T00:00:00.000Z",
        "value": -0.39
    },
    {
        "date": "1909-11-01T00:00:00.000Z",
        "value": -0.31
    },
    {
        "date": "1909-12-01T00:00:00.000Z",
        "value": -0.55
    },
    {
        "date": "1910-01-01T00:00:00.000Z",
        "value": -0.44
    },
    {
        "date": "1910-02-01T00:00:00.000Z",
        "value": -0.43
    },
    {
        "date": "1910-03-01T00:00:00.000Z",
        "value": -0.47
    },
    {
        "date": "1910-04-01T00:00:00.000Z",
        "value": -0.39
    },
    {
        "date": "1910-05-01T00:00:00.000Z",
        "value": -0.34
    },
    {
        "date": "1910-06-01T00:00:00.000Z",
        "value": -0.36
    },
    {
        "date": "1910-07-01T00:00:00.000Z",
        "value": -0.31
    },
    {
        "date": "1910-08-01T00:00:00.000Z",
        "value": -0.34
    },
    {
        "date": "1910-09-01T00:00:00.000Z",
        "value": -0.37
    },
    {
        "date": "1910-10-01T00:00:00.000Z",
        "value": -0.39
    },
    {
        "date": "1910-11-01T00:00:00.000Z",
        "value": -0.56
    },
    {
        "date": "1910-12-01T00:00:00.000Z",
        "value": -0.69
    },
    {
        "date": "1911-01-01T00:00:00.000Z",
        "value": -0.64
    },
    {
        "date": "1911-02-01T00:00:00.000Z",
        "value": -0.6
    },
    {
        "date": "1911-03-01T00:00:00.000Z",
        "value": -0.62
    },
    {
        "date": "1911-04-01T00:00:00.000Z",
        "value": -0.55
    },
    {
        "date": "1911-05-01T00:00:00.000Z",
        "value": -0.51
    },
    {
        "date": "1911-06-01T00:00:00.000Z",
        "value": -0.47
    },
    {
        "date": "1911-07-01T00:00:00.000Z",
        "value": -0.41
    },
    {
        "date": "1911-08-01T00:00:00.000Z",
        "value": -0.43
    },
    {
        "date": "1911-09-01T00:00:00.000Z",
        "value": -0.38
    },
    {
        "date": "1911-10-01T00:00:00.000Z",
        "value": -0.26
    },
    {
        "date": "1911-11-01T00:00:00.000Z",
        "value": -0.2
    },
    {
        "date": "1911-12-01T00:00:00.000Z",
        "value": -0.25
    },
    {
        "date": "1912-01-01T00:00:00.000Z",
        "value": -0.27
    },
    {
        "date": "1912-02-01T00:00:00.000Z",
        "value": -0.13
    },
    {
        "date": "1912-03-01T00:00:00.000Z",
        "value": -0.37
    },
    {
        "date": "1912-04-01T00:00:00.000Z",
        "value": -0.2
    },
    {
        "date": "1912-05-01T00:00:00.000Z",
        "value": -0.2
    },
    {
        "date": "1912-06-01T00:00:00.000Z",
        "value": -0.26
    },
    {
        "date": "1912-07-01T00:00:00.000Z",
        "value": -0.41
    },
    {
        "date": "1912-08-01T00:00:00.000Z",
        "value": -0.51
    },
    {
        "date": "1912-09-01T00:00:00.000Z",
        "value": -0.47
    },
    {
        "date": "1912-10-01T00:00:00.000Z",
        "value": -0.55
    },
    {
        "date": "1912-11-01T00:00:00.000Z",
        "value": -0.38
    },
    {
        "date": "1912-12-01T00:00:00.000Z",
        "value": -0.42
    },
    {
        "date": "1913-01-01T00:00:00.000Z",
        "value": -0.41
    },
    {
        "date": "1913-02-01T00:00:00.000Z",
        "value": -0.44
    },
    {
        "date": "1913-03-01T00:00:00.000Z",
        "value": -0.44
    },
    {
        "date": "1913-04-01T00:00:00.000Z",
        "value": -0.36
    },
    {
        "date": "1913-05-01T00:00:00.000Z",
        "value": -0.45
    },
    {
        "date": "1913-06-01T00:00:00.000Z",
        "value": -0.46
    },
    {
        "date": "1913-07-01T00:00:00.000Z",
        "value": -0.34
    },
    {
        "date": "1913-08-01T00:00:00.000Z",
        "value": -0.32
    },
    {
        "date": "1913-09-01T00:00:00.000Z",
        "value": -0.32
    },
    {
        "date": "1913-10-01T00:00:00.000Z",
        "value": -0.34
    },
    {
        "date": "1913-11-01T00:00:00.000Z",
        "value": -0.18
    },
    {
        "date": "1913-12-01T00:00:00.000Z",
        "value": -0.04
    },
    {
        "date": "1914-01-01T00:00:00.000Z",
        "value": 0.02
    },
    {
        "date": "1914-02-01T00:00:00.000Z",
        "value": -0.13
    },
    {
        "date": "1914-03-01T00:00:00.000Z",
        "value": -0.23
    },
    {
        "date": "1914-04-01T00:00:00.000Z",
        "value": -0.28
    },
    {
        "date": "1914-05-01T00:00:00.000Z",
        "value": -0.19
    },
    {
        "date": "1914-06-01T00:00:00.000Z",
        "value": -0.22
    },
    {
        "date": "1914-07-01T00:00:00.000Z",
        "value": -0.24
    },
    {
        "date": "1914-08-01T00:00:00.000Z",
        "value": -0.15
    },
    {
        "date": "1914-09-01T00:00:00.000Z",
        "value": -0.13
    },
    {
        "date": "1914-10-01T00:00:00.000Z",
        "value": -0.05
    },
    {
        "date": "1914-11-01T00:00:00.000Z",
        "value": -0.2
    },
    {
        "date": "1914-12-01T00:00:00.000Z",
        "value": -0.1
    },
    {
        "date": "1915-01-01T00:00:00.000Z",
        "value": -0.2
    },
    {
        "date": "1915-02-01T00:00:00.000Z",
        "value": -0.01
    },
    {
        "date": "1915-03-01T00:00:00.000Z",
        "value": -0.08
    },
    {
        "date": "1915-04-01T00:00:00.000Z",
        "value": 0.07
    },
    {
        "date": "1915-05-01T00:00:00.000Z",
        "value": -0.01
    },
    {
        "date": "1915-06-01T00:00:00.000Z",
        "value": -0.16
    },
    {
        "date": "1915-07-01T00:00:00.000Z",
        "value": -0.03
    },
    {
        "date": "1915-08-01T00:00:00.000Z",
        "value": -0.15
    },
    {
        "date": "1915-09-01T00:00:00.000Z",
        "value": -0.12
    },
    {
        "date": "1915-10-01T00:00:00.000Z",
        "value": -0.22
    },
    {
        "date": "1915-11-01T00:00:00.000Z",
        "value": -0.12
    },
    {
        "date": "1915-12-01T00:00:00.000Z",
        "value": -0.25
    },
    {
        "date": "1916-01-01T00:00:00.000Z",
        "value": -0.2
    },
    {
        "date": "1916-02-01T00:00:00.000Z",
        "value": -0.23
    },
    {
        "date": "1916-03-01T00:00:00.000Z",
        "value": -0.31
    },
    {
        "date": "1916-04-01T00:00:00.000Z",
        "value": -0.25
    },
    {
        "date": "1916-05-01T00:00:00.000Z",
        "value": -0.27
    },
    {
        "date": "1916-06-01T00:00:00.000Z",
        "value": -0.44
    },
    {
        "date": "1916-07-01T00:00:00.000Z",
        "value": -0.34
    },
    {
        "date": "1916-08-01T00:00:00.000Z",
        "value": -0.27
    },
    {
        "date": "1916-09-01T00:00:00.000Z",
        "value": -0.29
    },
    {
        "date": "1916-10-01T00:00:00.000Z",
        "value": -0.28
    },
    {
        "date": "1916-11-01T00:00:00.000Z",
        "value": -0.42
    },
    {
        "date": "1916-12-01T00:00:00.000Z",
        "value": -0.78
    },
    {
        "date": "1917-01-01T00:00:00.000Z",
        "value": -0.46
    },
    {
        "date": "1917-02-01T00:00:00.000Z",
        "value": -0.53
    },
    {
        "date": "1917-03-01T00:00:00.000Z",
        "value": -0.47
    },
    {
        "date": "1917-04-01T00:00:00.000Z",
        "value": -0.38
    },
    {
        "date": "1917-05-01T00:00:00.000Z",
        "value": -0.48
    },
    {
        "date": "1917-06-01T00:00:00.000Z",
        "value": -0.4
    },
    {
        "date": "1917-07-01T00:00:00.000Z",
        "value": -0.23
    },
    {
        "date": "1917-08-01T00:00:00.000Z",
        "value": -0.26
    },
    {
        "date": "1917-09-01T00:00:00.000Z",
        "value": -0.18
    },
    {
        "date": "1917-10-01T00:00:00.000Z",
        "value": -0.35
    },
    {
        "date": "1917-11-01T00:00:00.000Z",
        "value": -0.29
    },
    {
        "date": "1917-12-01T00:00:00.000Z",
        "value": -0.71
    },
    {
        "date": "1918-01-01T00:00:00.000Z",
        "value": -0.44
    },
    {
        "date": "1918-02-01T00:00:00.000Z",
        "value": -0.33
    },
    {
        "date": "1918-03-01T00:00:00.000Z",
        "value": -0.21
    },
    {
        "date": "1918-04-01T00:00:00.000Z",
        "value": -0.4
    },
    {
        "date": "1918-05-01T00:00:00.000Z",
        "value": -0.37
    },
    {
        "date": "1918-06-01T00:00:00.000Z",
        "value": -0.28
    },
    {
        "date": "1918-07-01T00:00:00.000Z",
        "value": -0.22
    },
    {
        "date": "1918-08-01T00:00:00.000Z",
        "value": -0.26
    },
    {
        "date": "1918-09-01T00:00:00.000Z",
        "value": -0.14
    },
    {
        "date": "1918-10-01T00:00:00.000Z",
        "value": -0.03
    },
    {
        "date": "1918-11-01T00:00:00.000Z",
        "value": -0.16
    },
    {
        "date": "1918-12-01T00:00:00.000Z",
        "value": -0.3
    },
    {
        "date": "1919-01-01T00:00:00.000Z",
        "value": -0.21
    },
    {
        "date": "1919-02-01T00:00:00.000Z",
        "value": -0.19
    },
    {
        "date": "1919-03-01T00:00:00.000Z",
        "value": -0.25
    },
    {
        "date": "1919-04-01T00:00:00.000Z",
        "value": -0.17
    },
    {
        "date": "1919-05-01T00:00:00.000Z",
        "value": -0.2
    },
    {
        "date": "1919-06-01T00:00:00.000Z",
        "value": -0.28
    },
    {
        "date": "1919-07-01T00:00:00.000Z",
        "value": -0.21
    },
    {
        "date": "1919-08-01T00:00:00.000Z",
        "value": -0.19
    },
    {
        "date": "1919-09-01T00:00:00.000Z",
        "value": -0.17
    },
    {
        "date": "1919-10-01T00:00:00.000Z",
        "value": -0.16
    },
    {
        "date": "1919-11-01T00:00:00.000Z",
        "value": -0.29
    },
    {
        "date": "1919-12-01T00:00:00.000Z",
        "value": -0.35
    },
    {
        "date": "1920-01-01T00:00:00.000Z",
        "value": -0.15
    },
    {
        "date": "1920-02-01T00:00:00.000Z",
        "value": -0.22
    },
    {
        "date": "1920-03-01T00:00:00.000Z",
        "value": -0.08
    },
    {
        "date": "1920-04-01T00:00:00.000Z",
        "value": -0.26
    },
    {
        "date": "1920-05-01T00:00:00.000Z",
        "value": -0.26
    },
    {
        "date": "1920-06-01T00:00:00.000Z",
        "value": -0.33
    },
    {
        "date": "1920-07-01T00:00:00.000Z",
        "value": -0.32
    },
    {
        "date": "1920-08-01T00:00:00.000Z",
        "value": -0.29
    },
    {
        "date": "1920-09-01T00:00:00.000Z",
        "value": -0.2
    },
    {
        "date": "1920-10-01T00:00:00.000Z",
        "value": -0.29
    },
    {
        "date": "1920-11-01T00:00:00.000Z",
        "value": -0.33
    },
    {
        "date": "1920-12-01T00:00:00.000Z",
        "value": -0.47
    },
    {
        "date": "1921-01-01T00:00:00.000Z",
        "value": -0.04
    },
    {
        "date": "1921-02-01T00:00:00.000Z",
        "value": -0.21
    },
    {
        "date": "1921-03-01T00:00:00.000Z",
        "value": -0.28
    },
    {
        "date": "1921-04-01T00:00:00.000Z",
        "value": -0.36
    },
    {
        "date": "1921-05-01T00:00:00.000Z",
        "value": -0.36
    },
    {
        "date": "1921-06-01T00:00:00.000Z",
        "value": -0.31
    },
    {
        "date": "1921-07-01T00:00:00.000Z",
        "value": -0.16
    },
    {
        "date": "1921-08-01T00:00:00.000Z",
        "value": -0.24
    },
    {
        "date": "1921-09-01T00:00:00.000Z",
        "value": -0.16
    },
    {
        "date": "1921-10-01T00:00:00.000Z",
        "value": -0.06
    },
    {
        "date": "1921-11-01T00:00:00.000Z",
        "value": -0.16
    },
    {
        "date": "1921-12-01T00:00:00.000Z",
        "value": -0.18
    },
    {
        "date": "1922-01-01T00:00:00.000Z",
        "value": -0.34
    },
    {
        "date": "1922-02-01T00:00:00.000Z",
        "value": -0.44
    },
    {
        "date": "1922-03-01T00:00:00.000Z",
        "value": -0.13
    },
    {
        "date": "1922-04-01T00:00:00.000Z",
        "value": -0.22
    },
    {
        "date": "1922-05-01T00:00:00.000Z",
        "value": -0.34
    },
    {
        "date": "1922-06-01T00:00:00.000Z",
        "value": -0.32
    },
    {
        "date": "1922-07-01T00:00:00.000Z",
        "value": -0.27
    },
    {
        "date": "1922-08-01T00:00:00.000Z",
        "value": -0.31
    },
    {
        "date": "1922-09-01T00:00:00.000Z",
        "value": -0.29
    },
    {
        "date": "1922-10-01T00:00:00.000Z",
        "value": -0.33
    },
    {
        "date": "1922-11-01T00:00:00.000Z",
        "value": -0.17
    },
    {
        "date": "1922-12-01T00:00:00.000Z",
        "value": -0.17
    },
    {
        "date": "1923-01-01T00:00:00.000Z",
        "value": -0.27
    },
    {
        "date": "1923-02-01T00:00:00.000Z",
        "value": -0.37
    },
    {
        "date": "1923-03-01T00:00:00.000Z",
        "value": -0.32
    },
    {
        "date": "1923-04-01T00:00:00.000Z",
        "value": -0.38
    },
    {
        "date": "1923-05-01T00:00:00.000Z",
        "value": -0.33
    },
    {
        "date": "1923-06-01T00:00:00.000Z",
        "value": -0.24
    },
    {
        "date": "1923-07-01T00:00:00.000Z",
        "value": -0.29
    },
    {
        "date": "1923-08-01T00:00:00.000Z",
        "value": -0.3
    },
    {
        "date": "1923-09-01T00:00:00.000Z",
        "value": -0.28
    },
    {
        "date": "1923-10-01T00:00:00.000Z",
        "value": -0.13
    },
    {
        "date": "1923-11-01T00:00:00.000Z",
        "value": 0.03
    },
    {
        "date": "1923-12-01T00:00:00.000Z",
        "value": -0.06
    },
    {
        "date": "1924-01-01T00:00:00.000Z",
        "value": -0.24
    },
    {
        "date": "1924-02-01T00:00:00.000Z",
        "value": -0.27
    },
    {
        "date": "1924-03-01T00:00:00.000Z",
        "value": -0.12
    },
    {
        "date": "1924-04-01T00:00:00.000Z",
        "value": -0.35
    },
    {
        "date": "1924-05-01T00:00:00.000Z",
        "value": -0.19
    },
    {
        "date": "1924-06-01T00:00:00.000Z",
        "value": -0.28
    },
    {
        "date": "1924-07-01T00:00:00.000Z",
        "value": -0.27
    },
    {
        "date": "1924-08-01T00:00:00.000Z",
        "value": -0.35
    },
    {
        "date": "1924-09-01T00:00:00.000Z",
        "value": -0.3
    },
    {
        "date": "1924-10-01T00:00:00.000Z",
        "value": -0.36
    },
    {
        "date": "1924-11-01T00:00:00.000Z",
        "value": -0.23
    },
    {
        "date": "1924-12-01T00:00:00.000Z",
        "value": -0.43
    },
    {
        "date": "1925-01-01T00:00:00.000Z",
        "value": -0.34
    },
    {
        "date": "1925-02-01T00:00:00.000Z",
        "value": -0.35
    },
    {
        "date": "1925-03-01T00:00:00.000Z",
        "value": -0.24
    },
    {
        "date": "1925-04-01T00:00:00.000Z",
        "value": -0.25
    },
    {
        "date": "1925-05-01T00:00:00.000Z",
        "value": -0.3
    },
    {
        "date": "1925-06-01T00:00:00.000Z",
        "value": -0.34
    },
    {
        "date": "1925-07-01T00:00:00.000Z",
        "value": -0.3
    },
    {
        "date": "1925-08-01T00:00:00.000Z",
        "value": -0.19
    },
    {
        "date": "1925-09-01T00:00:00.000Z",
        "value": -0.13
    },
    {
        "date": "1925-10-01T00:00:00.000Z",
        "value": -0.17
    },
    {
        "date": "1925-11-01T00:00:00.000Z",
        "value": 0.03
    },
    {
        "date": "1925-12-01T00:00:00.000Z",
        "value": 0.11
    },
    {
        "date": "1926-01-01T00:00:00.000Z",
        "value": 0.2
    },
    {
        "date": "1926-02-01T00:00:00.000Z",
        "value": 0.07
    },
    {
        "date": "1926-03-01T00:00:00.000Z",
        "value": 0.12
    },
    {
        "date": "1926-04-01T00:00:00.000Z",
        "value": -0.15
    },
    {
        "date": "1926-05-01T00:00:00.000Z",
        "value": -0.25
    },
    {
        "date": "1926-06-01T00:00:00.000Z",
        "value": -0.25
    },
    {
        "date": "1926-07-01T00:00:00.000Z",
        "value": -0.21
    },
    {
        "date": "1926-08-01T00:00:00.000Z",
        "value": -0.11
    },
    {
        "date": "1926-09-01T00:00:00.000Z",
        "value": -0.11
    },
    {
        "date": "1926-10-01T00:00:00.000Z",
        "value": -0.11
    },
    {
        "date": "1926-11-01T00:00:00.000Z",
        "value": -0.06
    },
    {
        "date": "1926-12-01T00:00:00.000Z",
        "value": -0.3
    },
    {
        "date": "1927-01-01T00:00:00.000Z",
        "value": -0.28
    },
    {
        "date": "1927-02-01T00:00:00.000Z",
        "value": -0.21
    },
    {
        "date": "1927-03-01T00:00:00.000Z",
        "value": -0.39
    },
    {
        "date": "1927-04-01T00:00:00.000Z",
        "value": -0.31
    },
    {
        "date": "1927-05-01T00:00:00.000Z",
        "value": -0.25
    },
    {
        "date": "1927-06-01T00:00:00.000Z",
        "value": -0.27
    },
    {
        "date": "1927-07-01T00:00:00.000Z",
        "value": -0.15
    },
    {
        "date": "1927-08-01T00:00:00.000Z",
        "value": -0.19
    },
    {
        "date": "1927-09-01T00:00:00.000Z",
        "value": -0.06
    },
    {
        "date": "1927-10-01T00:00:00.000Z",
        "value": -0.01
    },
    {
        "date": "1927-11-01T00:00:00.000Z",
        "value": -0.04
    },
    {
        "date": "1927-12-01T00:00:00.000Z",
        "value": -0.36
    },
    {
        "date": "1928-01-01T00:00:00.000Z",
        "value": -0.04
    },
    {
        "date": "1928-02-01T00:00:00.000Z",
        "value": -0.12
    },
    {
        "date": "1928-03-01T00:00:00.000Z",
        "value": -0.28
    },
    {
        "date": "1928-04-01T00:00:00.000Z",
        "value": -0.29
    },
    {
        "date": "1928-05-01T00:00:00.000Z",
        "value": -0.3
    },
    {
        "date": "1928-06-01T00:00:00.000Z",
        "value": -0.41
    },
    {
        "date": "1928-07-01T00:00:00.000Z",
        "value": -0.21
    },
    {
        "date": "1928-08-01T00:00:00.000Z",
        "value": -0.25
    },
    {
        "date": "1928-09-01T00:00:00.000Z",
        "value": -0.2
    },
    {
        "date": "1928-10-01T00:00:00.000Z",
        "value": -0.19
    },
    {
        "date": "1928-11-01T00:00:00.000Z",
        "value": -0.09
    },
    {
        "date": "1928-12-01T00:00:00.000Z",
        "value": -0.2
    },
    {
        "date": "1929-01-01T00:00:00.000Z",
        "value": -0.47
    },
    {
        "date": "1929-02-01T00:00:00.000Z",
        "value": -0.61
    },
    {
        "date": "1929-03-01T00:00:00.000Z",
        "value": -0.34
    },
    {
        "date": "1929-04-01T00:00:00.000Z",
        "value": -0.4
    },
    {
        "date": "1929-05-01T00:00:00.000Z",
        "value": -0.39
    },
    {
        "date": "1929-06-01T00:00:00.000Z",
        "value": -0.43
    },
    {
        "date": "1929-07-01T00:00:00.000Z",
        "value": -0.33
    },
    {
        "date": "1929-08-01T00:00:00.000Z",
        "value": -0.29
    },
    {
        "date": "1929-09-01T00:00:00.000Z",
        "value": -0.23
    },
    {
        "date": "1929-10-01T00:00:00.000Z",
        "value": -0.15
    },
    {
        "date": "1929-11-01T00:00:00.000Z",
        "value": -0.14
    },
    {
        "date": "1929-12-01T00:00:00.000Z",
        "value": -0.55
    },
    {
        "date": "1930-01-01T00:00:00.000Z",
        "value": -0.29
    },
    {
        "date": "1930-02-01T00:00:00.000Z",
        "value": -0.24
    },
    {
        "date": "1930-03-01T00:00:00.000Z",
        "value": -0.08
    },
    {
        "date": "1930-04-01T00:00:00.000Z",
        "value": -0.26
    },
    {
        "date": "1930-05-01T00:00:00.000Z",
        "value": -0.25
    },
    {
        "date": "1930-06-01T00:00:00.000Z",
        "value": -0.19
    },
    {
        "date": "1930-07-01T00:00:00.000Z",
        "value": -0.17
    },
    {
        "date": "1930-08-01T00:00:00.000Z",
        "value": -0.11
    },
    {
        "date": "1930-09-01T00:00:00.000Z",
        "value": -0.11
    },
    {
        "date": "1930-10-01T00:00:00.000Z",
        "value": -0.08
    },
    {
        "date": "1930-11-01T00:00:00.000Z",
        "value": 0.14
    },
    {
        "date": "1930-12-01T00:00:00.000Z",
        "value": -0.09
    },
    {
        "date": "1931-01-01T00:00:00.000Z",
        "value": -0.1
    },
    {
        "date": "1931-02-01T00:00:00.000Z",
        "value": -0.22
    },
    {
        "date": "1931-03-01T00:00:00.000Z",
        "value": -0.06
    },
    {
        "date": "1931-04-01T00:00:00.000Z",
        "value": -0.21
    },
    {
        "date": "1931-05-01T00:00:00.000Z",
        "value": -0.22
    },
    {
        "date": "1931-06-01T00:00:00.000Z",
        "value": -0.06
    },
    {
        "date": "1931-07-01T00:00:00.000Z",
        "value": 0.01
    },
    {
        "date": "1931-08-01T00:00:00.000Z",
        "value": 0
    },
    {
        "date": "1931-09-01T00:00:00.000Z",
        "value": -0.06
    },
    {
        "date": "1931-10-01T00:00:00.000Z",
        "value": 0
    },
    {
        "date": "1931-11-01T00:00:00.000Z",
        "value": -0.12
    },
    {
        "date": "1931-12-01T00:00:00.000Z",
        "value": -0.1
    },
    {
        "date": "1932-01-01T00:00:00.000Z",
        "value": 0.13
    },
    {
        "date": "1932-02-01T00:00:00.000Z",
        "value": -0.18
    },
    {
        "date": "1932-03-01T00:00:00.000Z",
        "value": -0.2
    },
    {
        "date": "1932-04-01T00:00:00.000Z",
        "value": -0.07
    },
    {
        "date": "1932-05-01T00:00:00.000Z",
        "value": -0.22
    },
    {
        "date": "1932-06-01T00:00:00.000Z",
        "value": -0.3
    },
    {
        "date": "1932-07-01T00:00:00.000Z",
        "value": -0.24
    },
    {
        "date": "1932-08-01T00:00:00.000Z",
        "value": -0.24
    },
    {
        "date": "1932-09-01T00:00:00.000Z",
        "value": -0.11
    },
    {
        "date": "1932-10-01T00:00:00.000Z",
        "value": -0.1
    },
    {
        "date": "1932-11-01T00:00:00.000Z",
        "value": -0.26
    },
    {
        "date": "1932-12-01T00:00:00.000Z",
        "value": -0.22
    },
    {
        "date": "1933-01-01T00:00:00.000Z",
        "value": -0.34
    },
    {
        "date": "1933-02-01T00:00:00.000Z",
        "value": -0.32
    },
    {
        "date": "1933-03-01T00:00:00.000Z",
        "value": -0.29
    },
    {
        "date": "1933-04-01T00:00:00.000Z",
        "value": -0.23
    },
    {
        "date": "1933-05-01T00:00:00.000Z",
        "value": -0.25
    },
    {
        "date": "1933-06-01T00:00:00.000Z",
        "value": -0.32
    },
    {
        "date": "1933-07-01T00:00:00.000Z",
        "value": -0.2
    },
    {
        "date": "1933-08-01T00:00:00.000Z",
        "value": -0.23
    },
    {
        "date": "1933-09-01T00:00:00.000Z",
        "value": -0.26
    },
    {
        "date": "1933-10-01T00:00:00.000Z",
        "value": -0.24
    },
    {
        "date": "1933-11-01T00:00:00.000Z",
        "value": -0.31
    },
    {
        "date": "1933-12-01T00:00:00.000Z",
        "value": -0.47
    },
    {
        "date": "1934-01-01T00:00:00.000Z",
        "value": -0.27
    },
    {
        "date": "1934-02-01T00:00:00.000Z",
        "value": -0.04
    },
    {
        "date": "1934-03-01T00:00:00.000Z",
        "value": -0.31
    },
    {
        "date": "1934-04-01T00:00:00.000Z",
        "value": -0.27
    },
    {
        "date": "1934-05-01T00:00:00.000Z",
        "value": -0.11
    },
    {
        "date": "1934-06-01T00:00:00.000Z",
        "value": -0.14
    },
    {
        "date": "1934-07-01T00:00:00.000Z",
        "value": -0.11
    },
    {
        "date": "1934-08-01T00:00:00.000Z",
        "value": -0.1
    },
    {
        "date": "1934-09-01T00:00:00.000Z",
        "value": -0.16
    },
    {
        "date": "1934-10-01T00:00:00.000Z",
        "value": -0.11
    },
    {
        "date": "1934-11-01T00:00:00.000Z",
        "value": -0.01
    },
    {
        "date": "1934-12-01T00:00:00.000Z",
        "value": -0.09
    },
    {
        "date": "1935-01-01T00:00:00.000Z",
        "value": -0.37
    },
    {
        "date": "1935-02-01T00:00:00.000Z",
        "value": 0.11
    },
    {
        "date": "1935-03-01T00:00:00.000Z",
        "value": -0.13
    },
    {
        "date": "1935-04-01T00:00:00.000Z",
        "value": -0.35
    },
    {
        "date": "1935-05-01T00:00:00.000Z",
        "value": -0.26
    },
    {
        "date": "1935-06-01T00:00:00.000Z",
        "value": -0.23
    },
    {
        "date": "1935-07-01T00:00:00.000Z",
        "value": -0.19
    },
    {
        "date": "1935-08-01T00:00:00.000Z",
        "value": -0.17
    },
    {
        "date": "1935-09-01T00:00:00.000Z",
        "value": -0.17
    },
    {
        "date": "1935-10-01T00:00:00.000Z",
        "value": -0.08
    },
    {
        "date": "1935-11-01T00:00:00.000Z",
        "value": -0.29
    },
    {
        "date": "1935-12-01T00:00:00.000Z",
        "value": -0.22
    },
    {
        "date": "1936-01-01T00:00:00.000Z",
        "value": -0.29
    },
    {
        "date": "1936-02-01T00:00:00.000Z",
        "value": -0.39
    },
    {
        "date": "1936-03-01T00:00:00.000Z",
        "value": -0.23
    },
    {
        "date": "1936-04-01T00:00:00.000Z",
        "value": -0.2
    },
    {
        "date": "1936-05-01T00:00:00.000Z",
        "value": -0.17
    },
    {
        "date": "1936-06-01T00:00:00.000Z",
        "value": -0.19
    },
    {
        "date": "1936-07-01T00:00:00.000Z",
        "value": -0.06
    },
    {
        "date": "1936-08-01T00:00:00.000Z",
        "value": -0.12
    },
    {
        "date": "1936-09-01T00:00:00.000Z",
        "value": -0.06
    },
    {
        "date": "1936-10-01T00:00:00.000Z",
        "value": -0.04
    },
    {
        "date": "1936-11-01T00:00:00.000Z",
        "value": -0.05
    },
    {
        "date": "1936-12-01T00:00:00.000Z",
        "value": -0.04
    },
    {
        "date": "1937-01-01T00:00:00.000Z",
        "value": -0.11
    },
    {
        "date": "1937-02-01T00:00:00.000Z",
        "value": 0.05
    },
    {
        "date": "1937-03-01T00:00:00.000Z",
        "value": -0.17
    },
    {
        "date": "1937-04-01T00:00:00.000Z",
        "value": -0.17
    },
    {
        "date": "1937-05-01T00:00:00.000Z",
        "value": -0.07
    },
    {
        "date": "1937-06-01T00:00:00.000Z",
        "value": -0.08
    },
    {
        "date": "1937-07-01T00:00:00.000Z",
        "value": -0.05
    },
    {
        "date": "1937-08-01T00:00:00.000Z",
        "value": 0.03
    },
    {
        "date": "1937-09-01T00:00:00.000Z",
        "value": 0.14
    },
    {
        "date": "1937-10-01T00:00:00.000Z",
        "value": 0.1
    },
    {
        "date": "1937-11-01T00:00:00.000Z",
        "value": 0.09
    },
    {
        "date": "1937-12-01T00:00:00.000Z",
        "value": -0.12
    },
    {
        "date": "1938-01-01T00:00:00.000Z",
        "value": 0
    },
    {
        "date": "1938-02-01T00:00:00.000Z",
        "value": -0.04
    },
    {
        "date": "1938-03-01T00:00:00.000Z",
        "value": 0.05
    },
    {
        "date": "1938-04-01T00:00:00.000Z",
        "value": 0.05
    },
    {
        "date": "1938-05-01T00:00:00.000Z",
        "value": -0.07
    },
    {
        "date": "1938-06-01T00:00:00.000Z",
        "value": -0.17
    },
    {
        "date": "1938-07-01T00:00:00.000Z",
        "value": -0.09
    },
    {
        "date": "1938-08-01T00:00:00.000Z",
        "value": -0.04
    },
    {
        "date": "1938-09-01T00:00:00.000Z",
        "value": 0.03
    },
    {
        "date": "1938-10-01T00:00:00.000Z",
        "value": 0.11
    },
    {
        "date": "1938-11-01T00:00:00.000Z",
        "value": 0.01
    },
    {
        "date": "1938-12-01T00:00:00.000Z",
        "value": -0.26
    },
    {
        "date": "1939-01-01T00:00:00.000Z",
        "value": -0.13
    },
    {
        "date": "1939-02-01T00:00:00.000Z",
        "value": -0.12
    },
    {
        "date": "1939-03-01T00:00:00.000Z",
        "value": -0.2
    },
    {
        "date": "1939-04-01T00:00:00.000Z",
        "value": -0.12
    },
    {
        "date": "1939-05-01T00:00:00.000Z",
        "value": -0.07
    },
    {
        "date": "1939-06-01T00:00:00.000Z",
        "value": -0.08
    },
    {
        "date": "1939-07-01T00:00:00.000Z",
        "value": -0.06
    },
    {
        "date": "1939-08-01T00:00:00.000Z",
        "value": -0.05
    },
    {
        "date": "1939-09-01T00:00:00.000Z",
        "value": 0
    },
    {
        "date": "1939-10-01T00:00:00.000Z",
        "value": -0.03
    },
    {
        "date": "1939-11-01T00:00:00.000Z",
        "value": 0.06
    },
    {
        "date": "1939-12-01T00:00:00.000Z",
        "value": 0.4
    },
    {
        "date": "1940-01-01T00:00:00.000Z",
        "value": -0.15
    },
    {
        "date": "1940-02-01T00:00:00.000Z",
        "value": 0.06
    },
    {
        "date": "1940-03-01T00:00:00.000Z",
        "value": 0.12
    },
    {
        "date": "1940-04-01T00:00:00.000Z",
        "value": 0.16
    },
    {
        "date": "1940-05-01T00:00:00.000Z",
        "value": 0.05
    },
    {
        "date": "1940-06-01T00:00:00.000Z",
        "value": 0.05
    },
    {
        "date": "1940-07-01T00:00:00.000Z",
        "value": 0.1
    },
    {
        "date": "1940-08-01T00:00:00.000Z",
        "value": 0.01
    },
    {
        "date": "1940-09-01T00:00:00.000Z",
        "value": 0.12
    },
    {
        "date": "1940-10-01T00:00:00.000Z",
        "value": 0.07
    },
    {
        "date": "1940-11-01T00:00:00.000Z",
        "value": 0.13
    },
    {
        "date": "1940-12-01T00:00:00.000Z",
        "value": 0.19
    },
    {
        "date": "1941-01-01T00:00:00.000Z",
        "value": 0.13
    },
    {
        "date": "1941-02-01T00:00:00.000Z",
        "value": 0.23
    },
    {
        "date": "1941-03-01T00:00:00.000Z",
        "value": 0.06
    },
    {
        "date": "1941-04-01T00:00:00.000Z",
        "value": 0.11
    },
    {
        "date": "1941-05-01T00:00:00.000Z",
        "value": 0.1
    },
    {
        "date": "1941-06-01T00:00:00.000Z",
        "value": 0.04
    },
    {
        "date": "1941-07-01T00:00:00.000Z",
        "value": 0.15
    },
    {
        "date": "1941-08-01T00:00:00.000Z",
        "value": 0.14
    },
    {
        "date": "1941-09-01T00:00:00.000Z",
        "value": 0.02
    },
    {
        "date": "1941-10-01T00:00:00.000Z",
        "value": 0.24
    },
    {
        "date": "1941-11-01T00:00:00.000Z",
        "value": 0.12
    },
    {
        "date": "1941-12-01T00:00:00.000Z",
        "value": 0.14
    },
    {
        "date": "1942-01-01T00:00:00.000Z",
        "value": 0.26
    },
    {
        "date": "1942-02-01T00:00:00.000Z",
        "value": 0.05
    },
    {
        "date": "1942-03-01T00:00:00.000Z",
        "value": 0.13
    },
    {
        "date": "1942-04-01T00:00:00.000Z",
        "value": 0.14
    },
    {
        "date": "1942-05-01T00:00:00.000Z",
        "value": 0.14
    },
    {
        "date": "1942-06-01T00:00:00.000Z",
        "value": 0.11
    },
    {
        "date": "1942-07-01T00:00:00.000Z",
        "value": 0.02
    },
    {
        "date": "1942-08-01T00:00:00.000Z",
        "value": -0.03
    },
    {
        "date": "1942-09-01T00:00:00.000Z",
        "value": 0
    },
    {
        "date": "1942-10-01T00:00:00.000Z",
        "value": 0.06
    },
    {
        "date": "1942-11-01T00:00:00.000Z",
        "value": 0.13
    },
    {
        "date": "1942-12-01T00:00:00.000Z",
        "value": 0.12
    },
    {
        "date": "1943-01-01T00:00:00.000Z",
        "value": -0.01
    },
    {
        "date": "1943-02-01T00:00:00.000Z",
        "value": 0.22
    },
    {
        "date": "1943-03-01T00:00:00.000Z",
        "value": 0.01
    },
    {
        "date": "1943-04-01T00:00:00.000Z",
        "value": 0.13
    },
    {
        "date": "1943-05-01T00:00:00.000Z",
        "value": 0.1
    },
    {
        "date": "1943-06-01T00:00:00.000Z",
        "value": -0.01
    },
    {
        "date": "1943-07-01T00:00:00.000Z",
        "value": 0.14
    },
    {
        "date": "1943-08-01T00:00:00.000Z",
        "value": 0.03
    },
    {
        "date": "1943-09-01T00:00:00.000Z",
        "value": 0.11
    },
    {
        "date": "1943-10-01T00:00:00.000Z",
        "value": 0.3
    },
    {
        "date": "1943-11-01T00:00:00.000Z",
        "value": 0.25
    },
    {
        "date": "1943-12-01T00:00:00.000Z",
        "value": 0.28
    },
    {
        "date": "1944-01-01T00:00:00.000Z",
        "value": 0.41
    },
    {
        "date": "1944-02-01T00:00:00.000Z",
        "value": 0.31
    },
    {
        "date": "1944-03-01T00:00:00.000Z",
        "value": 0.34
    },
    {
        "date": "1944-04-01T00:00:00.000Z",
        "value": 0.27
    },
    {
        "date": "1944-05-01T00:00:00.000Z",
        "value": 0.26
    },
    {
        "date": "1944-06-01T00:00:00.000Z",
        "value": 0.22
    },
    {
        "date": "1944-07-01T00:00:00.000Z",
        "value": 0.23
    },
    {
        "date": "1944-08-01T00:00:00.000Z",
        "value": 0.23
    },
    {
        "date": "1944-09-01T00:00:00.000Z",
        "value": 0.31
    },
    {
        "date": "1944-10-01T00:00:00.000Z",
        "value": 0.27
    },
    {
        "date": "1944-11-01T00:00:00.000Z",
        "value": 0.12
    },
    {
        "date": "1944-12-01T00:00:00.000Z",
        "value": 0.05
    },
    {
        "date": "1945-01-01T00:00:00.000Z",
        "value": 0.13
    },
    {
        "date": "1945-02-01T00:00:00.000Z",
        "value": 0.02
    },
    {
        "date": "1945-03-01T00:00:00.000Z",
        "value": 0.11
    },
    {
        "date": "1945-04-01T00:00:00.000Z",
        "value": 0.24
    },
    {
        "date": "1945-05-01T00:00:00.000Z",
        "value": 0.1
    },
    {
        "date": "1945-06-01T00:00:00.000Z",
        "value": 0.02
    },
    {
        "date": "1945-07-01T00:00:00.000Z",
        "value": 0.07
    },
    {
        "date": "1945-08-01T00:00:00.000Z",
        "value": 0.25
    },
    {
        "date": "1945-09-01T00:00:00.000Z",
        "value": 0.22
    },
    {
        "date": "1945-10-01T00:00:00.000Z",
        "value": 0.22
    },
    {
        "date": "1945-11-01T00:00:00.000Z",
        "value": 0.1
    },
    {
        "date": "1945-12-01T00:00:00.000Z",
        "value": -0.1
    },
    {
        "date": "1946-01-01T00:00:00.000Z",
        "value": 0.15
    },
    {
        "date": "1946-02-01T00:00:00.000Z",
        "value": 0.06
    },
    {
        "date": "1946-03-01T00:00:00.000Z",
        "value": 0
    },
    {
        "date": "1946-04-01T00:00:00.000Z",
        "value": 0.11
    },
    {
        "date": "1946-05-01T00:00:00.000Z",
        "value": -0.04
    },
    {
        "date": "1946-06-01T00:00:00.000Z",
        "value": -0.17
    },
    {
        "date": "1946-07-01T00:00:00.000Z",
        "value": -0.09
    },
    {
        "date": "1946-08-01T00:00:00.000Z",
        "value": -0.08
    },
    {
        "date": "1946-09-01T00:00:00.000Z",
        "value": -0.02
    },
    {
        "date": "1946-10-01T00:00:00.000Z",
        "value": -0.06
    },
    {
        "date": "1946-11-01T00:00:00.000Z",
        "value": -0.02
    },
    {
        "date": "1946-12-01T00:00:00.000Z",
        "value": -0.29
    },
    {
        "date": "1947-01-01T00:00:00.000Z",
        "value": -0.13
    },
    {
        "date": "1947-02-01T00:00:00.000Z",
        "value": -0.08
    },
    {
        "date": "1947-03-01T00:00:00.000Z",
        "value": 0.05
    },
    {
        "date": "1947-04-01T00:00:00.000Z",
        "value": 0.04
    },
    {
        "date": "1947-05-01T00:00:00.000Z",
        "value": -0.06
    },
    {
        "date": "1947-06-01T00:00:00.000Z",
        "value": 0
    },
    {
        "date": "1947-07-01T00:00:00.000Z",
        "value": -0.06
    },
    {
        "date": "1947-08-01T00:00:00.000Z",
        "value": -0.08
    },
    {
        "date": "1947-09-01T00:00:00.000Z",
        "value": -0.14
    },
    {
        "date": "1947-10-01T00:00:00.000Z",
        "value": 0.06
    },
    {
        "date": "1947-11-01T00:00:00.000Z",
        "value": -0.01
    },
    {
        "date": "1947-12-01T00:00:00.000Z",
        "value": -0.18
    },
    {
        "date": "1948-01-01T00:00:00.000Z",
        "value": 0.05
    },
    {
        "date": "1948-02-01T00:00:00.000Z",
        "value": -0.13
    },
    {
        "date": "1948-03-01T00:00:00.000Z",
        "value": -0.23
    },
    {
        "date": "1948-04-01T00:00:00.000Z",
        "value": -0.09
    },
    {
        "date": "1948-05-01T00:00:00.000Z",
        "value": 0.08
    },
    {
        "date": "1948-06-01T00:00:00.000Z",
        "value": -0.05
    },
    {
        "date": "1948-07-01T00:00:00.000Z",
        "value": -0.13
    },
    {
        "date": "1948-08-01T00:00:00.000Z",
        "value": -0.1
    },
    {
        "date": "1948-09-01T00:00:00.000Z",
        "value": -0.1
    },
    {
        "date": "1948-10-01T00:00:00.000Z",
        "value": -0.07
    },
    {
        "date": "1948-11-01T00:00:00.000Z",
        "value": -0.08
    },
    {
        "date": "1948-12-01T00:00:00.000Z",
        "value": -0.23
    },
    {
        "date": "1949-01-01T00:00:00.000Z",
        "value": 0.09
    },
    {
        "date": "1949-02-01T00:00:00.000Z",
        "value": -0.16
    },
    {
        "date": "1949-03-01T00:00:00.000Z",
        "value": -0.01
    },
    {
        "date": "1949-04-01T00:00:00.000Z",
        "value": -0.07
    },
    {
        "date": "1949-05-01T00:00:00.000Z",
        "value": -0.09
    },
    {
        "date": "1949-06-01T00:00:00.000Z",
        "value": -0.22
    },
    {
        "date": "1949-07-01T00:00:00.000Z",
        "value": -0.13
    },
    {
        "date": "1949-08-01T00:00:00.000Z",
        "value": -0.08
    },
    {
        "date": "1949-09-01T00:00:00.000Z",
        "value": -0.08
    },
    {
        "date": "1949-10-01T00:00:00.000Z",
        "value": -0.03
    },
    {
        "date": "1949-11-01T00:00:00.000Z",
        "value": -0.08
    },
    {
        "date": "1949-12-01T00:00:00.000Z",
        "value": -0.19
    },
    {
        "date": "1950-01-01T00:00:00.000Z",
        "value": -0.3
    },
    {
        "date": "1950-02-01T00:00:00.000Z",
        "value": -0.26
    },
    {
        "date": "1950-03-01T00:00:00.000Z",
        "value": -0.06
    },
    {
        "date": "1950-04-01T00:00:00.000Z",
        "value": -0.21
    },
    {
        "date": "1950-05-01T00:00:00.000Z",
        "value": -0.12
    },
    {
        "date": "1950-06-01T00:00:00.000Z",
        "value": -0.06
    },
    {
        "date": "1950-07-01T00:00:00.000Z",
        "value": -0.09
    },
    {
        "date": "1950-08-01T00:00:00.000Z",
        "value": -0.18
    },
    {
        "date": "1950-09-01T00:00:00.000Z",
        "value": -0.1
    },
    {
        "date": "1950-10-01T00:00:00.000Z",
        "value": -0.2
    },
    {
        "date": "1950-11-01T00:00:00.000Z",
        "value": -0.35
    },
    {
        "date": "1950-12-01T00:00:00.000Z",
        "value": -0.2
    },
    {
        "date": "1951-01-01T00:00:00.000Z",
        "value": -0.35
    },
    {
        "date": "1951-02-01T00:00:00.000Z",
        "value": -0.44
    },
    {
        "date": "1951-03-01T00:00:00.000Z",
        "value": -0.19
    },
    {
        "date": "1951-04-01T00:00:00.000Z",
        "value": -0.1
    },
    {
        "date": "1951-05-01T00:00:00.000Z",
        "value": -0.02
    },
    {
        "date": "1951-06-01T00:00:00.000Z",
        "value": -0.05
    },
    {
        "date": "1951-07-01T00:00:00.000Z",
        "value": 0
    },
    {
        "date": "1951-08-01T00:00:00.000Z",
        "value": 0.05
    },
    {
        "date": "1951-09-01T00:00:00.000Z",
        "value": 0.07
    },
    {
        "date": "1951-10-01T00:00:00.000Z",
        "value": 0.06
    },
    {
        "date": "1951-11-01T00:00:00.000Z",
        "value": 0
    },
    {
        "date": "1951-12-01T00:00:00.000Z",
        "value": 0.15
    },
    {
        "date": "1952-01-01T00:00:00.000Z",
        "value": 0.16
    },
    {
        "date": "1952-02-01T00:00:00.000Z",
        "value": 0.12
    },
    {
        "date": "1952-03-01T00:00:00.000Z",
        "value": -0.1
    },
    {
        "date": "1952-04-01T00:00:00.000Z",
        "value": 0.02
    },
    {
        "date": "1952-05-01T00:00:00.000Z",
        "value": -0.05
    },
    {
        "date": "1952-06-01T00:00:00.000Z",
        "value": -0.04
    },
    {
        "date": "1952-07-01T00:00:00.000Z",
        "value": 0.05
    },
    {
        "date": "1952-08-01T00:00:00.000Z",
        "value": 0.07
    },
    {
        "date": "1952-09-01T00:00:00.000Z",
        "value": 0.08
    },
    {
        "date": "1952-10-01T00:00:00.000Z",
        "value": -0.04
    },
    {
        "date": "1952-11-01T00:00:00.000Z",
        "value": -0.17
    },
    {
        "date": "1952-12-01T00:00:00.000Z",
        "value": -0.02
    },
    {
        "date": "1953-01-01T00:00:00.000Z",
        "value": 0.09
    },
    {
        "date": "1953-02-01T00:00:00.000Z",
        "value": 0.16
    },
    {
        "date": "1953-03-01T00:00:00.000Z",
        "value": 0.11
    },
    {
        "date": "1953-04-01T00:00:00.000Z",
        "value": 0.2
    },
    {
        "date": "1953-05-01T00:00:00.000Z",
        "value": 0.08
    },
    {
        "date": "1953-06-01T00:00:00.000Z",
        "value": 0.08
    },
    {
        "date": "1953-07-01T00:00:00.000Z",
        "value": 0.02
    },
    {
        "date": "1953-08-01T00:00:00.000Z",
        "value": 0.08
    },
    {
        "date": "1953-09-01T00:00:00.000Z",
        "value": 0.06
    },
    {
        "date": "1953-10-01T00:00:00.000Z",
        "value": 0.05
    },
    {
        "date": "1953-11-01T00:00:00.000Z",
        "value": -0.05
    },
    {
        "date": "1953-12-01T00:00:00.000Z",
        "value": 0.03
    },
    {
        "date": "1954-01-01T00:00:00.000Z",
        "value": -0.28
    },
    {
        "date": "1954-02-01T00:00:00.000Z",
        "value": -0.1
    },
    {
        "date": "1954-03-01T00:00:00.000Z",
        "value": -0.12
    },
    {
        "date": "1954-04-01T00:00:00.000Z",
        "value": -0.18
    },
    {
        "date": "1954-05-01T00:00:00.000Z",
        "value": -0.2
    },
    {
        "date": "1954-06-01T00:00:00.000Z",
        "value": -0.16
    },
    {
        "date": "1954-07-01T00:00:00.000Z",
        "value": -0.16
    },
    {
        "date": "1954-08-01T00:00:00.000Z",
        "value": -0.13
    },
    {
        "date": "1954-09-01T00:00:00.000Z",
        "value": -0.07
    },
    {
        "date": "1954-10-01T00:00:00.000Z",
        "value": -0.01
    },
    {
        "date": "1954-11-01T00:00:00.000Z",
        "value": 0.08
    },
    {
        "date": "1954-12-01T00:00:00.000Z",
        "value": -0.18
    },
    {
        "date": "1955-01-01T00:00:00.000Z",
        "value": 0.11
    },
    {
        "date": "1955-02-01T00:00:00.000Z",
        "value": -0.21
    },
    {
        "date": "1955-03-01T00:00:00.000Z",
        "value": -0.36
    },
    {
        "date": "1955-04-01T00:00:00.000Z",
        "value": -0.23
    },
    {
        "date": "1955-05-01T00:00:00.000Z",
        "value": -0.2
    },
    {
        "date": "1955-06-01T00:00:00.000Z",
        "value": -0.08
    },
    {
        "date": "1955-07-01T00:00:00.000Z",
        "value": -0.09
    },
    {
        "date": "1955-08-01T00:00:00.000Z",
        "value": 0.04
    },
    {
        "date": "1955-09-01T00:00:00.000Z",
        "value": -0.13
    },
    {
        "date": "1955-10-01T00:00:00.000Z",
        "value": -0.05
    },
    {
        "date": "1955-11-01T00:00:00.000Z",
        "value": -0.28
    },
    {
        "date": "1955-12-01T00:00:00.000Z",
        "value": -0.32
    },
    {
        "date": "1956-01-01T00:00:00.000Z",
        "value": -0.17
    },
    {
        "date": "1956-02-01T00:00:00.000Z",
        "value": -0.25
    },
    {
        "date": "1956-03-01T00:00:00.000Z",
        "value": -0.23
    },
    {
        "date": "1956-04-01T00:00:00.000Z",
        "value": -0.26
    },
    {
        "date": "1956-05-01T00:00:00.000Z",
        "value": -0.28
    },
    {
        "date": "1956-06-01T00:00:00.000Z",
        "value": -0.15
    },
    {
        "date": "1956-07-01T00:00:00.000Z",
        "value": -0.12
    },
    {
        "date": "1956-08-01T00:00:00.000Z",
        "value": -0.25
    },
    {
        "date": "1956-09-01T00:00:00.000Z",
        "value": -0.22
    },
    {
        "date": "1956-10-01T00:00:00.000Z",
        "value": -0.24
    },
    {
        "date": "1956-11-01T00:00:00.000Z",
        "value": -0.17
    },
    {
        "date": "1956-12-01T00:00:00.000Z",
        "value": -0.1
    },
    {
        "date": "1957-01-01T00:00:00.000Z",
        "value": -0.14
    },
    {
        "date": "1957-02-01T00:00:00.000Z",
        "value": -0.05
    },
    {
        "date": "1957-03-01T00:00:00.000Z",
        "value": -0.05
    },
    {
        "date": "1957-04-01T00:00:00.000Z",
        "value": -0.04
    },
    {
        "date": "1957-05-01T00:00:00.000Z",
        "value": 0.08
    },
    {
        "date": "1957-06-01T00:00:00.000Z",
        "value": 0.16
    },
    {
        "date": "1957-07-01T00:00:00.000Z",
        "value": 0.01
    },
    {
        "date": "1957-08-01T00:00:00.000Z",
        "value": 0.14
    },
    {
        "date": "1957-09-01T00:00:00.000Z",
        "value": 0.06
    },
    {
        "date": "1957-10-01T00:00:00.000Z",
        "value": 0.01
    },
    {
        "date": "1957-11-01T00:00:00.000Z",
        "value": 0.07
    },
    {
        "date": "1957-12-01T00:00:00.000Z",
        "value": 0.16
    },
    {
        "date": "1958-01-01T00:00:00.000Z",
        "value": 0.39
    },
    {
        "date": "1958-02-01T00:00:00.000Z",
        "value": 0.24
    },
    {
        "date": "1958-03-01T00:00:00.000Z",
        "value": 0.1
    },
    {
        "date": "1958-04-01T00:00:00.000Z",
        "value": 0.01
    },
    {
        "date": "1958-05-01T00:00:00.000Z",
        "value": 0.08
    },
    {
        "date": "1958-06-01T00:00:00.000Z",
        "value": -0.05
    },
    {
        "date": "1958-07-01T00:00:00.000Z",
        "value": 0.06
    },
    {
        "date": "1958-08-01T00:00:00.000Z",
        "value": -0.06
    },
    {
        "date": "1958-09-01T00:00:00.000Z",
        "value": -0.03
    },
    {
        "date": "1958-10-01T00:00:00.000Z",
        "value": 0.04
    },
    {
        "date": "1958-11-01T00:00:00.000Z",
        "value": 0.02
    },
    {
        "date": "1958-12-01T00:00:00.000Z",
        "value": 0.01
    },
    {
        "date": "1959-01-01T00:00:00.000Z",
        "value": 0.06
    },
    {
        "date": "1959-02-01T00:00:00.000Z",
        "value": 0.09
    },
    {
        "date": "1959-03-01T00:00:00.000Z",
        "value": 0.19
    },
    {
        "date": "1959-04-01T00:00:00.000Z",
        "value": 0.16
    },
    {
        "date": "1959-05-01T00:00:00.000Z",
        "value": 0.06
    },
    {
        "date": "1959-06-01T00:00:00.000Z",
        "value": 0.02
    },
    {
        "date": "1959-07-01T00:00:00.000Z",
        "value": 0.06
    },
    {
        "date": "1959-08-01T00:00:00.000Z",
        "value": -0.01
    },
    {
        "date": "1959-09-01T00:00:00.000Z",
        "value": -0.06
    },
    {
        "date": "1959-10-01T00:00:00.000Z",
        "value": -0.09
    },
    {
        "date": "1959-11-01T00:00:00.000Z",
        "value": -0.09
    },
    {
        "date": "1959-12-01T00:00:00.000Z",
        "value": -0.03
    },
    {
        "date": "1960-01-01T00:00:00.000Z",
        "value": -0.01
    },
    {
        "date": "1960-02-01T00:00:00.000Z",
        "value": 0.14
    },
    {
        "date": "1960-03-01T00:00:00.000Z",
        "value": -0.36
    },
    {
        "date": "1960-04-01T00:00:00.000Z",
        "value": -0.16
    },
    {
        "date": "1960-05-01T00:00:00.000Z",
        "value": -0.08
    },
    {
        "date": "1960-06-01T00:00:00.000Z",
        "value": 0.01
    },
    {
        "date": "1960-07-01T00:00:00.000Z",
        "value": -0.02
    },
    {
        "date": "1960-08-01T00:00:00.000Z",
        "value": -0.01
    },
    {
        "date": "1960-09-01T00:00:00.000Z",
        "value": 0.05
    },
    {
        "date": "1960-10-01T00:00:00.000Z",
        "value": 0.07
    },
    {
        "date": "1960-11-01T00:00:00.000Z",
        "value": -0.11
    },
    {
        "date": "1960-12-01T00:00:00.000Z",
        "value": 0.18
    },
    {
        "date": "1961-01-01T00:00:00.000Z",
        "value": 0.07
    },
    {
        "date": "1961-02-01T00:00:00.000Z",
        "value": 0.18
    },
    {
        "date": "1961-03-01T00:00:00.000Z",
        "value": 0.09
    },
    {
        "date": "1961-04-01T00:00:00.000Z",
        "value": 0.15
    },
    {
        "date": "1961-05-01T00:00:00.000Z",
        "value": 0.13
    },
    {
        "date": "1961-06-01T00:00:00.000Z",
        "value": 0.12
    },
    {
        "date": "1961-07-01T00:00:00.000Z",
        "value": -0.03
    },
    {
        "date": "1961-08-01T00:00:00.000Z",
        "value": 0.02
    },
    {
        "date": "1961-09-01T00:00:00.000Z",
        "value": 0.05
    },
    {
        "date": "1961-10-01T00:00:00.000Z",
        "value": 0
    },
    {
        "date": "1961-11-01T00:00:00.000Z",
        "value": 0.03
    },
    {
        "date": "1961-12-01T00:00:00.000Z",
        "value": -0.15
    },
    {
        "date": "1962-01-01T00:00:00.000Z",
        "value": 0.08
    },
    {
        "date": "1962-02-01T00:00:00.000Z",
        "value": 0.14
    },
    {
        "date": "1962-03-01T00:00:00.000Z",
        "value": 0.12
    },
    {
        "date": "1962-04-01T00:00:00.000Z",
        "value": 0.05
    },
    {
        "date": "1962-05-01T00:00:00.000Z",
        "value": -0.06
    },
    {
        "date": "1962-06-01T00:00:00.000Z",
        "value": 0.06
    },
    {
        "date": "1962-07-01T00:00:00.000Z",
        "value": -0.02
    },
    {
        "date": "1962-08-01T00:00:00.000Z",
        "value": -0.02
    },
    {
        "date": "1962-09-01T00:00:00.000Z",
        "value": -0.01
    },
    {
        "date": "1962-10-01T00:00:00.000Z",
        "value": -0.03
    },
    {
        "date": "1962-11-01T00:00:00.000Z",
        "value": 0.06
    },
    {
        "date": "1962-12-01T00:00:00.000Z",
        "value": -0.01
    },
    {
        "date": "1963-01-01T00:00:00.000Z",
        "value": -0.03
    },
    {
        "date": "1963-02-01T00:00:00.000Z",
        "value": 0.19
    },
    {
        "date": "1963-03-01T00:00:00.000Z",
        "value": -0.13
    },
    {
        "date": "1963-04-01T00:00:00.000Z",
        "value": -0.05
    },
    {
        "date": "1963-05-01T00:00:00.000Z",
        "value": -0.09
    },
    {
        "date": "1963-06-01T00:00:00.000Z",
        "value": 0.03
    },
    {
        "date": "1963-07-01T00:00:00.000Z",
        "value": 0.08
    },
    {
        "date": "1963-08-01T00:00:00.000Z",
        "value": 0.25
    },
    {
        "date": "1963-09-01T00:00:00.000Z",
        "value": 0.2
    },
    {
        "date": "1963-10-01T00:00:00.000Z",
        "value": 0.15
    },
    {
        "date": "1963-11-01T00:00:00.000Z",
        "value": 0.15
    },
    {
        "date": "1963-12-01T00:00:00.000Z",
        "value": 0
    },
    {
        "date": "1964-01-01T00:00:00.000Z",
        "value": -0.06
    },
    {
        "date": "1964-02-01T00:00:00.000Z",
        "value": -0.12
    },
    {
        "date": "1964-03-01T00:00:00.000Z",
        "value": -0.22
    },
    {
        "date": "1964-04-01T00:00:00.000Z",
        "value": -0.3
    },
    {
        "date": "1964-05-01T00:00:00.000Z",
        "value": -0.25
    },
    {
        "date": "1964-06-01T00:00:00.000Z",
        "value": -0.07
    },
    {
        "date": "1964-07-01T00:00:00.000Z",
        "value": -0.07
    },
    {
        "date": "1964-08-01T00:00:00.000Z",
        "value": -0.2
    },
    {
        "date": "1964-09-01T00:00:00.000Z",
        "value": -0.28
    },
    {
        "date": "1964-10-01T00:00:00.000Z",
        "value": -0.3
    },
    {
        "date": "1964-11-01T00:00:00.000Z",
        "value": -0.21
    },
    {
        "date": "1964-12-01T00:00:00.000Z",
        "value": -0.3
    },
    {
        "date": "1965-01-01T00:00:00.000Z",
        "value": -0.09
    },
    {
        "date": "1965-02-01T00:00:00.000Z",
        "value": -0.17
    },
    {
        "date": "1965-03-01T00:00:00.000Z",
        "value": -0.11
    },
    {
        "date": "1965-04-01T00:00:00.000Z",
        "value": -0.2
    },
    {
        "date": "1965-05-01T00:00:00.000Z",
        "value": -0.14
    },
    {
        "date": "1965-06-01T00:00:00.000Z",
        "value": -0.08
    },
    {
        "date": "1965-07-01T00:00:00.000Z",
        "value": -0.12
    },
    {
        "date": "1965-08-01T00:00:00.000Z",
        "value": -0.01
    },
    {
        "date": "1965-09-01T00:00:00.000Z",
        "value": -0.15
    },
    {
        "date": "1965-10-01T00:00:00.000Z",
        "value": -0.04
    },
    {
        "date": "1965-11-01T00:00:00.000Z",
        "value": -0.06
    },
    {
        "date": "1965-12-01T00:00:00.000Z",
        "value": -0.05
    },
    {
        "date": "1966-01-01T00:00:00.000Z",
        "value": -0.16
    },
    {
        "date": "1966-02-01T00:00:00.000Z",
        "value": 0
    },
    {
        "date": "1966-03-01T00:00:00.000Z",
        "value": 0.04
    },
    {
        "date": "1966-04-01T00:00:00.000Z",
        "value": -0.13
    },
    {
        "date": "1966-05-01T00:00:00.000Z",
        "value": -0.1
    },
    {
        "date": "1966-06-01T00:00:00.000Z",
        "value": 0.02
    },
    {
        "date": "1966-07-01T00:00:00.000Z",
        "value": 0.09
    },
    {
        "date": "1966-08-01T00:00:00.000Z",
        "value": -0.1
    },
    {
        "date": "1966-09-01T00:00:00.000Z",
        "value": -0.01
    },
    {
        "date": "1966-10-01T00:00:00.000Z",
        "value": -0.15
    },
    {
        "date": "1966-11-01T00:00:00.000Z",
        "value": -0.02
    },
    {
        "date": "1966-12-01T00:00:00.000Z",
        "value": -0.06
    },
    {
        "date": "1967-01-01T00:00:00.000Z",
        "value": -0.06
    },
    {
        "date": "1967-02-01T00:00:00.000Z",
        "value": -0.2
    },
    {
        "date": "1967-03-01T00:00:00.000Z",
        "value": 0.03
    },
    {
        "date": "1967-04-01T00:00:00.000Z",
        "value": -0.05
    },
    {
        "date": "1967-05-01T00:00:00.000Z",
        "value": 0.14
    },
    {
        "date": "1967-06-01T00:00:00.000Z",
        "value": -0.08
    },
    {
        "date": "1967-07-01T00:00:00.000Z",
        "value": 0.01
    },
    {
        "date": "1967-08-01T00:00:00.000Z",
        "value": 0.02
    },
    {
        "date": "1967-09-01T00:00:00.000Z",
        "value": -0.04
    },
    {
        "date": "1967-10-01T00:00:00.000Z",
        "value": 0.06
    },
    {
        "date": "1967-11-01T00:00:00.000Z",
        "value": -0.06
    },
    {
        "date": "1967-12-01T00:00:00.000Z",
        "value": -0.02
    },
    {
        "date": "1968-01-01T00:00:00.000Z",
        "value": -0.23
    },
    {
        "date": "1968-02-01T00:00:00.000Z",
        "value": -0.15
    },
    {
        "date": "1968-03-01T00:00:00.000Z",
        "value": 0.21
    },
    {
        "date": "1968-04-01T00:00:00.000Z",
        "value": -0.05
    },
    {
        "date": "1968-05-01T00:00:00.000Z",
        "value": -0.1
    },
    {
        "date": "1968-06-01T00:00:00.000Z",
        "value": -0.06
    },
    {
        "date": "1968-07-01T00:00:00.000Z",
        "value": -0.11
    },
    {
        "date": "1968-08-01T00:00:00.000Z",
        "value": -0.11
    },
    {
        "date": "1968-09-01T00:00:00.000Z",
        "value": -0.18
    },
    {
        "date": "1968-10-01T00:00:00.000Z",
        "value": 0.12
    },
    {
        "date": "1968-11-01T00:00:00.000Z",
        "value": -0.04
    },
    {
        "date": "1968-12-01T00:00:00.000Z",
        "value": -0.14
    },
    {
        "date": "1969-01-01T00:00:00.000Z",
        "value": -0.11
    },
    {
        "date": "1969-02-01T00:00:00.000Z",
        "value": -0.14
    },
    {
        "date": "1969-03-01T00:00:00.000Z",
        "value": 0
    },
    {
        "date": "1969-04-01T00:00:00.000Z",
        "value": 0.19
    },
    {
        "date": "1969-05-01T00:00:00.000Z",
        "value": 0.2
    },
    {
        "date": "1969-06-01T00:00:00.000Z",
        "value": 0.05
    },
    {
        "date": "1969-07-01T00:00:00.000Z",
        "value": -0.01
    },
    {
        "date": "1969-08-01T00:00:00.000Z",
        "value": 0.03
    },
    {
        "date": "1969-09-01T00:00:00.000Z",
        "value": 0.1
    },
    {
        "date": "1969-10-01T00:00:00.000Z",
        "value": 0.11
    },
    {
        "date": "1969-11-01T00:00:00.000Z",
        "value": 0.12
    },
    {
        "date": "1969-12-01T00:00:00.000Z",
        "value": 0.27
    },
    {
        "date": "1970-01-01T00:00:00.000Z",
        "value": 0.09
    },
    {
        "date": "1970-02-01T00:00:00.000Z",
        "value": 0.22
    },
    {
        "date": "1970-03-01T00:00:00.000Z",
        "value": 0.08
    },
    {
        "date": "1970-04-01T00:00:00.000Z",
        "value": 0.09
    },
    {
        "date": "1970-05-01T00:00:00.000Z",
        "value": -0.05
    },
    {
        "date": "1970-06-01T00:00:00.000Z",
        "value": -0.03
    },
    {
        "date": "1970-07-01T00:00:00.000Z",
        "value": -0.04
    },
    {
        "date": "1970-08-01T00:00:00.000Z",
        "value": -0.11
    },
    {
        "date": "1970-09-01T00:00:00.000Z",
        "value": 0.11
    },
    {
        "date": "1970-10-01T00:00:00.000Z",
        "value": 0.05
    },
    {
        "date": "1970-11-01T00:00:00.000Z",
        "value": 0.01
    },
    {
        "date": "1970-12-01T00:00:00.000Z",
        "value": -0.13
    },
    {
        "date": "1971-01-01T00:00:00.000Z",
        "value": -0.02
    },
    {
        "date": "1971-02-01T00:00:00.000Z",
        "value": -0.2
    },
    {
        "date": "1971-03-01T00:00:00.000Z",
        "value": -0.18
    },
    {
        "date": "1971-04-01T00:00:00.000Z",
        "value": -0.09
    },
    {
        "date": "1971-05-01T00:00:00.000Z",
        "value": -0.06
    },
    {
        "date": "1971-06-01T00:00:00.000Z",
        "value": -0.18
    },
    {
        "date": "1971-07-01T00:00:00.000Z",
        "value": -0.12
    },
    {
        "date": "1971-08-01T00:00:00.000Z",
        "value": -0.03
    },
    {
        "date": "1971-09-01T00:00:00.000Z",
        "value": -0.01
    },
    {
        "date": "1971-10-01T00:00:00.000Z",
        "value": -0.05
    },
    {
        "date": "1971-11-01T00:00:00.000Z",
        "value": -0.04
    },
    {
        "date": "1971-12-01T00:00:00.000Z",
        "value": -0.08
    },
    {
        "date": "1972-01-01T00:00:00.000Z",
        "value": -0.24
    },
    {
        "date": "1972-02-01T00:00:00.000Z",
        "value": -0.17
    },
    {
        "date": "1972-03-01T00:00:00.000Z",
        "value": 0.02
    },
    {
        "date": "1972-04-01T00:00:00.000Z",
        "value": -0.01
    },
    {
        "date": "1972-05-01T00:00:00.000Z",
        "value": -0.03
    },
    {
        "date": "1972-06-01T00:00:00.000Z",
        "value": 0.04
    },
    {
        "date": "1972-07-01T00:00:00.000Z",
        "value": 0.02
    },
    {
        "date": "1972-08-01T00:00:00.000Z",
        "value": 0.18
    },
    {
        "date": "1972-09-01T00:00:00.000Z",
        "value": 0.03
    },
    {
        "date": "1972-10-01T00:00:00.000Z",
        "value": 0.09
    },
    {
        "date": "1972-11-01T00:00:00.000Z",
        "value": 0.03
    },
    {
        "date": "1972-12-01T00:00:00.000Z",
        "value": 0.18
    },
    {
        "date": "1973-01-01T00:00:00.000Z",
        "value": 0.28
    },
    {
        "date": "1973-02-01T00:00:00.000Z",
        "value": 0.3
    },
    {
        "date": "1973-03-01T00:00:00.000Z",
        "value": 0.26
    },
    {
        "date": "1973-04-01T00:00:00.000Z",
        "value": 0.25
    },
    {
        "date": "1973-05-01T00:00:00.000Z",
        "value": 0.26
    },
    {
        "date": "1973-06-01T00:00:00.000Z",
        "value": 0.16
    },
    {
        "date": "1973-07-01T00:00:00.000Z",
        "value": 0.09
    },
    {
        "date": "1973-08-01T00:00:00.000Z",
        "value": 0.02
    },
    {
        "date": "1973-09-01T00:00:00.000Z",
        "value": 0.06
    },
    {
        "date": "1973-10-01T00:00:00.000Z",
        "value": 0.12
    },
    {
        "date": "1973-11-01T00:00:00.000Z",
        "value": 0.06
    },
    {
        "date": "1973-12-01T00:00:00.000Z",
        "value": -0.06
    },
    {
        "date": "1974-01-01T00:00:00.000Z",
        "value": -0.14
    },
    {
        "date": "1974-02-01T00:00:00.000Z",
        "value": -0.28
    },
    {
        "date": "1974-03-01T00:00:00.000Z",
        "value": -0.05
    },
    {
        "date": "1974-04-01T00:00:00.000Z",
        "value": -0.1
    },
    {
        "date": "1974-05-01T00:00:00.000Z",
        "value": -0.01
    },
    {
        "date": "1974-06-01T00:00:00.000Z",
        "value": -0.05
    },
    {
        "date": "1974-07-01T00:00:00.000Z",
        "value": -0.03
    },
    {
        "date": "1974-08-01T00:00:00.000Z",
        "value": 0.12
    },
    {
        "date": "1974-09-01T00:00:00.000Z",
        "value": -0.12
    },
    {
        "date": "1974-10-01T00:00:00.000Z",
        "value": -0.07
    },
    {
        "date": "1974-11-01T00:00:00.000Z",
        "value": -0.07
    },
    {
        "date": "1974-12-01T00:00:00.000Z",
        "value": -0.09
    },
    {
        "date": "1975-01-01T00:00:00.000Z",
        "value": 0.07
    },
    {
        "date": "1975-02-01T00:00:00.000Z",
        "value": 0.07
    },
    {
        "date": "1975-03-01T00:00:00.000Z",
        "value": 0.14
    },
    {
        "date": "1975-04-01T00:00:00.000Z",
        "value": 0.06
    },
    {
        "date": "1975-05-01T00:00:00.000Z",
        "value": 0.16
    },
    {
        "date": "1975-06-01T00:00:00.000Z",
        "value": -0.02
    },
    {
        "date": "1975-07-01T00:00:00.000Z",
        "value": -0.03
    },
    {
        "date": "1975-08-01T00:00:00.000Z",
        "value": -0.2
    },
    {
        "date": "1975-09-01T00:00:00.000Z",
        "value": -0.03
    },
    {
        "date": "1975-10-01T00:00:00.000Z",
        "value": -0.09
    },
    {
        "date": "1975-11-01T00:00:00.000Z",
        "value": -0.16
    },
    {
        "date": "1975-12-01T00:00:00.000Z",
        "value": -0.17
    },
    {
        "date": "1976-01-01T00:00:00.000Z",
        "value": 0
    },
    {
        "date": "1976-02-01T00:00:00.000Z",
        "value": -0.06
    },
    {
        "date": "1976-03-01T00:00:00.000Z",
        "value": -0.21
    },
    {
        "date": "1976-04-01T00:00:00.000Z",
        "value": -0.1
    },
    {
        "date": "1976-05-01T00:00:00.000Z",
        "value": -0.23
    },
    {
        "date": "1976-06-01T00:00:00.000Z",
        "value": -0.15
    },
    {
        "date": "1976-07-01T00:00:00.000Z",
        "value": -0.12
    },
    {
        "date": "1976-08-01T00:00:00.000Z",
        "value": -0.18
    },
    {
        "date": "1976-09-01T00:00:00.000Z",
        "value": -0.09
    },
    {
        "date": "1976-10-01T00:00:00.000Z",
        "value": -0.26
    },
    {
        "date": "1976-11-01T00:00:00.000Z",
        "value": -0.06
    },
    {
        "date": "1976-12-01T00:00:00.000Z",
        "value": 0.09
    },
    {
        "date": "1977-01-01T00:00:00.000Z",
        "value": 0.18
    },
    {
        "date": "1977-02-01T00:00:00.000Z",
        "value": 0.2
    },
    {
        "date": "1977-03-01T00:00:00.000Z",
        "value": 0.25
    },
    {
        "date": "1977-04-01T00:00:00.000Z",
        "value": 0.27
    },
    {
        "date": "1977-05-01T00:00:00.000Z",
        "value": 0.3
    },
    {
        "date": "1977-06-01T00:00:00.000Z",
        "value": 0.25
    },
    {
        "date": "1977-07-01T00:00:00.000Z",
        "value": 0.23
    },
    {
        "date": "1977-08-01T00:00:00.000Z",
        "value": 0.19
    },
    {
        "date": "1977-09-01T00:00:00.000Z",
        "value": 0.02
    },
    {
        "date": "1977-10-01T00:00:00.000Z",
        "value": 0.04
    },
    {
        "date": "1977-11-01T00:00:00.000Z",
        "value": 0.2
    },
    {
        "date": "1977-12-01T00:00:00.000Z",
        "value": 0.05
    },
    {
        "date": "1978-01-01T00:00:00.000Z",
        "value": 0.08
    },
    {
        "date": "1978-02-01T00:00:00.000Z",
        "value": 0.14
    },
    {
        "date": "1978-03-01T00:00:00.000Z",
        "value": 0.21
    },
    {
        "date": "1978-04-01T00:00:00.000Z",
        "value": 0.15
    },
    {
        "date": "1978-05-01T00:00:00.000Z",
        "value": 0.07
    },
    {
        "date": "1978-06-01T00:00:00.000Z",
        "value": -0.03
    },
    {
        "date": "1978-07-01T00:00:00.000Z",
        "value": 0.07
    },
    {
        "date": "1978-08-01T00:00:00.000Z",
        "value": -0.18
    },
    {
        "date": "1978-09-01T00:00:00.000Z",
        "value": 0.05
    },
    {
        "date": "1978-10-01T00:00:00.000Z",
        "value": 0
    },
    {
        "date": "1978-11-01T00:00:00.000Z",
        "value": 0.16
    },
    {
        "date": "1978-12-01T00:00:00.000Z",
        "value": 0.11
    },
    {
        "date": "1979-01-01T00:00:00.000Z",
        "value": 0.14
    },
    {
        "date": "1979-02-01T00:00:00.000Z",
        "value": -0.09
    },
    {
        "date": "1979-03-01T00:00:00.000Z",
        "value": 0.19
    },
    {
        "date": "1979-04-01T00:00:00.000Z",
        "value": 0.13
    },
    {
        "date": "1979-05-01T00:00:00.000Z",
        "value": 0.06
    },
    {
        "date": "1979-06-01T00:00:00.000Z",
        "value": 0.14
    },
    {
        "date": "1979-07-01T00:00:00.000Z",
        "value": 0.03
    },
    {
        "date": "1979-08-01T00:00:00.000Z",
        "value": 0.14
    },
    {
        "date": "1979-09-01T00:00:00.000Z",
        "value": 0.27
    },
    {
        "date": "1979-10-01T00:00:00.000Z",
        "value": 0.26
    },
    {
        "date": "1979-11-01T00:00:00.000Z",
        "value": 0.29
    },
    {
        "date": "1979-12-01T00:00:00.000Z",
        "value": 0.47
    },
    {
        "date": "1980-01-01T00:00:00.000Z",
        "value": 0.3
    },
    {
        "date": "1980-02-01T00:00:00.000Z",
        "value": 0.42
    },
    {
        "date": "1980-03-01T00:00:00.000Z",
        "value": 0.29
    },
    {
        "date": "1980-04-01T00:00:00.000Z",
        "value": 0.32
    },
    {
        "date": "1980-05-01T00:00:00.000Z",
        "value": 0.34
    },
    {
        "date": "1980-06-01T00:00:00.000Z",
        "value": 0.16
    },
    {
        "date": "1980-07-01T00:00:00.000Z",
        "value": 0.28
    },
    {
        "date": "1980-08-01T00:00:00.000Z",
        "value": 0.24
    },
    {
        "date": "1980-09-01T00:00:00.000Z",
        "value": 0.21
    },
    {
        "date": "1980-10-01T00:00:00.000Z",
        "value": 0.2
    },
    {
        "date": "1980-11-01T00:00:00.000Z",
        "value": 0.3
    },
    {
        "date": "1980-12-01T00:00:00.000Z",
        "value": 0.21
    },
    {
        "date": "1981-01-01T00:00:00.000Z",
        "value": 0.56
    },
    {
        "date": "1981-02-01T00:00:00.000Z",
        "value": 0.41
    },
    {
        "date": "1981-03-01T00:00:00.000Z",
        "value": 0.48
    },
    {
        "date": "1981-04-01T00:00:00.000Z",
        "value": 0.32
    },
    {
        "date": "1981-05-01T00:00:00.000Z",
        "value": 0.25
    },
    {
        "date": "1981-06-01T00:00:00.000Z",
        "value": 0.31
    },
    {
        "date": "1981-07-01T00:00:00.000Z",
        "value": 0.35
    },
    {
        "date": "1981-08-01T00:00:00.000Z",
        "value": 0.35
    },
    {
        "date": "1981-09-01T00:00:00.000Z",
        "value": 0.17
    },
    {
        "date": "1981-10-01T00:00:00.000Z",
        "value": 0.13
    },
    {
        "date": "1981-11-01T00:00:00.000Z",
        "value": 0.21
    },
    {
        "date": "1981-12-01T00:00:00.000Z",
        "value": 0.4
    },
    {
        "date": "1982-01-01T00:00:00.000Z",
        "value": 0.09
    },
    {
        "date": "1982-02-01T00:00:00.000Z",
        "value": 0.14
    },
    {
        "date": "1982-03-01T00:00:00.000Z",
        "value": -0.01
    },
    {
        "date": "1982-04-01T00:00:00.000Z",
        "value": 0.1
    },
    {
        "date": "1982-05-01T00:00:00.000Z",
        "value": 0.16
    },
    {
        "date": "1982-06-01T00:00:00.000Z",
        "value": 0.05
    },
    {
        "date": "1982-07-01T00:00:00.000Z",
        "value": 0.13
    },
    {
        "date": "1982-08-01T00:00:00.000Z",
        "value": 0.08
    },
    {
        "date": "1982-09-01T00:00:00.000Z",
        "value": 0.15
    },
    {
        "date": "1982-10-01T00:00:00.000Z",
        "value": 0.13
    },
    {
        "date": "1982-11-01T00:00:00.000Z",
        "value": 0.14
    },
    {
        "date": "1982-12-01T00:00:00.000Z",
        "value": 0.43
    },
    {
        "date": "1983-01-01T00:00:00.000Z",
        "value": 0.52
    },
    {
        "date": "1983-02-01T00:00:00.000Z",
        "value": 0.4
    },
    {
        "date": "1983-03-01T00:00:00.000Z",
        "value": 0.42
    },
    {
        "date": "1983-04-01T00:00:00.000Z",
        "value": 0.3
    },
    {
        "date": "1983-05-01T00:00:00.000Z",
        "value": 0.35
    },
    {
        "date": "1983-06-01T00:00:00.000Z",
        "value": 0.18
    },
    {
        "date": "1983-07-01T00:00:00.000Z",
        "value": 0.15
    },
    {
        "date": "1983-08-01T00:00:00.000Z",
        "value": 0.3
    },
    {
        "date": "1983-09-01T00:00:00.000Z",
        "value": 0.38
    },
    {
        "date": "1983-10-01T00:00:00.000Z",
        "value": 0.15
    },
    {
        "date": "1983-11-01T00:00:00.000Z",
        "value": 0.3
    },
    {
        "date": "1983-12-01T00:00:00.000Z",
        "value": 0.17
    },
    {
        "date": "1984-01-01T00:00:00.000Z",
        "value": 0.3
    },
    {
        "date": "1984-02-01T00:00:00.000Z",
        "value": 0.17
    },
    {
        "date": "1984-03-01T00:00:00.000Z",
        "value": 0.29
    },
    {
        "date": "1984-04-01T00:00:00.000Z",
        "value": 0.08
    },
    {
        "date": "1984-05-01T00:00:00.000Z",
        "value": 0.33
    },
    {
        "date": "1984-06-01T00:00:00.000Z",
        "value": 0.04
    },
    {
        "date": "1984-07-01T00:00:00.000Z",
        "value": 0.16
    },
    {
        "date": "1984-08-01T00:00:00.000Z",
        "value": 0.15
    },
    {
        "date": "1984-09-01T00:00:00.000Z",
        "value": 0.2
    },
    {
        "date": "1984-10-01T00:00:00.000Z",
        "value": 0.15
    },
    {
        "date": "1984-11-01T00:00:00.000Z",
        "value": 0.04
    },
    {
        "date": "1984-12-01T00:00:00.000Z",
        "value": -0.06
    },
    {
        "date": "1985-01-01T00:00:00.000Z",
        "value": 0.21
    },
    {
        "date": "1985-02-01T00:00:00.000Z",
        "value": -0.06
    },
    {
        "date": "1985-03-01T00:00:00.000Z",
        "value": 0.17
    },
    {
        "date": "1985-04-01T00:00:00.000Z",
        "value": 0.11
    },
    {
        "date": "1985-05-01T00:00:00.000Z",
        "value": 0.17
    },
    {
        "date": "1985-06-01T00:00:00.000Z",
        "value": 0.17
    },
    {
        "date": "1985-07-01T00:00:00.000Z",
        "value": 0
    },
    {
        "date": "1985-08-01T00:00:00.000Z",
        "value": 0.15
    },
    {
        "date": "1985-09-01T00:00:00.000Z",
        "value": 0.14
    },
    {
        "date": "1985-10-01T00:00:00.000Z",
        "value": 0.11
    },
    {
        "date": "1985-11-01T00:00:00.000Z",
        "value": 0.09
    },
    {
        "date": "1985-12-01T00:00:00.000Z",
        "value": 0.15
    },
    {
        "date": "1986-01-01T00:00:00.000Z",
        "value": 0.3
    },
    {
        "date": "1986-02-01T00:00:00.000Z",
        "value": 0.39
    },
    {
        "date": "1986-03-01T00:00:00.000Z",
        "value": 0.29
    },
    {
        "date": "1986-04-01T00:00:00.000Z",
        "value": 0.26
    },
    {
        "date": "1986-05-01T00:00:00.000Z",
        "value": 0.26
    },
    {
        "date": "1986-06-01T00:00:00.000Z",
        "value": 0.12
    },
    {
        "date": "1986-07-01T00:00:00.000Z",
        "value": 0.13
    },
    {
        "date": "1986-08-01T00:00:00.000Z",
        "value": 0.12
    },
    {
        "date": "1986-09-01T00:00:00.000Z",
        "value": 0.02
    },
    {
        "date": "1986-10-01T00:00:00.000Z",
        "value": 0.14
    },
    {
        "date": "1986-11-01T00:00:00.000Z",
        "value": 0.11
    },
    {
        "date": "1986-12-01T00:00:00.000Z",
        "value": 0.16
    },
    {
        "date": "1987-01-01T00:00:00.000Z",
        "value": 0.36
    },
    {
        "date": "1987-02-01T00:00:00.000Z",
        "value": 0.46
    },
    {
        "date": "1987-03-01T00:00:00.000Z",
        "value": 0.17
    },
    {
        "date": "1987-04-01T00:00:00.000Z",
        "value": 0.24
    },
    {
        "date": "1987-05-01T00:00:00.000Z",
        "value": 0.26
    },
    {
        "date": "1987-06-01T00:00:00.000Z",
        "value": 0.36
    },
    {
        "date": "1987-07-01T00:00:00.000Z",
        "value": 0.46
    },
    {
        "date": "1987-08-01T00:00:00.000Z",
        "value": 0.28
    },
    {
        "date": "1987-09-01T00:00:00.000Z",
        "value": 0.39
    },
    {
        "date": "1987-10-01T00:00:00.000Z",
        "value": 0.32
    },
    {
        "date": "1987-11-01T00:00:00.000Z",
        "value": 0.25
    },
    {
        "date": "1987-12-01T00:00:00.000Z",
        "value": 0.47
    },
    {
        "date": "1988-01-01T00:00:00.000Z",
        "value": 0.57
    },
    {
        "date": "1988-02-01T00:00:00.000Z",
        "value": 0.42
    },
    {
        "date": "1988-03-01T00:00:00.000Z",
        "value": 0.49
    },
    {
        "date": "1988-04-01T00:00:00.000Z",
        "value": 0.45
    },
    {
        "date": "1988-05-01T00:00:00.000Z",
        "value": 0.44
    },
    {
        "date": "1988-06-01T00:00:00.000Z",
        "value": 0.42
    },
    {
        "date": "1988-07-01T00:00:00.000Z",
        "value": 0.35
    },
    {
        "date": "1988-08-01T00:00:00.000Z",
        "value": 0.46
    },
    {
        "date": "1988-09-01T00:00:00.000Z",
        "value": 0.42
    },
    {
        "date": "1988-10-01T00:00:00.000Z",
        "value": 0.4
    },
    {
        "date": "1988-11-01T00:00:00.000Z",
        "value": 0.13
    },
    {
        "date": "1988-12-01T00:00:00.000Z",
        "value": 0.34
    },
    {
        "date": "1989-01-01T00:00:00.000Z",
        "value": 0.16
    },
    {
        "date": "1989-02-01T00:00:00.000Z",
        "value": 0.35
    },
    {
        "date": "1989-03-01T00:00:00.000Z",
        "value": 0.36
    },
    {
        "date": "1989-04-01T00:00:00.000Z",
        "value": 0.33
    },
    {
        "date": "1989-05-01T00:00:00.000Z",
        "value": 0.17
    },
    {
        "date": "1989-06-01T00:00:00.000Z",
        "value": 0.15
    },
    {
        "date": "1989-07-01T00:00:00.000Z",
        "value": 0.34
    },
    {
        "date": "1989-08-01T00:00:00.000Z",
        "value": 0.36
    },
    {
        "date": "1989-09-01T00:00:00.000Z",
        "value": 0.37
    },
    {
        "date": "1989-10-01T00:00:00.000Z",
        "value": 0.32
    },
    {
        "date": "1989-11-01T00:00:00.000Z",
        "value": 0.21
    },
    {
        "date": "1989-12-01T00:00:00.000Z",
        "value": 0.37
    },
    {
        "date": "1990-01-01T00:00:00.000Z",
        "value": 0.41
    },
    {
        "date": "1990-02-01T00:00:00.000Z",
        "value": 0.41
    },
    {
        "date": "1990-03-01T00:00:00.000Z",
        "value": 0.76
    },
    {
        "date": "1990-04-01T00:00:00.000Z",
        "value": 0.55
    },
    {
        "date": "1990-05-01T00:00:00.000Z",
        "value": 0.46
    },
    {
        "date": "1990-06-01T00:00:00.000Z",
        "value": 0.38
    },
    {
        "date": "1990-07-01T00:00:00.000Z",
        "value": 0.44
    },
    {
        "date": "1990-08-01T00:00:00.000Z",
        "value": 0.3
    },
    {
        "date": "1990-09-01T00:00:00.000Z",
        "value": 0.3
    },
    {
        "date": "1990-10-01T00:00:00.000Z",
        "value": 0.43
    },
    {
        "date": "1990-11-01T00:00:00.000Z",
        "value": 0.46
    },
    {
        "date": "1990-12-01T00:00:00.000Z",
        "value": 0.42
    },
    {
        "date": "1991-01-01T00:00:00.000Z",
        "value": 0.42
    },
    {
        "date": "1991-02-01T00:00:00.000Z",
        "value": 0.51
    },
    {
        "date": "1991-03-01T00:00:00.000Z",
        "value": 0.36
    },
    {
        "date": "1991-04-01T00:00:00.000Z",
        "value": 0.53
    },
    {
        "date": "1991-05-01T00:00:00.000Z",
        "value": 0.39
    },
    {
        "date": "1991-06-01T00:00:00.000Z",
        "value": 0.54
    },
    {
        "date": "1991-07-01T00:00:00.000Z",
        "value": 0.51
    },
    {
        "date": "1991-08-01T00:00:00.000Z",
        "value": 0.42
    },
    {
        "date": "1991-09-01T00:00:00.000Z",
        "value": 0.5
    },
    {
        "date": "1991-10-01T00:00:00.000Z",
        "value": 0.32
    },
    {
        "date": "1991-11-01T00:00:00.000Z",
        "value": 0.31
    },
    {
        "date": "1991-12-01T00:00:00.000Z",
        "value": 0.33
    },
    {
        "date": "1992-01-01T00:00:00.000Z",
        "value": 0.45
    },
    {
        "date": "1992-02-01T00:00:00.000Z",
        "value": 0.42
    },
    {
        "date": "1992-03-01T00:00:00.000Z",
        "value": 0.47
    },
    {
        "date": "1992-04-01T00:00:00.000Z",
        "value": 0.24
    },
    {
        "date": "1992-05-01T00:00:00.000Z",
        "value": 0.32
    },
    {
        "date": "1992-06-01T00:00:00.000Z",
        "value": 0.24
    },
    {
        "date": "1992-07-01T00:00:00.000Z",
        "value": 0.13
    },
    {
        "date": "1992-08-01T00:00:00.000Z",
        "value": 0.1
    },
    {
        "date": "1992-09-01T00:00:00.000Z",
        "value": 0.01
    },
    {
        "date": "1992-10-01T00:00:00.000Z",
        "value": 0.11
    },
    {
        "date": "1992-11-01T00:00:00.000Z",
        "value": 0.04
    },
    {
        "date": "1992-12-01T00:00:00.000Z",
        "value": 0.22
    },
    {
        "date": "1993-01-01T00:00:00.000Z",
        "value": 0.37
    },
    {
        "date": "1993-02-01T00:00:00.000Z",
        "value": 0.39
    },
    {
        "date": "1993-03-01T00:00:00.000Z",
        "value": 0.36
    },
    {
        "date": "1993-04-01T00:00:00.000Z",
        "value": 0.28
    },
    {
        "date": "1993-05-01T00:00:00.000Z",
        "value": 0.26
    },
    {
        "date": "1993-06-01T00:00:00.000Z",
        "value": 0.24
    },
    {
        "date": "1993-07-01T00:00:00.000Z",
        "value": 0.28
    },
    {
        "date": "1993-08-01T00:00:00.000Z",
        "value": 0.13
    },
    {
        "date": "1993-09-01T00:00:00.000Z",
        "value": 0.11
    },
    {
        "date": "1993-10-01T00:00:00.000Z",
        "value": 0.24
    },
    {
        "date": "1993-11-01T00:00:00.000Z",
        "value": 0.07
    },
    {
        "date": "1993-12-01T00:00:00.000Z",
        "value": 0.19
    },
    {
        "date": "1994-01-01T00:00:00.000Z",
        "value": 0.3
    },
    {
        "date": "1994-02-01T00:00:00.000Z",
        "value": 0.04
    },
    {
        "date": "1994-03-01T00:00:00.000Z",
        "value": 0.26
    },
    {
        "date": "1994-04-01T00:00:00.000Z",
        "value": 0.41
    },
    {
        "date": "1994-05-01T00:00:00.000Z",
        "value": 0.29
    },
    {
        "date": "1994-06-01T00:00:00.000Z",
        "value": 0.42
    },
    {
        "date": "1994-07-01T00:00:00.000Z",
        "value": 0.32
    },
    {
        "date": "1994-08-01T00:00:00.000Z",
        "value": 0.23
    },
    {
        "date": "1994-09-01T00:00:00.000Z",
        "value": 0.32
    },
    {
        "date": "1994-10-01T00:00:00.000Z",
        "value": 0.42
    },
    {
        "date": "1994-11-01T00:00:00.000Z",
        "value": 0.46
    },
    {
        "date": "1994-12-01T00:00:00.000Z",
        "value": 0.36
    },
    {
        "date": "1995-01-01T00:00:00.000Z",
        "value": 0.5
    },
    {
        "date": "1995-02-01T00:00:00.000Z",
        "value": 0.77
    },
    {
        "date": "1995-03-01T00:00:00.000Z",
        "value": 0.45
    },
    {
        "date": "1995-04-01T00:00:00.000Z",
        "value": 0.47
    },
    {
        "date": "1995-05-01T00:00:00.000Z",
        "value": 0.29
    },
    {
        "date": "1995-06-01T00:00:00.000Z",
        "value": 0.45
    },
    {
        "date": "1995-07-01T00:00:00.000Z",
        "value": 0.49
    },
    {
        "date": "1995-08-01T00:00:00.000Z",
        "value": 0.48
    },
    {
        "date": "1995-09-01T00:00:00.000Z",
        "value": 0.34
    },
    {
        "date": "1995-10-01T00:00:00.000Z",
        "value": 0.49
    },
    {
        "date": "1995-11-01T00:00:00.000Z",
        "value": 0.45
    },
    {
        "date": "1995-12-01T00:00:00.000Z",
        "value": 0.3
    },
    {
        "date": "1996-01-01T00:00:00.000Z",
        "value": 0.27
    },
    {
        "date": "1996-02-01T00:00:00.000Z",
        "value": 0.5
    },
    {
        "date": "1996-03-01T00:00:00.000Z",
        "value": 0.34
    },
    {
        "date": "1996-04-01T00:00:00.000Z",
        "value": 0.38
    },
    {
        "date": "1996-05-01T00:00:00.000Z",
        "value": 0.3
    },
    {
        "date": "1996-06-01T00:00:00.000Z",
        "value": 0.27
    },
    {
        "date": "1996-07-01T00:00:00.000Z",
        "value": 0.37
    },
    {
        "date": "1996-08-01T00:00:00.000Z",
        "value": 0.49
    },
    {
        "date": "1996-09-01T00:00:00.000Z",
        "value": 0.27
    },
    {
        "date": "1996-10-01T00:00:00.000Z",
        "value": 0.2
    },
    {
        "date": "1996-11-01T00:00:00.000Z",
        "value": 0.42
    },
    {
        "date": "1996-12-01T00:00:00.000Z",
        "value": 0.41
    },
    {
        "date": "1997-01-01T00:00:00.000Z",
        "value": 0.33
    },
    {
        "date": "1997-02-01T00:00:00.000Z",
        "value": 0.37
    },
    {
        "date": "1997-03-01T00:00:00.000Z",
        "value": 0.52
    },
    {
        "date": "1997-04-01T00:00:00.000Z",
        "value": 0.38
    },
    {
        "date": "1997-05-01T00:00:00.000Z",
        "value": 0.39
    },
    {
        "date": "1997-06-01T00:00:00.000Z",
        "value": 0.55
    },
    {
        "date": "1997-07-01T00:00:00.000Z",
        "value": 0.35
    },
    {
        "date": "1997-08-01T00:00:00.000Z",
        "value": 0.43
    },
    {
        "date": "1997-09-01T00:00:00.000Z",
        "value": 0.56
    },
    {
        "date": "1997-10-01T00:00:00.000Z",
        "value": 0.64
    },
    {
        "date": "1997-11-01T00:00:00.000Z",
        "value": 0.66
    },
    {
        "date": "1997-12-01T00:00:00.000Z",
        "value": 0.6
    },
    {
        "date": "1998-01-01T00:00:00.000Z",
        "value": 0.61
    },
    {
        "date": "1998-02-01T00:00:00.000Z",
        "value": 0.9
    },
    {
        "date": "1998-03-01T00:00:00.000Z",
        "value": 0.63
    },
    {
        "date": "1998-04-01T00:00:00.000Z",
        "value": 0.64
    },
    {
        "date": "1998-05-01T00:00:00.000Z",
        "value": 0.71
    },
    {
        "date": "1998-06-01T00:00:00.000Z",
        "value": 0.78
    },
    {
        "date": "1998-07-01T00:00:00.000Z",
        "value": 0.71
    },
    {
        "date": "1998-08-01T00:00:00.000Z",
        "value": 0.68
    },
    {
        "date": "1998-09-01T00:00:00.000Z",
        "value": 0.45
    },
    {
        "date": "1998-10-01T00:00:00.000Z",
        "value": 0.47
    },
    {
        "date": "1998-11-01T00:00:00.000Z",
        "value": 0.5
    },
    {
        "date": "1998-12-01T00:00:00.000Z",
        "value": 0.56
    },
    {
        "date": "1999-01-01T00:00:00.000Z",
        "value": 0.48
    },
    {
        "date": "1999-02-01T00:00:00.000Z",
        "value": 0.66
    },
    {
        "date": "1999-03-01T00:00:00.000Z",
        "value": 0.34
    },
    {
        "date": "1999-04-01T00:00:00.000Z",
        "value": 0.34
    },
    {
        "date": "1999-05-01T00:00:00.000Z",
        "value": 0.33
    },
    {
        "date": "1999-06-01T00:00:00.000Z",
        "value": 0.37
    },
    {
        "date": "1999-07-01T00:00:00.000Z",
        "value": 0.41
    },
    {
        "date": "1999-08-01T00:00:00.000Z",
        "value": 0.34
    },
    {
        "date": "1999-09-01T00:00:00.000Z",
        "value": 0.43
    },
    {
        "date": "1999-10-01T00:00:00.000Z",
        "value": 0.43
    },
    {
        "date": "1999-11-01T00:00:00.000Z",
        "value": 0.42
    },
    {
        "date": "1999-12-01T00:00:00.000Z",
        "value": 0.46
    },
    {
        "date": "2000-01-01T00:00:00.000Z",
        "value": 0.26
    },
    {
        "date": "2000-02-01T00:00:00.000Z",
        "value": 0.58
    },
    {
        "date": "2000-03-01T00:00:00.000Z",
        "value": 0.6
    },
    {
        "date": "2000-04-01T00:00:00.000Z",
        "value": 0.59
    },
    {
        "date": "2000-05-01T00:00:00.000Z",
        "value": 0.4
    },
    {
        "date": "2000-06-01T00:00:00.000Z",
        "value": 0.44
    },
    {
        "date": "2000-07-01T00:00:00.000Z",
        "value": 0.42
    },
    {
        "date": "2000-08-01T00:00:00.000Z",
        "value": 0.43
    },
    {
        "date": "2000-09-01T00:00:00.000Z",
        "value": 0.42
    },
    {
        "date": "2000-10-01T00:00:00.000Z",
        "value": 0.3
    },
    {
        "date": "2000-11-01T00:00:00.000Z",
        "value": 0.34
    },
    {
        "date": "2000-12-01T00:00:00.000Z",
        "value": 0.3
    },
    {
        "date": "2001-01-01T00:00:00.000Z",
        "value": 0.44
    },
    {
        "date": "2001-02-01T00:00:00.000Z",
        "value": 0.46
    },
    {
        "date": "2001-03-01T00:00:00.000Z",
        "value": 0.58
    },
    {
        "date": "2001-04-01T00:00:00.000Z",
        "value": 0.52
    },
    {
        "date": "2001-05-01T00:00:00.000Z",
        "value": 0.59
    },
    {
        "date": "2001-06-01T00:00:00.000Z",
        "value": 0.55
    },
    {
        "date": "2001-07-01T00:00:00.000Z",
        "value": 0.61
    },
    {
        "date": "2001-08-01T00:00:00.000Z",
        "value": 0.49
    },
    {
        "date": "2001-09-01T00:00:00.000Z",
        "value": 0.56
    },
    {
        "date": "2001-10-01T00:00:00.000Z",
        "value": 0.52
    },
    {
        "date": "2001-11-01T00:00:00.000Z",
        "value": 0.7
    },
    {
        "date": "2001-12-01T00:00:00.000Z",
        "value": 0.55
    },
    {
        "date": "2002-01-01T00:00:00.000Z",
        "value": 0.75
    },
    {
        "date": "2002-02-01T00:00:00.000Z",
        "value": 0.76
    },
    {
        "date": "2002-03-01T00:00:00.000Z",
        "value": 0.91
    },
    {
        "date": "2002-04-01T00:00:00.000Z",
        "value": 0.58
    },
    {
        "date": "2002-05-01T00:00:00.000Z",
        "value": 0.65
    },
    {
        "date": "2002-06-01T00:00:00.000Z",
        "value": 0.54
    },
    {
        "date": "2002-07-01T00:00:00.000Z",
        "value": 0.62
    },
    {
        "date": "2002-08-01T00:00:00.000Z",
        "value": 0.55
    },
    {
        "date": "2002-09-01T00:00:00.000Z",
        "value": 0.65
    },
    {
        "date": "2002-10-01T00:00:00.000Z",
        "value": 0.57
    },
    {
        "date": "2002-11-01T00:00:00.000Z",
        "value": 0.59
    },
    {
        "date": "2002-12-01T00:00:00.000Z",
        "value": 0.43
    },
    {
        "date": "2003-01-01T00:00:00.000Z",
        "value": 0.73
    },
    {
        "date": "2003-02-01T00:00:00.000Z",
        "value": 0.55
    },
    {
        "date": "2003-03-01T00:00:00.000Z",
        "value": 0.57
    },
    {
        "date": "2003-04-01T00:00:00.000Z",
        "value": 0.55
    },
    {
        "date": "2003-05-01T00:00:00.000Z",
        "value": 0.62
    },
    {
        "date": "2003-06-01T00:00:00.000Z",
        "value": 0.49
    },
    {
        "date": "2003-07-01T00:00:00.000Z",
        "value": 0.55
    },
    {
        "date": "2003-08-01T00:00:00.000Z",
        "value": 0.66
    },
    {
        "date": "2003-09-01T00:00:00.000Z",
        "value": 0.66
    },
    {
        "date": "2003-10-01T00:00:00.000Z",
        "value": 0.75
    },
    {
        "date": "2003-11-01T00:00:00.000Z",
        "value": 0.55
    },
    {
        "date": "2003-12-01T00:00:00.000Z",
        "value": 0.75
    },
    {
        "date": "2004-01-01T00:00:00.000Z",
        "value": 0.59
    },
    {
        "date": "2004-02-01T00:00:00.000Z",
        "value": 0.71
    },
    {
        "date": "2004-03-01T00:00:00.000Z",
        "value": 0.64
    },
    {
        "date": "2004-04-01T00:00:00.000Z",
        "value": 0.62
    },
    {
        "date": "2004-05-01T00:00:00.000Z",
        "value": 0.42
    },
    {
        "date": "2004-06-01T00:00:00.000Z",
        "value": 0.43
    },
    {
        "date": "2004-07-01T00:00:00.000Z",
        "value": 0.26
    },
    {
        "date": "2004-08-01T00:00:00.000Z",
        "value": 0.45
    },
    {
        "date": "2004-09-01T00:00:00.000Z",
        "value": 0.53
    },
    {
        "date": "2004-10-01T00:00:00.000Z",
        "value": 0.66
    },
    {
        "date": "2004-11-01T00:00:00.000Z",
        "value": 0.72
    },
    {
        "date": "2004-12-01T00:00:00.000Z",
        "value": 0.52
    },
    {
        "date": "2005-01-01T00:00:00.000Z",
        "value": 0.72
    },
    {
        "date": "2005-02-01T00:00:00.000Z",
        "value": 0.58
    },
    {
        "date": "2005-03-01T00:00:00.000Z",
        "value": 0.69
    },
    {
        "date": "2005-04-01T00:00:00.000Z",
        "value": 0.69
    },
    {
        "date": "2005-05-01T00:00:00.000Z",
        "value": 0.65
    },
    {
        "date": "2005-06-01T00:00:00.000Z",
        "value": 0.67
    },
    {
        "date": "2005-07-01T00:00:00.000Z",
        "value": 0.66
    },
    {
        "date": "2005-08-01T00:00:00.000Z",
        "value": 0.63
    },
    {
        "date": "2005-09-01T00:00:00.000Z",
        "value": 0.78
    },
    {
        "date": "2005-10-01T00:00:00.000Z",
        "value": 0.8
    },
    {
        "date": "2005-11-01T00:00:00.000Z",
        "value": 0.76
    },
    {
        "date": "2005-12-01T00:00:00.000Z",
        "value": 0.68
    },
    {
        "date": "2006-01-01T00:00:00.000Z",
        "value": 0.57
    },
    {
        "date": "2006-02-01T00:00:00.000Z",
        "value": 0.7
    },
    {
        "date": "2006-03-01T00:00:00.000Z",
        "value": 0.63
    },
    {
        "date": "2006-04-01T00:00:00.000Z",
        "value": 0.5
    },
    {
        "date": "2006-05-01T00:00:00.000Z",
        "value": 0.47
    },
    {
        "date": "2006-06-01T00:00:00.000Z",
        "value": 0.64
    },
    {
        "date": "2006-07-01T00:00:00.000Z",
        "value": 0.54
    },
    {
        "date": "2006-08-01T00:00:00.000Z",
        "value": 0.72
    },
    {
        "date": "2006-09-01T00:00:00.000Z",
        "value": 0.64
    },
    {
        "date": "2006-10-01T00:00:00.000Z",
        "value": 0.69
    },
    {
        "date": "2006-11-01T00:00:00.000Z",
        "value": 0.72
    },
    {
        "date": "2006-12-01T00:00:00.000Z",
        "value": 0.77
    },
    {
        "date": "2007-01-01T00:00:00.000Z",
        "value": 0.96
    },
    {
        "date": "2007-02-01T00:00:00.000Z",
        "value": 0.7
    },
    {
        "date": "2007-03-01T00:00:00.000Z",
        "value": 0.7
    },
    {
        "date": "2007-04-01T00:00:00.000Z",
        "value": 0.76
    },
    {
        "date": "2007-05-01T00:00:00.000Z",
        "value": 0.67
    },
    {
        "date": "2007-06-01T00:00:00.000Z",
        "value": 0.58
    },
    {
        "date": "2007-07-01T00:00:00.000Z",
        "value": 0.62
    },
    {
        "date": "2007-08-01T00:00:00.000Z",
        "value": 0.6
    },
    {
        "date": "2007-09-01T00:00:00.000Z",
        "value": 0.64
    },
    {
        "date": "2007-10-01T00:00:00.000Z",
        "value": 0.6
    },
    {
        "date": "2007-11-01T00:00:00.000Z",
        "value": 0.57
    },
    {
        "date": "2007-12-01T00:00:00.000Z",
        "value": 0.5
    },
    {
        "date": "2008-01-01T00:00:00.000Z",
        "value": 0.24
    },
    {
        "date": "2008-02-01T00:00:00.000Z",
        "value": 0.36
    },
    {
        "date": "2008-03-01T00:00:00.000Z",
        "value": 0.73
    },
    {
        "date": "2008-04-01T00:00:00.000Z",
        "value": 0.53
    },
    {
        "date": "2008-05-01T00:00:00.000Z",
        "value": 0.51
    },
    {
        "date": "2008-06-01T00:00:00.000Z",
        "value": 0.48
    },
    {
        "date": "2008-07-01T00:00:00.000Z",
        "value": 0.6
    },
    {
        "date": "2008-08-01T00:00:00.000Z",
        "value": 0.44
    },
    {
        "date": "2008-09-01T00:00:00.000Z",
        "value": 0.65
    },
    {
        "date": "2008-10-01T00:00:00.000Z",
        "value": 0.67
    },
    {
        "date": "2008-11-01T00:00:00.000Z",
        "value": 0.66
    },
    {
        "date": "2008-12-01T00:00:00.000Z",
        "value": 0.54
    },
    {
        "date": "2009-01-01T00:00:00.000Z",
        "value": 0.62
    },
    {
        "date": "2009-02-01T00:00:00.000Z",
        "value": 0.53
    },
    {
        "date": "2009-03-01T00:00:00.000Z",
        "value": 0.53
    },
    {
        "date": "2009-04-01T00:00:00.000Z",
        "value": 0.61
    },
    {
        "date": "2009-05-01T00:00:00.000Z",
        "value": 0.65
    },
    {
        "date": "2009-06-01T00:00:00.000Z",
        "value": 0.65
    },
    {
        "date": "2009-07-01T00:00:00.000Z",
        "value": 0.72
    },
    {
        "date": "2009-08-01T00:00:00.000Z",
        "value": 0.66
    },
    {
        "date": "2009-09-01T00:00:00.000Z",
        "value": 0.7
    },
    {
        "date": "2009-10-01T00:00:00.000Z",
        "value": 0.64
    },
    {
        "date": "2009-11-01T00:00:00.000Z",
        "value": 0.77
    },
    {
        "date": "2009-12-01T00:00:00.000Z",
        "value": 0.65
    },
    {
        "date": "2010-01-01T00:00:00.000Z",
        "value": 0.73
    },
    {
        "date": "2010-02-01T00:00:00.000Z",
        "value": 0.78
    },
    {
        "date": "2010-03-01T00:00:00.000Z",
        "value": 0.92
    },
    {
        "date": "2010-04-01T00:00:00.000Z",
        "value": 0.87
    },
    {
        "date": "2010-05-01T00:00:00.000Z",
        "value": 0.75
    },
    {
        "date": "2010-06-01T00:00:00.000Z",
        "value": 0.64
    },
    {
        "date": "2010-07-01T00:00:00.000Z",
        "value": 0.62
    },
    {
        "date": "2010-08-01T00:00:00.000Z",
        "value": 0.65
    },
    {
        "date": "2010-09-01T00:00:00.000Z",
        "value": 0.61
    },
    {
        "date": "2010-10-01T00:00:00.000Z",
        "value": 0.71
    },
    {
        "date": "2010-11-01T00:00:00.000Z",
        "value": 0.79
    },
    {
        "date": "2010-12-01T00:00:00.000Z",
        "value": 0.49
    },
    {
        "date": "2011-01-01T00:00:00.000Z",
        "value": 0.51
    },
    {
        "date": "2011-02-01T00:00:00.000Z",
        "value": 0.53
    },
    {
        "date": "2011-03-01T00:00:00.000Z",
        "value": 0.64
    },
    {
        "date": "2011-04-01T00:00:00.000Z",
        "value": 0.65
    },
    {
        "date": "2011-05-01T00:00:00.000Z",
        "value": 0.53
    },
    {
        "date": "2011-06-01T00:00:00.000Z",
        "value": 0.59
    },
    {
        "date": "2011-07-01T00:00:00.000Z",
        "value": 0.73
    },
    {
        "date": "2011-08-01T00:00:00.000Z",
        "value": 0.73
    },
    {
        "date": "2011-09-01T00:00:00.000Z",
        "value": 0.56
    },
    {
        "date": "2011-10-01T00:00:00.000Z",
        "value": 0.66
    },
    {
        "date": "2011-11-01T00:00:00.000Z",
        "value": 0.56
    },
    {
        "date": "2011-12-01T00:00:00.000Z",
        "value": 0.54
    },
    {
        "date": "2012-01-01T00:00:00.000Z",
        "value": 0.46
    },
    {
        "date": "2012-02-01T00:00:00.000Z",
        "value": 0.49
    },
    {
        "date": "2012-03-01T00:00:00.000Z",
        "value": 0.58
    },
    {
        "date": "2012-04-01T00:00:00.000Z",
        "value": 0.69
    },
    {
        "date": "2012-05-01T00:00:00.000Z",
        "value": 0.76
    },
    {
        "date": "2012-06-01T00:00:00.000Z",
        "value": 0.62
    },
    {
        "date": "2012-07-01T00:00:00.000Z",
        "value": 0.57
    },
    {
        "date": "2012-08-01T00:00:00.000Z",
        "value": 0.63
    },
    {
        "date": "2012-09-01T00:00:00.000Z",
        "value": 0.76
    },
    {
        "date": "2012-10-01T00:00:00.000Z",
        "value": 0.78
    },
    {
        "date": "2012-11-01T00:00:00.000Z",
        "value": 0.75
    },
    {
        "date": "2012-12-01T00:00:00.000Z",
        "value": 0.53
    },
    {
        "date": "2013-01-01T00:00:00.000Z",
        "value": 0.68
    },
    {
        "date": "2013-02-01T00:00:00.000Z",
        "value": 0.55
    },
    {
        "date": "2013-03-01T00:00:00.000Z",
        "value": 0.66
    },
    {
        "date": "2013-04-01T00:00:00.000Z",
        "value": 0.52
    },
    {
        "date": "2013-05-01T00:00:00.000Z",
        "value": 0.61
    },
    {
        "date": "2013-06-01T00:00:00.000Z",
        "value": 0.65
    },
    {
        "date": "2013-07-01T00:00:00.000Z",
        "value": 0.59
    },
    {
        "date": "2013-08-01T00:00:00.000Z",
        "value": 0.66
    },
    {
        "date": "2013-09-01T00:00:00.000Z",
        "value": 0.78
    },
    {
        "date": "2013-10-01T00:00:00.000Z",
        "value": 0.69
    },
    {
        "date": "2013-11-01T00:00:00.000Z",
        "value": 0.81
    },
    {
        "date": "2013-12-01T00:00:00.000Z",
        "value": 0.67
    },
    {
        "date": "2014-01-01T00:00:00.000Z",
        "value": 0.73
    },
    {
        "date": "2014-02-01T00:00:00.000Z",
        "value": 0.51
    },
    {
        "date": "2014-03-01T00:00:00.000Z",
        "value": 0.77
    },
    {
        "date": "2014-04-01T00:00:00.000Z",
        "value": 0.78
    },
    {
        "date": "2014-05-01T00:00:00.000Z",
        "value": 0.87
    },
    {
        "date": "2014-06-01T00:00:00.000Z",
        "value": 0.66
    },
    {
        "date": "2014-07-01T00:00:00.000Z",
        "value": 0.57
    },
    {
        "date": "2014-08-01T00:00:00.000Z",
        "value": 0.82
    },
    {
        "date": "2014-09-01T00:00:00.000Z",
        "value": 0.9
    },
    {
        "date": "2014-10-01T00:00:00.000Z",
        "value": 0.85
    },
    {
        "date": "2014-11-01T00:00:00.000Z",
        "value": 0.67
    },
    {
        "date": "2014-12-01T00:00:00.000Z",
        "value": 0.79
    },
    {
        "date": "2015-01-01T00:00:00.000Z",
        "value": 0.81
    },
    {
        "date": "2015-02-01T00:00:00.000Z",
        "value": 0.86
    },
    {
        "date": "2015-03-01T00:00:00.000Z",
        "value": 0.9
    },
    {
        "date": "2015-04-01T00:00:00.000Z",
        "value": 0.74
    },
    {
        "date": "2015-05-01T00:00:00.000Z",
        "value": 0.78
    },
    {
        "date": "2015-06-01T00:00:00.000Z",
        "value": 0.78
    },
    {
        "date": "2015-07-01T00:00:00.000Z",
        "value": 0.71
    },
    {
        "date": "2015-08-01T00:00:00.000Z",
        "value": 0.78
    },
    {
        "date": "2015-09-01T00:00:00.000Z",
        "value": 0.81
    },
    {
        "date": "2015-10-01T00:00:00.000Z",
        "value": 1.06
    },
    {
        "date": "2015-11-01T00:00:00.000Z",
        "value": 1.04
    },
    {
        "date": "2015-12-01T00:00:00.000Z",
        "value": 1.11
    },
    {
        "date": "2016-01-01T00:00:00.000Z",
        "value": 1.17
    },
    {
        "date": "2016-02-01T00:00:00.000Z",
        "value": 1.35
    },
    {
        "date": "2016-03-01T00:00:00.000Z",
        "value": 1.3
    },
    {
        "date": "2016-04-01T00:00:00.000Z",
        "value": 1.09
    },
    {
        "date": "2016-05-01T00:00:00.000Z",
        "value": 0.93
    },
    {
        "date": "2016-06-01T00:00:00.000Z",
        "value": 0.76
    },
    {
        "date": "2016-07-01T00:00:00.000Z",
        "value": 0.83
    },
    {
        "date": "2016-08-01T00:00:00.000Z",
        "value": 0.98
    },
    {
        "date": "2016-09-01T00:00:00.000Z",
        "value": 0.87
    },
    {
        "date": "2016-10-01T00:00:00.000Z",
        "value": 0.89
    },
    {
        "date": "2016-11-01T00:00:00.000Z",
        "value": 0.93
    },
    {
        "date": "2016-12-01T00:00:00.000Z",
        "value": 0.81
    }
];
/* harmony default export */ const data_dataPlot = (dataPlot);

;// CONCATENATED MODULE: ./src/index.ts
/**
 * Para el ejemplo ChatGPT ha generado los datos comparativos del uso de TypeScript y
 * Javascript sobre los diez años anteriores a su entrenamiento.
 */


const data = data_dataPlot;
// const encode: Encode = { x: (d) => new Date(d.date), y: 'unemployment' }  // dataLine
const src_encode = { x: (d) => new Date(d.date), y: 'value' }; // dataPlot
const container = document.querySelector('#chart');
const options = {
    axisX: 'date',
    axisY: 'unemployment',
    encode: src_encode,
};
const chart = new Chart({ container, data, options });
console.log(chart);

