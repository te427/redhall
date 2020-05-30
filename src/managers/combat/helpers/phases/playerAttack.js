import { PLAYER_MOVE_SELECT } from "managers/combat/constants/phases"

export default {
  start() {
    console.log('starting attack phase')
  },
  select() {
    this.end()
  },
  back() {

  },
  left() {

  },
  right() {

  },
  up() {

  },
  down() {

  },
  end() {
    console.log('ending attack phase')
    this.set(PLAYER_MOVE_SELECT)
  }
}