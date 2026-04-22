import { Scene } from 'phaser';
import { generateAllAssets } from '../utils/AssetGenerator';

export class Boot extends Scene
{
    constructor ()
    {
        super('Boot');
    }

    create ()
    {
        generateAllAssets(this);
        this.scene.start('Preloader');
    }
}
