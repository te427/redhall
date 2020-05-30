import { E_MOVE_TO_CELL, E_SET_NONCOLLISION_TILE, E_SET_WEATHER, E_PLAY_MUSIC, E_PAUSE_MUSIC, E_RESTART_MUSIC, E_START_COMBAT, E_STOP_COMBAT } from 'events/types'

import handler from 'events/handler'
import { CMD_MUSIC_OPT_PAUSE, CMD_MUSIC_OPT_RESTART, CMD_COMBAT_OPT_STOP, CMD_COMBAT_OPT_START } from '../constants/cmds'

export default {
  // moveTo cell_name [cell_entrance]
  moveToCell(args) {
    handler.emit(E_MOVE_TO_CELL, { cell: args[0], entrance: args.length > 1 ? args[1] : null })
  },
  addNPC(args) {

  },
  removeNPC(args) {

  },
  // spawnIngredient x y key [width] [height]
  spawnIngredient(args) {
    handler.emit(E_SET_NONCOLLISION_TILE, { x: args[0], y: args[1], key: args[2], width: args[3], height: args[4]})
  },
  // removeIngredient x y [width] [height]
  removeIngredient(args) {
    handler.emit(E_SET_NONCOLLISION_TILE, { x: args[0], y: args[1], key: null, width: args[2], height: args[3]})
  },
  // setWeather {sunny|rainy}
  setWeather(args) {
    handler.emit(E_SET_WEATHER, args[0])
  },
  // music {play|pause|restart}
  music(args) {
    var e = args[0] === CMD_MUSIC_OPT_PAUSE
        ? E_PAUSE_MUSIC : args[0] === CMD_MUSIC_OPT_RESTART ?
            E_RESTART_MUSIC : E_PLAY_MUSIC
    handler.emit(e)
  },
  combat(args) {
    var e = args[0] === CMD_COMBAT_OPT_START ? E_START_COMBAT : E_STOP_COMBAT
    handler.emit(e)
  }
}