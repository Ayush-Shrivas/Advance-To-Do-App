class Grad {
    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    dot2(x, y) {
        return this.x * x + this.y * y;
    }
}

class Noise {
    constructor(seed = 0) {
        this.grad3 = [
            new Grad(1, 1, 0),
            new Grad(-1, 1, 0),
            new Grad(1, -1, 0),
            new Grad(-1, -1, 0),
            new Grad(1, 0, 1),
            new Grad(-1, 0, 1),
            new Grad(1, 0, -1),
            new Grad(-1, 0, -1),
            new Grad(0, 1, 1),
            new Grad(0, -1, 1),
            new Grad(0, 1, -1),
            new Grad(0, -1, -1)
        ];
        this.p = [
            151, 160, 137, 91, 90, 15, 131, 13, 201, 95, 96, 53, 194, 233, 7, 225, 140, 36, 103, 30, 69, 142, 8, 99, 37, 240,
            21, 10, 23, 190, 6, 148, 247, 120, 234, 75, 0, 26, 197, 62, 94, 252, 219, 203, 117, 35, 11, 32, 57, 177, 33, 88,
            237, 149, 56, 87, 174, 20, 125, 136, 171, 168, 68, 175, 74, 165, 71, 134, 139, 48, 27, 166, 77, 146, 158, 231, 83,
            111, 229, 122, 60, 211, 133, 230, 220, 105, 92, 41, 55, 46, 245, 40, 244, 102, 143, 54, 65, 25, 63, 161, 1, 216,
            80, 73, 209, 76, 132, 187, 208, 89, 18, 169, 200, 196, 135, 130, 116, 188, 159, 86, 164, 100, 109, 198, 173, 186,
            3, 64, 52, 217, 226, 250, 124, 123, 5, 202, 38, 147, 118, 126, 255, 82, 85, 212, 207, 206, 59, 227, 47, 16, 58,
            17, 182, 189, 28, 42, 223, 183, 170, 213, 119, 248, 152, 2, 44, 154, 163, 70, 221, 153, 101, 155, 167, 43, 172, 9,
            129, 22, 39, 253, 19, 98, 108, 110, 79, 113, 224, 232, 178, 185, 112, 104, 218, 246, 97, 228, 251, 34, 242, 193,
            238, 210, 144, 12, 191, 179, 162, 241, 81, 51, 145, 235, 249, 14, 239, 107, 49, 192, 214, 31, 181, 199, 106, 157,
            184, 84, 204, 176, 115, 121, 50, 45, 127, 4, 150, 254, 138, 236, 205, 93, 222, 114, 67, 29, 24, 72, 243, 141, 128,
            195, 78, 66, 215, 61, 156, 180
        ];
        this.perm = new Array(512);
        this.gradP = new Array(512);
        this.seed(seed);
    }

    seed(seed) {
        let currentSeed = seed;

        if (currentSeed > 0 && currentSeed < 1) {
            currentSeed *= 65536;
        }

        currentSeed = Math.floor(currentSeed);

        if (currentSeed < 256) {
            currentSeed |= currentSeed << 8;
        }

        for (let index = 0; index < 256; index += 1) {
            const value = index & 1
                ? this.p[index] ^ (currentSeed & 255)
                : this.p[index] ^ ((currentSeed >> 8) & 255);

            this.perm[index] = this.perm[index + 256] = value;
            this.gradP[index] = this.gradP[index + 256] = this.grad3[value % 12];
        }
    }

    fade(t) {
        return t * t * t * (t * (t * 6 - 15) + 10);
    }

    lerp(a, b, t) {
        return (1 - t) * a + t * b;
    }

    perlin2(x, y) {
        let currentX = x;
        let currentY = y;
        let cellX = Math.floor(currentX);
        let cellY = Math.floor(currentY);

        currentX -= cellX;
        currentY -= cellY;
        cellX &= 255;
        cellY &= 255;

        const n00 = this.gradP[cellX + this.perm[cellY]].dot2(currentX, currentY);
        const n01 = this.gradP[cellX + this.perm[cellY + 1]].dot2(currentX, currentY - 1);
        const n10 = this.gradP[cellX + 1 + this.perm[cellY]].dot2(currentX - 1, currentY);
        const n11 = this.gradP[cellX + 1 + this.perm[cellY + 1]].dot2(currentX - 1, currentY - 1);
        const fadeX = this.fade(currentX);

        return this.lerp(
            this.lerp(n00, n10, fadeX),
            this.lerp(n01, n11, fadeX),
            this.fade(currentY)
        );
    }
}

export const initInteractiveWaves = ({
    selector = '#interactive-waves',
    lineColor = getComputedStyle(document.documentElement).getPropertyValue('--wave-line-color').trim() || 'rgba(52, 152, 219, 0.2)',
    waveSpeedX = 0.014,
    waveSpeedY = 0.006,
    waveAmpX = 28,
    waveAmpY = 14,
    friction = 0.92,
    tension = 0.006,
    maxCursorMove = 90,
    xGap = 14,
    yGap = 34
} = {}) => {
    const container = document.querySelector(selector);

    if (!container) {
        return () => {};
    }

    const canvas = document.createElement('canvas');
    canvas.className = 'interactive-waves__canvas';

    const overlay = document.createElement('div');
    overlay.className = 'interactive-waves__overlay';

    const dot = document.createElement('div');
    dot.className = 'interactive-waves__dot';

    overlay.appendChild(dot);
    container.replaceChildren(canvas, overlay);

    const ctx = canvas.getContext('2d');

    if (!ctx) {
        return () => {};
    }

    const config = {
        lineColor,
        waveSpeedX,
        waveSpeedY,
        waveAmpX,
        waveAmpY,
        friction,
        tension,
        maxCursorMove,
        xGap,
        yGap
    };

    const bounds = {
        width: 0,
        height: 0,
        left: 0,
        top: 0
    };

    const noise = new Noise(Math.random());
    const lines = [];
    let frameId = null;

    const mouse = {
        x: -10,
        y: -10,
        lx: -10,
        ly: -10,
        sx: -10,
        sy: -10,
        v: 0,
        vs: 0,
        a: 0,
        set: false
    };

    const setSize = () => {
        const rect = container.getBoundingClientRect();
        const dpr = window.devicePixelRatio || 1;

        bounds.width = rect.width;
        bounds.height = rect.height;
        bounds.left = rect.left;
        bounds.top = rect.top;

        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const setLines = () => {
        lines.length = 0;

        const overflowWidth = bounds.width + 200;
        const overflowHeight = bounds.height + 30;
        const totalLines = Math.ceil(overflowWidth / config.xGap);
        const totalPoints = Math.ceil(overflowHeight / config.yGap);
        const xStart = (bounds.width - config.xGap * totalLines) / 2;
        const yStart = (bounds.height - config.yGap * totalPoints) / 2;

        for (let lineIndex = 0; lineIndex <= totalLines; lineIndex += 1) {
            const points = [];

            for (let pointIndex = 0; pointIndex <= totalPoints; pointIndex += 1) {
                points.push({
                    x: xStart + config.xGap * lineIndex,
                    y: yStart + config.yGap * pointIndex,
                    wave: { x: 0, y: 0 },
                    cursor: { x: 0, y: 0, vx: 0, vy: 0 }
                });
            }

            lines.push(points);
        }
    };

    const movePointSet = (time) => {
        lines.forEach((points) => {
            points.forEach((point) => {
                const motion = noise.perlin2(
                    (point.x + time * config.waveSpeedX) * 0.002,
                    (point.y + time * config.waveSpeedY) * 0.0015
                ) * 12;

                point.wave.x = Math.cos(motion) * config.waveAmpX;
                point.wave.y = Math.sin(motion) * config.waveAmpY;

                const dx = point.x - mouse.sx;
                const dy = point.y - mouse.sy;
                const distance = Math.hypot(dx, dy);
                const influence = Math.max(175, mouse.vs);

                if (distance < influence) {
                    const strength = 1 - distance / influence;
                    const force = Math.cos(distance * 0.001) * strength;

                    point.cursor.vx += Math.cos(mouse.a) * force * influence * mouse.vs * 0.00065;
                    point.cursor.vy += Math.sin(mouse.a) * force * influence * mouse.vs * 0.00065;
                }

                point.cursor.vx += (0 - point.cursor.x) * config.tension;
                point.cursor.vy += (0 - point.cursor.y) * config.tension;
                point.cursor.vx *= config.friction;
                point.cursor.vy *= config.friction;
                point.cursor.x += point.cursor.vx * 2;
                point.cursor.y += point.cursor.vy * 2;

                point.cursor.x = Math.min(config.maxCursorMove, Math.max(-config.maxCursorMove, point.cursor.x));
                point.cursor.y = Math.min(config.maxCursorMove, Math.max(-config.maxCursorMove, point.cursor.y));
            });
        });
    };

    const moved = (point, withCursor = true) => ({
        x: Math.round((point.x + point.wave.x + (withCursor ? point.cursor.x : 0)) * 10) / 10,
        y: Math.round((point.y + point.wave.y + (withCursor ? point.cursor.y : 0)) * 10) / 10
    });

    const drawLines = () => {
        ctx.clearRect(0, 0, bounds.width, bounds.height);
        ctx.beginPath();
        ctx.strokeStyle = config.lineColor;
        ctx.lineWidth = 1;

        lines.forEach((points) => {
            let current = moved(points[0], false);
            ctx.moveTo(current.x, current.y);

            points.forEach((point, index) => {
                const isLast = index === points.length - 1;

                current = moved(point, !isLast);

                const nextPoint = moved(points[index + 1] || points[points.length - 1], !isLast);
                ctx.lineTo(current.x, current.y);

                if (isLast) {
                    ctx.moveTo(nextPoint.x, nextPoint.y);
                }
            });
        });

        ctx.stroke();
    };

    const syncDot = () => {
        container.style.setProperty('--x', `${mouse.sx}px`);
        container.style.setProperty('--y', `${mouse.sy}px`);
    };

    const tick = (time) => {
        mouse.sx += (mouse.x - mouse.sx) * 0.1;
        mouse.sy += (mouse.y - mouse.sy) * 0.1;

        const dx = mouse.x - mouse.lx;
        const dy = mouse.y - mouse.ly;
        const distance = Math.hypot(dx, dy);

        mouse.v = distance;
        mouse.vs += (distance - mouse.vs) * 0.1;
        mouse.vs = Math.min(100, mouse.vs);
        mouse.lx = mouse.x;
        mouse.ly = mouse.y;
        mouse.a = Math.atan2(dy, dx);

        syncDot();
        movePointSet(time);
        drawLines();
        frameId = window.requestAnimationFrame(tick);
    };

    const updateMouse = (clientX, clientY) => {
        mouse.x = clientX - bounds.left;
        mouse.y = clientY - bounds.top;

        if (!mouse.set) {
            mouse.sx = mouse.x;
            mouse.sy = mouse.y;
            mouse.lx = mouse.x;
            mouse.ly = mouse.y;
            mouse.set = true;
        }
    };

    const onResize = () => {
        setSize();
        setLines();
    };

    const onMouseMove = (event) => {
        updateMouse(event.clientX, event.clientY);
    };

    const onTouchMove = (event) => {
        const touch = event.touches[0];

        if (!touch) {
            return;
        }

        updateMouse(touch.clientX, touch.clientY);
    };

    const onVisibilityChange = () => {
        if (document.hidden && frameId !== null) {
            window.cancelAnimationFrame(frameId);
            frameId = null;
            return;
        }

        if (!document.hidden && frameId === null) {
            frameId = window.requestAnimationFrame(tick);
        }
    };

    onResize();
    syncDot();
    frameId = window.requestAnimationFrame(tick);

    window.addEventListener('resize', onResize);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    document.addEventListener('visibilitychange', onVisibilityChange);

    return () => {
        window.removeEventListener('resize', onResize);
        window.removeEventListener('mousemove', onMouseMove);
        window.removeEventListener('touchmove', onTouchMove);
        document.removeEventListener('visibilitychange', onVisibilityChange);

        if (frameId !== null) {
            window.cancelAnimationFrame(frameId);
        }
    };
};
