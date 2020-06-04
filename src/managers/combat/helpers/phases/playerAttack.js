import { PLAYER_MOVE, PLAYER_ATTACKING, ENEMY_QUEUE } from "managers/combat/constants/phases"

import attack from 'managers/combat/helpers/attack'
import sprites from 'managers/combat/helpers/sprites'

function finishedAttackCallback(o) {
  return () => o.set(ENEMY_QUEUE)
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

var cursorPos
var possible

export default {
  start() {
    console.log('starting attack phase')
    cursorPos = this.bf.player.getPos()

    possible = attack.getAttacks(this.bf)

    sprites.drawPossibleAttacks(this.scene, possible)

  },
  select() {
    this.set(PLAYER_ATTACKING)
    this.bf.player.attack(cursorPos, finishedAttackCallback(this))
  },
  back() {

  },
  left() {
    moveCursorLeft()

    sprites.drawCursor(this.scene, cursorPos, possible)
  },
  right() {
    moveCursorRight(this.bf)

    sprites.drawCursor(this.scene, cursorPos, possible)
  },
  up() {
    moveCursorUp()

    sprites.drawCursor(this.scene, cursorPos, possible)
  },
  down() {
    moveCursorDown(this.bf)

    sprites.drawCursor(this.scene, cursorPos, possible)
  },
  end() {
    console.log('ending attack phase')
    sprites.reset()
  }
}