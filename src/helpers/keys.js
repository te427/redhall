import { MAP_KEY, PLAYER_KEY, SFX_KEY, SPRITE_KEY } from "constants/keys"

const generatedKey = (keys) => keys.reduce((acc, k) => acc.length ? `${acc}_${k}` : k, '')

export const mapKey = (key) => generatedKey([MAP_KEY, key])

export const playerSFXKey = (key) => generatedKey([SFX_KEY, PLAYER_KEY, key])
export const npcSFXKey = (npc, key) => generatedKey([SFX_KEY, npc.key, key])
export const enemySFXKey = (enemy, key) => generatedKey([SFX_KEY, enemy.key, key])

export const playerSpriteKey = (key) => generatedKey([SPRITE_KEY, PLAYER_KEY, key])
export const npcSpriteKey = (npc, key) => generatedKey([SPRITE_KEY, npc.key, key])
export const enemySpriteKey = (enemy, key) => generatedKey([SPRITE_KEY, enemy.key, key])