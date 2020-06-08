import { E_INIT_TILEMAP, E_INIT_PLAYER, E_COMBAT_SELECT, E_COMBAT_BACK, E_COMBAT_LEFT, E_COMBAT_RIGHT, E_COMBAT_UP, E_COMBAT_DOWN, E_INIT_ENEMIES, E_STOP_COMBAT } from "events/types"

import handler from "events/handler"
import path from 'managers/combat/helpers/path'
import phase from 'managers/combat/helpers/phase'
import sprites from 'managers/combat/helpers/sprites'

function select() {
  phase.select()
}

function back() {
  phase.back()
}

function up() {
  phase.up()
}

function down() {
  phase.down()
}

function left() {
  phase.left()
}

function right() {
  phase.right()
}

function setBattlefield(map) {
  width = map.width
  height = map.height

  tileMap = map
}

function setPlayer(newPlayer) {
  player = newPlayer
}

function setAllies() {
  // TODO
  // at some point we want to add multiple party members
}

// TODO add set NPCS to avoid collisions

function setEnemies(newEnemies) {
  enemies = newEnemies
}

function start() {
  path.setBattlefield(tileMap, player, [], enemies)

  var bf = {
    width,
    height,
    player,
    enemies,
    tileMap
  }

  player.moveToNearestTile()

  phase.init(scene, bf)
}

function end() {
  sprites.reset()
}

function init(newScene) {
  // add the game scene, not the combat scene - need this for proper rendering
  scene = newScene
}

var manager 
var scene
var tileMap
var width
var height
var player
var enemies

// the combat manager should handle

// setting up combat
// turns
// - the player turn
// - the enemy turns
//   - shortest path calculation
//   - traversal up to speed
//   - attack if able
// ui
// - pathfinding arrows
// - status bars above head
// chars
// - playing move/attack/onhit/ondeath/other animations
// - updating health/status
// end conditions for combat

function CombatManager() {
  if (!manager) {
    manager = {
      ...handler,
      init,
      start,
    }

    manager.on({
      [E_STOP_COMBAT]: end,
      [E_INIT_TILEMAP]: setBattlefield,
      [E_INIT_PLAYER]: setPlayer,
      [E_INIT_ENEMIES]: setEnemies,
      [E_COMBAT_SELECT]: select,
      [E_COMBAT_BACK]: back,
      [E_COMBAT_LEFT]: left,
      [E_COMBAT_RIGHT]: right,
      [E_COMBAT_UP]: up,
      [E_COMBAT_DOWN]: down,
    })
  }
  return manager
}

export default CombatManager