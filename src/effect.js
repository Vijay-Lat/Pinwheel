const getLocationsWithColor = (imgData, color) => {
    const locations = [];

    for (let i = 0; i < imgData.data.length; i += 4) {
        const pColor = {
            r: imgData.data[i],
            g: imgData.data[i + 1],
            b: imgData.data[i + 2]
        }
        const pIndex = i / 4;
        const loc = {
            x: Math.floor(pIndex % imgData.width),
            y: Math.floor(pIndex % imgData.height)
        }
        if (colorMatch(pColor, color)) {
            locations.push(loc);
        }

    }

    return locations;


}

const colorMatch = (c1, c2) => {
    return distance(c1, c2) < 170 ** 2;
}

const distance = (c1, c2) => {
    return ((c1.r - c2.r) ** 2) + ((c1.g - c2.g) ** 2) + ((c1.b - c2.b) ** 2)
}

const average = (locs) => {
    const res = { x: 0, y: 0 };
    locs.forEach(loc => {
        res.x += loc.x;
        res.y += loc.y;

    })
    res.x /= locs.length;
    res.y /= locs.length;


    return res;

}

export class Effect {
    constructor(canvas, video) {
        this.canvas = canvas;
        this.video = video;
        this.ctx = canvas.getContext("2d");
        this.pinWheel = new PinWheel();
        this.#animate();
    }
    #animate() {
        const { ctx, canvas, video } = this;
        ctx.drawImage(video, 0, 0, window.innerWidth, window.innerHeight - 100);
        const imageData = ctx.getImageData(0, 0, window.innerWidth, window.innerHeight - 100);
        const locs = getLocationsWithColor(imageData, { r: 0, g: 0, b: 255 })
        // ctx.fillStyle = "yellow";
        locs.forEach((loc) => {
            // ctx.font = "30px Comic Sans MS";
            // ctx.fillText("hello", loc.x, loc.y)
            // ctx.fillRect(loc.x, loc.y, 1, 1)
        })
        if (locs?.length > 0) {
            const center = average(locs);
            ctx.beginPath();
            // ctx.fillStyle = "red";
            ctx.arc(center.x, center.y, 5, 0, Math.PI * 2);
            // ctx.fill();
            const size = Math.sqrt(locs.length) * 5;
            this.pinWheel.update(ctx, center, size);
        }
        requestAnimationFrame(this.#animate.bind(this));

    }
}

class PinWheel {
    constructor() {
        this.x = null;
        this.y = null;
        this.size = null;
        this.speed = 0;
        this.angle = 0;
    }
    update(ctx, center, size) {
        this.x = center.x;
        this.y = center.y;
        if (this.size) {
            const diff = size - this.size;
            const push = diff * 0.003;
            this.speed += push;
        }
        this.size = size;
        this.angle += this.speed;
        this.speed *= 0.99;
        this.#drawPart(ctx, "orange", this.angle);
        this.#drawPart(ctx, "pink", this.angle + Math.PI / 2);
        this.#drawPart(ctx, "skyblue", this.angle + Math.PI);
        this.#drawPart(ctx, "seagreen", this.angle - Math.PI / 2);
    }
    #drawPart(ctx, color, angle) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(angle);
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(0, -this.size / 2);
        ctx.lineTo(this.size / 4, -this.size / 4);
        ctx.lineTo(this.size / 4, 0);
        ctx.closePath();
        ctx.fillStyle = color;
        // ctx.font = "30px Comic Sans MS";
        // ctx.fillText("hello", this.x / 2, this.y / 2)
        ctx.fill();
        ctx.stroke();
        ctx.restore();
    }
}