import { Scene, Physics } from 'phaser';
import { DEPTH } from '../config/GameConfig';

export class Coin extends Physics.Arcade.Sprite {
    private value: number;

    constructor(scene: Scene, x: number, y: number, value: number = 1) {
        super(scene, x, y, 'item_coin', 0);
        scene.add.existing(this);
        scene.physics.add.existing(this, true); // static body

        this.value = value;
        this.setDepth(DEPTH.COINS);

        if (!scene.anims.exists('coin_spin')) {
            scene.anims.create({
                key: 'coin_spin',
                frames: scene.anims.generateFrameNumbers('item_coin', { start: 0, end: 3 }),
                frameRate: 8,
                repeat: -1,
            });
        }
        this.anims.play('coin_spin');
    }

    getValue(): number { return this.value; }

    collect(): void {
        // Float up and fade out
        this.scene.tweens.add({
            targets: this,
            y: this.y - 30,
            alpha: 0,
            duration: 300,
            onComplete: () => this.destroy(),
        });
    }
}
