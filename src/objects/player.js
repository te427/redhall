import Sprite from 'objects/sprite'

import { VELOCITY, SFX_MOVING } from 'constants/player'
import { PLAYER_KEY, TILE_SIZE } from 'constants/cfg'
import { ANIM_WALK_DOWN, ANIM_WALK_UP, ANIM_WALK_LEFT, ANIM_WALK_RIGHT } from 'constants/sprites'
import { DIR_DOWN, DIR_LEFT, DIR_RIGHT, DIR_UP } from 'constants/game'

var velocity = VELOCITY

class Player extends Sprite {
  constructor(scene) {
    super()

    this.initSprite(scene)
    this.initState()
    this.initAnims(scene)
    this.initSfx(scene)
  }

  initSprite(scene) {
    var pos = scene.cellManager.getSpawn()
    // get this pos from data
    this.sprite = scene.physics.add.sprite(pos.x * TILE_SIZE, pos.y * TILE_SIZE, PLAYER_KEY)
    scene.cameras.main.startFollow(this.sprite)
  } 

  initState() {
    this.walking = false
    this.animating = false
    this.dir = DIR_DOWN

    this.animationDirectionMap = {
      [DIR_DOWN]: ANIM_WALK_DOWN,
      [DIR_LEFT]: ANIM_WALK_LEFT,
      [DIR_RIGHT]: ANIM_WALK_RIGHT,
      [DIR_UP]: ANIM_WALK_UP,
    }
  }

  initAnims(scene) {
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
  }

  initSfx(scene) {
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
  }

  update(keys) {
    var moving
    var velocity = VELOCITY

    if (keys.space.isDown) {
      velocity *= 2
      this.sfx.moving.setRate(2)
    } else {
      this.sfx.moving.setRate(1)
    }

    if (keys.down.isDown) {
      this.sprite.setVelocityY(velocity)
      this.dir = DIR_DOWN
      moving = true
    } 
    
    if (keys.left.isDown) {
      this.sprite.setVelocityX(-velocity)
      this.dir = DIR_LEFT
      moving = true
    }
    
    if (keys.up.isDown) {
      this.sprite.setVelocityY(-velocity)
      this.dir = DIR_UP
      moving = true
    } 

    if (keys.right.isDown) {
      this.sprite.setVelocityX(velocity)
      this.dir = DIR_RIGHT
      moving = true
    } 

    if (!this.animating & moving) {
      var animation = this.animationDirectionMap[this.dir]
      this.sprite.play(animation)
      this.sfx.moving.play(SFX_MOVING)
    }

    if (!moving) {
      this.sprite.setVelocity(0) 
      this.sprite.anims.stop()
      this.sfx.moving.stop()
    }

    this.animating = moving
  }

  interact(scene) {
    const x = this.sprite.x + (this.dir === DIR_RIGHT ? 8 : this.dir === DIR_LEFT ? -8 : 0)
    const y = this.sprite.y + (this.dir === DIR_DOWN? 8 : this.dir === DIR_UP ? -8 : 0)

    // this should go in a tile manager
    var tile = scene.cellManager.getForeground().getTileAtWorldXY(x, y)
    if (tile) {
      var index = tile.index
      // use index in scene itemManager to see if exists (isn't used)
      var tx = tile.x
      var ty = tile.y
      tile.tilemap.fill(index + 1, tx, ty, 1, 1)
    }

    // have this return any object that is at x/y
    return scene.spriteManager.getNPCs().find(npc => npc.getBounds().contains(x, y))
  }

  startMoveLeft() {
    this.sprite.setVelocityX(-velocity)
    this.dir = DIR_LEFT
    this.startAnimation()
  }

  stopMoveLeft() {
    if (this.sprite.body.velocity.x === -velocity) {
      this.sprite.setVelocityX(0)
      this.stopAnimationIfAtRest()
    }
  }

  startMoveRight() {
    this.sprite.setVelocityX(velocity)
    this.dir = DIR_RIGHT
    this.startAnimation()
  }

  stopMoveRight() {
    if (this.sprite.body.velocity.x === velocity) {
      this.sprite.setVelocityX(0)
      this.stopAnimationIfAtRest()
    }
  }

  startMoveUp() {
    this.sprite.setVelocityY(-velocity)
    this.dir = DIR_UP
    this.startAnimation()
  }

  stopMoveUp() {
    if (this.sprite.body.velocity.y === -velocity) {
      this.sprite.setVelocityY(0)
      this.stopAnimationIfAtRest()
    }
  }

  startMoveDown() {
    this.sprite.setVelocityY(velocity)
    this.dir = DIR_DOWN
    this.startAnimation()
  }

  stopMoveDown() {
    if (this.sprite.body.velocity.y === velocity) {
      this.sprite.setVelocityY(0)
      this.stopAnimationIfAtRest()
    }
  }

  startInteract() {
    console.log('pretty flowers')
  }

  stopInteract() {
    console.log('so pretty')
  }
  
  startAnimation() {
    var animation = this.animationDirectionMap[this.dir]
    this.sprite.play(animation)
    this.sfx.moving.play(SFX_MOVING)
  }

  stopAnimationIfAtRest() {
    var velocity = this.sprite.body.velocity
    if (!velocity.x && !velocity.y) {
      this.sprite.anims.stop()
      this.sfx.moving.stop()
    }
  }
}

export default Player