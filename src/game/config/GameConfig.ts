export const GAME_WIDTH = 1024;
export const GAME_HEIGHT = 768;

export const PLAYER_CONFIG = {
    speed: 200,
    jumpForce: -450,
    maxHealth: 5,
    invincibilityDuration: 1000,
    attackCooldown: 400,
    attackDuration: 200,
    attackRange: 40,
    attackDamage: 1,
    spriteWidth: 32,
    spriteHeight: 32,
};

export const TILE_SIZE = 32;

export const DEPTH = {
    BG_SKY: 0,
    BG_MOUNTAINS: 1,
    BG_TREES: 2,
    BG_FOREGROUND: 3,
    TILES: 10,
    COINS: 15,
    ENEMIES: 20,
    PLAYER: 25,
    PROJECTILES: 30,
    HUD: 100,
};
