import { MAP_KEY, WORLD_TILE_KEY, ITEM_TILE_KEY, PLAYER_KEY, MENU_KEY, ITEM_KEY } from 'constants/cfg'
import { STARTING_CELL } from 'constants/game'
import { SCENE_GAME } from 'constants/scenes'

function progress(value) {
  console.log(value)
} 

function fileProgress(file) {
  console.log(file.src)
}

function complete(scene) {
  return () => scene.scene.start(SCENE_GAME)
}

function registerCallbacks(scene) {
  scene.load.on('progress', progress)
  scene.load.on('fileprogress', fileProgress) 
  scene.load.once('complete', complete(scene)) 
}

function initPreload(scene) {
  scene.load.bitmapFont('pressstart8', '../assets/fonts/pressstart10.png', '../assets/fonts/pressstart10.fnt')
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
  data.chars.forEach(function(char) {
    scene.load.audio(char.sfx.talk, `../assets/sfx/${char.sfx.talk}.wav`)
    scene.load.spritesheet(char.sprite, `../assets/sprites/${char.sprite}.png`, { frameWidth: 16, frameHeight: 16})
  })
}

function loadMap(scene, data) {
  scene.load.tilemapTiledJSON(data.map + MAP_KEY, `../data/maps/${data.map}.json`)
}

function loadMusic(scene, data) {
  //this.load.audio(MUSIC_KEY, '../assets/music.wav')
}

var manager 
var preloadInitialized = false
var loadInitialized = false

function LoadManager() {
  if (!manager) {
    manager = {
      preload(scene) {
        if (!preloadInitialized) {
          preloadInitialized = true
          initPreload(scene)
        }
      },
      async load(scene, data) {
        registerCallbacks(scene)

        if (!loadInitialized) {
          initLoad(scene)
          loadInitialized = true
        }
        // load the map
        loadMap(scene, data)

        // lad music
        loadMusic(scene, data)

        // load all npcs
        loadNPCs(scene, data)

        scene.load.start()
      },
    }
  }
  
  return manager
}

export default LoadManager