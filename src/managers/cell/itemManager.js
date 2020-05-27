import { ITEM_TILE_KEY, ITEM_LAYER_KEY } from "constants/keys"
import { E_LOAD_NON_COLLISION_ITEM_DATA, E_INTERACT, E_INIT_TILEMAP, E_ADD_TO_INVENTORY, E_SET_TILE, E_SET_NONCOLLISION_TILE } from "events/types"

import handler from "events/handler"

function initNonCollisionItems(cellMap) {
  nonCollisionItemSet = cellMap.addTilesetImage(ITEM_TILE_KEY)
  nonCollisionItemLayer = cellMap.createDynamicLayer(ITEM_LAYER_KEY, nonCollisionItemSet)
}

function interact(pos) {
  if (!nonCollisionItemLayer) return
  var tile = nonCollisionItemLayer.getTileAtWorldXY(pos.x, pos.y)
  if (tile) {
    var target = nonCollisionTileIndexMap[tile.index]
    if (target && target.sprites) {
      var tx = tile.x
      var ty = tile.y
      tile.tilemap.fill(target.sprites.empty, tx, ty, 1, 1)

      manager.emit(E_ADD_TO_INVENTORY, target)
    }
  }
}

function loadNonCollisionItems(itemData) {
  nonCollisionData = itemData

  nonCollisionTileIndexMap = nonCollisionData.reduce((acc, i) =>
      (i.sprites ? { ...acc, [i.sprites.default]: i} : acc), {})
}

function setTile(to) {
  if (!nonCollisionItemLayer) return
  var tx = +to.x
  var ty = +to.y
  var tw = +to.width
  var th = +to.height
  nonCollisionItemLayer.fill(to.i, tx, ty, tw || 1, th || 1)
}

var manager
var scene 
var nonCollisionData
var nonCollisionItemSet
var nonCollisionItemLayer
var nonCollisionTileIndexMap

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
      [E_INIT_TILEMAP]: initNonCollisionItems,
      [E_LOAD_NON_COLLISION_ITEM_DATA]: loadNonCollisionItems,
      [E_SET_NONCOLLISION_TILE]: setTile,
    })
  }
  return manager
}

export default ItemManager