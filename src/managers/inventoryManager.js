import { TILE_SIZE, ZOOM_FACTOR } from "constants/dimensions/game"
import { NAME_X, NAME_Y, BOX_HIGHLIGHTED_THICKNESS, BOX_HIGHLIGHTED_COLOR, BOX_FADED_THICKNESS, BOX_FADED_COLOR } from 'constants/dimensions/menu'
import { ITEM_START_X, ITEM_X_OFFSET, ITEM_START_Y, ITEM_Y_OFFSET, COUNT_X_OFFSET, COUNT_Y_OFFSET, TYPE_X, TYPE_START_Y, TYPE_Y_OFFSET, BOX_X, BOX_STARTING_Y, BOX_WIDTH, BOX_HEIGHT, BOX_JUMP } from "constants/dimensions/inventory"
import { INVENTORY_TITLE, INVENTORY_MAX_ROW_LENGTH, INVENTORY_MAX_COL_LENGTH } from "constants/inventory"
import { INVENTORY_KEY, MENU_LAYER_KEY, MENU_TILE_KEY, TITLE_FONT_KEY, INGREDIENTS_SPRITE_KEY, MENU_FONT_KEY } from "constants/keys"
import { E_ADD_TO_INVENTORY, E_NAV_DOWN, E_NAV_UP, E_NAV_LEFT, E_NAV_RIGHT } from "events/types"

import handler from "events/handler"

function drawSelectionBox(thickness, color) {
  graphics.clear()
  graphics.lineStyle(thickness, color)
  graphics.strokeRectShape(selectionBox)
}

function renderPanel() {
  tilemap = scene.make.tilemap({
    key: INVENTORY_KEY,
    tileWidth: TILE_SIZE, 
    tileHeight: TILE_SIZE
  })

  panel = tilemap.createStaticLayer(MENU_LAYER_KEY, tilemap.addTilesetImage(MENU_TILE_KEY))
  panel.setScale(ZOOM_FACTOR)

  graphics = scene.add.graphics()
  selectionBox = new Phaser.Geom.Rectangle(BOX_X, BOX_STARTING_Y, BOX_WIDTH, BOX_HEIGHT)

  scene.add.bitmapText(NAME_X, NAME_Y, TITLE_FONT_KEY, INVENTORY_TITLE)
}

function renderTypes() {
  var inventoryTypes = Object.keys(inventory)
  if (!inventoryTypes.length) {
    selectedType = null
  }

  inventoryTypes.forEach(function(type, i) {
    if (!selectedType) {
      selectedType = type
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
  Object.values(inventory[selectedType]).forEach(function(i) {
    if (y === INVENTORY_MAX_COL_LENGTH) return

    var xOffset = ITEM_START_X + (x * ITEM_X_OFFSET)
    var yOffset = ITEM_START_Y + (y * ITEM_Y_OFFSET)

    var sprite = scene.add.image(xOffset, yOffset, INGREDIENTS_SPRITE_KEY, i.item.sprites.inventory)
    sprite.setScale(ZOOM_FACTOR)
    sprites.push(sprite)

    var count = scene.add.bitmapText(xOffset + COUNT_X_OFFSET, yOffset + COUNT_Y_OFFSET, MENU_FONT_KEY, i.count)
    counts.push(count)

    x++ 
    if (x === INVENTORY_MAX_ROW_LENGTH) {
      x = 0
      y++
    }
  })
}


function renderSelection() {
  graphics.clear()
  var i = Object.keys(inventory).indexOf(selectedType)
  if (i < 0) {
    return
  } else {
    selectionBox.setTo(BOX_X, BOX_STARTING_Y + (i * BOX_JUMP), BOX_WIDTH, BOX_HEIGHT)
    drawSelectionBox(BOX_HIGHLIGHTED_THICKNESS, BOX_HIGHLIGHTED_COLOR)
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
}

function navDown() {

}

function navUp() {

}

function navLeft() {

}

function navRight() {

}

var manager
var scene
var inventory = {}
var selectedType
var tilemap
var panel
var graphics
var selectionBox
var sprites = []
var types = []
var counts = []
var inTypes = true

function InventoryManager() {
  if (!manager) {
    manager = {
      ...handler,
      init(newScene) {
        scene = newScene

        renderPanel()
        renderTypes()
        renderSelection()
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