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

    // Gaps in the ground (narrowed to 2 tiles max, with wall warnings)
    // Gap 1: x=15-16 with wall warning at x=14
    for (let x = 15; x <= 16; x++) { map[LEVEL1_HEIGHT - 1][x] = 0; map[LEVEL1_HEIGHT - 2][x] = 0; }
    // Gap 2: x=35-36 with wall warning at x=34
    for (let x = 35; x <= 36; x++) { map[LEVEL1_HEIGHT - 1][x] = 0; map[LEVEL1_HEIGHT - 2][x] = 0; }
    // Gap 3: x=60-61 with wall warning at x=59
    for (let x = 60; x <= 61; x++) { map[LEVEL1_HEIGHT - 1][x] = 0; map[LEVEL1_HEIGHT - 2][x] = 0; }

    // Warning walls before each gap (visual cue)
    map[LEVEL1_HEIGHT - 3][14] = 3;
    map[LEVEL1_HEIGHT - 3][34] = 3;
    map[LEVEL1_HEIGHT - 3][59] = 3;

    // Floating platforms — all reachable with jumpForce=-450, gravity=800
    // Ground at y=22. Max jump from ground ~3 tiles → y=19 reachable.
    // Staircase patterns: y=20 → y=18 for higher spots.
    const platforms = [
        { x: 8, y: 20, w: 4 },    // low step
        { x: 13, y: 19, w: 3 },   // reachable from ground, near gap 1
        { x: 20, y: 20, w: 5 },   // low step
        { x: 26, y: 19, w: 4 },   // reachable from ground
        { x: 33, y: 20, w: 4 },   // low step near gap 2
        { x: 40, y: 20, w: 5 },   // low step
        { x: 41, y: 18, w: 3 },   // reachable from platform at y=20
        { x: 48, y: 20, w: 4 },   // low step
        { x: 52, y: 19, w: 4 },   // reachable from ground
        { x: 58, y: 20, w: 3 },   // low step near gap 3
        { x: 65, y: 20, w: 5 },   // low step
        { x: 72, y: 20, w: 4 },   // low step
        { x: 73, y: 18, w: 3 },   // reachable from platform at y=20
        { x: 80, y: 19, w: 4 },   // reachable from ground
        { x: 87, y: 20, w: 5 },   // low step
        { x: 90, y: 19, w: 4 },   // reachable from ground
    ];

    for (const p of platforms) {
        for (let x = p.x; x < p.x + p.w; x++) {
            if (x < LEVEL1_WIDTH) map[p.y][x] = 2;
        }
    }

    // Walls (decorative / obstacles)
    map[LEVEL1_HEIGHT - 3][25] = 3;
    map[LEVEL1_HEIGHT - 4][25] = 3;
    map[LEVEL1_HEIGHT - 3][70] = 3;
    map[LEVEL1_HEIGHT - 4][70] = 3;

    // Coins — placed on or 1 tile above platforms/ground
    const coinPositions = [
        [9, 19], [11, 19],           // on platform y=20 (1 above)
        [14, 18], [21, 19], [22, 19], // on platforms
        [27, 18], [28, 18],           // on platform y=19
        [34, 19],                     // on platform y=20
        [41, 19], [42, 17], [43, 17], // ground + upper platform
        [49, 19], [53, 18], [54, 18], // on platforms
        [66, 19], [67, 19],           // on platform y=20
        [73, 17], [74, 17],           // on upper platform y=18
        [81, 18], [82, 18],           // on platform y=19
        [88, 19], [91, 18], [92, 18], // on platforms
    ];
    for (const [cx, cy] of coinPositions) {
        if (cx < LEVEL1_WIDTH && cy < LEVEL1_HEIGHT) map[cy][cx] = 4;
    }

    // Enemy spawns — on ground or on platforms they can stand on
    const enemySpawns: [number, number, number][] = [
        [12, LEVEL1_HEIGHT - 3, 5],  // slime on ground
        [22, LEVEL1_HEIGHT - 3, 5],  // slime on ground
        [30, 17, 7],                  // bat (flying, near platforms)
        [42, LEVEL1_HEIGHT - 3, 6],  // skeleton on ground
        [50, 17, 7],                  // bat (flying)
        [55, LEVEL1_HEIGHT - 3, 5],  // slime on ground
        [68, LEVEL1_HEIGHT - 3, 6],  // skeleton on ground
        [75, 16, 7],                  // bat (flying, near upper platform)
        [85, LEVEL1_HEIGHT - 3, 5],  // slime on ground
        [92, LEVEL1_HEIGHT - 3, 6],  // skeleton on ground
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
