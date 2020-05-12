import Sprite from 'objects/sprite'

class NPC extends Sprite {
  // TODO: make a class that can build npc's out of JSON data and manage their own state
  constructor(scene, char) {
    super()
    // get this from JSON
    this.sprite = scene.physics.add.sprite(24 * 16, 20 * 16, 'dwarf')
    this.sprite.setImmovable(true)


    this.initState(char)
    this.initAnims(scene)
    this.initSfx(scene)
  }

  initState(char) {
    this.char = char
  }

  initAnims(scene) {
    this.anims.stand = scene.anims.create({
      key: 'stand',
      repeat: -1,
      frameRate: 2,
      frames: scene.anims.generateFrameNames('dwarf', {start: 0, end: 1}) 
    })

    this.sprite.play('stand')
  }

  initSfx(scene) {
    this.sfx.talk = scene.sound.add('dwarf')

    this.sfx.talk.addMarker({
      name: 'talk',
      start: 0,
      duration: 2,
      config: {
        volume: 0.5,
        loop: false 
      }
    })
  }

  getName() {
    return this.char.name
  }

  getDialogue() {
    return this.char.dialogue
  }

  interact() {
    this.sfx.talk.play('talk')
  }
}

export default NPC