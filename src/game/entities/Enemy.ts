import { Scene, Physics } from 'phaser';
import { EnemyDefinition } from '../config/EnemyConfig';
import { DEPTH } from '../config/GameConfig';
import { EventBus } from '../EventBus';

export class Enemy extends Physics.Arcade.Sprite {
    protected health: number;
    protected damage: number;
    protected moveSpeed: number;
    protected scoreValue: number;
    protected coinDrop: number;
    protected direction: number = 1;
    protected patrolRange: number = 100;
    protected startX: number;
    protected isDead: boolean = false;

    constructor(scene: Scene, x: number, y: number, texture: string, config: EnemyDefinition) {
        super(scene, x, y, texture, 0);
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.setDepth(DEPTH.ENEMIES);
        this.startX = x;
        this.health = config.health;
        this.damage = config.damage;
        this.moveSpeed = config.speed;
        this.scoreValue = config.scoreValue;
        this.coinDrop = config.coinDrop;
    }

    takeDamage(amount: number, effect?: string | null): void {
        if (this.isDead || !this.scene) return;
        this.health -= amount;

        // Flash white on hit
        this.setTint(0xffffff);
        this.scene.time.delayedCall(100, () => {
            if (!this.isDead && this.scene) this.clearTint();
        });

        // Slow effect from ice
        if (effect === 'ice') {
            this.moveSpeed *= 0.5;
            this.setTint(0x88ccff);
            this.scene.time.delayedCall(2000, () => {
                if (!this.isDead) {
                    this.moveSpeed *= 2;
                    this.clearTint();
                }
            });
        }

        if (this.health <= 0) {
            this.die();
        }
    }

    protected die(): void {
        this.isDead = true;
        EventBus.emit('enemy-killed', {
            x: this.x,
            y: this.y,
            coins: this.coinDrop,
            score: this.scoreValue,
        });

        // Death animation
        this.scene.tweens.add({
            targets: this,
            alpha: 0,
            scaleY: 0,
            duration: 300,
            onComplete: () => this.destroy(),
        });
    }

    getDamage(): number { return this.damage; }
    getIsDead(): boolean { return this.isDead; }

    update(_time: number, _delta: number): void {
        // Override in subclasses
    }
}
