# Copilot Instructions — Shadow Blade (copilotDevoxxGame)

## Build & Run

```bash
npm run dev          # Dev server with hot reload (Vite)
npm run build        # Production build
npm run dev-nolog    # Dev without Phaser console log
npm run build-nolog  # Build without Phaser console log
```

No test suite. Validate by running `npm run build` (vue-tsc + Vite) and checking the game in browser.

## Architecture

This is a 2D Metroidvania/platformer built with **Phaser 4.0.0** + **Vue 3** + **TypeScript** + **Vite**.

Vue serves as a thin shell (`App.vue` → `PhaserGame.vue`). All game logic lives in Phaser scenes and classes under `src/game/`.

### Scene flow

```
Boot → Preloader → MainMenu → Level1 → Shop → Level1 (loop)
                                    ↘ GameOver → Level1 / MainMenu
```

### Key directories

- `src/game/scenes/` — Phaser scenes (Boot, Preloader, MainMenu, Level1, Shop, GameOver)
- `src/game/entities/` — Game objects: Player, Enemy (base), Slime, Skeleton, Bat, Coin
- `src/game/systems/` — ParallaxManager (multi-layer scrolling backgrounds)
- `src/game/config/` — Constants and data: GameConfig, LevelConfig, EnemyConfig, CraftingRecipes
- `src/game/ui/` — HUD (health bar, coins, weapon icon)
- `src/game/utils/` — AssetGenerator (all pixel art sprites generated programmatically via Canvas)
- `src/game/EventBus.ts` — Phaser EventEmitter for cross-component communication

### Communication pattern

Phaser scenes communicate via `EventBus` (a shared `Phaser.Events.EventEmitter`). Key events:
- `player-attack` — emitted with hitbox, damage, effect when player swings sword
- `player-health-changed` / `player-coins-changed` — HUD updates
- `player-died` — triggers GameOver transition
- `enemy-killed` — spawns coin drops
- `current-scene-ready` — bridges Phaser ↔ Vue

## Conventions

- **All assets are generated programmatically** in `AssetGenerator.ts` using `scene.textures.createCanvas()`. No external image files are required. To add new sprites, add a function in AssetGenerator and call it from `generateAllAssets()`.
- **Levels are defined as 2D number arrays** in `LevelConfig.ts`. Tile codes: 0=empty, 1=ground, 2=platform, 3=wall, 4=coin, 5=slime, 6=skeleton, 7=bat, 8=level end.
- **Enemies extend the `Enemy` base class** and override `update()`. Each enemy type has its own file.
- **Weapon upgrades** are defined in `CraftingRecipes.ts` as a flat array with optional `requires` field for prerequisite chaining.
- **Physics**: Arcade physics with gravity (800). No Matter.js.
- **Pixel art mode** is enabled (`pixelArt: true` in game config) — textures use nearest-neighbor filtering.
- **Depth layering** uses constants from `DEPTH` in GameConfig (BG layers 0-3, tiles 10, enemies 20, player 25, HUD 100).
- Prefix unused function parameters with `_` to satisfy TypeScript strict mode.

## Adding a new enemy type

1. Create `src/game/entities/MyEnemy.ts` extending `Enemy`
2. Add sprite generation in `AssetGenerator.ts`
3. Add config entry in `EnemyConfig.ts`
4. Assign a tile code in `LevelConfig.ts` and handle it in `Level1.buildLevel()`
5. Add collision/tracking setup in `Level1.create()`

## Adding a new level

1. Create a new map array in `LevelConfig.ts` (or a new file)
2. Create `src/game/scenes/LevelN.ts` based on `Level1.ts`
3. Register the scene in `src/game/main.ts` config
4. Update the Shop scene to route to the correct next level
