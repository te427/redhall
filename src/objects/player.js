import { TILE_SIZE } from 'constants/dimensions/game'
import { DIR_DOWN, DIR_LEFT, DIR_RIGHT, DIR_UP } from 'managers/sprite/constants/player'
import { PLAYER_KEY, PLAYER_SFX_FOOTSTEP_KEY } from 'constants/keys'
import { VELOCITY, SFX_MOVING } from 'managers/sprite/constants/player'
import { ANIM_WALK_DOWN, ANIM_WALK_UP, ANIM_WALK_LEFT, ANIM_WALK_RIGHT } from 'managers/sprite/constants/sprites'

import { playerSFXKey } from 'helpers/keys'

const animationDirectionMap = {
  [DIR_DOWN]: ANIM_WALK_DOWN,
  [DIR_LEFT]: ANIM_WALK_LEFT,
  [DIR_RIGHT]: ANIM_WALK_RIGHT,
  [DIR_UP]: ANIM_WALK_UP,
}
function startAnimation() {
  animation = animationDirectionMap[dir]
  sprite.play(animation)
  sfx.moving.play(SFX_MOVING)
}

function stopAnimationIfAtRest() {
  // need to check if butted against something
  var v = sprite.body.velocity
  if (!v.x && !v.y) {
    sprite.anims.restart()
    sprite.anims.stop()
    sfx.moving.once('looped', () => sfx.moving.stop())
  }
}

var velocity = VELOCITY
var player
var dir
var sprite
var anims
var sfx
var animation

function Player (scene, pos) {
  player = {
    initSprite(scene) {
      dir = DIR_DOWN
      sprite = scene.physics.add.sprite(pos.x * TILE_SIZE, pos.y * TILE_SIZE, PLAYER_KEY)
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
      const x = sprite.x + (dir === DIR_RIGHT ? 8 : dir === DIR_LEFT ? -8 : 0)
      const y = sprite.y + (dir === DIR_DOWN? 8 : dir === DIR_UP ? -8 : 0)

      return { x, y }
    },
    getSprite() {
      return sprite
    },
    startMoveLeft() {
      sprite.setVelocityX(-velocity)
      dir = DIR_LEFT
      startAnimation()
    },
    stopMoveLeft() {
      var v = sprite.body.velocity.x
      if (!v || v === -velocity) {
        sprite.setVelocityX(0)
        stopAnimationIfAtRest()
      }
    },
    startMoveRight() {
      sprite.setVelocityX(velocity)
      dir = DIR_RIGHT
      startAnimation()
    },
    stopMoveRight() {
      var v = sprite.body.velocity.x
      if (!v || v === velocity) {
        sprite.setVelocityX(0)
        stopAnimationIfAtRest()
      }
    },
    startMoveUp() {
      sprite.setVelocityY(-velocity)
      dir = DIR_UP
      startAnimation()
    },
    stopMoveUp() {
      var v = sprite.body.velocity.y
      if (!v || v === -velocity) {
        sprite.setVelocityY(0)
        stopAnimationIfAtRest()
      }
    },
    startMoveDown() {
      sprite.setVelocityY(velocity)
      dir = DIR_DOWN
      startAnimation()
    },
    stopMoveDown() {
      var v = sprite.body.velocity.y
      if (!v || v === velocity) {
        sprite.setVelocityY(0)
        stopAnimationIfAtRest()
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
    }
  }

  player.initSprite(scene)
  player.initAnims(scene)
  player.initSfx(scene)

  return player

}

export default Player