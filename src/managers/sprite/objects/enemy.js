import * as Phaser from 'phaser'

import { DIR_DOWN, DIR_LEFT, DIR_RIGHT, DIR_UP } from 'managers/sprite/constants/sprites'
import { TILE_SIZE } from 'constants/dimensions/game'
import { CHARACTER_SPRITE_DEPTH } from 'constants/depth'
import { enemySpriteKey, enemySFXKey } from 'helpers/keys'
import { DIR_TO_ANIMATION, VELOCITY, SFX_MOVING } from '../constants/player'

function startPath(path, cb) {
  if (path.length == 1) {
    endAuto(cb)()
  } else {
    var curr = path[0]
    var next = path[1]
    var dir = next.x == curr.x
        ? next.y > curr.y ? DIR_DOWN : DIR_UP
        : next.x > curr.x ? DIR_RIGHT : DIR_LEFT

    var nextCb = function () {
      sprite.setVelocity(0, 0)
      enemy.moveToNearestTile()
      startPath(path.slice(1), cb)
    }

    if (dir === DIR_DOWN) {
      enemy.moveToLower(nextCb)
    } else if (dir === DIR_UP) {
      enemy.moveToUpper(nextCb)
    } else if (dir === DIR_LEFT) {
      enemy.moveToLeft(nextCb)
    } else if (dir === DIR_RIGHT) {
      enemy.moveToRight(nextCb)
    }
  }
}

function startAuto(dir, cb) {
  to = { x: sprite.x, y: sprite.y }

  if (dir === DIR_DOWN) {
    to.y += TILE_SIZE
  }
  if (dir === DIR_UP) {
    to.y -= TILE_SIZE
  }
  if (dir === DIR_RIGHT) {
    to.x += TILE_SIZE
  }
  if (dir === DIR_LEFT) {
    to.x -= TILE_SIZE
  }
  //set vector
  //scene.physics.moveTo(sprite, to.x, to.y, 32, 500, cb)
  var target = new Phaser.Math.Vector2();
  target.x = to.x
  target.y = to.y
  scene.physics.moveToObject(sprite, target, 32)

  sprite.play('enemy-' + DIR_TO_ANIMATION[dir])
  //sfx.moving.play(SFX_MOVING)
}

function endAuto(cb) {
  return function() {
    auto = false
    autoCallback = null
    enemy.halt()
    cb()
  }
}

var enemy
var data
var scene
var sprite
var anims
var sfx
var auto
var to
var autoCallback

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
      sprite.depth = CHARACTER_SPRITE_DEPTH
      sprite.setOrigin(0, 0)
    },
    initAnims() {
      anims = {}

      anims.stand = scene.anims.create({
        key: 'wait',
        repeat: -1,
        frameRate: 2,
        frames: scene.anims.generateFrameNames(enemySpriteKey(data, data.sprite), {start: 0, end: 1}) 
      })

      anims.moveDown = scene.anims.create({
        key: 'enemy-' + DIR_TO_ANIMATION[DIR_DOWN],
        repeat: -1,
        frameRate: 8,
        frames: scene.anims.generateFrameNames(enemySpriteKey(data, data.sprite), {start: 4, end: 7}) 
      })

      anims.moveRight = scene.anims.create({
        key: 'enemy-' + DIR_TO_ANIMATION[DIR_RIGHT],
        repeat: -1,
        frameRate: 8,
        frames: scene.anims.generateFrameNames(enemySpriteKey(data, data.sprite), {start: 8, end: 11}) 
      })

      anims.moveLeft = scene.anims.create({
        key: 'enemy-' + DIR_TO_ANIMATION[DIR_LEFT],
        repeat: -1,
        frameRate: 8,
        frames: scene.anims.generateFrameNames(enemySpriteKey(data, data.sprite), {start: 12, end: 15}) 
      })

      anims.moveUp = scene.anims.create({
        key: 'enemy-' + DIR_TO_ANIMATION[DIR_UP],
        repeat: -1,
        frameRate: 8,
        frames: scene.anims.generateFrameNames(enemySpriteKey(data, data.sprite), {start: 16, end: 19}) 
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
    },
    getPos() {
      var x = Math.floor(sprite.x / TILE_SIZE)
      var y = Math.floor(sprite.y / TILE_SIZE)

      return { x, y } 
    },
    drive() {
      if (sprite.body.speed > 0) {
        if (Phaser.Math.Distance.Between(sprite.x, sprite.y, to.x, to.y) < 4) {
          sprite.body.reset(to.x, to.y)
          autoCallback()
        }
      }
    },
    halt() {
      try {
        sprite.anims.restart()
        sprite.anims.stop()
        //sfx.moving.once('looped', () => sfx.moving.stop())
      } catch (err) {
        console.error(err)
      }
    },
    moveToLeft(cb) {
      auto = true
      startAuto(DIR_LEFT)
      autoCallback = endAuto(cb)
    },
    moveToRight(cb) {
      auto = true
      startAuto(DIR_RIGHT)
      autoCallback = endAuto(cb)
    },
    moveToUpper(cb) {
      auto = true
      startAuto(DIR_UP)
      autoCallback = endAuto(cb)
    },
    moveToLower(cb) {
      auto = true
      startAuto(DIR_DOWN)
      autoCallback = endAuto(cb)
    },
    moveAlongPath(path, cb) {
      var inOrderPath = [...path].reverse()
      startPath(inOrderPath, cb)
    },
    moveToNearestTile() {
      // make this animate to walk over
      var xDiff = sprite.x % TILE_SIZE
      var yDiff = sprite.y % TILE_SIZE

      var xFunc = xDiff >= TILE_SIZE / 2 ? Math.ceil : Math.floor
      var yFunc = yDiff >= TILE_SIZE / 2 ? Math.ceil : Math.floor

      var x = xFunc(sprite.x / TILE_SIZE) * TILE_SIZE
      var y = yFunc(sprite.y / TILE_SIZE) * TILE_SIZE

      sprite.setPosition(x, y)
    },
    attack(pos, cb) {
      // decide which direction to go and attack
      console.log(`attacking ${pos}`)
      // call cb on animation complete
      cb()
    }
  }

  enemy.initSprite()
  enemy.initAnims()
  enemy.initSfx()

  return enemy
}

export default Enemy