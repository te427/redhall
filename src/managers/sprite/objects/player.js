import { TILE_SIZE } from 'constants/dimensions/game'
import { DIR_DOWN, DIR_LEFT, DIR_RIGHT, DIR_UP } from 'managers/sprite/constants/sprites'
import { PLAYER_KEY, PLAYER_SFX_FOOTSTEP_KEY } from 'constants/keys'
import { VELOCITY, SFX_MOVING, DIR_TO_ANIMATION } from 'managers/sprite/constants/player'
import { ANIM_WALK_DOWN, ANIM_WALK_UP, ANIM_WALK_LEFT, ANIM_WALK_RIGHT } from 'managers/sprite/constants/sprites'

import { playerSFXKey } from 'helpers/keys'
import { CHARACTER_SPRITE_DEPTH } from 'constants/depth'

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
      player.moveToNearestTile()

      if (autoCallback) {
        autoCallback()
      }
    }

  } 
}

var player
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

function Player (scene, pos) {
  player = {
    initSprite(scene) {
      sprite = scene.physics.add.sprite(pos.x * TILE_SIZE, pos.y * TILE_SIZE, PLAYER_KEY)
      sprite.depth = CHARACTER_SPRITE_DEPTH 
      sprite.setOrigin(0, 0)
    }, 
    initAnims(scene) {
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
    initSfx(scene) {
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

      console.log(dir)
      console.log(sprite.x, sprite.y)
      console.log(x, y)

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
        dir = lastDir
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

  player.initSprite(scene)
  player.initAnims(scene)
  player.initSfx(scene)

  return player

}

export default Player