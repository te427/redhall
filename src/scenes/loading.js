import * as Phaser from 'phaser'
import CellManager from 'managers/cellManager'
import DataManager from 'managers/dataManager'
import DialogueManager from 'managers/dialogueManager'
import LoadManager from 'managers/loadManager'
import NPCManager from 'managers/npcManager'
import SceneManager from 'managers/sceneManager'
import { SCENE_LOADING } from 'constants/scenes'

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

    this.add.bitmapText(20, 20, 'pressstart8', 'Loading Game...')
  }
}

export default LoadingScene