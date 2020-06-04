import * as Phaser from 'phaser'

import { TILE_SIZE } from 'constants/dimensions/game'
import { DIR_DOWN, DIR_LEFT, DIR_RIGHT, DIR_UP } from 'managers/sprite/constants/sprites'
import { PLAYER_KEY, PLAYER_SFX_FOOTSTEP_KEY } from 'constants/keys'
import { VELOCITY, SFX_MOVING, DIR_TO_ANIMATION } from 'managers/sprite/constants/player'
import { ANIM_WALK_DOWN, ANIM_WALK_UP, ANIM_WALK_LEFT, ANIM_WALK_RIGHT } from 'managers/sprite/constants/sprites'

import { playerSFXKey } from 'helpers/keys'
import { CHARACTER_SPRITE_DEPTH } from 'constants/depth'

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
      player.moveToNearestTile()
      startPath(path.slice(1), cb)
    }

    if (dir === DIR_DOWN) {
      player.moveToLower(nextCb)
    } else if (dir === DIR_UP) {
      player.moveToUpper(nextCb)
    } else if (dir === DIR_LEFT) {
      player.moveToLeft(nextCb)
    } else if (dir === DIR_RIGHT) {
      player.moveToRight(nextCb)
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

  sprite.play(DIR_TO_ANIMATION[dir])
  sfx.moving.play(SFX_MOVING)
}

function endAuto(cb) {
  return function() {
    auto = false
    autoCallback = null
    player.halt()
    cb()
  }
}

var player
var scene
var xDir
var yDir
var sprite
var anims
var sfx
var dir
var lastAnimation 
var lastDir
var auto
var to
var autoCallback

function Player (newScene, pos) {
  scene = newScene

  player = {
    initSprite() {
      sprite = scene.physics.add.sprite(pos.x * TILE_SIZE, pos.y * TILE_SIZE, PLAYER_KEY)
      sprite.depth = CHARACTER_SPRITE_DEPTH 
      sprite.setOrigin(0, 0)
    }, 
    initAnims() {
      anims = {}

      anims.walkDown = scene.anims.create({
        key: ANIM_WALK_DOWN,
        repeat: -1,
        frameRate: 8,
        frames: scene.anims.generateFrameNames(PLAYER_KEY, {start: 0, end: 3}) 
      })

      anims.walkUp = scene.anims.create({
        key: ANIM_WALK_UP,
        repeat: -1,
        frameRate: 8,
        frames: scene.anims.generateFrameNames(PLAYER_KEY, {start: 4, end: 7}) 
      })

      anims.walkLeft = scene.anims.create({
        key: ANIM_WALK_LEFT,
        repeat: -1,
        frameRate: 8,
        frames: scene.anims.generateFrameNames(PLAYER_KEY, {start: 8, end: 11}) 
      })

      anims.walkRight = scene.anims.create({
        key: ANIM_WALK_RIGHT,
        repeat: -1,
        frameRate: 8,
        frames: scene.anims.generateFrameNames(PLAYER_KEY, {start: 12, end: 15}) 
      })
    },
    initSfx() {
      sfx = {}

      sfx.moving = scene.sound.add(playerSFXKey(PLAYER_SFX_FOOTSTEP_KEY))

      sfx.moving.addMarker({
        name: SFX_MOVING,
        start: 0,
        duration: 0.25,
        config: {
          volume: 0.1,
          loop: true
        }
      })
    },
    getInteraction() {
      var halfTile = TILE_SIZE / 2
      var threeQuarterTile = (3 * TILE_SIZE) / 4

      const x = sprite.x + halfTile + (dir === DIR_RIGHT ? threeQuarterTile : dir === DIR_LEFT ? -threeQuarterTile: 0)
      const y = sprite.y + halfTile + (dir === DIR_DOWN ? threeQuarterTile: dir === DIR_UP ? -threeQuarterTile: 0)

      return { x, y }
    },
    getSprite() {
      return sprite
    },
    getPos() {
      var x = Math.floor(sprite.x / TILE_SIZE)
      var y = Math.floor(sprite.y / TILE_SIZE)

      return { x, y } 
    },
    startMoveLeft() {
      xDir = DIR_LEFT
      lastDir = xDir
    },
    stopMoveLeft() {
      xDir = null
    },
    startMoveRight() {
      xDir = DIR_RIGHT
      lastDir = xDir
    },
    stopMoveRight() {
      xDir = null
    },
    startMoveUp() {
      yDir = DIR_UP
      lastDir = yDir
    },
    stopMoveUp() {
      yDir = null
    },
    startMoveDown() {
      yDir = DIR_DOWN
      lastDir = yDir
    },
    stopMoveDown() {
      yDir = null
    },
    drive() {
      if (!auto) {
        var up = yDir === DIR_UP
        var down = yDir === DIR_DOWN
        var left = xDir === DIR_LEFT
        var right = xDir === DIR_RIGHT

        sprite.setVelocityY(up ? -VELOCITY : down ? VELOCITY : 0)
        sprite.setVelocityX(left ? -VELOCITY : right ? VELOCITY : 0)

        if (!yDir && !xDir) {
          lastAnimation = null
          lastDir = null
          sprite.anims.stop()
          sfx.moving.stop()
        } else if (lastAnimation != DIR_TO_ANIMATION[lastDir]){
          lastAnimation = DIR_TO_ANIMATION[lastDir]
          dir = lastDir
          sprite.play(lastAnimation)
          sfx.moving.play(SFX_MOVING)
        }
      } else if (sprite.body.speed > 0) {
        if (Phaser.Math.Distance.Between(sprite.x, sprite.y, to.x, to.y) < 2) {
          sprite.body.reset(to.x, to.y)
          autoCallback()
        }
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

  player.initSprite(scene)
  player.initAnims(scene)
  player.initSfx(scene)

  return player

}

export default Player