import * as Phaser from 'phaser'
import CellManager from 'managers/cellManager'
import SpriteManager from 'managers/spriteManager'
import DialogueManager from 'managers/dialogueManager'
import LoadManager from 'managers/loadManager'
import { SCENE_LOADING } from 'constants/scenes'

class LoadingScene extends Phaser.Scene {
  constructor() {
    super(SCENE_LOADING)

    this.cellManager = CellManager()
    this.dialogueManager = DialogueManager()
    this.loadManager = LoadManager()
    this.spriteManager = SpriteManager()
  }

  preload() {
    this.loadManager.preload(this)
  }

  create() {
    this.add.bitmapText(20, 20, 'pressstart8', 'Loading Game...')

    this.cellManager.destroy()
    this.cellManager.loadCell()
      .then(data => { 
        this.dialogueManager.load(data)
        this.loadManager.load(this, data)
        this.spriteManager.load(data)
      })
  }
}

export default LoadingScene