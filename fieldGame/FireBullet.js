class FireBullet {
    constructor(name, position, rotation, textureResource) {
        this.fireSpeed = 5;
        this.rotation = rotation;
        this.sprite = new Sprite(textureResource[name]);
        this.sprite.x = position.x;
        this.sprite.y = position.y;
        this.sprite.anchor.set(0.5, 0.5);
        this.sprite.rotation = rotation;
    }

    changePositionBy(dx, dy) {
        this.sprite.x += dx;
        this.sprite.y += dy;
    }
}