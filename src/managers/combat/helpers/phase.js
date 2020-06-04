import { PHASES, PLAYER_MOVE } from 'managers/combat/constants/phases'

import noOp from 'managers/combat/helpers/phases/noOp'

export default {
  ...noOp,
  bf: null,
  set(phase, data = null) {
    this.end(data)
    Object.keys(noOp).forEach(k => this[k] = PHASES[phase][k])
    this.start(data)
  },
  init(scene, bf) {
    this.bf = bf
    this.scene = scene
    this.set(PLAYER_MOVE)
  }
}