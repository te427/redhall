import * as Phaser from 'phaser'

import { SCENE_INVENTORY } from 'scenes/constants/scenes'

import InventoryManager from 'managers/menu/inventoryManager'

class InventoryScene extends Phaser.Scene {
  constructor() {
    super(SCENE_INVENTORY)

    this.inventoryManager = InventoryManager()
  }

  create() {
    this.inventoryManager.init(this)
  }
}

export default InventoryScene