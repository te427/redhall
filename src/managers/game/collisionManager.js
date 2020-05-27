import { E_INIT_TERRAIN, E_INIT_NPCS, E_INIT_PLAYER, E_INIT_TILEMAP } from 'events/types';
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

function setMapCollision(newMap) {
  map = newMap
}

var manager
var map
var player
var npcs
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

          npcs.forEach(npc => scene.physics.add.collider(player, npc))
        }
      }
    }

    manager.on({
      [E_INIT_TILEMAP]: setMapCollision,
      [E_INIT_TERRAIN]: setTerrain,
      [E_INIT_NPCS]: setNPCs,
      [E_INIT_PLAYER]: setPlayer
    })
  }
  return manager
}

export default CollisionManager