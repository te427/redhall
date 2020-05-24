import * as p from 'constants/data/paths'
import * as f from 'helpers/files'

export const FILE_DATA_MAP_MENU_DIALOGUE = f.path(p.MENU_MAP_PATH, f.json('dialogue'))

export const FILE_DATA_ITEMS_COLLISION = f.path(p.ITEMS_PATH, f.yaml('collision'))
export const FILE_DATA_ITEMS_NONCOLLISION = f.path(p.ITEMS_PATH, f.yaml('non_collision'))

export const FILE_DATA_DIALOGUE_DEFAULTS = f.path(p.DIALOGUE_PATH, f.yaml('defaults'))
export const FILE_DATA_DIALOGUE_TOPICS = f.path(p.DIALOGUE_PATH, f.yaml('topics'))

export const FILE_ASSET_TILES_MENUS = f.path(p.TILES_PATH, f.png('menu'))
export const FILE_ASSET_TILES_NON_COLLISION_ITEMS = f.path(p.TILES_PATH, f.png('non_collision_items'))
export const FILE_ASSET_TILES_WORLD = f.path(p.TILES_PATH, f.png('world'))

export const FILE_ASSET_SPRITES_PLAYER = f.path(p.SPRITE_PATH, f.png('player'))

export const FILE_ASSET_SFX_PLAYER_FOOTSTEP = f.path(p.PLAYER_SFX_PATH, f.wav('footstep'))

export const FILE_ASSET_FONTS_PRESS_START_16_MAP = f.path(p.FONT_PATH, f.fnt('press_start_16'))
export const FILE_ASSET_FONTS_PRESS_START_16_IMG = f.path(p.FONT_PATH, f.png('press_start_16'))
export const FILE_ASSET_FONTS_PRESS_START_24_MAP = f.path(p.FONT_PATH, f.fnt('press_start_24'))
export const FILE_ASSET_FONTS_PRESS_START_24_IMG = f.path(p.FONT_PATH, f.png('press_start_24'))