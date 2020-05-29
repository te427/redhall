import { E_INIT_TERRAIN, E_INIT_NPCS, E_INIT_PLAYER, E_INIT_TILEMAP, E_INIT_ENEMIES } from 'events/types';
import { FPS } from 'constants/dimensions/game'
import handler from 'events/handler'

function setTerrain(terrainLayer) {
  terrain = terrainLayer
}

function setPlayer(playerSprite) {
  player = playerSprite
}

function setNPCs(npcSprites) {
  npcs = npcSprites
}

function setEnemies(enemySprites) {
  enemies = enemySprites
}

function setMapCollision(newMap) {
  map = newMap
}

var manager
var map
var player
var npcs
var enemies
var terrain

function CollisionManager() {
  if(!manager) {
    manager = {
      ...handler,
      init(scene) {
        scene.physics.world.setFPS(FPS)

        if (terrain && player && npcs) {
          player.setCollideWorldBounds(true)

          map.setCollisionByProperty({ collide: true }, true, true, terrain)
          scene.physics.add.collider(player, terrain)

          if (npcs) {
            npcs.forEach(npc => scene.physics.add.collider(player, npc))
          }

          if (enemies) {
            enemies.forEach(enemy => scene.physics.add.collider(player, enemy))
          }
        }
      }
    }

    manager.on({
      [E_INIT_TILEMAP]: setMapCollision,
      [E_INIT_TERRAIN]: setTerrain,
      [E_INIT_NPCS]: setNPCs,
      [E_INIT_PLAYER]: setPlayer,
      [E_INIT_ENEMIES]: setEnemies
    })
  }
  return manager
}

export default CollisionManager