import { PLAYER_MOVING, PLAYER_MOVE_SELECT } from "managers/combat/constants/phases"
import { PLAYER_SPEED } from "managers/combat/constants/stats"

import path from 'managers/combat/helpers/path'
import sprites from 'managers/combat/helpers/sprites'

var cursorPos 

function finishedMoveCallback(o) {
  return () => o.set(PLAYER_MOVE_SELECT)
}

function moveCursorLeft() {
  cursorPos = { x: cursorPos.x - 1, y: cursorPos.y }
}

function moveCursorRight() {
  cursorPos = { x: cursorPos.x + 1, y: cursorPos.y }
}

function moveCursorUp() {
  cursorPos = { x: cursorPos.x, y: cursorPos.y - 1}
}

function moveCursorDown() {
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

export default {
  start() {
    console.log('starting move phase')
    cursorPos = this.bf.player.getPos()

    var possible = path.getPossiblePaths(cursorPos, PLAYER_SPEED)

    sprites.drawPossibleMoves(this.scene, cursorPos, possible)
    sprites.drawValid(this.scene, cursorPos)
  },
  select() {
    // create callbacks along path
    this.bf.player.moveAlongPath(currentPath, finishedMoveCallback(this))
    this.end()
  },
  back() {
    this.end()
  },
  left() {
    moveCursorLeft()

    drawPath(this.scene)
  },
  right() {
    moveCursorRight()

    drawPath(this.scene)
  },
  up() {
    moveCursorUp()

    drawPath(this.scene)
  },
  down() {
    moveCursorDown()

    drawPath(this.scene)
  },
  end() {
    console.log('ending move phase')
    sprites.reset()
    this.set(PLAYER_MOVING)
  }
}