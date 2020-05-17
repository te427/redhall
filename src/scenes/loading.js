import { TITLE_FONT } from 'constants/cfg'
import { SCENE_LOADING } from 'constants/scenes'
import * as Phaser from 'phaser'
import CellManager from 'managers/cellManager'
import DataManager from 'managers/dataManager'
import LoadManager from 'managers/loadManager'
import SceneManager from 'managers/sceneManager'

class LoadingScene extends Phaser.Scene {
  constructor() {
    super(SCENE_LOADING)

    this.cellManager = CellManager()
    this.dataManager = DataManager()
    this.loadManager = LoadManager()
    this.sceneManager = SceneManager()
  }

  preload() {
    this.loadManager.preload(this)
  }

  create() {
    this.cellManager.destroy()

    this.loadManager.init(this)
    this.sceneManager.init(this)

    this.cellManager.load()

    this.add.bitmapText(20, 20, TITLE_FONT, 'Loading Game...')
  }
}

export default LoadingScene