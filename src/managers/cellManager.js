import { TILE_SIZE } from 'constants/dimensions/game'
import { STARTING_CELL, STARTING_ENTRANCE } from 'constants/game'
import { WORLD_TILE_KEY, ITEM_TILE_KEY, WORLD_LAYER_KEY, ITEM_LAYER_KEY } from 'constants/keys'
import { E_INTERACT, E_INIT_SPAWN, E_SET_CELL, E_LOAD_CELL_DATA, E_INIT_TERRAIN, E_CHANGE_SCENE } from 'events/types'

import handler from 'events/handler'
import { mapKey } from 'helpers/keys'

function setEntrance(name) {
  entrance = name
}

function setCell(newCell) {
  name = newCell
}

function initWorld() {
  worldMap = scene.make.tilemap({
    key: mapKey(name), 
    tileWidth: TILE_SIZE, 
    tileHeight: TILE_SIZE
  })
}

function initTerrain() {
  terrainSet = worldMap.addTilesetImage(WORLD_TILE_KEY)
  terrainLayer = worldMap.createStaticLayer(WORLD_LAYER_KEY, terrainSet)

  data.exits.forEach(function(tile) {
    terrainLayer.setTileLocationCallback(tile.x, tile.y, 1, 1, () => changeCell(tile.name))
  })

  manager.emit(E_INIT_TERRAIN, terrainLayer)
}

function initItems() {
  itemSet = worldMap.addTilesetImage(ITEM_TILE_KEY)
  itemLayer = worldMap.createDynamicLayer(ITEM_LAYER_KEY, itemSet)
}

function initBounds() {
  scene.physics.world.setBounds(0, 0, data.dimensions.x * TILE_SIZE, data.dimensions.y * TILE_SIZE)
  scene.cameras.main.setBounds(0, 0, data.dimensions.x * TILE_SIZE, data.dimensions.y * TILE_SIZE)
}

function initSpawn() {
  var spawn = data.entrances.find(e => e.name === entrance)
  manager.emit(E_INIT_SPAWN, spawn)
}

function interact(pos) {
  var tile = itemLayer.getTileAtWorldXY(pos.x, pos.y)
  if (tile) {
    var index = tile.index
    // use index in scene itemManager to see if exists (isn't used)
    var tx = tile.x
    var ty = tile.y
    tile.tilemap.fill(index + 1, tx, ty, 1, 1)
  }
}

function renderCell() {
  initWorld()
  initTerrain()
  initItems()
  initBounds()
  initSpawn()
}

function setCellData(cellData) {
  data = cellData
}

function changeCell(newCell) {
  setEntrance(name)
  setCell(newCell)
  manager.emit(E_CHANGE_SCENE, newCell)
}

function loadCell(cell) {
  manager.emit(E_SET_CELL, cell)
}

var manager
var entrance 
var name
var data
var scene
var worldMap
var terrainSet
var terrainLayer
var itemSet
var itemLayer

function CellManager() {
  if (!manager) {
    manager = {
      ...handler,
      init(newScene) {
        scene = newScene
      },
      load() {
        loadCell(name)
      },
      render() {
        renderCell()
      },
      destroy() {
        if (worldMap) {
          worldMap.destroy()
        }

        if (terrainLayer) {
          terrainLayer.destroy()
        }
      }
    }

    manager.on({
      [E_INTERACT]: interact,
      [E_LOAD_CELL_DATA]: setCellData,
    })

    setCell(STARTING_CELL)
    setEntrance(STARTING_ENTRANCE)
  }

  return manager
}

export default CellManager