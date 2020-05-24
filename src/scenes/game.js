import * as Phaser from 'phaser'

import { SCENE_GAME } from 'constants/scenes'

import CameraManager from 'managers/cameraManager'
import CellManager from 'managers/cellManager'
import CollisionManager from 'managers/collisionManager'
import DialogueManager from 'managers/dialogueManager'
import ItemManager from 'managers/itemManager'
import KeyManager from 'managers/keyManager'
import PlayerManager from 'managers/playerManager'
import MusicManager from 'managers/musicManager'
import NPCManager from 'managers/npcManager'
import SceneManager from 'managers/sceneManager'

class GameScene extends Phaser.Scene {
  constructor() {
    super(SCENE_GAME)

    this.cameraManager = CameraManager()
    this.cellManager = CellManager()
    this.collisionManager = CollisionManager()
    this.dialogueManager = DialogueManager()
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
    this.musicManager.init(this)
    this.keyManager.init(this)
    this.playerManager.init(this)
    this.collisionManager.init(this)
    this.cameraManager.init(this)
  }
}

export default GameScene