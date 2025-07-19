let framequeue = [];
let startTime, now, then, elapsed;
let fps = 24;
let canvas;


self.onmessage = (event) => {
    if (event.data.code === "ATTACH") {
        canvas = event.data.canvas;
        fps = event.data.fps;
    } else {
        const data = event.data.animations;

        let lengthmax = Math.max(data.map(x => x.sprites.length * x.framecount));

        for (let i = 0; i < lengthmax; i++) {
            let framedata = []
            for (let animation of data) {
                if (i >= animation.sprites.length * animation.framecount) continue;
                framedata.push({
                    sprite: animation.sprites[i],
                    width: animation.transform.width,
                    height: animation.transform.height,
                    x: animation.position.x + animation.transform.velocity.x.v + animation.transform.velocity.x.a*i,
                    y: animation.position.y + animation.transform.velocity.y.v + animation.transform.velocity.y.a*i
                })
            }
            if (framequeue.length > i+1) framequeue[i+1].push(...framedata);
            else framequeue.push(framedata)
        }
    
        startAnimating();
    }
}

function startAnimating() {
    fpsInterval = 1000 / fps;
    then = Date.now();
    startTime = then;
    animate();
}

function animate() {
    const ctx = canvas.getContext('2d');
    if (framequeue.length === 0) {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
        return;
    }
    
    requestAnimationFrame(animate);
    now = Date.now();
    elapsed = now - then;
    if (elapsed > fpsInterval) {
        then = now - (elapsed % fpsInterval);
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
        for (let item of framequeue[0]) {
            ctx.drawImage(item.sprite, item.x, item.y, item.width, item.height)
        }
        framequeue = framequeue.slice(1);
    }
}
