import { ANIM_STAND, ANIM_WALK_DOWN, ANIM_WALK_RIGHT, ANIM_WALK_LEFT, ANIM_WALK_UP, ANIM_HIT, ANIM_ATTACK_DOWN, ANIM_ATTACK_UP, ANIM_ATTACK_RIGHT, ANIM_ATTACK_LEFT, ANIM_DIE } from 'managers/sprite/constants/sprites'

export default {
  getAnimation(t, a) {
    return `${t}-${a}`
  },
  initializeAnimations(scene, type, key) {
    var anim = this.getAnimation

    var anims = {}

    anims.stand = scene.anims.create({
      key: anim(type, ANIM_STAND),
      repeat: -1,
      frameRate: 2,
      frames: scene.anims.generateFrameNames(key, {start: 0, end: 1}) 
    })

    anims.hit = scene.anims.create({
      key: anim(type, ANIM_HIT),
      frameRate: 2,
      frames: scene.anims.generateFrameNames(key, {start: 2, end: 3}) 
    })

    anims.moveDown = scene.anims.create({
      key: anim(type, ANIM_WALK_DOWN),
      repeat: -1,
      frameRate: 8,
      frames: scene.anims.generateFrameNames(key, {start: 4, end: 7}) 
    })

    anims.moveUp = scene.anims.create({
      key: anim(type, ANIM_WALK_UP),
      repeat: -1,
      frameRate: 8,
      frames: scene.anims.generateFrameNames(key, {start: 8, end: 11}) 
    })

    anims.moveRight = scene.anims.create({
      key: anim(type, ANIM_WALK_LEFT),
      repeat: -1,
      frameRate: 8,
      frames: scene.anims.generateFrameNames(key, {start: 12, end: 15}) 
    })

    anims.moveLeft = scene.anims.create({
      key: anim(type, ANIM_WALK_RIGHT),
      repeat: -1,
      frameRate: 8,
      frames: scene.anims.generateFrameNames(key, {start: 16, end: 19}) 
    })

    anims.attackDown = scene.anims.create({
      key: anim(type, ANIM_ATTACK_DOWN),
      frameRate: 8,
      frames: scene.anims.generateFrameNames(key, {start: 20, end: 23}) 
    })

    anims.attackUp = scene.anims.create({
      key: anim(type, ANIM_ATTACK_UP),
      frameRate: 8,
      frames: scene.anims.generateFrameNames(key, {start: 24, end: 27}) 
    })

    anims.attackRight = scene.anims.create({
      key: anim(type, ANIM_ATTACK_LEFT),
      frameRate: 8,
      frames: scene.anims.generateFrameNames(key, {start: 28, end: 31}) 
    })

    anims.attackLeft = scene.anims.create({
      key: anim(type, ANIM_ATTACK_RIGHT),
      frameRate: 8,
      frames: scene.anims.generateFrameNames(key, {start: 32, end: 35}) 
    })

    anims.die = scene.anims.create({
      key: anim(type, ANIM_DIE),
      frameRate: 4,
      frames: scene.anims.generateFrameNames(key, {start: 36, end: 39}) 
    })

    return anims
  }
}