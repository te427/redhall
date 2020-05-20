import { E_INTERACT_KEYDOWN, E_INTERACT_KEYUP, E_BACK_KEYDOWN, E_BACK_KEYUP, E_DOWN_KEYDOWN, E_DOWN_KEYUP, E_UP_KEYDOWN, E_UP_KEYUP, E_LEFT_KEYDOWN, E_LEFT_KEYUP, E_RIGHT_KEYDOWN, E_RIGHT_KEYUP } from 'events/types'
import handler from 'events/handler'

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

function init(scene) {
  var a = scene.input.keyboard.addKey('A')
  a.on('down', interactKeydown, this)
  a.on('up', interactKeyup, this)

  var s = scene.input.keyboard.addKey('S')
  s.on('down', backKeydown, this)
  s.on('up', backKeyup, this)

  var down = scene.input.keyboard.addKey('down')
  down.on('down', downKeydown, this)
  down.on('up', downKeyup, this)

  var up = scene.input.keyboard.addKey('up')
  up.on('down', upKeydown, this)
  up.on('up', upKeyup, this)

  var left = scene.input.keyboard.addKey('left')
  left.on('down', leftKeydown, this)
  left.on('up', leftKeyup, this)

  var right = scene.input.keyboard.addKey('right')
  right.on('down', rightKeydown, this)
  right.on('up', rightKeyup, this)
}

var manager

function KeyManager() {
  if (!manager) {
    manager = {
      ...handler,
      init,
    }
  }
  return manager
}

export default KeyManager