import { TILE_SIZE, ZOOM_FACTOR } from "constants/dimensions/game"
import { NAME_X, NAME_Y, BOX_HIGHLIGHTED_THICKNESS, BOX_HIGHLIGHTED_COLOR, BOX_FADED_THICKNESS, BOX_FADED_COLOR } from 'constants/dimensions/menu'
import { ITEM_START_X, ITEM_X_OFFSET, ITEM_START_Y, ITEM_Y_OFFSET, COUNT_X_OFFSET, COUNT_Y_OFFSET, TYPE_X, TYPE_START_Y, TYPE_Y_OFFSET, TYPE_BOX_X, TYPE_BOX_STARTING_Y, TYPE_BOX_WIDTH, TYPE_BOX_HEIGHT, TYPE_BOX_JUMP, ITEM_BOX_X as ITEM_BOX_STARTING_X, ITEM_BOX_STARTING_Y, ITEM_BOX_JUMP, ITEM_BOX_WIDTH, ITEM_BOX_HEIGHT, COUNT_DIGIT_OFFSET } from "constants/dimensions/inventory"
import { INVENTORY_TITLE, INVENTORY_MAX_ROW_LENGTH, INVENTORY_MAX_COL_LENGTH, TYPES } from "managers/menu/constants/inventory"
import { INVENTORY_KEY, MENU_LAYER_KEY, MENU_TILE_KEY, TITLE_FONT_KEY, INGREDIENTS_SPRITE_KEY, MENU_FONT_KEY } from "constants/keys"
import { E_ADD_TO_INVENTORY, E_NAV_DOWN, E_NAV_UP, E_NAV_LEFT, E_NAV_RIGHT } from "events/types"

import handler from "events/handler"
import notify from "notifications/notify"

function drawTypeSelectionBox(thickness, color) {
  typeGraphics.clear()
  typeGraphics.lineStyle(thickness, color)
  typeGraphics.strokeRectShape(typeSelectionBox)
}

function drawItemSelectionBox(thickness, color) {
  itemGraphics.clear()
  itemGraphics.lineStyle(thickness, color)
  itemGraphics.strokeRectShape(itemSelectionBox)
}

function renderPanel() {
  tilemap = scene.make.tilemap({
    key: INVENTORY_KEY,
    tileWidth: TILE_SIZE, 
    tileHeight: TILE_SIZE
  })

  panel = tilemap.createStaticLayer(MENU_LAYER_KEY, tilemap.addTilesetImage(MENU_TILE_KEY))
  panel.setScale(ZOOM_FACTOR)

  typeGraphics = scene.add.graphics()
  typeSelectionBox = new Phaser.Geom.Rectangle(TYPE_BOX_X, TYPE_BOX_STARTING_Y, TYPE_BOX_WIDTH, TYPE_BOX_HEIGHT)

  itemGraphics = scene.add.graphics()
  itemSelectionBox = new Phaser.Geom.Rectangle(ITEM_BOX_STARTING_X, ITEM_BOX_STARTING_Y, ITEM_BOX_WIDTH, ITEM_BOX_HEIGHT)

  scene.add.bitmapText(NAME_X, NAME_Y, TITLE_FONT_KEY, INVENTORY_TITLE)
}

function renderTypes() {
  var inventoryTypes = Object.keys(inventory)
  if (!inventoryTypes.length) {
    selectedType = null
    return
  }

  inventoryTypes.forEach(function(type, i) {
    if (!selectedType) {
      selectedType = type
      typeIndex = i
    }

    var type = scene.add.bitmapText(TYPE_X, TYPE_START_Y + (i * TYPE_Y_OFFSET),
        MENU_FONT_KEY, type.charAt(0).toUpperCase() + type.slice(1))
    types.push(type)
  })
}

function renderItems() {
  var x = 0
  var y = 0

  if (!selectedType) {
    return
  }

  itemsMap = [[]]
  itemsLength = 0

  Object.values(inventory[selectedType]).forEach(function (i) {
    if (!x && !y) {
      selectedItem = i
      itemXIndex = x
      itemYIndex = y
    }

    var xOffset = ITEM_START_X + (x * ITEM_X_OFFSET)
    var yOffset = ITEM_START_Y + (y * ITEM_Y_OFFSET)

    var sprite = scene.add.image(xOffset, yOffset, INGREDIENTS_SPRITE_KEY, i.item.sprites.inventory)
    sprite.setScale(ZOOM_FACTOR)
    sprites.push(sprite)

    var digits = ('' + i.count).length

    var count = scene.add.bitmapText(
        xOffset + COUNT_X_OFFSET - ((digits - 1) * COUNT_DIGIT_OFFSET),
        yOffset + COUNT_Y_OFFSET, MENU_FONT_KEY, i.count)
    counts.push(count)

    itemsMap[y][x] = i
    itemsLength++

    x++ 
    if (x === INVENTORY_MAX_ROW_LENGTH) {
      x = 0
      y++
      if (y === INVENTORY_MAX_COL_LENGTH) return
      itemsMap[y] = []
    }
  })
}


function renderTypeSelection() {
  typeGraphics.clear()

  if (typeIndex < 0) return

  typeSelectionBox.setTo(TYPE_BOX_X, TYPE_BOX_STARTING_Y + (typeIndex * TYPE_BOX_JUMP),
      TYPE_BOX_WIDTH, TYPE_BOX_HEIGHT)

  drawTypeSelectionBox(
    inTypes ? BOX_HIGHLIGHTED_THICKNESS : BOX_FADED_THICKNESS,
    inTypes ? BOX_HIGHLIGHTED_COLOR : BOX_FADED_COLOR)
}

function renderItemSelection() {
  itemGraphics.clear()

  itemSelectionBox.setTo(ITEM_BOX_STARTING_X + (itemXIndex * ITEM_BOX_JUMP),
      ITEM_BOX_STARTING_Y + (itemYIndex * ITEM_BOX_JUMP),
      ITEM_BOX_WIDTH, ITEM_BOX_HEIGHT)

  if (!inTypes) {
    drawItemSelectionBox(BOX_HIGHLIGHTED_THICKNESS, BOX_HIGHLIGHTED_COLOR)
  }
}

function addToInventory(item) {
  var type = item.type
  var name = item.name

  if (inventory[type] && inventory[type][name]) {
    inventory[type][name].count++
  } else {
    if (!inventory[type]) {
      inventory[type] = {}
    }

    inventory[type][name] = { count: 1, item }
  }

  manager.notify(`Added ${name} to inventory!`)
}

function navDown() {
  if (!selectedType) return;
  if (inTypes) {
    var invTypes = Object.keys(inventory)
    var types = TYPES.filter(t => invTypes.find(type => type === t))

    if (typeIndex < types.length - 1) {
      itemXIndex = 0
      itemYIndex = 0
      typeIndex++

      selectedType = types[typeIndex]

      renderTypeSelection()
      renderItems() 
    } else {
      if ((INVENTORY_MAX_ROW_LENGTH * (itemYIndex + 1)) + itemXIndex < itemsLength &&
          itemYIndex < INVENTORY_MAX_COL_LENGTH- 1) {
        // add scroll down in case of col max
        itemYIndex++
        renderItemSelection()
      }
    }
  }
}

function navUp() {
  if (!selectedType) return;
  if (inTypes) {
    var invTypes = Object.keys(inventory)
    var types = TYPES.filter(t => invTypes.find(type => type === t))

    if (typeIndex > 0) {
      itemXIndex = 0
      itemYIndex = 0
      typeIndex++

      selectedType = types[typeIndex]

      renderTypeSelection()
      renderItems() 
    }
  } else {
    if (itemYIndex > 0) {
      // add scroll up in case of 0 pos 
      itemYIndex--
      renderItemSelection()
    }
  }
}

function navLeft() {
  if (!selectedType) return;
  if (!inTypes && !itemXIndex) {
    inTypes = true
    renderTypeSelection()
  } else if (itemXIndex > 0) {
    itemXIndex--
    selectedItem = itemsMap[itemYIndex][itemXIndex]
  }
  renderItemSelection()
}

function navRight() {
  var a = itemsLength % INVENTORY_MAX_ROW_LENGTH > (itemXIndex + 1)
  var b = INVENTORY_MAX_ROW_LENGTH > (itemXIndex + 1)
  if (!selectedType) return;
  if (inTypes) {
    inTypes = false
    renderTypeSelection()
  } else if (a && b) {
    itemXIndex++
    selectedItem = itemsMap[itemYIndex][itemXIndex]
  }
  renderItemSelection()
}

var manager
var scene
var inventory = {}
var tilemap
var panel
var selectedType
var typeGraphics
var typeSelectionBox
var typeIndex = -1
var inTypes = true
var itemGraphics
var itemSelectionBox
var itemXIndex = -1
var itemYIndex = -1
var itemsMap
var itemsLength
var selectedItem
var sprites = []
var types = []
var counts = []

function InventoryManager() {
  if (!manager) {
    manager = {
      ...notify,
      ...handler,
      init(newScene) {
        scene = newScene

        renderPanel()
        renderTypes()
        renderTypeSelection()
        renderItems()
      }
    }

    manager.on({
      [E_ADD_TO_INVENTORY]: addToInventory,
      [E_NAV_DOWN]: navDown,
      [E_NAV_UP]: navUp,
      [E_NAV_LEFT]: navLeft,
      [E_NAV_RIGHT]: navRight,
    })
  }
  return manager
}

export default InventoryManager