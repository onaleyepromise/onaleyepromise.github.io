import { dialogueData, scaleFactor } from "./constants.js";
import { k } from "./kaboomCtx.js";
import { displayDialogue, setCamScale } from "./utils.js";
let keyFound = false;
k.loadSprite("spritesheet", "./assets/spritesheet.png", {
    sliceX: 39,
    sliceY: 31,
    anims: {
        "idle-down": 936,
        "walk-down": {from: 936, to: 939, loop: true, speed: 8},
        "idle-side": 975,
        "walk-side": {from: 975, to: 978, loop: true, speed: 8},
        "idle-up": 1014,
        "walk-up": {from: 1014, to: 1017, loop: true, speed: 8},
        "key": 99
    }
});

k.loadSprite("map", "./assets/portfolio.png");

k.setBackground(k.Color.fromHex("#232333"));

k.scene("main", async () => {
  
    k.onResize(() => {
        setCamScale(k);
    })
    const mapData = await ((await fetch("./assets/portfolio.json")).json());
    const layers = mapData.layers;
    console.log(layers)

    const map = k.add([
        k.sprite("map"),
        k.pos(0),
        k.scale(scaleFactor)
    ]);

    const player = k.make([
        k.sprite("spritesheet", {anim: "idle-down"}),
        k.area({
            shape: new k.Rect(new k.Vec2(0, 3), 10, 10)
        }),
        k.body(),
        k.anchor("center"),
        k.pos(),
        k.scale(scaleFactor),
        {
            speed: 150,
            direction: "down",
            isInDialogue: false,
        },
        "player"
    ]);

    const key = k.make([
        k.sprite("spritesheet", {anim: "key"}),
        k.area({
            shape: new k.Rect(new k.Vec2(0, 3), 10, 10)
        }),
        k.body(),
        k.anchor("center"),
        k.pos(),
        k.scale(scaleFactor),
        "key"
    ]);

    for (const layer of layers){
        if(layer.name === "blocks"){
            for(const boundary of layer.objects){
                map.add([
                    k.area({
                        shape: new k.Rect(new k.vec2(0), boundary.width, boundary.height)
                    }),
                    k.body({ isStatic: true }),
                    k.pos(boundary.x, boundary.y),
                    boundary.name
                ]);

                if(boundary.name){
                    player.onCollide(boundary.name, () => {
                        player.isInDialogue = true;
                        // TODO
                        if(boundary.name === "game-premium"){
                            if(keyFound) {
                                displayDialogue(dialogueData[boundary.name], () => {player.isInDialogue = false})
                            } else {
                                player.isInDialogue = false;
                                return;
                            }
                        }
                        displayDialogue(dialogueData[boundary.name], () => {player.isInDialogue = false});
                    });
                }
            }
            continue;
        }

        if(layer.name === "spawnpoints"){
            for(const entity of layer.objects){
                if(entity.name === "player"){
                    player.pos = new k.Vec2(
                        (map.pos.x + entity.x) * scaleFactor,
                        (map.pos.y + entity.y) * scaleFactor
                    );
                    k.add(player);
                    continue;
                } 
                if(entity.name === 'key'){
                    key.pos = new k.Vec2(
                        (map.pos.x + entity.x) * scaleFactor,
                        (map.pos.y + entity.y) * scaleFactor
                    );
                    k.add(key);

                    continue;
                }
            }
        }
    }
    player.onCollide("key", () => {
        player.isInDialogue = true;
        // TODO
        displayDialogue(dialogueData["key"], () => {player.isInDialogue = false});
        key.destroy()
        keyFound = true;
    })

    setCamScale(k);

    k.onUpdate(() => {
       k.camPos(player.worldPos().x, player.worldPos().y + 100)
    });

    k.onMouseDown((mouseBtn) => {
        if(mouseBtn !== "left" || player.isInDialogue) return;

        const worldMousePos = k.toWorld(k.mousePos());
        player.moveTo(worldMousePos, player.speed);

        const mouseAngle = player.pos.angle(worldMousePos);

        const lowerBound = 50;
        const upperBound = 125;

        if(
            mouseAngle > lowerBound &&
            mouseAngle < upperBound &&
            player.curAnim() !== "walk-up"
        ){
            player.play("walk-up");
            player.direction = "up";
            return;
        }
        if(
            mouseAngle < -lowerBound &&
            mouseAngle > -upperBound &&
            player.curAnim() !== "walk-down"
        ){
            player.play("walk-down");
            player.direction = "down";
            return;
        }
        if(Math.abs(mouseAngle) > upperBound){
            player.flipX = false;
            if(player.curAnim()  !== "walk-side") player.play("walk-side");
            player.direction = "right";
            return;
        }
        if(Math.abs(mouseAngle) < lowerBound){
            player.flipX = true;
            if(player.curAnim()  !== "walk-side") player.play("walk-side");
            player.direction = "left";
            return;
        }
    });
    k.onMouseRelease( () => {
            if(player.direction === "up"){
                player.play("idle-up");
                return;
            }
            if(player.direction === "down"){
                player.play("idle-down");
                return;
            }
            player.play("idle-side");
            }
    );

});

k.go("main");