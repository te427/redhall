import * as Phaser from 'phaser'
import { SCENE_DIALOGUE } from 'constants/scenes'

class DialogueScene extends Phaser.Scene {
  constructor() {
    super(SCENE_DIALOGUE)
  }

  create() {
    this.physics.add.sprite(8 * 16, (9 * 16) + 8, 'menu')
    var line = 'What\'s a dwarf to do with a rock in his shoe, a knot in his beard and some cold turnip stew?'

    this.add.bitmapText(16, 8 * 16, 'pressstart8', this.split(line))
  }

  split(text) {
    var words = text.split(' ')
    var fit = ''
    var index = 0
    var length = 0
    while (index < words.length) {
      var word = words[index++]
      length += word.length + 1
      if (length > 30) {
        fit += '\n\n'
        length = 0
      }
      fit += word + ' '
    }
    return fit
  }
}

export default DialogueScene