import * as Phaser from 'phaser'

import { TITLE_FONT_KEY } from 'constants/keys'
import { SCENE_LOADING } from 'constants/scenes'

import CellManager from 'managers/cell/cellManager'
import DataManager from 'managers/data/dataManager'
import LoadManager from 'managers/data/loadManager'
import SceneManager from 'managers/game/sceneManager'

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
    this.dataManager.preload()
  }

  create() {
    this.cellManager.destroy()

    this.loadManager.init(this)
    this.sceneManager.init(this)

    this.cellManager.load()

    this.add.bitmapText(20, 20, TITLE_FONT_KEY, 'Loading Game...')
  }
}

export default LoadingScene