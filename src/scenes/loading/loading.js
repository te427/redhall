import * as Phaser from 'phaser'
import { MAP_KEY, TILE_KEY, BG_KEY, MUSIC_KEY, PLAYER_KEY, MENU_KEY } from 'constants/cfg'
import { SCENE_LOADING, SCENE_GAME } from 'constants/scenes'

class LoadingScene extends Phaser.Scene {
  constructor() {
    super(SCENE_LOADING)
  }

  preload() {
    this.load.bitmapFont('pressstart8', '../assets/pressstart10.png', '../assets/pressstart10.fnt')
  }

  create() {
    // add text
    this.add.bitmapText(20, 20, 'pressstart8', 'Loading Game...')

    this.load.on('progress', this.progress)
    this.load.on('fileprogress', this.fileProgress) 
    this.load.once('complete', this.complete, this) 

    // load player info
    this.load.spritesheet(PLAYER_KEY, '../assets/pc.png', { frameWidth: 16, frameHeight: 16})
    this.load.audio('footstep', '../assets/footstep.wav')

    // load all npcs
    this.load.audio('dwarf', '../assets/dwarf.wav')
    this.load.spritesheet('dwarf', '../assets/dwarf.png', { frameWidth: 16, frameHeight: 16})

    // load music, maps, objects for cell
    //this.load.audio(MUSIC_KEY, '../assets/music.wav')
    this.load.tilemapCSV(MAP_KEY, '../data/maps/yarnrod_point.csv')

    // load general things (should only do once)
    this.load.image(TILE_KEY, '../assets/tiles.png')
    this.load.image(MENU_KEY, '../assets/menu.png')

    this.load.start()
  }

  progress(value) {
    console.log(value)
  } 

  fileProgress(file) {
    console.log(file.src)
  }

  complete() {
    console.log('done loading')
    this.scene.start(SCENE_GAME)
  }
}

export default LoadingScene