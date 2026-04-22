import { Scene } from 'phaser';
import { Enemy } from './Enemy';
import { ENEMY_TYPES } from '../config/EnemyConfig';

export class Slime extends Enemy {
    private bounceTimer: number = 0;

    constructor(scene: Scene, x: number, y: number) {
        super(scene, x, y, 'enemy_slime', ENEMY_TYPES.slime);

        const body = this.body as Phaser.Physics.Arcade.Body;
        body.setSize(24, 18);
        body.setOffset(4, 14);
        body.setBounce(0.2);

        this.setupAnimations();
        this.patrolRange = 80;
    }

    private setupAnimations(): void {
        if (!this.scene.anims.exists('slime_move')) {
            this.scene.anims.create({
                key: 'slime_move',
                frames: this.scene.anims.generateFrameNumbers('enemy_slime', { start: 0, end: 1 }),
                frameRate: 4,
                repeat: -1
            });
        }
    }

    update(_time: number, delta: number): void {
        if (this.isDead) return;

        this.anims.play('slime_move', true);

        // Patrol back and forth
        const body = this.body as Phaser.Physics.Arcade.Body;
        body.setVelocityX(this.moveSpeed * this.direction);

        if (this.x > this.startX + this.patrolRange) {
            this.direction = -1;
            this.setFlipX(true);
        } else if (this.x < this.startX - this.patrolRange) {
            this.direction = 1;
            this.setFlipX(false);
        }

        // Bounce effect
        this.bounceTimer += delta;
        if (this.bounceTimer > 500 && body.blocked.down) {
            body.setVelocityY(-120);
            this.bounceTimer = 0;
        }
    }
}
