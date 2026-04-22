import { Scene, Physics } from 'phaser';
import { Enemy } from './Enemy';
import { ENEMY_TYPES } from '../config/EnemyConfig';
import { DEPTH } from '../config/GameConfig';

export class Skeleton extends Enemy {
    private shootTimer: number = 0;
    private shootInterval: number = 2500;
    private player: Phaser.GameObjects.Sprite | null = null;
    private bones: Phaser.Physics.Arcade.Group;

    constructor(scene: Scene, x: number, y: number) {
        super(scene, x, y, 'enemy_skeleton', ENEMY_TYPES.skeleton);

        const body = this.body as Physics.Arcade.Body;
        body.setSize(20, 28);
        body.setOffset(6, 4);

        this.setupAnimations();
        this.patrolRange = 120;

        this.bones = scene.physics.add.group({
            defaultKey: 'projectile_bone',
            maxSize: 5,
        });
    }

    private setupAnimations(): void {
        if (!this.scene.anims.exists('skeleton_move')) {
            this.scene.anims.create({
                key: 'skeleton_move',
                frames: this.scene.anims.generateFrameNumbers('enemy_skeleton', { start: 0, end: 1 }),
                frameRate: 6,
                repeat: -1
            });
        }
    }

    setPlayer(player: Phaser.GameObjects.Sprite): void {
        this.player = player;
    }

    getBones(): Phaser.Physics.Arcade.Group {
        return this.bones;
    }

    update(_time: number, delta: number): void {
        if (this.isDead) return;

        this.anims.play('skeleton_move', true);

        const body = this.body as Physics.Arcade.Body;
        body.setVelocityX(this.moveSpeed * this.direction);

        if (this.x > this.startX + this.patrolRange) {
            this.direction = -1;
            this.setFlipX(true);
        } else if (this.x < this.startX - this.patrolRange) {
            this.direction = 1;
            this.setFlipX(false);
        }

        // Shoot bones at player
        this.shootTimer += delta;
        if (this.shootTimer >= this.shootInterval && this.player) {
            const dist = Phaser.Math.Distance.Between(this.x, this.y, this.player.x, this.player.y);
            if (dist < 300) {
                this.shootBone();
                this.shootTimer = 0;
            }
        }
    }

    private shootBone(): void {
        const bone = this.bones.get(this.x, this.y - 4) as Physics.Arcade.Sprite;
        if (!bone) return;

        bone.setActive(true);
        bone.setVisible(true);
        bone.setDepth(DEPTH.PROJECTILES);

        const boneBody = bone.body as Physics.Arcade.Body;
        if (!boneBody) return;
        boneBody.enable = true;

        const dirX = this.player ? (this.player.x < this.x ? -1 : 1) : this.direction;
        boneBody.setVelocity(dirX * 180, -50);
        boneBody.setAllowGravity(true);

        // Destroy after 3 seconds
        this.scene.time.delayedCall(3000, () => {
            if (bone.active) {
                bone.setActive(false);
                bone.setVisible(false);
                boneBody.enable = false;
            }
        });
    }

    protected die(): void {
        // Clean up bones
        this.bones.clear(true, true);
        super.die();
    }
}
