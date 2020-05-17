import { MAP_KEY, WORLD_TILE_KEY, ITEM_TILE_KEY, PLAYER_KEY, MENU_KEY, MUSIC_KEY, MENU_FONT, TITLE_FONT } from 'constants/cfg'
import { E_LOAD_DATA, E_LOAD_SCENE } from 'events/types'
import handler from 'events/handler'

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
  scene.load.bitmapFont(TITLE_FONT, `../assets/fonts/${TITLE_FONT}.png`, `../assets/fonts/${TITLE_FONT}.fnt`)
  scene.load.bitmapFont(MENU_FONT, `../assets/fonts/${MENU_FONT}.png`, `../assets/fonts/${MENU_FONT}.fnt`)
}

function initLoad(scene) {
  // load general things (should only do once)
  scene.load.image(WORLD_TILE_KEY, '../assets/tiles/tiles.png')
  scene.load.image(ITEM_TILE_KEY, '../assets/tiles/items.png')
  scene.load.image(MENU_KEY, '../assets/sprites/menu.png')

  // load player info
  scene.load.spritesheet(PLAYER_KEY, '../assets/sprites/pc.png', { frameWidth: 16, frameHeight: 16})
  scene.load.audio('footstep', '../assets/sfx/footstep.wav')
}

function loadNPCs(scene, data) {
  data.npcs.forEach(function(npc) {
    scene.load.audio(npc.sfx.talk, `../assets/sfx/${npc.sfx.talk}.wav`)
    scene.load.spritesheet(npc.sprite, `../assets/sprites/${npc.sprite}.png`, { frameWidth: 16, frameHeight: 16})
  })
}

function loadMap(scene, data) {
  scene.load.tilemapTiledJSON(data.map + MAP_KEY, `../data/maps/${data.map}.json`)
}

function loadMusic(scene, data) {
  scene.load.audio(MUSIC_KEY, `../assets/${data.music}.wav`)
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

    manager.on(E_LOAD_DATA, loadCell)
  }
  
  return manager
}

export default LoadManager