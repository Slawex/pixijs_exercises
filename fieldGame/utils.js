
function distance(ax, ay, bx, by) {
    return Math.sqrt(Math.pow(bx - ax, 2) + Math.pow(by - ay, 2));
}

function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}