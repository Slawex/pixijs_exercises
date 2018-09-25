class CustomLoader {
    constructor(loader) {
        console.log("wut");
        this.callback = null;
        this.loader = loader;
        this.loader.add("field_elems.json");
        this.loader.add("grass_field.png");
        this.loader.add("explosion.png");
        this.loader.add("../helper_images/doom_set.png");
        this.loader.add("../helper_images/wood_set.png");
        this.loader.once("complete", this.onImagesLoaded.bind(this));
    }

    load(callback) {
        this.callback = callback;
        this.loader.load();
    }

    onImagesLoaded() {
        this.callback();
    }
}

export default CustomLoader;