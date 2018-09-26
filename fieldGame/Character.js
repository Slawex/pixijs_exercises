class Character {
    constructor(name, position, texturesResource, mainScene, app) {
        this.name = name;
        this.vx = 0;
        this.vy = 0;
        this.directions = ["left", "up", "right", "down"];
        this.app = app;
        this.texturesResource = texturesResource;
        this.mainScene = mainScene;

        var animationFrames = [];

        animationFrames.push(this.texturesResource[name + "_left.png"]);
        animationFrames.push(this.texturesResource[name + "_up.png"]);
        animationFrames.push(this.texturesResource[name + "_right.png"]);
        animationFrames.push(this.texturesResource[name + "_down.png"]);

        this.animatedSprite = new AnimatedSprite(animationFrames);
        this.animatedSprite.x = position.x;
        this.animatedSprite.y = position.y;
        this.animatedSprite.anchor.x = 0.5;
        this.animatedSprite.anchor.y = 0.5;

        this.width = this.animatedSprite.width;
        this.height = this.animatedSprite.height;
    }

    changePositionBy(dx, dy) {
        this.animatedSprite.x += dx;
        this.animatedSprite.y += dy;
    }

    changeSpriteByDirection(dir) {
        var index = this.directions.indexOf(dir);
        if (index !== -1) {
            this.animatedSprite.gotoAndStop(index);
        } else {
            this.animatedSprite.gotoAndStop(0);
        }
    }

    shoot() {
        var rotation = this.rotateToMousePoint();
        var fireBullet = new FireBullet("fire_right.png", {
            x: this.animatedSprite.x + Math.cos(rotation) * 5,
            y: this.animatedSprite.y + Math.sin(rotation) * 5
        }, rotation, this.texturesResource);
        return fireBullet;
    }

    rotateToMousePoint() {
        var dist_x = this.app.renderer.plugins.interaction.mouse.global.x
            - this.mainScene.position.x;
        var dist_y = this.app.renderer.plugins.interaction.mouse.global.y 
            - this.mainScene.position.y;

        var angle = Math.atan2(dist_y, dist_x);
        if (angle > 2.35 || angle < -2.35) {
            this.changeSpriteByDirection("left");
        } else if (angle >= -2.35 && angle < -0.8) {
            fennekin.changeSpriteByDirection("up");
        } else if (angle >= -0.8 && angle < 0.8) {
            fennekin.changeSpriteByDirection("right");
        } else if (angle >= 0.8 && angle < 2.35) {
            fennekin.changeSpriteByDirection("down");
        }

        return angle;
    }
}
