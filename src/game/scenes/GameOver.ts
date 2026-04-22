import { EventBus } from '../EventBus';
import { Scene } from 'phaser';

export class GameOver extends Scene
{
    constructor ()
    {
        super('GameOver');
    }

    create ()
    {
        this.cameras.main.setBackgroundColor(0x1a0000);

        this.add.text(512, 250, 'GAME OVER', {
            fontFamily: 'monospace', fontSize: '64px', color: '#ff2222',
            stroke: '#000000', strokeThickness: 8,
            align: 'center'
        }).setOrigin(0.5);

        this.add.text(512, 340, 'Le héros est tombé...', {
            fontFamily: 'monospace', fontSize: '18px', color: '#aa6666',
            align: 'center'
        }).setOrigin(0.5);

        // Retry button
        const retryBtn = this.add.text(512, 450, '[ RÉESSAYER ]', {
            fontFamily: 'monospace', fontSize: '24px', color: '#ffffff',
            stroke: '#000000', strokeThickness: 4,
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });

        retryBtn.on('pointerover', () => retryBtn.setColor('#ffcc00'));
        retryBtn.on('pointerout', () => retryBtn.setColor('#ffffff'));
        retryBtn.on('pointerdown', () => this.scene.start('Level1'));

        // Menu button
        const menuBtn = this.add.text(512, 510, '[ MENU PRINCIPAL ]', {
            fontFamily: 'monospace', fontSize: '20px', color: '#888888',
            stroke: '#000000', strokeThickness: 3,
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });

        menuBtn.on('pointerover', () => menuBtn.setColor('#ffcc00'));
        menuBtn.on('pointerout', () => menuBtn.setColor('#888888'));
        menuBtn.on('pointerdown', () => this.scene.start('MainMenu'));

        if (this.input.keyboard) {
            this.input.keyboard.once('keydown-SPACE', () => this.scene.start('Level1'));
        }

        EventBus.emit('current-scene-ready', this);
    }
}
