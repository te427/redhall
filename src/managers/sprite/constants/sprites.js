export const ANIM_STAND = 'stand'
export const ANIM_WALK_DOWN = 'walk-down'
export const ANIM_WALK_UP = 'walk-up'
export const ANIM_WALK_LEFT = 'walk-left'
export const ANIM_WALK_RIGHT = 'walk-right'
export const ANIM_HIT = 'hit'
export const ANIM_ATTACK_LEFT = 'attack-left'
export const ANIM_ATTACK_RIGHT= 'attack-right'
export const ANIM_ATTACK_UP = 'attack-up'
export const ANIM_ATTACK_DOWN = 'attack-down'
export const ANIM_DIE = 'die'

export const DIR_LEFT = 'left'
export const DIR_RIGHT = 'right'
export const DIR_UP = 'up'
export const DIR_DOWN = 'down'

export const WALK_DIR_TO_ANIMATION = {
  [DIR_LEFT]: ANIM_WALK_LEFT,
  [DIR_RIGHT]: ANIM_WALK_RIGHT,
  [DIR_UP]: ANIM_WALK_UP,
  [DIR_DOWN]: ANIM_WALK_DOWN
}

export const ATTACK_DIR_TO_ANIMATION = {
  [DIR_LEFT]: ANIM_ATTACK_LEFT,
  [DIR_RIGHT]: ANIM_ATTACK_RIGHT,
  [DIR_UP]: ANIM_ATTACK_UP,
  [DIR_DOWN]: ANIM_ATTACK_DOWN
}

export const TYPE_PLAYER = 'player'
export const TYPE_ENEMY = 'enemy'