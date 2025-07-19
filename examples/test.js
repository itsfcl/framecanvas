let controller;
window.onload = () => {
    controller = new AnimationController("canvas");
}

function spam() {
    let rand1 = Math.floor(Math.random()*50)+1;
    let rand2 = Math.floor(Math.random()*50)+1
    controller.spliceSheet("slashsheet.png", 6, 3, 230, 230).then((sprites) => {
        controller.runAnimation([{
            sprites: sprites,
            type: AnimationType.Dynamic,
            position: { x: rand1*100, y: rand2*100 },
            transform: {
                width: 1600,
                height: 1600,
                velocity: {
                    x: {
                        v: 100,
                        a: 10
                    },
                    y: {
                        v: 50,
                        a: 5
                    }
                }
            },
            framecount: 1
        }]);
    });
}