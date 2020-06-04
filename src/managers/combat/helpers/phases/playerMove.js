import { PLAYER_MOVING, PLAYER_ATTACK } from "managers/combat/constants/phases"
import { PLAYER_SPEED } from "managers/combat/constants/stats"

import path from 'managers/combat/helpers/path'
import sprites from 'managers/combat/helpers/sprites'

function finishedMoveCallback(o) {
  return () => o.set(PLAYER_ATTACK)
}

function moveCursorLeft() {
  if (!cursorPos.x) return
  cursorPos = { x: cursorPos.x - 1, y: cursorPos.y }
}

function moveCursorRight(bf) {
  if (cursorPos.x + 1 == bf.tileMap.width) return
  cursorPos = { x: cursorPos.x + 1, y: cursorPos.y }
}

function moveCursorUp() {
  if (!cursorPos.y) return
  cursorPos = { x: cursorPos.x, y: cursorPos.y - 1}
}

function moveCursorDown(bf) {
  if (cursorPos.y + 1 == bf.tileMap.height) return
  cursorPos = { x: cursorPos.x, y: cursorPos.y  + 1}
}

function drawPath(scene) {
  currentPath = path.getPossiblePath(cursorPos)
  if (!currentPath.length) {
    currentPath = []
    sprites.removePath()
    sprites.drawInvalid(scene, cursorPos)
  } else {
    sprites.drawPath(scene, currentPath)
  }
}

var currentPath 
var cursorPos 

export default {
  start() {
    console.log('starting move phase')
    cursorPos = this.bf.player.getPos()

    var possible = path.getPossiblePaths(cursorPos, PLAYER_SPEED)

    sprites.drawPossibleMoves(this.scene, cursorPos, possible)
  },
  select() {
    // create callbacks along path
    this.set(PLAYER_MOVING)
    this.bf.player.moveAlongPath(currentPath, finishedMoveCallback(this))
  },
  back() {

  },
  left() {
    moveCursorLeft()

    drawPath(this.scene)
  },
  right() {
    moveCursorRight(this.bf)

    drawPath(this.scene)
  },
  up() {
    moveCursorUp()

    drawPath(this.scene)
  },
  down() {
    moveCursorDown(this.bf)

    drawPath(this.scene)
  },
  end() {
    console.log('ending move phase')
    sprites.reset()
  }
}