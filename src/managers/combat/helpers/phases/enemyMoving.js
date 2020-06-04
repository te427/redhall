import { ENEMY_QUEUE } from 'managers/combat/constants/phases'
import { ENEMY_SPEED } from 'managers/combat/constants/stats'

import noOp from 'managers/combat/helpers/phases/noOp'
import path from 'managers/combat/helpers/path'

function finishedMoveCallback(o) {
  return () => o.set(ENEMY_QUEUE)
}

export default {
  ...noOp,
  start(enemy) {
    var shortestPath = path.getShortestPath(enemy.getPos(), this.bf.player.getPos(), ENEMY_SPEED)
    enemy.moveAlongPath(shortestPath, finishedMoveCallback(this))
  },
  end() {

  }
}