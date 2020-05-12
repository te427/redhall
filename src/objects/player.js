import Sprite from 'objects/sprite'

import { VELOCITY, SFX_MOVING } from 'constants/player'
import { PLAYER_KEY } from 'constants/cfg'
import { ANIM_WALK_DOWN, ANIM_WALK_UP, ANIM_WALK_LEFT, ANIM_WALK_RIGHT } from 'constants/sprites'
import { DIR_DOWN, DIR_LEFT, DIR_RIGHT, DIR_UP } from 'constants/game'

class Player extends Sprite {
  constructor(scene) {
    super()

    this.initSprite(scene)
    this.initPhysics(scene)
    this.initState()
    this.initAnims(scene)
    this.initSfx(scene)
  }

  initSprite(scene) {
    this.sprite = scene.physics.add.sprite(16 * 16, 16 * 16, PLAYER_KEY)
    scene.cameras.main.startFollow(this.sprite)
  } 

  initPhysics(scene) {
    this.sprite.setCollideWorldBounds(true)
    scene.physics.add.collider(this.sprite, scene.bg)
    scene.npcs.forEach(npc => scene.physics.add.collider(this.sprite, npc.sprite))
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
    this.checkMap = {
        [DIR_LEFT]: this.checkLeft,
        [DIR_RIGHT]: this.checkRight,
        [DIR_UP]: this.checkUp,
        [DIR_DOWN]: this.checkDown,
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
    const x = this.sprite.x
    const y = this.sprite.y

    // have this return any object that is at x/y
    return this.checkMap[this.dir](scene, x, y)
  }

  checkLeft(scene, x, y) {
    return scene.npcs.find(npc => npc.getBounds().contains(x - 8, y))
  }

  checkRight(scene, x, y) {
    return scene.npcs.find(npc => npc.getBounds().contains(x + 8, y))
  }

  checkUp(scene, x, y) {
    return scene.npcs.find(npc => npc.getBounds().contains(x, y - 8))
  }

  checkDown(scene, x, y) {
    return scene.npcs.find(npc => npc.getBounds().contains(x, y + 8))
  }


}

export default Player