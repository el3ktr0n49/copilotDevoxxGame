import { Scene } from 'phaser';
import { EventBus } from '../EventBus';
import { WEAPON_UPGRADES, WeaponUpgrade } from '../config/CraftingRecipes';

interface ShopData {
    level?: number;
    coins: number;
    purchasedUpgrades?: string[];
    weaponDamage?: number;
    weaponRange?: number;
    weaponEffect?: string;
    weaponColor?: number;
}

export class Shop extends Scene {
    private coins: number = 0;
    private currentLevel: number = 1;
    private purchasedUpgrades: string[] = [];
    private weaponDamage: number = 1;
    private weaponRange: number = 40;
    private weaponEffect: string | undefined;
    private weaponColor: number = 0xaaaaaa;

    constructor() {
        super('Shop');
    }

    init(data: ShopData) {
        this.coins = data.coins || 0;
        this.currentLevel = data.level || 1;
        this.purchasedUpgrades = data.purchasedUpgrades || [];
        this.weaponDamage = data.weaponDamage || 1;
        this.weaponRange = data.weaponRange || 40;
        this.weaponEffect = data.weaponEffect;
        this.weaponColor = data.weaponColor || 0xaaaaaa;
    }

    create() {
        this.cameras.main.setBackgroundColor(0x1a0a2e);

        // Ensure pointer input is in a clean state after Level1 transition
        this.input.enabled = true;
        this.input.manager.resetPointers();

        // Title
        this.add.text(512, 50, 'FORGE & BOUTIQUE', {
            fontFamily: 'monospace',
            fontSize: '32px',
            color: '#ffcc00',
            stroke: '#000000',
            strokeThickness: 4,
        }).setOrigin(0.5);

        // Coin display
        this.add.text(512, 100, `Pièces: ${this.coins}`, {
            fontFamily: 'monospace',
            fontSize: '20px',
            color: '#ffcc00',
        }).setOrigin(0.5);

        // Display upgrades
        const startY = 160;
        const itemHeight = 80;

        WEAPON_UPGRADES.forEach((upgrade, index) => {
            const y = startY + index * itemHeight;
            const isPurchased = this.purchasedUpgrades.includes(upgrade.id);
            const canAfford = this.coins >= upgrade.cost;
            const hasPrereq = !upgrade.requires || this.purchasedUpgrades.includes(upgrade.requires);
            const isAvailable = !isPurchased && canAfford && hasPrereq;

            // Background
            const bgColor = isPurchased ? 0x225522 : (isAvailable ? 0x222244 : 0x1a1a1a);
            this.add.rectangle(512, y + 25, 600, 65, bgColor, 0.8)
                .setStrokeStyle(1, isPurchased ? 0x44aa44 : (isAvailable ? 0x4444aa : 0x333333));

            // Name
            const nameColor = isPurchased ? '#44aa44' : (isAvailable ? '#ffffff' : '#666666');
            this.add.text(240, y + 5, upgrade.name, {
                fontFamily: 'monospace',
                fontSize: '18px',
                color: nameColor,
            });

            // Description
            this.add.text(240, y + 28, upgrade.description, {
                fontFamily: 'monospace',
                fontSize: '12px',
                color: '#999999',
            });

            // Cost / Status
            if (isPurchased) {
                this.add.text(720, y + 15, '✓ Acheté', {
                    fontFamily: 'monospace',
                    fontSize: '14px',
                    color: '#44aa44',
                }).setOrigin(0.5);
            } else if (!hasPrereq) {
                this.add.text(720, y + 15, '🔒 Verrouillé', {
                    fontFamily: 'monospace',
                    fontSize: '14px',
                    color: '#666666',
                }).setOrigin(0.5);
            } else {
                const costColor = canAfford ? '#ffcc00' : '#aa4444';
                const buyBtn = this.add.text(720, y + 15, `${upgrade.cost} pièces`, {
                    fontFamily: 'monospace',
                    fontSize: '14px',
                    color: costColor,
                    backgroundColor: canAfford ? '#333366' : '#222222',
                    padding: { x: 8, y: 4 },
                }).setOrigin(0.5);

                if (canAfford) {
                    buyBtn.setInteractive({ useHandCursor: true });
                    buyBtn.on('pointerover', () => buyBtn.setBackgroundColor('#444488'));
                    buyBtn.on('pointerout', () => buyBtn.setBackgroundColor('#333366'));
                    buyBtn.on('pointerdown', () => this.purchaseUpgrade(upgrade));
                }
            }
        });

        // Continue button
        const nextLevel = this.currentLevel + 1;
        const btnLabel = nextLevel === 2 ? '[ CONTINUER → Niveau 2 ]' : '[ RETOUR AU MENU ]';
        const continueBtn = this.add.text(512, 680, btnLabel, {
            fontFamily: 'monospace',
            fontSize: '22px',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 3,
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });

        continueBtn.on('pointerover', () => continueBtn.setColor('#ffcc00'));
        continueBtn.on('pointerout', () => continueBtn.setColor('#ffffff'));
        continueBtn.on('pointerdown', () => this.continueGame());

        EventBus.emit('current-scene-ready', this);
    }

    private purchaseUpgrade(upgrade: WeaponUpgrade): void {
        if (this.coins < upgrade.cost) return;

        this.coins -= upgrade.cost;
        this.purchasedUpgrades.push(upgrade.id);
        this.weaponDamage += upgrade.damageBonus;
        this.weaponRange += upgrade.rangeBonus;
        if (upgrade.effect) this.weaponEffect = upgrade.effect;
        this.weaponColor = upgrade.color;

        // Refresh the scene
        this.scene.restart({
            coins: this.coins,
            purchasedUpgrades: this.purchasedUpgrades,
            weaponDamage: this.weaponDamage,
            weaponRange: this.weaponRange,
            weaponEffect: this.weaponEffect,
            weaponColor: this.weaponColor,
        });
    }

    private continueGame(): void {
        const nextLevel = this.currentLevel + 1;
        const nextScene = nextLevel === 2 ? 'Level2' : 'MainMenu';
        this.scene.start(nextScene, {
            level: this.currentLevel,
            coins: this.coins,
            purchasedUpgrades: this.purchasedUpgrades,
            weaponDamage: this.weaponDamage,
            weaponRange: this.weaponRange,
            weaponEffect: this.weaponEffect,
            weaponColor: this.weaponColor,
        });
    }
}
