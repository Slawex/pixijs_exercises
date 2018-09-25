var Keyboard = function (keyCode) {
    var key = {};
    key.code = keyCode;
    key.isDown = false;
    key.isUp = true;
    key.press = undefined;
    key.release = undefined;

    key.downHandler = event => {
        if (event.keyCode == key.code) {
            if (key.isUp && key.press) key.press();
            key.isUp = false;
            key.isDown = true;
        }
    };

    key.upHandler = event => {
        if (event.keyCode == key.code) {
            if (key.isDown && key.release) key.release();
            key.isDown = false;
            key.isUp = true;
        }
    };

    window.addEventListener("keydown", key.downHandler.bind(key), false);
    window.addEventListener("keyup", key.upHandler.bind(key), false);

    return key;
};