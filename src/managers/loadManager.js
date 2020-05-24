import { FILE_ASSET_FONTS_PRESS_START_24_IMG, FILE_ASSET_FONTS_PRESS_START_24_MAP, FILE_ASSET_FONTS_PRESS_START_16_IMG, FILE_ASSET_FONTS_PRESS_START_16_MAP, FILE_ASSET_TILES_WORLD, FILE_ASSET_TILES_NON_COLLISION_ITEMS, FILE_ASSET_TILES_MENUS, FILE_DATA_MAP_MENU_DIALOGUE, FILE_ASSET_SPRITES_PLAYER, FILE_ASSET_SFX_PLAYER_FOOTSTEP } from 'constants/data/files'
import { NPC_SFX_PATH, NPC_SPRITE_PATH, MAP_PATH, MUSIC_PATH, CELL_MAP_PATH } from 'constants/data/paths'
import { DIALOGUE_KEY, ITEM_TILE_KEY, MAP_KEY, MENU_TILE_KEY, MUSIC_KEY, PLAYER_KEY, WORLD_TILE_KEY, PLAYER_SFX_FOOTSTEP_KEY, TITLE_FONT_KEY, MENU_FONT_KEY} from 'constants/keys'
import { E_LOAD_CELL_DATA, E_LOAD_SCENE } from 'events/types'

import handler from 'events/handler'
import { fnt, json, loadPath, mp3, path, png, wav, yaml } from 'helpers/files'
import { npcSFXKey, npcSpriteKey, playerSFXKey, mapKey } from 'helpers/keys'

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
  scene.load.image(WORLD_TILE_KEY, loadPath(FILE_ASSET_TILES_WORLD))
  scene.load.image(ITEM_TILE_KEY, loadPath(FILE_ASSET_TILES_NON_COLLISION_ITEMS))
  scene.load.image(MENU_TILE_KEY, loadPath(FILE_ASSET_TILES_MENUS))

  scene.load.tilemapTiledJSON(DIALOGUE_KEY, loadPath(FILE_DATA_MAP_MENU_DIALOGUE))

  // load player info
  scene.load.spritesheet(PLAYER_KEY, loadPath(FILE_ASSET_SPRITES_PLAYER), { frameWidth: 16, frameHeight: 16})
  scene.load.audio(playerSFXKey(PLAYER_SFX_FOOTSTEP_KEY), loadPath(FILE_ASSET_SFX_PLAYER_FOOTSTEP))
}

function loadNPCs(scene, data) {
  data.npcs.forEach(function(npc) {
    scene.load.audio(npcSFXKey(npc, npc.sfx.talk), loadPath(NPC_SFX_PATH, wav(npc.sfx.talk)))
    scene.load.spritesheet(npcSpriteKey(npc, npc.sprite), loadPath(NPC_SPRITE_PATH, png(npc.sprite)), { frameWidth: 16, frameHeight: 16})
  })
}

function loadMap(scene, data) {
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