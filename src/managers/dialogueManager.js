import * as Phaser from 'phaser'

import { UNIVERSAL_TOPICS } from 'constants/dialogue'
import { BOX_X, BOX_STARTING_Y, BOX_WIDTH, BOX_HEIGHT, BOX_JUMP, TOPIC_X, TOPIC_Y, LINE_OFFSET, LINE_COUNT, CHAR_COUNT, TEXT_X, TEXT_Y } from 'constants/dimensions/dialogue'
import { TILE_SIZE, ZOOM_FACTOR } from 'constants/dimensions/game'
import { NAME_X, NAME_Y, BOX_HIGHLIGHTED_THICKNESS, BOX_HIGHLIGHTED_COLOR, BOX_FADED_THICKNESS, BOX_FADED_COLOR } from 'constants/dimensions/menu'
import { DIALOGUE_KEY, TITLE_FONT_KEY, MENU_FONT_KEY, MENU_LAYER_KEY, MENU_TILE_KEY } from 'constants/keys'
import { E_SET_DIALOGUE, E_DIALOGUE_SELECT, E_DIALOGUE_BACK, E_START_SCROLL_DIALOGUE_UP, E_STOP_SCROLL_DIALOGUE_UP, E_START_SCROLL_DIALOGUE_DOWN, E_STOP_SCROLL_DIALOGUE_DOWN, E_CLOSE_DIALOGUE, E_LOAD_DIALOGUE_DATA } from 'events/types'

import handler from 'events/handler'

function select() {
  if (inTopics && topicIndex >= 0) {
    drawSelectionBox(BOX_FADED_THICKNESS, BOX_FADED_COLOR)

    inTopics = false
    topic = unlockedTopics[topicIndex]

    var universalTopic = UNIVERSAL_TOPICS.find(t => t === topic)
    if (universalTopic) {
      text = split(npc.dialogue[universalTopic])
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
    closeDialogue()
  } else {
    textIndex = 0
    inTopics = true
    drawSelectionBox(BOX_HIGHLIGHTED_THICKNESS, BOX_HIGHLIGHTED_COLOR)
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
    if (textIndex < text.length - LINE_COUNT) {
      textIndex += LINE_COUNT 
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
      textIndex -= LINE_COUNT
    }
    renderText()
  }
}

function stopScrollDown() {
  // no-op
}

function stopScrollUp() {
  // no-op
}

function drawSelectionBox(thickness, color) {
  graphics.clear()
  graphics.lineStyle(thickness, color)
  graphics.strokeRectShape(highlight)
}

function closeDialogue() {
  topicBitmaps.forEach(bm => bm.destroy())
  graphics.clear()
  topicIndex = -1
  manager.emit(E_CLOSE_DIALOGUE)
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
    if (length + diff > CHAR_COUNT) {
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

function renderPanel() {
  name = npc.name

  tilemap = scene.make.tilemap({
    key: DIALOGUE_KEY,
    tileWidth: TILE_SIZE, 
    tileHeight: TILE_SIZE
  })

  panel = tilemap.createStaticLayer(MENU_LAYER_KEY, tilemap.addTilesetImage(MENU_TILE_KEY))

  panel.setScale(ZOOM_FACTOR)

  graphics = scene.add.graphics()
  highlight = new Phaser.Geom.Rectangle(BOX_X, BOX_STARTING_Y, BOX_WIDTH, BOX_HEIGHT)

  scene.add.bitmapText(NAME_X, NAME_Y, TITLE_FONT_KEY, name)
}

function renderTopics() {
  var normalizedIndex = (topicIndex < 0 ? 0 : topicIndex)
  var topicSectionIndex = Math.floor(normalizedIndex / LINE_COUNT) * LINE_COUNT
  var highlightIndex = normalizedIndex % LINE_COUNT

  if (topicIndex >= 0) {
    topicBitmaps.forEach(bm => bm.destroy())
    topicBitmaps = []
    highlight.setTo(BOX_X, BOX_STARTING_Y + (highlightIndex * BOX_JUMP), BOX_WIDTH, BOX_HEIGHT)
    drawSelectionBox(BOX_HIGHLIGHTED_THICKNESS, BOX_HIGHLIGHTED_COLOR)
  }

  for (var i = 0; i < LINE_COUNT; i++) {
    topicBitmaps.push(
      scene.add.bitmapText(TOPIC_X, TOPIC_Y + (i * LINE_OFFSET), MENU_FONT_KEY, unlockedTopics[topicSectionIndex + i]))
  }
}

function renderText() {
  textBitmaps.forEach(bm => bm.destroy())
  textBitmaps = []
  
  for (var i = 0; i < LINE_COUNT; i++) {
    textBitmaps.push(
      scene.add.bitmapText(TEXT_X, TEXT_Y + (i * LINE_OFFSET), MENU_FONT_KEY, text[textIndex + i]))
  }
}

function loadAndRenderTopics() {
  topics = npc.dialogue.topics
  topics.forEach(t => topicLocks[t] = data.topics[t].locked)
  unlockedTopics = UNIVERSAL_TOPICS.concat(topics.filter(t => !topicLocks[t]))
  renderTopics()
}

function loadAndRenderText(newText) {
  text = split(newText)
  renderText()
}

function setData(dialogueData) {
  data = dialogueData
}

function setTarget(targetNPC) {
  npc = targetNPC
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

        renderPanel()
        loadAndRenderTopics()
        loadAndRenderText(npc.dialogue.greeting)
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