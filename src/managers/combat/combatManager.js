import { E_INIT_TILEMAP } from "events/types"

import handler from "events/handler"
import path from 'managers/combat/helpers/path'

function setBattlefield(map) {
  path.setBattlefield(map)
}

function setPlayer(player) {

}

function setAllies() {
  // TODO
  // at some point we want to add multiple party members
}

function setEnemies(enemies) {

}

function selectPoint() {
  // if has player, get possible paths
  // if has enemy, get enemy stats
  // TODO
  // if nothing (or any tile?) return effects?
}

function init(newScene) {
  scene = newScene

  // get all combatants
  // calculate turn order

}

var manager 
var scene
var combatants

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
      ...handler
    }
  }

  manager.on({
    [E_INIT_TILEMAP]: setBattlefield 
  })

  return manager
}

export default CombatManager