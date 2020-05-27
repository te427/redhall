import { E_INIT_TERRAIN, E_INIT_NPCS, E_INIT_PLAYER } from 'events/types';
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

var manager
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
          // should only set these for the tiles used
          // should make sure gids line up
          terrain.setCollisionBetween(15, 30);

          player.setCollideWorldBounds(true)
          scene.physics.add.collider(player, terrain)

          npcs.forEach(npc => scene.physics.add.collider(player, npc))
        }
      }
    }

    manager.on({
      [E_INIT_TERRAIN]: setTerrain,
      [E_INIT_NPCS]: setNPCs,
      [E_INIT_PLAYER]: setPlayer
    })
  }
  return manager
}

export default CollisionManager