import noOp from 'managers/combat/helpers/phases/noOp'
import playerAttack from 'managers/combat/helpers/phases/playerAttack'
import playerMove from 'managers/combat/helpers/phases/playerMove'
import enemyQueue from 'managers/combat/helpers/phases/enemyQueue'
import enemyMoving from 'managers/combat/helpers/phases/enemyMoving'
import enemyAttacking from 'managers/combat/helpers/phases/enemyAttacking'

// starting player turn phase - allows player to scan battlefield
export const BATTLEFIELD = 'battlefield'
// selected from battlefield, shows enemy name, stats
export const ENEMY_INSPECT = 'enemyInspect'
// selected from battlefield, shows tile effects
export const TILE_INSPECT = 'tileInspect'
// initial menu for selecting move/attack/back when player selected from battlefield
export const PLAYER_ACTION = 'playerAction'
// move path overlay for the player as they select square to move to
export const PLAYER_MOVE = 'playerMove'
// player movement is animating - buttons are no-ops
export const PLAYER_MOVING = 'playerMoving'
// player attack overlay for valid attack squares
export const PLAYER_ATTACK = 'playerAttack'
// player attack is animating - buttons are no-ops
export const PLAYER_ATTACKING = 'playerAttacking'

// enemy order is being decided
export const ENEMY_QUEUE = 'enemyQueue'
// enemy is moving
export const ENEMY_MOVING = 'enemyMoving'
// enemy is attacking
export const ENEMY_ATTACKING = 'enemyAttacking'

export const PHASES = {
  [PLAYER_MOVE]: playerMove,
  [PLAYER_MOVING]: noOp,
  [PLAYER_ATTACK]: playerAttack,
  [PLAYER_ATTACKING]: noOp,
  // this could become the queue phase in general, for all entity turns
  [ENEMY_QUEUE]: enemyQueue,
  [ENEMY_MOVING]: enemyMoving,
  [ENEMY_ATTACKING]: enemyAttacking
}