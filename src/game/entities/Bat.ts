import { Scene, Physics } from 'phaser';
import { Enemy } from './Enemy';
import { ENEMY_TYPES } from '../config/EnemyConfig';

export class Bat extends Enemy {
    private sineOffset: number;
    private baseY: number;
    private sineAmplitude: number = 40;
    private sineFrequency: number = 0.003;
    private player: Phaser.GameObjects.Sprite | null = null;
    private isDiving: boolean = false;
    private diveTimer: number = 0;

    constructor(scene: Scene, x: number, y: number) {
        super(scene, x, y, 'enemy_bat', ENEMY_TYPES.bat);

        const body = this.body as Physics.Arcade.Body;
        body.setSize(28, 14);
        body.setOffset(2, 8);
        body.setAllowGravity(false);

        this.baseY = y;
        this.sineOffset = Math.random() * Math.PI * 2;
        this.setupAnimations();
        this.patrolRange = 150;
    }

    private setupAnimations(): void {
        if (!this.scene.anims.exists('bat_fly')) {
            this.scene.anims.create({
                key: 'bat_fly',
                frames: this.scene.anims.generateFrameNumbers('enemy_bat', { start: 0, end: 1 }),
                frameRate: 8,
                repeat: -1
            });
        }
    }

    setPlayer(player: Phaser.GameObjects.Sprite): void {
        this.player = player;
    }

    update(time: number, delta: number): void {
        if (this.isDead) return;

        this.anims.play('bat_fly', true);

        const body = this.body as Physics.Arcade.Body;

        if (this.isDiving) {
            // Diving at player
            this.diveTimer -= delta;
            if (this.diveTimer <= 0 || body.blocked.down) {
                this.isDiving = false;
                body.setVelocityY(-100);
            }
            return;
        }

        // Sine wave patrol movement
        body.setVelocityX(this.moveSpeed * this.direction);
        const sineY = this.baseY + Math.sin(time * this.sineFrequency + this.sineOffset) * this.sineAmplitude;
        body.setVelocityY((sineY - this.y) * 3);

        // Reverse direction at patrol bounds
        if (this.x > this.startX + this.patrolRange) {
            this.direction = -1;
            this.setFlipX(true);
        } else if (this.x < this.startX - this.patrolRange) {
            this.direction = 1;
            this.setFlipX(false);
        }

        // Dive at player if close enough
        if (this.player) {
            const dist = Phaser.Math.Distance.Between(this.x, this.y, this.player.x, this.player.y);
            if (dist < 150 && this.y < this.player.y) {
                this.isDiving = true;
                this.diveTimer = 1000;
                const angle = Phaser.Math.Angle.Between(this.x, this.y, this.player.x, this.player.y);
                body.setVelocity(
                    Math.cos(angle) * this.moveSpeed * 2,
                    Math.sin(angle) * this.moveSpeed * 2
                );
            }
        }
    }
}
