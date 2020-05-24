import * as context from 'constants/context'
import * as events from 'events/types'
import handler from 'events/handler'

function playerInteractDown() {
  manager.emit(events.E_PLAYER_INTERACT_START)
}

function playerInteractUp() {
  manager.emit(events.E_PLAYER_INTERACT_END)
}

function playerDownDown() {
  manager.emit(events.E_PLAYER_MOVE_DOWN_START)
}

function playerDownUp() {
  manager.emit(events.E_PLAYER_MOVE_DOWN_END)
}

function playerUpDown() {
  manager.emit(events.E_PLAYER_MOVE_UP_START)
}

function playerUpUp() {
  manager.emit(events.E_PLAYER_MOVE_UP_END)
}

function playerLeftDown() {
  manager.emit(events.E_PLAYER_MOVE_LEFT_START)
}

function playerLeftUp() {
  manager.emit(events.E_PLAYER_MOVE_LEFT_END)
}

function playerRightDown() {
  manager.emit(events.E_PLAYER_MOVE_RIGHT_START)
}

function playerRightUp() {
  manager.emit(events.E_PLAYER_MOVE_RIGHT_END)
}

function openDialogue() {
  ctx = context.CTX_DIALOGUE
}

function closeDialogue() {
  ctx = context.CTX_EXPLORE
}

function dialogueBackDown() {
  manager.emit(events.E_DIALOGUE_BACK)
}

function dialogueSelectDown() {
  manager.emit(events.E_DIALOGUE_SELECT)
}

function dialogueStartScrollDown() {
  manager.emit(events.E_START_SCROLL_DIALOGUE_DOWN)
}

function dialogueStartScrollUp() {
  manager.emit(events.E_START_SCROLL_DIALOGUE_UP)
}
function dialogueStopScrollDown() {
  manager.emit(events.E_STOP_SCROLL_DIALOGUE_DOWN)
}

function dialogueStopScrollUp() {
  manager.emit(events.E_STOP_SCROLL_DIALOGUE_UP)
}

function openInventory() {
  ctx = context.CTX_INVENTORY
  manager.emit(events.E_OPEN_INVENTORY)
}

function closeInventory() {
  ctx = context.CTX_EXPLORE
  manager.emit(events.E_CLOSE_INVENTORY)
}

function inventoryNavLeft() {
  manager.emit(events.E_NAV_LEFT)
}

function inventoryNavRight() {
  manager.emit(events.E_NAV_RIGHT)
}

function inventoryNavUp() {
  manager.emit(events.E_NAV_UP)
}

function inventoryNavDown() {
  manager.emit(events.E_NAV_DOWN)
}

function translate(_, event) {
  var fn = contextDict[ctx][event]
  if (!fn) {
    console.debug(`No function handler for event ${event}`)
    return
  }
  try {
    fn()
  } catch (err) {
    console.error(`Event ${event} has errors for context ${ctx}`)
    console.error(err)
  }
}

var manager
var ctx = context.CTX_EXPLORE
var contextDict = {
  // add loading context
  [context.CTX_EXPLORE]: {
    [events.E_RIGHT_KEYDOWN]: playerRightDown,
    [events.E_RIGHT_KEYUP]: playerRightUp,
    [events.E_LEFT_KEYDOWN]: playerLeftDown,
    [events.E_LEFT_KEYUP]: playerLeftUp,
    [events.E_UP_KEYDOWN]: playerUpDown,
    [events.E_UP_KEYUP]: playerUpUp,
    [events.E_DOWN_KEYDOWN]: playerDownDown,
    [events.E_DOWN_KEYUP]: playerDownUp,
    [events.E_INTERACT_KEYDOWN]: playerInteractDown,
    [events.E_INTERACT_KEYUP]: playerInteractUp,
    [events.E_INVENTORY_KEYDOWN]: openInventory,
  },
  [context.CTX_DIALOGUE]: {
    [events.E_INTERACT_KEYDOWN]: dialogueSelectDown,
    [events.E_BACK_KEYDOWN]: dialogueBackDown,
    [events.E_DOWN_KEYUP]: dialogueStopScrollDown,
    [events.E_DOWN_KEYDOWN]: dialogueStartScrollDown,
    [events.E_UP_KEYUP]: dialogueStopScrollUp,
    [events.E_UP_KEYDOWN]: dialogueStartScrollUp,
  },
  [context.CTX_INVENTORY]: {
    [events.E_INVENTORY_KEYDOWN]: closeInventory,
    [events.E_LEFT_KEYDOWN]: inventoryNavLeft,
    [events.E_UP_KEYDOWN]: inventoryNavUp,
    [events.E_DOWN_KEYDOWN]: inventoryNavDown,
    [events.E_RIGHT_KEYDOWN]: inventoryNavRight,
  }
}

function ContextManager() {
  if (!manager) {
    manager = {
      ...handler,
    }

    manager.on({
      [events.E_OPEN_DIALOGUE]: openDialogue,
      [events.E_CLOSE_DIALOGUE]: closeDialogue, 
    })

    manager.on([
      events.E_RIGHT_KEYDOWN,
      events.E_RIGHT_KEYUP,
      events.E_LEFT_KEYDOWN,
      events.E_LEFT_KEYUP,
      events.E_UP_KEYDOWN,
      events.E_UP_KEYUP,
      events.E_DOWN_KEYDOWN,
      events.E_DOWN_KEYUP,
      events.E_INTERACT_KEYDOWN,
      events.E_INTERACT_KEYUP,
      events.E_BACK_KEYDOWN,
      events.E_BACK_KEYUP,
      events.E_INVENTORY_KEYDOWN,
    ], translate)
  }


  return manager
}

export default ContextManager