import { Scene, GameObjects } from 'phaser';
import { DEPTH, PLAYER_CONFIG } from '../config/GameConfig';
import { EventBus } from '../EventBus';

export class HUD {
    private scene: Scene;
    private healthBarFill!: GameObjects.Image;
    private healthText!: GameObjects.Text;
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
        const margin = 20;
        const panelWidth = 220;
        const panelHeight = 80;

        // Semi-transparent dark background panel
        const panel = this.scene.add.graphics();
        panel.fillStyle(0x000000, 0.55);
        panel.fillRoundedRect(margin - 8, margin - 8, panelWidth, panelHeight, 6);
        panel.setScrollFactor(0);
        panel.setDepth(DEPTH.HUD - 1);

        // ❤ HP label
        this.scene.add.text(margin, margin, '\u2764 HP', {
            fontFamily: 'monospace',
            fontSize: '16px',
            color: '#ff4444',
            stroke: '#000000',
            strokeThickness: 3,
        })
            .setScrollFactor(0)
            .setDepth(DEPTH.HUD);

        // Health bar background
        this.scene.add.image(margin + 77 + 2, margin + 6, 'ui_healthbar_bg')
            .setOrigin(0.5)
            .setScrollFactor(0)
            .setDepth(DEPTH.HUD);

        // Health bar fill
        this.healthBarFill = this.scene.add.image(margin + 4, margin + 2, 'ui_healthbar')
            .setOrigin(0, 0)
            .setScrollFactor(0)
            .setDepth(DEPTH.HUD + 1);

        // Numeric health text (e.g., "3 / 5")
        this.healthText = this.scene.add.text(margin + 160, margin, `${this.currentHealth} / ${this.maxHealth}`, {
            fontFamily: 'monospace',
            fontSize: '14px',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 3,
        })
            .setScrollFactor(0)
            .setDepth(DEPTH.HUD + 2);

        // Coin icon
        this.scene.add.sprite(margin + 4, margin + 40, 'item_coin', 0)
            .setScrollFactor(0)
            .setDepth(DEPTH.HUD)
            .setScale(2);

        // Coin text
        this.coinText = this.scene.add.text(margin + 24, margin + 32, 'x 0', {
            fontFamily: 'monospace',
            fontSize: '20px',
            color: '#ffdd00',
            stroke: '#000000',
            strokeThickness: 4,
        })
            .setScrollFactor(0)
            .setDepth(DEPTH.HUD);

        // Sword icon
        this.scene.add.image(margin + 4, margin + 60, 'ui_sword')
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
        this.healthText.setText(`${this.currentHealth} / ${this.maxHealth}`);

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
