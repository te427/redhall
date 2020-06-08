import * as Phaser from 'phaser'

import { TILE_SIZE } from 'constants/dimensions/game'
import { DIR_DOWN, DIR_LEFT, DIR_RIGHT, DIR_UP, TYPE_PLAYER, ANIM_STAND, ANIM_DIE, ANIM_HIT } from 'managers/sprite/constants/sprites'
import { PLAYER_KEY, SFX_MOVE_KEY, SFX_ATTACK_KEY, SFX_HIT_KEY } from 'constants/keys'
import { VELOCITY } from 'managers/sprite/constants/player'
import { ANIM_WALK_DOWN, ANIM_WALK_UP, ANIM_WALK_LEFT, ANIM_WALK_RIGHT, WALK_DIR_TO_ANIMATION, ATTACK_DIR_TO_ANIMATION} from 'managers/sprite/constants/sprites'
import { CHARACTER_SPRITE_DEPTH } from 'constants/depth'
import { PLAYER_DAMAGE, PLAYER_HEALTH } from 'managers/combat/constants/stats'
import { E_PLAYER_ATTACK } from 'events/types'
import { SFX_MOVE, SFX_HIT } from '../constants/sfx'

import { playerSpriteKey, playerSFXKey } from 'helpers/keys'
import animations from 'managers/sprite/helpers/animations'

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

  sprite.play(animations.getAnimation(TYPE_PLAYER, WALK_DIR_TO_ANIMATION[dir]))
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
var mgr
var scene
var xDir
var yDir
var sprite
var anims
var moving
var sfx
var dir
var lastAnimation 
var lastDir
var auto
var to
var autoCallback
var health = PLAYER_HEALTH

function Player (manager, newScene, pos) {
  mgr = manager
  scene = newScene

  player = {
    initSprite() {
      sprite = scene.physics.add.sprite(pos.x * TILE_SIZE, pos.y * TILE_SIZE, PLAYER_KEY)
      sprite.depth = CHARACTER_SPRITE_DEPTH 
      sprite.setOrigin(0, 0)
    }, 
    initAnims() {
      anims = animations.initializeAnimations(scene, TYPE_PLAYER, PLAYER_KEY)

      sprite.play(animations.getAnimation(TYPE_PLAYER, ANIM_STAND))
    },
    initSfx() {
      sfx = {}

      sfx.move = scene.sound.add(playerSFXKey(SFX_MOVE_KEY))

      sfx.move.addMarker({
        name: SFX_MOVE,
        start: 0,
        config: {
          volume: 0.1,
          loop: true
        }
      })

      sfx.attack = scene.sound.add(playerSFXKey(SFX_ATTACK_KEY))
      sfx.hit = scene.sound.add(playerSFXKey(SFX_HIT_KEY))
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
      if (sprite.body.speed > 0) {
        if (!moving) {
          sfx.move.play(SFX_MOVE)
        }
        moving = true 
      }

      if (!auto) {
        var up = yDir === DIR_UP
        var down = yDir === DIR_DOWN
        var left = xDir === DIR_LEFT
        var right = xDir === DIR_RIGHT
        sprite.setVelocityY(up ? -VELOCITY : down ? VELOCITY : 0)
        sprite.setVelocityX(left ? -VELOCITY : right ? VELOCITY : 0)

        if (!yDir && !xDir && moving) {
          lastAnimation = null
          lastDir = null
          sprite.play(animations.getAnimation(PLAYER_KEY, ANIM_STAND))
          sfx.move.stop()
          moving = false
        } else if (lastAnimation != WALK_DIR_TO_ANIMATION[lastDir]){
          lastAnimation = WALK_DIR_TO_ANIMATION[lastDir]
          dir = lastDir
          sprite.play(animations.getAnimation(TYPE_PLAYER, lastAnimation))
        }
      } else if (sprite.body.speed > 0) {
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
        sfx.move.once('looped', () => sfx.move.stop())
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
    getHealth() {
      return health / PLAYER_HEALTH
    },
    attack(pos, cb) {
      var dir = this.adjacentTo(pos)

      sprite.play(animations.getAnimation(TYPE_PLAYER, ATTACK_DIR_TO_ANIMATION[dir]))
      sfx.attack.play()
      sprite.once('animationcomplete', function(){
        mgr.emit(E_PLAYER_ATTACK, { pos, damage: PLAYER_DAMAGE, cb})
        sprite.play(animations.getAnimation(TYPE_PLAYER, ANIM_STAND))
      })
    },
    hit(attack) {
      console.log(`hit for ${attack.damage} damage`)
      health -= attack.damage
      console.log(`${health} health left`)
      if (health <= 0) {
        sprite.play(animations.getAnimation(TYPE_PLAYER, ANIM_DIE))
      } else {
        sprite.play(animations.getAnimation(TYPE_PLAYER, ANIM_HIT))
      }
      sfx.hit.play()
      sprite.once('animationcomplete', function() {
        sprite.play(animations.getAnimation(TYPE_PLAYER, ANIM_STAND))
        // why don't we need this?
        attack.cb()
      })
    }
  }

  player.initSprite(scene)
  player.initAnims(scene)
  player.initSfx(scene)

  return player

}

export default Player