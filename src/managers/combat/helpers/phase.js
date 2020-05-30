import { PHASES, PLAYER_MOVE_SELECT, PLAYER_TURN } from 'managers/combat/constants/phases'

import noOp from 'managers/combat/helpers/phases/noOp'

export default {
  ...noOp,
  bf: null,
  set(phase) {
    Object.keys(noOp).forEach(k => this[k] = PHASES[PLAYER_TURN][phase][k])
    this.start()
  },
  init(scene, bf) {
    this.bf = bf
    this.scene = scene
    this.set(PLAYER_MOVE_SELECT)
  }
}