import { Scene, Physics, GameObjects } from 'phaser';
import { PLAYER_CONFIG, DEPTH } from '../config/GameConfig';
import { EventBus } from '../EventBus';

export class Player extends Physics.Arcade.Sprite {
    private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
    private attackKey!: Phaser.Input.Keyboard.Key;
    private health: number;
    private maxHealth: number;
    private coins: number = 0;
    private isAttacking: boolean = false;
    private attackCooldownTimer: number = 0;
    private invincible: boolean = false;
    private invincibilityTimer: number = 0;
    private facingRight: boolean = true;
    private swordHitbox: GameObjects.Rectangle | null = null;

    // Weapon stats (can be upgraded)
    private weaponDamage: number;
    private weaponRange: number;
    private weaponEffect: string | null = null;
    private weaponColor: number = 0xaaaaaa;

    constructor(scene: Scene, x: number, y: number) {
        super(scene, x, y, 'player_idle', 0);
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.setDepth(DEPTH.PLAYER);
        this.setCollideWorldBounds(true);

        const body = this.body as Physics.Arcade.Body;
        body.setSize(16, 28);
        body.setOffset(8, 4);
        body.setMaxVelocity(PLAYER_CONFIG.speed, 600);

        this.health = PLAYER_CONFIG.maxHealth;
        this.maxHealth = PLAYER_CONFIG.maxHealth;
        this.weaponDamage = PLAYER_CONFIG.attackDamage;
        this.weaponRange = PLAYER_CONFIG.attackRange;

        this.setupAnimations();
        this.setupInput();
    }

    private setupAnimations(): void {
        this.scene.anims.create({
            key: 'player_idle',
            frames: this.scene.anims.generateFrameNumbers('player_idle', { start: 0, end: 1 }),
            frameRate: 4,
            repeat: -1
        });

        this.scene.anims.create({
            key: 'player_run',
            frames: this.scene.anims.generateFrameNumbers('player_run', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });

        this.scene.anims.create({
            key: 'player_jump',
            frames: [{ key: 'player_jump', frame: 0 }],
            frameRate: 1,
        });

        this.scene.anims.create({
            key: 'player_crouch',
            frames: [{ key: 'player_crouch', frame: 0 }],
            frameRate: 1,
        });

        this.scene.anims.create({
            key: 'player_attack',
            frames: this.scene.anims.generateFrameNumbers('player_attack', { start: 0, end: 2 }),
            frameRate: 12,
            repeat: 0
        });
    }

    private setupInput(): void {
        if (!this.scene.input.keyboard) return;
        this.cursors = this.scene.input.keyboard.createCursorKeys();
        this.attackKey = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    }

    update(time: number, delta: number): void {
        if (!this.cursors) return;
        const body = this.body as Physics.Arcade.Body;
        const onGround = body.blocked.down;

        // Invincibility timer
        if (this.invincible) {
            this.invincibilityTimer -= delta;
            this.setAlpha(Math.sin(time * 0.02) > 0 ? 1 : 0.3);
            if (this.invincibilityTimer <= 0) {
                this.invincible = false;
                this.setAlpha(1);
            }
        }

        // Attack cooldown
        if (this.attackCooldownTimer > 0) {
            this.attackCooldownTimer -= delta;
        }

        // Attack
        if (Phaser.Input.Keyboard.JustDown(this.attackKey) && !this.isAttacking && this.attackCooldownTimer <= 0) {
            this.performAttack();
            return;
        }

        if (this.isAttacking) return;

        // Crouch
        if (this.cursors.down.isDown && onGround) {
            body.setVelocityX(0);
            this.anims.play('player_crouch', true);
            const crouchBody = this.body as Physics.Arcade.Body;
            crouchBody.setSize(16, 20);
            crouchBody.setOffset(8, 12);
            return;
        } else {
            body.setSize(16, 28);
            body.setOffset(8, 4);
        }

        // Horizontal movement
        if (this.cursors.left.isDown) {
            body.setVelocityX(-PLAYER_CONFIG.speed);
            this.setFlipX(true);
            this.facingRight = false;
        } else if (this.cursors.right.isDown) {
            body.setVelocityX(PLAYER_CONFIG.speed);
            this.setFlipX(false);
            this.facingRight = true;
        } else {
            body.setVelocityX(0);
        }

        // Jump
        if (this.cursors.up.isDown && onGround) {
            body.setVelocityY(PLAYER_CONFIG.jumpForce);
        }

        // Animations
        if (!onGround) {
            this.anims.play('player_jump', true);
        } else if (body.velocity.x !== 0) {
            this.anims.play('player_run', true);
        } else {
            this.anims.play('player_idle', true);
        }
    }

    private performAttack(): void {
        this.isAttacking = true;
        this.attackCooldownTimer = PLAYER_CONFIG.attackCooldown;
        this.anims.play('player_attack', true);

        // Create sword hitbox
        const offsetX = this.facingRight ? this.weaponRange : -this.weaponRange;
        this.swordHitbox = this.scene.add.rectangle(
            this.x + offsetX, this.y,
            this.weaponRange, 24,
            this.weaponColor, 0.3
        );
        this.swordHitbox.setDepth(DEPTH.PROJECTILES);
        this.scene.physics.add.existing(this.swordHitbox, false);

        EventBus.emit('player-attack', {
            hitbox: this.swordHitbox,
            damage: this.weaponDamage,
            effect: this.weaponEffect,
        });

        this.scene.time.delayedCall(PLAYER_CONFIG.attackDuration, () => {
            if (this.swordHitbox) {
                this.swordHitbox.destroy();
                this.swordHitbox = null;
            }
            this.isAttacking = false;
        });
    }

    takeDamage(amount: number): void {
        if (this.invincible) return;

        this.health -= amount;
        this.invincible = true;
        this.invincibilityTimer = PLAYER_CONFIG.invincibilityDuration;

        // Knockback
        const body = this.body as Physics.Arcade.Body;
        body.setVelocityY(-200);
        body.setVelocityX(this.facingRight ? -150 : 150);

        EventBus.emit('player-health-changed', this.health);

        if (this.health <= 0) {
            this.die();
        }
    }

    private die(): void {
        EventBus.emit('player-died', { coins: this.coins });
    }

    collectCoin(value: number = 1): void {
        this.coins += value;
        EventBus.emit('player-coins-changed', this.coins);
    }

    getHealth(): number { return this.health; }
    getMaxHealth(): number { return this.maxHealth; }
    getCoins(): number { return this.coins; }
    getSwordHitbox(): GameObjects.Rectangle | null { return this.swordHitbox; }
    getWeaponDamage(): number { return this.weaponDamage; }
    getWeaponEffect(): string | null { return this.weaponEffect; }

    applyUpgrade(damageBonus: number, rangeBonus: number, effect?: string, color?: number): void {
        this.weaponDamage += damageBonus;
        this.weaponRange += rangeBonus;
        if (effect) this.weaponEffect = effect;
        if (color) this.weaponColor = color;
    }

    setCoins(value: number): void {
        this.coins = value;
        EventBus.emit('player-coins-changed', this.coins);
    }
}
