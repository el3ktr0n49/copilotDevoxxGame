import { Boot } from './scenes/Boot';
import { GameOver } from './scenes/GameOver';
import { Level1 } from './scenes/Level1';
import { MainMenu } from './scenes/MainMenu';
import { AUTO, Game } from 'phaser';
import { Preloader } from './scenes/Preloader';
import { Shop } from './scenes/Shop';
import { LevelRecap } from './scenes/LevelRecap';

const config: Phaser.Types.Core.GameConfig = {
    type: AUTO,
    width: 1024,
    height: 768,
    parent: 'game-container',
    backgroundColor: '#1a1a2e',
    pixelArt: true,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { x: 0, y: 1800 },
            debug: false
        }
    },
    scene: [
        Boot,
        Preloader,
        MainMenu,
        Level1,
        LevelRecap,
        Shop,
        GameOver
    ]
};

const StartGame = (parent: string) => {
    return new Game({ ...config, parent });
}

export default StartGame;
