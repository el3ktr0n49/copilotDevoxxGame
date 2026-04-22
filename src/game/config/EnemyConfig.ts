export interface EnemyDefinition {
    type: string;
    health: number;
    damage: number;
    speed: number;
    scoreValue: number;
    coinDrop: number;
}

export const ENEMY_TYPES: Record<string, EnemyDefinition> = {
    slime: {
        type: 'slime',
        health: 2,
        damage: 1,
        speed: 60,
        scoreValue: 10,
        coinDrop: 1,
    },
    skeleton: {
        type: 'skeleton',
        health: 4,
        damage: 1,
        speed: 80,
        scoreValue: 25,
        coinDrop: 3,
    },
    bat: {
        type: 'bat',
        health: 1,
        damage: 1,
        speed: 100,
        scoreValue: 15,
        coinDrop: 2,
    },
};
