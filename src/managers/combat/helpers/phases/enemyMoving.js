import { ENEMY_ATTACKING } from 'managers/combat/constants/phases'
import { ENEMY_SPEED } from 'managers/combat/constants/stats'

import noOp from 'managers/combat/helpers/phases/noOp'
import path from 'managers/combat/helpers/path'

function finishedMoveCallback(o, enemy) {
  return () => o.set(ENEMY_ATTACKING, enemy)
}

export default {
  ...noOp,
  start(enemy) {
    var shortestPath = path.getShortestPath(enemy.getPos(), this.bf.player.getPos(), ENEMY_SPEED)
    setTimeout(() => enemy.moveAlongPath(shortestPath, finishedMoveCallback(this, enemy)), 1000)
  },
  end() {

  }
}