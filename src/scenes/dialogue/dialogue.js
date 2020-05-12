import * as Phaser from 'phaser'
import DialogueManager from 'managers/dialogueManager'
import { SCENE_DIALOGUE } from 'constants/scenes'

class DialogueScene extends Phaser.Scene {
  constructor() {
    super(SCENE_DIALOGUE)

    this.initState()
  }

  create() {
    this.physics.add.sprite(8 * 16, (9 * 16) + 8, 'menu')
    var line = this.dialogueManager.getGreeting()

    this.add.bitmapText(16, 8 * 16, 'pressstart8', line)
  }

  initState() {
    this.dialogueManager = DialogueManager()
  }
}

export default DialogueScene