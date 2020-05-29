import cmds from 'managers/debug/helpers/cmds'

export const CMD_MOVE_TO_CELL = 'moveTo'
export const CMD_SPAWN_INGREDIENT = 'spawnIngredient'
export const CMD_REMOVE_INGREDIENT = 'removeIngredient'
export const CMD_SET_WEATHER = 'setWeather'

export const CMD_MUSIC = 'music'
export const CMD_MUSIC_OPT_PLAY = 'play'
export const CMD_MUSIC_OPT_PAUSE = 'pause'
export const CMD_MUSIC_OPT_RESTART = 'restart'

// unimplemented
export const CMD_SPAWN_NPC = 'spawnNPC'
export const CMD_REMOVE_NPC = 'removeNPC'
export const CMD_ADD_TO_INVENTORY = 'addToInventory'

export const CMDS = {
  [CMD_MOVE_TO_CELL]: cmds.moveToCell,
  [CMD_SPAWN_INGREDIENT]: cmds.spawnIngredient,
  [CMD_REMOVE_INGREDIENT]: cmds.removeIngredient,
  [CMD_SET_WEATHER]: cmds.setWeather,
  [CMD_MUSIC]: cmds.music,
}

