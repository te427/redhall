import { VELOCITY, SFX_MOVING } from 'constants/player'
import { PLAYER_KEY, TILE_SIZE } from 'constants/cfg'
import { ANIM_WALK_DOWN, ANIM_WALK_UP, ANIM_WALK_LEFT, ANIM_WALK_RIGHT } from 'constants/sprites'
import { DIR_DOWN, DIR_LEFT, DIR_RIGHT, DIR_UP } from 'constants/game'
import { E_INTERACT } from 'events/types'

const animationDirectionMap = {
  [DIR_DOWN]: ANIM_WALK_DOWN,
  [DIR_LEFT]: ANIM_WALK_LEFT,
  [DIR_RIGHT]: ANIM_WALK_RIGHT,
  [DIR_UP]: ANIM_WALK_UP,
}

var velocity = VELOCITY
var player

function Player (scene, pos) {
  player = {
    initSprite(scene) {
      this.dir = DIR_DOWN
      this.sprite = scene.physics.add.sprite(pos.x * TILE_SIZE, pos.y * TILE_SIZE, PLAYER_KEY)
    }, 
    initAnims(scene) {
      this.anims = {}

      this.anims.walkDown = scene.anims.create({
        key: ANIM_WALK_DOWN,
        repeat: -1,
        frameRate: 8,
        frames: scene.anims.generateFrameNames(PLAYER_KEY, {start: 0, end: 3}) 
      })

      this.anims.walkUp = scene.anims.create({
        key: ANIM_WALK_UP,
        repeat: -1,
        frameRate: 8,
        frames: scene.anims.generateFrameNames(PLAYER_KEY, {start: 4, end: 7}) 
      })

      this.anims.walkLeft = scene.anims.create({
        key: ANIM_WALK_LEFT,
        repeat: -1,
        frameRate: 8,
        frames: scene.anims.generateFrameNames(PLAYER_KEY, {start: 8, end: 11}) 
      })

      this.anims.walkRight = scene.anims.create({
        key: ANIM_WALK_RIGHT,
        repeat: -1,
        frameRate: 8,
        frames: scene.anims.generateFrameNames(PLAYER_KEY, {start: 12, end: 15}) 
      })
    },
    initSfx(scene) {
      this.sfx = {}

      this.sfx.moving = scene.sound.add('footstep')

      this.sfx.moving.addMarker({
        name: SFX_MOVING,
        start: 0,
        duration: 0.25,
        config: {
          volume: 0.1,
          loop: true
        }
      })
    },
    startMoveLeft() {
      this.sprite.setVelocityX(-velocity)
      this.dir = DIR_LEFT
      this.startAnimation()
    },
    stopMoveLeft() {
      var v = this.sprite.body.velocity.x
      if (!v || v === -velocity) {
        this.sprite.setVelocityX(0)
        this.stopAnimationIfAtRest()
      }
    },
    startMoveRight() {
      this.sprite.setVelocityX(velocity)
      this.dir = DIR_RIGHT
      this.startAnimation()
    },
    stopMoveRight() {
      var v = this.sprite.body.velocity.x
      if (!v || v === velocity) {
        this.sprite.setVelocityX(0)
        this.stopAnimationIfAtRest()
      }
    },
    startMoveUp() {
      this.sprite.setVelocityY(-velocity)
      this.dir = DIR_UP
      this.startAnimation()
    },
    stopMoveUp() {
      var v = this.sprite.body.velocity.y
      if (!v || v === -velocity) {
        this.sprite.setVelocityY(0)
        this.stopAnimationIfAtRest()
      }
    },
    startMoveDown() {
      this.sprite.setVelocityY(velocity)
      this.dir = DIR_DOWN
      this.startAnimation()
    },
    stopMoveDown() {
      var v = this.sprite.body.velocity.y
      if (!v || v === velocity) {
        this.sprite.setVelocityY(0)
        this.stopAnimationIfAtRest()
      }
    },
    startAnimation() {
      var animation = animationDirectionMap[this.dir]
      this.sprite.play(animation)
      this.sfx.moving.play(SFX_MOVING)
    },
    stopAnimationIfAtRest() {
      // need to check if butted against something
      var v = this.sprite.body.velocity
      if (!v.x && !v.y) {
        this.sprite.anims.stop()
        this.sfx.moving.stop()
      }
    },
    getInteraction() {
      const x = this.sprite.x + (this.dir === DIR_RIGHT ? 8 : this.dir === DIR_LEFT ? -8 : 0)
      const y = this.sprite.y + (this.dir === DIR_DOWN? 8 : this.dir === DIR_UP ? -8 : 0)

      return { x, y }
    }
  }

  player.initSprite(scene)
  player.initAnims(scene)
  player.initSfx(scene)

  return player

}

export default Player