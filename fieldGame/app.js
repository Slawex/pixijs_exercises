let type = "WebGL";
if (!PIXI.utils.isWebGLSupported()) {
    type = "canvas";
}

let Application = PIXI.Application,
    //loader = PIXI.loader,
    resources = PIXI.loader.resources,
    Sprite = PIXI.Sprite,
    Container = PIXI.Container,
    Graphics = PIXI.Graphics,
    Text = PIXI.Text,
    TextStyle = PIXI.TextStyle,
    AnimatedSprite = PIXI.extras.AnimatedSprite,
    Rectangle = PIXI.Rectangle;

let app = new Application({
    width: 1024,
    height: 1024,
    antialias: true,
    transparent: false,
    resolution: 1
});

let b = new Bump(PIXI);
let charm = new Charm(PIXI);
//let CustomLoader = require("./Loader.js");

document.body.append(app.view);

let loader = new MainLoader(PIXI.loader);
loader.load(setup);

let fennekin, grassField, mainScene, animated_sprite, field_elems, fires, fire_speed,
    healthBar, pokeballs, last_time_hit, explosionFrames, pokeballsToAdd, speed, direction,
    rocks, woods, rockFrames, woodFrames, rocksCount, woodsCount;

function setup() {

    mainScene = new Container();
    app.stage.addChild(mainScene);

    grassField = new Sprite(resources["grass_field.png"].texture);
    mainScene.addChild(grassField);

    field_elems = resources["field_elems.json"].textures;

    fennekin = new Character("fennekin",
        { x: randomInt(0, app.stage.width - 32), y: randomInt(0, app.stage.height - 34) },
        field_elems, mainScene, app);
    mainScene.addChild(fennekin.animatedSprite);

    explosionFrames = [];
    let explosionTexture = resources["explosion.png"].texture;
    for (let i = 0; i < 5; i++) {
        for (let j = 0; j < 5; j++) {
            var texture = new PIXI.Texture(explosionTexture,
                new Rectangle(i * 32, j * 32, 32, 32));
            explosionFrames.push(texture);
        }
    }

    rocks = [];
    rockFrames = [];
    let rockTexture = resources["../helper_images/doom_set.png"].texture;
    for (let i = 0; i < 4; i++) {
        var texture = new PIXI.Texture(rockTexture,
            new Rectangle(i * 32, 0, 32, 32));
        rockFrames.push(texture);
    }

    let numOfXSections = Math.floor(app.stage.width / 32),
        numOfYSections = Math.floor(app.stage.height / 32);

    rocksCount = 75;
    for (let i = 0; i < rocksCount; i++) {

        let rock = new AnimatedSprite(rockFrames);
        let randomXSection = randomInt(0, 63);
        let randomYSection = randomInt(0, 63);
        let rockX = randomXSection * 32;
        let rockY = randomYSection * 32;

        if (distance(rockX, rockY, fennekin.animatedSprite.x, fennekin.animatedSprite.y) < Math.sqrt(32 * 32 + 32 * 32)) {
            if (rockX - 32 > 0 & rockY - 32 > 0) {
                rockX -= 32;
                rockY -= 32;
            } else {
                rockX += 32;
                rockY += 32;
            }
        }

        rock.x = rockX;
        rock.y = rockY;
        rock.hitCounter = 0;
        mainScene.addChild(rock);
        rocks.push(rock);
    }

    woods = [];
    woodFrames = [];
    let woodTexture = resources["../helper_images/wood_set.png"].texture;
    for (let i = 0; i < 3; i++) {
        var texture = new PIXI.Texture(woodTexture,
            new Rectangle(i * 32, 0, 32, 32));
        woodFrames.push(texture);
    }

    //explosion = new AnimatedSprite(explosionFrames);

    healthBar = new Container();
    healthBar.position.set(fennekin.animatedSprite.x - fennekin.width / 2, fennekin.animatedSprite.y - 20);
    mainScene.addChild(healthBar);

    let innerBar = new Graphics();
    innerBar.beginFill(0x000000);
    innerBar.drawRect(0, 0, fennekin.width + 5, 4);
    innerBar.endFill();
    healthBar.addChild(innerBar);

    let outerBar = new Graphics();
    outerBar.beginFill(0xFF3300);
    outerBar.drawRect(0, 0, fennekin.width + 5, 4);
    outerBar.endFill();
    healthBar.addChild(outerBar);
    healthBar.outer = outerBar;



    let initialNumberOfPokeballs = 10;
    speed = 3;
    direction = 1;

    pokeballs = [];

    for (let i = 0; i < initialNumberOfPokeballs; i++) {
        let pokeball = new Sprite(field_elems["pokeball_pink_32x32.png"]);
        pokeball.x = randomInt(0, app.stage.width - 32);
        pokeball.y = randomInt(0, app.stage.height - 32);
        pokeball.circular = true;
        pokeball.vx = speed * direction;
        pokeball.vy = speed * direction;

        direction *= -1;
        pokeballs.push(pokeball);
        mainScene.addChild(pokeball);
    }

    pokeballsToAdd = 1;

    let left = Keyboard(37),
        up = Keyboard(38),
        right = Keyboard(39),
        down = Keyboard(40);

    left.press = () => {
        fennekin.vx = -5;
        fennekin.vy = 0;
    };

    left.release = () => {
        if (!right.isDown && fennekin.vy === 0) {
            fennekin.vx = 0;
        }
    };

    up.press = () => {
        fennekin.vx = 0;
        fennekin.vy = -5;
    };

    up.release = () => {
        if (!down.isDown && fennekin.vx === 0) {
            fennekin.vy = 0;
        }
    }


    right.press = () => {
        fennekin.vx = 5;
        fennekin.vy = 0;
    };

    right.release = () => {
        if (!left.isDown && fennekin.vy === 0) {
            fennekin.vx = 0;
        }
    };

    down.press = () => {
        fennekin.vx = 0;
        fennekin.vy = 5;
    };

    down.release = () => {
        if (!up.isDown && fennekin.vx === 0) {
            fennekin.vy = 0;
        }
    };

    fires = [];

    window.addEventListener("mousedown", function (event) {
        let fireBullet = fennekin.shoot();
        mainScene.addChild(fireBullet.sprite);
        fires.push(fireBullet);
        //shoot(event);
    });

    state = play;
    app.ticker.add(delta => gameLoop(delta));
}

function gameLoop(delta) {
    state(delta);
}

function play(delta) {

    fennekin.changePositionBy(fennekin.vx, fennekin.vy);

    b.contain(fennekin.animatedSprite, { x: 32, y: 34, width: 2033, height: 2032 });

    pokeballs.forEach(function (pokeball) {
        pokeball.x += pokeball.vx;
        pokeball.y += pokeball.vy;

        b.contain(pokeball, { x: 32, y: 16, width: 2033, height: 2048 }, true);
    });

    let firesForRemoval = [];

    for (let i = 0; i < fires.length; i++) {
        fires[i].changePositionBy(Math.cos(fires[i].rotation) * fires[i].fireSpeed,
            Math.sin(fires[i].rotation) * fires[i].fireSpeed);
        // fires[i].position.x += Math.cos(fires[i].rotation) * fires[i].fireSpeed;
        // fires[i].position.y += Math.sin(fires[i].rotation) * fires[i].fireSpeed;

        if (fires[i].sprite.y < 0 || fires[i].sprite.x < 0 ||
            fires[i].sprite.y > app.stage.height || fires[i].sprite.x > app.stage.width) {
            firesForRemoval.push(i);
        }
    }

    let isFennekinHit = false;
    let hittedPokeballsIndexes = [];

    for (let i = 0; i < pokeballs.length; i++) {
        for (let j = i + 1; j < pokeballs.length; j++) {

            b.movingCircleCollision(pokeballs[i], pokeballs[j], true, true)
        }

        if (b.hitTestCircleRectangle(pokeballs[i], fennekin.animatedSprite)) {
            isFennekinHit = true;
        }

        for (let f = 0; f < fires.length; f++) {
            if (b.hitTestCircleRectangle(pokeballs[i], fires[f].sprite)) {
                firesForRemoval.push(f);
                hittedPokeballsIndexes.push(i);

            }
        }

        for (let r = 0; r < rocks.length; r++) {
            b.circleRectangleCollision(pokeballs[i], rocks[r], true);
        }
    }

    hittedPokeballsIndexes.forEach(function (pokeballIndex) {
        let explosion = new AnimatedSprite(explosionFrames);
        explosion.x = pokeballs[pokeballIndex].x;
        explosion.y = pokeballs[pokeballIndex].y;
        explosion.animationSpeed = 0.5;
        explosion.loop = false;
        explosion.play();
        mainScene.addChild(explosion);

        mainScene.removeChild(pokeballs[pokeballIndex]);
        pokeballs.splice(pokeballIndex, 1);

        //if (pokeballs.length > 25) return;

        for (let i = 0; i < pokeballsToAdd; i++) {
            var pokeball = new Sprite(field_elems["pokeball_pink_32x32.png"]);
            pokeball.x = randomInt(0, app.stage.width - 32);
            pokeball.y = randomInt(0, app.stage.height - 32);
            pokeball.circular = true;
            pokeball.vx = speed * direction;
            pokeball.vy = speed * direction;
            direction *= -1;
            pokeballs.push(pokeball);
            mainScene.addChild(pokeball);
        }
    });

    if (!last_time_hit || Math.floor(Date.now() / 1000) - last_time_hit >= 3) {
        fennekin.animatedSprite.alpha = 1;
    } else {
        isFennekinHit = false;
        charm.update();
    }

    if (isFennekinHit) {
        if (!last_time_hit) {
            charm.pulse(fennekin.animatedSprite, 10, 0.5);
        }

        healthBar.outer.width -= 10;
        last_time_hit = Math.floor(Date.now() / 1000);
        charm.update();
    }

    for (let i = 0; i < rocks.length; i++) {
        b.rectangleCollision(fennekin.animatedSprite, rocks[i]);
        //fennekin will be able to move the rocks if:
        //b.rectangleCollision(rocks[i], fennekin);
    }

    let rocksForRemoval = [];

    for (let f = 0; f < fires.length; f++) {
        for (let r = 0; r < rocks.length; r++) {

            if (b.hitTestRectangle(fires[f].sprite, rocks[r])) {
                firesForRemoval.push(f);
                if (!rocks[r].hitCounter) {
                    rocks[r].gotoAndStop(++rocks[r].hitCounter);
                } else if (rocks[r].hitCounter == 1 || rocks[r].hitCounter == 2) {
                    rocks[r].gotoAndStop(++rocks[r].hitCounter);
                } else {
                    let explosion = new AnimatedSprite(explosionFrames);
                    explosion.x = rocks[r].x;
                    explosion.y = rocks[r].y;
                    explosion.animationSpeed = 0.5;
                    explosion.loop = false;
                    explosion.play();
                    mainScene.addChild(explosion);
                    rocksForRemoval.push(r);
                }
            }
        }
    }

    firesForRemoval.forEach(fire => {
        if(fires[fire] !== undefined) {
            mainScene.removeChild(fires[fire].sprite);
        }

        fires.splice(fire, 1);
    });



    rocksForRemoval.forEach(index => {
        mainScene.removeChild(rocks[index]);
        rocks.splice(index, 1);
    });

    healthBar.position.set(fennekin.animatedSprite.x - fennekin.width / 2, fennekin.animatedSprite.y - 20);
    mainScene.pivot.x = fennekin.animatedSprite.x;
    mainScene.pivot.y = fennekin.animatedSprite.y;
    mainScene.position.x = app.renderer.width / 2;
    mainScene.position.y = app.renderer.height / 2;

    if (fennekin.vx < 0) {
        fennekin.changeSpriteByDirection("left");
    } else if (fennekin.vx > 0) {
        fennekin.changeSpriteByDirection("right");
    } else if (fennekin.vy > 0) {
        fennekin.changeSpriteByDirection("down");
    } else if (fennekin.vy < 0) {
        fennekin.changeSpriteByDirection("up");
    }
}