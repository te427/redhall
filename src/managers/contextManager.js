import { E_INTERACT_KEYDOWN, E_INTERACT_KEYUP, E_DOWN_KEYDOWN, E_DOWN_KEYUP, E_UP_KEYDOWN, E_UP_KEYUP, E_LEFT_KEYDOWN, E_LEFT_KEYUP, E_RIGHT_KEYDOWN, E_RIGHT_KEYUP, E_PLAYER_MOVE_DOWN_START, E_PLAYER_MOVE_DOWN_END, E_PLAYER_INTERACT_END, E_PLAYER_INTERACT_START, E_PLAYER_MOVE_UP_START, E_PLAYER_MOVE_UP_END, E_PLAYER_MOVE_LEFT_START, E_PLAYER_MOVE_LEFT_END, E_PLAYER_MOVE_RIGHT_START, E_PLAYER_MOVE_RIGHT_END } from 'events/types'
import handler from 'events/handler'

function playerInteractDown() {
  manager.emit(E_PLAYER_INTERACT_START)
}

function playerInteractUp() {
  manager.emit(E_PLAYER_INTERACT_END)
}

function playerDownDown() {
  manager.emit(E_PLAYER_MOVE_DOWN_START)
}

function playerDownUp() {
  manager.emit(E_PLAYER_MOVE_DOWN_END)
}

function playerUpDown() {
  manager.emit(E_PLAYER_MOVE_UP_START)
}

function playerUpUp() {
  manager.emit(E_PLAYER_MOVE_UP_END)
}

function playerLeftDown() {
  manager.emit(E_PLAYER_MOVE_LEFT_START)
}

function playerLeftUp() {
  manager.emit(E_PLAYER_MOVE_LEFT_END)
}

function playerRightDown() {
  manager.emit(E_PLAYER_MOVE_RIGHT_START)
}

function playerRightUp() {
  manager.emit(E_PLAYER_MOVE_RIGHT_END)
}

function translate(event) {
  try {
    context[ctx][event]()
  } catch (err) {
    console.error('Context is unimplemented for event!')
    console.error(err)
  }
}

var manager
var ctx = 'explore'
var context = {
  // make these constants
  ['explore']: {
    [E_RIGHT_KEYDOWN]: playerRightDown,
    [E_RIGHT_KEYUP]: playerRightUp,
    [E_LEFT_KEYDOWN]: playerLeftDown,
    [E_LEFT_KEYUP]: playerLeftUp,
    [E_UP_KEYDOWN]: playerUpDown,
    [E_UP_KEYUP]: playerUpUp,
    [E_DOWN_KEYDOWN]: playerDownDown,
    [E_DOWN_KEYUP]: playerDownUp,
    [E_INTERACT_KEYDOWN]: playerInteractDown,
    [E_INTERACT_KEYUP]: playerInteractUp
  },
  ['dialogue']: {}
}

function ContextManager() {
  if (!manager) {
    manager = {
      ...handler,
      setContext(c) {
        ctx = c
      }
    }

    manager.on([
      E_RIGHT_KEYDOWN,
      E_RIGHT_KEYUP,
      E_LEFT_KEYDOWN,
      E_LEFT_KEYUP,
      E_UP_KEYDOWN,
      E_UP_KEYUP,
      E_DOWN_KEYDOWN,
      E_DOWN_KEYUP,
      E_INTERACT_KEYDOWN,
      E_INTERACT_KEYUP
    ], translate.bind(manager))
  }


  return manager
}

export default ContextManager