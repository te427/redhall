import noOp from 'managers/combat/helpers/phases/noOp'
import playerAttack from 'managers/combat/helpers/phases/playerAttack'
import playerMove from 'managers/combat/helpers/phases/playerMove'

// PLAYER TURN
export const PLAYER_TURN = 'playerTurn'

// starting player turn phase - allows player to scan battlefield
export const BATTLEFIELD_SELECT = 'battlefieldSelect'

// selected from battlefield, shows enemy name, stats
export const ENEMY_INSPECT = 'enemyInspect'

// selected from battlefield, shows tile effects
export const TILE_INSPECT = 'enemyInspect'

// initial menu for selecting move/attack/back when player selected from battlefield
export const PLAYER_ACTION_SELECT = 'playerActionSelect'
// move path overlay for the player as they select square to move to
export const PLAYER_MOVE_SELECT = 'playerMoveSelect'
// player movement is animating - buttons are no-ops
export const PLAYER_MOVING = 'playerMoving'
// player attack overlay for valid attack squares
export const PLAYER_ATTACK_SELECT = 'playerAttackSelect'
// player attack is animating - buttons are no-ops
export const PLAYER_ATTACKING = 'playerAttacking'

// ENEMY TURN

// enemy turn - buttons are no-ops
export const ENEMY_TURN = 'enemyTurn'

// enemy is moving
export const ENEMY_MOVING = 'enemyMoving'

// enemy is attacking
export const ENEMY_ATTACKING = 'enemyAttacking'

export const PHASES = {
  [PLAYER_TURN]: {
    [PLAYER_MOVE_SELECT]: playerMove,
    [PLAYER_MOVING]: noOp,
    [PLAYER_ATTACK_SELECT]: playerAttack,
    [PLAYER_ATTACKING]: noOp,
  },
  [ENEMY_TURN]: {
    // TODO
  }
}