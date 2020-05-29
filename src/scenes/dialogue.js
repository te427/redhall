import * as Phaser from 'phaser'

import { SCENE_DIALOGUE } from 'scenes/constants/scenes'

import DialogueManager from 'managers/menu/dialogueManager'

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