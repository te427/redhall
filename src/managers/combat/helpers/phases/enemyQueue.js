import { PLAYER_MOVE, ENEMY_MOVING } from "managers/combat/constants/phases"

import noOp from 'managers/combat/helpers/phases/noOp'

var index = 0

export default {
  ...noOp,
  start() {
    if (index === this.enemies.length) {
      index = 0
      this.set(PLAYER_MOVE)
    } else {
      this.set(ENEMY_MOVING, this.enemies[index++])
    }
  },
}