import { Scene, GameObjects } from 'phaser';
import { DEPTH, PLAYER_CONFIG } from '../config/GameConfig';
import { EventBus } from '../EventBus';

export class HUD {
    private scene: Scene;
    private healthBarFill!: GameObjects.Image;
    private coinText!: GameObjects.Text;

    private currentHealth: number;
    private maxHealth: number;

    constructor(scene: Scene) {
        this.scene = scene;
        this.currentHealth = PLAYER_CONFIG.maxHealth;
        this.maxHealth = PLAYER_CONFIG.maxHealth;

        this.createHUD();
        this.setupListeners();
    }

    private createHUD(): void {
        const margin = 16;

        // Health bar
        this.scene.add.image(margin + 52, margin + 8, 'ui_healthbar_bg')
            .setOrigin(0.5)
            .setScrollFactor(0)
            .setDepth(DEPTH.HUD);

        this.healthBarFill = this.scene.add.image(margin + 4, margin + 4, 'ui_healthbar')
            .setOrigin(0, 0)
            .setScrollFactor(0)
            .setDepth(DEPTH.HUD + 1);

        // Coin display
        this.scene.add.sprite(margin, margin + 30, 'item_coin', 0)
            .setScrollFactor(0)
            .setDepth(DEPTH.HUD)
            .setScale(1.5);

        this.coinText = this.scene.add.text(margin + 16, margin + 24, 'x 0', {
            fontFamily: 'monospace',
            fontSize: '14px',
            color: '#ffcc00',
            stroke: '#000000',
            strokeThickness: 3,
        })
            .setScrollFactor(0)
            .setDepth(DEPTH.HUD);

        // Sword icon
        this.scene.add.image(margin, margin + 52, 'ui_sword')
            .setScrollFactor(0)
            .setDepth(DEPTH.HUD)
            .setScale(1.5);
    }

    private setupListeners(): void {
        EventBus.on('player-health-changed', (health: number) => {
            this.currentHealth = health;
            this.updateHealthBar();
        });

        EventBus.on('player-coins-changed', (coins: number) => {
            this.coinText.setText(`x ${coins}`);
        });
    }

    private updateHealthBar(): void {
        const ratio = Math.max(0, this.currentHealth / this.maxHealth);
        this.healthBarFill.setScale(ratio, 1);

        if (ratio <= 0.25) {
            this.healthBarFill.setTint(0xff0000);
        } else if (ratio <= 0.5) {
            this.healthBarFill.setTint(0xff8800);
        } else {
            this.healthBarFill.clearTint();
        }
    }

    destroy(): void {
        EventBus.off('player-health-changed');
        EventBus.off('player-coins-changed');
    }
}
