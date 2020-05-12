import * as Phaser from 'phaser'
import CellManager from 'managers/cellManager'
import LoadManager from 'managers/loadManager'
import { SCENE_LOADING } from 'constants/scenes'

class LoadingScene extends Phaser.Scene {
  constructor() {
    super(SCENE_LOADING)

    this.loadManager = LoadManager()
    this.cellManager = CellManager()
  }

  preload() {
    this.loadManager.preload(this)
  }

  create() {
    // add text
    this.add.bitmapText(20, 20, 'pressstart8', 'Loading Game...')
    // also feed into charmanager for char info
    this.cellManager.loadCell().then(data => this.loadManager.load(this, data))
  }
}

export default LoadingScene