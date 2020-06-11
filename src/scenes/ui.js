import * as Phaser from 'phaser'

import { SCENE_UI } from 'scenes/constants/scenes'

import NotificationManager from 'managers/ui/notificationManager'

class UiScene extends Phaser.Scene {
  constructor() {
    super(SCENE_UI)

    this.notificationManager = NotificationManager()
  }

  create() {
    this.notificationManager.init(this)
  }
}

export default UiScene