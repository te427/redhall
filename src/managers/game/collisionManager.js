import { E_INIT_TERRAIN, E_INIT_NPCS, E_INIT_PLAYER, E_INIT_TILEMAP, E_INIT_ENEMIES } from 'events/types';
import { FPS, TILE_SIZE } from 'constants/dimensions/game'
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

        if (terrain && player) {
          player.getSprite().setCollideWorldBounds(true)
          player.getSprite().setCircle(TILE_SIZE / 2)

          map.setCollisionByProperty({ collide: true }, true, true, terrain)
          scene.physics.add.collider(player.getSprite(), terrain)

          if (npcs) {
            npcs.forEach(npc => scene.physics.add.collider(player.getSprite(), npc.getSprite()))
          }

          if (enemies) {
            enemies.forEach(enemy => scene.physics.add.collider(player.getSprite(), enemy.getSprite()))
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