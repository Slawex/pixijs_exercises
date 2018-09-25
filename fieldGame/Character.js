class Character {
    constructor(name, position, texturesResource) {
        this.name = name;
        this.x = position.x;
        this.y = position.y;
        this.vx = 0;
        this.vy = 0;

        var animationFrames = [];
        
        animationFrames.push(texturesResource[name + "_right.png"]);
        animationFrames.push(texturesResource[name + "_left.png"]);
        animationFrames.push(texturesResource[name + "_down.png"]);
        animationFrames.push(texturesResource[name + "_up.png"]);

        this.animatedSprite = new AnimatedSprite(animationFrames);
        this.animatedSprite.x = this.x;
        this.animatedSprite.y = this.y;
        this.animatedSprite.anchor.x = 0.5;
        this.animatedSprite.anchor.y = 0.5;
        
        this.width = this.animatedSprite.width;
        this.height = this.animatedSprite.height;
    }

    changePositionBy(dx, dy) {
        this.x += dx;
        this.y += dy;
        this.animatedSprite.x += dx;
        this.animatedSprite.y += dy;
    }
}
