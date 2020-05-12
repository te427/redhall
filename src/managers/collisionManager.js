var manager

function CollisionManager() {
  if(!manager) {
    manager = {
      init(scene, player, npcs, bg) {
        bg.setCollisionBetween(0, 14);

        player.sprite.setCollideWorldBounds(true)
        scene.physics.add.collider(player.sprite, bg)

        npcs.forEach(npc => scene.physics.add.collider(player.sprite, npc.sprite))
      }
    }
  }
  return manager
}

export default CollisionManager