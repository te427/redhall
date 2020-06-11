import { FILE_ASSET_FONTS_PRESS_START_24_IMG, FILE_ASSET_FONTS_PRESS_START_24_MAP, FILE_ASSET_FONTS_PRESS_START_16_IMG, FILE_ASSET_FONTS_PRESS_START_16_MAP, FILE_ASSET_TILES_WEATHER, FILE_ASSET_TILES_COMBAT, FILE_ASSET_TILES_WORLD, FILE_ASSET_TILES_BYPASS, FILE_ASSET_TILES_MENUS, FILE_DATA_MAP_WEATHER, FILE_DATA_MAP_MENU_DIALOGUE, FILE_ASSET_SPRITES_PLAYER, FILE_ASSET_SFX_PLAYER_MOVE, FILE_DATA_MAP_MENU_INVENTORY, FILE_DATA_MAP_MENU_NOTIFICATION, FILE_ASSET_SPRITES_INGREDIENTS, FILE_ASSET_SPRITES_COMBAT, FILE_ASSET_SFX_PLAYER_ATTACK, FILE_ASSET_SFX_PLAYER_HIT } from 'managers/data/constants/files'
import { NPC_SFX_PATH, NPC_SPRITE_PATH, MAP_PATH, MUSIC_PATH, CELL_MAP_PATH, TILES_PATH, ENEMY_SPRITE_PATH, ENEMY_SFX_PATH } from 'managers/data/constants/paths'
import { DIALOGUE_KEY, ITEM_TILE_KEY, MAP_KEY, MENU_TILE_KEY, MUSIC_KEY, PLAYER_KEY, WORLD_TILE_KEY, SFX_MOVE_KEY, TITLE_FONT_KEY, MENU_FONT_KEY, INVENTORY_KEY, INGREDIENTS_SPRITE_KEY, WEATHER_TILE_KEY, WEATHER_KEY, COMBAT_SPRITE_KEY, SFX_ATTACK_KEY, SFX_HIT_KEY, NOTIFICATION_KEY} from 'constants/keys'
import { E_LOAD_CELL_DATA, E_LOAD_SCENE } from 'events/types'

import handler from 'events/handler'
import { fnt, json, loadPath, mp3, path, png, wav, yaml } from 'helpers/files'
import { npcSFXKey, npcSpriteKey, playerSFXKey, mapKey, enemySFXKey, enemySpriteKey } from 'helpers/keys'
import { TILE_SIZE } from 'constants/dimensions/game'

function progress(value) {
  console.log(value)
} 

function fileProgress(file) {
  console.log(file.src)
}

function complete() {
  manager.emit(E_LOAD_SCENE)
}

function registerCallbacks(scene) {
  scene.load.on('progress', progress)
  scene.load.on('fileprogress', fileProgress) 
  scene.load.once('complete', complete) 
}

function initPreload(scene) {
  scene.load.bitmapFont(TITLE_FONT_KEY, loadPath(FILE_ASSET_FONTS_PRESS_START_24_IMG),
    loadPath(FILE_ASSET_FONTS_PRESS_START_24_MAP))
  scene.load.bitmapFont(MENU_FONT_KEY, loadPath(FILE_ASSET_FONTS_PRESS_START_16_IMG),
    loadPath(FILE_ASSET_FONTS_PRESS_START_16_MAP))
}

function initLoad(scene) {
  // load general things (should only do once)
  scene.load.image(ITEM_TILE_KEY, loadPath(FILE_ASSET_TILES_BYPASS))
  scene.load.image(MENU_TILE_KEY, loadPath(FILE_ASSET_TILES_MENUS))
  scene.load.image(WEATHER_TILE_KEY, loadPath(FILE_ASSET_TILES_WEATHER))

  scene.load.tilemapTiledJSON(DIALOGUE_KEY, loadPath(FILE_DATA_MAP_MENU_DIALOGUE))
  scene.load.tilemapTiledJSON(INVENTORY_KEY, loadPath(FILE_DATA_MAP_MENU_INVENTORY))
  scene.load.tilemapTiledJSON(NOTIFICATION_KEY, loadPath(FILE_DATA_MAP_MENU_NOTIFICATION))
  scene.load.tilemapTiledJSON(WEATHER_KEY, loadPath(FILE_DATA_MAP_WEATHER))

  scene.load.spritesheet(COMBAT_SPRITE_KEY, loadPath(FILE_ASSET_SPRITES_COMBAT), { frameWidth: TILE_SIZE, frameHeight: TILE_SIZE})

  // load player info
  scene.load.spritesheet(PLAYER_KEY, loadPath(FILE_ASSET_SPRITES_PLAYER), { frameWidth: TILE_SIZE, frameHeight: TILE_SIZE})
  scene.load.audio(playerSFXKey(SFX_MOVE_KEY), loadPath(FILE_ASSET_SFX_PLAYER_MOVE))
  scene.load.audio(playerSFXKey(SFX_ATTACK_KEY), loadPath(FILE_ASSET_SFX_PLAYER_ATTACK))
  scene.load.audio(playerSFXKey(SFX_HIT_KEY), loadPath(FILE_ASSET_SFX_PLAYER_HIT))

  // load other assets
  scene.load.spritesheet(INGREDIENTS_SPRITE_KEY, loadPath(FILE_ASSET_SPRITES_INGREDIENTS), { frameWidth: TILE_SIZE, frameHeight: TILE_SIZE})
}

function loadNPCs(scene, data) {
  if (data.npcs) {
    data.npcs.forEach(function(npc) {
      scene.load.audio(npcSFXKey(npc, npc.sfx.talk), loadPath(NPC_SFX_PATH, wav(npc.sfx.talk)))
      scene.load.spritesheet(npcSpriteKey(npc, npc.sprite), loadPath(NPC_SPRITE_PATH, png(npc.sprite)), { frameWidth: TILE_SIZE, frameHeight: TILE_SIZE})
    })
  }
}

function loadEnemies(scene, data) {
  if (data.enemies) {
    data.enemies.forEach(function(enemy) {
      //scene.load.audio(enemySFXKey(npc, npc.sfx.talk), loadPath(NPC_SFX_PATH, wav(npc.sfx.talk)))
      scene.load.spritesheet(enemySpriteKey(enemy, enemy.sprite), loadPath(ENEMY_SPRITE_PATH, png(enemy.sprite)), { frameWidth: TILE_SIZE, frameHeight: TILE_SIZE})
      enemy.sfx.forEach(fx => scene.load.audio(enemySFXKey(enemy, fx), loadPath(ENEMY_SFX_PATH, wav(fx))))
    })
  }
}

function loadMap(scene, data) {
  scene.load.image(data.tiles, loadPath(TILES_PATH, png(data.tiles)))

  scene.load.tilemapTiledJSON(mapKey(data.map), loadPath(CELL_MAP_PATH, json(data.map)))
}

function loadMusic(scene, data) {
  scene.load.audio(MUSIC_KEY, loadPath(MUSIC_PATH, mp3(data.music)))
}

function loadCell(data) {
  if (!loadInitialized) {
    initLoad(scene)
    loadInitialized = true
  }

  loadMap(scene, data)
  loadMusic(scene, data)
  loadNPCs(scene, data)
  loadEnemies(scene, data)

  scene.load.start()
}

var manager 
var scene 
var preloadInitialized = false
var loadInitialized = false

function LoadManager() {
  if (!manager) {
    manager = {
      ...handler,
      preload(scene) {
        if (!preloadInitialized) {
          preloadInitialized = true
          initPreload(scene)
        }
      },
      async init(newScene) {
        scene = newScene
        
        registerCallbacks(scene)
      },
    }

    manager.on(E_LOAD_CELL_DATA, loadCell)
  }
  
  return manager
}

export default LoadManager