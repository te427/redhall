import { PHASES, PLAYER_MOVE } from 'managers/combat/constants/phases'
import { E_STOP_COMBAT } from 'events/types'

import noOp from 'managers/combat/helpers/phases/noOp'
import handler from 'events/handler'

// TODO
// should change this thing to be driven by the combat manager and a state machine
// making phases not need to be aware of each other, as well as allowing for combat 
// monitoring the state of things between phases

export default {
  ...handler,
  ...noOp,
  bf: null,
  set(phase, data = null) {
    this.end(data)
    if (this.bf.enemies.every(e => e.isDead())) {
      handler.emit(E_STOP_COMBAT)
      return 
    }
    Object.keys(noOp).forEach(k => this[k] = PHASES[phase][k])
    this.start(data)
  },
  init(scene, bf) {
    this.bf = bf
    this.scene = scene
    this.set(PLAYER_MOVE)
  }
}