import { TILE_SIZE } from 'constants/cfg'

function NPC(scene, data) {
  // get this from JSON
  var npc = {
    initSprite(scene, npcData) {
      // Check if this width/height box is correct
      this.sprite = scene.physics.add.sprite(npcData.x * TILE_SIZE, npcData.y * TILE_SIZE, npcData.name)
      this.sprite.setImmovable(true)
    },
    initState(npcData) {
      this.npc = npcData
    },
    initAnims(scene) {
      this.anims = {}

      this.anims.stand = scene.anims.create({
        key: 'stand',
        repeat: -1,
        frameRate: 2,
        frames: scene.anims.generateFrameNames(this.npc.sprite, {start: 0, end: 1}) 
      })

      this.sprite.play('stand')
    },
    initSfx(scene) {
      this.sfx = {} 

      this.sfx.talk = scene.sound.add(this.npc.sfx.talk)

      this.sfx.talk.addMarker({
        name: 'talk',
        start: 0,
        duration: 2,
        config: {
          volume: 0.5,
          loop: false 
        }
      })
    },
    getNPC() {
      return this.npc
    },
    interact() {
      this.sfx.talk.play('talk')
    }
  }

  npc.initSprite(scene, data)
  npc.initState(data)
  npc.initAnims(scene)
  npc.initSfx(scene)

  return npc
}

export default NPC