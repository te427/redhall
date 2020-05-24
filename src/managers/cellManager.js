import { TILE_SIZE } from 'constants/dimensions/game'
import { STARTING_CELL, STARTING_ENTRANCE } from 'constants/game'
import { WORLD_TILE_KEY, WORLD_LAYER_KEY } from 'constants/keys'
import { E_INIT_SPAWN, E_SET_CELL, E_LOAD_CELL_DATA, E_INIT_TERRAIN, E_CHANGE_SCENE, E_INIT_TILEMAP } from 'events/types'

import handler from 'events/handler'
import { mapKey } from 'helpers/keys'

function setEntrance(name) {
  entrance = name
}

function setCell(newCell) {
  name = newCell
}

function initWorld() {
  cellMap = scene.make.tilemap({
    key: mapKey(name), 
    tileWidth: TILE_SIZE, 
    tileHeight: TILE_SIZE
  })
}

function initTerrain() {
  terrainSet = cellMap.addTilesetImage(WORLD_TILE_KEY)
  terrainLayer = cellMap.createStaticLayer(WORLD_LAYER_KEY, terrainSet)

  data.exits.forEach(function(tile) {
    terrainLayer.setTileLocationCallback(tile.x, tile.y, 1, 1, () => moveToCell(tile.name))
  })

  manager.emit(E_INIT_TERRAIN, terrainLayer)

  // we can add other layers once the initial has been added
  manager.emit(E_INIT_TILEMAP, cellMap)
}

function initBounds() {
  scene.physics.world.setBounds(0, 0, data.dimensions.x * TILE_SIZE, data.dimensions.y * TILE_SIZE)
  scene.cameras.main.setBounds(0, 0, data.dimensions.x * TILE_SIZE, data.dimensions.y * TILE_SIZE)
}

function initSpawn() {
  var spawn = data.entrances.find(e => e.name === entrance)
  manager.emit(E_INIT_SPAWN, spawn)
}

function renderCell() {
  initWorld()
  initTerrain()
  initBounds()
  initSpawn()
}

function setCellData(cellData) {
  data = cellData
}

function moveToCell(newCell) {
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
var cellMap
var terrainSet
var terrainLayer

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
        if (cellMap) {
          cellMap.destroy()
        }

        if (terrainLayer) {
          terrainLayer.destroy()
        }
      }
    }

    manager.on({
      [E_LOAD_CELL_DATA]: setCellData,
    })

    setCell(STARTING_CELL)
    setEntrance(STARTING_ENTRANCE)
  }

  return manager
}

export default CellManager