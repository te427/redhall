import { ENEMY_QUEUE } from 'managers/combat/constants/phases'
import noOp from 'managers/combat/helpers/phases/noOp'

function finishedMoveCallback(o) {
  return () => o.set(ENEMY_QUEUE)
}

export default {
  ...noOp,
  start(enemy) {
    console.log('enemy attacking')
    var attackDir = enemy.adjacentTo(this.bf.player.getPos())
    if (attackDir) {
      enemy.attack(attackDir, finishedMoveCallback(this))
    } else {
      this.set(ENEMY_QUEUE)
    }
  },
  end() {

  }
}