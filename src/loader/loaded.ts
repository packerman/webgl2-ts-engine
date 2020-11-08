import { GLScene } from "../gl";
import { Integer } from "../gltf";

export class Loaded {

    constructor(readonly scenes: GLScene[], readonly scene?: Integer) {}

    get sceneNames(): (string | undefined)[] {
        return this.scenes.map(scene => scene.name);
    }

    renderScene(sceneIndex?: Integer): void {
        const index = sceneIndex || this.scene || 0;
        if (index < 0 || index >= this.scenes.length) {
            throw new Error(`Cannot find scene at index: {index}`);
        }
        const scene = this.scenes[index];
        scene.draw();
    }
}
