import { Scene } from 'phaser';
import { EventBus } from '../EventBus';

interface RecapData {
    level: number;
    coins: number;
    enemiesKilled: number;
    totalEnemies: number;
    timeSeconds: number;
    purchasedUpgrades?: string[];
    weaponDamage?: number;
    weaponRange?: number;
    weaponEffect?: string;
    weaponColor?: number;
}

export class LevelRecap extends Scene {
    private recapData!: RecapData;

    constructor() {
        super('LevelRecap');
    }

    init(data: RecapData) {
        this.recapData = data;
    }

    create() {
        this.cameras.main.setBackgroundColor(0x0a0a1e);

        this.input.enabled = true;

        const centerX = 512;
        const { level, coins, enemiesKilled, totalEnemies, timeSeconds } = this.recapData;

        // Title
        this.add.text(centerX, 80, `NIVEAU ${level} TERMINÉ !`, {
            fontFamily: 'monospace',
            fontSize: '40px',
            color: '#ffcc00',
            stroke: '#000000',
            strokeThickness: 6,
        }).setOrigin(0.5);

        // Stats panel background
        this.add.rectangle(centerX, 300, 500, 260, 0x000000, 0.6)
            .setStrokeStyle(2, 0x444488);

        const minutes = Math.floor(timeSeconds / 60);
        const seconds = timeSeconds % 60;
        const timeStr = minutes > 0 ? `${minutes} min ${seconds} sec` : `${seconds} sec`;

        const statsX = 320;
        const statsStartY = 210;
        const lineSpacing = 55;

        // Time
        this.add.text(statsX, statsStartY, `⏱  Temps: ${timeStr}`, {
            fontFamily: 'monospace',
            fontSize: '22px',
            color: '#ccccff',
        });

        // Enemies
        this.add.text(statsX, statsStartY + lineSpacing, `💀  Ennemis: ${enemiesKilled} / ${totalEnemies}`, {
            fontFamily: 'monospace',
            fontSize: '22px',
            color: '#ff8888',
        });

        // Coins
        this.add.text(statsX, statsStartY + lineSpacing * 2, `💰  Pièces récoltées: ${coins}`, {
            fontFamily: 'monospace',
            fontSize: '22px',
            color: '#ffcc00',
        });

        // Rating (1-3 stars)
        const stars = this.calculateStars(enemiesKilled, totalEnemies, timeSeconds);
        const starStr = '★'.repeat(stars) + '☆'.repeat(3 - stars);
        this.add.text(centerX, 460, starStr, {
            fontFamily: 'monospace',
            fontSize: '48px',
            color: '#ffcc00',
            stroke: '#000000',
            strokeThickness: 4,
        }).setOrigin(0.5);

        // Continue button
        const continueBtn = this.add.text(centerX, 570, '[ Continuer ]', {
            fontFamily: 'monospace',
            fontSize: '26px',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 4,
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });

        continueBtn.on('pointerover', () => continueBtn.setColor('#ffcc00'));
        continueBtn.on('pointerout', () => continueBtn.setColor('#ffffff'));
        continueBtn.on('pointerdown', () => this.goToShop());

        EventBus.emit('current-scene-ready', this);
    }

    private calculateStars(killed: number, total: number, time: number): number {
        let stars = 1;
        const killRatio = total > 0 ? killed / total : 0;
        if (killRatio >= 1) {
            stars++;
        }
        if (killRatio >= 0.8 && time < 120) {
            stars++;
        }
        return stars;
    }

    private goToShop(): void {
        this.scene.start('Shop', {
            level: this.recapData.level,
            coins: this.recapData.coins,
            purchasedUpgrades: this.recapData.purchasedUpgrades,
            weaponDamage: this.recapData.weaponDamage,
            weaponRange: this.recapData.weaponRange,
            weaponEffect: this.recapData.weaponEffect,
            weaponColor: this.recapData.weaponColor,
        });
    }
}
