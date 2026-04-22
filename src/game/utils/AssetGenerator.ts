import { Scene } from 'phaser';
import { TILE_SIZE } from '../config/GameConfig';

// Generates all pixel art textures programmatically
export function generateAllAssets(scene: Scene): void {
    generatePlayerSprites(scene);
    generateTileTextures(scene);
    generateParallaxBackgrounds(scene);
    generateEnemySprites(scene);
    generateItemSprites(scene);
    generateUITextures(scene);
}

// Helper: after drawing a spritesheet on a canvas texture, add frame data
function addFrames(scene: Scene, key: string, frameWidth: number, frameHeight: number, frameCount: number): void {
    const texture = scene.textures.get(key);
    for (let i = 0; i < frameCount; i++) {
        texture.add(i, 0, i * frameWidth, 0, frameWidth, frameHeight);
    }
}

function generatePlayerSprites(scene: Scene): void {
    const s = TILE_SIZE;

    // Player idle spritesheet (2 frames)
    const idleCanvas = scene.textures.createCanvas('player_idle', s * 2, s);
    const idleCtx = idleCanvas!.getContext();
    for (let f = 0; f < 2; f++) {
        const ox = f * s;
        idleCtx.fillStyle = '#3355cc';
        idleCtx.fillRect(ox + 8, 8, 16, 16);
        idleCtx.fillStyle = '#ffcc99';
        idleCtx.fillRect(ox + 10, 2, 12, 10);
        idleCtx.fillStyle = '#000000';
        idleCtx.fillRect(ox + 12, 5, 2, 2);
        idleCtx.fillRect(ox + 18, 5, 2, 2);
        idleCtx.fillStyle = '#224488';
        idleCtx.fillRect(ox + 10, 24, 4, 6);
        idleCtx.fillRect(ox + 18, 24, 4, f === 0 ? 6 : 8);
        idleCtx.fillStyle = '#aaaaaa';
        idleCtx.fillRect(ox + 24, 12, 4, 2);
        idleCtx.fillRect(ox + 26, 10, 2, 6);
    }
    idleCanvas!.refresh();
    addFrames(scene, 'player_idle', s, s, 2);

    // Player run spritesheet (4 frames)
    const runCanvas = scene.textures.createCanvas('player_run', s * 4, s);
    const runCtx = runCanvas!.getContext();
    for (let f = 0; f < 4; f++) {
        const ox = f * s;
        runCtx.fillStyle = '#3355cc';
        runCtx.fillRect(ox + 8, 8, 16, 16);
        runCtx.fillStyle = '#ffcc99';
        runCtx.fillRect(ox + 10, 2, 12, 10);
        runCtx.fillStyle = '#000000';
        runCtx.fillRect(ox + 14, 5, 2, 2);
        runCtx.fillRect(ox + 20, 5, 2, 2);
        runCtx.fillStyle = '#224488';
        const legOff = [0, 2, 0, -2];
        runCtx.fillRect(ox + 10, 24 + legOff[f], 4, 6);
        runCtx.fillRect(ox + 18, 24 - legOff[f], 4, 6);
        runCtx.fillStyle = '#aaaaaa';
        runCtx.fillRect(ox + 24, 14, 6, 2);
    }
    runCanvas!.refresh();
    addFrames(scene, 'player_run', s, s, 4);

    // Player jump (1 frame)
    const jumpCanvas = scene.textures.createCanvas('player_jump', s, s);
    const jumpCtx = jumpCanvas!.getContext();
    jumpCtx.fillStyle = '#3355cc';
    jumpCtx.fillRect(8, 6, 16, 16);
    jumpCtx.fillStyle = '#ffcc99';
    jumpCtx.fillRect(10, 0, 12, 10);
    jumpCtx.fillStyle = '#000000';
    jumpCtx.fillRect(12, 3, 2, 2);
    jumpCtx.fillRect(18, 3, 2, 2);
    jumpCtx.fillStyle = '#224488';
    jumpCtx.fillRect(10, 22, 4, 4);
    jumpCtx.fillRect(18, 22, 4, 4);
    jumpCtx.fillStyle = '#aaaaaa';
    jumpCtx.fillRect(24, 8, 4, 2);
    jumpCtx.fillRect(26, 6, 2, 8);
    jumpCanvas!.refresh();

    // Player crouch (1 frame)
    const crouchCanvas = scene.textures.createCanvas('player_crouch', s, s);
    const crouchCtx = crouchCanvas!.getContext();
    crouchCtx.fillStyle = '#3355cc';
    crouchCtx.fillRect(8, 14, 16, 12);
    crouchCtx.fillStyle = '#ffcc99';
    crouchCtx.fillRect(10, 8, 12, 10);
    crouchCtx.fillStyle = '#000000';
    crouchCtx.fillRect(12, 11, 2, 2);
    crouchCtx.fillRect(18, 11, 2, 2);
    crouchCtx.fillStyle = '#224488';
    crouchCtx.fillRect(10, 26, 12, 4);
    crouchCanvas!.refresh();

    // Player attack spritesheet (3 frames)
    const atkCanvas = scene.textures.createCanvas('player_attack', s * 3, s);
    const atkCtx = atkCanvas!.getContext();
    for (let f = 0; f < 3; f++) {
        const ox = f * s;
        atkCtx.fillStyle = '#3355cc';
        atkCtx.fillRect(ox + 6, 8, 16, 16);
        atkCtx.fillStyle = '#ffcc99';
        atkCtx.fillRect(ox + 8, 2, 12, 10);
        atkCtx.fillStyle = '#000000';
        atkCtx.fillRect(ox + 10, 5, 2, 2);
        atkCtx.fillRect(ox + 16, 5, 2, 2);
        atkCtx.fillStyle = '#224488';
        atkCtx.fillRect(ox + 8, 24, 4, 6);
        atkCtx.fillRect(ox + 16, 24, 4, 6);
        atkCtx.fillStyle = '#cccccc';
        if (f === 0) {
            atkCtx.fillRect(ox + 22, 4, 3, 14);
        } else if (f === 1) {
            atkCtx.fillRect(ox + 22, 10, 10, 3);
        } else {
            atkCtx.fillRect(ox + 22, 16, 3, 14);
        }
    }
    atkCanvas!.refresh();
    addFrames(scene, 'player_attack', s, s, 3);
}

function generateTileTextures(scene: Scene): void {
    const s = TILE_SIZE;

    // Ground tile
    const groundCanvas = scene.textures.createCanvas('tile_ground', s, s);
    const groundCtx = groundCanvas!.getContext();
    groundCtx.fillStyle = '#5a3a1a';
    groundCtx.fillRect(0, 0, s, s);
    groundCtx.fillStyle = '#4a7a2a';
    groundCtx.fillRect(0, 0, s, 6);
    groundCtx.fillStyle = '#6a4a2a';
    groundCtx.fillRect(4, 8, 4, 4);
    groundCtx.fillRect(16, 20, 6, 4);
    groundCtx.fillRect(24, 12, 4, 3);
    groundCtx.fillStyle = '#3a2a10';
    groundCtx.fillRect(12, 14, 3, 3);
    groundCtx.fillRect(22, 24, 5, 3);
    groundCanvas!.refresh();

    // Platform tile
    const platCanvas = scene.textures.createCanvas('tile_platform', s, s);
    const platCtx = platCanvas!.getContext();
    platCtx.fillStyle = '#666666';
    platCtx.fillRect(0, 0, s, s);
    platCtx.fillStyle = '#888888';
    platCtx.fillRect(0, 0, s, 4);
    platCtx.fillStyle = '#555555';
    platCtx.fillRect(0, 4, s, 2);
    // Brick pattern
    platCtx.fillStyle = '#777777';
    platCtx.fillRect(1, 8, 14, 10);
    platCtx.fillRect(17, 8, 14, 10);
    platCtx.fillRect(8, 20, 14, 10);
    platCanvas!.refresh();

    // Wall tile
    const wallCanvas = scene.textures.createCanvas('tile_wall', s, s);
    const wallCtx = wallCanvas!.getContext();
    wallCtx.fillStyle = '#555555';
    wallCtx.fillRect(0, 0, s, s);
    wallCtx.fillStyle = '#666666';
    wallCtx.fillRect(1, 1, 14, 14);
    wallCtx.fillRect(17, 17, 14, 14);
    wallCtx.fillStyle = '#444444';
    wallCtx.fillRect(1, 17, 14, 14);
    wallCtx.fillRect(17, 1, 14, 14);
    wallCanvas!.refresh();

    // Level end marker
    const endCanvas = scene.textures.createCanvas('tile_end', s, s * 2);
    const endCtx = endCanvas!.getContext();
    // Flag pole
    endCtx.fillStyle = '#8B4513';
    endCtx.fillRect(14, 0, 4, s * 2);
    // Flag
    endCtx.fillStyle = '#ff0000';
    endCtx.fillRect(18, 4, 12, 10);
    endCtx.fillStyle = '#cc0000';
    endCtx.fillRect(18, 8, 12, 6);
    endCanvas!.refresh();
}

function generateParallaxBackgrounds(scene: Scene): void {
    const w = 1024;
    const h = 768;

    // Sky layer
    const skyCanvas = scene.textures.createCanvas('bg_sky', w, h);
    const skyCtx = skyCanvas!.getContext();
    const skyGrad = skyCtx.createLinearGradient(0, 0, 0, h);
    skyGrad.addColorStop(0, '#0a0a2a');
    skyGrad.addColorStop(0.4, '#1a1a4a');
    skyGrad.addColorStop(0.7, '#2a2a5a');
    skyGrad.addColorStop(1, '#3a3a6a');
    skyCtx.fillStyle = skyGrad;
    skyCtx.fillRect(0, 0, w, h);
    // Stars
    skyCtx.fillStyle = '#ffffff';
    for (let i = 0; i < 60; i++) {
        const sx = (i * 137 + 53) % w;
        const sy = (i * 89 + 17) % (h * 0.5);
        const ss = (i % 3) + 1;
        skyCtx.fillRect(sx, sy, ss, ss);
    }
    // Moon
    skyCtx.fillStyle = '#ffffcc';
    skyCtx.beginPath();
    skyCtx.arc(800, 100, 30, 0, Math.PI * 2);
    skyCtx.fill();
    skyCtx.fillStyle = '#0a0a2a';
    skyCtx.beginPath();
    skyCtx.arc(810, 90, 25, 0, Math.PI * 2);
    skyCtx.fill();
    skyCanvas!.refresh();

    // Mountains layer
    const mtCanvas = scene.textures.createCanvas('bg_mountains', w, h);
    const mtCtx = mtCanvas!.getContext();
    mtCtx.clearRect(0, 0, w, h);
    mtCtx.fillStyle = '#1a1a3a';
    // Mountain shapes
    const mountains = [
        [0, 600, 200, 300, 400, 600],
        [300, 600, 500, 250, 700, 600],
        [600, 600, 750, 280, 900, 600],
        [800, 600, 950, 320, 1024, 600],
    ];
    for (const m of mountains) {
        mtCtx.beginPath();
        mtCtx.moveTo(m[0], m[1]);
        mtCtx.lineTo(m[2], m[3]);
        mtCtx.lineTo(m[4], m[5]);
        mtCtx.closePath();
        mtCtx.fill();
    }
    // Snow caps
    mtCtx.fillStyle = '#4a4a6a';
    for (const m of mountains) {
        mtCtx.beginPath();
        mtCtx.moveTo(m[2] - 20, m[3] + 30);
        mtCtx.lineTo(m[2], m[3]);
        mtCtx.lineTo(m[2] + 20, m[3] + 30);
        mtCtx.closePath();
        mtCtx.fill();
    }
    mtCanvas!.refresh();

    // Trees layer
    const treeCanvas = scene.textures.createCanvas('bg_trees', w, h);
    const treeCtx = treeCanvas!.getContext();
    treeCtx.clearRect(0, 0, w, h);
    // Tree silhouettes
    const treePositions = [50, 120, 200, 280, 380, 450, 530, 620, 700, 780, 860, 940];
    for (const tx of treePositions) {
        const th = 80 + (tx * 7) % 60;
        // Trunk
        treeCtx.fillStyle = '#1a2a1a';
        treeCtx.fillRect(tx - 4, h - th, 8, th);
        // Canopy
        treeCtx.fillStyle = '#1a3a1a';
        treeCtx.beginPath();
        treeCtx.moveTo(tx - 25, h - th);
        treeCtx.lineTo(tx, h - th - 40);
        treeCtx.lineTo(tx + 25, h - th);
        treeCtx.closePath();
        treeCtx.fill();
        treeCtx.beginPath();
        treeCtx.moveTo(tx - 20, h - th - 20);
        treeCtx.lineTo(tx, h - th - 55);
        treeCtx.lineTo(tx + 20, h - th - 20);
        treeCtx.closePath();
        treeCtx.fill();
    }
    treeCanvas!.refresh();
}

function generateEnemySprites(scene: Scene): void {
    const s = TILE_SIZE;

    // Slime (2 frames)
    const slimeCanvas = scene.textures.createCanvas('enemy_slime', s * 2, s);
    const slimeCtx = slimeCanvas!.getContext();
    for (let f = 0; f < 2; f++) {
        const ox = f * s;
        const squish = f === 0 ? 0 : 2;
        slimeCtx.fillStyle = '#33cc33';
        // Body - dome shape approximation
        slimeCtx.fillRect(ox + 4, 12 + squish, 24, 18 - squish);
        slimeCtx.fillRect(ox + 6, 8 + squish, 20, 4);
        slimeCtx.fillRect(ox + 8, 6 + squish, 16, 4);
        // Eyes
        slimeCtx.fillStyle = '#ffffff';
        slimeCtx.fillRect(ox + 10, 14 + squish, 4, 4);
        slimeCtx.fillRect(ox + 18, 14 + squish, 4, 4);
        slimeCtx.fillStyle = '#000000';
        slimeCtx.fillRect(ox + 12, 16 + squish, 2, 2);
        slimeCtx.fillRect(ox + 20, 16 + squish, 2, 2);
        // Highlight
        slimeCtx.fillStyle = '#66ff66';
        slimeCtx.fillRect(ox + 10, 10 + squish, 4, 2);
    }
    slimeCanvas!.refresh();
    addFrames(scene, 'enemy_slime', s, s, 2);
    const skelCanvas = scene.textures.createCanvas('enemy_skeleton', s * 2, s);
    const skelCtx = skelCanvas!.getContext();
    for (let f = 0; f < 2; f++) {
        const ox = f * s;
        // Skull
        skelCtx.fillStyle = '#ddddcc';
        skelCtx.fillRect(ox + 10, 2, 12, 10);
        // Eye sockets
        skelCtx.fillStyle = '#000000';
        skelCtx.fillRect(ox + 12, 4, 3, 3);
        skelCtx.fillRect(ox + 17, 4, 3, 3);
        // Teeth
        skelCtx.fillStyle = '#ddddcc';
        skelCtx.fillRect(ox + 12, 10, 2, 2);
        skelCtx.fillRect(ox + 16, 10, 2, 2);
        skelCtx.fillRect(ox + 20, 10, 2, 2);
        // Ribcage
        skelCtx.fillStyle = '#ccccbb';
        skelCtx.fillRect(ox + 12, 12, 8, 2);
        skelCtx.fillRect(ox + 10, 14, 12, 2);
        skelCtx.fillRect(ox + 12, 16, 8, 2);
        skelCtx.fillRect(ox + 10, 18, 12, 2);
        // Spine
        skelCtx.fillRect(ox + 14, 12, 4, 12);
        // Legs
        skelCtx.fillRect(ox + 10, 24, 4, f === 0 ? 6 : 8);
        skelCtx.fillRect(ox + 18, 24, 4, f === 0 ? 8 : 6);
        // Weapon (bone)
        skelCtx.fillStyle = '#eeeedd';
        skelCtx.fillRect(ox + 24, 14, 6, 2);
    }
    skelCanvas!.refresh();
    addFrames(scene, 'enemy_skeleton', s, s, 2);
    const batCanvas = scene.textures.createCanvas('enemy_bat', s * 2, s);
    const batCtx = batCanvas!.getContext();
    for (let f = 0; f < 2; f++) {
        const ox = f * s;
        const wingY = f === 0 ? 0 : 4;
        // Body
        batCtx.fillStyle = '#442244';
        batCtx.fillRect(ox + 12, 12, 8, 8);
        // Head
        batCtx.fillRect(ox + 13, 8, 6, 6);
        // Eyes (red)
        batCtx.fillStyle = '#ff0000';
        batCtx.fillRect(ox + 14, 10, 2, 2);
        batCtx.fillRect(ox + 18, 10, 2, 2);
        // Ears
        batCtx.fillStyle = '#442244';
        batCtx.fillRect(ox + 12, 6, 2, 4);
        batCtx.fillRect(ox + 20, 6, 2, 4);
        // Wings
        batCtx.fillStyle = '#553355';
        batCtx.fillRect(ox + 2, 10 + wingY, 10, 6 - wingY);
        batCtx.fillRect(ox + 22, 10 + wingY, 10, 6 - wingY);
        // Wing tips
        batCtx.fillRect(ox + 0, 12 + wingY, 4, 3);
        batCtx.fillRect(ox + 28, 12 + wingY, 4, 3);
    }
    batCanvas!.refresh();
    addFrames(scene, 'enemy_bat', s, s, 2);
    const boneCanvas = scene.textures.createCanvas('projectile_bone', 16, 8);
    const boneCtx = boneCanvas!.getContext();
    boneCtx.fillStyle = '#eeeecc';
    boneCtx.fillRect(2, 2, 12, 4);
    boneCtx.fillRect(0, 0, 4, 8);
    boneCtx.fillRect(12, 0, 4, 8);
    boneCanvas!.refresh();
}

function generateItemSprites(scene: Scene): void {
    const s = 16;

    // Coin (4 frames for spin animation)
    const coinCanvas = scene.textures.createCanvas('item_coin', s * 4, s);
    const coinCtx = coinCanvas!.getContext();
    const coinWidths = [12, 8, 4, 8];
    for (let f = 0; f < 4; f++) {
        const ox = f * s;
        const w = coinWidths[f];
        const offsetX = (s - w) / 2;
        coinCtx.fillStyle = '#ffcc00';
        coinCtx.fillRect(ox + offsetX, 2, w, 12);
        coinCtx.fillStyle = '#ffdd44';
        coinCtx.fillRect(ox + offsetX + 1, 3, w - 2, 2);
        if (w >= 8) {
            coinCtx.fillStyle = '#aa8800';
            coinCtx.fillRect(ox + offsetX + Math.floor(w / 2) - 1, 6, 3, 4);
        }
    }
    coinCanvas!.refresh();
    addFrames(scene, 'item_coin', s, s, 4);
    const heartCanvas = scene.textures.createCanvas('item_heart', s, s);
    const heartCtx = heartCanvas!.getContext();
    heartCtx.fillStyle = '#ff2244';
    heartCtx.fillRect(2, 4, 5, 5);
    heartCtx.fillRect(9, 4, 5, 5);
    heartCtx.fillRect(1, 6, 14, 4);
    heartCtx.fillRect(3, 10, 10, 3);
    heartCtx.fillRect(5, 13, 6, 2);
    heartCtx.fillRect(7, 15, 2, 1);
    heartCtx.fillStyle = '#ff6688';
    heartCtx.fillRect(3, 5, 2, 2);
    heartCanvas!.refresh();
}

function generateUITextures(scene: Scene): void {
    // Health bar background
    const hbBgCanvas = scene.textures.createCanvas('ui_healthbar_bg', 104, 16);
    const hbBgCtx = hbBgCanvas!.getContext();
    hbBgCtx.fillStyle = '#333333';
    hbBgCtx.fillRect(0, 0, 104, 16);
    hbBgCtx.fillStyle = '#111111';
    hbBgCtx.fillRect(2, 2, 100, 12);
    hbBgCanvas!.refresh();

    // Health bar fill
    const hbCanvas = scene.textures.createCanvas('ui_healthbar', 100, 12);
    const hbCtx = hbCanvas!.getContext();
    hbCtx.fillStyle = '#cc2222';
    hbCtx.fillRect(0, 0, 100, 12);
    hbCtx.fillStyle = '#ff4444';
    hbCtx.fillRect(0, 0, 100, 4);
    hbCanvas!.refresh();

    // Sword icon
    const swordCanvas = scene.textures.createCanvas('ui_sword', 20, 20);
    const swordCtx = swordCanvas!.getContext();
    swordCtx.fillStyle = '#aaaaaa';
    swordCtx.fillRect(8, 0, 4, 14);
    swordCtx.fillStyle = '#8B4513';
    swordCtx.fillRect(4, 14, 12, 3);
    swordCtx.fillRect(7, 17, 6, 3);
    swordCanvas!.refresh();
}
