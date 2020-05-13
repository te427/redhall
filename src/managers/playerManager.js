 import { E_PLAYER_MOVE_LEFT_START, E_PLAYER_MOVE_LEFT_END, E_PLAYER_MOVE_RIGHT_START, E_PLAYER_MOVE_RIGHT_END, E_PLAYER_MOVE_UP_START, E_PLAYER_MOVE_UP_END, E_PLAYER_MOVE_DOWN_START, E_PLAYER_MOVE_DOWN_END, E_PLAYER_INTERACT_START, E_PLAYER_INTERACT_END } from 'events/types'
import handler from 'events/handler'
import Player from 'objects/player'

var manager
var player

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
  player.startInteract()
}

function stopPlayerInteract() {
  player.stopInteract()
}

function PlayerManager() {
  if (!manager) {
    manager = {
      ...handler,
      load(scene) {
        player = new Player(scene)
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
    })
  }
  return manager
}

export default PlayerManager