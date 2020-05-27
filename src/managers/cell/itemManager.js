import { ITEM_TILE_KEY, ITEM_LAYER_KEY } from "constants/keys"
import { BYPASS_LAYER } from "constants/layers"

import { E_LOAD_NON_COLLISION_ITEM_DATA, E_INTERACT, E_INIT_TILEMAP, E_ADD_TO_INVENTORY, E_SET_TILE, E_SET_NONCOLLISION_TILE } from "events/types"

import handler from "events/handler"

function initBypassLayer(map) {
  cellMap = map

  bypassItemSet = map.addTilesetImage(ITEM_TILE_KEY)
  bypassItemLayer = map.createDynamicLayer(BYPASS_LAYER, bypassItemSet)

  map.setLayer(bypassItemLayer)

  pickedData = map.filterTiles(t => t.properties.picked)
      .reduce((acc, t) => ({ ...acc, [t.properties.key]: t.index}), {})
  freshData = map.filterTiles(t => !t.properties.picked)
      .reduce((acc, t) => ({ ...acc, [t.properties.key]: t.index}), {})
}

function loadBypassItems(itemData) {
  bypassData = itemData
}

function interact(pos) {
  if (!bypassItemLayer) return
  var tile = bypassItemLayer.getTileAtWorldXY(pos.x, pos.y)
  if (tile) {
    var key = tile.properties.key
    if (!tile.properties.picked) {
      var tx = tile.x
      var ty = tile.y
      tile.tilemap.fill(pickedData[key], tx, ty, 1, 1)

      manager.emit(E_ADD_TO_INVENTORY, bypassData[key])
    }
  }
}

function setTile(to) {
  if (!bypassItemLayer) return
  var tx = +to.x
  var ty = +to.y
  var tw = +to.width
  var th = +to.height

  // currently doesn't load correct tile properties
  bypassItemLayer.fill(freshData[to.key], tx, ty, tw || 1, th || 1)
  scene.sys.animatedTiles.init(cellMap)
}

var manager
var scene 
var cellMap
var bypassData
var bypassItemSet
var bypassItemLayer
var pickedData 
var freshData

function ItemManager() {
  if (!manager) {
    manager = {
      ...handler,
      init(newScene) {
        scene = newScene
      },
    }

    manager.on({
      [E_INTERACT]: interact,
      [E_INIT_TILEMAP]: initBypassLayer,
      [E_LOAD_NON_COLLISION_ITEM_DATA]: loadBypassItems,
      [E_SET_NONCOLLISION_TILE]: setTile,
    })
  }
  return manager
}

export default ItemManager