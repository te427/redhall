import * as Phaser from 'phaser'

import { SCENE_COMBAT } from 'scenes/constants/scenes'

import CombatManager from 'managers/combat/combatManager'

class CombatScene extends Phaser.Scene {
  constructor() {
    super(SCENE_COMBAT)

    this.combatManager = CombatManager()
  }

  create() {
    this.combatManager.start()
  }
}

export default CombatScene