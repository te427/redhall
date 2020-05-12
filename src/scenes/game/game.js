import * as Phaser from 'phaser'
import CellManager from 'managers/cellManager'
import CollisionManager from 'managers/collisionManager'
import DialogueManager from 'managers/dialogueManager'
import SpriteManager from 'managers/spriteManager'
import { FPS } from 'constants/cfg'
import { SCENE_GAME, SCENE_DIALOGUE } from 'constants/scenes'

class GameScene extends Phaser.Scene {
  constructor() {
    super(SCENE_GAME)

    // move these to a screen manager
    this.loading = false
    this.dialogue = false

    this.cellManager = CellManager()
    this.collisionManager = CollisionManager()
    this.dialogueManager = DialogueManager()
    this.spriteManager = SpriteManager()
  }

  create() {
    this.physics.world.setFPS(FPS)

    this.cellManager.init(this)
    this.spriteManager.init(this)
    this.initMusic()
    this.initKeys()


    this.collisionManager.init(
      this,
      this.spriteManager.getPlayer(),
      this.spriteManager.getNPCs(),
      this.cellManager.getBackground())
  }

  update() {
    if (this.dialogue) return
    // change this to update the player based on the keys in keymanager
    this.spriteManager.getPlayer().update(this.keys)
    // update objects if needed
  }

  initMusic() {
    // move to MusicManager
    this.sound.audioPlayDelay = 0.1;
    this.sound.loopEndOffset = 0.05;

    /*
    music = this.sound.add('music')

    var musicMarker = {
      name: 'music',
      start: 0, 
      duration: 164,
      config: {
        volume: 2,
        loop: true
      }
    }

    music.addMarker(musicMarker)
    music.play('music')
    */
  }

  initKeys() {
    // move to KeyManager
    this.keys = this.input.keyboard.createCursorKeys()

    var keyObj = this.input.keyboard.addKey('A')
    keyObj.on('down', this.interact, this)
  }

  // move into keypress class
  interact() {
    // move into sprite manager
    var target = this.spriteManager.getPlayer().interact(this)

    if (target) {
      this.dialogueManager.set(target.getName())

      if (!this.dialogue) {
        this.scene.launch(SCENE_DIALOGUE)
        this.dialogue = true
        target.interact() 
      } else  {
        this.scene.stop(SCENE_DIALOGUE)
        this.dialogue = false 
      }
    }
  }
}

export default GameScene