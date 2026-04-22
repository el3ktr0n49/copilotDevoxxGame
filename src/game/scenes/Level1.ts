import * as Phaser from 'phaser';
import { Scene, Physics } from 'phaser';
import { EventBus } from '../EventBus';
import { Player } from '../entities/Player';
import { Slime } from '../entities/Slime';
import { Skeleton } from '../entities/Skeleton';
import { Bat } from '../entities/Bat';
import { Coin } from '../entities/Coin';
import { Enemy } from '../entities/Enemy';
import { ParallaxManager } from '../systems/ParallaxManager';
import { HUD } from '../ui/HUD';
import { TILE_SIZE, DEPTH } from '../config/GameConfig';
import { LEVEL1_MAP, LEVEL1_WIDTH, LEVEL1_HEIGHT, getWorldWidth, getWorldHeight } from '../config/LevelConfig';

export class Level1 extends Scene {
    private player!: Player;
    private parallax!: ParallaxManager;
    private hud!: HUD;
    private groundGroup!: Physics.Arcade.StaticGroup;
    private platformGroup!: Physics.Arcade.StaticGroup;
    private wallGroup!: Physics.Arcade.StaticGroup;
    private coinGroup!: Physics.Arcade.StaticGroup;
    private enemies: Enemy[] = [];
    private endTrigger!: Physics.Arcade.StaticGroup;
    private levelComplete: boolean = false;
    private playerDead: boolean = false;
    private enemiesKilled: number = 0;
    private levelStartTime: number = 0;
    private totalEnemies: number = 0;
    private fadeTimer: number = 0;
    private deathTimer: number = 0;
    private recapData: any = null;
    private deathData: any = null;
    private initData: any = {};

    constructor() {
        super('Level1');
    }

    init(data: any) {
        this.initData = data || {};
    }

    create() {
        this.levelComplete = false;
        this.playerDead = false;
        this.enemiesKilled = 0;
        this.enemies = [];

        const worldW = getWorldWidth();
        const worldH = getWorldHeight();

        // Set world bounds (extended downward to allow pit falls)
        this.physics.world.setBounds(0, 0, worldW, worldH + 200);
        // Disable bottom wall so player can fall into pits
        this.physics.world.setBoundsCollision(true, true, true, false);

        // Parallax backgrounds
        this.parallax = new ParallaxManager(this);
        this.parallax.addLayer('bg_sky', 0.05, DEPTH.BG_SKY);
        this.parallax.addLayer('bg_mountains', 0.15, DEPTH.BG_MOUNTAINS);
        this.parallax.addLayer('bg_trees', 0.3, DEPTH.BG_TREES);

        // Create tile groups
        this.groundGroup = this.physics.add.staticGroup();
        this.platformGroup = this.physics.add.staticGroup();
        this.wallGroup = this.physics.add.staticGroup();
        this.coinGroup = this.physics.add.staticGroup();
        this.endTrigger = this.physics.add.staticGroup();

        // Build the level from the map data
        this.buildLevel();

        // Track enemy/time stats
        this.totalEnemies = this.enemies.length;
        this.levelStartTime = this.time.now;

        // Create player at start position
        this.player = new Player(this, 64, worldH - TILE_SIZE * 4);

        // Apply weapon upgrades from shop
        if (this.initData.weaponDamage) {
            this.player.applyUpgrade(
                this.initData.weaponDamage - 1,
                (this.initData.weaponRange || 40) - 40,
                this.initData.weaponEffect,
                this.initData.weaponColor
            );
        }

        // Camera
        this.cameras.main.setBounds(0, 0, worldW, worldH);
        this.cameras.main.startFollow(this.player, true, 0.1, 0.1);
        this.cameras.main.setDeadzone(100, 50);

        // Collisions
        this.physics.add.collider(this.player, this.groundGroup);
        this.physics.add.collider(this.player, this.platformGroup);
        this.physics.add.collider(this.player, this.wallGroup);

        // Coin collection
        this.physics.add.overlap(this.player, this.coinGroup, this.collectCoin, undefined, this);

        // Enemy collisions with tiles
        for (const enemy of this.enemies) {
            this.physics.add.collider(enemy, this.groundGroup);
            this.physics.add.collider(enemy, this.platformGroup);
            this.physics.add.collider(enemy, this.wallGroup);

            // Player-enemy collision (damage)
            this.physics.add.overlap(this.player, enemy, this.playerEnemyCollision, undefined, this);

            // Skeleton bone collisions
            if (enemy instanceof Skeleton) {
                (enemy as Skeleton).setPlayer(this.player);
                this.physics.add.collider((enemy as Skeleton).getBones(), this.groundGroup, (bone) => {
                    (bone as Physics.Arcade.Sprite).setActive(false).setVisible(false);
                });
                this.physics.add.overlap(this.player, (enemy as Skeleton).getBones(), this.playerBoneCollision, undefined, this);
            }

            // Bat tracking
            if (enemy instanceof Bat) {
                (enemy as Bat).setPlayer(this.player);
            }
        }

        // Level end trigger
        this.physics.add.overlap(this.player, this.endTrigger, this.onLevelComplete, undefined, this);

        // Listen for attack events
        EventBus.on('player-attack', this.handlePlayerAttack, this);
        EventBus.on('player-died', this.onPlayerDied, this);
        EventBus.on('enemy-killed', this.onEnemyKilled, this);

        // HUD
        this.hud = new HUD(this);

        EventBus.emit('current-scene-ready', this);
    }

    private buildLevel(): void {
        for (let y = 0; y < LEVEL1_HEIGHT; y++) {
            for (let x = 0; x < LEVEL1_WIDTH; x++) {
                const tile = LEVEL1_MAP[y][x];
                const px = x * TILE_SIZE + TILE_SIZE / 2;
                const py = y * TILE_SIZE + TILE_SIZE / 2;

                switch (tile) {
                    case 1: // Ground
                        this.groundGroup.create(px, py, 'tile_ground')
                            .setDepth(DEPTH.TILES)
                            .refreshBody();
                        break;
                    case 2: // Platform
                        this.platformGroup.create(px, py, 'tile_platform')
                            .setDepth(DEPTH.TILES)
                            .refreshBody();
                        break;
                    case 3: // Wall
                        this.wallGroup.create(px, py, 'tile_wall')
                            .setDepth(DEPTH.TILES)
                            .refreshBody();
                        break;
                    case 4: { // Coin
                        const coinSprite = new Coin(this, px, py, 1, false);
                        this.coinGroup.add(coinSprite);
                        break;
                    }
                    case 5: // Slime spawn
                        this.enemies.push(new Slime(this, px, py - TILE_SIZE / 2));
                        break;
                    case 6: // Skeleton spawn
                        this.enemies.push(new Skeleton(this, px, py - TILE_SIZE / 2));
                        break;
                    case 7: // Bat spawn
                        this.enemies.push(new Bat(this, px, py));
                        break;
                    case 8: // Level end
                        this.endTrigger.create(px, py, 'tile_end')
                            .setDepth(DEPTH.TILES)
                            .refreshBody();
                        break;
                }
            }
        }
    }

    private collectCoin(_player: any, coinObj: any): void {
        const coin = coinObj as Coin;
        if (!coin.active) return;
        this.player.collectCoin(coin.getValue());
        coin.collect();
    }

    private playerEnemyCollision(_player: any, enemyObj: any): void {
        const enemy = enemyObj as Enemy;
        if (enemy.getIsDead()) return;

        // Check if player is jumping on the enemy (stomp)
        const playerBody = this.player.body as Physics.Arcade.Body;
        if (playerBody.velocity.y > 0 && this.player.y < enemy.y - 10) {
            enemy.takeDamage(1);
            playerBody.setVelocityY(-300); // Bounce
        } else {
            this.player.takeDamage(enemy.getDamage());
        }
    }

    private playerBoneCollision(_player: any, bone: any): void {
        const boneSprite = bone as Physics.Arcade.Sprite;
        if (!boneSprite.active) return;
        boneSprite.setActive(false).setVisible(false);
        this.player.takeDamage(1);
    }

    private handlePlayerAttack(data: { hitbox: Phaser.GameObjects.Rectangle, damage: number, effect: string | null }): void {
        for (const enemy of this.enemies) {
            if (enemy.getIsDead() || !enemy.active) continue;
            const hitbox = data.hitbox;
            if (Phaser.Geom.Intersects.RectangleToRectangle(
                hitbox.getBounds(),
                enemy.getBounds()
            )) {
                enemy.takeDamage(data.damage, data.effect);
            }
        }
    }

    private onEnemyKilled(data: { x: number, y: number, coins: number }): void {
        this.enemiesKilled++;
        // Drop coins at enemy position
        for (let i = 0; i < data.coins; i++) {
            const offsetX = (Math.random() - 0.5) * 30;
            const coin = new Coin(this, data.x + offsetX, data.y - 10);
            this.physics.add.overlap(this.player, coin, this.collectCoin, undefined, this);
        }
    }

    private onLevelComplete(): void {
        if (this.levelComplete) return;
        this.levelComplete = true;

        this.recapData = {
            level: 1,
            coins: this.player.getCoins(),
            enemiesKilled: this.enemiesKilled,
            totalEnemies: this.totalEnemies,
            timeSeconds: Math.floor((this.time.now - this.levelStartTime) / 1000),
            purchasedUpgrades: this.initData.purchasedUpgrades,
            weaponDamage: this.initData.weaponDamage,
            weaponRange: this.initData.weaponRange,
            weaponEffect: this.initData.weaponEffect,
            weaponColor: this.initData.weaponColor,
        };
        this.fadeTimer = 1100;
        this.cameras.main.fadeOut(1000, 0, 0, 0);
    }

    private onPlayerDied(data: { coins: number }): void {
        if (this.playerDead) return;
        this.playerDead = true;

        this.cameras.main.shake(300, 0.02);
        this.deathTimer = 500;
        this.deathData = { coins: data.coins };
    }

    private cleanup(): void {
        EventBus.off('player-attack', this.handlePlayerAttack, this);
        EventBus.off('player-died', this.onPlayerDied, this);
        EventBus.off('enemy-killed', this.onEnemyKilled, this);
        try { this.input.keyboard?.removeAllKeys(true, true); } catch (_e) { /* Phaser 4 compat */ }
        this.input.removeAllListeners();
        this.hud.destroy();
    }

    update(time: number, delta: number): void {
        // Handle level complete transition
        if (this.levelComplete) {
            if (this.fadeTimer > 0) {
                this.fadeTimer -= delta;
                if (this.fadeTimer <= 0) {
                    this.cleanup();
                    this.scene.start('LevelRecap', this.recapData);
                }
            }
            return;
        }

        // Handle death transition
        if (this.playerDead) {
            if (this.deathTimer > 0) {
                this.deathTimer -= delta;
                if (this.deathTimer <= 0) {
                    this.cleanup();
                    this.scene.start('GameOver', this.deathData);
                }
            }
            return;
        }

        this.player.update(time, delta);
        this.parallax.update();

        for (const enemy of this.enemies) {
            if (enemy.active && !enemy.getIsDead()) {
                enemy.update(time, delta);
            }
        }

        // Check fall into pit (below visible level)
        if (this.player.y > getWorldHeight() + 50) {
            this.player.takeDamage(999);
        }
    }
}
