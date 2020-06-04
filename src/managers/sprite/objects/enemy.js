import { DIR_DOWN, DIR_LEFT, DIR_RIGHT, DIR_UP } from 'managers/sprite/constants/sprites'
import { TILE_SIZE } from 'constants/dimensions/game'
import { CHARACTER_SPRITE_DEPTH } from 'constants/depth'
import { enemySpriteKey, enemySFXKey } from 'helpers/keys'

function startPath(path, cb) {
  if (path.length == 1) {
    cb()
  } else {
    var curr = path[0]
    var next = path[1]
    var dir = next.x == curr.x
        ? next.y > curr.y ? DIR_DOWN : DIR_UP
        : next.x > curr.x ? DIR_RIGHT : DIR_LEFT
    var nextCb = () => startPath(path.slice(1), cb)
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

function startAuto(dir) {
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

  sprite.play(DIR_TO_ANIMATION[dir])
  sfx.moving.play(SFX_MOVING)
}

function finishAutoIfDone() {
  if (auto) {
    console.log(sprite.x, sprite.y)
    if (sprite.x === to.x && sprite.y === to.y) {
      xDir = null
      yDir = null
      sprite.setVelocity(0, 0)
      sprite.anims.stop()
      sfx.moving.stop()

      auto = false

      // sometimes we don't stop at quite the right coords - call this to make sure we're in grid
      enemy.moveToNearestTile()

      if (autoCallback) {
        autoCallback()
      }
    }

  } 
}

var enemy
var data
var scene
var sprite
var anims
var sfx
var xDir
var yDir
var lastDir
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
    drive() {
      var up = yDir === DIR_UP
      var down = yDir === DIR_DOWN
      var left = xDir === DIR_LEFT
      var right = xDir === DIR_RIGHT

      sprite.setVelocityY(up ? -VELOCITY : down ? VELOCITY : 0)
      sprite.setVelocityX(left ? -VELOCITY : right ? VELOCITY : 0)

      finishAutoIfDone()

      if (!yDir && !xDir) {
        lastAnimation = null
        lastDir = null

        sprite.anims.stop()
        sfx.moving.stop()
      } else if (lastAnimation != DIR_TO_ANIMATION[lastDir]){
        lastAnimation = DIR_TO_ANIMATION[lastDir]
        sprite.play(lastAnimation)
        sfx.moving.play(SFX_MOVING)
      }
    },
    halt() {
      try {
        sprite.anims.restart()
        sprite.anims.stop()
        sfx.moving.once('looped', () => sfx.moving.stop())
      } catch (err) {
        console.error(err)
      }
    },
    moveToLeft(cb) {
      auto = true
      xDir = DIR_LEFT
      startAuto(DIR_LEFT)
      autoCallback = cb
    },
    moveToRight(cb) {
      auto = true
      xDir = DIR_RIGHT
      startAuto(DIR_RIGHT)
      autoCallback = cb
    },
    moveToUpper(cb) {
      auto = true
      yDir = DIR_UP
      startAuto(DIR_UP)
      autoCallback = cb
    },
    moveToLower(cb) {
      auto = true
      yDir = DIR_DOWN
      startAuto(DIR_DOWN)
      autoCallback = cb
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