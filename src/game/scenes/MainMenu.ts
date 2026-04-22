import { Scene } from 'phaser';
import { EventBus } from '../EventBus';

export class MainMenu extends Scene
{
    constructor ()
    {
        super('MainMenu');
    }

    create ()
    {
        this.cameras.main.setBackgroundColor(0x0a0a2a);

        // Title
        this.add.text(512, 200, 'SHADOW BLADE', {
            fontFamily: 'monospace',
            fontSize: '48px',
            color: '#ff4444',
            stroke: '#000000',
            strokeThickness: 6,
            align: 'center'
        }).setOrigin(0.5);

        // Subtitle
        this.add.text(512, 260, 'A Metroidvania Adventure', {
            fontFamily: 'monospace',
            fontSize: '16px',
            color: '#aaaaaa',
            align: 'center'
        }).setOrigin(0.5);

        // Play button
        const playBtn = this.add.text(512, 420, '[ PLAY ]', {
            fontFamily: 'monospace',
            fontSize: '28px',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 4,
            align: 'center'
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });

        playBtn.on('pointerover', () => playBtn.setColor('#ffcc00'));
        playBtn.on('pointerout', () => playBtn.setColor('#ffffff'));
        playBtn.on('pointerdown', () => this.changeScene());

        // Controls info
        this.add.text(512, 560, 'ZQSD: Move / Jump / Crouch\nEnter: Attack', {
            fontFamily: 'monospace',
            fontSize: '14px',
            color: '#666666',
            align: 'center'
        }).setOrigin(0.5);

        // Blinking prompt
        const prompt = this.add.text(512, 500, 'Press ENTER or SPACE to start', {
            fontFamily: 'monospace',
            fontSize: '18px',
            color: '#888888',
            align: 'center'
        }).setOrigin(0.5);

        this.tweens.add({
            targets: prompt,
            alpha: 0.3,
            duration: 800,
            yoyo: true,
            repeat: -1,
        });

        if (this.input.keyboard) {
            this.input.keyboard.once('keydown-SPACE', () => this.changeScene());
            this.input.keyboard.once('keydown-ENTER', () => this.changeScene());
        }

        EventBus.emit('current-scene-ready', this);
    }

    changeScene ()
    {
        this.scene.start('Level1');
    }
}
