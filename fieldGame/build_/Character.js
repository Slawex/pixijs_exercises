var CharacterManager = function (name, position, sprite) {
    var character = {};
    character.name = name;
    character.x = position.x;
    character.y = position.y;
    character.sprite = sprite;
    character.vx = 0;
    character.vy = 0;
    character.sprite.anchor.x = 0.5;
    character.sprite.anchor.y = 0.5;
    character.width = character.sprite.width;
    character.height = character.sprite.height;

    return character;
};