import * as Phaser from 'phaser'

import { SCENE_GAME } from 'scenes/constants/scenes'

import CameraManager from 'managers/game/cameraManager'
import CellManager from 'managers/cell/cellManager'
import CollisionManager from 'managers/game/collisionManager'
import CombatManager from 'managers/combat/combatManager'
import DialogueManager from 'managers/menu/dialogueManager'
import EnemyManager from 'managers/sprite/enemyManager'
import ItemManager from 'managers/cell/itemManager'
import KeyManager from 'managers/game/keyManager'
import PlayerManager from 'managers/sprite/playerManager'
import MusicManager from 'managers/sound/musicManager'
import NPCManager from 'managers/sprite/npcManager'
import SceneManager from 'managers/game/sceneManager'

class GameScene extends Phaser.Scene {
  constructor() {
    super(SCENE_GAME)

    this.cameraManager = CameraManager()
    this.cellManager = CellManager()
    this.collisionManager = CollisionManager()
    this.combatManager = CombatManager()
    this.dialogueManager = DialogueManager()
    this.enemyManager = EnemyManager()
    this.itemManager = ItemManager()
    this.keyManager = KeyManager()
    this.musicManager = MusicManager()
    this.npcManager = NPCManager()
    this.playerManager = PlayerManager()
    this.sceneManager = SceneManager()
  }

  create() {
    this.cellManager.init(this)
    this.itemManager.init(this)
    this.cellManager.render()
    this.sceneManager.init(this)
    this.npcManager.init(this)
    this.enemyManager.init(this)
    this.musicManager.init(this)
    this.keyManager.init(this)
    this.playerManager.init(this)
    this.collisionManager.init(this)
    this.cameraManager.init(this)
    this.combatManager.init(this)
  }

  update() {
    this.enemyManager.scan()
    this.playerManager.drive()
  }
}

export default GameScene