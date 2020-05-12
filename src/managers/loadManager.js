import { CELL_PATH, MAP_KEY, TILE_KEY, BG_KEY, MUSIC_KEY, PLAYER_KEY, MENU_KEY, CELL_KEY } from 'constants/cfg'
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
  scene.load.image(TILE_KEY, '../assets/tiles/tiles.png')
  scene.load.image(MENU_KEY, '../assets/sprites/menu.png')

  // load player info
  scene.load.spritesheet(PLAYER_KEY, '../assets/sprites/pc.png', { frameWidth: 16, frameHeight: 16})
  scene.load.audio('footstep', '../assets/sfx/footstep.wav')
}

function loadNPCs(scene, data) {
  data.chars.forEach(function(char) {
    scene.load.audio(char.name, `../assets/sfx/${char.sfx.talk}.wav`)
    scene.load.spritesheet(char.name, `../assets/sprites/${char.anims.stand}.png`, { frameWidth: 16, frameHeight: 16})
  })
}

function loadMap(scene, data) {
  scene.load.tilemapCSV(data.map + MAP_KEY, `../data/maps/${data.map}.csv`)
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