import { ENEMY_SPEED } from 'managers/combat/constants/stats'

import noOp from 'managers/combat/helpers/phases/noOp'
import path from 'managers/combat/helpers/path'

export default {
  ...noOp,
  start(data) {
    var { enemy } = data
    var shortestPath = path.getShortestPath(enemy.getPos(), this.player.getPos(), ENEMY_SPEED)
  },
  end() {

  }
}