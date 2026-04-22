import { TILE_SIZE } from './GameConfig';

// 0 = empty, 1 = ground, 2 = platform, 3 = wall, 4 = coin spawn, 5 = enemy spawn (slime),
// 6 = enemy spawn (skeleton), 7 = enemy spawn (bat), 8 = level end trigger
// Level is 100 tiles wide x 24 tiles tall (3200x768)
export const LEVEL1_WIDTH = 100;
export const LEVEL1_HEIGHT = 24;

export const LEVEL1_MAP: number[][] = generateLevel1();

function generateLevel1(): number[][] {
    const map: number[][] = [];

    for (let y = 0; y < LEVEL1_HEIGHT; y++) {
        map[y] = new Array(LEVEL1_WIDTH).fill(0);
    }

    // Ground layer (bottom 2 rows)
    for (let x = 0; x < LEVEL1_WIDTH; x++) {
        map[LEVEL1_HEIGHT - 1][x] = 1;
        map[LEVEL1_HEIGHT - 2][x] = 1;
    }

    // Gaps in the ground
    for (let x = 15; x <= 17; x++) { map[LEVEL1_HEIGHT - 1][x] = 0; map[LEVEL1_HEIGHT - 2][x] = 0; }
    for (let x = 35; x <= 37; x++) { map[LEVEL1_HEIGHT - 1][x] = 0; map[LEVEL1_HEIGHT - 2][x] = 0; }
    for (let x = 60; x <= 63; x++) { map[LEVEL1_HEIGHT - 1][x] = 0; map[LEVEL1_HEIGHT - 2][x] = 0; }

    // Floating platforms
    const platforms = [
        { x: 8, y: 18, w: 4 },
        { x: 14, y: 16, w: 3 },
        { x: 20, y: 17, w: 5 },
        { x: 28, y: 15, w: 3 },
        { x: 33, y: 18, w: 4 },
        { x: 40, y: 16, w: 6 },
        { x: 48, y: 14, w: 3 },
        { x: 52, y: 17, w: 4 },
        { x: 58, y: 15, w: 3 },
        { x: 65, y: 18, w: 5 },
        { x: 72, y: 16, w: 4 },
        { x: 78, y: 14, w: 3 },
        { x: 83, y: 17, w: 5 },
        { x: 90, y: 15, w: 4 },
    ];

    for (const p of platforms) {
        for (let x = p.x; x < p.x + p.w; x++) {
            if (x < LEVEL1_WIDTH) map[p.y][x] = 2;
        }
    }

    // Walls
    map[LEVEL1_HEIGHT - 3][25] = 3;
    map[LEVEL1_HEIGHT - 4][25] = 3;
    map[LEVEL1_HEIGHT - 3][70] = 3;
    map[LEVEL1_HEIGHT - 4][70] = 3;
    map[LEVEL1_HEIGHT - 5][70] = 3;

    // Coins
    const coinPositions = [
        [10, 17], [12, 17], [14, 15], [21, 16], [22, 16],
        [29, 14], [41, 15], [42, 15], [43, 15],
        [49, 13], [53, 16], [59, 14],
        [66, 17], [67, 17], [73, 15], [74, 15],
        [84, 16], [85, 16], [91, 14], [92, 14],
    ];
    for (const [cx, cy] of coinPositions) {
        if (cx < LEVEL1_WIDTH && cy < LEVEL1_HEIGHT) map[cy][cx] = 4;
    }

    // Enemy spawns
    const enemySpawns: [number, number, number][] = [
        [12, LEVEL1_HEIGHT - 3, 5],  // slime
        [22, LEVEL1_HEIGHT - 3, 5],  // slime
        [30, 14, 7],                  // bat
        [42, LEVEL1_HEIGHT - 3, 6],  // skeleton
        [50, 13, 7],                  // bat
        [55, LEVEL1_HEIGHT - 3, 5],  // slime
        [68, LEVEL1_HEIGHT - 3, 6],  // skeleton
        [75, 15, 7],                  // bat
        [85, LEVEL1_HEIGHT - 3, 5],  // slime
        [92, LEVEL1_HEIGHT - 3, 6],  // skeleton
    ];
    for (const [ex, ey, et] of enemySpawns) {
        if (ex < LEVEL1_WIDTH && ey < LEVEL1_HEIGHT) map[ey][ex] = et;
    }

    // Level end trigger
    map[LEVEL1_HEIGHT - 3][LEVEL1_WIDTH - 3] = 8;
    map[LEVEL1_HEIGHT - 4][LEVEL1_WIDTH - 3] = 8;

    return map;
}

export function getWorldWidth(): number {
    return LEVEL1_WIDTH * TILE_SIZE;
}

export function getWorldHeight(): number {
    return LEVEL1_HEIGHT * TILE_SIZE;
}
