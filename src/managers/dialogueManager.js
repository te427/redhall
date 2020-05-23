import * as Phaser from 'phaser'
import { MENU_FONT, TITLE_FONT, DIALOGUE_KEY, MENU_TILE_KEY, TILE_SIZE, MENU_LAYER_KEY } from 'constants/cfg'
import { E_SET_DIALOGUE, E_DIALOGUE_SELECT, E_DIALOGUE_BACK, E_START_SCROLL_DIALOGUE_UP, E_STOP_SCROLL_DIALOGUE_UP, E_START_SCROLL_DIALOGUE_DOWN, E_STOP_SCROLL_DIALOGUE_DOWN, E_CLOSE_DIALOGUE, E_LOAD_DIALOGUE_DATA } from 'events/types'
import handler from 'events/handler'

// move to cfg
const UNIVERSAL_TOPICS = ['background']

function setTarget(targetNPC) {
  npc = targetNPC
}

function select() {
  if (inTopics && topicIndex >= 0) {
    // Add background to topics
    graphics.clear()
    graphics.lineStyle(1, 0x888888)
    graphics.strokeRectShape(highlight)
    inTopics = false
    topic = unlockedTopics[topicIndex]
    if (UNIVERSAL_TOPICS.find(t => t === topic)) {
      text = split(npc.dialogue.background)
    } else {
      var options = data.topics[topic]
      var groupIntersect = npc.groups.filter(g => Object.keys(options.groups || {}).includes(g))
      if (options.people && options.people[npc.key]) {
        text = split(options.people[npc.key].text)
      } else if (options.groups && groupIntersect.length > 0) {
        text = split(options.groups[groupIntersect[0]].text)
      } else {
        text = split(options.default.text)
      }
      if (data.topics[topic].unlocks) {
        data.topics[topic].unlocks.forEach(t => topicLocks[t] = false)
        unlockedTopics = UNIVERSAL_TOPICS.concat(topics.filter(t => !topicLocks[t]))
        topicIndex = unlockedTopics.indexOf(topic)
      }
    }

    renderText()
  }
}

function back() {
  if (inTopics) {
    topicBitmaps.forEach(bm => bm.destroy())
    graphics.clear()
    topicIndex = -1
    manager.emit(E_CLOSE_DIALOGUE)
  } else {
    graphics.clear()
    graphics.lineStyle(2, 0xFFFFFF)
    graphics.strokeRectShape(highlight)
    textIndex = 0
    inTopics = true
    renderTopics()
  }
}

function startScrollDown() {
  if (inTopics) {
    if (topicIndex < unlockedTopics.length - 1) {
      topicIndex++
    }
    renderTopics()
  } else {
    if (textIndex < text.length - 6) {
      textIndex += 6
    }
    renderText()
  }
}

function startScrollUp() {
  if (inTopics) {
    if (topicIndex > 0) {
      topicIndex--
    }
    renderTopics()
  } else {
    if (textIndex > 0) {
      textIndex -= 8
    }
    renderText()
  }
}

function stopScrollDown() {

}

function stopScrollUp() {

}

function split(text) {
  var words = text.split(' ')
  var lines = []
  var line = ''
  var index = 0
  var length = 0
  while (index < words.length) {
    var word = words[index++]
    var diff = word.length + 1
    if (length + diff > 36) {
      lines.push(line)
      line = ''
      length = 0
    }
    line += word + ' '
    length += diff
  }
  lines.push(line)
  return lines 
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

  graphics = scene.add.graphics()
  highlight = new Phaser.Geom.Rectangle(1.5 * 16, (29.5 * 16) + 32, 23 * 16, 32)

  scene.add.bitmapText(2 * 16, 1.25 * 16, TITLE_FONT, name)
}

function renderTopics() {
  var normalizedIndex = (topicIndex < 0 ? 0 : topicIndex)
  var topicSectionIndex = Math.floor(normalizedIndex / 8) * 8 
  var highlightIndex = normalizedIndex % 8

  if (topicIndex >= 0) {
    topicBitmaps.forEach(bm => bm.destroy())
    topicBitmaps = []
    graphics.clear()
    highlight.setTo(1.5 * 16, (29.5 * 16) + (highlightIndex * 32), 23 * 16, 32)
    graphics.lineStyle(2, 0xFFFFFF)
    graphics.strokeRectShape(highlight)
  }

  for (var i = 0; i < 8; i++) {
    topicBitmaps.push(
      scene.add.bitmapText(2 * 16, (30 * 16) + (i * 32), MENU_FONT, unlockedTopics[topicSectionIndex + i]))
  }
}

function renderText() {
  textBitmaps.forEach(bm => bm.destroy())
  textBitmaps = []
  var hasPrev = textIndex !== 0
  var hasNext = textIndex + 8 < text.length
  
  //if (hasPrev) {
  //  textBitmaps.push(
  //    scene.add.bitmapText(27 * 16, (29 * 16), MENU_FONT, '...'))
  //}

  for (var i = 0; i < 8; i++) {
    textBitmaps.push(
      scene.add.bitmapText(27 * 16, (30 * 16) + (i * 32), MENU_FONT, text[textIndex + i]))
  }

  //if (hasNext) {
  //  textBitmaps.push(
  //    scene.add.bitmapText(27 * 16, (29 * 16) + (8 * 32), MENU_FONT, '...'))
  //}
}

function loadTopics() {
  topics = npc.dialogue.topics
  topics.forEach(t => topicLocks[t] = data.topics[t].locked)
  unlockedTopics = UNIVERSAL_TOPICS.concat(topics.filter(t => !topicLocks[t]))
  renderTopics()
}

function loadText(newText) {
  text = split(newText)
  renderText()
}

function setData(dialogueData) {
  data = dialogueData
}

var manager
var data
var npc 
var name
var scene
var graphics
var highlight
var topics
var unlockedTopics
var topic
var text 
var tilemap
var panel
var topicIndex = -1
var textIndex = 0
var topicBitmaps = []
var textBitmaps = []
var inTopics = true 
var topicLocks = {}

function DialogueManager() {
  if (!manager) {
    manager = {
      ...handler,
      init(newScene) {
        scene = newScene

        loadPanel()
        loadTopics()
        loadText(npc.dialogue.greeting)
      },
    }

    manager.on({
      [E_LOAD_DIALOGUE_DATA]: setData,
      [E_SET_DIALOGUE]: setTarget,
      [E_DIALOGUE_SELECT]: select,
      [E_DIALOGUE_BACK]: back,
      [E_START_SCROLL_DIALOGUE_UP]: startScrollUp,
      [E_START_SCROLL_DIALOGUE_DOWN]: startScrollDown,
      [E_STOP_SCROLL_DIALOGUE_UP]: stopScrollUp,
      [E_STOP_SCROLL_DIALOGUE_DOWN]: stopScrollDown,
    })
  }
  return manager
}

export default DialogueManager