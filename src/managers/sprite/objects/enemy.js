import * as Phaser from 'phaser'

import { DIR_DOWN, DIR_LEFT, DIR_RIGHT, DIR_UP, WALK_DIR_TO_ANIMATION, ATTACK_DIR_TO_ANIMATION, ANIM_STAND, ANIM_WALK_DOWN, ANIM_WALK_RIGHT, ANIM_WALK_LEFT, ANIM_WALK_UP, ANIM_HIT, TYPE_ENEMY, ANIM_DIE } from 'managers/sprite/constants/sprites'
import { TILE_SIZE } from 'constants/dimensions/game'
import { CHARACTER_SPRITE_DEPTH } from 'constants/depth'
import { enemySpriteKey, enemySFXKey } from 'helpers/keys'
import { ENEMY_HEALTH, ENEMY_DAMAGE } from 'managers/combat/constants/stats'
import { E_ENEMY_ATTACK } from 'events/types'

import animations from 'managers/sprite/helpers/animations'
import { SFX_HIT_KEY, SFX_ATTACK_KEY, SFX_MOVE_KEY } from 'constants/keys'
import { SFX_MOVE } from '../constants/sfx'

function startPath(path, cb) {
  if (path.length == 1) {
    endAuto(cb)()
  } else {
    if (!moving) {
      moving = true
      sfx.move.play(SFX_MOVE)
    } 

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

  sprite.play(animations.getAnimation(TYPE_ENEMY, WALK_DIR_TO_ANIMATION[dir]))
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
var mgr
var data
var scene
var sprite
var anims
var sfx
var auto
var moving
var to
var autoCallback
var health = ENEMY_HEALTH
var alive = true

function Enemy(manager, newScene, enemyData) {
  mgr = manager
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
      anims = animations.initializeAnimations(scene, TYPE_ENEMY, enemySpriteKey(data, data.sprite))
      sprite.play(animations.getAnimation(TYPE_ENEMY, ANIM_STAND))
    },
    initSfx() {
      sfx = {} 

      sfx.move = scene.sound.add(enemySFXKey(data, SFX_MOVE_KEY))

      sfx.move.addMarker({
        name: SFX_MOVE,
        start: 0,
        duration: 0.25,
        config: {
          volume: 0.1,
          loop: true
        }
      })

      sfx.attack = scene.sound.add(enemySFXKey(data, SFX_ATTACK_KEY))
      sfx.hit = scene.sound.add(enemySFXKey(data, SFX_HIT_KEY))
    },
    getName() {
      return data.name
    },
    getSprite() {
      return sprite
    },
    getPos() {
      var x = Math.floor(sprite.x / TILE_SIZE)
      var y = Math.floor(sprite.y / TILE_SIZE)

      return { x, y } 
    },
    isAlive() {
      return alive
    },
    drive() {
      if (sprite && sprite.body && sprite.body.speed > 0) {
        if (Phaser.Math.Distance.Between(sprite.x, sprite.y, to.x, to.y) < 4) {
          sprite.body.reset(to.x, to.y)
          sfx.move.stop()
          autoCallback()
        }
      }
    },
    halt() {
      try {
        sprite.anims.restart()
        sprite.play(animations.getAnimation(TYPE_ENEMY, ANIM_STAND))
        sfx.move.once('looped', () => sfx.move.stop())
        moving = false
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
    adjacentTo(pos) {
      var p = this.getPos()
      if (pos.x === p.x) {
        if (pos.y === p.y - 1) {
          return DIR_UP
        }
        if (pos.y === p.y + 1) {
          return DIR_DOWN
        }
      }
      if (pos.y === p.y) {
        if (pos.x === p.x - 1) {
          return DIR_LEFT
        }
        if (pos.x === p.x + 1) {
          return DIR_RIGHT
        }
      }
      return null
    },
    posAdjacentTo(dir) {
      var p = this.getPos()
      if (dir === DIR_UP) {
        p.y -= 1
      } else if (dir === DIR_DOWN) {
        p.y += 1
      } else if (dir === DIR_LEFT) {
        p.x -= 1
      } else if (dir === DIR_RIGHT) {
        p.x += 1
      }
      return p
    },
    getHealth() {
      return health / ENEMY_HEALTH
    },
    isDead() {
      return !alive
    },
    attack(dir, cb) {
      // call cb on animation complete
      sprite.play(animations.getAnimation(TYPE_ENEMY, ATTACK_DIR_TO_ANIMATION[dir]))
      sfx.attack.play()
      sprite.once('animationcomplete', function(){
        mgr.emit(E_ENEMY_ATTACK, { pos: enemy.posAdjacentTo(dir), damage: ENEMY_DAMAGE, cb})
        sprite.play(animations.getAnimation(TYPE_ENEMY, ANIM_STAND))
      })
    },
    hit(attack) {
      console.log(`hit for ${attack.damage} damage`)
      health -= attack.damage
      console.log(`${health} health left`)
      if (health <= 0) {
        sprite.play(animations.getAnimation(TYPE_ENEMY, ANIM_DIE))
        alive = false
      } else {
        sprite.play(animations.getAnimation(TYPE_ENEMY, ANIM_HIT))
      }

      sfx.hit.play()

      sprite.once('animationcomplete', function() {
        if (alive) {
          sprite.play(animations.getAnimation(TYPE_ENEMY, ANIM_STAND))
        }
        attack.cb()
      })
    }
  }

  enemy.initSprite()
  enemy.initAnims()
  enemy.initSfx()

  return enemy
}

export default Enemy