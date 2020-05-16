import * as Phaser from 'phaser'
import DialogueManager from 'managers/dialogueManager'
import { SCENE_DIALOGUE } from 'constants/scenes'

class DialogueScene extends Phaser.Scene {
  constructor() {
    super(SCENE_DIALOGUE)

    this.dialogueManager = DialogueManager()
  }

  create() {
    var line = this.dialogueManager.getGreeting()

    this.physics.add.sprite(8 * 16, (9 * 16) + 8, 'menu')
    this.add.bitmapText(16, 8 * 16, 'pressstart8', line)
  }
}

export default DialogueScene