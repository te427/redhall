import { TILE_SIZE } from 'constants/dimensions/game'
import { enemySpriteKey, enemySFXKey } from 'helpers/keys'

var enemy
var data
var scene
var sprite
var anims
var sfx

function Enemy(newScene, enemyData) {
  data = enemyData
  scene = newScene

  enemy = {
    initSprite() {
      // Check if this width/height box is correct
      sprite = scene.physics.add.sprite(data.x * TILE_SIZE, data.y * TILE_SIZE, data)
      sprite.body.setSize(16, 16)
      sprite.body.setOffset(0, 0)
      sprite.setImmovable(true)
    },
    initAnims() {
      anims = {}

      anims.stand = scene.anims.create({
        key: 'wait',
        repeat: -1,
        frameRate: 2,
        frames: scene.anims.generateFrameNames(enemySpriteKey(data, data.sprite), {start: 0, end: 1}) 
      })

      sprite.play('wait')
    },
    initSfx() {
      sfx = {} 

      //sfx.talk = scene.sound.add(enemySFXKey(data, data.sfx.talk))

      /*
      sfx.talk.addMarker({
        name: 'talk',
        start: 0,
        duration: 2,
        config: {
          volume: 0.5,
          loop: false 
        }
      })
      */
    },
    getSprite() {
      return sprite
    }
  }

  enemy.initSprite()
  enemy.initAnims()
  enemy.initSfx()

  return enemy
}

export default Enemy