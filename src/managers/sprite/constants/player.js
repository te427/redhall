import * as s from 'managers/sprite/constants/sprites'

export const VELOCITY = 32
export const SFX_MOVING = 'moving'

export const DIR_TO_ANIMATION = {
  [s.DIR_LEFT]: s.ANIM_WALK_LEFT,
  [s.DIR_RIGHT]: s.ANIM_WALK_RIGHT,
  [s.DIR_UP]: s.ANIM_WALK_UP,
  [s.DIR_DOWN]: s.ANIM_WALK_DOWN
}