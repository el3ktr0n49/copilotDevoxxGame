import { Scene, GameObjects } from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT } from '../config/GameConfig';

interface ParallaxLayer {
    image: GameObjects.TileSprite;
    scrollFactor: number;
}

export class ParallaxManager {
    private layers: ParallaxLayer[] = [];
    private scene: Scene;

    constructor(scene: Scene) {
        this.scene = scene;
    }

    addLayer(textureKey: string, scrollFactor: number, depth: number): void {
        const cam = this.scene.cameras.main;
        const image = this.scene.add.tileSprite(
            cam.scrollX + GAME_WIDTH / 2,
            cam.scrollY + GAME_HEIGHT / 2,
            GAME_WIDTH,
            GAME_HEIGHT,
            textureKey
        );
        image.setDepth(depth);
        image.setScrollFactor(0);

        this.layers.push({ image, scrollFactor });
    }

    update(): void {
        const cam = this.scene.cameras.main;
        for (const layer of this.layers) {
            layer.image.tilePositionX = cam.scrollX * layer.scrollFactor;
            layer.image.tilePositionY = cam.scrollY * layer.scrollFactor * 0.5;
        }
    }
}
