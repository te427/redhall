import { E_MOVE_TO_CELL, E_SET_NONCOLLISION_TILE, E_SET_WEATHER } from 'events/types'
import { TILE_SIZE } from 'constants/dimensions/game'

import handler from 'events/handler'

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
  }
}