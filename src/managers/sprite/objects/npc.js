import { TILE_SIZE } from 'constants/dimensions/game'

import { npcSpriteKey, npcSFXKey } from 'helpers/keys'
import { CHARACTER_SPRITE_DEPTH } from 'constants/depth'

var data
var sprite
var anims
var sfx

function NPC(scene, npcData) {
  // get this from JSON
  var npc = {
    initSprite(scene, npcData) {
      // Check if this width/height box is correct
      sprite = scene.physics.add.sprite(npcData.x * TILE_SIZE, npcData.y * TILE_SIZE, npcData.name)
      sprite.body.setSize(16, 16)
      sprite.body.setOffset(0, 0)
      sprite.setImmovable(true)
      sprite.depth = CHARACTER_SPRITE_DEPTH 
      sprite.setOrigin(0, 0)
    },
    initState(npcData) {
      data = npcData
    },
    initAnims(scene) {
      anims = {}

      anims.stand = scene.anims.create({
        key: 'stand',
        repeat: -1,
        frameRate: 2,
        frames: scene.anims.generateFrameNames(npcSpriteKey(data, data.sprite), {start: 0, end: 1}) 
      })

      sprite.play('stand')
    },
    initSfx(scene) {
      sfx = {} 

      sfx.talk = scene.sound.add(npcSFXKey(data, data.sfx.talk))

      sfx.talk.addMarker({
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
      return data
    },
    getSprite() {
      return sprite
    },
    getBounds() {
      return sprite.getBounds()
    },
    interact() {
      sfx.talk.play('talk')
    }
  }

  npc.initSprite(scene, npcData)
  npc.initState(npcData)
  npc.initAnims(scene)
  npc.initSfx(scene)

  return npc
}

export default NPC