 import { E_INTERACT, E_INIT_SPAWN, E_INIT_PLAYER, E_PLAYER_MOVE_LEFT_START, E_PLAYER_MOVE_LEFT_END, E_PLAYER_MOVE_RIGHT_START, E_PLAYER_MOVE_RIGHT_END, E_PLAYER_MOVE_UP_START, E_PLAYER_MOVE_UP_END, E_PLAYER_MOVE_DOWN_START, E_PLAYER_MOVE_DOWN_END, E_PLAYER_INTERACT_START, E_PLAYER_INTERACT_END, E_CHANGE_SCENE, E_OPEN_DIALOGUE } from 'events/types'
import handler from 'events/handler'
import Player from 'managers/sprite/objects/player'

function startPlayerMoveDown() {
  player.startMoveDown()
}

function stopPlayerMoveDown() {
  player.stopMoveDown()
}

function startPlayerMoveUp() {
  player.startMoveUp()
}

function stopPlayerMoveUp() {
  player.stopMoveUp()
}

function startPlayerMoveLeft() {
  player.startMoveLeft()
}

function stopPlayerMoveLeft() {
  player.stopMoveLeft()
}

function startPlayerMoveRight() {
  player.startMoveRight()
}

function stopPlayerMoveRight() {
  player.stopMoveRight()
}

function startPlayerInteract() {
  manager.emit(E_INTERACT, player.getInteraction())
}

function stopPlayerInteract() {
  // null
}

function setSpawn(pos) {
  spawn = pos
}

function haltSFXAndAnimations() {
  player.halt()
}

var manager
var player
var spawn

function PlayerManager() {
  if (!manager) {
    manager = {
      ...handler,
      init(scene) {
        player = new Player(scene, spawn)

        this.emit(E_INIT_PLAYER, player)
      },
      drive() {
        player.drive()
      }
    }

    manager.on({
      [E_PLAYER_MOVE_DOWN_START]: startPlayerMoveDown,
      [E_PLAYER_MOVE_DOWN_END]: stopPlayerMoveDown,
      [E_PLAYER_MOVE_UP_START]: startPlayerMoveUp,
      [E_PLAYER_MOVE_UP_END]: stopPlayerMoveUp,
      [E_PLAYER_MOVE_RIGHT_START]: startPlayerMoveRight,
      [E_PLAYER_MOVE_RIGHT_END]: stopPlayerMoveRight,
      [E_PLAYER_MOVE_LEFT_START]: startPlayerMoveLeft,
      [E_PLAYER_MOVE_LEFT_END]: stopPlayerMoveLeft,
      [E_PLAYER_INTERACT_START]: startPlayerInteract,
      [E_PLAYER_INTERACT_END]: stopPlayerInteract,
      [E_INIT_SPAWN]: setSpawn,
      [E_CHANGE_SCENE]: haltSFXAndAnimations,
      [E_OPEN_DIALOGUE]: haltSFXAndAnimations,
      // on add to inventory, play pick animation
    })
  }
  return manager
}

export default PlayerManager