import * as Phaser from 'phaser'

import { SCENE_DIALOGUE } from 'constants/scenes'

import DialogueManager from 'managers/dialogueManager'

class DialogueScene extends Phaser.Scene {
  constructor() {
    super(SCENE_DIALOGUE)

    this.dialogueManager = DialogueManager()
  }

  create() {
    this.dialogueManager.init(this)
  }
}

export default DialogueScene