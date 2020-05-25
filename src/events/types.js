// key events
export const E_DOWN_KEYDOWN = 'eventDownKeydown'
export const E_DOWN_KEYUP= 'eventDownKeyup'
export const E_UP_KEYDOWN = 'eventUpKeydown'
export const E_UP_KEYUP = 'eventUpKeyup'
export const E_LEFT_KEYDOWN = 'eventLeftKeydown'
export const E_LEFT_KEYUP = 'eventLeftKeyup'
export const E_RIGHT_KEYDOWN = 'eventRightKeydown'
export const E_RIGHT_KEYUP = 'eventRightKeyup'
export const E_INTERACT_KEYDOWN = 'eventInteractKeydown'
export const E_INTERACT_KEYUP = 'eventInteractKeyup'
export const E_BACK_KEYDOWN = 'eventBackKeydown'
export const E_BACK_KEYUP = 'eventBackKeyup'
export const E_INVENTORY_KEYDOWN = 'eventIventoryKeydown'
export const E_DEBUG_KEYDOWN = 'eventDebugKeydown'

// player events
export const E_PLAYER_MOVE_LEFT_START = 'eventPlayerMoveLeftStart'
export const E_PLAYER_MOVE_LEFT_END = 'eventPlayerMoveLeftEnd'
export const E_PLAYER_MOVE_RIGHT_START = 'eventPlayerMoveRightStart'
export const E_PLAYER_MOVE_RIGHT_END = 'eventPlayerMoveRightEnd'
export const E_PLAYER_MOVE_UP_START = 'eventPlayerMoveUpStart'
export const E_PLAYER_MOVE_UP_END = 'eventPlayerMoveUpEnd'
export const E_PLAYER_MOVE_DOWN_START = 'eventPlayerMoveDownStart'
export const E_PLAYER_MOVE_DOWN_END = 'eventPlayerMoveDownEnd'
export const E_PLAYER_INTERACT_START = 'eventPlayerInteractStart'
export const E_PLAYER_INTERACT_END = 'eventPlayerInteractEnd'

// data load events
export const E_LOAD_CELL_DATA = 'eventLoadCellData'
export const E_LOAD_DIALOGUE_DATA = 'eventLoadDialogueData'
export const E_LOAD_NON_COLLISION_ITEM_DATA = 'eventLoadNonCollisionItemData'

// scene events
export const E_LOAD_SCENE = 'eventLoadScene'
export const E_CHANGE_SCENE = 'eventChangeScene'

// cell events
export const E_SET_CELL = 'eventSetCell'
export const E_MOVE_TO_CELL = 'eventMoveToCell'

// initialization events
export const E_INIT_PLAYER = 'eventInitPlayer'
export const E_INIT_NPCS = 'eventInitNPCs'
export const E_INIT_TILEMAP = 'eventInitTilemap'
export const E_INIT_TERRAIN = 'eventInitTerrain'
export const E_INIT_SPAWN = 'eventInitSpawn'

// world events 
export const E_INTERACT = 'eventInteract'
export const E_SET_NONCOLLISION_TILE = 'eventSetTile'

// dialogue events
export const E_OPEN_DIALOGUE = 'eventOpenDialogue'
export const E_CLOSE_DIALOGUE = 'eventCloseDialogue'
export const E_SET_DIALOGUE = 'eventSetDialogue'
export const E_START_SCROLL_DIALOGUE_UP = 'eventStartScrollDialogueUp'
export const E_STOP_SCROLL_DIALOGUE_UP = 'eventStopScrollDialogueUp'
export const E_START_SCROLL_DIALOGUE_DOWN = 'eventStartScrollDialogueDown'
export const E_STOP_SCROLL_DIALOGUE_DOWN = 'eventStopScrollDialogueDown'
export const E_DIALOGUE_SELECT = 'eventDialogueSelect'
export const E_DIALOGUE_BACK = 'eventDialogueBack'

// inventory events
export const E_OPEN_INVENTORY = 'eventOpenInventory'
export const E_CLOSE_INVENTORY = 'eventCloseInventory'
export const E_NAV_UP = 'eventNavUp'
export const E_NAV_DOWN = 'eventNavDown'
export const E_NAV_LEFT = 'eventNavLeft'
export const E_NAV_RIGHT = 'eventNavRight'
export const E_ADD_TO_INVENTORY = 'eventAddToInventory'

// debug events
export const E_LOG_DEBUG = 'eventLogDebug'
export const E_OPEN_DEBUG = 'eventOpenDebug'
export const E_CLOSE_DEBUG = 'eventCloseDebug'
export const E_EXEC_DEBUG_CMD = 'eventExecDebugCmd'
