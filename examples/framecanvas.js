"use strict";
var AnimationType;
(function (AnimationType) {
    AnimationType[AnimationType["Static"] = 0] = "Static";
    AnimationType[AnimationType["Dynamic"] = 1] = "Dynamic";
})(AnimationType || (AnimationType = {}));
class AnimationController {
    constructor(canvasId, fps = 24) {
        this.canvasId = canvasId;
        this.fps = fps;
        const canvas = document.getElementById(canvasId);
        this.canvas = canvas.transferControlToOffscreen();
        this.worker = new Worker("./AnimationWorker.js");
        this.worker.postMessage({ code: "ATTACH", canvas: this.canvas, fps: fps }, [this.canvas]);
    }
    /**
     * Returns a promise
     */
    spliceSheet(sheet, x, y, height, width) {
        let spritesheet = new Image();
        spritesheet.src = sheet;
        return new Promise((resolve) => {
            spritesheet.onload = () => {
                let sprites = [];
                for (let i = 0; i < y; i++)
                    for (let j = 0; j < x; j++)
                        sprites.push(createImageBitmap(spritesheet, j * width, i * height, width, height));
                Promise.all(sprites).then(sprite => resolve(sprite));
            };
        });
    }
    runAnimation(animations, fps = 30) {
        this.worker.postMessage({ animations: animations }, []);
    }
}

