import { MENU_FONT, TITLE_FONT, DIALOGUE_KEY, MENU_TILE_KEY, TILE_SIZE, MENU_LAYER_KEY } from 'constants/cfg'
import { E_SET_DIALOGUE } from 'events/types'
import handler from 'events/handler'

function split(text) {
  var words = text.split(' ')
  var fit = ''
  var index = 0
  var length = 0
  while (index < words.length) {
    var word = words[index++]
    length += word.length + 1
    if (length > 32) {
      fit += '\n\n'
      length = 0
    }
    fit += word + ' '
  }
  return fit
}

function setTarget(targetNPC) {
  npc = targetNPC
}


function loadPanel() {
  name = npc.name

  //panel = scene.physics.add.sprite(32 * 16, 37 * 16, 'menu')
  //panel.setScale(4) 
  tilemap = scene.make.tilemap({
    key: DIALOGUE_KEY,
    tileWidth: TILE_SIZE, 
    tileHeight: TILE_SIZE
  })

  panel = tilemap.createStaticLayer(MENU_LAYER_KEY, tilemap.addTilesetImage(MENU_TILE_KEY))

  panel.setScale(4)
  panel.setY(24 * 16)

  scene.add.bitmapText(2 * 16, 25.25 * 16, TITLE_FONT, name)
}

function loadTopic(newTopic) {
  topic = newTopic
  scene.add.bitmapText(27.5 * 16, 30 * 16, MENU_FONT, split(topic))
}

var manager
var npc 
var name
var scene
var topic
var tilemap
var panel

function DialogueManager() {
  if (!manager) {
    manager = {
      ...handler,
      init(newScene) {
        scene = newScene

        loadPanel()
        loadTopic(npc.dialogue.greeting)
      },
    }
  }

  manager.on(E_SET_DIALOGUE, setTarget)

  return manager
}

export default DialogueManager