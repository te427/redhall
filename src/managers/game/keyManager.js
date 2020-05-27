import * as Phaser from 'phaser' 

import { E_DEBUG_KEYDOWN, E_INTERACT_KEYDOWN, E_INTERACT_KEYUP, E_BACK_KEYDOWN, E_BACK_KEYUP, E_DOWN_KEYDOWN, E_DOWN_KEYUP, E_UP_KEYDOWN, E_UP_KEYUP, E_LEFT_KEYDOWN, E_LEFT_KEYUP, E_RIGHT_KEYDOWN, E_RIGHT_KEYUP, E_INVENTORY_KEYDOWN, E_OPEN_DEBUG, E_CLOSE_DEBUG } from 'events/types'
import handler from 'events/handler'

function disableKeysForDebug() {
  // halt player
  keys.forEach(k => k.enabled = false)
  scene.input.keyboard.disableGlobalCapture()
}

function enableKeysForDebug() {
  keys.forEach(k => k.enabled = true)
  scene.input.keyboard.disableGlobalCapture()
}

function interactKeydown() {
  this.emit(E_INTERACT_KEYDOWN)  
}

function interactKeyup() {
  this.emit(E_INTERACT_KEYUP)  
}

function backKeydown() {
  this.emit(E_BACK_KEYDOWN)  
}

function backKeyup() {
  this.emit(E_BACK_KEYUP)  
}

function downKeydown() {
  this.emit(E_DOWN_KEYDOWN)  
}

function downKeyup() {
  this.emit(E_DOWN_KEYUP)  
}

function upKeydown() {
  this.emit(E_UP_KEYDOWN)  
}

function upKeyup() {
  this.emit(E_UP_KEYUP)  
}

function leftKeydown() {
  this.emit(E_LEFT_KEYDOWN)  
}

function leftKeyup() {
  this.emit(E_LEFT_KEYUP)  
}

function rightKeydown() {
  this.emit(E_RIGHT_KEYDOWN)  
}

function rightKeyup() {
  this.emit(E_RIGHT_KEYUP)  
}

function openInventory() {
  this.emit(E_INVENTORY_KEYDOWN)
}

function toggleDebug() {
  this.emit(E_DEBUG_KEYDOWN)
}

function init(newScene) {
  scene = newScene

  var keyCodes = Phaser.Input.Keyboard.KeyCodes
  if (!initialized) {
    var interact = scene.input.keyboard.addKey(keyCodes.J)
    interact.on('down', interactKeydown, this)
    interact.on('up', interactKeyup, this)

    var back = scene.input.keyboard.addKey(keyCodes.K)
    back.on('down', backKeydown, this)
    back.on('up', backKeyup, this)

    var inventory = scene.input.keyboard.addKey(keyCodes.I)
    inventory.on('down', openInventory, this)

    var down = scene.input.keyboard.addKey(keyCodes.S)
    down.on('down', downKeydown, this)
    down.on('up', downKeyup, this)

    var up = scene.input.keyboard.addKey(keyCodes.W)
    up.on('down', upKeydown, this)
    up.on('up', upKeyup, this)

    var left = scene.input.keyboard.addKey(keyCodes.A)
    left.on('down', leftKeydown, this)
    left.on('up', leftKeyup, this)

    var right = scene.input.keyboard.addKey(keyCodes.D)
    right.on('down', rightKeydown, this)
    right.on('up', rightKeyup, this)

    // leave this out of keys to not disable when debugging
    var debug = scene.input.keyboard.addKey(keyCodes.BACKTICK)
    debug.on('down', toggleDebug, this)

    keys = [
      interact,
      back,
      inventory,
      down,
      up,
      left,
      right,
    ]

    initialized = true
  }
}

var manager
var scene
var initialized
var keys

function KeyManager() {
  if (!manager) {
    manager = {
      ...handler,
      init,
    }

    manager.on({
      [E_OPEN_DEBUG]: disableKeysForDebug, 
      [E_CLOSE_DEBUG]: enableKeysForDebug, 
    })
  }
  return manager
}

export default KeyManager