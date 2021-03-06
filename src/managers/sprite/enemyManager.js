import { E_INIT_ENEMIES, E_LOAD_CELL_DATA, E_INIT_PLAYER, E_START_COMBAT, E_STOP_COMBAT, E_ATTACK, E_PLAYER_ATTACK } from "events/types"

import handler from "events/handler"
import Enemy from "managers/sprite/objects/enemy"
import { TILE_SIZE } from "constants/dimensions/game"

import notify from "notifications/notify"

import sprites from 'managers/combat/helpers/sprites'
import { PLAYER_NAME } from "./constants/player"

function setEnemies(cell) {
  data = cell.enemies
}

function setPlayer(sprite) {
  player = sprite 
}

function startCombat() {
  inCombat = true
}

function stopCombat() {
  inCombat = false 
}

function attack(a) {
  var target = enemies.find(e => e.getPos().x === a.pos.x && e.getPos().y === a.pos.y)
  if (target && !target.isDead()) {
    target.hit(a)
    renderHealth(target)
    manager.notify(`${target.getName()} hit for ${a.damage} HP!`)
    if (target.isDead()) {
      manager.notify(`${target.getName()} has been defeated!`)
    }
  } else {
    a.cb()
  }
}

function renderHealth(e) {
  sprites.drawHealthBar(scene, e.getPos(), e.getHealth())
}

var manager
var scene
var data
var enemies
var player
var inCombat

function EnemyManager() {
  if (!manager) {
    manager = {
      ...notify,
      ...handler,
      init(newScene) {
        scene = newScene
        enemies = data ? data.map(e => (new Enemy(manager, newScene, e))) : []
        
        this.emit(E_INIT_ENEMIES, enemies)
      },
      scan() {
        if (!inCombat && enemies) {
          var playerSprite = player.getSprite()
          enemies.forEach(function(e) {
            if (e.isDead()) return

            var enemy = e.getSprite()

            var x = Math.abs(enemy.x - playerSprite.x)
            var y = Math.abs(enemy.y - playerSprite.y)

            // make a disableCombat command?
            if (x < 3 * TILE_SIZE && y < 3 * TILE_SIZE ) {
              manager.notify([
                `${e.getName()} has spotted ${PLAYER_NAME}!`,
                'Prepare to fight!'
              ])
              manager.emit(E_START_COMBAT)
            }
          })
        }
      },
      drive() {
        enemies.forEach(e => e.drive())
      }
    }

    manager.on({
      [E_LOAD_CELL_DATA]: setEnemies,
      [E_INIT_PLAYER]: setPlayer,
      [E_START_COMBAT]: startCombat,
      [E_STOP_COMBAT]: stopCombat,
      [E_PLAYER_ATTACK]: attack,
    })
  }

  return manager
}

export default EnemyManager