import * as Phaser from 'phaser'
import Player from 'objects/player'
import NPC from 'objects/npc'
import CellManager from 'managers/cellManager'
import CharManager from 'managers/charManager'
import DialogueManager from 'managers/dialogueManager'
import { MAP_KEY, TILE_KEY, BG_KEY, TILE_SIZE, FPS } from 'constants/cfg'
import { SCENE_GAME, SCENE_DIALOGUE } from 'constants/scenes'

class GameScene extends Phaser.Scene {
  constructor() {
    super(SCENE_GAME)

    this.initState()
  }

  create() {
    this.physics.world.setFPS(FPS)

    this.initMap()
    this.initMusic()
    this.initKeys()

    this.npcs = this.charManager.getAll().map(c => (new NPC(this, c)))
    this.player = new Player(this)
  }

  update() {
    if (this.dialogue) return
    this.player.update(this.keys)
    // update objects if needed
  }

  initState() {
    this.loading = false
    this.dialogue = false

    this.cellManager = CellManager()
    this.charManager = CharManager()
    this.dialogueManager = DialogueManager()
  }

  initMap() {
    this.map = this.make.tilemap({
      key: MAP_KEY, 
      tileWidth: TILE_SIZE, 
      tileHeight: TILE_SIZE
    })

    this.tiles = this.map.addTilesetImage(TILE_KEY)
    this.bg = this.map.createStaticLayer(BG_KEY, this.tiles)

    // define collision ranges for the tilemap used
    this.bg.setCollisionBetween(0, 14);

    var size = this.cellManager.getSize()

    this.physics.world.setBounds(0, 0, size.x * TILE_SIZE, size.y * TILE_SIZE)
    this.cameras.main.setBounds(0, 0, size.x * TILE_SIZE, size.y * TILE_SIZE)
  }

  initMusic() {
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
    this.keys = this.input.keyboard.createCursorKeys()

    var keyObj = this.input.keyboard.addKey('A')
    keyObj.on('down', this.interact, this)
  }

  // move into keypress class
  interact() {
    // move into sprite manager
    var target = this.player.interact(this)

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