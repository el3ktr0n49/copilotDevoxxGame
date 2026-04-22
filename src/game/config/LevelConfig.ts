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

// Level 2: Castle/dungeon theme — wider, harder, more enemies
export const LEVEL2_WIDTH = 120;
export const LEVEL2_HEIGHT = 24;

export const LEVEL2_MAP: number[][] = generateLevel2();

function generateLevel2(): number[][] {
    const map: number[][] = [];

    for (let y = 0; y < LEVEL2_HEIGHT; y++) {
        map[y] = new Array(LEVEL2_WIDTH).fill(0);
    }

    // Ground layer (bottom 2 rows)
    for (let x = 0; x < LEVEL2_WIDTH; x++) {
        map[LEVEL2_HEIGHT - 1][x] = 1;
        map[LEVEL2_HEIGHT - 2][x] = 1;
    }

    // Gaps in the ground (5 gaps, 2 tiles each, with wall warnings)
    const gaps = [
        { start: 18, warn: 17 },
        { start: 38, warn: 37 },
        { start: 58, warn: 57 },
        { start: 78, warn: 77 },
        { start: 100, warn: 99 },
    ];
    for (const gap of gaps) {
        for (let x = gap.start; x <= gap.start + 1; x++) {
            map[LEVEL2_HEIGHT - 1][x] = 0;
            map[LEVEL2_HEIGHT - 2][x] = 0;
        }
        map[LEVEL2_HEIGHT - 3][gap.warn] = 3;
    }

    // Castle wall structures — pillars and arches
    // Tall pillars
    const pillars = [10, 30, 50, 70, 90, 110];
    for (const px of pillars) {
        for (let h = 3; h <= 6; h++) {
            map[LEVEL2_HEIGHT - h][px] = 3;
        }
    }

    // Arch formations (wall-gap-wall pattern above ground)
    const arches = [
        { x: 24, topY: LEVEL2_HEIGHT - 6 },
        { x: 44, topY: LEVEL2_HEIGHT - 6 },
        { x: 64, topY: LEVEL2_HEIGHT - 6 },
        { x: 84, topY: LEVEL2_HEIGHT - 6 },
    ];
    for (const arch of arches) {
        // Two wall columns with a gap between
        for (let h = 3; h <= 5; h++) {
            map[LEVEL2_HEIGHT - h][arch.x] = 3;
            map[LEVEL2_HEIGHT - h][arch.x + 3] = 3;
        }
        // Top connecting piece
        map[arch.topY][arch.x + 1] = 3;
        map[arch.topY][arch.x + 2] = 3;
    }

    // Floating platforms — staircase patterns for multi-tier jumps
    // Max jump ~3.9 tiles. Ground at y=22. y=20 from ground, y=18 from y=20, y=16 from y=18.
    const platforms = [
        // Section 1 (x=5-17): intro stepping
        { x: 5, y: 20, w: 4 },
        { x: 12, y: 20, w: 3 },
        { x: 13, y: 18, w: 3 },   // step up from y=20

        // Section 2 (x=20-37): past gap 1
        { x: 21, y: 20, w: 5 },
        { x: 28, y: 20, w: 4 },
        { x: 29, y: 18, w: 3 },   // step up
        { x: 34, y: 20, w: 4 },

        // Section 3 (x=40-57): mid-level challenge
        { x: 40, y: 20, w: 4 },
        { x: 41, y: 18, w: 3 },
        { x: 42, y: 16, w: 3 },   // highest tier (from y=18)
        { x: 47, y: 20, w: 5 },
        { x: 53, y: 19, w: 4 },

        // Section 4 (x=60-77): dungeon corridors
        { x: 60, y: 20, w: 4 },
        { x: 66, y: 20, w: 5 },
        { x: 67, y: 18, w: 3 },
        { x: 73, y: 20, w: 4 },
        { x: 74, y: 18, w: 3 },
        { x: 75, y: 16, w: 3 },   // highest tier

        // Section 5 (x=80-99): gauntlet
        { x: 80, y: 20, w: 4 },
        { x: 85, y: 19, w: 4 },
        { x: 91, y: 20, w: 4 },
        { x: 92, y: 18, w: 3 },
        { x: 96, y: 20, w: 4 },

        // Section 6 (x=102-118): final stretch
        { x: 103, y: 20, w: 5 },
        { x: 104, y: 18, w: 3 },
        { x: 110, y: 20, w: 4 },
        { x: 114, y: 19, w: 4 },
    ];

    for (const p of platforms) {
        for (let x = p.x; x < p.x + p.w; x++) {
            if (x < LEVEL2_WIDTH) map[p.y][x] = 2;
        }
    }

    // Coins — ~30 positions on/above platforms and ground
    const coinPositions = [
        [6, 19], [8, 19],             // on platform y=20
        [14, 17], [15, 17],           // on upper platform y=18
        [22, 19], [23, 19], [25, 19], // on platform y=20
        [29, 17], [30, 17],           // on upper platform y=18
        [35, 19], [36, 19],           // on platform y=20
        [42, 15], [43, 15],           // on highest tier y=16
        [48, 19], [49, 19],           // on platform y=20
        [54, 18],                     // on platform y=19
        [61, 19], [62, 19],           // on platform y=20
        [68, 17], [69, 17],           // on upper platform y=18
        [75, 15], [76, 15],           // on highest tier y=16
        [81, 19], [82, 19],           // on platform y=20
        [86, 18], [87, 18],           // on platform y=19
        [93, 17],                     // on upper platform y=18
        [104, 17], [105, 17],         // on upper platform y=18
        [115, 18],                    // on platform y=19
    ];
    for (const [cx, cy] of coinPositions) {
        if (cx < LEVEL2_WIDTH && cy < LEVEL2_HEIGHT) map[cy][cx] = 4;
    }

    // Enemy spawns — ~15 enemies, more skeletons and bats
    const enemySpawns: [number, number, number][] = [
        [8, LEVEL2_HEIGHT - 3, 5],    // slime on ground
        [15, 16, 7],                   // bat near upper platform
        [23, LEVEL2_HEIGHT - 3, 6],   // skeleton on ground
        [32, LEVEL2_HEIGHT - 3, 5],   // slime on ground
        [36, 16, 7],                   // bat flying
        [43, LEVEL2_HEIGHT - 3, 6],   // skeleton on ground
        [48, 16, 7],                   // bat near platforms
        [55, LEVEL2_HEIGHT - 3, 6],   // skeleton on ground
        [62, LEVEL2_HEIGHT - 3, 5],   // slime on ground
        [68, 16, 7],                   // bat near upper platform
        [75, LEVEL2_HEIGHT - 3, 6],   // skeleton on ground
        [82, 16, 7],                   // bat flying
        [88, LEVEL2_HEIGHT - 3, 6],   // skeleton on ground
        [95, LEVEL2_HEIGHT - 3, 6],   // skeleton on ground
        [112, LEVEL2_HEIGHT - 3, 5],  // slime near end
    ];
    for (const [ex, ey, et] of enemySpawns) {
        if (ex < LEVEL2_WIDTH && ey < LEVEL2_HEIGHT) map[ey][ex] = et;
    }

    // Level end trigger
    map[LEVEL2_HEIGHT - 3][LEVEL2_WIDTH - 3] = 8;
    map[LEVEL2_HEIGHT - 4][LEVEL2_WIDTH - 3] = 8;

    return map;
}

export function getWorldWidth(level: number = 1): number {
    const width = level === 2 ? LEVEL2_WIDTH : LEVEL1_WIDTH;
    return width * TILE_SIZE;
}

export function getWorldHeight(level: number = 1): number {
    const height = level === 2 ? LEVEL2_HEIGHT : LEVEL1_HEIGHT;
    return height * TILE_SIZE;
}
